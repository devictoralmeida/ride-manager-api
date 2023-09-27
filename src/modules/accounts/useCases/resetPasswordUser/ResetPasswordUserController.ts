import { container } from 'tsyringe'
import { Response, Request } from 'express'
import { ResetPasswordUserUseCase } from './ResetPasswordUserUseCase'

export class ResetPasswordUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { token } = request.query
    const { password } = request.body

    const resetPasswordUserUseCase = container.resolve(ResetPasswordUserUseCase)
    resetPasswordUserUseCase.execute({ token: String(token), password })
    return response.status(204).json()
  }
}
