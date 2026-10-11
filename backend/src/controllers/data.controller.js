import {
  getAll,
  getById,
  create,
  update,
  remove
} from '../services/data.service.js'

export const getAllController = (req, res) => {
  const data = getAll(req.params.resource)

  res.json(data)
}

export const getByIdController = (req, res) => {
  const id = Number(req.params.id)

  const item = getById(req.params.resource, id)

  if (!item) {
    return res.status(404).json({
      message: 'Item not found'
    })
  }

  res.json(item)
}

export const createController = (req, res) => {
  const item = create(
    req.params.resource,
    req.body
  )

  res.status(201).json(item)
}

export const updateController = (req, res) => {
  const id = Number(req.params.id)

  const item = update(
    req.params.resource,
    id,
    req.body
  )

  if (!item) {
    return res.status(404).json({
      message: 'Item not found'
    })
  }

  res.json(item)
}

export const deleteController = (req, res) => {
  const id = Number(req.params.id)

  const deleted = remove(
    req.params.resource,
    id
  )

  if (!deleted) {
    return res.status(404).json({
      message: 'Item not found'
    })
  }

  res.status(204).send()
}