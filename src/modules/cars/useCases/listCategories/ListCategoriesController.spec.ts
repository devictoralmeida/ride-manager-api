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

  it('should be able to list all categories', async () => {
    const responseToken = await request(app).post(`/sessions`).send({
      email: 'admin@rentx.com.br',
      password: 'admin',
    })

    const { token } = responseToken.body

    await request(app)
      .post('/categories')
      .send({
        name: 'Category Supertest',
        description: 'Category Supertest',
      })
      .set({
        Authorization: `Bearer ${token}`,
      })

    await request(app)
      .post('/categories')
      .send({
        name: 'Category Supertest 2',
        description: 'Category Supertest 2',
      })
      .set({
        Authorization: `Bearer ${token}`,
      })

    const response = await request(app)
      .get('/categories')
      .set({
        Authorization: `Bearer ${token}`,
      })

    const expectedResult1 = {
      id: expect.any(String),
      name: 'Category Supertest',
      description: 'Category Supertest',
      created_at: expect.any(String),
    }

    const expectedResult2 = {
      id: expect.any(String),
      name: 'Category Supertest 2',
      description: 'Category Supertest 2',
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
