import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  databaseUrl: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/capstack',
  jwtSecret: process.env.JWT_SECRET || 'default_secret',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  // TODO: Add more environment variables as needed
};