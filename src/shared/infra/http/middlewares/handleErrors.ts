import AppError from "@shared/errors/AppError";
import { NextFunction, Request, Response } from "express";

export const handleErrors = (
  err: Error,
  request: Request,
  response: Response,
  next: NextFunction,
): Response => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({ message: err.message });
  }

  console.error(err);
  return response
    .status(500)
    .json({ message: `Internal server error - ${err.message}` });
};
