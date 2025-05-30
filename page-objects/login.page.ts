import { Page, expect } from '@playwright/test';

class LogInPage {
  readonly page: Page;
  readonly loginPanel: string;
  readonly emailInput: string;
  readonly passwordInput: string;

  constructor(page: Page) {
    this.page = page;
    this.loginPanel = '.panel.header';
    this.emailInput = '#email';
    this.passwordInput = '[name="login[password]"]';
  }

  async fillEmailInput(email: string) {
    await this.page.waitForSelector(this.emailInput, { state: 'visible' });
    await this.page.fill(this.emailInput, email);
  }

  async fillPasswordInput(password: string) {
    await this.page.waitForSelector(this.passwordInput, { state: 'visible' });
    await this.page.fill(this.passwordInput, password);
  }

  async clickOnSignIn({ isButton }: { isButton: boolean }) {
    if (isButton) {
      return this.page.getByRole('button', { name: 'Sign In' }).click();
    } else {
      await this.page.waitForSelector(this.loginPanel, { state: 'visible' });
      return this.page.locator(this.loginPanel).locator('a').filter({ hasText: 'Sign In' }).click();
    }
  }

  async successLogInMessage() {
    await this.page.waitForTimeout(2000);
    await expect(this.page.locator(this.loginPanel).locator('.logged-in')).toContainText('Welcome, User Test!');
  }

  async errorLogInMessage() {
    await this.page.waitForTimeout(1000);
    await expect(this.page.locator('.message-error'))
      .toContainText('The account sign-in was incorrect or your account is disabled temporarily. Please wait and try again later');
  }
}

export default LogInPage;