import { container } from 'tsyringe'
import { CreateCategoryUseCase } from './CreateCategoryUseCase'
import { Response, Request } from 'express'
import { z } from 'zod'

export class CreateCategoryController {
  async handle(request: Request, response: Response): Promise<Response> {
    const createCategoryBodySchema = z.object({
      name: z.string().min(1).max(20).toLowerCase(),
      description: z.string().min(1).max(20),
    })

    const { name, description } = createCategoryBodySchema.parse(request.body)

    const createCategoryUseCase = container.resolve(CreateCategoryUseCase)

    const newCategory = await createCategoryUseCase.execute({
      name,
      description,
    })

    return response.status(201).json(newCategory)
  }
}
