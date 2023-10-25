import AppError from '@shared/errors/AppError'
import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'

export const handleErrors = (
  err: unknown,
  request: Request,
  response: Response,
  next: NextFunction,
): Response => {
  if (err instanceof AppError) {
    console.log('entrou no instanceof AppError')
    return response.status(err.statusCode).json({ message: err.message })
  }

  if (err instanceof z.ZodError) {
    return response.status(400).json({ message: err.flatten().fieldErrors })
  }

  console.error(err)

  return response
    .status(500)
    .json({ message: `Internal Server Error - ${err}.` })
}
