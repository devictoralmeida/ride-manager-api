import { ICreateCarDTO } from '@modules/cars/dtos/ICreateCarDTO'
import { ICarsRepository } from '../ICarsRepository'
import { Car } from '@modules/cars/infra/typeorm/entities/Car'
import { v4 as uuidV4 } from 'uuid'

export class InMemoryCarsRepository implements ICarsRepository {
  cars: Car[] = []

  async create({
    brand,
    daily_rate,
    description,
    fine_amount,
    license_plate,
    name,
    category_id,
    available,
  }: ICreateCarDTO): Promise<Car> {
    const car = new Car()

    Object.assign(car, {
      id: uuidV4(),
      created_at: new Date(),
      available: available ?? true,
      brand,
      daily_rate,
      description,
      fine_amount,
      license_plate,
      name,
      category_id,
    })

    this.cars.push(car)
    return car
  }

  async findByLicensePlate(license_plate: string): Promise<Car | void> {
    return this.cars.find((car) => car.license_plate === license_plate)
  }

  async findAvailable(
    brand?: string,
    category_id?: string,
    name?: string,
  ): Promise<Car[]> {
    const allCars = this.cars.filter((car) => {
      if (
        car.available === true ||
        (brand && car.brand === brand) ||
        (category_id && car.category_id === category_id) ||
        (name && car.name === name)
      ) {
        return car
      }
      return null
    })
    return allCars
  }
}
