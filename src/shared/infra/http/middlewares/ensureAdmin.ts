import AppError from '@shared/errors/AppError'
import { UsersRepository } from '@modules/accounts/infra/typeorm/repositories/UsersRepository'
import { Response, Request, NextFunction } from 'express'

export const ensureAdmin = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  const { id } = request.user

  const usersRepository = new UsersRepository()
  const user = await usersRepository.findById(id)

  console.log('user: ', user)

  if (user.isAdmin === false) {
    console.log('jogou o erro')
    throw new AppError('Unauthorized.', 401)
  }

  return next()
}
