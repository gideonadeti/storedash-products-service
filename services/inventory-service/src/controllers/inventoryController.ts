import { Request, Response } from 'express';

export const getAllProduct = (req: Request, res: Response) => {
  res.send('Get all users');
};

export const createProduct = (req: Request, res: Response) => {
  res.send('Create a new user');
};
