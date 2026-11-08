
import { test, expect } from '@playwright/test';

test.describe('Users E2E Tests', () => {

  test('should create a user and persist it after reload', async ({ page }) => {
    const uniqueEmail = `user-${Date.now()}@test.com`;

    await page.goto('/users');

    await page.getByRole('button', { name: 'Add User' }).click();

    await page.getByPlaceholder('Name').fill('Playwright User');
    await page.getByPlaceholder('Email').fill(uniqueEmail);
    await page.getByPlaceholder('Age').fill('25');

    await page.getByRole('button', { name: 'Create' }).click();

    const userRow = page.locator('tr').filter({
      hasText: uniqueEmail,
    });

    await expect(userRow).toBeVisible();
    await expect(userRow).toContainText('Playwright User');
    await expect(userRow).toContainText('25');

    await page.reload();

    const persistedUser = page.locator('tr').filter({
      hasText: uniqueEmail,
    });

    await expect(persistedUser).toBeVisible();
  });


  test('should update an existing user', async ({ page }) => {
    const uniqueEmail = `user-${Date.now()}@test.com`;

    await page.goto('/users');

    await page.getByRole('button', { name: 'Add User' }).click();

    await page.getByPlaceholder('Name').fill('Original User');
    await page.getByPlaceholder('Email').fill(uniqueEmail);
    await page.getByPlaceholder('Age').fill('25');

    await page.getByRole('button', { name: 'Create' }).click();

    const userRow = page.locator('tr').filter({
      hasText: uniqueEmail,
    });

    await expect(userRow).toBeVisible();

    await userRow.getByRole('button', { name: 'Edit' }).click();

    await expect(page.getByPlaceholder('Name')).toHaveValue('Original User');

    await page.getByPlaceholder('Name').fill('Updated User');
    await page.getByPlaceholder('Age').fill('30');

    await page.getByRole('button', { name: 'Update' }).click();

    await expect(userRow).toContainText('Updated User');
    await expect(userRow).toContainText('30');

    await page.reload();

    await expect(userRow).toContainText('Updated User');
    await expect(userRow).toContainText('30');
  });


  test('should delete an existing user', async ({ page }) => {
    const uniqueEmail = `user-${Date.now()}@test.com`;

    await page.goto('/users');

    await page.getByRole('button', { name: 'Add User' }).click();

    await page.getByPlaceholder('Name').fill('User To Delete');
    await page.getByPlaceholder('Email').fill(uniqueEmail);
    await page.getByPlaceholder('Age').fill('25');

    await page.getByRole('button', { name: 'Create' }).click();

    const userRow = page.locator('tr').filter({
      hasText: uniqueEmail,
    });

    await expect(userRow).toBeVisible();

    page.once('dialog', dialog => dialog.accept());

    await userRow.getByRole('button', { name: 'Delete' }).click();

    await expect(userRow).toHaveCount(0);

    await page.reload();

    await expect(
      page.locator('tr').filter({ hasText: uniqueEmail })
    ).toHaveCount(0);
  });


  test('should reject creating a user with an empty request body', async ({ request }) => {
    const response = await request.post('http://127.0.0.1:3000/api/users', {
      data: {},
    });

    expect(response.status()).toBe(400);

    expect(await response.json()).toEqual({
      message: 'Request body is required',
    });
  });


  test('should prevent creating a user without a name', async ({ page }) => {
    await page.goto('/users');

    await page.getByRole('button', { name: 'Add User' }).click();

    const nameInput = page.getByPlaceholder('Name');

    await page.getByPlaceholder('Email').fill('valid@test.com');
    await page.getByPlaceholder('Age').fill('25');

    const postRequests = [];

    page.on('request', request => {
      if (
        request.url().includes('/api/users') &&
        request.method() === 'POST'
      ) {
        postRequests.push(request);
      }
    });

    await page.getByRole('button', { name: 'Create' }).click();

    await expect(nameInput).toBeVisible();
    await expect(nameInput).toHaveJSProperty('validity.valid', false);

    expect(postRequests).toHaveLength(0);
  });


  test('should prevent creating a user without an email', async ({ page }) => {
    await page.goto('/users');

    await page.getByRole('button', { name: 'Add User' }).click();

    const nameInput = page.getByPlaceholder('Name');
    const emailInput = page.getByPlaceholder('Email');
    const ageInput = page.getByPlaceholder('Age');

    await nameInput.fill('Playwright User');
    await ageInput.fill('25');

    const postRequests = [];

    page.on('request', request => {
      if (
        request.url().includes('/api/users') &&
        request.method() === 'POST'
      ) {
        postRequests.push(request);
      }
    });

    await page.getByRole('button', { name: 'Create' }).click();

    await expect(emailInput).toBeVisible();

    await expect(emailInput).toHaveJSProperty(
      'validity.valid',
      false
    );

    await expect(nameInput).toHaveJSProperty(
      'validity.valid',
      true
    );

    await expect(ageInput).toHaveJSProperty(
      'validity.valid',
      true
    );

    expect(postRequests).toHaveLength(0);
  });


 test('should prevent creating a user with an invalid email', async ({ page }) => {
  await page.goto('/users');

  await page.getByRole('button', { name: 'Add User' }).click();

  const nameInput = page.getByPlaceholder('Name');
  const emailInput = page.getByPlaceholder('Email');
  const ageInput = page.getByPlaceholder('Age');

  await nameInput.fill('Playwright User');
  await emailInput.fill('invalid-email');
  await ageInput.fill('25');

  const postRequests = [];

  page.on('request', request => {
    if (
      request.url().includes('/api/users') &&
      request.method() === 'POST'
    ) {
      postRequests.push(request);
    }
  });

  await page.getByRole('button', { name: 'Create' }).click();

  await expect(emailInput).toBeVisible();
  await expect(emailInput).toHaveJSProperty('validity.valid', false);
  await expect(nameInput).toHaveJSProperty('validity.valid', true);
  await expect(ageInput).toHaveJSProperty('validity.valid', true);

  expect(postRequests).toHaveLength(0);
});





test('should display an error when creating a user fails', async ({ page }) => {
  await page.route('**/api/users**', async route => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: '[]',
      });
      return;
    }

    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Internal server error',
        }),
      });
      return;
    }

    await route.continue();
  });

  await page.goto('/users');

  await page.getByRole('button', { name: 'Add User' }).click();

  await page.getByPlaceholder('Name').fill('Playwright User');
  await page.getByPlaceholder('Email').fill('create-error@test.com');
  await page.getByPlaceholder('Age').fill('25');

  const responsePromise = page.waitForResponse(response =>
    response.url().includes('/api/users') &&
    response.request().method() === 'POST'
  );

  await page.getByRole('button', { name: 'Create' }).click();

  const response = await responsePromise;

  expect(response.status()).toBe(500);

  await expect(page.locator('p')).toContainText('500');
  await expect(page.getByPlaceholder('Name')).toBeVisible();
  await expect(page.getByPlaceholder('Email')).toHaveValue('create-error@test.com');
});


test('should display an error when updating a user fails', async ({ page }) => {
  const existingUser = {
    id: 999,
    name: 'Existing User',
    email: 'existing@test.com',
    age: 25,
  };

  await page.route('**/api/users**', async route => {
    const method = route.request().method();

    if (method === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([existingUser]),
      });
      return;
    }

    if (method === 'PUT') {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Internal server error',
        }),
      });
      return;
    }

    await route.continue();
  });

  await page.goto('/users');

  const userRow = page.locator('tr').filter({
    has: page.getByText(existingUser.email, { exact: true }),
  });

  await expect(userRow).toBeVisible();

  await userRow.getByRole('button', { name: 'Edit' }).click();

  await page.getByPlaceholder('Name').fill('Updated User');

  const responsePromise = page.waitForResponse(response =>
    response.url().includes('/api/users/') &&
    response.request().method() === 'PUT'
  );

  await page.getByRole('button', { name: 'Update' }).click();

  const response = await responsePromise;

  expect(response.status()).toBe(500);

  await expect(page.locator('p')).toContainText('500');
  await expect(page.getByPlaceholder('Name')).toBeVisible();
  await expect(page.getByPlaceholder('Name')).toHaveValue('Updated User');
  await expect(userRow).toContainText(existingUser.name);
});


test('should reject creating a user with an existing email', async ({ page }) => {
  const existingUser = {
    id: 999,
    name: 'Existing User',
    email: 'duplicate@test.com',
    age: 25,
  };

  await page.route('**/api/users**', async route => {
    const method = route.request().method();

    if (method === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([existingUser]),
      });
      return;
    }

    if (method === 'POST') {
      await route.fulfill({
        status: 409,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Email already exists',
        }),
      });
      return;
    }

    await route.continue();
  });

  await page.goto('/users');

  await page.getByRole('button', { name: 'Add User' }).click();

  await page.getByPlaceholder('Name').fill('Another User');
  await page.getByPlaceholder('Email').fill(existingUser.email);
  await page.getByPlaceholder('Age').fill('30');

  const responsePromise = page.waitForResponse(response =>
    response.url().includes('/api/users') &&
    response.request().method() === 'POST'
  );

  await page.getByRole('button', { name: 'Create' }).click();

  const response = await responsePromise;

  expect(response.status()).toBe(409);

  await expect(page.locator('p')).toContainText('409');
  await expect(page.getByPlaceholder('Name')).toBeVisible();
  await expect(
    page.getByText(existingUser.email, { exact: true })
  ).toBeVisible();
});


test('should display an error when loading users fails', async ({ page }) => {
  await page.route('**/api/users**', async route => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Internal server error',
        }),
      });
      return;
    }

    await route.continue();
  });

  await page.goto('/users');

  await expect(page.locator('p')).toContainText('500');
  await expect(
    page.getByRole('heading', { name: 'Users' })
  ).toBeVisible();
});

});
