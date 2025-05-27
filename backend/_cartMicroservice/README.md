# Cart Microservice

A simple microservice for managing shopping carts in the UnangPahina ecommerce platform.

## Features

- Add/remove items from cart
- Update item quantities
- Calculate cart total
- Basic session management

## RabbitMQ Integration

### Exchange and Queue Configuration
```typescript
const EXCHANGE_NAME = 'cart.exchange';
const QUEUE_NAME = 'cart.queue';

const ROUTING_KEYS = {
  CART_UPDATED: 'cart.updated',
  CART_CHECKED_OUT: 'cart.checked.out'
};
```

### Events
| Event | Purpose |
|-------|---------|
| CartUpdated | Notify when cart is modified |
| CartCheckedOut | Notify when cart is converted to order |

## API Endpoints

### Cart Operations
- `GET /api/cart` - Get current cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:id` - Update cart item quantity
- `DELETE /api/cart/items/:id` - Remove item from cart
- `DELETE /api/cart` - Clear cart
- `POST /api/cart/checkout` - Checkout cart

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
PORT=3003
MONGODB_URI=mongodb://localhost:27017/unangpahina_cart
RABBITMQ_URL=amqp://localhost
```

4. Start the service:
```bash
npm start
```

## Data Model

### Cart
```typescript
{
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### CartItem
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
