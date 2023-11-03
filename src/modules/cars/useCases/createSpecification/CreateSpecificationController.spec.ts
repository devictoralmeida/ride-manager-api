import app from '../../../../app'
import { DataSource } from 'typeorm'
import request from 'supertest'
import { AppDataSource } from '../../../../data-source'
import { createAndAuthenticateAdmin } from '@shared/infra/typeorm/seed/test/createAndAuthenticateAdmin'
import { createAndAuthenticateCommonUser } from '@shared/infra/typeorm/seed/test/createAndAuthenticateCommonUser'

describe('Create Specification Controller', () => {
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
  }, 100000)

  afterAll(async () => {
    await connection.destroy()
  })

  it('should be able to create a new specification', async () => {
    const response = await request(app)
      .post('/specifications')
      .send({
        name: 'Specif Name',
        description: 'Specif Description',
      })
      .set({
        Authorization: `Bearer ${adminToken}`,
      })

    const expectedResult = {
      id: expect.any(String),
      name: 'specif name',
      description: 'Specif Description',
      created_at: expect.any(String),
    }

    expect(response.statusCode).toBe(201)
    expect(response.body).toStrictEqual(expectedResult)
  })

  it('should NOT be able to create a new specification with common user token', async () => {
    const response = await request(app)
      .post('/specifications')
      .send({
        name: 'test',
        description: 'test',
      })
      .set({
        Authorization: `Bearer ${commonToken}`,
      })

    expect(response.status).toBe(401)
    expect(response.body).toEqual(
      expect.objectContaining({ message: 'Unauthorized.' }),
    )
  })

  it('should NOT be able to create a new specification with an invalid token', async () => {
    const response = await request(app).post('/specifications').set({
      Authorization: `Bearer 123456`,
    })

    const expectedResult = {
      message: 'Invalid token',
    }

    expect(response.status).toBe(401)
    expect(response.body).toStrictEqual(expectedResult)
  })

  it('should NOT be able to create a new specification without a token', async () => {
    const response = await request(app).post('/specifications')

    const expectedResult = {
      message: 'Token missing',
    }

    expect(response.status).toBe(401)
    expect(response.body).toStrictEqual(expectedResult)
  })
})
