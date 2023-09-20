import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Car } from './Car'
import { v4 as uuidV4 } from 'uuid'

@Entity('categories')
class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  description: string

  @CreateDateColumn()
  created_at: Date

  @OneToMany(() => Car, (car) => car.category_id)
  cars: Car[]

  constructor() {
    if (!this.id) {
      this.id = uuidV4()
    }
  }
}

export { Category }
