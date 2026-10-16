
import express from 'express'
import { createDataController } from '../controllers/data.controller.js'

const allowedResources = ['users', 'products']

export const createDataRoutes = (dataManager) => {
  const router = express.Router()

  const {
    getAllController,
    getByIdController,
    createController,
    updateController,
    deleteController,
  } = createDataController(dataManager)

  router.use('/:resource', (req, res, next) => {
    if (!allowedResources.includes(req.params.resource)) {
      return res.status(404).json({
        message: 'Resource not found',
      })
    }

    next()
  })

  router.get('/:resource', getAllController)
  router.get('/:resource/:id', getByIdController)
  router.post('/:resource', createController)
  router.put('/:resource/:id', updateController)
  router.delete('/:resource/:id', deleteController)

  return router
}
