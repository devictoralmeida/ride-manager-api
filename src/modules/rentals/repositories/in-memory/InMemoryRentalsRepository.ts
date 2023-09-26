import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental'
import { IRentalsRepository } from '../IRentalsRepository'
import { ICreateRentalDTO } from '@modules/rentals/dtos/ICreateRentalDTO'
import { v4 as uuidV4 } from 'uuid'

export class InMemoryRentalsRepository implements IRentalsRepository {
  async create({
    car_id,
    user_id,
    expected_return_date,
  }: ICreateRentalDTO): Promise<Rental> {
    const rental = new Rental()

    Object.assign(rental, {
      id: uuidV4(),
      created_at: new Date(),
      start_date: new Date(),
      car_id,
      user_id,
      expected_return_date,
    })

    this.rentals.push(rental)
    return rental
  }

  rentals: Rental[] = []

  async findOpenRentalByCar(car_id: string): Promise<Rental> {
    return this.rentals.find(
      (rental) => rental.car_id === car_id && !rental.end_date,
    )
  }

  async findOpenRentalByUser(user_id: string): Promise<Rental> {
    return this.rentals.find(
      (rental) => rental.user_id === user_id && !rental.end_date,
    )
  }

  async findById(id: string): Promise<Rental> {
    return this.rentals.find((rental) => rental.id === id)
  }

  async findByUser(user_id: string): Promise<Rental[]> {
    return this.rentals.filter((rental) => rental.user_id === user_id)
  }
}
