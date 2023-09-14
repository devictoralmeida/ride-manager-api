/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Response, Request } from 'express'
import { ImportCategoryUseCase } from './ImportCategoryUseCase'
import { container } from 'tsyringe'

export class ImportCategoryController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { file } = request

    const importCategoryUseCase = container.resolve(ImportCategoryUseCase)

    await importCategoryUseCase.execute(file!)
    return response.status(201).json(file)
  }
}
