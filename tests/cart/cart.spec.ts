import { expect, test } from '@playwright/test';
import { CartPage } from '../../src/pages/cart-page';
import { addProductToCart, PRODUCT } from '../helpers/cart-setup';

test('customer can add a product and see its price in the cart', async ({ page }) => {
  const cart = await addProductToCart(page);

  await expect(cart.rows.first()).toContainText(PRODUCT);
  await expect(cart.rows.first()).toContainText('360');
  await expect(cart.total).toHaveText('360');
});

test('customer can remove a product and the cart becomes empty', async ({ page }) => {
  const cart = await addProductToCart(page);
  await cart.deleteLink(0).click();

  await expect(cart.rows).toHaveCount(0);
  await expect(cart.total).toHaveText('');
});

test('empty cart has no line items or total', async ({ page }) => {
  await page.goto('/cart.html', { waitUntil: 'domcontentloaded' });
  const cart = new CartPage(page);

  await expect(cart.rows).toHaveCount(0);
  await expect(cart.total).toHaveText('');
});
