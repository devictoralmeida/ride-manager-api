import { Response, Request } from 'express'
import { CreateSpecificationUseCase } from './CreateSpecificationUseCase'

export class CreateSpecificationController {
  constructor(private createSpecificationUseCase: CreateSpecificationUseCase) {}

  handle(request: Request, response: Response): Response {
    const { name, description } = request.body

    const newSpecification = this.createSpecificationUseCase.execute({
      name,
      description,
    })

    return response.status(201).json(newSpecification)
  }
}
