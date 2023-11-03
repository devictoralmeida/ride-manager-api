import { container } from 'tsyringe'
import { Response, Request } from 'express'
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase'
import { z } from 'zod'

export class AuthenticateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const authenticateUserBodySchema = z.object({
      email: z.string().email().max(45).toLowerCase(),
      password: z.string().min(4).max(6),
    })

    const { email, password } = authenticateUserBodySchema.parse(request.body)

    const authenticateUserUseCase = container.resolve(AuthenticateUserUseCase)

    const token = await authenticateUserUseCase.execute({ password, email })

    return response.status(200).json(token)
  }
}
