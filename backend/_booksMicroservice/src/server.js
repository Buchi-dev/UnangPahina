const express = require('express');
const mongoose = require('mongoose');
const amqp = require('amqplib');
const cors = require('cors');
const config = require('./config');
const bookRoutes = require('./routes/bookRoutes');

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
        
        // Handle connection errors and close events
        connection.on('error', (err) => {
            console.error('RabbitMQ connection error:', err);
            global.channel = null;
            setTimeout(connectQueue, 5000); // Try to reconnect after 5 seconds
        });
        
        connection.on('close', () => {
            console.warn('RabbitMQ connection closed, attempting to reconnect...');
            global.channel = null;
            setTimeout(connectQueue, 5000); // Try to reconnect after 5 seconds
        });
        
        const channel = await connection.createChannel();
        await channel.assertExchange(config.EXCHANGE_NAME, 'direct', { durable: false });
        
        channel.on('error', (err) => {
            console.error('RabbitMQ channel error:', err);
            global.channel = null;
        });
        
        channel.on('close', () => {
            console.warn('RabbitMQ channel closed');
            global.channel = null;
        });
        
        // Make channel globally available
        global.channel = channel;
        
        console.log('Connected to RabbitMQ');
        return channel;
    } catch (error) {
        console.error('RabbitMQ connection error:', error);
        global.channel = null;
        setTimeout(connectQueue, 5000); // Try to reconnect after 5 seconds
    }
}
connectQueue();

// Basic Routes
app.get('/', (req, res) => {
    res.json({ message: 'Book Microservice is running' });
});

// Book Routes
app.use('/api/books', bookRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
app.listen(config.PORT, () => {
    console.log(`Book Microservice running on port ${config.PORT}`);
}); 