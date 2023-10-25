import { container } from 'tsyringe'
import { CreateCarUseCase } from './CreateCarUseCase'
import { Response, Request } from 'express'
import { z } from 'zod'

export class CreateCarController {
  async handle(request: Request, response: Response): Promise<Response> {
    const createCarBodySchema = z.object({
      name: z.string().max(20).min(1).toLowerCase(),
      description: z.string().min(1).max(20),
      brand: z.string().min(1).max(15),
      license_plate: z.string().length(8),
      category_id: z.string().uuid(),
      daily_rate: z.coerce.number().int().positive(),
      fine_amount: z.coerce.number().int().positive(),
    })

    const {
      name,
      description,
      brand,
      license_plate,
      category_id,
      daily_rate,
      fine_amount,
    } = createCarBodySchema.parse(request.body)

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
