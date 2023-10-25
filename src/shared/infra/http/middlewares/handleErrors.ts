import AppError from '@shared/errors/AppError'
import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'

export const handleErrors = (
  err: Error,
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      message: err.message,
    })
  }
  if (err instanceof z.ZodError) {
    return response.status(400).json({ message: err.flatten().fieldErrors })
  }
  return response.status(500).json({
    message: `Internal server error - ${err.message}`,
  })
}
