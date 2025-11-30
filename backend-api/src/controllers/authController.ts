import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
// TODO: Import user model functions

export const login = async (req: Request, res: Response) => {
  // TODO: Implement login logic
  const { email, password } = req.body;
  // Dummy check
  if (email && password) {
    const token = jwt.sign({ userId: 1 }, config.jwtSecret);
    res.json({ token });
  } else {
    res.status(400).json({ error: 'Invalid credentials' });
  }
};

export const register = async (req: Request, res: Response) => {
  // TODO: Implement registration
  const { email, password, name } = req.body;
  // Dummy response
  res.json({ message: 'User registered', userId: 1 });
};