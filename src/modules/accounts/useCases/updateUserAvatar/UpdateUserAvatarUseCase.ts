import 'reflect-metadata'
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'
import { IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider'
import { inject, injectable } from 'tsyringe'
import { User } from '@modules/accounts/infra/typeorm/entities/User'

interface IRequest {
  user_id: string
  avatar_file: string
}

@injectable()
export class UpdateUserAvatarUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  async execute({ user_id, avatar_file }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id)

    if (user) {
      if (user.avatar) {
        await this.storageProvider.delete(user.avatar, 'avatar')
      }

      await this.storageProvider.save(avatar_file, 'avatar')

      user.avatar = avatar_file
      await this.usersRepository.create(user)
      return user
    }
  }
}
