import app from '../../../../app'
import { DataSource } from 'typeorm'
import request from 'supertest'
import { AppDataSource } from '../../../../data-source'
import { createAndAuthenticateAdmin } from '@shared/infra/typeorm/seed/test/createAndAuthenticateAdmin'
import { createAndAuthenticateCommonUser } from '@shared/infra/typeorm/seed/test/createAndAuthenticateCommonUser'

describe('Create Car Controller', () => {
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

  // it('should be able to create a new car', async () => {
  //   const category = await request(app)
  //     .post('/categories')
  //     .send({
  //       name: 'Category Supertest',
  //       description: 'Category Supertest',
  //     })
  //     .set({
  //       Authorization: `Bearer ${adminToken}`,
  //     })

  //   const response = await request(app)
  //     .post('/cars')
  //     .send({
  //       name: 'Car Test',
  //       description: 'Description test',
  //       brand: 'Brand test',
  //       license_plate: 'ABC-1234',
  //       category_id: category.body.id,
  //       daily_rate: 50,
  //       fine_amount: 100,
  //     })
  //     .set({
  //       Authorization: `Bearer ${adminToken}`,
  //     })

  //   const expectedResult = {
  //     id: expect.any(String),
  //     name: 'car test',
  //     description: 'Description test',
  //     brand: 'Brand test',
  //     license_plate: 'ABC-1234',
  //     category_id: category.body.id,
  //     daily_rate: 50,
  //     fine_amount: 100,
  //     available: true,
  //     created_at: expect.any(String),
  //   }

  //   expect(response.statusCode).toBe(201)
  //   expect(response.body).toStrictEqual(expectedResult)
  // })

  it('should NOT be able to create a new car with common user token', async () => {
    const category = await request(app)
      .post('/categories')
      .send({
        name: 'Category 2',
        description: 'Supertest 2',
      })
      .set({
        Authorization: `Bearer ${adminToken}`,
      })

    const { token } = await createAndAuthenticateCommonUser(connection)

    const response = await request(app)
      .post('/cars')
      .send({
        name: 'Test 2',
        description: 'test 2',
        brand: 'test',
        license_plate: 'ACD-1234',
        category_id: category.body.id,
        daily_rate: 50,
        fine_amount: 100,
      })
      .set({
        Authorization: `Bearer ${token}`,
      })

    console.log(response.body)

    expect(response.status).toBe(401)
    expect(response.body).toEqual(
      expect.objectContaining({ message: 'Unauthorized.' }),
    )
  })
})
