import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Category } from './Category'

@Entity('cars')
class Car {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  description: string

  @Column()
  daily_rate: number

  @Column({ default: true })
  available: boolean

  @Column()
  license_plate: string

  @Column()
  fine_amount: number

  @Column()
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
}

export { Car }
