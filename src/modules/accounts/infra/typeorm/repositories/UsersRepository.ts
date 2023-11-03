import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO'
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'
import { AppDataSource } from '../../../../../data-source'
import { Repository } from 'typeorm'
import { User } from '../entities/User'
import { v4 as uuidV4 } from 'uuid'

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>

  constructor() {
    this.repository = AppDataSource.getRepository(User)
  }

  async updateAvatar(user: User): Promise<User> {
    await this.repository.save(user)
    return user
  }

  async create({
    name,
    email,
    driver_license,
    password,
    isAdmin,
    avatar,
  }: ICreateUserDTO): Promise<User> {
    const user = this.repository.create({
      name,
      email,
      driver_license,
      password,
      avatar: avatar ?? null,
      isAdmin: isAdmin ?? false,
      id: uuidV4(),
      created_at: new Date(),
    })

    await this.repository.save(user)
    return user
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.repository.findOneBy({ email })
    return user
  }

  async findById(id: string): Promise<User> {
    const user = await this.repository.findOneBy({ id })
    return user
  }
}
