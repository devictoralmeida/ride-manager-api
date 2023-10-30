import { InMemoryCarsRepository } from '@modules/cars/repositories/in-memory/InMemoryCarsRepository'
import dayjs from 'dayjs'
import AppError from '@shared/errors/AppError'
import { InMemoryRentalsRepository } from './../../repositories/in-memory/InMemoryRentalsRepository'
import { CreateRentalUseCase } from './CreateRentalUseCase'
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider'

let inMemoryRentalsRepository: InMemoryRentalsRepository
let createRentalUseCase: CreateRentalUseCase
let dayjsDateProvider: DayjsDateProvider
let inMemoryCarsRepository: InMemoryCarsRepository

describe('Create Rental UseCase', () => {
  const addOneDay = dayjs().add(1, 'day').toDate()

  beforeEach(() => {
    inMemoryRentalsRepository = new InMemoryRentalsRepository()
    dayjsDateProvider = new DayjsDateProvider()
    inMemoryCarsRepository = new InMemoryCarsRepository()

    createRentalUseCase = new CreateRentalUseCase(
      inMemoryRentalsRepository,
      dayjsDateProvider,
      inMemoryCarsRepository,
    )
  })

  it('should be able to create a new Rental', async () => {
    const car = await inMemoryCarsRepository.create({
      name: 'Test',
      brand: 'Brand test',
      category_id: '1234',
      daily_rate: 50,
      description: 'Car test',
      fine_amount: 50,
      license_plate: 'TEST-123',
    })

    const result = await createRentalUseCase.execute({
      user_id: '12345',
      car_id: car.id,
      expected_return_date: addOneDay,
    })

    const expectedResult = {
      id: expect.any(String),
      user_id: '12345',
      car_id: car.id,
      created_at: expect.any(Date),
      start_date: expect.any(Date),
      expected_return_date: addOneDay,
    }

    expect(result).toEqual(expect.objectContaining(expectedResult))
    expect(car).toHaveProperty('available', false)
  })

  it('should NOT be able to create a new Rental if there is another open to the same user', async () => {
    await inMemoryRentalsRepository.create({
      car_id: '121210',
      expected_return_date: addOneDay,
      user_id: '12346',
    })

    const result = createRentalUseCase.execute({
      user_id: '12346',
      car_id: '121211',
      expected_return_date: addOneDay,
    })

    await expect(result).rejects.toEqual(
      new AppError('There is a rental in progress for user!', 409),
    )
  })

  it('should NOT be able to create a new rental if there is another open to the same car', async () => {
    await inMemoryRentalsRepository.create({
      car_id: '121219',
      expected_return_date: addOneDay,
      user_id: '12349',
    })

    const result = createRentalUseCase.execute({
      user_id: '12399',
      car_id: '121219',
      expected_return_date: addOneDay,
    })

    await expect(result).rejects.toEqual(
      new AppError('Car is unavailable', 409),
    )
  })

  it('should NOT be able to create a new Rental with invalid return time', async () => {
    const result = createRentalUseCase.execute({
      user_id: '3210',
      car_id: '121219',
      expected_return_date: dayjs().toDate(),
    })

    await expect(result).rejects.toEqual(
      new AppError('Invalid return time!', 409),
    )
  })
})
