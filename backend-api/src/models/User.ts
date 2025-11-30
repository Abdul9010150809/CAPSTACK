// TODO: Define User model with Prisma or TypeORM
export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// Placeholder functions
export const createUser = (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
  // TODO: Implement
  return { ...user, id: 1, createdAt: new Date(), updatedAt: new Date() };
};

export const findUserByEmail = (email: string) => {
  // TODO: Implement
  return null;
};