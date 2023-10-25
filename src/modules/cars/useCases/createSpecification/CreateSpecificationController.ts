import { Response, Request } from 'express'
import { container } from 'tsyringe'
import { CreateSpecificationUseCase } from './CreateSpecificationUseCase'
import { z } from 'zod'

export class CreateSpecificationController {
  async handle(request: Request, response: Response): Promise<Response> {
    const createSpecificationBodySchema = z.object({
      name: z.string().max(20).min(1).toLowerCase(),
      description: z.string().min(1).max(20),
    })

    const { name, description } = createSpecificationBodySchema.parse(
      request.body,
    )

    const createSpecificationUseCase = container.resolve(
      CreateSpecificationUseCase,
    )

    const newSpecification = await createSpecificationUseCase.execute({
      name,
      description,
    })

    return response.status(201).json(newSpecification)
  }
}
