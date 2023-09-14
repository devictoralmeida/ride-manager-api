import { Category } from '@modules/cars/infra/typeorm/entities/Category'
import { ICategoriesRepository } from '@modules/cars/repositories/ICategoriesRepository'
import AppError from '@shared/errors/AppError'
import { injectable, inject } from 'tsyringe'

interface IRequest {
  name: string
  description: string
}

@injectable() // Passo o injectable aqui pq eu irei injetar esse Use Case dentro do handle do controller
export class CreateCategoryUseCase {
  constructor(
    @inject('CategoriesRepository') // @inject e dentro eu passo o nome do container
    private categoriesRepository: ICategoriesRepository,
  ) {}

  async execute({ name, description }: IRequest): Promise<Category> {
    const categoryAlreadyExists =
      await this.categoriesRepository.findByName(name)

    if (categoryAlreadyExists) {
      throw new AppError('Category already exists!', 409)
    }

    const newCategory = await this.categoriesRepository.create({
      name,
      description,
    })

    return newCategory
  }
}
