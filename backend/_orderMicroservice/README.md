# Order Microservice

A simple microservice for managing orders in the UnangPahina ecommerce platform.

## Features

- Create orders from cart
- Track order status
- View order history
- Basic order management

## RabbitMQ Integration

### Exchange and Queue Configuration
```typescript
const EXCHANGE_NAME = 'order.exchange';
const QUEUE_NAME = 'order.queue';

const ROUTING_KEYS = {
  ORDER_CREATED: 'order.created',
  ORDER_STATUS_CHANGED: 'order.status.changed'
};
```

### Events
| Event | Purpose |
|-------|---------|
| OrderCreated | Notify when new order is created |
| OrderStatusChanged | Notify when order status changes |

## API Endpoints

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - List user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Configure environment variables:
```
PORT=3004
MONGODB_URI=mongodb://localhost:27017/unangpahina_orders
RABBITMQ_URL=amqp://localhost
```

4. Start the service:
```bash
npm start
```

## Data Model

### Order
```typescript
{
  id: string;
  userId: string;
  status: 'pending' | 'confirmed' | 'completed';
  items: OrderItem[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### OrderItem
```typescript
{
  bookId: string;
  title: string;
  quantity: number;
  price: number;
}
```

## Dependencies

- Node.js
- Express.js
- MongoDB
- RabbitMQ
