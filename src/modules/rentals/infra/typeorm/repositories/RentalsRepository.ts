import { AppDataSource } from '../../../../../data-source'
import { Repository } from 'typeorm'
import { ICreateRentalDTO } from '@modules/rentals/dtos/ICreateRentalDTO'
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository'
import { Rental } from '../entities/Rental'

export class RentalsRepository implements IRentalsRepository {
  private repository: Repository<Rental>

  constructor() {
    this.repository = AppDataSource.getRepository(Rental)
  }

  async findOpenRentalByCar(car_id: string): Promise<Rental> {
    const foundedOpenByCar = await this.repository.findOne({
      where: {
        car_id,
        end_date: null,
      },
    })
    return foundedOpenByCar
  }

  async findOpenRentalByUser(user_id: string): Promise<Rental> {
    const foundedOpenByUser = await this.repository.findOne({
      where: {
        user_id,
        end_date: null,
      },
    })
    return foundedOpenByUser
  }

  async create({
    car_id,
    user_id,
    expected_return_date,
    id,
    end_date,
    total,
  }: ICreateRentalDTO): Promise<Rental> {
    const rental = this.repository.create({
      car_id,
      expected_return_date,
      user_id,
      id,
      end_date,
      total,
    })

    await this.repository.save(rental)
    return rental
  }

  async findById(id: string): Promise<Rental> {
    const foundedCar = await this.repository.findOneBy({ id })
    return foundedCar
  }

  async findByUser(user_id: string): Promise<Rental[]> {
    const rentals = await this.repository.find({
      where: {
        user_id,
      },
      relations: ['car'],
    })
    return rentals
  }
}
