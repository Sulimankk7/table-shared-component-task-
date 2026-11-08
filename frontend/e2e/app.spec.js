import { test, expect } from '@playwright/test';

test('should open the application', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveURL(/localhost:5173/);
});