import 'express-async-errors'
import 'reflect-metadata'
import 'dotenv/config'
import './shared/container'
import * as Sentry from '@sentry/node'
import { ProfilingIntegration } from '@sentry/profiling-node'
import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import upload from '@config/upload'
import swaggerUi from 'swagger-ui-express'
import swaggerFile from './swagger.json'
import { router } from './shared/infra/http/routes'
import { handleErrors } from './shared/infra/http/middlewares/handleErrors'
import { rateLimitMiddleware } from '@shared/infra/http/middlewares/rateLimiter'
import AppError from '@shared/errors/AppError'
import { z } from 'zod'

const app = express()

// app.use(rateLimitMiddleware)

// Sentry.init({
//   dsn: process.env.SENTRY_DSN,
//   integrations: [
//     new Sentry.Integrations.Http({ tracing: true }),
//     new Sentry.Integrations.Express({ app }),
//     new ProfilingIntegration(),
//   ],
//   tracesSampleRate: 1.0,
//   profilesSampleRate: 1.0,
// })

// app.use(Sentry.Handlers.requestHandler())
// app.use(Sentry.Handlers.tracingHandler())

app.use(express.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.use('/avatar', express.static(`${upload.tmpFolder}/avatar`))
app.use('/cars', express.static(`${upload.tmpFolder}/cars`))

app.use(cors())

app.use(router)

app.use(handleErrors)

// app.use(Sentry.Handlers.errorHandler())

// app.use(
//   (err: Error, request: Request, response: Response, next: NextFunction) => {
//     if (err instanceof AppError) {
//       return response.status(err.statusCode).json({
//         message: err.message,
//       })
//     }
//     if (err instanceof z.ZodError) {
//       return response.status(400).json({ message: err.flatten().fieldErrors })
//     }
//     return response.status(500).json({
//       status: 'error',
//       message: `Internal server error - ${err.message}`,
//     })
//   },
// )

export default app
