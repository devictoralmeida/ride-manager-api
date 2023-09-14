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
      entities: ['src/modules/**/entities/*.{ts,js}'],
    }
  }

  return {
    type: 'postgres',
    host: process.env.PGHOST || 'localhost',
    port: 5432,
    username: 'docker',
    password: 'docker',
    database: 'rentx',
    logging: true,
    migrations: ['./src/shared/infra/typeorm/migrations/*.ts'],
    entities: ['./src/modules/**/infra/typeorm/entities/*.ts'],
  }
}

const AppDataSource = new DataSource(settings())

export { AppDataSource }
