import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { v4 as uuidV4 } from 'uuid'

@Entity('specifications')
class Specification {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 20, unique: true })
  name: string

  @Column({ length: 20 })
  description: string

  @CreateDateColumn()
  created_at: Date

  constructor() {
    if (!this.id) {
      this.id = uuidV4()
    }
  }
}

export { Specification }
