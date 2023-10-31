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

  it('Should NOT be able to add a new specification to a inexistent car', async () => {
    const car_id = '123'
    const specifications_id = ['54321']

    const result = createCarSpecificationUseCase.execute({
      car_id,
      specifications_id,
    })

    await expect(result).rejects.toEqual(
      new AppError('Car does not exists!', 404),
    )
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

    const specification2 = await inMemorySpecificationsRepository.create({
      description: 'Teste 2',
      name: 'Teste 2',
    })

    const specifications_id = [specification.id, specification2.id]

    const result = await createCarSpecificationUseCase.execute({
      car_id: car.id,
      specifications_id,
    })

    const specificationMock = {
      id: specification.id,
      description: 'Teste',
      name: 'Teste',
      created_at: expect.any(Date),
    }

    const specificationMock2 = {
      id: specification2.id,
      name: 'Teste 2',
      description: 'Teste 2',
      created_at: expect.any(Date),
    }

    const expectedResult = {
      id: car.id,
      brand: 'Brand',
      daily_rate: 100,
      description: 'Description Car',
      fine_amount: 60,
      license_plate: 'ABC-1234',
      name: 'Name Car',
      category_id: 'category',
      available: true,
      specifications: [
        expect.objectContaining(specificationMock),
        expect.objectContaining(specificationMock2),
      ],
      created_at: expect.any(Date),
    }

    expect(result.specifications.length).toBe(2)
    expect(result).toEqual(expectedResult)
  })
})
