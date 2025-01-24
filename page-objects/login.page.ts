import { Page } from 'playwright';

class LogInPage {
  get loginPanel() {
    return '.panel.header';
  }

  get emailInput() {
    return '#email';
  }

  get passwordInput() {
    return '#pass';
  }

  get signInButton() {
    return '#send2';
  }

  get errorMessage() {
    return '.message-error';
  }

  /**
   * Fill the login form and submit
   */
  async logIn({ page, email, password }: { page: Page, email: string, password: string }) {
    await page.waitForSelector(this.loginPanel, { state: 'visible' });
    await page.locator(this.loginPanel).locator('a').filter({ hasText: 'Sign In' }).click();
    await page.waitForSelector(this.emailInput, { state: 'visible' });
    await page.fill(this.emailInput, email);
    await page.fill(this.passwordInput, password);
    await page.click(this.signInButton);
    await page.waitForTimeout(1000);
  }
}

export default new LogInPage();