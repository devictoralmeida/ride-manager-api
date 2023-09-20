import { AppDataSource } from 'data-source'
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
    const foundedOpenByCar = await this.repository.findOneBy({ car_id })
    return foundedOpenByCar
  }

  async findOpenRentalByUser(user_id: string): Promise<Rental> {
    const foundedOpenByUser = await this.repository.findOneBy({ user_id })
    return foundedOpenByUser
  }

  async create({
    car_id,
    user_id,
    expected_return_date,
  }: ICreateRentalDTO): Promise<Rental> {
    const rental = this.repository.create({
      car_id,
      expected_return_date,
      user_id,
    })

    await this.repository.save(rental)
    return rental
  }
}
