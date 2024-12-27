import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

// 404 Error Handler
function LostErrorHandler(req: Request, res: Response, next: NextFunction) {
  res.status(404);

  res.json({
    error: 'Resource not found',
  });
}
function AppErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Default to internal server error status
  const statusCode = err.status || 500;

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation Error',
      details: err.errors.map((error) => ({
        field: error.path.join('.'),
        message: error.message,
      })),
    });
    console.log(err.message);
    return;
  }

  // Handle authorization errors
  if (err.authorizationError === true) {
    // Sets headers available in Authorization Error object
    res.set(err.authHeaders);
  }

  // `cause` is a custom property on the error object
  const error = err?.cause || err?.message;
  const providedFeedback = err?.feedback;

  // Respond with error and conditionally include feedback if provided
  res.status(statusCode).json({
    error,
    ...(providedFeedback && { feedback: providedFeedback }),
  });
  return;
}
export { LostErrorHandler, AppErrorHandler };

export interface ApiError extends Error {
  status?: number;
}
export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(err);
  res.status(err.status || 400).json({ message: err.message });
};
