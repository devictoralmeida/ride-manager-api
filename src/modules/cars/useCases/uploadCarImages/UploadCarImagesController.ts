import { UploadCarImagesUseCase } from './UploadCarImagesUseCase'
import { container } from 'tsyringe'
import { Response, Request } from 'express'

interface IFiles {
  filename: string
}

export class UploadCarImagesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params
    const imagens = request.files as IFiles[]

    const uploadCarImageUseCase = container.resolve(UploadCarImagesUseCase)

    const images_name = imagens.map((file) => file.filename)

    await uploadCarImageUseCase.execute({
      car_id: id,
      images_name,
    })

    return response.status(201).send()
  }
}
