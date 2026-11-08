
import { test, expect } from '@playwright/test'

const products = [
  {
    id: 1,
    name: 'Apple Keyboard',
    price: 100,
    category: 'Accessories',
    stock: 25
  },
  {
    id: 2,
    name: 'Logitech Mouse',
    price: 50,
    category: 'Accessories',
    stock: 40
  },
  {
    id: 3,
    name: 'Samsung Monitor',
    price: 300,
    category: 'Electronics',
    stock: 10
  }
]

const users = [
  {
    id: 1,
    name: 'Ahmad',
    email: 'ahmad@test.com',
    age: 25
  },
  {
    id: 2,
    name: 'Sara',
    email: 'sara@test.com',
    age: 22
  }
]

const mockProducts = async (page, data = products) => {
  await page.route('**/api/products**', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(data)
    })
  })
}

const mockUsers = async (page, data = users) => {
  await page.route('**/api/users**', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(data)
    })
  })
}

test.describe('DataTable E2E Tests', () => {

  test('should display columns according to the provided configuration', async ({ page }) => {
    await mockProducts(page)

    await page.goto('/products')

    const headers = await page.locator('thead th').allTextContents()

    expect(headers).toEqual([
      'Product',
      'Price',
      'Category',
      'Stock'
    ])

    await expect(page.locator('thead th')).toHaveCount(4)
  })

  test('should display the correct data inside table rows', async ({ page }) => {
    await mockProducts(page)

    await page.goto('/products')

    const rows = page.locator('tbody tr')

    await expect(rows).toHaveCount(products.length)

    const actualData = await rows.evaluateAll(rows =>
      rows.map(row =>
        Array.from(row.querySelectorAll('td')).map(cell =>
          cell.textContent.trim()
        )
      )
    )

    const expectedData = products.map(product => [
      String(product.name),
      String(product.price),
      String(product.category),
      String(product.stock)
    ])

    expect(actualData).toEqual(expectedData)
  })

  test('should search across all columns', async ({ page }) => {
    await mockProducts(page)

    await page.goto('/products')

    await page.getByLabel('Search table').fill('Electronics')

    const rows = page.locator('tbody tr')

    await expect(rows).toHaveCount(1)

    await expect(rows.first()).toContainText('Samsung Monitor')

    await expect(rows.first()).toContainText('Electronics')
  })

  test('should search only within the selected column', async ({ page }) => {
    await mockProducts(page)

    await page.goto('/products')

    await page.getByLabel('Filter search by column')
      .selectOption('category')

    await page.getByLabel('Search table').fill('Apple Keyboard')

    await expect(
      page.getByText('No results found')
    ).toBeVisible()

    await page.getByLabel('Search table').fill('Accessories')

    const rows = page.locator('tbody tr')

    await expect(rows).toHaveCount(2)

    await expect(rows.nth(0)).toContainText('Apple Keyboard')
    await expect(rows.nth(1)).toContainText('Logitech Mouse')
  })

  test('should display empty state when search has no matching results', async ({ page }) => {
    await mockProducts(page)

    await page.goto('/products')

    await page.getByLabel('Search table')
      .fill('NonExistingProduct123')

    await expect(
      page.getByText('No results found')
    ).toBeVisible()

    await expect(
      page.locator('tbody tr')
    ).toHaveCount(1)
  })

  test('should sort text values in ascending and descending order', async ({ page }) => {
    await mockProducts(page)

    await page.goto('/products')

    await page.getByRole('button', {
      name: 'Sorting options'
    }).click()

    await page.locator('#sort-column').selectOption('name')

    const direction = page.locator('#sort-direction')

    await direction.selectOption('asc')

    const ascendingNames = await page.locator('tbody tr').evaluateAll(rows =>
      rows.map(row => row.cells[0].textContent.trim())
    )

    expect(ascendingNames).toEqual([
      'Apple Keyboard',
      'Logitech Mouse',
      'Samsung Monitor'
    ])

    await direction.selectOption('desc')

    const descendingNames = await page.locator('tbody tr').evaluateAll(rows =>
      rows.map(row => row.cells[0].textContent.trim())
    )

    expect(descendingNames).toEqual([
      'Samsung Monitor',
      'Logitech Mouse',
      'Apple Keyboard'
    ])
  })

  test('should sort numeric values in ascending and descending order', async ({ page }) => {
    await mockProducts(page)

    await page.goto('/products')

    await page.getByRole('button', {
      name: 'Sorting options'
    }).click()

    await page.locator('#sort-column').selectOption('price')

    const direction = page.locator('#sort-direction')

    await direction.selectOption('asc')

    const ascendingPrices = await page.locator('tbody tr').evaluateAll(rows =>
      rows.map(row => Number(row.cells[1].textContent.trim()))
    )

    expect(ascendingPrices).toEqual([50, 100, 300])

    await direction.selectOption('desc')

    const descendingPrices = await page.locator('tbody tr').evaluateAll(rows =>
      rows.map(row => Number(row.cells[1].textContent.trim()))
    )

    expect(descendingPrices).toEqual([300, 100, 50])
  })

  test('should display Actions column and buttons when actions slot is provided', async ({ page }) => {
    await mockUsers(page)

    await page.goto('/users')

    await expect(
      page.getByRole('columnheader', { name: 'Actions' })
    ).toBeVisible()

    await expect(
      page.getByRole('button', { name: 'Edit' })
    ).toHaveCount(users.length)

    await expect(
      page.getByRole('button', { name: 'Delete' })
    ).toHaveCount(users.length)
  })

  test('should hide Actions column when actions slot is not provided', async ({ page }) => {
    await mockProducts(page)

    await page.goto('/products')

    await expect(
      page.getByRole('columnheader', { name: 'Actions' })
    ).toHaveCount(0)

    await expect(
      page.getByRole('button', { name: 'Edit' })
    ).toHaveCount(0)

    await expect(
      page.getByRole('button', { name: 'Delete' })
    ).toHaveCount(0)
  })

  test('should display empty state when the original data is empty', async ({ page }) => {
    await mockProducts(page, [])

    await page.goto('/products')

    await expect(
      page.getByText('No results found')
    ).toBeVisible()

    await expect(
      page.locator('tbody tr')
    ).toHaveCount(1)

    await expect(
      page.locator('tbody td.empty-state')
    ).toHaveAttribute('colspan', '4')
  })

})
