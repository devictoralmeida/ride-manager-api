import app from '../../../../app'
import { DataSource } from 'typeorm'
import request from 'supertest'
import { AppDataSource } from '../../../../data-source'
import { createAndAuthenticateAdmin } from '@shared/infra/typeorm/seed/test/createAndAuthenticateAdmin'
import { Category } from '@modules/cars/infra/typeorm/entities/Category'

describe('List Categories Controller', () => {
  let connection: DataSource
  let adminToken: string

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((error) => console.error(error))

    const { token } = await createAndAuthenticateAdmin(connection)

    adminToken = token
  }, 100000)

  afterAll(async () => {
    await connection.destroy()
  })

  it('should be able to list all categories', async () => {
    await AppDataSource.getRepository(Category).save({
      name: 'Category Supertest',
      description: 'Category Supertest',
    })

    await AppDataSource.getRepository(Category).save({
      name: 'Category 2',
      description: 'Category 2',
    })

    const response = await request(app)
      .get('/categories')
      .set({
        Authorization: `Bearer ${adminToken}`,
      })

    const expectedResult1 = {
      id: expect.any(String),
      name: 'Category Supertest',
      description: 'Category Supertest',
      created_at: expect.any(String),
    }

    const expectedResult2 = {
      id: expect.any(String),
      name: 'Category 2',
      description: 'Category 2',
      created_at: expect.any(String),
    }

    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(2)
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining(expectedResult1),
        expect.objectContaining(expectedResult2),
      ]),
    )
  })
})
