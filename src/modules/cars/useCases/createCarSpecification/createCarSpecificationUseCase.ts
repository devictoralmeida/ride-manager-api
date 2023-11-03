import 'reflect-metadata'
import { inject, injectable } from 'tsyringe'
import { Car } from '@modules/cars/infra/typeorm/entities/Car'
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository'
import { ISpecificationRepository } from '@modules/cars/repositories/ISpecificationsRepository'
import AppError from '@shared/errors/AppError'

interface IRequest {
  car_id: string
  specifications_id: string[]
}

@injectable()
export class CreateCarSpecificationUseCase {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,

    @inject('SpecificationsRepository')
    private specificationsRepository: ISpecificationRepository,
  ) {}

  async execute({ car_id, specifications_id }: IRequest): Promise<Car> {
    const carExists = await this.carsRepository.findById(car_id)

    if (!carExists) {
      throw new AppError('Car does not exists!', 404)
    }

    specifications_id.map(async (item) => {
      const specification = await this.specificationsRepository.findById(item)

      if (!specification) {
        throw new AppError('Specifications does not exists!', 404)
      }
      carExists.specifications = [...carExists.specifications, specification]
    })

    const newCar = await this.carsRepository.update(carExists)
    return newCar
  }
}
