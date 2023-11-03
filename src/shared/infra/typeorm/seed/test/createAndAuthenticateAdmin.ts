import { DataSource } from 'typeorm'
import { v4 as uuidV4 } from 'uuid'
import { hash } from 'bcryptjs'
import request from 'supertest'
import app from '../../../../../app'

export const createAndAuthenticateAdmin = async (connection: DataSource) => {
  const password = await hash('admin', 8)
  const id = uuidV4()

  await connection.query(`
    INSERT INTO USERS(id, name, email, password, "isAdmin", created_at, driver_license)
      values('${id}', 'admin', 'admin@ride-manager.com.br', '${password}', true, 'now()', 'XXXXXX');
  `)

  const response = await request(app).post(`/sessions`).send({
    email: 'admin@ride-manager.com.br',
    password: 'admin',
  })

  const { token } = response.body

  return { token }
}
