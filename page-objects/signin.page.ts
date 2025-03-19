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

  constructor(page: Page) {
    this.page = page;
  }

  get newUser() {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    }
  }

  get formInput() {
    return {
      firstName: '#firstname',
      lastName: '#lastname',
      email: '#email_address',
      password: '#password',
      passwordConfirmation: '#password-confirmation',
      passwordStrength: '#password-strength-meter'
    }
  }

  // FUNCTIONS ---------------------------------//

  async registerNewUser(params: RegisterNewUserParams) {
    const inputs = [
      { input: this.formInput.firstName, value: params.firstName },
      { input: this.formInput.lastName, value: params.lastName },
      { input: this.formInput.email, value: params.email },
      { input: this.formInput.password, value: params.password },
      { input: this.formInput.passwordConfirmation, value: params.password }
    ]

    for (const { input, value } of inputs) {
      await this.page.locator(input).fill(value);
    }

    const passwordStrength = await this.page.locator(this.formInput.passwordStrength).innerText()
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