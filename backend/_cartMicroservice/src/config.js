const config = {
    PORT: 3003,
    MONGODB_URI: 'mongodb+srv://hedtjyuzon:QaigtWEHFQ8ZIwrH@unanngpahina.rfgehb6.mongodb.net/unangpahina_cart',
    RABBITMQ_URL: 'amqp://junedelmar:junedelmar@20.2.196.15:5672/',
    
    // RabbitMQ Configuration
    EXCHANGE_NAME: 'cart.exchange',
    QUEUE_NAME: 'cart.queue',
    
    // Routing Keys
    ROUTING_KEYS: {
        CART_UPDATED: 'cart.updated',
        CART_CHECKED_OUT: 'cart.checked.out'
    }
};

module.exports = config; 