import express, { Request, Response, NextFunction } from 'express';
import morgan from "morgan";
import cors from "cors";

import productsRouter from './routes/products';

const app = express();

app.use(cors());
app.use(morgan("dev"));
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
