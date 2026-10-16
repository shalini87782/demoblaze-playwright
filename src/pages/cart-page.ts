import { expect, Page } from '@playwright/test';

export class CartPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get rows() {
    return this.page.locator('#tbodyid tr');
  }

  get total() {
    return this.page.locator('#totalp');
  }

  deleteLink(rowIndex: number) {
    const cartRow = this.rows.nth(rowIndex);
    return cartRow.getByRole('link', { name: 'Delete' });
  }

  async open() {
    const cartLink = this.page.getByRole('link', { name: 'Cart', exact: true });
    await cartLink.click();
    await expect(this.page).toHaveURL(/cart\.html/);
  }

  async placeOrder() {
    const placeOrderButton = this.page.getByRole('button', { name: 'Place Order' });
    const orderModal = this.page.locator('#orderModal');

    await placeOrderButton.click();
    await expect(orderModal).toBeVisible();
  }
}
