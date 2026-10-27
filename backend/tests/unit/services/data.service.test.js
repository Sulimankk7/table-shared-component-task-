
import { describe, it, expect, vi } from 'vitest'
import { DataManager } from '../../../src/services/data.service.js'

// Arrange: تجهيز Repository وهمي للاختبارات
const createRepository = () => ({
  findAll: vi.fn(),
  findById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
})

// تجهيز DataManager مع Repository وهمي
const createDataManager = (repository) => {
  const repositoryFactory = {
    getRepository: vi.fn(() => repository),
  }

  return new DataManager(repositoryFactory)
}

describe('DataManager', () => {
  it('should return all users', async () => {
    // Arrange
    const users = [
      { id: 1, name: 'Ahmad', age: 23 },
      { id: 2, name: 'Sara', age: 21 },
    ]

    const repository = createRepository()
    repository.findAll.mockResolvedValue(users)

    const manager = createDataManager(repository)

    // Act
    const result = await manager.getAll('users')

    // Assert
    expect(result).toEqual(users)
    expect(repository.findAll).toHaveBeenCalledOnce()
  })


    
  it('should return a user by id', async () => {
    // Arrange
    const user = { id: 1, name: 'Ahmad', age: 23 }

    const repository = createRepository()
    repository.findById.mockResolvedValue(user)

    const manager = createDataManager(repository)

    // Act
    const result = await manager.getById('users', 1)

    // Assert
    expect(result).toEqual(user)
    expect(repository.findById).toHaveBeenCalledWith(1)
  })


  it('should create a user', async () => {
    // Arrange
    const newUser = { name: 'Ahmad', age: 23, email: 'ahmad@example.com' }

    const repository = createRepository()
    repository.create.mockResolvedValue({ id: 1, ...newUser })

    const manager = createDataManager(repository)

    // Act
    const result = await manager.create('users', newUser)

    // Assert
    expect(result).toEqual({ id: 1, ...newUser })
    expect(repository.create).toHaveBeenCalledWith(newUser)
  })

  it('should update a user', async () => {
  // Arrange
  const updatedUser = {
    id: 1,
    name: 'Ahmad',
    age: 24,
    email: 'ahmad@example.com',
  }

  const updateData = {
    name: 'Ahmad',
    age: 24,
    email: 'ahmad@example.com',
  }

  const repository = createRepository()
  repository.update.mockResolvedValue(updatedUser)

  const manager = createDataManager(repository)

  // Act
  const result = await manager.update('users', 1, updateData)

  // Assert
  expect(result).toEqual(updatedUser)
  expect(repository.update).toHaveBeenCalledWith(1, updateData)
 })

  it('should remove a user', async () => {
    // Arrange
    const repository = createRepository()
    repository.delete.mockResolvedValue(undefined)

    const manager = createDataManager(repository)

    // Act
    await manager.remove('users', 1)

    // Assert
    expect(repository.delete).toHaveBeenCalledWith(1)
  })

  it('should throw an error for unsupported resources', async () => {
  // Arrange
  const repositoryFactory = {
    getRepository: vi.fn(() => null),
  }

  const manager = new DataManager(repositoryFactory)

  // Act & Assert
  await expect(manager.getAll('orders')).rejects.toThrow(
    'Unsupported resource: orders'
  )
})

it('should throw an error when repository method is missing', async () => {
  // Arrange
  const repository = {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  }

  const repositoryFactory = {
    getRepository: vi.fn(() => repository),
  }

  const manager = new DataManager(repositoryFactory)

  // Act & Assert
  await expect(manager.getAll('users')).rejects.toThrow(
    'Repository for "users" must implement "delete"'
  )
})

})
