import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm'
import { v4 as uuidV4 } from 'uuid'
import { Expose } from 'class-transformer'
import { getRounds, hashSync } from 'bcryptjs'

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: '45' })
  name: string

  @Column({ length: '45', unique: true })
  email: string

  @Column({ length: '120' })
  password: string

  @Column({ length: '10' })
  driver_license: string

  @Column({ default: false })
  isAdmin: boolean

  @Column({ type: 'varchar', nullable: true, default: null })
  avatar: string

  @CreateDateColumn()
  created_at: Date

  @Expose({ name: 'avatar_url' })
  avatar_url(): string | null {
    if (this.avatar !== null) {
      switch (process.env.DISK) {
        case 'local':
          return `${process.env.APP_API_URL}/avatar/${this.avatar}`
        case 's3':
          return `${process.env.AWS_BUCKET_BASE_URL}/avatar/${this.avatar}`
        default:
          return null
      }
    } else {
      return null
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    const isPasswordEncrypted: number = getRounds(this.password)

    if (!isPasswordEncrypted) {
      this.password = hashSync(this.password, 8)
    }
  }

  constructor() {
    if (!this.id) {
      this.id = uuidV4()
    }
  }
}

export { User }
