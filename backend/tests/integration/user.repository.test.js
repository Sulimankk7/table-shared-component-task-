
import { describe, it, expect, afterAll } from 'vitest'

import { pool } from '../../src/config/database.js'
import { UserRepository } from '../../src/repositories/user.repository.js'

describe('UserRepository PostgreSQL Integration Tests', () => {
  const repository = new UserRepository()
  let createdUserId

  const testUser = {
    name: 'Integration Test User',
    email: `integration-${Date.now()}@example.com`,
    age: 25,
  }

  afterAll(async () => {
    if (createdUserId !== undefined) {
      await pool.query(
        'DELETE FROM users WHERE id = $1',
        [createdUserId]
      )
    }

    await pool.end()
  })

  it('should create a user in PostgreSQL', async () => {
    const user = await repository.create(testUser)

    createdUserId = user.id

    expect(user).toMatchObject(testUser)
    expect(user.id).toBeDefined()
  })

  it('should find the created user by ID', async () => {
    const user = await repository.findById(createdUserId)

    expect(user).toMatchObject({
      id: createdUserId,
      ...testUser,
    })
  })

  it('should return all users', async () => {
    const users = await repository.findAll()

    expect(Array.isArray(users)).toBe(true)
    expect(users.some((user) => user.id === createdUserId)).toBe(true)
  })

  it('should update the created user', async () => {
    const updatedData = {
      ...testUser,
      name: 'Updated Integration User',
      age: 26,
    }

    const user = await repository.update(createdUserId, updatedData)

    expect(user).toMatchObject({
      id: createdUserId,
      ...updatedData,
    })
  })

  
it('should delete the created user', async () => {
  const deleted = await repository.delete(createdUserId)

  expect(deleted).toBe(true)

  const user = await repository.findById(createdUserId)

  expect(user).toBeNull()

  createdUserId = undefined
})

})
