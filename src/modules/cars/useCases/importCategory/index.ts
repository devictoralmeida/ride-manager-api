import { CategoriesRepository } from '../../repositories/implementations/CategoriesRepository'
import { ImportCategoryController } from './ImportCategoryController'
import { ImportCategoryUseCase } from './ImportCategoryUseCase'

const categoriesRepository = new CategoriesRepository()
const importCategoryUseCase = new ImportCategoryUseCase(categoriesRepository)

export const importCategoryController = new ImportCategoryController(
  importCategoryUseCase,
)
