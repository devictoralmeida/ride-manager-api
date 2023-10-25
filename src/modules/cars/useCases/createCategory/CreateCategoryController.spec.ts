import app from '../../../../app'
import { DataSource } from 'typeorm'
import request from 'supertest'
import { AppDataSource } from '../../../../data-source'
import { createAndAuthenticateAdmin } from '@shared/infra/typeorm/seed/test/createAndAuthenticateAdmin'
import { createAndAuthenticateCommonUser } from '@shared/infra/typeorm/seed/test/createAndAuthenticateCommonUser'

describe('Create Category Controller', () => {
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

  it('should be able to create a new category', async () => {
    const response = await request(app)
      .post('/categories')
      .send({
        name: 'Category Supertest',
        description: 'Category Supertest',
      })
      .set({
        Authorization: `Bearer ${adminToken}`,
      })

    const expectedResult = {
      id: expect.any(String),
      name: 'category supertest',
      description: 'Category Supertest',
      created_at: expect.any(String),
    }

    expect(response.status).toBe(201)
    expect(response.body).toStrictEqual(expectedResult)
  })

  it('should NOT be able to create a new category with common user token', async () => {
    const response = await request(app)
      .post('/categories')
      .send({
        name: 'Category Supertest 2',
        description: 'Category Supertest 2',
      })
      .set({
        Authorization: `Bearer ${commonToken}`,
      })

    expect(response.status).toBe(401)
    expect(response.body).toEqual(
      expect.objectContaining({ message: 'Unauthorized.' }),
    )
  })
})
