import { expect, test } from '@playwright/test';
import { CatalogPage } from '../../src/pages/catalog-page';
import { PRODUCT } from '../helpers/cart-setup';

test('category selection filters the catalog to matching products', async ({ page }) => {
  const catalog = new CatalogPage(page);
  await catalog.open();
  await catalog.chooseCategory('Laptops');

  await expect(catalog.products).toHaveCount(6);
  await expect(catalog.product('Sony vaio i5')).toBeVisible();
});

test('laptop category excludes phone products', async ({ page }) => {
  const catalog = new CatalogPage(page);
  await catalog.open();
  await catalog.chooseCategory('Laptops');

  await expect(catalog.product(PRODUCT)).toHaveCount(0);
});
