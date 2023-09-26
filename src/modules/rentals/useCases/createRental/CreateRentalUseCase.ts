import 'reflect-metadata'
import { inject, injectable } from 'tsyringe'
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository'
import AppError from '@shared/errors/AppError'
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository'

interface IRequest {
  user_id: string
  car_id: string
  expected_return_date: Date
}

@injectable()
export class CreateRentalUseCase {
  constructor(
    @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository,

    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,

    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
  ) {}

  async execute({
    car_id,
    expected_return_date,
    user_id,
  }: IRequest): Promise<Rental> {
    const isCarUnavailable =
      await this.rentalsRepository.findOpenRentalByCar(car_id)

    if (isCarUnavailable) throw new AppError('Car is unavailable', 409)

    const rentalOpenToUser =
      await this.rentalsRepository.findOpenRentalByUser(user_id)

    if (rentalOpenToUser)
      throw new AppError('There is a rental in progress for user!', 409)

    const minimumRentTimeInHours = 24

    const dateNow = this.dateProvider.dateNow()

    const compare = this.dateProvider.compareInHours(
      dateNow,
      expected_return_date,
    )

    if (compare < minimumRentTimeInHours) {
      throw new AppError('Invalid return time!', 409)
    }

    const rental = await this.rentalsRepository.create({
      car_id,
      expected_return_date,
      user_id,
    })

    await this.carsRepository.updateAvailable(car_id, false)

    return rental
  }
}
