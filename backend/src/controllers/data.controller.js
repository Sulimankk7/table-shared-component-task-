import {
  getAll,
  getById,
  create,
  update,
  remove
} from '../services/data.service.js'

const notFound = (res) =>
  res.status(404).json({ message: 'Item not found' })

// Body must be a non-empty JSON object
const hasBody = (body) =>
  body && Object.keys(body).length > 0

export const getAllController = (req, res) => {
  res.json(getAll(req.params.resource))
}

export const getByIdController = (req, res) => {
  const item = getById(req.params.resource, Number(req.params.id))

  if (!item) return notFound(res)

  res.json(item)
}

export const createController = (req, res) => {
  if (!hasBody(req.body)) {
    return res.status(400).json({ message: 'Request body is required' })
  }

  const item = create(req.params.resource, req.body)

  res.status(201).json(item)
}

export const updateController = (req, res) => {
  if (!hasBody(req.body)) {
    return res.status(400).json({ message: 'Request body is required' })
  }

  const item = update(
    req.params.resource,
    Number(req.params.id),
    req.body
  )

  if (!item) return notFound(res)

  res.json(item)
}

export const deleteController = (req, res) => {
  const deleted = remove(req.params.resource, Number(req.params.id))

  if (!deleted) return notFound(res)

  res.status(204).send()
}
