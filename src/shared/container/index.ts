import { container } from 'tsyringe'
import { ICategoriesRepository } from '../../modules/cars/repositories/ICategoriesRepository'
import { CategoriesRepository } from '../../modules/cars/repositories/implementations/CategoriesRepository'

container.registerSingleton<ICategoriesRepository>(
  'CategoriesRepository', // nome do container
  CategoriesRepository, // Essa será a classe que será passada toda vez que chamar-mos o container
)
