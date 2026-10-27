
import { describe, it, expect } from 'vitest'
import { RepositoryFactory } from '../../../src/factories/repository.factory.js'

describe('RepositoryFactory', () => {
  it('should return the user repository', () => {
    // Arrange
    const factory = new RepositoryFactory()

    // Act
    const repository = factory.getRepository('users')

    // Assert
    expect(repository).toBeDefined()
    expect(typeof repository.findAll).toBe('function')
    expect(typeof repository.findById).toBe('function')
    expect(typeof repository.create).toBe('function')
    expect(typeof repository.update).toBe('function')
    expect(typeof repository.delete).toBe('function')
  })

  it('should return the product repository', () => {
    // Arrange
    const factory = new RepositoryFactory()

    // Act
    const repository = factory.getRepository('products')

    // Assert
    expect(repository).toBeDefined()
    expect(typeof repository.findAll).toBe('function')
    expect(typeof repository.findById).toBe('function')
    expect(typeof repository.create).toBe('function')
    expect(typeof repository.update).toBe('function')
    expect(typeof repository.delete).toBe('function')
  })

  it('should reject unsupported resources', () => {
    // Arrange
    const factory = new RepositoryFactory()

    // Act & Assert
    expect(() => factory.getRepository('orders'))
      .toThrow('Unsupported resource: orders')
  })
})
