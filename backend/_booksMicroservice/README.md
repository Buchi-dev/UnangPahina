# Book Microservice

A simple microservice for managing books in the UnangPahina ecommerce platform.

## Features

- Basic CRUD operations for books
- Simple inventory tracking
- Basic search functionality

## RabbitMQ Integration

### Exchange and Queue Configuration
```typescript
const EXCHANGE_NAME = 'book.exchange';
const QUEUE_NAME = 'book.queue';

const ROUTING_KEYS = {
  STOCK_UPDATED: 'book.stock.updated',
  BOOK_CREATED: 'book.created',
  BOOK_UPDATED: 'book.updated'
};
```

### Events
| Event | Purpose |
|-------|---------|
| StockUpdated | Notify when book stock changes |
| BookCreated | Notify when new book is added |
| BookUpdated | Notify when book details change |

## API Endpoints

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Create new book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book

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
PORT=3001
MONGODB_URI=mongodb://localhost:27017/unangpahina_books
RABBITMQ_URL=amqp://localhost
```

4. Start the service:
```bash
npm start
```

## Data Model

### Book
```typescript
{
  id: string;
  title: string;
  author: string;
  price: number;
  stock: number;
  description: string;
  category: string;
}
```

## Dependencies

- Node.js
- Express.js
- MongoDB
- RabbitMQ
