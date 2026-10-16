import { expect, test } from '@playwright/test';
import { CartPage } from '../../src/pages/cart-page';
import { CatalogPage } from '../../src/pages/catalog-page';
import { ProductPage } from '../../src/pages/product-page';
import { PRODUCT } from '../helpers/cart-setup';

test('product details show the selected product and price', async ({ page }) => {
  const catalog = new CatalogPage(page);
  await catalog.open();
  await catalog.openProduct(PRODUCT);

  await new ProductPage(page).expectDetails(PRODUCT, '$360');
});

test('customer can add the selected product to the cart', async ({ page }) => {
  const catalog = new CatalogPage(page);
  await catalog.open();
  await catalog.openProduct(PRODUCT);
  await new ProductPage(page).addToCart();

  const cart = new CartPage(page);
  await cart.open();
  await expect(cart.rows).toHaveCount(1);
  await expect(cart.rows.first()).toContainText(PRODUCT);
  await expect(cart.total).toHaveText('360');
});

test('unknown product ID does not show a different known product', async ({ page }) => {
  await page.goto('/prod.html?idp_=99999', { waitUntil: 'domcontentloaded' });
  const productTitle = page.locator('.name');

  await expect(productTitle).toBeVisible();
  await expect(productTitle).not.toHaveText(PRODUCT);
});
