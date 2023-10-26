import { InMemoryUsersRepository } from '@modules/accounts/repositories/in-memory/InMemoryUsersRepository'
import { CreateUserUseCase } from './CreateUserUseCase'
import AppError from '@shared/errors/AppError'

let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase

describe('Create User UseCase', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it('should be able to create a new user', async () => {
    const result = await createUserUseCase.execute({
      name: 'Victor',
      email: 'victor@example.com',
      driver_license: 'ABC-12345',
      password: '1234',
    })

    const expectedResult = {
      id: expect.any(String),
      name: 'Victor',
      email: 'victor@example.com',
      driver_license: 'ABC-12345',
      created_at: expect.any(Date),
      isAdmin: false,
      avatar: null,
      avatar_url: null,
    }

    expect(result).toStrictEqual(expectedResult)
    expect(result).not.toStrictEqual(
      expect.objectContaining({ password: expect.any(String) }),
    )
  })

  it('should NOT be able to create a user with same email', async () => {
    await createUserUseCase.execute({
      name: 'Victor 2',
      email: 'victor2@example.com',
      driver_license: 'ABC-12345',
      password: '1234',
    })

    const result = createUserUseCase.execute({
      name: 'Victor 3',
      email: 'victor2@example.com',
      driver_license: 'ABC-123',
      password: '1234',
    })

    await expect(result).rejects.toEqual(
      new AppError('User already exists.', 409),
    )
  })
})
