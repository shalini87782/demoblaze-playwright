import { expect, test } from '@playwright/test';
import { CheckoutPage } from '../../src/pages/checkout-page';
import { LoginPage } from '../../src/pages/login-page';
import { addProductToCart } from '../helpers/cart-setup';
import credentials from '../../test-data/login-credentials.json';
import purchaseDetails from '../../test-data/purchase-details.json';

async function attachPurchaseConfirmation(page: import('@playwright/test').Page, testInfo: import('@playwright/test').TestInfo) {
  await testInfo.attach('purchase-confirmation', {
    body: await page.screenshot({ fullPage: true }),
    contentType: 'image/png',
  });
}

test('guest customer can complete checkout with valid order details', async ({ page }, testInfo) => {
  await addProductToCart(page);
  const checkout = new CheckoutPage(page);
  await checkout.open();
  await checkout.fillValidOrder(purchaseDetails);
  await checkout.submitValidOrder();
  await checkout.confirmSuccess();
  await attachPurchaseConfirmation(page, testInfo);
});

test('logged-in customer can complete purchase with dummy card details', async ({ page }, testInfo) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const login = new LoginPage(page);
  await login.open();
  await login.loginWith(credentials.userId, credentials.password);
  await login.expectLoggedInAs(credentials.userId);

  await addProductToCart(page);
  const checkout = new CheckoutPage(page);
  await checkout.open();
  await checkout.fillValidOrder(purchaseDetails);
  await checkout.submitValidOrder();
  await checkout.confirmSuccess();
  await attachPurchaseConfirmation(page, testInfo);
});

test('checkout rejects an order when required name and card details are blank', async ({ page }) => {
  await addProductToCart(page);
  const checkout = new CheckoutPage(page);
  await checkout.open();

  const validationMessage = await checkout.submitEmptyOrder();
  expect(validationMessage).toContain('Please fill out Name and Creditcard');
  await checkout.expectOrderFormStillOpen();
});

test.fail('checkout rejects a malformed card number', async ({ page }) => {
  await addProductToCart(page);
  const checkout = new CheckoutPage(page);
  await checkout.open();
  await checkout.fillValidOrder({ ...purchaseDetails, cardNumber: 'not-a-valid-card' });
  await checkout.submitOrder();

  await checkout.expectOrderFormStillOpen();
});
