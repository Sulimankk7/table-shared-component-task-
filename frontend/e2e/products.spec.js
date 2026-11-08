
import { test, expect } from '@playwright/test'

test.describe('Products E2E Tests', () => {

  test('should display the products page', async ({ page }) => {
    await page.goto('/products')

    await expect(
      page.getByRole('heading', { name: 'Products' })
    ).toBeVisible()
  })

  test('should display products data correctly', async ({ page }) => {
    await page.goto('/products')

    const response = await page.request.get(
      'http://127.0.0.1:3000/api/products'
    )

    expect(response.ok()).toBeTruthy()

    const products = await response.json()

    expect(products.length).toBeGreaterThan(0)

    for (const product of products) {
      await expect(
        page.getByRole('cell', {
          name: String(product.name),
          exact: true
        })
      ).toBeVisible()
    }
  })

  test('should search for a product by name', async ({ page }) => {
    await page.goto('/products')

    const response = await page.request.get(
      'http://127.0.0.1:3000/api/products'
    )

    const products = await response.json()

    expect(products.length).toBeGreaterThan(0)

    const product = products[0]

    await page.getByLabel('Search table').fill(product.name)

    await expect(
      page.getByRole('cell', {
        name: String(product.name),
        exact: true
      })
    ).toBeVisible()

    const rows = page.locator('tbody tr')

    await expect(rows).toHaveCount(1)
  })

  test('should filter products by category', async ({ page }) => {
    await page.goto('/products')

    const response = await page.request.get(
      'http://127.0.0.1:3000/api/products'
    )

    const products = await response.json()

    expect(products.length).toBeGreaterThan(0)

    const category = products[0].category

    await page.getByLabel('Filter search by column')
      .selectOption('category')

    await page.getByLabel('Search table')
      .fill(String(category))

    const rows = page.locator('tbody tr')

    const rowCount = await rows.count()

    expect(rowCount).toBeGreaterThan(0)

    for (let i = 0; i < rowCount; i++) {
      await expect(rows.nth(i)).toContainText(String(category))
    }
  })

  test('should sort products by price in ascending and descending order', async ({ page }) => {
    await page.goto('/products')

    const response = await page.request.get(
      'http://127.0.0.1:3000/api/products'
    )

    const products = await response.json()

    expect(products.length).toBeGreaterThan(1)

    await page.getByRole('button', {
      name: 'Sorting options'
    }).click()

    await page.locator('#sort-column').selectOption('price')

    const direction = page.locator('#sort-direction')

    await direction.selectOption('asc')

    const ascendingPrices = await page.locator('tbody tr').evaluateAll(rows =>
      rows.map(row =>
        Number.parseFloat(
          row.cells[1].textContent.replace(/[^\d.-]/g, '')
        )
      )
    )

    expect(ascendingPrices.length).toBe(products.length)

    expect(ascendingPrices).toEqual(
      [...ascendingPrices].sort((a, b) => a - b)
    )

    await direction.selectOption('desc')

    const descendingPrices = await page.locator('tbody tr').evaluateAll(rows =>
      rows.map(row =>
        Number.parseFloat(
          row.cells[1].textContent.replace(/[^\d.-]/g, '')
        )
      )
    )

    expect(descendingPrices).toEqual(
      [...descendingPrices].sort((a, b) => b - a)
    )
  })

  test('should display empty state when no products match the search', async ({ page }) => {
    await page.goto('/products')

    await page.getByLabel('Search table').fill(
      'non-existing-product-123456'
    )

    await expect(
      page.getByText('No results found')
    ).toBeVisible()
  })

  test('should display an error when loading products fails', async ({ page }) => {
    await page.route('**/api/products', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Failed to load products'
        })
      })
    })

    await page.goto('/products')

    await expect(
      page.locator('p')
    ).toHaveText(/.+/)
  })

})
