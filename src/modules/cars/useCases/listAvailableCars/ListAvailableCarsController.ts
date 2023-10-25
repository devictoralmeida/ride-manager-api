import { ListAvailableCarsUseCase } from './ListAvailableCarsUseCase'
import { Response, Request } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

export class ListAvailableCarsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const listAvailableCarsQuerySchema = z.object({
      category_id: z.string().uuid().optional(),
      brand: z.string().min(1).max(15).optional(),
      name: z.string().max(20).min(1).toLowerCase().optional(),
    })

    const { category_id, brand, name } = listAvailableCarsQuerySchema.parse(
      request.query,
    )

    const listAvailableCarsUseCase = container.resolve(ListAvailableCarsUseCase)

    const cars = await listAvailableCarsUseCase.execute({
      category_id: category_id as string,
      brand: brand as string,
      name: name as string,
    })

    return response.status(200).json(cars)
  }
}
