import { container } from 'tsyringe'
import { CreateCarUseCase } from './CreateCarUseCase'
import { Response, Request } from 'express'

export class CreateCarController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      brand,
      daily_rate,
      description,
      fine_amount,
      license_plate,
      name,
      category_id,
    } = request.body

    const createCarUseCase = container.resolve(CreateCarUseCase)

    const car = await createCarUseCase.execute({
      brand,
      daily_rate,
      description,
      fine_amount,
      license_plate,
      name,
      category_id,
    })

    return response.status(201).json(car)
  }
}
