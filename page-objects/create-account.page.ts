import { faker } from '@faker-js/faker';
import {expect, Page} from "@playwright/test";

// INTERFACES ---------------------------------//
interface CheckPageTitleParams {
  page: Page;
  title: string;
}

interface FillFormParams {
  page: Page,
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
// --------------------------------------------//

class CreateAccountPage {
  get newUser(): { firstName: string, lastName: string, email: string, password: string} {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    }
  }

  get pageTitle(): string {
    return '[data-ui-id="page-title-wrapper"]';
  }

  get firstNameInput(): string {
    return '#firstname';
  }

  get lastNameInput(): string {
    return '#lastname';
  }

  get emailInput(): string {
    return '#email_address';
  }

  get passwordInput(): string {
    return '#password';
  }

  get passwordStrength(): string {
    return '#password-strength-meter'
  }

  get passwordConfirmationInput(): string {
    return '#password-confirmation';
  }

  get successMessage(): string {
    return '[data-ui-id="message-success"]';
  }

  // FUNCTIONS ---------------------------------//

  /**
   * Click on the "Create an Account" button
   */
  async clickOnCreateAccountButton(page: Page) {
    return await page.locator('a', { hasText: 'Create an Account' }).first().click();
  }

  /**
   * Check if the page title is visible and contains the expected text
   *
   * @param {Object} params - The parameters object
   * @param {string} params.title - The expected text
   */
  async checkPageTitle(params: CheckPageTitleParams) {
    const { page, title } = params;
    return await expect(page.locator(this.pageTitle)).toContainText(title)
  }

  /**
   * Fill in the registration form
   *
   * @param {object} params - The parameters object
   * @param {string} params.firstName - The first name
   * @param {string} params.lastName - The last name
   * @param {string} params.email - The email
   * @param {string} params.password - The password
   */
  async fillTheForm(params: FillFormParams) {
    const { page, firstName, lastName, email, password } = params;
    const inputAndValues: { selector: string, value: string}[] = [
      { selector: this.firstNameInput, value: firstName },
      { selector: this.lastNameInput, value: lastName },
      { selector: this.emailInput, value: email }
    ]

    for (const { selector, value } of inputAndValues) {
      await page.locator(selector).fill(value);
    };

    const passwordInputs: string[] = [this.passwordInput, this.passwordConfirmationInput];
    for (const input of passwordInputs) {
      await page.locator(input).fill(password);

      const passwordStrength: string = await page.locator(this.passwordStrength).innerText()
      expect(passwordStrength).not.toContain('Weak');

    }
  }
}

export default new CreateAccountPage();