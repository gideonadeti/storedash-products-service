import express from 'express';
import routes from './routes/index';
import { AppErrorHandler, LostErrorHandler } from './config/exceptionHandler';

const app = express();

// Middleware
app.use(express.json());
// API Routes
app.use('/', routes);

// Handle unregistered route for all HTTP Methods
app.all('*', function (req, res, next) {
  // Forward to next closest middleware
  next();
});
app.use(LostErrorHandler); // 404 error handler middleware
app.use(AppErrorHandler); // General app error handler

export default app;
