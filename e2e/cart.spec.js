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
    // Navigate home
    await page.goto('/');

    // Wait for products to load and be visible
    await expect(page.locator('.product-card').first()).toBeVisible({ timeout: 5000 });

    // Find the first product card
    const firstProduct = page.locator('.product-card').first();
    const productName = await firstProduct.locator('.product-card__name').textContent();
    
    // Click its 'Add' button
    await firstProduct.locator('button:has-text("Add")').click();

    // Navigate to Cart
    await page.locator('#nav-link-cart, [aria-label*="cart" i]').click();

    // Product should appear in cart as a heading or within the cart item
    await expect(page.locator('.cart-item__name', { hasText: productName })).toBeVisible({ timeout: 5000 });
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
    // Navigate home
    await page.goto('/');

    // Wait for products
    await expect(page.locator('.product-card').first()).toBeVisible({ timeout: 5000 });

    // Click 'Add' on the first product
    await page.locator('.product-card').first().locator('button:has-text("Add")').click();

    // Verify toast notification appears
    await expect(
      page.locator('.toast').first()
    ).toBeVisible({ timeout: 4000 });
  });
});
