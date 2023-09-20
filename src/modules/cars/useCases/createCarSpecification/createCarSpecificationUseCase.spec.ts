import { InMemorySpecificationsRepository } from './../../repositories/in-memory/InMemorySpecificationsRepository'
import { InMemoryCarsRepository } from '@modules/cars/repositories/in-memory/InMemoryCarsRepository'
import { CreateCarSpecificationUseCase } from './createCarSpecificationUseCase'
import AppError from '@shared/errors/AppError'

let createCarSpecificationUseCase: CreateCarSpecificationUseCase
let inMemoryCarsRepository: InMemoryCarsRepository
let inMemorySpecificationsRepository: InMemorySpecificationsRepository

describe('Create Car Specifications', () => {
  beforeEach(() => {
    inMemoryCarsRepository = new InMemoryCarsRepository()
    inMemorySpecificationsRepository = new InMemorySpecificationsRepository()
    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
      inMemoryCarsRepository,
      inMemorySpecificationsRepository,
    )
  })

  it('Should NOT be able to add a new specification to a non-existent car', async () => {
    const car_id = '123'
    const specifications_id = ['54321']

    const result = createCarSpecificationUseCase.execute({
      car_id,
      specifications_id,
    })

    await expect(result).rejects.toBeInstanceOf(AppError)
  })

  it('Should be able to add a new specification to a car', async () => {
    const car = await inMemoryCarsRepository.create({
      brand: 'Brand',
      daily_rate: 100,
      description: 'Description Car',
      fine_amount: 60,
      license_plate: 'ABC-1234',
      name: 'Name Car',
      category_id: 'category',
    })

    const specification = await inMemorySpecificationsRepository.create({
      description: 'Teste',
      name: 'Teste',
    })

    const specifications_id = [specification.id]

    const specificationsCars = await createCarSpecificationUseCase.execute({
      car_id: car.id,
      specifications_id,
    })

    expect(specificationsCars).toHaveProperty('specifications')
    expect(specificationsCars.specifications.length).toBe(1)
  })
})
