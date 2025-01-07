import { Request, Response } from 'express';

export async function handleProductsGet(req: Request, res: Response) {
  res.json({ products: [{ id: 1 }, { id: 2 }, { id: 3 }] });
}
