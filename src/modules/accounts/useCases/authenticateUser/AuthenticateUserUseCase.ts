import 'dotenv/config'
import 'reflect-metadata'
import { injectable, inject } from 'tsyringe'
import { compareSync } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import AppError from '@shared/errors/AppError'
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'

interface IRequest {
  email: string
  password: string
}

interface IResponse {
  token: string
  refresh_token: string
  user: {
    name: string
    email: string
  }
}

@injectable()
export class AuthenticateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,

    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new AppError('Email or password incorrect', 401)
    }

    const passwordMatch = compareSync(password, user.password)

    if (!passwordMatch) {
      throw new AppError('Email or password incorrect', 401)
    }

    const token: string = sign(
      { admin: user.isAdmin },
      process.env.SECRET_KEY!.toString(),
      {
        expiresIn: process.env.EXPIRES_IN!.toString(),
        subject: user.id,
      },
    )

    const refresh_token: string = sign(
      { email: user.email },
      process.env.REFRESH_SECRET_KEY!.toString(),
      {
        expiresIn: process.env.REFRESH_EXPIRES_IN!.toString(),
        subject: user.id,
      },
    )

    const expires_date = process.env
      .REFRESH_EXPIRES_IN!.toString()
      .replace(/[^\d]+/g, '')

    const expires_date_formatted = this.dateProvider.addDays(
      parseInt(expires_date),
    )

    await this.usersTokensRepository.create({
      user_id: user.id,
      expires_date: expires_date_formatted,
      refresh_token,
    })

    const tokenReturn: IResponse = {
      token,
      refresh_token,
      user: {
        name: user.name,
        email: user.email,
      },
    }

    return tokenReturn
  }
}
