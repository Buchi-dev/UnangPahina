const express = require('express');
const mongoose = require('mongoose');
const amqp = require('amqplib');
const cors = require('cors');
const config = require('./config');
const cartRoutes = require('./routes/cartRoutes');

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

        // Setup consumer for book updates
        const bookExchange = 'book.exchange';
        await channel.assertExchange(bookExchange, 'direct', { durable: false });
        const q = await channel.assertQueue('', { exclusive: true });
        
        // Bind to book events
        channel.bindQueue(q.queue, bookExchange, 'book.updated');
        channel.bindQueue(q.queue, bookExchange, 'book.stock.updated');

        // Consume book events
        channel.consume(q.queue, async (msg) => {
            const content = JSON.parse(msg.content.toString());
            // Handle book updates here if needed
            channel.ack(msg);
        }, { noAck: false });

        console.log('Connected to RabbitMQ');
    } catch (error) {
        console.error('RabbitMQ connection error:', error);
    }
}
connectQueue();

// Basic Routes
app.get('/', (req, res) => {
    res.json({ message: 'Cart Microservice is running' });
});

// Cart Routes
app.use('/api/cart', cartRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
app.listen(config.PORT, () => {
    console.log(`Cart Microservice running on port ${config.PORT}`);
}); 