import { In, Repository } from 'typeorm'
import {
  ISpecificationRepository,
  ICreateSpecificationDTO,
} from '@modules/cars/repositories/ISpecificationsRepository'
import { AppDataSource } from '../../../../../data-source'
import { Specification } from '../entities/Specification'

export class SpecificationsRepository implements ISpecificationRepository {
  private repository: Repository<Specification>

  constructor() {
    this.repository = AppDataSource.getRepository(Specification)
  }

  async findByIds(ids: string[]): Promise<Specification[]> {
    const specifications = await this.repository.find({
      where: { id: In(ids) },
    })
    return specifications
  }

  async create({
    name,
    description,
  }: ICreateSpecificationDTO): Promise<Specification> {
    const specification = this.repository.create({ name, description })
    await this.repository.save(specification)
    return specification
  }

  async findByName(name: string): Promise<Specification | null> {
    const specification = await this.repository.findOneBy({
      name,
    })

    return specification
  }
}
