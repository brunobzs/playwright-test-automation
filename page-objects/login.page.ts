import { Page, expect } from '@playwright/test';

class LogInPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
  
  get loginPanel() {
    return '.panel.header';
  }


  async fillEmailInput(email: string) {
    const emailInput = '#email';
    await this.page.waitForSelector(emailInput, { state: 'visible' });
    await this.page.fill(emailInput, email);
  }

  async fillPasswordInput(password: string) {
    const passwordInput = '[name="login[password]"]';
    await this.page.waitForSelector(passwordInput, { state: 'visible' });
    await this.page.fill(passwordInput, password);
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