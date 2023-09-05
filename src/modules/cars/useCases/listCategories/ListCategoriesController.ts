import { ListCategoriesUseCase } from './ListCategoriesUseCase'
import { Request, Response } from 'express'

export class ListCategoriesController {
  constructor(private listCategoriesUseCase: ListCategoriesUseCase) {}

  async handle(request: Request, response: Response): Promise<Response> {
    const categories = await this.listCategoriesUseCase.execute()
    return response.status(200).json(categories)
  }
}
