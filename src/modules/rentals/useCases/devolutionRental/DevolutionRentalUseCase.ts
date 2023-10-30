import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository'
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental'
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import AppError from '@shared/errors/AppError'
import { injectable, inject } from 'tsyringe'

interface IRequest {
  id: string
  user_id: string
}

@injectable()
export class DevolutionRentalUseCase {
  constructor(
    @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository,

    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,

    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
  ) {}

  async execute({ id, user_id }: IRequest): Promise<Rental> {
    const rental = await this.rentalsRepository.findById(id)

    if (!rental) {
      throw new AppError('Rental does not exists.', 404)
    }

    const car = await this.carsRepository.findById(rental.car_id)

    if (!car) {
      throw new AppError('Car does not exists.', 404)
    }

    if (rental.user_id !== user_id) {
      throw new AppError('This rental does not belongs to the user.', 409)
    }

    const minimum_daily = 1

    let dailiesNumber = this.dateProvider.compareInDays(
      rental.start_date,
      this.dateProvider.dateNow(),
    )

    if (dailiesNumber <= 0) {
      dailiesNumber = minimum_daily
    }

    rental.end_date = this.dateProvider.dateNow()

    const delay = this.dateProvider.compareInDays(
      rental.expected_return_date,
      rental.end_date,
    )

    let total = 0

    if (delay > 0) {
      const calculate_fine = delay * car.fine_amount
      total = calculate_fine
    }

    total += dailiesNumber * car.daily_rate

    rental.total = total

    await this.rentalsRepository.create(rental)
    await this.carsRepository.updateAvailable(car.id, true)
    return rental
  }
}
