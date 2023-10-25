import { container } from 'tsyringe'
import { Response, Request } from 'express'
import { ResetPasswordUserUseCase } from './ResetPasswordUserUseCase'
import { z } from 'zod'

export class ResetPasswordUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const resetPasswordUserBodySchema = z.object({
      password: z.string().max(6),
    })

    const resetPasswordUserQuerySchema = z.object({
      token: z.string(),
    })

    const { password } = resetPasswordUserBodySchema.parse(request.body)
    const { token } = resetPasswordUserQuerySchema.parse(request.query)

    const resetPasswordUserUseCase = container.resolve(ResetPasswordUserUseCase)
    resetPasswordUserUseCase.execute({ token: String(token), password })
    return response.status(204).json()
  }
}
