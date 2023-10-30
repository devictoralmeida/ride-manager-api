import { InMemoryUsersRepository } from '@modules/accounts/repositories/in-memory/InMemoryUsersRepository'
import AppError from '@shared/errors/AppError'
import { ProfileUserUseCase } from './ProfileUserUseCase'
import { CreateUserUseCase } from '../createUser/CreateUserUseCase'

let inMemoryUsersRepository: InMemoryUsersRepository
let profileUserUseCase: ProfileUserUseCase
let createUserUseCase: CreateUserUseCase

describe('Profile User UseCase', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    profileUserUseCase = new ProfileUserUseCase(inMemoryUsersRepository)
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it('should be able to get user profile', async () => {
    const user = await createUserUseCase.execute({
      name: 'Victor',
      email: 'victor@example.com',
      driver_license: 'ABC-12345',
      password: '1234',
    })

    const result = await profileUserUseCase.execute(user.id)

    const expectedResult = {
      id: user.id,
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

  it('should NOT be able to get a profile of an inexistent user', async () => {
    const result = profileUserUseCase.execute('123456')

    await expect(result).rejects.toEqual(new AppError('User not found', 404))
  })
})
