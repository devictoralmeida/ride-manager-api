import { InMemoryCategoriesRepository } from '@modules/cars/repositories/in-memory/InMemoryCategoriesRepository'
import { ListCategoriesUseCase } from './ListCategoriesUseCase'

let categoriesRepositoryInMemory: InMemoryCategoriesRepository
let listCategoryUseCase: ListCategoriesUseCase

describe('List Categories UseCase', () => {
  beforeEach(() => {
    categoriesRepositoryInMemory = new InMemoryCategoriesRepository()
    listCategoryUseCase = new ListCategoriesUseCase(
      categoriesRepositoryInMemory,
    )
  })

  it('should be able to list all categories', async () => {
    const firstCategory = await categoriesRepositoryInMemory.create({
      name: 'Category 1',
      description: 'Description 1',
    })

    const secondCategory = await categoriesRepositoryInMemory.create({
      name: 'Category 2',
      description: 'Description 2',
    })

    const result = await listCategoryUseCase.execute()

    const expectedResult = [
      {
        id: firstCategory.id,
        name: 'Category 1',
        description: 'Description 1',
        created_at: expect.any(Date),
      },
      {
        id: secondCategory.id,
        name: 'Category 2',
        description: 'Description 2',
        created_at: expect.any(Date),
      },
    ]

    expect(result).toHaveLength(2)
    expect(result).toEqual(expectedResult)
  })
})
