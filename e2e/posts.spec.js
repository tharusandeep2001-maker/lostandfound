const { test, expect } = require('@playwright/test');
const { loginAs } = require('./helpers');

test.describe('Posts', () => {

  test('Browse posts page loads without login', async ({ page }) => {
    await page.goto('/posts');
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('Cannot create post without login', async ({ page }) => {
    await page.goto('/posts/new');
    await expect(page).toHaveURL(/login/);
  });

  test('Student can access create post page', async ({ page }) => {
    await loginAs(page, 'student');
    await page.goto('/posts/new');
    await expect(page).toHaveURL('/posts/new');
    await expect(page.locator('form')).toBeVisible();
  });

  test('Create post form validates required fields', async ({ page }) => {
    await loginAs(page, 'student');
    await page.goto('/posts/new');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/posts/new');
  });

  test('My posts page loads for student', async ({ page }) => {
    await loginAs(page, 'student');
    await page.goto('/my-posts');
    await expect(page).toHaveURL('/my-posts');
  });

  test('My posts page not accessible without login', async ({ page }) => {
    await page.goto('/my-posts');
    await expect(page).toHaveURL(/login/);
  });

  test('Description hidden from non-owner on post detail', async ({ page }) => {
    await page.goto('/posts');
    const postLink = page.locator('a[href^="/posts/"]').first();
    if (await postLink.count() > 0) {
      await postLink.click();
      // description section should not be visible to non-logged-in user
      await expect(page.locator('h2:has-text("Description")')).not.toBeVisible();
    }
  });

});