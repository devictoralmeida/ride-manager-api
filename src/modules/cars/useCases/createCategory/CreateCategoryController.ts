import { container } from 'tsyringe'
import { CreateCategoryUseCase } from './CreateCategoryUseCase'
import { Response, Request } from 'express'

export class CreateCategoryController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, description } = request.body

    const createCategoryUseCase = container.resolve(CreateCategoryUseCase) // Injetando todas as dependências aqui

    const newCategory = await createCategoryUseCase.execute({
      name,
      description,
    })

    return response.status(201).json(newCategory)
  }
}
