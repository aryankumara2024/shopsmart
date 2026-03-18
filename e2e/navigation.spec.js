import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('homepage loads and shows ShopSmart branding', async ({ page }) => {
    await expect(page).toHaveTitle(/ShopSmart/i);
    await expect(page.getByText('ShopSmart').first()).toBeVisible();
  });

  test('navbar is visible with all links', async ({ page }) => {
    await expect(page.locator('#main-nav')).toBeVisible();
    await expect(page.locator('#nav-link-home')).toBeVisible();
    await expect(page.locator('#nav-link-shop')).toBeVisible();
    await expect(page.locator('#nav-link-about')).toBeVisible();
  });

  test('clicking Shop nav link navigates to shop page', async ({ page }) => {
    await page.locator('#nav-link-shop').click();
    await expect(page.getByText(/all products/i)).toBeVisible({ timeout: 5000 });
  });

  test('clicking About nav link navigates to about page', async ({ page }) => {
    await page.locator('#nav-link-about').click();
    await expect(page.getByText(/about/i).first()).toBeVisible({ timeout: 5000 });
  });

  test('clicking logo returns to home page', async ({ page }) => {
    // First navigate away
    await page.locator('#nav-link-shop').click();
    // Then click logo to go home
    await page.locator('#nav-logo').click();
    await expect(page.locator('#nav-link-home')).toHaveClass(/navbar__link--active/);
  });
});
