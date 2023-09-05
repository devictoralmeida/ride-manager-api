import 'dotenv/config'
import 'reflect-metadata'
import { DataSource, DataSourceOptions } from 'typeorm'
// import path from 'path'

const settings = (): DataSourceOptions => {
  //   const entitiesPath: string = path.join(
  //     __dirname,
  //     './modules/**/entities/**.{ts,js}',
  //   )
  //   const migrationPath: string = path.join(__dirname, './database/**.{ts,js}')

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
    migrations: ['./src/database/migrations/*.ts'],
    entities: ['./src/modules/**/entities/*.ts'],
  }
}

const AppDataSource = new DataSource(settings())

export { AppDataSource }
