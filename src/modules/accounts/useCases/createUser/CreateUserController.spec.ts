import app from '../../../../app'
import { AppDataSource } from '../../../../data-source'
import request from 'supertest'
import { DataSource } from 'typeorm'

describe('Create User Controller', () => {
  let connection: DataSource

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((error) => console.error(error))
  }, 100000)

  afterAll(async () => {
    await connection.destroy()
  })

  it('should be able to create a new user', async () => {
    const response = await request(app).post('/users').send({
      name: 'John Doe',
      email: 'jhon@mail.com',
      password: '1234',
      driver_license: 'ABC-1234',
    })

    const expectedResult = {
      id: expect.any(String),
      name: 'john doe',
      email: 'jhon@mail.com',
      driver_license: 'ABC-1234',
      avatar: null,
      avatar_url: null,
      isAdmin: false,
      created_at: expect.any(String),
    }

    expect(response.status).toBe(201)
    expect(response.body).toStrictEqual(expectedResult)
  })
})
