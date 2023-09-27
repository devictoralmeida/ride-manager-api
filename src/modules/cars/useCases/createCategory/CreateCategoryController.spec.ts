import app from '../../../../app'
import { DataSource } from 'typeorm'
import request from 'supertest'
import { hashSync } from 'bcryptjs'
import { v4 as uuidV4 } from 'uuid'
import { AppDataSource } from '../../../../data-source'

describe('Create Category Controller', () => {
  let connection: DataSource

  beforeAll(async () => {
    process.env.SECRET_KEY = 'testing'
    process.env.EXPIRES_IN = '24h'

    connection = await AppDataSource.initialize()
    const password = hashSync('admin', 8)
    const id = uuidV4()

    await connection.query(`
      INSERT INTO USERS(id, name, email, password, "isAdmin", created_at, driver_license)
        values('${id}', 'admin', 'admin@rentx.com.br', '${password}', true, 'now()', 'XXXXXX');
    `)
  })

  afterAll(async () => {
    await connection.destroy()
  })

  it('should be able to create a new category', async () => {
    const responseToken = await request(app).post(`/sessions`).send({
      email: 'admin@rentx.com.br',
      password: 'admin',
    })

    const { token } = responseToken.body

    const response = await request(app)
      .post('/categories')
      .send({
        name: 'Category Supertest',
        description: 'Category Supertest',
      })
      .set({
        Authorization: `Bearer ${token}`,
      })

    const expectedResult = {
      id: expect.any(String),
      name: 'Category Supertest',
      description: 'Category Supertest',
      created_at: expect.any(String),
    }

    expect(response.status).toBe(201)
    expect(response.body).toStrictEqual(expectedResult)
  })

  it('should NOT be able to create a new category with name in duplicity', async () => {
    const responseToken = await request(app).post(`/sessions`).send({
      email: 'admin@rentx.com.br',
      password: 'admin',
    })

    const { token } = responseToken.body

    const response = await request(app)
      .post('/categories')
      .send({
        name: 'Category Supertest',
        description: 'Category Supertest',
      })
      .set({
        Authorization: `Bearer ${token}`,
      })

    expect(response.status).toBe(409)
    expect(response.body).toStrictEqual({ message: 'Category already exists!' })
  })
})
