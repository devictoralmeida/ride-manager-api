import { container } from 'tsyringe'
import { Response, Request } from 'express'
import { DevolutionRentalUseCase } from './DevolutionRentalUseCase'
import { z } from 'zod'

export class DevolutionRentalController {
  async handle(request: Request, response: Response): Promise<Response> {
    const devolutionRentalParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = devolutionRentalParamsSchema.parse(request.params)

    const { id: user_id } = request.user

    const devolutionRentalUseCase = container.resolve(DevolutionRentalUseCase)

    const rental = await devolutionRentalUseCase.execute({ id, user_id })
    return response.status(200).json(rental)
  }
}
