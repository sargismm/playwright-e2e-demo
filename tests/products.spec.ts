import { test, expect } from '@playwright/test';
import { InventoryPage } from '../pages/inventory.page';
import { loginAs } from '../helpers/auth.helper';
import products from '../fixtures/products.json';

test.describe('Product Browsing', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'standard_user');
  });

  test('displays all 6 products', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const names = await inventoryPage.getProductNames();
    expect(names).toHaveLength(6);
  });

  test('displays Sauce Labs Backpack', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const names = await inventoryPage.getProductNames();
    expect(names).toContain('Sauce Labs Backpack');
  });

  test('sorts products A to Z', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.sortProducts('az');
    const names = await inventoryPage.getProductNames();
    const sorted = [...names].sort();
    expect(names).toEqual(sorted);
  });

  test('sorts products Z to A', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.sortProducts('za');
    const names = await inventoryPage.getProductNames();
    const sorted = [...names].sort().reverse();
    expect(names).toEqual(sorted);
  });

  test('sorts products by price low to high', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.sortProducts('lohi');
    const prices = await inventoryPage.getProductPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test('sorts products by price high to low', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.sortProducts('hilo');
    const prices = await inventoryPage.getProductPrices();
    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);
  });

  test('navigates to product detail page', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.clickOnProduct('Sauce Labs Backpack');
    await expect(page).toHaveURL(/inventory-item/);
    await expect(page.locator('.inventory_details_name')).toContainText('Sauce Labs Backpack');
  });

  test('shows add to cart button on product detail page', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.clickOnProduct('Sauce Labs Backpack');
    await expect(page.locator('[data-test="add-to-cart"]')).toBeVisible();
  });

  test('back button on product detail returns to inventory', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.clickOnProduct('Sauce Labs Backpack');
    await page.locator('[data-test="back-to-products"]').click();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  for (const product of products.products) {
    test(`adds ${product.name} to cart`, async ({ page }) => {
      const inventoryPage = new InventoryPage(page);
      await inventoryPage.addToCartByName(product.name);
      const count = await inventoryPage.getCartCount();
      expect(count).toBe(1);
    });
  }

  test('remove button appears after adding item', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addToCartByName('Sauce Labs Backpack');
    const productCard = page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' });
    await expect(productCard.locator('button[id^="remove"]')).toBeVisible();
  });

  test('cart count increments when adding multiple items', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addToCartByName('Sauce Labs Backpack');
    await inventoryPage.addToCartByName('Sauce Labs Bike Light');
    const count = await inventoryPage.getCartCount();
    expect(count).toBe(2);
  });

  test('cart count decrements when removing item', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addToCartByName('Sauce Labs Backpack');
    await inventoryPage.addToCartByName('Sauce Labs Bike Light');
    await inventoryPage.removeFromCartByName('Sauce Labs Backpack');
    const count = await inventoryPage.getCartCount();
    expect(count).toBe(1);
  });
});
