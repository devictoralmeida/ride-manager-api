import 'reflect-metadata'
import { injectable, inject } from 'tsyringe'
import { hash } from 'bcryptjs'
import AppError from '@shared/errors/AppError'
import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO'
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'
import { UserMap } from '@modules/accounts/mapper/UserMap'
import { IUserResponseDTO } from '@modules/accounts/dtos/IUserResponseDTO'

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({
    name,
    email,
    driver_license,
    password,
  }: ICreateUserDTO): Promise<IUserResponseDTO> {
    const userAlreadyExists = await this.usersRepository.findByEmail(email)

    if (userAlreadyExists) {
      throw new AppError('User already exists.', 409)
    }

    const hashPassword = await hash(password, 8)

    const newUser = await this.usersRepository.create({
      name,
      email,
      driver_license,
      password: hashPassword,
    })

    return UserMap.toDTO(newUser)
  }
}
