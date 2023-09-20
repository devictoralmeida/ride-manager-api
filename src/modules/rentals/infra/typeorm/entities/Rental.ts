import { Car } from '../../../../cars/infra/typeorm/entities/Car'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { v4 as uuidV4 } from 'uuid'

@Entity('rentals')
export class Rental {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid' })
  car_id: string

  @Column({ type: 'uuid' })
  user_id: string

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  start_date: Date

  @Column({ nullable: true })
  end_date: Date

  @Column()
  expected_return_date: Date

  @Column({ nullable: true })
  total: number

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @ManyToOne(() => Car)
  @JoinColumn({ name: 'car_id' })
  car: Car

  constructor() {
    if (!this.id) {
      this.id = uuidV4()
    }
  }
}
