import { DataSource } from 'typeorm'
import { v4 as uuidV4 } from 'uuid'
import { hash } from 'bcryptjs'
import request from 'supertest'
import app from '../../../../../app'

export const createAndAuthenticateCommonUser = async (
  connection: DataSource,
) => {
  const password = await hash('1234', 8)
  const id = uuidV4()

  await connection.query(`
    INSERT INTO USERS(id, name, email, password, "isAdmin", created_at, driver_license)
      values('${id}', 'John Doe', 'johndoe@gmail.com', '${password}', false, 'now()', 'ORR-7596');
  `)

  const response = await request(app).post(`/sessions`).send({
    email: 'johndoe@gmail.com',
    password: '1234',
  })

  const { token } = response.body

  return { token }
}
