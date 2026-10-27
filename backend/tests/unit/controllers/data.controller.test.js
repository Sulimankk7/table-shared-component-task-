
import { describe, it, expect, vi } from 'vitest'
import { createDataController } from '../../../src/controllers/data.controller.js'

describe('Data Controller', () => {
  // Helper to create a fresh controller and mock dependencies
  const createMocks = () => {
    const dataManager = {
      getAll: vi.fn(),
      getById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
    }

    const controller = createDataController(dataManager)

    const req = {
      params: { resource: 'users', id: '1' },
      body: { name: 'Ahmad', age: 23 },
    }

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    }

    const next = vi.fn()

    return { dataManager, controller, req, res, next }
  }

  // getAllController
  describe('getAllController', () => {
    it('should return all items', async () => {
      const { dataManager, controller, req, res, next } = createMocks()
      const items = [{ id: 1, name: 'Ahmad' }]
      dataManager.getAll.mockResolvedValue(items)

      await controller.getAllController(req, res, next)

      expect(dataManager.getAll).toHaveBeenCalledWith('users')
      expect(res.json).toHaveBeenCalledWith(items)
      expect(next).not.toHaveBeenCalled()
    })

    it('should pass errors to next', async () => {
      const { dataManager, controller, req, res, next } = createMocks()
      const error = new Error('Database error')
      dataManager.getAll.mockRejectedValue(error)

      await controller.getAllController(req, res, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  // getByIdController
  describe('getByIdController', () => {
    it('should return an item by id', async () => {
      const { dataManager, controller, req, res, next } = createMocks()
      const item = { id: 1, name: 'Ahmad' }
      dataManager.getById.mockResolvedValue(item)

      await controller.getByIdController(req, res, next)

      expect(dataManager.getById).toHaveBeenCalledWith('users', 1)
      expect(res.json).toHaveBeenCalledWith(item)
      expect(next).not.toHaveBeenCalled()
    })

    it('should return 404 when item is not found', async () => {
      const { dataManager, controller, req, res, next } = createMocks()
      dataManager.getById.mockResolvedValue(null)

      await controller.getByIdController(req, res, next)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'Item not found' })
      expect(next).not.toHaveBeenCalled()
    })

    it('should pass errors to next', async () => {
      const { dataManager, controller, req, res, next } = createMocks()
      const error = new Error('Database error')
      dataManager.getById.mockRejectedValue(error)

      await controller.getByIdController(req, res, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  // createController
  describe('createController', () => {
    it('should create an item and return 201', async () => {
      const { dataManager, controller, req, res, next } = createMocks()
      const item = { id: 2, ...req.body }
      dataManager.create.mockResolvedValue(item)

      await controller.createController(req, res, next)

      expect(dataManager.create).toHaveBeenCalledWith('users', req.body)
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(item)
      expect(next).not.toHaveBeenCalled()
    })

    it('should return 400 when request body is empty', async () => {
      const { dataManager, controller, req, res, next } = createMocks()
      req.body = {}

      await controller.createController(req, res, next)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Request body is required',
      })
      expect(dataManager.create).not.toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()
    })

    it('should pass errors to next', async () => {
      const { dataManager, controller, req, res, next } = createMocks()
      const error = new Error('Database error')
      dataManager.create.mockRejectedValue(error)

      await controller.createController(req, res, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  // updateController
  describe('updateController', () => {
    it('should update an item successfully', async () => {
      const { dataManager, controller, req, res, next } = createMocks()
      const item = { id: 1, ...req.body }
      dataManager.update.mockResolvedValue(item)

      await controller.updateController(req, res, next)

      expect(dataManager.update).toHaveBeenCalledWith('users', 1, req.body)
      expect(res.json).toHaveBeenCalledWith(item)
      expect(next).not.toHaveBeenCalled()
    })

    it('should return 404 when item is not found', async () => {
      const { dataManager, controller, req, res, next } = createMocks()
      dataManager.update.mockResolvedValue(null)

      await controller.updateController(req, res, next)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'Item not found' })
      expect(next).not.toHaveBeenCalled()
    })

    it('should return 400 when request body is empty', async () => {
      const { dataManager, controller, req, res, next } = createMocks()
      req.body = {}

      await controller.updateController(req, res, next)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Request body is required',
      })
      expect(dataManager.update).not.toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()
    })
  })

  // deleteController
  describe('deleteController', () => {
    it('should delete an item and return 204', async () => {
      const { dataManager, controller, req, res, next } = createMocks()
      dataManager.remove.mockResolvedValue(true)

      await controller.deleteController(req, res, next)

      expect(dataManager.remove).toHaveBeenCalledWith('users', 1)
      expect(res.status).toHaveBeenCalledWith(204)
      expect(res.send).toHaveBeenCalledOnce()
      expect(next).not.toHaveBeenCalled()
    })

    it('should return 404 when item is not found', async () => {
      const { dataManager, controller, req, res, next } = createMocks()
      dataManager.remove.mockResolvedValue(false)

      await controller.deleteController(req, res, next)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'Item not found' })
      expect(next).not.toHaveBeenCalled()
    })
  })
})
