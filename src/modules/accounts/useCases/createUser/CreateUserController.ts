import { container } from 'tsyringe'
import { Response, Request } from 'express'
import { CreateUserUseCase } from './CreateUserUseCase'
import { z } from 'zod'

export class CreateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const createUserBodySchema = z.object({
      name: z.string().min(3).max(45).toLowerCase(),
      email: z.string().email().max(45).toLowerCase(),
      password: z.string().min(4).max(6),
      driver_license: z.string().max(10),
    })

    const { name, email, password, driver_license } =
      createUserBodySchema.parse(request.body)

    const createUserUseCase = container.resolve(CreateUserUseCase)

    const newUser = await createUserUseCase.execute({
      name,
      email,
      password,
      driver_license,
    })

    return response.status(201).json(newUser)
  }
}
