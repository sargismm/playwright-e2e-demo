import { test, expect } from '@playwright/test';
import { loginAs } from '../helpers/auth.helper';
import { addToCart } from '../helpers/cart.helper';

test.describe('Visual Regression', () => {
  test('login page matches snapshot', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveScreenshot('login-page.png');
  });

  test('inventory page matches snapshot', async ({ page }) => {
    await loginAs(page, 'standard_user');
    await expect(page).toHaveScreenshot('inventory-page.png');
  });

  test('cart page matches snapshot', async ({ page }) => {
    await loginAs(page, 'standard_user');
    await addToCart(page, 'Sauce Labs Backpack');
    await page.goto('/cart.html');
    await expect(page).toHaveScreenshot('cart-page.png');
  });

  test('checkout step one matches snapshot', async ({ page }) => {
    await loginAs(page, 'standard_user');
    await addToCart(page, 'Sauce Labs Backpack');
    await page.goto('/cart.html');
    await page.getByTestId('checkout').click();
    await expect(page).toHaveScreenshot('checkout-step-one.png');
  });
});
