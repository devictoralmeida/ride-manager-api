import 'reflect-metadata'
import 'express-async-errors'
import express from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerFile from './swagger.json'
import { router } from './routes'

const app = express()

app.use(express.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile)) // Nessa rota ficará nessa doc

app.use(router)

export default app
