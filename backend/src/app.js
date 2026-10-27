import express from 'express'
import cors from 'cors'

import { createDataRoutes } from './routes/data.routes.js'

export const createApp = (dataManager) => {
  const app = express()

  app.use(cors())
  app.use(express.json())

  app.use('/api', createDataRoutes(dataManager))

  app.use((error, req, res, next) => {
    console.error(error)

    res.status(500).json({
      message: 'Internal server error',
    })
  })

  return app
}
