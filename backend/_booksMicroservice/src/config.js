const config = {
    PORT: 3008,
    MONGODB_URI: 'mongodb+srv://hedtjyuzon:QaigtWEHFQ8ZIwrH@unanngpahina.rfgehb6.mongodb.net/unangpahina_books',
    RABBITMQ_URL: 'amqp://junedelmar:junedelmar@20.2.196.15:5672/',
    
    // RabbitMQ Configuration
    EXCHANGE_NAME: 'book.exchange',
    QUEUE_NAME: 'book.queue',
    
    // Routing Keys
    ROUTING_KEYS: {
        STOCK_UPDATED: 'book.stock.updated',
        BOOK_CREATED: 'book.created',
        BOOK_UPDATED: 'book.updated'
    }
};

module.exports = config; 