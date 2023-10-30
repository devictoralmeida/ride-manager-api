import { InMemoryCarsRepository } from '@modules/cars/repositories/in-memory/InMemoryCarsRepository'
import { InMemoryRentalsRepository } from '@modules/rentals/repositories/in-memory/InMemoryRentalsRepository'
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider'
import AppError from '@shared/errors/AppError'
import dayjs from 'dayjs'
import { DevolutionRentalUseCase } from './DevolutionRentalUseCase'

let inMemoryRentalsRepository: InMemoryRentalsRepository
let devolutionRentalUseCase: DevolutionRentalUseCase
let dayjsDateProvider: DayjsDateProvider
let inMemoryCarsRepository: InMemoryCarsRepository

describe('Devolution Rental UseCase', () => {
  const addOneDay = dayjs().add(1, 'day').toDate()

  beforeEach(() => {
    inMemoryRentalsRepository = new InMemoryRentalsRepository()
    dayjsDateProvider = new DayjsDateProvider()
    inMemoryCarsRepository = new InMemoryCarsRepository()

    devolutionRentalUseCase = new DevolutionRentalUseCase(
      inMemoryRentalsRepository,
      dayjsDateProvider,
      inMemoryCarsRepository,
    )
  })

  it('should be able to make a devolution to a car and calculate total value based on dailies', async () => {
    const car = await inMemoryCarsRepository.create({
      name: 'Test',
      brand: 'Brand test',
      category_id: '1234',
      daily_rate: 50,
      description: 'Car test',
      fine_amount: 50,
      license_plate: 'TEST-123',
    })

    const rental = await inMemoryRentalsRepository.create({
      user_id: '12345',
      car_id: car.id,
      expected_return_date: addOneDay,
    })

    const removeTwoDays = dayjs().subtract(2, 'day').toDate()

    rental.start_date = removeTwoDays

    const result = await devolutionRentalUseCase.execute({
      id: rental.id,
      user_id: '12345',
    })

    const expectedResult = {
      id: expect.any(String),
      car_id: car.id,
      expected_return_date: expect.any(Date),
      user_id: '12345',
      created_at: expect.any(Date),
      start_date: removeTwoDays,
      end_date: expect.any(Date),
      total: 100,
    }

    expect(result).toStrictEqual(expect.objectContaining(expectedResult))
  })

  it('should be able to make a devolution to a car and calculate total value based on dailies and delay', async () => {
    const car2 = await inMemoryCarsRepository.create({
      name: 'Test 2',
      brand: 'Brand 2',
      category_id: '1234',
      daily_rate: 50,
      description: 'Car test 2',
      fine_amount: 100,
      license_plate: 'TEST-1234',
    })

    const removeOneDay = dayjs().subtract(1, 'day').toDate()
    const removeTwoDays = dayjs().subtract(2, 'day').toDate()

    const rental = await inMemoryRentalsRepository.create({
      user_id: '123',
      car_id: car2.id,
      expected_return_date: removeOneDay,
    })

    rental.start_date = removeTwoDays

    const result = await devolutionRentalUseCase.execute({
      id: rental.id,
      user_id: '123',
    })

    const expectedResult = {
      id: expect.any(String),
      car_id: car2.id,
      expected_return_date: removeOneDay,
      user_id: '123',
      created_at: expect.any(Date),
      start_date: removeTwoDays,
      end_date: expect.any(Date),
      total: 200,
    }

    expect(result).toStrictEqual(expect.objectContaining(expectedResult))
  })

  it('should NOT be able to make a devolution for an inexistent rent', async () => {
    const car3 = await inMemoryCarsRepository.create({
      name: 'Test 3',
      brand: 'Brand 3',
      category_id: '1234',
      daily_rate: 50,
      description: 'Car test 3',
      fine_amount: 100,
      license_plate: 'TEST-8899',
    })

    await inMemoryRentalsRepository.create({
      user_id: '123',
      car_id: car3.id,
      expected_return_date: addOneDay,
    })

    const result = devolutionRentalUseCase.execute({
      id: '99',
      user_id: '123',
    })

    await expect(result).rejects.toEqual(
      new AppError('Rental does not exists.', 404),
    )
  })

  it('should NOT be able to make a devolution for an inexistent car', async () => {
    const rentalTest2 = await inMemoryRentalsRepository.create({
      user_id: '123',
      car_id: '9999',
      expected_return_date: addOneDay,
    })

    const result = devolutionRentalUseCase.execute({
      id: rentalTest2.id,
      user_id: '123',
    })

    await expect(result).rejects.toEqual(
      new AppError('Car does not exists.', 404),
    )
  })

  it('should NOT be able to make a devolution when rental does not belongs to the user', async () => {
    const car4 = await inMemoryCarsRepository.create({
      name: 'Test 4',
      brand: 'Brand 4',
      category_id: '1234',
      daily_rate: 50,
      description: 'Car test 4',
      fine_amount: 100,
      license_plate: 'TEST-9998',
    })

    const newRental = await inMemoryRentalsRepository.create({
      user_id: '1',
      car_id: car4.id,
      expected_return_date: addOneDay,
    })

    const result = devolutionRentalUseCase.execute({
      id: newRental.id,
      user_id: '12',
    })

    await expect(result).rejects.toEqual(
      new AppError('This rental does not belongs to the user.', 409),
    )
  })
})
