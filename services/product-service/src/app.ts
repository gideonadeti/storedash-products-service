import express, { Request, Response, NextFunction } from 'express';

import productsRouter from './routes/products';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/products', productsRouter);

// 404 Error handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ errMsg: 'Not Found' });
});

// General Error Handler
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  res
    .status(error.status || 500)
    .json({ errMsg: error.message || 'Internal Server Error' });
});

export default app;
