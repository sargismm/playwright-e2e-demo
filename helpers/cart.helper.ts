import { Page } from '@playwright/test';
import { CheckoutInfo } from '../pages/checkout.page';

export async function addToCart(page: Page, productName: string) {
  const productCard = page.locator('.inventory_item').filter({ hasText: productName });
  await productCard.locator('button[id^="add-to-cart"]').click();
}

export async function clearCart(page: Page) {
  await page.goto('/cart.html');
  const removeButtons = page.locator('button[id^="remove"]');
  const count = await removeButtons.count();
  for (let i = 0; i < count; i++) {
    await removeButtons.first().click();
  }
}

export async function fillCheckoutForm(page: Page, data: CheckoutInfo) {
  await page.locator('[data-test="firstName"]').fill(data.firstName);
  await page.locator('[data-test="lastName"]').fill(data.lastName);
  await page.locator('[data-test="postalCode"]').fill(data.zipCode);
}
