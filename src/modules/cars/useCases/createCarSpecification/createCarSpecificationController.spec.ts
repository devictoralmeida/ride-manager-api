import app from '../../../../app'
import { DataSource } from 'typeorm'
import request from 'supertest'
import { AppDataSource } from '../../../../data-source'
import { createAndAuthenticateAdmin } from '@shared/infra/typeorm/seed/test/createAndAuthenticateAdmin'
import { createAndAuthenticateCommonUser } from '@shared/infra/typeorm/seed/test/createAndAuthenticateCommonUser'
import { Category } from '@modules/cars/infra/typeorm/entities/Category'
import { Car } from '@modules/cars/infra/typeorm/entities/Car'
import { Specification } from '@modules/cars/infra/typeorm/entities/Specification'

describe('Create Car Specification Controller', () => {
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

  it('should be able to create a new specification to an existent car', async () => {
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

    const specification = await AppDataSource.getRepository(Specification).save(
      {
        name: 'Specif Name',
        description: 'Specif Desc',
      },
    )

    const specification2 = await AppDataSource.getRepository(
      Specification,
    ).save({
      name: 'Specif test',
      description: 'Specif test',
    })

    const response = await request(app)
      .post(`/cars/specifications/${car.id}`)
      .send({
        specifications_id: [`${specification.id}`, `${specification2.id}`],
      })
      .set({
        Authorization: `Bearer ${adminToken}`,
      })

    const specificationMock = {
      id: expect.any(String),
      name: 'Specif Name',
      description: 'Specif Desc',
      created_at: expect.any(String),
    }

    const specificationMock2 = {
      id: expect.any(String),
      name: 'Specif test',
      description: 'Specif test',
      created_at: expect.any(String),
    }

    const expectedResult = {
      id: expect.any(String),
      name: 'Car Test',
      description: 'Description test',
      brand: 'Brand test',
      license_plate: 'ABC-1234',
      category_id: category.id,
      daily_rate: 50,
      fine_amount: 100,
      available: true,
      specifications: expect.arrayContaining([
        expect.objectContaining(specificationMock),
        expect.objectContaining(specificationMock2),
      ]),
      created_at: expect.any(String),
    }

    expect(response.status).toBe(201)
    expect(response.body.specifications).toHaveLength(2)
    expect(response.body).toEqual(expectedResult)
  })

  it('should NOT be able to create a new specification to an existent car with common user token', async () => {
    const category = await AppDataSource.getRepository(Category).save({
      name: 'Category 1',
      description: 'Category 2',
    })

    const car = await AppDataSource.getRepository(Car).save({
      name: 'Car 5',
      description: 'Description 5',
      brand: 'Brand 5',
      license_plate: 'ABC-1234',
      category_id: category.id,
      daily_rate: 50,
      fine_amount: 100,
    })

    const specification = await AppDataSource.getRepository(Specification).save(
      {
        name: 'Specif 3',
        description: 'Specif 4',
      },
    )

    const response = await request(app)
      .post(`/cars/specifications/${car.id}`)
      .send({
        specifications_id: [`${specification.id}`],
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
