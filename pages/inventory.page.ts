import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class InventoryPage extends BasePage {
  readonly inventoryList: Locator;
  readonly sortDropdown: Locator;
  readonly cartIcon: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    super(page);
    this.inventoryList = page.locator('.inventory_list');
    this.sortDropdown = page.getByRole('combobox');
    this.cartIcon = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  async goto() {
    await this.navigate('/inventory.html');
  }

  async addToCartByName(productName: string) {
    const productCard = this.page.locator('.inventory_item').filter({ hasText: productName });
    await productCard.locator('button[id^="add-to-cart"]').click();
  }

  async removeFromCartByName(productName: string) {
    const productCard = this.page.locator('.inventory_item').filter({ hasText: productName });
    await productCard.locator('button[id^="remove"]').click();
  }

  async sortProducts(option: 'az' | 'za' | 'lohi' | 'hilo') {
    const labelMap = {
      az: 'Name (A to Z)',
      za: 'Name (Z to A)',
      lohi: 'Price (low to high)',
      hilo: 'Price (high to low)',
    };
    await this.sortDropdown.selectOption({ label: labelMap[option] });
  }

  async getProductNames(): Promise<string[]> {
    return this.page.locator('.inventory_item_name').allTextContents();
  }

  async getProductPrices(): Promise<number[]> {
    const priceTexts = await this.page.locator('.inventory_item_price').allTextContents();
    return priceTexts.map(p => parseFloat(p.replace('$', '')));
  }

  async clickOnProduct(productName: string) {
    await this.page.locator('.inventory_item_name').filter({ hasText: productName }).click();
  }

  async getCartCount(): Promise<number> {
    const badge = this.cartBadge;
    const isVisible = await badge.isVisible();
    if (!isVisible) return 0;
    const text = await badge.textContent();
    return parseInt(text || '0');
  }
}
