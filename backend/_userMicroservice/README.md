# User Microservice

A simple microservice for managing users in the UnangPahina ecommerce platform.

## Features

- User registration and login
- Basic authentication with JWT
- Simple profile management
- Basic role management (user/admin)

## RabbitMQ Integration

### Exchange and Queue Configuration
```typescript
const EXCHANGE_NAME = 'user.exchange';
const QUEUE_NAME = 'user.queue';

const ROUTING_KEYS = {
  USER_CREATED: 'user.created',
  USER_UPDATED: 'user.updated'
};
```

### Events
| Event | Purpose |
|-------|---------|
| UserCreated | Notify when new user registers |
| UserUpdated | Notify when user profile changes |

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### User Profile
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
- `GET /api/users` - List all users (admin only)

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
PORT=3002
MONGODB_URI=mongodb://localhost:27017/unangpahina_users
RABBITMQ_URL=amqp://localhost
JWT_SECRET=your_jwt_secret
JWT_EXPIRY=24h
```

4. Start the service:
```bash
npm start
```

## Data Model

### User
```typescript
{
  id: string;
  email: string;
  password: string; // hashed
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}
```

## Dependencies

- Node.js
- Express.js
- MongoDB
- RabbitMQ
- JWT
