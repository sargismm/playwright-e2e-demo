import { Page } from '@playwright/test';

export async function loginAs(page: Page, username: string, password: string = 'secret_sauce') {
  await page.goto('/');
  await page.locator('[data-test="username"]').fill(username);
  await page.locator('[data-test="password"]').fill(password);
  await page.locator('[data-test="login-button"]').click();
  await page.waitForURL('**/inventory.html');
}
