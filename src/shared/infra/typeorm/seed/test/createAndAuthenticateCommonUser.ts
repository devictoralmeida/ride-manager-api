import { DataSource } from 'typeorm'
import { hashSync } from 'bcryptjs'
import request from 'supertest'
import app from '../../../../../app'
import { UsersRepository } from '@modules/accounts/infra/typeorm/repositories/UsersRepository'

export const createAndAuthenticateCommonUser = async (
  connection: DataSource,
) => {
  const usersRepository = new UsersRepository()

  await usersRepository.create({
    email: 'johndoe@gmail.com',
    name: 'John Doe',
    driver_license: 'ORR-7596',
    password: hashSync('1234', 8),
  })

  const response = await request(app).post(`/sessions`).send({
    email: 'johndoe@gmail.com',
    password: '1234',
  })

  const { token } = response.body

  return { token }
}
