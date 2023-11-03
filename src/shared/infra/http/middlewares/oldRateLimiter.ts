import { NextFunction, Request, Response } from 'express'
import AppError from '@shared/errors/AppError'
import Redis from 'ioredis'
import { RateLimiterRedis, RateLimiterRes } from 'rate-limiter-flexible'

let rateLimiter: RateLimiterRedis | null = null

const redisClient = new Redis({
  port: Number(process.env.REDIS_PORT),
  host: process.env.REDIS_HOST,
})

redisClient.on('error', (error: any) => {
  console.warn('redis error', error)
})

const opts = {
  storeClient: redisClient,
  points: 3,
  duration: 20,
  execEvenly: false,
  blockDuration: 0,
  keyPrefix: 'ensrl',
}

rateLimiter = new RateLimiterRedis(opts)

export async function rateLimitMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!rateLimiter) {
    return next()
  }

  const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress

  try {
    await rateLimiter.consume(clientIP as string)
    next()
  } catch (error) {
    if (error instanceof RateLimiterRes) {
      throw new AppError('Too many requests', 429)
    } else {
      console.error('An unexpected error occurred:', error)
      next(error)
    }
  }
}
