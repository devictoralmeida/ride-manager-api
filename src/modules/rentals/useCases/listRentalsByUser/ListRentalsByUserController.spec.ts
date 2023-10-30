import app from '../../../../app'
import { DataSource } from 'typeorm'
import request from 'supertest'
import { AppDataSource } from '../../../../data-source'
import { createAndAuthenticateCommonUser } from '@shared/infra/typeorm/seed/test/createAndAuthenticateCommonUser'
import { Category } from '@modules/cars/infra/typeorm/entities/Category'
import { Car } from '@modules/cars/infra/typeorm/entities/Car'
import dayjs from 'dayjs'

describe('List User Rentals', () => {
  let connection: DataSource

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((error) => console.error(error))
  })

  afterAll(async () => {
    await connection.destroy()
  })

  it('should be able to list all user rentals', async () => {
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

    const addOneDay = dayjs().add(1, 'day').toDate()

    await request(app)
      .post('/rentals')
      .send({
        car_id: car.id,
        expected_return_date: addOneDay,
      })
      .set({
        Authorization: `Bearer ${token}`,
      })

    const response = await request(app)
      .get('/rentals/user')
      .set({
        Authorization: `Bearer ${token}`,
      })

    const expectedResult = [
      {
        id: expect.any(String),
        car_id: car.id,
        expected_return_date: expect.any(String),
        user_id: expect.any(String),
        created_at: expect.any(String),
        start_date: expect.any(String),
        updated_at: expect.any(String),
        end_date: null,
        total: null,
        car: {
          id: car.id,
          available: false,
          name: 'Car Test',
          description: 'Description test',
          daily_rate: 50,
          license_plate: 'ABC-1234',
          fine_amount: 100,
          brand: 'Brand test',
          created_at: expect.any(String),
          category_id: category.id,
        },
      },
    ]

    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual(expectedResult)
  })

  it('should NOT be able to list user rentals with a invalid token', async () => {
    const response = await request(app).get('/rentals/user').set({
      Authorization: `Bearer 123546`,
    })

    const expectedResult = {
      message: 'Invalid token',
    }

    expect(response.status).toBe(401)
    expect(response.body).toStrictEqual(expectedResult)
  })

  it('should NOT be able to list user rentals without a token', async () => {
    const response = await request(app).get('/rentals/user')

    const expectedResult = {
      message: 'Token missing',
    }

    expect(response.status).toBe(401)
    expect(response.body).toStrictEqual(expectedResult)
  })
})
