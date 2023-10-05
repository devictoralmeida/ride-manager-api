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
      entities: ['./dist/modules/**/infra/typeorm/entities/*.{ts,js}'],
    }
  }

  return {
    type: 'postgres',
    host: 'localhost' || process.env.PGHOST,
    port: 6869,
    username: 'docker',
    password: '258794613',
    database: 'rentx',
    logging: true,
    migrations: ['./dist/shared/infra/typeorm/migrations/*.{ts,js}'],
    entities: ['./dist/modules/**/infra/typeorm/entities/*.{ts,js}'],
  }
}

const AppDataSource = new DataSource(settings())

export { AppDataSource }
