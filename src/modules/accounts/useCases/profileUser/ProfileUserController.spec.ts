import app from '../../../../app'
import { AppDataSource } from '../../../../data-source'
import request from 'supertest'
import { User } from '@modules/accounts/infra/typeorm/entities/User'
import { DataSource } from 'typeorm'
import { hashSync } from 'bcryptjs'

describe('Profile User Controller', () => {
  let connection: DataSource

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((error) => console.error(error))
  })

  afterAll(async () => {
    await connection.destroy()
  })

  it('should be able to get user profile', async () => {
    const user = await AppDataSource.getRepository(User).save({
      name: 'John Doe',
      email: 'jhondoe@mail.com',
      password: hashSync('1234', 8),
      driver_license: 'ABC-1234',
    })

    const userResponse = await request(app).post(`/sessions`).send({
      email: 'jhondoe@mail.com',
      password: '1234',
    })

    const { token } = userResponse.body

    const response = await request(app)
      .get('/users/profile')
      .set({
        Authorization: `Bearer ${token}`,
      })

    const expectedResult = {
      id: user.id,
      name: 'John Doe',
      email: 'jhondoe@mail.com',
      driver_license: 'ABC-1234',
      avatar: null,
      avatar_url: null,
      isAdmin: false,
      created_at: expect.any(String),
    }

    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual(expectedResult)
  })

  it('should NOT be able to get user profile without token', async () => {
    const response = await request(app).get('/users/profile').set({
      Authorization: `123`,
    })

    expect(response.status).toBe(401)
    expect(response.body).toStrictEqual({ message: 'Invalid token' })
  })
})
