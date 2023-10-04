import 'reflect-metadata'
import 'express-async-errors'
import 'dotenv/config'
import './shared/container'
import express from 'express'
import upload from '@config/upload'
import swaggerUi from 'swagger-ui-express'
import swaggerFile from './swagger.json'
import { router } from './shared/infra/http/routes'
import { handleErrors } from './shared/infra/http/middlewares/handleErrors'

const app = express()

app.use(express.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile)) // Nessa rota ficará nessa doc

app.use('/avatar', express.static(`${upload.tmpFolder}/avatar`))
app.use('/cars', express.static(`${upload.tmpFolder}/cars`))

app.use(router)

app.use(handleErrors)

export default app
