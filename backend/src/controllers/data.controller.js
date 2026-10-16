
const notFound = (res) =>
  res.status(404).json({ message: 'Item not found' })

// Body must be a non-empty JSON object
const hasBody = (body) =>
  body && Object.keys(body).length > 0

export const createDataController = (dataManager) => ({
  getAllController: async (req, res, next) => {
    try {
      const items = await dataManager.getAll(req.params.resource)
      res.json(items)
    } catch (error) {
      next(error)
    }
  },

  getByIdController: async (req, res, next) => {
    try {
      const item = await dataManager.getById(
        req.params.resource,
        Number(req.params.id)
      )

      if (!item) return notFound(res)

      res.json(item)
    } catch (error) {
      next(error)
    }
  },

  createController: async (req, res, next) => {
    try {
      if (!hasBody(req.body)) {
        return res.status(400).json({
          message: 'Request body is required',
        })
      }

      const item = await dataManager.create(
        req.params.resource,
        req.body
      )

      res.status(201).json(item)
    } catch (error) {
      next(error)
    }
  },

  updateController: async (req, res, next) => {
    try {
      if (!hasBody(req.body)) {
        return res.status(400).json({
          message: 'Request body is required',
        })
      }

      const item = await dataManager.update(
        req.params.resource,
        Number(req.params.id),
        req.body
      )

      if (!item) return notFound(res)

      res.json(item)
    } catch (error) {
      next(error)
    }
  },

  deleteController: async (req, res, next) => {
    try {
      const deleted = await dataManager.remove(
        req.params.resource,
        Number(req.params.id)
      )

      if (!deleted) return notFound(res)

      res.status(204).send()
    } catch (error) {
      next(error)
    }
  },
})
