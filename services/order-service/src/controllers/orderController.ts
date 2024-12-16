import { Request, Response } from 'express';

export const getAllOrders = (req: Request, res: Response) => {
  res.send('Get all orders');
};

export const createOrder = (req: Request, res: Response) => {
  res.send('Create a new order');
};
