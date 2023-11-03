import { NextFunction, Request, Response } from 'express'
import { IRateLimiterOptions, RateLimiterMemory } from 'rate-limiter-flexible'
import AppError from '@shared/errors/AppError'

const MAX_REQUEST_LIMIT = 150
const MAX_REQUEST_WINDOW = 25 * 60

const options: IRateLimiterOptions = {
  duration: MAX_REQUEST_WINDOW,
  points: MAX_REQUEST_LIMIT,
}

const rateLimiter = new RateLimiterMemory(options)

export const rateLimiterMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  rateLimiter
    .consume(req.ip)
    .then(() => {
      next()
    })
    .catch(() => {
      throw new AppError('Too many requests', 429)
    })
}
