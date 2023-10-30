import 'reflect-metadata'
import AppError from '@shared/errors/AppError'
import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO'
import { InMemoryUsersRepository } from '@modules/accounts/repositories/in-memory/InMemoryUsersRepository'
import { CreateUserUseCase } from '../createUser/CreateUserUseCase'
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase'
import { JwtPayload, decode } from 'jsonwebtoken'
import { InMemoryUsersTokensRepository } from '@modules/accounts/repositories/in-memory/InMemoryUsersTokensRepository'
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider'

let inMemoryUsersRepository: InMemoryUsersRepository
let authenticateUserUseCase: AuthenticateUserUseCase
let createUserUseCase: CreateUserUseCase
let inMemoryUsersTokensRepository: InMemoryUsersTokensRepository
let dateProvider: DayjsDateProvider

describe('Authenticate User UseCase', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryUsersTokensRepository = new InMemoryUsersTokensRepository()
    dateProvider = new DayjsDateProvider()
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository,
      inMemoryUsersTokensRepository,
      dateProvider,
    )

    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it('should be able to authenticate an user', async () => {
    const user: ICreateUserDTO = {
      name: 'User Test',
      password: '1234',
      email: 'user@test.com',
      driver_license: '00123',
    }

    const { id, isAdmin } = await createUserUseCase.execute(user)

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    })

    expect(result).toHaveProperty('token')

    const decodedToken = decode(result.token) as JwtPayload

    expect(decodedToken).toStrictEqual(
      expect.objectContaining({
        sub: id.toString(),
        admin: isAdmin,
        exp: expect.any(Number),
        iat: expect.any(Number),
      }),
    )

    const expiration = Number(new Date(decodedToken.exp))
    const issuedAt = Number(new Date(decodedToken.iat))

    const timeStampDiff = Math.abs(expiration - issuedAt)
    const hoursDiff = timeStampDiff / 3600

    expect(hoursDiff).toStrictEqual(0.25)
  })

  it('should NOT be able to authenticate an nonexistent user', async () => {
    const result = authenticateUserUseCase.execute({
      email: 'test@mail.com',
      password: '1234',
    })

    await expect(result).rejects.toEqual(
      new AppError('Email or password incorrect', 401),
    )
  })

  it('should NOT be able to authenticate an user with wrong password', async () => {
    const user: ICreateUserDTO = {
      name: 'User Test',
      password: '1234',
      email: 'user@test.com',
      driver_license: '00123',
    }

    await createUserUseCase.execute(user)

    const result = authenticateUserUseCase.execute({
      email: user.email,
      password: '123456',
    })

    await expect(result).rejects.toEqual(
      new AppError('Email or password incorrect', 401),
    )
  })
})
