import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {

  test('successfully register, login, and show contextual navbar', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // 1. Click user account icon (should fail since not logged in, drops us on AuthPage)
    await page.locator('#nav-account-btn').click();

    // 2. Switch to Register tab
    await page.getByRole('button', { name: 'Register' }).click();

    // 3. Fill out registration form
    const randomSuffix = Math.floor(Math.random() * 10000);
    const testUsername = `testuser_${randomSuffix}`;
    const testEmail = `testuser_${randomSuffix}@example.com`;
    const testPassword = 'password123';

    await page.locator('input[name="username"]').fill(testUsername);
    await page.locator('input[name="email"]').fill(testEmail);
    await page.locator('input[name="password"]').fill(testPassword);
    
    // Intercept standard alert (Mocked natively inside app)
    page.on('dialog', dialog => {
      console.log('Dialog message:', dialog.message());
      dialog.accept();
    });
    
    // Submit registration
    await page.locator('button[type="submit"]:has-text("Register")').click();

    // 4. Assuming reg success, UI should swap back to Login tab (or user clicks Login tab)
    // Wait for the login button to be active
    const loginSubmitBtn = page.locator('button[type="submit"]:has-text("Login")');
    await expect(loginSubmitBtn).toBeVisible({ timeout: 5000 });

    // 5. Fill out Login form
    await page.locator('input[name="email"]').fill(testEmail);
    await page.locator('input[name="password"]').fill(testPassword);
    
    // Submit login
    await loginSubmitBtn.click();

    // 6. Verify User Context inside Navbar updates dynamically
    const logoutBtn = page.locator('#nav-logout-btn');
    await expect(logoutBtn).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(`Hi, ${testUsername}`)).toBeVisible();

    // 7. Test Logout 
    await logoutBtn.click();

    // Verify fallback to generic account button
    await expect(page.locator('#nav-account-btn')).toBeVisible();
    await expect(page.getByText(`Hi, ${testUsername}`)).not.toBeVisible();
  });
});