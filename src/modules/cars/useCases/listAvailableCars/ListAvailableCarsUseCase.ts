import 'reflect-metadata'
import { inject, injectable } from 'tsyringe'
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository'
import { Car } from '@modules/cars/infra/typeorm/entities/Car'

interface IRequest {
  category_id?: string
  brand?: string
  name?: string
}

@injectable()
export class ListAvailableCarsUseCase {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
  ) {}

  async execute({ brand, category_id, name }: IRequest): Promise<Car[]> {
    const cars = await this.carsRepository.findAvailable(
      brand,
      category_id,
      name,
    )
    return cars
  }
}
