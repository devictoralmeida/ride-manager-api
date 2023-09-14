import AppError from '@shared/errors/AppError'
import { InMemoryCategoriesRepository } from '@modules/cars/repositories/in-memory/InMemoryCategoriesRepository'
import { CreateCategoryUseCase } from './CreateCategoryUseCase'

let categoriesRepositoryInMemory: InMemoryCategoriesRepository
let createCategoryUseCase: CreateCategoryUseCase

describe('Create Category Use Case', () => {
  beforeEach(() => {
    // Aqui vamos instanciar as nossas variáveis
    categoriesRepositoryInMemory = new InMemoryCategoriesRepository()
    createCategoryUseCase = new CreateCategoryUseCase(
      categoriesRepositoryInMemory,
    )
  })

  it('should be able to create a new category', async () => {
    const newCategory = await createCategoryUseCase.execute({
      name: 'Category Test',
      description: 'Category Description Test',
    })

    const expectedResult = {
      id: expect.any(String),
      name: 'Category Test',
      description: 'Category Description Test',
      created_at: expect.any(Date),
    }

    expect(newCategory).toStrictEqual(expect.objectContaining(expectedResult))
  })

  it('should NOT be able to create a new category with name in duplicity', async () => {
    await createCategoryUseCase.execute({
      name: 'Category Test',
      description: 'Category Description Test',
    })

    const result = createCategoryUseCase.execute({
      name: 'Category Test',
      description: 'Category Description Test',
    })

    await expect(result).rejects.toThrowError(AppError)
    await expect(result).rejects.toThrow('Category already exists!')
  })
})
