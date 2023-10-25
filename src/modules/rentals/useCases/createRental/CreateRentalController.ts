import { container } from 'tsyringe'
import { Response, Request } from 'express'
import { CreateRentalUseCase } from './CreateRentalUseCase'
import { z } from 'zod'

export class CreateRentalController {
  async handle(request: Request, response: Response): Promise<Response> {
    const createRentalBodySchema = z.object({
      car_id: z.string().uuid(),
      expected_return_date: z.coerce.date(),
    })

    const { car_id, expected_return_date } = createRentalBodySchema.parse(
      request.body,
    )

    const { id } = request.user

    const createRentalUseCase = container.resolve(CreateRentalUseCase)

    const rental = await createRentalUseCase.execute({
      car_id,
      expected_return_date,
      user_id: id,
    })

    return response.status(201).json(rental)
  }
}
