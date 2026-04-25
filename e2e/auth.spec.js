const { test, expect } = require('@playwright/test');
const { loginAs, STUDENT, ADMIN } = require('./helpers');

test.describe('Authentication', () => {

  test('Register page loads correctly', async ({ page }) => {
    await page.goto('/register');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();
    await expect(page.locator('select[name="faculty"]')).toBeVisible();
  });

  test('Register fails with mismatched passwords', async ({ page }) => {
    await page.goto('/register');
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@test.com');
    await page.selectOption('select[name="faculty"]', 'Computing');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'differentpassword');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Passwords do not match')).toBeVisible();
  });

  test('Register fails with short password', async ({ page }) => {
    await page.goto('/register');
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@test.com');
    await page.selectOption('select[name="faculty"]', 'Computing');
    await page.fill('input[name="password"]', '123');
    await page.fill('input[name="confirmPassword"]', '123');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=at least 6 characters')).toBeVisible();
  });

  test('Login page loads correctly', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('a[href="/forgot-password"]')).toBeVisible();
    await expect(page.locator('a[href="/register"]').first()).toBeVisible();
  });

  test('Login fails with wrong password', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', STUDENT.email);
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    // use first() to avoid strict mode violation with duplicate text
    await expect(page.locator('text=Invalid email or password').first()).toBeVisible();
  });

  test('Student can login successfully', async ({ page }) => {
    await loginAs(page, 'student');
    await expect(page).not.toHaveURL(/login/);
    // check user name appears somewhere on page
    await expect(page.locator('text=rashmy').first()).toBeVisible();
  });

  test('Admin can login successfully', async ({ page }) => {
    await loginAs(page, 'admin');
    await expect(page).not.toHaveURL(/login/);
    await expect(page.locator('text=admin').first()).toBeVisible();
  });

  test('Student cannot access admin panel', async ({ page }) => {
    await loginAs(page, 'student');
    await page.goto('/admin');
    await expect(page).not.toHaveURL('/admin');
  });

  test('Forgot password page loads correctly', async ({ page }) => {
    await page.goto('/forgot-password');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('Forgot password shows success message', async ({ page }) => {
    await page.goto('/forgot-password');
    await page.fill('input[type="email"]', STUDENT.email);
    await page.click('button[type="submit"]');
    // wait for any success state to appear
    await expect(page.locator('h2').first()).toBeVisible({ timeout: 10000 });
    const h2Text = await page.locator('h2').first().textContent();
    expect(h2Text?.toLowerCase()).toContain('check');
  });

  test('Student can logout', async ({ page }) => {
    await loginAs(page, 'student');
    await page.click('button:has-text("Logout")');
    await expect(page.locator('a:has-text("Login")').first()).toBeVisible();
  });

});