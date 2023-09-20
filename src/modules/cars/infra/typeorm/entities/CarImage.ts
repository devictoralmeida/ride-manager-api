import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Car } from './Car'
import { v4 as uuidV4 } from 'uuid'

@Entity('cars_image')
class CarImage {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid' })
  car_id: string

  @Column()
  image_name: string

  @CreateDateColumn()
  created_at: Date

  @ManyToOne(() => Car)
  @JoinColumn({
    name: 'car_id',
  })
  car: Car

  constructor() {
    if (!this.id) {
      this.id = uuidV4()
    }
  }
}

export { CarImage }
