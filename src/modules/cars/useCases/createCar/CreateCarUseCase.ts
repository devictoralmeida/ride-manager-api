import { inject, injectable } from 'tsyringe'
import { Car } from '@modules/cars/infra/typeorm/entities/Car'
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository'
import AppError from '@shared/errors/AppError'

interface IRequest {
  name: string
  description: string
  daily_rate: number
  fine_amount: number
  brand: string
  license_plate: string
  category_id: string
}

@injectable()
export class CreateCarUseCase {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
  ) {}

  async execute({
    brand,
    daily_rate,
    description,
    fine_amount,
    license_plate,
    name,
    category_id,
  }: IRequest): Promise<Car> {
    const carAlreadyExists =
      await this.carsRepository.findByLicensePlate(license_plate)

    if (carAlreadyExists) {
      throw new AppError('Car already exists!', 409)
    }

    const car = await this.carsRepository.create({
      brand,
      daily_rate,
      description,
      fine_amount,
      license_plate,
      name,
      category_id,
    })

    return car
  }
}
