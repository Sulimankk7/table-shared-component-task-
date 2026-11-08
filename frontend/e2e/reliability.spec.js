
import { test, expect } from '@playwright/test'

const API_URL = 'http://localhost:3000/api/users'

let createdUserIds = []

const createUserData = () => ({
  name: 'Playwright Test User',
  email: `playwright-${Date.now()}-${Math.random().toString(36).slice(2)}@test.com`,
  age: 25
})

const createTestUser = async (request) => {
  const response = await request.post(API_URL, {
    data: createUserData()
  })

  expect(response.status()).toBe(201)

  const user = await response.json()

  createdUserIds.push(user.id)

  return user
}

test.describe('Reliability & API Integration Tests', () => {

  test.beforeEach(() => {
    createdUserIds = []
  })

  test.afterEach(async ({ request }) => {
    for (const id of createdUserIds) {
      await request.delete(`${API_URL}/${id}`)
    }

    createdUserIds = []
  })

  test('should return a successful response when creating a user', async ({ request }) => {
    const userData = createUserData()

    const response = await request.post(API_URL, {
      data: userData
    })

    expect(response.status()).toBe(201)

    const createdUser = await response.json()

    createdUserIds.push(createdUser.id)

    expect(createdUser).toMatchObject({
      id: expect.any(Number),
      name: userData.name,
      email: userData.email,
      age: userData.age
    })
  })

  test('should return a successful response when updating a user', async ({ request }) => {
    const user = await createTestUser(request)

    const updatedData = {
      name: 'Updated Playwright User',
      email: user.email,
      age: 30
    }

    const response = await request.put(`${API_URL}/${user.id}`, {
      data: updatedData
    })

    expect(response.status()).toBe(200)

    const updatedUser = await response.json()

    expect(updatedUser).toMatchObject({
      id: user.id,
      name: updatedData.name,
      email: updatedData.email,
      age: updatedData.age
    })

    const getResponse = await request.get(`${API_URL}/${user.id}`)

    expect(getResponse.status()).toBe(200)

    expect(await getResponse.json()).toMatchObject(updatedData)
  })

  test('should return a successful response when deleting a user', async ({ request }) => {
    const user = await createTestUser(request)

    const response = await request.delete(`${API_URL}/${user.id}`)

    expect(response.status()).toBe(204)

    createdUserIds = createdUserIds.filter(id => id !== user.id)

    const getResponse = await request.get(`${API_URL}/${user.id}`)

    expect(getResponse.status()).toBe(404)
  })

  test('should display an error when the backend is unavailable', async ({ page }) => {
    await page.route('**/api/users**', async route => {
      await route.abort('failed')
    })

    await page.goto('/users')

    await expect(page.locator('p')).toContainText(
      /Failed to fetch|NetworkError|Load failed/i
    )

    await expect(
      page.getByRole('heading', { name: 'Users' })
    ).toBeVisible()
  })

  test('should not send duplicate create requests', async ({ page }) => {
    const userData = createUserData()
    const postRequests = []

    page.on('request', request => {
      if (
        request.url().includes('/api/users') &&
        request.method() === 'POST'
      ) {
        postRequests.push(request)
      }
    })

    const responsePromise = page.waitForResponse(response =>
      response.url().includes('/api/users') &&
      response.request().method() === 'POST'
    )

    await page.goto('/users')

    await page.getByRole('button', { name: 'Add User' }).click()

    await page.getByPlaceholder('Name').fill(userData.name)
    await page.getByPlaceholder('Email').fill(userData.email)
    await page.getByPlaceholder('Age').fill(String(userData.age))

    await page.getByRole('button', { name: 'Create' }).click()

    const response = await responsePromise

    expect(response.status()).toBe(201)

    const createdUser = await response.json()

    createdUserIds.push(createdUser.id)

    expect(postRequests).toHaveLength(1)

    await expect(
      page.locator('tr').filter({ hasText: userData.email })
    ).toHaveCount(1)
  })

  test('should clean up test users after deletion', async ({ request }) => {
    const user = await createTestUser(request)

    const deleteResponse = await request.delete(
      `${API_URL}/${user.id}`
    )

    expect(deleteResponse.status()).toBe(204)

    createdUserIds = createdUserIds.filter(id => id !== user.id)

    const getResponse = await request.get(`${API_URL}/${user.id}`)

    expect(getResponse.status()).toBe(404)
  })

  test('should run independently without relying on existing users', async ({ request }) => {
    const userData = createUserData()

    const createResponse = await request.post(API_URL, {
      data: userData
    })

    expect(createResponse.status()).toBe(201)

    const user = await createResponse.json()

    createdUserIds.push(user.id)

    const getResponse = await request.get(`${API_URL}/${user.id}`)

    expect(getResponse.status()).toBe(200)

    const retrievedUser = await getResponse.json()

    expect(retrievedUser).toMatchObject({
      id: user.id,
      name: userData.name,
      email: userData.email,
      age: userData.age
    })
  })

})
