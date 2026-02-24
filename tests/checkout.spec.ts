import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../pages/checkout.page';
import { CartPage } from '../pages/cart.page';
import { loginAs } from '../helpers/auth.helper';
import { addToCart, fillCheckoutForm } from '../helpers/cart.helper';
import checkoutData from '../fixtures/checkout-data.json';

// Playwright E2E - Checkout Flow
test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'standard_user');
    await addToCart(page, 'Sauce Labs Backpack');
  });

  test('completes checkout successfully', async ({ page }) => {
    await page.goto('/cart.html');
    await page.getByTestId('checkout').click();
    await fillCheckoutForm(page, checkoutData.valid);
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.continue();
    await checkoutPage.finish();
    await expect(page.locator('.complete-header')).toContainText('Thank you');
  });

  test('shows error when first name is missing', async ({ page }) => {
    const cartPage = new CartPage(page);
    await cartPage.goto();
    await cartPage.checkout();

    const checkoutPage = new CheckoutPage(page);
    await fillCheckoutForm(page, checkoutData.invalid);
    await checkoutPage.continue();
    await expect(checkoutPage.errorMessage).toContainText('First Name is required');
  });

  test('shows error when last name is missing', async ({ page }) => {
    const cartPage = new CartPage(page);
    await cartPage.goto();
    await cartPage.checkout();

    const checkoutPage = new CheckoutPage(page);
    await fillCheckoutForm(page, checkoutData.missingLastName);
    await checkoutPage.continue();
    await expect(checkoutPage.errorMessage).toContainText('Last Name is required');
  });

  test('shows error when zip code is missing', async ({ page }) => {
    const cartPage = new CartPage(page);
    await cartPage.goto();
    await cartPage.checkout();

    const checkoutPage = new CheckoutPage(page);
    await fillCheckoutForm(page, checkoutData.missingZip);
    await checkoutPage.continue();
    await expect(checkoutPage.errorMessage).toContainText('Postal Code is required');
  });

  test('can cancel checkout from step one', async ({ page }) => {
    const cartPage = new CartPage(page);
    await cartPage.goto();
    await cartPage.checkout();

    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.cancel();
    await expect(page).toHaveURL(/cart/);
  });

  test('can cancel checkout from step two', async ({ page }) => {
    const cartPage = new CartPage(page);
    await cartPage.goto();
    await cartPage.checkout();

    const checkoutPage = new CheckoutPage(page);
    await fillCheckoutForm(page, checkoutData.valid);
    await checkoutPage.continue();
    await checkoutPage.cancel();
    await expect(page).toHaveURL(/inventory/);
  });

  test('displays correct order summary on step two', async ({ page }) => {
    const cartPage = new CartPage(page);
    await cartPage.goto();
    await cartPage.checkout();

    const checkoutPage = new CheckoutPage(page);
    await fillCheckoutForm(page, checkoutData.valid);
    await checkoutPage.continue();

    const summaryItems = await page.locator('.cart_item').count();
    expect(summaryItems).toBeGreaterThan(0);

    const total = await checkoutPage.getSummaryTotal();
    expect(total).toMatch(/Total:/);
  });

  test('order confirmation page has back home button', async ({ page }) => {
    await page.goto('/cart.html');
    await page.getByTestId('checkout').click();
    await fillCheckoutForm(page, checkoutData.valid);
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.continue();
    await checkoutPage.finish();

    await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();
  });

  test('back home button returns to inventory after checkout', async ({ page }) => {
    await page.goto('/cart.html');
    await page.getByTestId('checkout').click();
    await fillCheckoutForm(page, checkoutData.valid);
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.continue();
    await checkoutPage.finish();
    await page.locator('[data-test="back-to-products"]').click();
    await expect(page).toHaveURL(/inventory/);
  });
});
