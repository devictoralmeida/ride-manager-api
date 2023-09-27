import { container } from 'tsyringe'
import { Response, Request } from 'express'
import { DevolutionRentalUseCase } from './DevolutionRentalUseCase'

export class DevolutionRentalController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params
    const { id: user_id } = request.user

    const devolutionRentalUseCase = container.resolve(DevolutionRentalUseCase)

    const rental = await devolutionRentalUseCase.execute({ id, user_id })
    return response.status(200).json(rental)
  }
}
