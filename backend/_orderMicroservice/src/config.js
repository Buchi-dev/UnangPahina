const config = {
    PORT: 3004,
    MONGODB_URI: 'mongodb+srv://hedtjyuzon:QaigtWEHFQ8ZIwrH@unanngpahina.rfgehb6.mongodb.net/unangpahina_orders',
    RABBITMQ_URL: 'amqp://junedelmar:junedelmar@20.2.196.15:5672/',
    
    // RabbitMQ Configuration
    EXCHANGE_NAME: 'order.exchange',
    QUEUE_NAME: 'order.queue',
    
    // Routing Keys
    ROUTING_KEYS: {
        ORDER_CREATED: 'order.created',
        ORDER_STATUS_CHANGED: 'order.status.changed'
    },
    
    // Order Status
    ORDER_STATUS: {
        PENDING: 'pending',
        CONFIRMED: 'confirmed',
        COMPLETED: 'completed'
    }
};

module.exports = config; 