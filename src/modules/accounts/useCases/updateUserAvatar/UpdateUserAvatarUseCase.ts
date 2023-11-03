import 'reflect-metadata'
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'
import { IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider'
import { inject, injectable } from 'tsyringe'
import { User } from '@modules/accounts/infra/typeorm/entities/User'
import AppError from '@shared/errors/AppError'

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

    if (!user) {
      throw new AppError('User not found', 404)
    }

    if (user.avatar && user.avatar !== null) {
      await this.storageProvider.delete(user.avatar, 'avatar')
    }

    await this.storageProvider.save(avatar_file, 'avatar')

    user.avatar = avatar_file
    await this.usersRepository.update(user)
    return user
  }
}
