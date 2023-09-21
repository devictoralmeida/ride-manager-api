import dayjs from 'dayjs'
import AppError from '@shared/errors/AppError'
import { InMemoryRentalsRepository } from './../../repositories/in-memory/InMemoryRentalsRepository'
import { CreateRentalUseCase } from './CreateRentalUseCase'
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider'

let createRentalUseCase: CreateRentalUseCase
let inMemoryRentalsRepository: InMemoryRentalsRepository
let dayjsDateProvider: DayjsDateProvider

describe('Create Rental', () => {
  const addOneDay = dayjs().add(1, 'day').toDate()

  beforeEach(() => {
    inMemoryRentalsRepository = new InMemoryRentalsRepository()
    dayjsDateProvider = new DayjsDateProvider()
    createRentalUseCase = new CreateRentalUseCase(
      inMemoryRentalsRepository,
      dayjsDateProvider,
    )
  })

  it('should be able to create a new Rental', async () => {
    const rental = await createRentalUseCase.execute({
      user_id: '12345',
      car_id: '121212',
      expected_return_date: addOneDay,
    })

    expect(rental).toHaveProperty('id')
    expect(rental).toHaveProperty('start_date')
  })

  it('should NOT be able to create a new Rental if there is another open to the same user', async () => {
    await createRentalUseCase.execute({
      user_id: '12346',
      car_id: '121210',
      expected_return_date: addOneDay,
    })

    const rental = createRentalUseCase.execute({
      user_id: '12346',
      car_id: '121211',
      expected_return_date: addOneDay,
    })

    await expect(rental).rejects.toBeInstanceOf(AppError)
    await expect(rental).rejects.toThrow(
      'There is a rental in progress for user!',
    )
  })

  it('should NOT be able to create a new rental if there is another open to the same car', async () => {
    await createRentalUseCase.execute({
      user_id: '12347',
      car_id: '12',
      expected_return_date: addOneDay,
    })

    const rental = createRentalUseCase.execute({
      user_id: '12348',
      car_id: '12',
      expected_return_date: addOneDay,
    })

    await expect(rental).rejects.toBeInstanceOf(AppError)
    await expect(rental).rejects.toThrow('Car is unavailable')
  })

  it('should NOT be able to create a new Rental with invalid return time', async () => {
    const rental = createRentalUseCase.execute({
      user_id: '3210',
      car_id: '121219',
      expected_return_date: dayjs().toDate(),
    })

    await expect(rental).rejects.toBeInstanceOf(AppError)
    await expect(rental).rejects.toThrow('Invalid return time!')
  })
})
