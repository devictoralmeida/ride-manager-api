import app from '../../../../app'
import { DataSource } from 'typeorm'
import request from 'supertest'
import { AppDataSource } from '../../../../data-source'
import { createAndAuthenticateCommonUser } from '@shared/infra/typeorm/seed/test/createAndAuthenticateCommonUser'
import { Category } from '@modules/cars/infra/typeorm/entities/Category'
import { Car } from '@modules/cars/infra/typeorm/entities/Car'
import dayjs from 'dayjs'
import { createAndAuthenticateAdmin } from '@shared/infra/typeorm/seed/test/createAndAuthenticateAdmin'

describe('Devolution Rental Controller', () => {
  let connection: DataSource
  let adminToken: string
  let commonToken: string

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((error) => console.error(error))

    const { token } = await createAndAuthenticateAdmin(connection)
    const { token: commonUserToken } =
      await createAndAuthenticateCommonUser(connection)

    adminToken = token
    commonToken = commonUserToken
  })

  afterAll(async () => {
    await connection.destroy()
  })

  it('should be possible to make a devolution of a car', async () => {
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

    const addOneDay = dayjs().add(1, 'day').toDate()

    const rental = await request(app)
      .post('/rentals')
      .send({
        car_id: car.id,
        expected_return_date: addOneDay,
      })
      .set({
        Authorization: `Bearer ${adminToken}`,
      })

    const response = await request(app)
      .post(`/rentals/devolution/${rental.body.id}`)
      .set({
        Authorization: `Bearer ${adminToken}`,
      })

    const expectedResult = {
      id: expect.any(String),
      car_id: car.id,
      expected_return_date: expect.any(String),
      user_id: expect.any(String),
      created_at: expect.any(String),
      start_date: expect.any(String),
      updated_at: expect.any(String),
      end_date: expect.any(String),
      total: 50,
    }

    expect(response.statusCode).toBe(200)
    expect(response.body).toStrictEqual(expectedResult)
  })

  it('should NOT be possible to make a devolution of a car when user is not the owner of the rent', async () => {
    const category2 = await AppDataSource.getRepository(Category).save({
      name: 'Category 2',
      description: 'Category 2',
    })

    const car2 = await AppDataSource.getRepository(Car).save({
      name: 'Car 2',
      description: 'Description 2',
      brand: 'Brand 2',
      license_plate: 'ABC-9999',
      category_id: category2.id,
      daily_rate: 50,
      fine_amount: 100,
    })

    const addOneDay = dayjs().add(1, 'day').toDate()

    const rental2 = await request(app)
      .post('/rentals')
      .send({
        car_id: car2.id,
        expected_return_date: addOneDay,
      })
      .set({
        Authorization: `Bearer ${commonToken}`,
      })

    const response = await request(app)
      .post(`/rentals/devolution/${rental2.body.id}`)
      .set({
        Authorization: `Bearer ${adminToken}`,
      })

    const expectedResult = {
      message: 'This rental does not belongs to the user.',
    }

    expect(response.statusCode).toBe(409)
    expect(response.body).toStrictEqual(expectedResult)
  })

  it('should NOT be possible to make a devolution of a car with a invalid token', async () => {
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

  it('should NOT be possible to make a devolution of a car without a token', async () => {
    const response = await request(app).post(`/rentals/devolution/1123213`)

    const expectedResult = {
      message: 'Token missing',
    }

    expect(response.status).toBe(401)
    expect(response.body).toStrictEqual(expectedResult)
  })
})
