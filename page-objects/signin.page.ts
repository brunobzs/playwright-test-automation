import { faker } from '@faker-js/faker';
import { expect, Page } from "@playwright/test";

class SignInPage {
  get newUser() {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    }
  }

  get pageTitle() {
    return '[data-ui-id="page-title-wrapper"]';
  }

  get firstNameInput() {
    return '#firstname';
  }

  get lastNameInput() {
    return '#lastname';
  }

  get emailInput() {
    return '#email_address';
  }

  get passwordInput() {
    return '#password';
  }

  get passwordStrength() {
    return '#password-strength-meter'
  }

  get passwordConfirmationInput() {
    return '#password-confirmation';
  }

  get successMessage() {
    return '[data-ui-id="message-success"]';
  }

  // FUNCTIONS ---------------------------------//

  /**
   * Fill in the registration form
   */
  async fillTheForm({ page, firstName, lastName, email, password }: { page: Page, firstName: string, lastName: string, email: string, password: string }) {
    const inputAndValues = [
      { selector: this.firstNameInput, value: firstName },
      { selector: this.lastNameInput, value: lastName },
      { selector: this.emailInput, value: email }
    ]

    for (const { selector, value } of inputAndValues) {
      await page.locator(selector).fill(value);
    }

    const passwordInputs = [this.passwordInput, this.passwordConfirmationInput];
    for (const input of passwordInputs) {
      await page.locator(input).fill(password);

      const passwordStrength = await page.locator(this.passwordStrength).innerText()
      expect(passwordStrength).not.toContain('Weak');
    }
  }
}

export default new SignInPage();