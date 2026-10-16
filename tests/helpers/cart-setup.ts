import { expect, Page } from '@playwright/test';
import { CartPage } from '../../src/pages/cart-page';
import { ProductPage } from '../../src/pages/product-page';
import { CatalogPage } from '../../src/pages/catalog-page';

export const PRODUCT = 'Samsung galaxy s6';

export async function addProductToCart(page: Page) {
  const catalog = new CatalogPage(page);
  await catalog.open();
  await catalog.openProduct(PRODUCT);
  await new ProductPage(page).addToCart();

  const cart = new CartPage(page);
  await cart.open();
  await expect(cart.rows).toHaveCount(1);
  return cart;
}
