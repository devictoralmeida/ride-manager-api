import { container } from 'tsyringe'
import { Response, Request } from 'express'
import { CreateUserUseCase } from './CreateUserUseCase'

export class CreateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, email, password, driver_license } = request.body

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
