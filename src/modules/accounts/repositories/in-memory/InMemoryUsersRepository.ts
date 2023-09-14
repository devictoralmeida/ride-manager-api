import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO'
import { User } from '@modules/accounts/infra/typeorm/entities/User'
import { IUsersRepository } from '../IUsersRepository'

export class InMemoryUsersRepository implements IUsersRepository {
  users: User[] = []

  async create({
    driver_license,
    email,
    name,
    password,
  }: ICreateUserDTO): Promise<User> {
    const newUser = new User()

    Object.assign(newUser, {
      driver_license,
      email,
      name,
      password,
    })

    this.users.push(newUser)
    return newUser
  }

  async findByEmail(email: string): Promise<User | void> {
    const foundedUser = this.users.find((user) => user.email === email)

    if (!foundedUser) {
      return
    }

    return foundedUser
  }

  async findById(id: string): Promise<User | void> {
    const foundedUser = this.users.find((user) => user.id === id)

    if (!foundedUser) {
      return
    }

    return foundedUser
  }
}
