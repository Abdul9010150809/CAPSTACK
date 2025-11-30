import { Pool } from 'pg';
import { config } from './env';

// TODO: Replace with Prisma or TypeORM client
export const db = new Pool({
  connectionString: config.databaseUrl,
});

// Example query function
export const query = async (text: string, params?: any[]) => {
  const res = await db.query(text, params);
  return res;
};