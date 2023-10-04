import { container } from 'tsyringe'
import { Response, Request } from 'express'
import { SendForgotPasswordMailUseCase } from './SendForgotPasswordMailUseCase'

export class SendForgotPasswordMailController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { email } = request.body
    const sendForgotPasswordMailUseCase = container.resolve(
      SendForgotPasswordMailUseCase,
    )

    await sendForgotPasswordMailUseCase.execute(email)
    return response.status(200).json()
  }
}
