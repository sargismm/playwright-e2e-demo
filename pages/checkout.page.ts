import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  zipCode: string;
}

export class CheckoutPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly zipCodeInput: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;
  readonly completeHeader: Locator;
  readonly errorMessage: Locator;
  readonly summaryTotal: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.zipCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.completeHeader = page.locator('.complete-header');
    this.errorMessage = page.locator('[data-test="error"]');
    this.summaryTotal = page.locator('.summary_total_label');
  }

  async fillCheckoutForm(info: CheckoutInfo) {
    await this.firstNameInput.fill(info.firstName);
    await this.lastNameInput.fill(info.lastName);
    await this.zipCodeInput.fill(info.zipCode);
  }

  async continue() {
    await this.continueButton.click();
  }

  async finish() {
    await this.finishButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async getSummaryTotal(): Promise<string> {
    return (await this.summaryTotal.textContent()) || '';
  }
}
