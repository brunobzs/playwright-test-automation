import { faker } from '@faker-js/faker';
import { expect, Page } from "@playwright/test";

interface RegisterNewUserParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

class SignInPage {
  readonly page: Page;
  readonly firstNameInput: string;
  readonly lastNameInput: string;
  readonly emailInput: string;
  readonly passwordInput: string;
  readonly passwordConfirmationInput: string;
  readonly passwordStrength: string;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = '#firstname';
    this.lastNameInput = '#lastname';
    this.emailInput = '#email_address';
    this.passwordInput = '#password';
    this.passwordConfirmationInput = '#password-confirmation';
    this.passwordStrength = '#password-strength-meter';
  }

  get newUser() {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    }
  }

  // FUNCTIONS ---------------------------------//

  async registerNewUser(params: RegisterNewUserParams) {
    const inputs = [
      { input: this.firstNameInput, value: params.firstName },
      { input: this.lastNameInput, value: params.lastName },
      { input: this.emailInput, value: params.email },
      { input: this.passwordInput, value: params.password },
      { input: this.passwordConfirmationInput, value: params.password }
    ]

    for (const { input, value } of inputs) {
      await this.page.locator(input).fill(value);
    }

    const passwordStrength = await this.page.locator(this.passwordStrength).innerText()
    expect(passwordStrength).not.toContain('Weak');
  }

  async clickOnCreateAccount({ isButton }: { isButton: boolean }) {
    return await this.page.locator(isButton ? 'button' : 'a', { hasText: 'Create an Account' }).first().click();
  }

  async successRegisterMessage() {
    const successMessage = this.page.locator('[data-ui-id="message-success"]');
    await successMessage.waitFor({ state: 'visible' });
    await expect(successMessage).toContainText('Thank you for registering with Main Website Store.');
  }
}

export default SignInPage;