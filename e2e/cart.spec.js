import { test, expect } from '@playwright/test';

test.describe('Cart Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start fresh — clear localStorage
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('cart page shows empty state when no items added', async ({ page }) => {
    await page.locator('#nav-cart-btn').click();
    // Expect some kind of empty state text
    await expect(
      page.getByText(/your cart is empty|nothing in your cart|empty/i)
    ).toBeVisible({ timeout: 5000 });
  });

  test('adding a product and navigating to cart shows the item', async ({ page }) => {
    // Go to shop and add an item
    await page.locator('#nav-link-shop').click();
    await page.waitForSelector('.product-card');

    // Get the product name before clicking Add
    const productName = await page.locator('.product-card__name').first().innerText();
    await page.locator('[id^="add-to-cart-"]').first().click();

    // Navigate to cart
    await page.locator('#nav-cart-btn').click();

    // Product should appear in cart
    await expect(page.getByText(productName)).toBeVisible({ timeout: 5000 });
  });

  test('cart count badge updates after adding multiple items', async ({ page }) => {
    await page.locator('#nav-link-shop').click();
    await page.waitForSelector('.product-card');

    const addBtns = page.locator('[id^="add-to-cart-"]');

    await addBtns.nth(0).click();
    await page.waitForSelector('.navbar__cart-badge');
    expect(await page.locator('.navbar__cart-badge').innerText()).toBe('1');

    await addBtns.nth(1).click();
    await expect(page.locator('.navbar__cart-badge')).toHaveText('2');
  });

  test('toast notification appears after adding to cart', async ({ page }) => {
    await page.locator('#nav-link-shop').click();
    await page.waitForSelector('.product-card');

    await page.locator('[id^="add-to-cart-"]').first().click();

    // Toast should appear — look for "added to cart" type text
    await expect(
      page.locator('text=/added to cart/i').or(page.locator('.toast, [class*="toast"]'))
    ).toBeVisible({ timeout: 4000 });
  });
});
