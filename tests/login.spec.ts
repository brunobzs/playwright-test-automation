import { test, expect } from '@playwright/test';
import CreateAccountPage from "../page-objects/create-account.page";
import LoginPage from "../page-objects/login.page";

const createAccountPage = CreateAccountPage;
const loginPage = LoginPage;

test.describe('Authentication Test', () => {
  test.beforeEach(async ({ page }) => {
    await loginPage.accessWebpage({ page });
  });

  test('Login with valid credentials', async ({ page }) => {
    const { firstName, lastName, email, password } = loginPage.user;
    const fullName: string = `${firstName} ${lastName}`;

    await loginPage.login({
      page,
      email,
      password
    });

    await page.waitForTimeout(2000);
    await expect(page.locator(loginPage.loginPanel).locator('.logged-in')).toContainText(`Welcome, ${fullName}!`);
  });

  test('Login with invalid credentials', async ({ page }) => {
    // Fill in the login form and submit it
    await loginPage.login({
      page,
      email: 'wrongUser@email.com',
      password: 'wrongPassword1'
    })

    // Check if the error message is displayed
    await page.waitForTimeout(1000)
    await expect(page.locator(loginPage.errorMessage)).toContainText('The account sign-in was incorrect or your account is disabled temporarily. Please wait and try again later');
  });

  test('Registering a new user', async ({ page }) => {
    const { firstName, lastName, email, password } = createAccountPage.newUser; // Generate random user data

    await createAccountPage.clickOnCreateAccountButton(page); // Click on the "Create an Account" button
    await createAccountPage.checkPageTitle({ page, title: 'Create New Customer Account' });

    // Fill in the registration form
    await createAccountPage.fillTheForm({
      page,
      firstName,
      lastName,
      email,
      password
    })

    await page.locator('button', { hasText: 'Create an Account' }).first().click(); // Click on the "Create an Account" button

    // Check the API request
    const res: any = await page.waitForResponse('/customer/section/load/?sections=messages%2Ccustomer%2Ccompare-products%2Clast-ordered-items%2Ccart%2Cdirectory-data%2Ccaptcha%2Cinstant-purchase%2Cpersistent%2Creview%2Cwishlist%2Crecently_viewed_product%2Crecently_compared_product%2Cproduct_data_storage%2Cpaypal-billing-agreement&force_new_section_timestamp=false&_=*');
    const fullName: string = `${firstName} ${lastName}`;
    const body: any = await res.json();
    const fullNameFromAPI: string = body.customer.fullname;
    expect(fullNameFromAPI).toBe(fullName);

    const successMessage = page.locator(createAccountPage.successMessage);
    await successMessage.waitFor({ state: 'visible' });
    await expect(successMessage).toContainText('Thank you for registering with Main Website Store.');
  })
});