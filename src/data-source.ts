import 'dotenv/config'
import 'reflect-metadata'
import { DataSource, DataSourceOptions } from 'typeorm'

const settings = (): DataSourceOptions => {
  const nodeEnv: string | undefined = process.env.NODE_ENV

  if (nodeEnv === 'test') {
    return {
      type: 'sqlite',
      database: ':memory:',
      synchronize: true,
      entities: ['./src/modules/**/infra/typeorm/entities/*.{ts,js}'],
    }
  }

  return {
    type: 'postgres',
    host: 'localhost' || process.env.PGHOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    migrations: ['./src/shared/infra/typeorm/migrations/*.{ts,js}'],
    entities: ['./src/modules/**/infra/typeorm/entities/*.{ts,js}'],
  }
}

const AppDataSource = new DataSource(settings())

export { AppDataSource }
