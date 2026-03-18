import { test, expect } from '@playwright/test';

test.describe('Shop Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#nav-link-shop').click();
    // Wait for products to appear
    await page.waitForSelector('.product-card', { timeout: 10000 });
  });

  test('displays products on the shop page', async ({ page }) => {
    const cards = page.locator('.product-card');
    await expect(cards.first()).toBeVisible();
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('product card shows name, category, price and Add button', async ({ page }) => {
    const firstCard = page.locator('.product-card').first();
    await expect(firstCard.locator('.product-card__name')).toBeVisible();
    await expect(firstCard.locator('.product-card__category')).toBeVisible();
    await expect(firstCard.locator('.product-card__price')).toBeVisible();
    await expect(firstCard.locator('button', { hasText: /add/i })).toBeVisible();
  });

  test('clicking Add to cart button updates the cart badge', async ({ page }) => {
    // Ensure cart badge doesn't exist initially
    await expect(page.locator('.navbar__cart-badge')).not.toBeVisible();

    // Add first product
    const addBtn = page.locator('[id^="add-to-cart-"]').first();
    await addBtn.click();

    // Badge should now appear with count 1
    await expect(page.locator('.navbar__cart-badge')).toBeVisible({ timeout: 3000 });
    await expect(page.locator('.navbar__cart-badge')).toHaveText('1');
  });

  test('wishlist button toggles on product card', async ({ page }) => {
    const wishlistBtn = page.locator('[id^="wishlist-btn-"]').first();
    await expect(wishlistBtn).toHaveAttribute('aria-label', 'Add to wishlist');

    await wishlistBtn.click();
    await expect(wishlistBtn).toHaveAttribute('aria-label', 'Remove from wishlist');

    await wishlistBtn.click();
    await expect(wishlistBtn).toHaveAttribute('aria-label', 'Add to wishlist');
  });

  test('search modal opens when search icon is clicked', async ({ page }) => {
    await page.locator('#nav-search-btn').click();
    // Search modal should appear
    await expect(page.locator('#search-modal')).toBeVisible({ timeout: 3000 });
  });
});
