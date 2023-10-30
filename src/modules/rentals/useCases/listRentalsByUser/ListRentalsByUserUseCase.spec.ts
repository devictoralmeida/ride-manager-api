import AppError from '@shared/errors/AppError'
import { InMemoryRentalsRepository } from './../../repositories/in-memory/InMemoryRentalsRepository'
import { ListRentalsByUserUseCase } from './ListRentalsByUserUseCase'
import dayjs from 'dayjs'
import { InMemoryCarsRepository } from '@modules/cars/repositories/in-memory/InMemoryCarsRepository'
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider'
import { CreateRentalUseCase } from '../createRental/CreateRentalUseCase'

let listRentalUseCase: ListRentalsByUserUseCase
let inMemoryRentalsRepository: InMemoryRentalsRepository

let createRentalUseCase: CreateRentalUseCase
let dayjsDateProvider: DayjsDateProvider
let inMemoryCarsRepository: InMemoryCarsRepository

describe('Create Rental', () => {
  beforeEach(() => {
    inMemoryRentalsRepository = new InMemoryRentalsRepository()

    dayjsDateProvider = new DayjsDateProvider()

    inMemoryCarsRepository = new InMemoryCarsRepository()

    listRentalUseCase = new ListRentalsByUserUseCase(inMemoryRentalsRepository)

    createRentalUseCase = new CreateRentalUseCase(
      inMemoryRentalsRepository,
      dayjsDateProvider,
      inMemoryCarsRepository,
    )
  })

  it('should be able to list all Rentals by user', async () => {
    const addOneDay = dayjs().add(1, 'day').toDate()
    const addThreeDays = dayjs().add(3, 'day').toDate()

    const rental1 = await inMemoryRentalsRepository.create({
      user_id: 'e9f0e4f8-2f78-49fe-a837-7cc9795e2c73',
      car_id: '542178ba-4b49-4d96-acde-542694227952',
      expected_return_date: addOneDay,
    })

    const now = dayjsDateProvider.dateNow()

    rental1.end_date = now

    const rental2 = await inMemoryRentalsRepository.create({
      user_id: 'e9f0e4f8-2f78-49fe-a837-7cc9795e2c73',
      car_id: '3c1a8c11-c59c-4395-8944-7c7ae380af0e',
      expected_return_date: addThreeDays,
    })

    const result = await listRentalUseCase.execute(
      'e9f0e4f8-2f78-49fe-a837-7cc9795e2c73',
    )

    const expectedResults = [
      {
        id: rental1.id,
        user_id: 'e9f0e4f8-2f78-49fe-a837-7cc9795e2c73',
        car_id: '542178ba-4b49-4d96-acde-542694227952',
        created_at: expect.any(Date),
        end_date: now,
        start_date: expect.any(Date),
        expected_return_date: addOneDay,
      },
      {
        id: rental2.id,
        user_id: 'e9f0e4f8-2f78-49fe-a837-7cc9795e2c73',
        car_id: '3c1a8c11-c59c-4395-8944-7c7ae380af0e',
        expected_return_date: addThreeDays,
        created_at: expect.any(Date),
        start_date: expect.any(Date),
      },
    ]

    expect(result).toHaveLength(2)
    expect(result).toEqual(expectedResults)
  })
})
