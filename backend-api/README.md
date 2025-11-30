# Backend API

Node.js + TypeScript + Express backend for CAPSTACK.

## Setup

1. Install dependencies: `npm install`
2. Build: `npm run build`
3. Start: `npm run start`
4. Dev mode: `npm run dev`
5. Test: `npm run test`

## Environment Variables

- `PORT`: Server port (default 3000)
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: JWT secret key
- `REDIS_URL`: Redis connection string

## API Endpoints

- `GET /health`: Health check
- `POST /auth/login`: User login
- `POST /auth/register`: User registration
- `GET /users/profile`: Get user profile
- `POST /finance/calculate`: Finance calculations
- `GET /finance/healthscore`: Get health score
- `GET /finance/survival`: Get survival months
- `POST /savings/lock`: Lock savings
- `POST /savings/unlock/:planId`: Unlock savings
- `GET /savings/status`: Get savings status

TODO: Add more endpoints and documentation.