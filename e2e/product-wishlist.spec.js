import { test, expect } from '@playwright/test';

test.describe('Product Detail Modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#nav-link-shop').click();
    await page.waitForSelector('.product-card');
  });

  test('clicking product name opens the detail modal', async ({ page }) => {
    await page.locator('.product-card__name').first().click();
    // Modal should be visible
    await expect(page.locator('.product-detail, [class*="product-detail"]').first()).toBeVisible({ timeout: 5000 });
  });

  test('product detail modal shows product information', async ({ page }) => {
    const productName = await page.locator('.product-card__name').first().innerText();
    await page.locator('.product-card__name').first().click();

    const modal = page.locator('.product-detail, [class*="product-detail"]').first();
    await expect(modal).toBeVisible();
    await expect(modal.getByText(productName)).toBeVisible();
  });

  test('product detail modal can be closed', async ({ page }) => {
    await page.locator('.product-card__name').first().click();
    const modal = page.locator('.product-detail, [class*="product-detail"]').first();
    await expect(modal).toBeVisible();

    // Find close button and click it
    const closeBtn = modal.locator('button[aria-label*="close" i], button[aria-label*="Close" i], button[class*="close"]').first();
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
    } else {
      // Try Escape key
      await page.keyboard.press('Escape');
    }

    await expect(modal).not.toBeVisible({ timeout: 3000 });
  });
});

test.describe('Wishlist Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('wishlist page shows empty state initially', async ({ page }) => {
    await page.locator('#nav-wishlist-btn').click();
    await expect(
      page.getByText(/wishlist is empty|nothing wishlisted|empty/i)
    ).toBeVisible({ timeout: 5000 });
  });

  test('wishlisted product appears on wishlist page', async ({ page }) => {
    // Go to shop and wishlist a product
    await page.locator('#nav-link-shop').click();
    await page.waitForSelector('.product-card');

    const productName = await page.locator('.product-card__name').first().innerText();
    await page.locator('[id^="wishlist-btn-"]').first().click();

    // Navigate to wishlist page
    await page.locator('#nav-wishlist-btn').click();
    await expect(page.getByText(productName)).toBeVisible({ timeout: 5000 });
  });
});
