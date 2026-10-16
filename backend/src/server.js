
import express from 'express'
import cors from 'cors'

import { RepositoryFactory } from './factories/repository.factory.js'
import { DataManager } from './services/data.service.js'
import { createDataRoutes } from './routes/data.routes.js'

const app = express()

app.use(cors())
app.use(express.json())

const repositoryFactory = new RepositoryFactory()
const dataManager = new DataManager(repositoryFactory)

app.use('/api', createDataRoutes(dataManager))

app.use((error, req, res, next) => {
  console.error(error)

  res.status(500).json({
    message: 'Internal server error',
  })
})

const PORT = 3000

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})