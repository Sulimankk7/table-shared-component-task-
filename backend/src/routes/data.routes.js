import express from 'express'

import {
  getAllController,
  getByIdController,
  createController,
  updateController,
  deleteController
} from '../controllers/data.controller.js'

const router = express.Router()

router.get('/:resource', getAllController)

router.get('/:resource/:id', getByIdController)

router.post('/:resource', createController)

router.put('/:resource/:id', updateController)

router.delete('/:resource/:id', deleteController)

export default router