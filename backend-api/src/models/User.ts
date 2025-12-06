import bcrypt from 'bcrypt';
import { query } from '../config/db';
import { logger } from '../utils/logger';

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export const createUser = async (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User | null> => {
  try {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const result = await query(`
      INSERT INTO users (email, password, name, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, name, created_at, updated_at
    `, [user.email, hashedPassword, user.name, new Date(), new Date()]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      email: row.email,
      password: '', // Don't return password
      name: row.name,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  } catch (error) {
    logger.error(`Failed to create user: ${error}`);
    return null;
  }
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const result = await query(`
      SELECT id, email, password, name, created_at, updated_at
      FROM users
      WHERE email = $1
    `, [email]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      email: row.email,
      password: row.password,
      name: row.name,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  } catch (error) {
    logger.error(`Failed to find user by email: ${error}`);
    return null;
  }
};

export const validatePassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};