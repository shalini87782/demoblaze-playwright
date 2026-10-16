import { expect, Page } from '@playwright/test';

export class ProductPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async expectDetails(name: string, price: string) {
    const productTitle = this.page.locator('.name');
    const productPrice = this.page.locator('.price-container');
    const productDescriptionLabel = this.page.getByText('Product description');
    const addToCartLink = this.page.getByRole('link', { name: 'Add to cart' });

    await expect(productTitle).toHaveText(name);
    await expect(productPrice).toContainText(price);
    await expect(productDescriptionLabel).toBeVisible();
    await expect(addToCartLink).toBeVisible();
  }

  async addToCart() {
    const addToCartLink = this.page.getByRole('link', { name: 'Add to cart' });
    const dialogPromise = this.page.waitForEvent('dialog');
    await addToCartLink.click();
    const alert = await dialogPromise;
    expect(alert.message()).toContain('Product added');
    await alert.accept();
  }
}
