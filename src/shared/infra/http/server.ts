import app from '../../../app'
import { AppDataSource } from '../../../data-source'

import '../../container'

const PORT: number = Number(process.env.PORT) || 3333

AppDataSource.initialize()
  .then(async () => {
    console.log('Server is running')

    app.listen(PORT, () =>
      console.log(`🚀 Server is running on http://localhost:${PORT}`),
    )
  })
  .catch((err: unknown): void => {
    console.error('Error during Data Source initialization', err)
  })
