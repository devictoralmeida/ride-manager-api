import { Repository } from 'typeorm'
import { ICreateCarDTO } from '@modules/cars/dtos/ICreateCarDTO'
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository'
import { Car } from '../entities/Car'
import { v4 as uuidV4 } from 'uuid'
import { AppDataSource } from '../../../../../data-source'

export class CarsRepository implements ICarsRepository {
  private repository: Repository<Car>

  constructor() {
    this.repository = AppDataSource.getRepository(Car)
  }

  async create({
    brand,
    daily_rate,
    description,
    fine_amount,
    license_plate,
    name,
    category_id,
    specifications,
    id,
  }: ICreateCarDTO): Promise<Car> {
    const car = this.repository.create({
      brand,
      daily_rate,
      description,
      fine_amount,
      license_plate,
      name,
      category_id,
      specifications,
      id: id ?? uuidV4(),
    })

    await this.repository.save(car)

    return car
  }

  async findByLicensePlate(license_plate: string): Promise<Car | void> {
    const car = await this.repository.findOneBy({
      license_plate,
    })

    if (!car) {
      return
    }

    return car
  }

  async findById(id: string): Promise<Car> {
    const car = await this.repository.findOneBy({
      id,
    })

    if (!car) {
      return
    }

    return car
  }

  async findAvailable(
    brand?: string,
    category_id?: string,
    name?: string,
  ): Promise<Car[]> {
    const carsQuery = this.repository
      .createQueryBuilder('c')
      .where('available = :available', { available: true })

    if (brand) {
      carsQuery.andWhere('brand = :brand', { brand })
    }

    if (name) {
      carsQuery.andWhere('name = :name', { name })
    }

    if (category_id) {
      carsQuery.andWhere('category_id = :category_id', { category_id })
    }

    const cars = await carsQuery.getMany()
    return cars
  }

  async updateAvailable(id: string, available: boolean): Promise<void> {
    const car = await this.repository
      .createQueryBuilder()
      .update()
      .set({ available })
      .where('id = :id')
      .setParameters({ id })
      .execute()
  }

  async update(car: Car): Promise<Car> {
    await this.repository.save(car)
    return car
  }
}
