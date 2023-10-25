import { container } from 'tsyringe'
import { CreateCarSpecificationUseCase } from './createCarSpecificationUseCase'
import { Response, Request } from 'express'
import { z } from 'zod'

export class CreateCarSpecificationController {
  async handle(request: Request, response: Response): Promise<Response> {
    const createCarSpecificationBodySchema = z.object({
      specifications_id: z.array(z.string().uuid()).min(1),
    })

    const createCarSpecificationParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = createCarSpecificationParamsSchema.parse(request.params)

    const { specifications_id } = createCarSpecificationBodySchema.parse(
      request.body,
    )

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
