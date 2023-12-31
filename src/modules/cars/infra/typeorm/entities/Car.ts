import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Category } from './Category'
import { Specification } from './Specification'
import { v4 as uuidV4 } from 'uuid'

@Entity('cars')
class Car {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 20, unique: true })
  name: string

  @Column({ length: 20 })
  description: string

  @Column()
  daily_rate: number

  @Column({ default: true })
  available: boolean

  @Column({ length: 8 })
  license_plate: string

  @Column()
  fine_amount: number

  @Column({ length: 15 })
  brand: string

  @CreateDateColumn()
  created_at: Date

  @ManyToOne(() => Category)
  @JoinColumn({
    name: 'category_id',
  })
  category: Category

  @Column({ type: 'uuid', nullable: true })
  category_id: string

  @ManyToMany(() => Specification)
  @JoinTable({
    name: 'specifications_cars',
    joinColumns: [{ name: 'car_id' }],
    inverseJoinColumns: [{ name: 'specification_id' }],
  })
  specifications: Specification[]

  constructor() {
    if (!this.id) {
      this.id = uuidV4()
      this.available = true
    }
  }
}

export { Car }
