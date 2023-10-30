import AppError from '@shared/errors/AppError'
import { CreateSpecificationUseCase } from './CreateSpecificationUseCase'
import { InMemorySpecificationsRepository } from '@modules/cars/repositories/in-memory/InMemorySpecificationsRepository'

let inMemorySpecificationsRepository: InMemorySpecificationsRepository
let createSpecificationUseCase: CreateSpecificationUseCase

describe('Create Specification UseCase', () => {
  beforeEach(() => {
    inMemorySpecificationsRepository = new InMemorySpecificationsRepository()
    createSpecificationUseCase = new CreateSpecificationUseCase(
      inMemorySpecificationsRepository,
    )
  })

  it('should be able to create a new Specification', async () => {
    const result = await createSpecificationUseCase.execute({
      name: 'Specif Name',
      description: 'Specif Desc',
    })

    const expectedResult = {
      id: result.id,
      name: 'Specif Name',
      description: 'Specif Desc',
      created_at: expect.any(Date),
    }

    expect(result).toStrictEqual(expect.objectContaining(expectedResult))
  })

  it('should NOT be able to create an specification with name in duplicity', async () => {
    await createSpecificationUseCase.execute({
      name: 'Specif 2',
      description: 'Specif 2',
    })

    const result = createSpecificationUseCase.execute({
      name: 'Specif 2',
      description: 'Specif 2',
    })

    await expect(result).rejects.toEqual(
      new AppError('Specification already exists', 409),
    )
  })
})
