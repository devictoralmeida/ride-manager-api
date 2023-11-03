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
    port: 65432,
    username: 'docker',
    password: '258794613',
    // logging: true,
    database: 'ride-manager',
    migrations: ['./src/shared/infra/typeorm/migrations/*.{ts,js}'],
    entities: ['./src/modules/**/infra/typeorm/entities/*.{ts,js}'],
  }
}

const AppDataSource = new DataSource(settings())

export { AppDataSource }
