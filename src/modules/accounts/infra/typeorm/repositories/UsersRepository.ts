import { Repository } from 'typeorm'
import { v4 as uuidV4 } from 'uuid'
import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO'
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'
import { AppDataSource } from 'data-source'
import { User } from '../entities/User'

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>

  constructor() {
    this.repository = AppDataSource.getRepository(User)
  }

  async create({
    name,
    email,
    driver_license,
    password,
    avatar,
    id,
  }: ICreateUserDTO): Promise<User> {
    let user: any
    if (id && avatar) {
      user = this.repository.create({
        name,
        email,
        driver_license,
        password,
        avatar,
        id,
      })
    } else {
      const newId = uuidV4()

      user = this.repository.create({
        name,
        email,
        driver_license,
        password,
        id: newId,
      })
    }

    await this.repository.save(user)
    return user
  }

  async findByEmail(email: string): Promise<User | void> {
    const user = await this.repository.findOneBy({ email })

    if (!user) {
      return
    }

    return user
  }

  async findById(id: string): Promise<User | void> {
    const user = await this.repository.findOneBy({ id })

    if (!user) {
      return
    }

    return user
  }
}
