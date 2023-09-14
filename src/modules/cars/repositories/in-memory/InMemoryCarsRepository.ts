import { ICreateCarDTO } from '@modules/cars/dtos/ICreateCarDTO'
import { ICarsRepository } from '../ICarsRepository'
import { Car } from '@modules/cars/infra/typeorm/entities/Car'

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
  }: ICreateCarDTO): Promise<Car> {
    const car = new Car()

    Object.assign(car, {
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
}
