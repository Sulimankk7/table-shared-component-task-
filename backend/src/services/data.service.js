import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dataDirectory = path.join(__dirname, '../../data')

const getDataPath = (resource) => {
  return path.join(dataDirectory, `${resource}.json`)
}

const readData = (resource) => {
  const dataPath = getDataPath(resource)
  const data = fs.readFileSync(dataPath, 'utf-8')

  return JSON.parse(data)
}

const writeData = (resource, data) => {
  const dataPath = getDataPath(resource)

  fs.writeFileSync(
    dataPath,
    JSON.stringify(data, null, 2)
  )
}

export const getAll = (resource) => {
  return readData(resource)
}

export const getById = (resource, id) => {
  const data = readData(resource)

  return data.find(item => item.id === id)
}

export const create = (resource, itemData) => {
  const data = readData(resource)

  const newItem = {
    id: Date.now(),
    ...itemData
  }

  data.push(newItem)

  writeData(resource, data)

  return newItem
}

export const update = (resource, id, itemData) => {
  const data = readData(resource)

  const index = data.findIndex(item => item.id === id)

  if (index === -1) {
    return null
  }

  data[index] = {
    ...data[index],
    ...itemData
  }

  writeData(resource, data)

  return data[index]
}

export const remove = (resource, id) => {
  const data = readData(resource)

  const index = data.findIndex(item => item.id === id)

  if (index === -1) {
    return false
  }

  data.splice(index, 1)

  writeData(resource, data)

  return true
}