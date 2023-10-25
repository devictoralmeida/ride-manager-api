import app from '../../../../app'
import { DataSource } from 'typeorm'
import request from 'supertest'
import { AppDataSource } from '../../../../data-source'
import { createAndAuthenticateAdmin } from '@shared/infra/typeorm/seed/test/createAndAuthenticateAdmin'
import { Category } from '@modules/cars/infra/typeorm/entities/Category'
import { Car } from '@modules/cars/infra/typeorm/entities/Car'

describe('List Available Cars Controller', () => {
  let connection: DataSource
  let adminToken: string

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((error) => console.error(error))

    const { token } = await createAndAuthenticateAdmin(connection)

    adminToken = token
  })

  afterAll(async () => {
    await connection.destroy()
  })

  it('should be able to list all available cars', async () => {
    const category = await AppDataSource.getRepository(Category).save({
      name: 'Category Supertest',
      description: 'Category Supertest',
    })

    await AppDataSource.getRepository(Car).save({
      name: 'Car Test',
      description: 'Description test',
      brand: 'Brand test',
      license_plate: 'ABC-1234',
      category_id: category.id,
      daily_rate: 50,
      fine_amount: 100,
    })

    await AppDataSource.getRepository(Car).save({
      name: 'Car 2',
      description: 'Description 2',
      brand: 'Brand 2',
      license_plate: 'ABC-9999',
      category_id: category.id,
      daily_rate: 50,
      fine_amount: 100,
    })

    await AppDataSource.getRepository(Car).save({
      name: 'Car 3',
      description: 'Description 3',
      brand: 'Brand 3',
      license_plate: 'ABC-888',
      category_id: category.id,
      daily_rate: 50,
      fine_amount: 100,
      available: false,
    })

    const response = await request(app)
      .get(`/cars/available`)
      .set({
        Authorization: `Bearer ${adminToken}`,
      })

    const expectResult1 = {
      id: expect.any(String),
      name: 'Car Test',
      description: 'Description test',
      brand: 'Brand test',
      license_plate: 'ABC-1234',
      category_id: category.id,
      daily_rate: 50,
      fine_amount: 100,
      created_at: expect.any(String),
    }

    const expectResult2 = {
      id: expect.any(String),
      name: 'Car 2',
      description: 'Description 2',
      brand: 'Brand 2',
      license_plate: 'ABC-9999',
      category_id: category.id,
      daily_rate: 50,
      fine_amount: 100,
      created_at: expect.any(String),
    }

    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(2)
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining(expectResult1),
        expect.objectContaining(expectResult2),
      ]),
    )
  })
})
