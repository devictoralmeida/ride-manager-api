import { IUserResponseDTO } from '@modules/accounts/dtos/IUserResponseDTO'
import { UserMap } from '@modules/accounts/mapper/UserMap'
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'
import { IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider'
import AppError from '@shared/errors/AppError'
import { injectable, inject } from 'tsyringe'

@injectable()
export class ProfileUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  async execute(id: string): Promise<IUserResponseDTO> {
    const user = await this.usersRepository.findById(id)

    if (!user) {
      throw new AppError('User not found', 404)
    }

    return UserMap.toDTO(user)
  }
}
