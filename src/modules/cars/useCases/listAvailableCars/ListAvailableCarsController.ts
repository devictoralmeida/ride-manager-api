import { ListAvailableCarsUseCase } from './ListAvailableCarsUseCase'
import { Response, Request } from 'express'
import { container } from 'tsyringe'

export class ListAvailableCarsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { category_id, brand, name } = request.query

    const listAvailableCarsUseCase = container.resolve(ListAvailableCarsUseCase)

    const cars = await listAvailableCarsUseCase.execute({
      category_id: category_id as string,
      brand: brand as string,
      name: name as string,
    })

    return response.status(200).json(cars)
  }
}
