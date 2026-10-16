import { expect, Page } from '@playwright/test';

export class CatalogPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get products() {
    return this.page.locator('#tbodyid .card');
  }

  async open() {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    const phonesCategoryLink = this.page.getByRole('link', { name: 'Phones', exact: true });
    await expect(phonesCategoryLink).toBeVisible();
    await expect(this.products.first()).toBeVisible();
  }

  async chooseCategory(category: 'Phones' | 'Laptops' | 'Monitors') {
    const categoryLinks = {
      Phones: this.page.getByRole('link', { name: 'Phones', exact: true }),
      Laptops: this.page.getByRole('link', { name: 'Laptops', exact: true }),
      Monitors: this.page.getByRole('link', { name: 'Monitors', exact: true }),
    };
    const selectedCategoryLink = categoryLinks[category];

    await selectedCategoryLink.click();
    await expect(this.products.first()).toBeVisible();
  }

  product(name: string) {
    return this.page.getByRole('link', { name, exact: true });
  }

  async openProduct(name: string) {
    const productLink = this.product(name);
    const productHeading = this.page.getByRole('heading', { name, level: 2 });

    await productLink.click();
    await expect(productHeading).toBeVisible();
  }
}
