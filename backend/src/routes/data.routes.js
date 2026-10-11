import express from 'express'

import {
  getAllController,
  getByIdController,
  createController,
  updateController,
  deleteController
} from '../controllers/data.controller.js'

const router = express.Router()

// Only these resources have a JSON file in /data
const allowedResources = ['users', 'products']

// Runs before every route below: unknown resource -> 404
router.use('/:resource', (req, res, next) => {
  if (!allowedResources.includes(req.params.resource)) {
    return res.status(404).json({ message: 'Resource not found' })
  }

  next()
})

router.get('/:resource', getAllController)
router.get('/:resource/:id', getByIdController)
router.post('/:resource', createController)
router.put('/:resource/:id', updateController)
router.delete('/:resource/:id', deleteController)

export default router
