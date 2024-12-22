import { Page } from 'playwright/test';
import config from '../playwright.config';

// INTERFACES -----------------------------------
interface LoginParams {
  page: Page;
  email: string;
  password: string;
}
// ----------------------------------------------

class LoginPage {
  get user(): { firstName: string, lastName: string, email: string, password: string } {
    return {
      "firstName": "User",
      "lastName": "Test",
      "email": "brunobzs+test@gmail.com",
      "password": "Test1234"
    }
  }

  get loginPanel(): string {
    return '.panel.header';
  }

  get emailInput(): string {
    return '#email';
  }

  get passwordInput(): string {
    return '#pass';
  }

  get signInButton(): string {
    return '#send2';
  }

  get errorMessage(): string {
    return '.message-error';
  }


  // FUNCTIONS -----------------------------------

  /**
   * Access the webpage
   *
   * @param {object} params
   * @param {Page} params.page - Playwright page object
   */
  async accessWebpage({ page }: { page: Page }) {
    const baseURL = config.use?.baseURL;

    await page.goto(baseURL);
  }

  async login(params: LoginParams) {
    const { page, email, password } = params;

    await page.waitForSelector(this.loginPanel, { state: 'visible' });
    await page.locator(this.loginPanel).locator('a').filter({ hasText: 'Sign In' }).click();
    await page.waitForSelector(this.emailInput, { state: 'visible' });
    await page.fill(this.emailInput, email);
    await page.fill(this.passwordInput, password);
    await page.click(this.signInButton);
    await page.waitForTimeout(1000);
  }
}

export default new LoginPage();
