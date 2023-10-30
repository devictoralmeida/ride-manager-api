import { Category } from '@modules/cars/infra/typeorm/entities/Category'
import { ICategoriesRepository } from '@modules/cars/repositories/ICategoriesRepository'
import AppError from '@shared/errors/AppError'
import { injectable, inject } from 'tsyringe'

interface IRequest {
  name: string
  description: string
}

@injectable()
export class CreateCategoryUseCase {
  constructor(
    @inject('CategoriesRepository')
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
