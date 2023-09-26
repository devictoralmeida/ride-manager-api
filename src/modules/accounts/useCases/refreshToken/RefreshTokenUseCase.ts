import 'dotenv/config'
import 'reflect-metadata'
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { injectable, inject } from 'tsyringe'
import { sign, verify } from 'jsonwebtoken'
import AppError from '@shared/errors/AppError'

interface IPayload {
  sub: string
  email: string
}

@injectable()
export class RefreshTokenUseCase {
  constructor(
    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,

    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,
  ) {}

  async execute(token: string): Promise<string> {
    const { sub, email } = verify(
      token,
      process.env.REFRESH_SECRET_KEY!.toString(),
    ) as IPayload

    const user_id = sub
    const userToken =
      await this.usersTokensRepository.findByUserIdAndRefreshToken(
        user_id,
        token,
      )

    if (!userToken) {
      throw new AppError('Refresh Token does not exists', 409)
    }

    await this.usersTokensRepository.deleteById(userToken.id)

    const refresh_token: string = sign(
      { email },
      process.env.REFRESH_SECRET_KEY!.toString(),
      {
        expiresIn: process.env.REFRESH_EXPIRES_IN!.toString(),
        subject: user_id,
      },
    )

    const expires_date: string = process.env
      .REFRESH_EXPIRES_IN!.toString()
      .replace(/[^\d]+/g, '')

    const expires_date_formatted: Date = this.dateProvider.addDays(
      parseInt(expires_date),
    )

    await this.usersTokensRepository.create({
      user_id,
      expires_date: expires_date_formatted,
      refresh_token,
    })

    return refresh_token
  }
}
