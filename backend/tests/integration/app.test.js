
import { describe, it, expect, vi, afterEach } from 'vitest'
import request from 'supertest'
import { createApp } from '../../src/app.js'

describe('App Error Middleware', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return 500 when a controller throws an error', async () => {
    const error = new Error('Database connection failed')

    const dataManager = {
      getAll: vi.fn().mockRejectedValue(error),
    }

    const consoleSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {})

    const app = createApp(dataManager)

    const response = await request(app).get('/api/users')

    expect(response.status).toBe(500)

    expect(response.body).toEqual({
      message: 'Internal server error',
    })

    expect(consoleSpy).toHaveBeenCalledWith(error)
  })
})
