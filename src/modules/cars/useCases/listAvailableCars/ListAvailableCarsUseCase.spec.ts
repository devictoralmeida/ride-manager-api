import { CreateCarUseCase } from '../createCar/CreateCarUseCase'
import { InMemoryCarsRepository } from '@modules/cars/repositories/in-memory/InMemoryCarsRepository'
import { ListAvailableCarsUseCase } from './ListAvailableCarsUseCase'

let inMemoryCarsRepository: InMemoryCarsRepository
let listAvailableCarsUseCase: ListAvailableCarsUseCase
let createCarUseCase: CreateCarUseCase

describe('List Cars', () => {
  beforeEach(() => {
    inMemoryCarsRepository = new InMemoryCarsRepository()
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(
      inMemoryCarsRepository,
    )
    createCarUseCase = new CreateCarUseCase(inMemoryCarsRepository)
  })

  it('should be able to list all available cars', async () => {
    const car1 = await inMemoryCarsRepository.create({
      brand: 'Car_brand',
      daily_rate: 150,
      description: 'Car description',
      fine_amount: 100,
      license_plate: 'JKL-1580',
      name: 'Car 1',
      category_id: 'category_id',
    })

    const car2 = await inMemoryCarsRepository.create({
      brand: 'Car_brand',
      daily_rate: 150,
      description: 'Car description',
      fine_amount: 100,
      license_plate: 'JKL-1586',
      name: 'Car 2',
      category_id: 'category_id',
    })

    const cars = await listAvailableCarsUseCase.execute({})

    expect(cars).toHaveLength(2)
    expect(cars).toEqual([car1, car2])
  })

  // it('should NOT be able to list a unavailable car', async () => {
  //   const car1 = await inMemoryCarsRepository.create({
  //     brand: 'Car_brand',
  //     daily_rate: 150,
  //     description: 'Car description',
  //     fine_amount: 100,
  //     license_plate: 'JKL-1585',
  //     name: 'Car 1',
  //     category_id: 'category_id',
  //     available: false,
  //   })

  //   const cars = await listAvailableCarsUseCase.execute()

  //   expect(cars).toHaveLength(2)
  //   expect(cars).toEqual([car1, car2])
  // })

  it('should be able to list all available cars by name', async () => {
    const car1 = await inMemoryCarsRepository.create({
      brand: 'Car_brand',
      daily_rate: 150,
      description: 'Car description',
      fine_amount: 100,
      license_plate: 'JKL-1585',
      name: 'Car_list_test',
      category_id: 'category_id',
    })

    const cars = await listAvailableCarsUseCase.execute({
      name: 'Car_list_test',
    })

    expect(cars).toHaveLength(1)
    expect(cars).toEqual([car1])
  })

  it('should be able to list all available cars by brand', async () => {
    const car1 = await inMemoryCarsRepository.create({
      brand: 'Car_brand_test',
      daily_rate: 150,
      description: 'Car description',
      fine_amount: 100,
      license_plate: 'JKL-1587',
      name: 'Car 3',
      category_id: 'category_id',
    })

    const cars = await listAvailableCarsUseCase.execute({
      brand: 'Car_brand_test',
    })

    expect(cars).toHaveLength(1)
    expect(cars).toEqual([car1])
  })

  it('should be able to list all available cars by category', async () => {
    const car1 = await inMemoryCarsRepository.create({
      brand: 'Car_brand_',
      daily_rate: 150,
      description: 'Car description',
      fine_amount: 100,
      license_plate: 'JKL-1590',
      name: 'Car 4',
      category_id: '12345',
    })

    const cars = await listAvailableCarsUseCase.execute({
      category_id: '12345',
    })

    expect(cars).toHaveLength(1)
    expect(cars).toEqual([car1])
  })
})
