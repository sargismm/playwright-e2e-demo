import { test, expect } from '@playwright/test';
import { CartPage } from '../pages/cart.page';
import { InventoryPage } from '../pages/inventory.page';
import { loginAs } from '../helpers/auth.helper';
import { addToCart } from '../helpers/cart.helper';

test.describe('Cart Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'standard_user');
  });

  test('adds single item to cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addToCartByName('Sauce Labs Backpack');

    const cartPage = new CartPage(page);
    await cartPage.goto();
    const items = await cartPage.getItemNames();
    expect(items).toContain('Sauce Labs Backpack');
  });

  test('adds multiple items to cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addToCartByName('Sauce Labs Backpack');
    await inventoryPage.addToCartByName('Sauce Labs Bike Light');

    const cartPage = new CartPage(page);
    await cartPage.goto();
    expect(await cartPage.getItemCount()).toBe(2);
  });

  test('removes item from cart', async ({ page }) => {
    await addToCart(page, 'Sauce Labs Backpack');

    const cartPage = new CartPage(page);
    await cartPage.goto();
    await cartPage.removeItem('Sauce Labs Backpack');
    expect(await cartPage.getItemCount()).toBe(0);
  });

  test('cart is empty by default', async ({ page }) => {
    const cartPage = new CartPage(page);
    await cartPage.goto();
    expect(await cartPage.getItemCount()).toBe(0);
  });

  test('continues shopping from cart', async ({ page }) => {
    const cartPage = new CartPage(page);
    await cartPage.goto();
    await cartPage.continueShopping();
    await expect(page).toHaveURL(/inventory/);
  });

  test('cart persists after page reload', async ({ page }) => {
    await addToCart(page, 'Sauce Labs Backpack');
    await page.reload();

    const inventoryPage = new InventoryPage(page);
    const count = await inventoryPage.getCartCount();
    expect(count).toBe(1);
  });

  test('displays product price in cart', async ({ page }) => {
    await addToCart(page, 'Sauce Labs Backpack');

    const cartPage = new CartPage(page);
    await cartPage.goto();
    await expect(page.locator('.inventory_item_price')).toContainText('29.99');
  });

  test('displays product quantity in cart', async ({ page }) => {
    await addToCart(page, 'Sauce Labs Backpack');

    const cartPage = new CartPage(page);
    await cartPage.goto();
    await expect(page.locator('.cart_quantity')).toHaveText('1');
  });

  test('removes all items leaves empty cart', async ({ page }) => {
    await addToCart(page, 'Sauce Labs Backpack');
    await addToCart(page, 'Sauce Labs Bike Light');

    const cartPage = new CartPage(page);
    await cartPage.goto();
    await cartPage.removeItem('Sauce Labs Backpack');
    await cartPage.removeItem('Sauce Labs Bike Light');
    expect(await cartPage.getItemCount()).toBe(0);
  });
});
