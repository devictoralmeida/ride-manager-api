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

  it('should be able to create a car', async () => {
    const car = await createCarUseCase.execute({
      brand: 'Brand',
      daily_rate: 100,
      description: 'Description Car',
      fine_amount: 60,
      license_plate: 'ABC-1234',
      name: 'Name Car',
      category_id: 'category',
    })

    expect(car).toHaveProperty('id')
  })

  it('should NOT be able to create a car with existing license plate', () => {
    expect(async () => {
      await createCarUseCase.execute({
        brand: 'Brand',
        daily_rate: 100,
        description: 'Description Car',
        fine_amount: 60,
        license_plate: 'ABC-1234',
        name: 'Car1',
        category_id: 'category',
      })

      await createCarUseCase.execute({
        brand: 'Brand',
        daily_rate: 100,
        description: 'Description Car',
        fine_amount: 60,
        license_plate: 'ABC-1234',
        name: 'Car2',
        category_id: 'category',
      })
    }).rejects.toBeInstanceOf(AppError)
  })

  it('should be able to create a car with available true by default', async () => {
    const car = await createCarUseCase.execute({
      brand: 'Brand',
      daily_rate: 100,
      description: 'Description Car',
      fine_amount: 60,
      license_plate: 'ABCD-1234',
      name: 'Car Available',
      category_id: 'category',
    })

    expect(car.available).toBe(true)
  })
})
