import { Specification } from '@modules/cars/infra/typeorm/entities/Specification'
import {
  ICreateSpecificationDTO,
  ISpecificationRepository,
} from '../ISpecificationsRepository'
import { v4 as uuidV4 } from 'uuid'

export class InMemorySpecificationsRepository
  implements ISpecificationRepository
{
  specifications: Specification[] = []

  async create({
    name,
    description,
  }: ICreateSpecificationDTO): Promise<Specification> {
    const specification = new Specification()

    Object.assign(specification, {
      id: uuidV4(),
      created_at: new Date(),
      name,
      description,
    })

    this.specifications.push(specification)
    return specification
  }

  async findByName(name: string): Promise<Specification> {
    const findedSpecification = this.specifications.find(
      (specification) => specification.name === name,
    )

    return findedSpecification
  }

  async findByIds(ids: string[]): Promise<Specification[]> {
    const allSpecifications = this.specifications.filter((specification) =>
      ids.includes(specification.id),
    )

    return allSpecifications
  }

  async findById(id: string): Promise<Specification> {
    const findedSpecification = this.specifications.find(
      (specification) => specification.id === id,
    )

    return findedSpecification
  }
}
