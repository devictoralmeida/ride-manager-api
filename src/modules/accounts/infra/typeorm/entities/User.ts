import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  email: string

  @Column()
  password: string

  @Column()
  driver_license: string

  @Column({ default: false })
  isAdmin: boolean

  @Column({ type: 'varchar', nullable: true })
  avatar: string

  @CreateDateColumn()
  created_at: Date
}

export { User }
