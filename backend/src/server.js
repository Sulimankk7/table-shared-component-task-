import express from 'express'
import cors from 'cors'

import dataRoutes from './routes/data.routes.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api', dataRoutes)

const PORT = 3000

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})