import { expect, Page } from '@playwright/test';

export class LoginPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async open() {
    const loginLink = this.page.getByRole('link', { name: 'Log in', exact: true });
    const loginModal = this.page.locator('#logInModal');

    await loginLink.click();
    await expect(loginModal).toBeVisible();
  }

  async loginWith(username: string, password: string) {
    const usernameInput = this.page.locator('#loginusername');
    const passwordInput = this.page.locator('#loginpassword');
    const loginButton = this.page.getByRole('button', { name: 'Log in', exact: true });

    await usernameInput.fill(username);
    await passwordInput.fill(password);
    await loginButton.click();
  }

  async expectLoginModalOpen() {
    await expect(this.page.locator('#logInModal')).toBeVisible();
  }

  async expectLoggedInAs(username: string) {
    const welcomeMessage = this.page.getByRole('link', { name: `Welcome ${username}`, exact: true });
    const logOutLink = this.page.getByRole('link', { name: 'Log out', exact: true });

    await expect(welcomeMessage).toBeVisible();
    await expect(logOutLink).toBeVisible();
  }
}
