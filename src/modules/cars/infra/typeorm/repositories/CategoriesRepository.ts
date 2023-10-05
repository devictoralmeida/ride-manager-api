import {
  ICategoriesRepository,
  ICreateCategoryDTO,
} from '@modules/cars/repositories/ICategoriesRepository'
import { Repository } from 'typeorm'
import { Category } from '../entities/Category'
import { AppDataSource } from '../../../../../data-source'

export class CategoriesRepository implements ICategoriesRepository {
  private repository: Repository<Category> // Assim só teremos acesso aos métodos do typeORM aqui dentro

  constructor() {
    this.repository = AppDataSource.getRepository(Category)
  }

  async create({ name, description }: ICreateCategoryDTO): Promise<Category> {
    const category = this.repository.create({ name, description })
    await this.repository.save(category)
    return category
  }

  async list(): Promise<Category[]> {
    const categories = await this.repository.find()
    return categories
  }

  async findByName(name: string): Promise<Category | void> {
    const category = await this.repository.findOneBy({ name })
    return category
  }
}
