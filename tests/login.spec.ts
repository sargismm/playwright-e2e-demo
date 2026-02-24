import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import users from '../fixtures/users.json';

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('logs in with valid credentials', async ({ page }) => {
    await loginPage.login(users.standard_user.username, users.standard_user.password);
    await expect(page).toHaveURL(/inventory/);
  });

  test('displays inventory page title after login', async ({ page }) => {
    await loginPage.login(users.standard_user.username, users.standard_user.password);
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('shows error for locked out user', async () => {
    await loginPage.login(users.locked_out_user.username, users.locked_out_user.password);
    await expect(loginPage.errorMessage).toContainText('locked out');
  });

  test('shows error for wrong password', async () => {
    await loginPage.login('standard_user', 'wrong_password');
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('shows error when username is empty', async () => {
    await loginPage.login('', 'secret_sauce');
    await expect(loginPage.errorMessage).toContainText('Username is required');
  });

  test('shows error when password is empty', async () => {
    await loginPage.login('standard_user', '');
    await expect(loginPage.errorMessage).toContainText('Password is required');
  });

  test('clears error message on input', async () => {
    await loginPage.login('', '');
    await expect(loginPage.errorMessage).toBeVisible();
    await loginPage.usernameInput.fill('standard_user');
    await loginPage.passwordInput.fill('secret_sauce');
    await loginPage.loginButton.click();
    await expect(loginPage.errorMessage).not.toBeVisible();
  });

  test('logs out successfully', async ({ page }) => {
    await loginPage.login(users.standard_user.username, users.standard_user.password);
    await page.locator('#react-burger-menu-btn').click();
    await page.locator('[data-test="logout-sidebar-link"]').click();
    await expect(page).toHaveURL('/');
    await expect(loginPage.loginButton).toBeVisible();
  });
});
