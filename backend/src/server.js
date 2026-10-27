
import { RepositoryFactory } from './factories/repository.factory.js'
import { DataManager } from './services/data.service.js'
import { createApp } from './app.js'

const repositoryFactory = new RepositoryFactory()
const dataManager = new DataManager(repositoryFactory)

const app = createApp(dataManager)

const PORT = 3000

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
