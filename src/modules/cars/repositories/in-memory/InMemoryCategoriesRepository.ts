import { Category } from '@modules/cars/infra/typeorm/entities/Category'
import {
  ICategoriesRepository,
  ICreateCategoryDTO,
} from '../ICategoriesRepository'

export class InMemoryCategoriesRepository implements ICategoriesRepository {
  categories: Category[] = []

  async findByName(name: string) {
    const foundedCategory = this.categories.find(
      (category) => category.name === name,
    )

    if (!foundedCategory) {
      return
    }

    return foundedCategory
  }

  async list(): Promise<Category[]> {
    const categoriesList = this.categories
    return categoriesList
  }

  async create({ name, description }: ICreateCategoryDTO): Promise<Category> {
    const newCategory = new Category() // Aqui gera o id devido ao construtor da entity

    Object.assign(newCategory, {
      name,
      description,
    })

    this.categories.push(newCategory)

    return newCategory
  }
}
