import { expect, Page } from '@playwright/test';
import type { PurchaseDetails } from '../types/purchase-details';

export class CheckoutPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async open() {
    const placeOrderButton = this.page.getByRole('button', { name: 'Place Order' });
    const orderModal = this.page.locator('#orderModal');

    await placeOrderButton.click();
    await expect(orderModal).toBeVisible();
  }

  async fillValidOrder(details: PurchaseDetails) {
    const customerNameInput = this.page.locator('#name');
    const countryInput = this.page.locator('#country');
    const cityInput = this.page.locator('#city');
    const creditCardInput = this.page.locator('#card');
    const cardMonthInput = this.page.locator('#month');
    const cardYearInput = this.page.locator('#year');

    await customerNameInput.fill(details.name);
    await countryInput.fill(details.country);
    await cityInput.fill(details.city);
    await creditCardInput.fill(details.cardNumber);
    await cardMonthInput.fill(details.month);
    await cardYearInput.fill(details.year);
  }

  async submitOrder() {
    const purchaseButton = this.page.getByRole('button', { name: 'Purchase' });
    await purchaseButton.click();
  }

  async submitValidOrder() {
    const purchaseConfirmation = this.page.getByRole('heading', { name: 'Thank you for your purchase!' });

    await this.submitOrder();
    await expect(purchaseConfirmation).toBeVisible();
  }

  async submitEmptyOrder() {
    const validationAlert = this.page.waitForEvent('dialog').then(async (dialog) => {
      const message = dialog.message();
      await dialog.accept();
      return message;
    });

    await this.submitOrder();
    return validationAlert;
  }

  async expectOrderFormStillOpen() {
    const orderModal = this.page.locator('#orderModal');
    const purchaseConfirmation = this.page.getByRole('heading', { name: 'Thank you for your purchase!' });

    await expect(orderModal).toBeVisible();
    await expect(purchaseConfirmation).toHaveCount(0);
  }

  async confirmSuccess() {
    const purchaseConfirmation = this.page.getByRole('heading', { name: 'Thank you for your purchase!' });
    const confirmationId = this.page.getByText(/Id:/);
    const confirmationOkButton = this.page.getByRole('button', { name: 'OK' });

    await expect(purchaseConfirmation).toBeVisible();
    await expect(confirmationId).toBeVisible();
    await expect(confirmationOkButton).toBeVisible();
  }
}
