const { test, expect } = require('@playwright/test');
const { loginAs } = require('./helpers');

test.describe('Admin Panel', () => {

  test('Admin dashboard loads', async ({ page }) => {
    await loginAs(page, 'admin');
    await page.goto('/admin');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Manage Users')).toBeVisible();
    await expect(page.locator('text=Manage Posts')).toBeVisible();
    await expect(page.locator('text=Manage Claims')).toBeVisible();
  });

  test('Admin users page loads', async ({ page }) => {
    await loginAs(page, 'admin');
    await page.goto('/admin/users');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Admin posts page loads', async ({ page }) => {
    await loginAs(page, 'admin');
    await page.goto('/admin/posts');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Admin claims page loads', async ({ page }) => {
    await loginAs(page, 'admin');
    await page.goto('/admin/claims');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Admin claims has filter tabs', async ({ page }) => {
    await loginAs(page, 'admin');
    await page.goto('/admin/claims');
    await expect(page.locator('button:has-text("Pending")')).toBeVisible();
    await expect(page.locator('button:has-text("Approved")')).toBeVisible();
    await expect(page.locator('button:has-text("Rejected")')).toBeVisible();
  });

  test('Student cannot access admin dashboard', async ({ page }) => {
    await loginAs(page, 'student');
    await page.goto('/admin');
    await expect(page).not.toHaveURL('/admin');
  });

  test('Unauthenticated user cannot access admin', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/login/);
  });

 test('Admin navbar shows admin link', async ({ page }) => {
  await loginAs(page, 'admin');
  await page.goto('/admin');
  // wait for page to fully load
  await page.waitForLoadState('networkidle');
  const adminLink = page.locator('nav a').filter({ hasText: /admin/i }).first();
  await expect(adminLink).toBeVisible({ timeout: 10000 });
});

  test('Student navbar does not show admin link', async ({ page }) => {
    await loginAs(page, 'student');
    const adminLink = page.locator('nav a').filter({ hasText: /admin panel/i });
    await expect(adminLink).not.toBeVisible();
  });

});