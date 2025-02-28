import { NextFunction, Request, Response } from 'express';
import { config } from '../../../config';
import { AppError, ValidationError } from "../../../utils/errors";

/**
 * Global error handler middleware
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors = {};
  let errorDetails = undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;

    if (err instanceof ValidationError) {
      errors = err.errors;
    }
  }

  if (!config.isProduction) {
    errorDetails = err;
  }

  res.status(statusCode).json({
    message,
    errors,
    error: errorDetails,
  });
};

/**
 * Async handler to avoid try-catch blocks in controllers
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      fn(req, res, next)
    }
    catch (error) {
      next(error);
    }
  };
};