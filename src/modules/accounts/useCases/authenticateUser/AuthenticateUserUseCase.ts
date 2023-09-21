import 'dotenv/config'
import 'reflect-metadata'
import { injectable, inject } from 'tsyringe'
import { compareSync } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import AppError from '@shared/errors/AppError'
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'

interface IRequest {
  email: string
  password: string
}

interface IResponse {
  token: string
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
        subject: user.id.toString(),
      },
    )

    const tokenReturn: IResponse = {
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    }

    return tokenReturn
  }
}
