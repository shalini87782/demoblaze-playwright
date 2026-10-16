import { expect, test } from '@playwright/test';
import { LoginPage } from '../../src/pages/login-page';
import credentials from '../../test-data/login-credentials.json';

test('registered user can log in with valid credentials', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const login = new LoginPage(page);
  await login.open();
  await login.loginWith(credentials.userId, credentials.password);

  await login.expectLoggedInAs(credentials.userId);
});

test('unknown username is rejected when the password is otherwise valid', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const login = new LoginPage(page);
  await login.open();

  const alertMessage = page.waitForEvent('dialog').then(async (dialog) => {
    const message = dialog.message();
    await dialog.accept();
    return message;
  });
  await login.loginWith('invalid-demo-user', credentials.password);

  expect(await alertMessage).toContain('User does not exist.');
  await login.expectLoginModalOpen();
});
