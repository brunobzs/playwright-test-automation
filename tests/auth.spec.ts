import { test, expect } from '../page-objects/base';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
  });

  test('Login with valid credentials', async ({ loginPage }) => {
    await loginPage.clickOnSignIn({ isButton: false });

    await loginPage.fillEmailInput('brunobzs+test@gmail.com')
    await loginPage.fillPasswordInput('Test1234')
    await loginPage.clickOnSignIn({ isButton: true });

    await loginPage.successLogInMessage()
  });

  test('Shows an error message when trying to login with invalid credentials', async ({ loginPage }) => {
    await loginPage.clickOnSignIn({ isButton: false });

    await loginPage.fillEmailInput('wrongUser@email.com')
    await loginPage.fillPasswordInput('wrongPassword1')
    await loginPage.clickOnSignIn({ isButton: true });

    await loginPage.errorLogInMessage()
  });

  test('Successfully registers a new user', async ({ page, signInPage }) => {
    const { firstName, lastName, email, password } = signInPage.newUser;

    await signInPage.clickOnCreateAccount({ isButton: false });

    await signInPage.registerNewUser({
      firstName,
      lastName,
      email,
      password
    });

    await signInPage.clickOnCreateAccount({ isButton: true });

    const res = await page.waitForResponse('/customer/section/load/?sections=messages%2Ccustomer%2Ccompare-products%2Clast-ordered-items%2Ccart%2Cdirectory-data%2Ccaptcha%2Cinstant-purchase%2Cpersistent%2Creview%2Cwishlist%2Crecently_viewed_product%2Crecently_compared_product%2Cproduct_data_storage%2Cpaypal-billing-agreement&force_new_section_timestamp=false&_=*');
    const body = await res.json();
    const { fullname } = body.customer;
    expect(fullname).toBe(`${firstName} ${lastName}`);

    await signInPage.successRegisterMessage()
  });
});