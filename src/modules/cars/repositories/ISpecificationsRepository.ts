import { Specification } from '../infra/typeorm/entities/Specification'

export interface ICreateSpecificationDTO {
  name: string
  description: string
}
export interface ISpecificationRepository {
  create({ name, description }: ICreateSpecificationDTO): Promise<Specification>
  findByName(name: string): Promise<Specification | null>
  findByIds(ids: string[]): Promise<Specification[] | null>
}
