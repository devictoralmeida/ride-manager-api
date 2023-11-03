import { container } from 'tsyringe'
import { Response, Request } from 'express'
import { UpdateUserAvatarUseCase } from './UpdateUserAvatarUseCase'

export class UpdateUserAvatarController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user

    const avatar_file = request.file!.filename // Pegando o fileName obtido pelo middleware do multer

    const updateUserAvatarUseCase = container.resolve(UpdateUserAvatarUseCase)

    const user = await updateUserAvatarUseCase.execute({
      user_id: id,
      avatar_file,
    })

    delete user.password
    return response.status(200).json(user)
  }
}
