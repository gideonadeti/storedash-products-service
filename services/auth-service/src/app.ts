dotenv.config();
import express from 'express';
import routes from './routes/index';
import dotenv from 'dotenv';

const app = express();

// Middleware
app.use(express.json());
// API Routes
app.use('/auth', routes);

export default app;
