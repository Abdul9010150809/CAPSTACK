import { Request, Response } from 'express';

export const getProfile = async (req: Request, res: Response) => {
  // TODO: Get user profile
  const userId = (req as any).userId; // From auth middleware
  res.json({ userId, name: 'John Doe', email: 'john@example.com' });
};

export const updateProfile = async (req: Request, res: Response) => {
  // TODO: Update user profile
  const { name, email } = req.body;
  res.json({ message: 'Profile updated' });
};