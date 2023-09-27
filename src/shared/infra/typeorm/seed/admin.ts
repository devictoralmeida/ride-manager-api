import { hash } from 'bcryptjs'
import { AppDataSource } from '../../../../data-source'
import { DataSource } from 'typeorm'
import { v4 as uuidV4 } from 'uuid'

let connection: DataSource

export const create = async () => {
  await AppDataSource.initialize()
    .then((res) => (connection = res))
    .catch((error) => console.error(error))

  const password = await hash('admin', 8)
  const id = uuidV4()

  await connection.query(`
    INSERT INTO USERS(id, name, email, password, "isAdmin", created_at, driver_license)
      values('${id}', 'admin', 'admin@rentx.com.br', '${password}', true, 'now()', 'XXXXXX');
  `)

  await connection.destroy()
}

create().then(() => {
  console.log('User admin created successfully!')
})
