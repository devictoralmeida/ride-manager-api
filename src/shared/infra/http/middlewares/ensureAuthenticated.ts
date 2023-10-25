import AppError from '@shared/errors/AppError'
import { Response, Request, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

interface IPayload {
  sub: string
}

export const ensureAuthenticated = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  const authorization: string | undefined = request.headers.authorization

  if (!authorization) {
    throw new AppError('Token missing', 401)
  }

  const token: string = authorization.split(' ')[1]

  try {
    const { sub: user_id } = verify(token, process.env.SECRET_KEY) as IPayload

    request.user = {
      id: user_id,
    }
  } catch (error) {
    throw new AppError('Invalid token', 401)
  }
  return next()
}
