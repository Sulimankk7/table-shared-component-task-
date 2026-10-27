import { describe, it, expect, vi } from 'vitest'
import request from 'supertest'

import { createApp } from '../../src/app.js'

describe('Data API Integration Tests', () => {
  const createTestApp = () => {
    const dataManager = {
      getAll: vi.fn(),
      getById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
    }

    return {
      app: createApp(dataManager),
      dataManager,
    }
  }

  describe('GET /api/:resource', () => {
    it('should return all items', async () => {
      const { app, dataManager } = createTestApp()
      const users = [{ id: 1, name: 'Ahmad', age: 23 }]

      dataManager.getAll.mockResolvedValue(users)

      const response = await request(app).get('/api/users')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(users)
      expect(dataManager.getAll).toHaveBeenCalledWith('users')
    })

    it('should reject unsupported resources', async () => {
      const { app } = createTestApp()

      const response = await request(app).get('/api/unknown')

      expect(response.status).toBe(404)
      expect(response.body).toEqual({
        message: 'Resource not found',
      })
    })
  })

  describe('GET /api/:resource/:id', () => {
    it('should return an item by ID', async () => {
      const { app, dataManager } = createTestApp()
      const user = { id: 1, name: 'Ahmad', age: 23 }

      dataManager.getById.mockResolvedValue(user)

      const response = await request(app).get('/api/users/1')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(user)
      expect(dataManager.getById).toHaveBeenCalledWith('users', 1)
    })

    it('should return 404 when the item does not exist', async () => {
      const { app, dataManager } = createTestApp()

      dataManager.getById.mockResolvedValue(null)

      const response = await request(app).get('/api/users/999')

      expect(response.status).toBe(404)
      expect(response.body).toEqual({ message: 'Item not found' })
    })
  })

  describe('POST /api/:resource', () => {
    it('should create an item', async () => {
      const { app, dataManager } = createTestApp()
      const newUser = { name: 'Ahmad', age: 23 }
      const createdUser = { id: 1, ...newUser }

      dataManager.create.mockResolvedValue(createdUser)

      const response = await request(app)
        .post('/api/users')
        .send(newUser)

      expect(response.status).toBe(201)
      expect(response.body).toEqual(createdUser)
      expect(dataManager.create).toHaveBeenCalledWith('users', newUser)
    })

    it('should reject an empty request body', async () => {
      const { app } = createTestApp()

      const response = await request(app)
        .post('/api/users')
        .send({})

      expect(response.status).toBe(400)
      expect(response.body).toEqual({
        message: 'Request body is required',
      })
    })
  })

  describe('PUT /api/:resource/:id', () => {
    it('should update an existing item', async () => {
      const { app, dataManager } = createTestApp()
      const updateData = { name: 'Omar', age: 25 }
      const updatedUser = { id: 1, ...updateData }

      dataManager.update.mockResolvedValue(updatedUser)

      const response = await request(app)
        .put('/api/users/1')
        .send(updateData)

      expect(response.status).toBe(200)
      expect(response.body).toEqual(updatedUser)
      expect(dataManager.update).toHaveBeenCalledWith(
        'users',
        1,
        updateData
      )
    })

    it('should return 404 when the item does not exist', async () => {
      const { app, dataManager } = createTestApp()

      dataManager.update.mockResolvedValue(null)

      const response = await request(app)
        .put('/api/users/999')
        .send({ name: 'Omar' })

      expect(response.status).toBe(404)
      expect(response.body).toEqual({ message: 'Item not found' })
    })

    it('should reject an empty request body', async () => {
      const { app } = createTestApp()

      const response = await request(app)
        .put('/api/users/1')
        .send({})

      expect(response.status).toBe(400)
      expect(response.body).toEqual({
        message: 'Request body is required',
      })
    })
  })

  describe('DELETE /api/:resource/:id', () => {
    it('should delete an existing item', async () => {
      const { app, dataManager } = createTestApp()

      dataManager.remove.mockResolvedValue(true)

      const response = await request(app).delete('/api/users/1')

      expect(response.status).toBe(204)
      expect(dataManager.remove).toHaveBeenCalledWith('users', 1)
    })

    it('should return 404 when the item does not exist', async () => {
      const { app, dataManager } = createTestApp()

      dataManager.remove.mockResolvedValue(false)

      const response = await request(app).delete('/api/users/999')

      expect(response.status).toBe(404)
      expect(response.body).toEqual({ message: 'Item not found' })
    })
  })
})
