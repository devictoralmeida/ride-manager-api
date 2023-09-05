import { inject, injectable } from 'tsyringe'
import { Category } from '../../entities/Category'
import { ICategoriesRepository } from '../../repositories/ICategoriesRepository'

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
      throw new Error('Category already exists!')
    }

    const newCategory = this.categoriesRepository.create({
      name,
      description,
    })

    return newCategory
  }
}
