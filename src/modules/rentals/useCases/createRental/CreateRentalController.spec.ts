import app from '../../../../app'
import { DataSource } from 'typeorm'
import request from 'supertest'
import { AppDataSource } from '../../../../data-source'
import { createAndAuthenticateCommonUser } from '@shared/infra/typeorm/seed/test/createAndAuthenticateCommonUser'
import { Category } from '@modules/cars/infra/typeorm/entities/Category'
import { Car } from '@modules/cars/infra/typeorm/entities/Car'
import dayjs from 'dayjs'

describe('Create Rental Controller', () => {
  let connection: DataSource

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((error) => console.error(error))
  }, 100000)

  afterAll(async () => {
    await connection.destroy()
  })

  it('should be able to create a new rental to an car', async () => {
    const category = await AppDataSource.getRepository(Category).save({
      name: 'Category Supertest',
      description: 'Category Supertest',
    })

    const car = await AppDataSource.getRepository(Car).save({
      name: 'Car Test',
      description: 'Description test',
      brand: 'Brand test',
      license_plate: 'ABC-1234',
      category_id: category.id,
      daily_rate: 50,
      fine_amount: 100,
    })

    const { token } = await createAndAuthenticateCommonUser(connection)

    const addTwoDays = dayjs().add(2, 'day').toDate()

    const response = await request(app)
      .post('/rentals')
      .send({
        car_id: car.id,
        expected_return_date: addTwoDays,
      })
      .set({
        Authorization: `Bearer ${token}`,
      })

    const expectedResult = {
      id: expect.any(String),
      car_id: car.id,
      expected_return_date: expect.any(String),
      user_id: expect.any(String),
      created_at: expect.any(String),
      start_date: expect.any(String),
      updated_at: expect.any(String),
      end_date: null,
      total: null,
    }

    expect(response.statusCode).toBe(201)
    expect(response.body).toStrictEqual(expectedResult)
  })

  it('should NOT be possible to create a new rent with an invalid token', async () => {
    const response = await request(app)
      .post(`/rentals/devolution/1123213`)
      .set({
        Authorization: `Bearer 123546`,
      })

    const expectedResult = {
      message: 'Invalid token',
    }

    expect(response.status).toBe(401)
    expect(response.body).toStrictEqual(expectedResult)
  })

  it('should NOT be possible to create a new rent without a token', async () => {
    const response = await request(app).post(`/rentals/devolution/1123213`)

    const expectedResult = {
      message: 'Token missing',
    }

    expect(response.status).toBe(401)
    expect(response.body).toStrictEqual(expectedResult)
  })
})
