import { container } from 'tsyringe'
import { CreateCarSpecificationUseCase } from './createCarSpecificationUseCase'
import { Response, Request } from 'express'

export class CreateCarSpecificationController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params
    const { specifications_id } = request.body

    const createCarSpecificationUseCase = container.resolve(
      CreateCarSpecificationUseCase,
    )

    const carSpecifications = await createCarSpecificationUseCase.execute({
      car_id: id,
      specifications_id,
    })

    return response.status(201).json(carSpecifications)
  }
}
