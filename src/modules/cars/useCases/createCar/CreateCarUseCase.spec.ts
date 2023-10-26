import { InMemoryCarsRepository } from '@modules/cars/repositories/in-memory/InMemoryCarsRepository'
import { CreateCarUseCase } from './CreateCarUseCase'
import AppError from '@shared/errors/AppError'

let inMemoryCarsRepository: InMemoryCarsRepository
let createCarUseCase: CreateCarUseCase

describe('Create Car', () => {
  beforeEach(() => {
    inMemoryCarsRepository = new InMemoryCarsRepository()
    createCarUseCase = new CreateCarUseCase(inMemoryCarsRepository)
  })

  it('should be able to create a new available car', async () => {
    const car = await createCarUseCase.execute({
      brand: 'Brand',
      daily_rate: 100,
      description: 'Description Car',
      fine_amount: 60,
      license_plate: 'ABA-1234',
      name: 'Name Car',
      category_id: 'ddd9588f-b5c8-4a00-98f9-381959e1c01a',
    })

    const expectedResult = {
      id: expect.any(String),
      brand: 'Brand',
      daily_rate: 100,
      description: 'Description Car',
      fine_amount: 60,
      license_plate: 'ABA-1234',
      name: 'Name Car',
      category_id: 'ddd9588f-b5c8-4a00-98f9-381959e1c01a',
      available: true,
      created_at: expect.any(Date),
    }

    expect(car).toStrictEqual(expect.objectContaining(expectedResult))
    expect(car.available).toBe(true)
  })

  it('should NOT be able to create a car with existing license plate', async () => {
    await createCarUseCase.execute({
      brand: 'Brand 2',
      daily_rate: 100,
      description: 'Description Car 2',
      fine_amount: 60,
      license_plate: 'ABC-1234',
      name: 'Car test 2',
      category_id: '5cba3f74-9b83-4ce6-aafc-7758f95fa233',
    })

    const result = createCarUseCase.execute({
      brand: 'Brand 2',
      daily_rate: 100,
      description: 'Description Car 2',
      fine_amount: 60,
      license_plate: 'ABC-1234',
      name: 'Car test 2',
      category_id: '5cba3f74-9b83-4ce6-aafc-7758f95fa233',
    })

    await expect(result).rejects.toEqual(new AppError('Car already exists'))
  })
})
