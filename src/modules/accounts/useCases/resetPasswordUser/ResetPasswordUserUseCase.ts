import 'reflect-metadata'
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository'
import { injectable, inject } from 'tsyringe'
import AppError from '@shared/errors/AppError'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'
import { hashSync } from 'bcryptjs'

interface IRequest {
  token: string
  password: string
}

interface IResponse {
  message: string
}

@injectable()
export class ResetPasswordUserUseCase {
  constructor(
    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,

    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({ token, password }: IRequest): Promise<IResponse> {
    const userToken = await this.usersTokensRepository.findByRefreshToken(token)

    if (!userToken) {
      throw new AppError('Invalid token', 409)
    }

    if (
      this.dateProvider.compareIfBefore(
        userToken.expires_date,
        this.dateProvider.dateNow(),
      )
    ) {
      throw new AppError('Token expired', 409)
    }

    const user = await this.usersRepository.findById(userToken.user_id)

    if (!user) {
      throw new AppError('User not found', 404)
    }

    const newPassword = hashSync(password, 8)

    user.password = newPassword

    await this.usersRepository.update(user)
    await this.usersTokensRepository.deleteById(userToken.id)
    return { message: 'Password changed successfully' }
  }
}
