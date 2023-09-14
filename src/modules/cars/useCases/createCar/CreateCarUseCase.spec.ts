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
      license_plate: 'ABC-1234',
      name: 'Name Car',
      category_id: 'category',
    })

    const expectedResult = {
      id: expect.any(String),
      brand: 'Brand',
      daily_rate: 100,
      description: 'Description Car',
      fine_amount: 60,
      license_plate: 'ABC-1234',
      name: 'Name Car',
      category_id: 'category',
      available: true,
      created_at: expect.any(Date),
    }

    expect(car).toStrictEqual(expect.objectContaining(expectedResult))
    expect(car.available).toBe(true)
  })

  it('should NOT be able to create a car with existing license plate', async () => {
    await createCarUseCase.execute({
      brand: 'Brand',
      daily_rate: 100,
      description: 'Description Car',
      fine_amount: 60,
      license_plate: 'ABC-1234',
      name: 'Car1',
      category_id: 'category',
    })

    const result = createCarUseCase.execute({
      brand: 'Brand',
      daily_rate: 100,
      description: 'Description Car',
      fine_amount: 60,
      license_plate: 'ABC-1234',
      name: 'Car1',
      category_id: 'category',
    })

    await expect(result).rejects.toThrowError(AppError)
    await expect(result).rejects.toThrow('Car already exists!')
  })
})
