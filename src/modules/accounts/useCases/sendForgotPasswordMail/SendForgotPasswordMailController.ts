import { container } from 'tsyringe'
import { Response, Request } from 'express'
import { SendForgotPasswordMailUseCase } from './SendForgotPasswordMailUseCase'
import { z } from 'zod'

export class SendForgotPasswordMailController {
  async handle(request: Request, response: Response): Promise<Response> {
    const sendForgotPasswordMailBodySchema = z.object({
      email: z.string().email().max(45).toLowerCase(),
    })

    const { email } = sendForgotPasswordMailBodySchema.parse(request.body)

    const sendForgotPasswordMailUseCase = container.resolve(
      SendForgotPasswordMailUseCase,
    )

    const successMessage = await sendForgotPasswordMailUseCase.execute(email)
    return response.status(200).json(successMessage)
  }
}
