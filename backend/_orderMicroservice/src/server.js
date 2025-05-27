const express = require('express');
const mongoose = require('mongoose');
const amqp = require('amqplib');
const cors = require('cors');
const config = require('./config');
const orderRoutes = require('./routes/orderRoutes');
const Order = require('./models/Order');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(config.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// RabbitMQ Connection
async function connectQueue() {
    try {
        const connection = await amqp.connect(config.RABBITMQ_URL);
        const channel = await connection.createChannel();
        await channel.assertExchange(config.EXCHANGE_NAME, 'direct', { durable: false });
        
        // Make channel globally available
        global.channel = channel;

        // Setup consumer for cart checkout
        const cartExchange = 'cart.exchange';
        await channel.assertExchange(cartExchange, 'direct', { durable: false });
        const q = await channel.assertQueue('', { exclusive: true });
        
        // Bind to cart checkout event
        channel.bindQueue(q.queue, cartExchange, 'cart.checked.out');

        // Consume cart checkout events
        channel.consume(q.queue, async (msg) => {
            const cart = JSON.parse(msg.content.toString());
            
            try {
                // Create order from cart
                const order = new Order({
                    userId: cart.userId,
                    items: cart.items,
                    total: cart.total,
                    status: 'pending'
                });

                await order.save();

                // Publish order created event
                channel.publish(
                    config.EXCHANGE_NAME,
                    config.ROUTING_KEYS.ORDER_CREATED,
                    Buffer.from(JSON.stringify(order))
                );

                channel.ack(msg);
            } catch (error) {
                console.error('Error processing cart checkout:', error);
                channel.nack(msg);
            }
        }, { noAck: false });

        console.log('Connected to RabbitMQ');
    } catch (error) {
        console.error('RabbitMQ connection error:', error);
    }
}
connectQueue();

// Basic Routes
app.get('/', (req, res) => {
    res.json({ message: 'Order Microservice is running' });
});

// Order Routes
app.use('/api/orders', orderRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
app.listen(config.PORT, () => {
    console.log(`Order Microservice running on port ${config.PORT}`);
}); 