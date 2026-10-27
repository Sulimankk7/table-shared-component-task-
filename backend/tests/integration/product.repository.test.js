
import { describe, it, expect, afterAll } from 'vitest'

import { pool } from '../../src/config/database.js'
import { ProductRepository } from '../../src/repositories/product.repository.js'

describe('ProductRepository PostgreSQL Integration Tests', () => {
  const repository = new ProductRepository()
  let createdProductId

  const testProduct = {
    name: 'Integration Test Product',
    price: 19.99,
    category: 'Testing',
    stock: 10,
  }

  const expectProductToMatch = (actual, expected) => {
    expect(actual).toMatchObject({
      ...expected,
      price: expected.price.toString(),
    })
  }

  afterAll(async () => {
    if (createdProductId !== undefined) {
      await pool.query(
        'DELETE FROM products WHERE id = $1',
        [createdProductId]
      )
    }

    await pool.end()
  })

  it('should create a product in PostgreSQL', async () => {
    const product = await repository.create(testProduct)

    createdProductId = product.id

    expectProductToMatch(product, testProduct)
    expect(product.id).toBeDefined()
  })

  it('should find the created product by ID', async () => {
    const product = await repository.findById(createdProductId)

    expectProductToMatch(product, {
      id: createdProductId,
      ...testProduct,
    })
  })

  it('should return all products', async () => {
    const products = await repository.findAll()

    expect(Array.isArray(products)).toBe(true)

    expect(
      products.some((product) => product.id === createdProductId)
    ).toBe(true)
  })

  it('should update the created product', async () => {
    const updatedData = {
      ...testProduct,
      name: 'Updated Integration Product',
      price: 24.99,
      stock: 15,
    }

    const product = await repository.update(
      createdProductId,
      updatedData
    )

    expectProductToMatch(product, {
      id: createdProductId,
      ...updatedData,
    })
  })

  it('should delete the created product', async () => {
    const deleted = await repository.delete(createdProductId)

    expect(deleted).toBe(true)

    const product = await repository.findById(createdProductId)

    expect(product).toBeNull()

    createdProductId = undefined
  })
})
