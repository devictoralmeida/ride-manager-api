import app from '../../../../app'
import { AppDataSource } from '../../../../data-source'
import request from 'supertest'
import { User } from '@modules/accounts/infra/typeorm/entities/User'
import { DataSource } from 'typeorm'
import { hashSync } from 'bcryptjs'

describe('Authenticate User Controller', () => {
  let connection: DataSource

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((error) => console.error(error))
  }, 100000)

  afterAll(async () => {
    await connection.destroy()
  })

  it('should be able to authenticate an user', async () => {
    await AppDataSource.getRepository(User).save({
      name: 'John Doe',
      email: 'jhon@mail.com',
      password: hashSync('1234', 8),
      driver_license: 'ABC-1234',
    })

    const response = await request(app).post('/sessions').send({
      email: 'jhon@mail.com',
      password: '1234',
    })

    const expectedResult = {
      token: expect.any(String),
      refresh_token: expect.any(String),
      user: {
        name: 'John Doe',
        email: 'jhon@mail.com',
      },
    }

    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual(expectedResult)
  })
})
