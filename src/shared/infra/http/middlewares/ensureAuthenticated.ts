/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import AppError from '@shared/errors/AppError'
import { Response, Request, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'
import { UsersTokensRepository } from '@modules/accounts/infra/typeorm/repositories/UsersTokensRepository'

export const ensureAuthenticated = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  const authorization: string | undefined = request.headers.authorization
  const usersTokensRepository = new UsersTokensRepository()

  if (!authorization) {
    throw new AppError('Token missing', 401)
  }

  const token: string = authorization.split(' ')[1]

  verify(token, process.env.REFRESH_SECRET_KEY!, (error: any, decoded: any) => {
    if (error) {
      throw new AppError('Invalid token!', 401)
    }

    response.locals = { ...response.locals, decoded }
  })

  const { sub } = response.locals.decoded
  const user_id: string = sub

  const user = await usersTokensRepository.findByUserIdAndRefreshToken(
    user_id,
    token,
  )

  if (!user) {
    throw new AppError('User does not exists!', 401)
  } else {
    request.user = {
      id: user_id,
    }
    return next()
  }
}
