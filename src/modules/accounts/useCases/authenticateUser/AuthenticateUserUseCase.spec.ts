/* eslint-disable @typescript-eslint/no-non-null-assertion */
import 'reflect-metadata'
import AppError from '@shared/errors/AppError'
import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO'
import { InMemoryUsersRepository } from '@modules/accounts/repositories/in-memory/InMemoryUsersRepository'
import { CreateUserUseCase } from '../createUser/CreateUserUseCase'
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase'
import { JwtPayload, decode } from 'jsonwebtoken'

let inMemoryUsersRepository: InMemoryUsersRepository
let authenticateUserUseCase: AuthenticateUserUseCase
let createUserUseCase: CreateUserUseCase

describe('Authenticate User', () => {
  beforeAll(() => {
    process.env.SECRET_KEY = 'iabsdkjanfiasudbnaiskjomna84651365'
  })

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()

    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository,
    )

    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it('should be able to authenticate an user with a valid token', async () => {
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

    const expiration = Number(new Date(decodedToken.exp!))
    const issuedAt = Number(new Date(decodedToken.iat!))

    const timeStampDiff = Math.abs(expiration - issuedAt)
    const hoursDiff = timeStampDiff / 3600

    expect(hoursDiff).toStrictEqual(24)
  })

  it('should NOT be able to authenticate an nonexistent user', async () => {
    const result = authenticateUserUseCase.execute({
      email: 'test@mail.com',
      password: '1234',
    })

    await expect(result).rejects.toThrowError(AppError)
    await expect(result).rejects.toThrow('Email or password incorrect')
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

    await expect(result).rejects.toThrowError(AppError)
    await expect(result).rejects.toThrow('Email or password incorrect')
  })
})
