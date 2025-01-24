import { test, expect } from '@playwright/test';
import SignInPage from '../page-objects/signin.page';
import LogInPage from '../page-objects/login.page';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
  });

  test('Login with valid credentials', async ({ page }) => {
    await LogInPage.logIn({
      page,
      email: 'brunobzs+test@gmail.com',
      password: 'Test1234'
    });

    await page.waitForTimeout(2000);
    await expect(page.locator(LogInPage.loginPanel).locator('.logged-in')).toContainText('Welcome, User Test!');
  });

  test('Shows an error message when trying to login with invalid credentials', async ({ page }) => {
    await LogInPage.logIn({
      page,
      email: 'wrongUser@email.com',
      password: 'wrongPassword1'
    });

    await page.waitForTimeout(1000);
    await expect(page.locator(LogInPage.errorMessage)).toContainText('The account sign-in was incorrect or your account is disabled temporarily. Please wait and try again later');
  });

  test('Successfully registers a new user', async ({ page }) => {
    const { firstName, lastName, email, password } = SignInPage.newUser;

    await page.locator('a', { hasText: 'Create an Account' }).first().click();
    await expect(page.locator(SignInPage.pageTitle)).toContainText('Create New Customer Account');

    await SignInPage.fillTheForm({
      page,
      firstName,
      lastName,
      email,
      password
    });

    await page.locator('button', { hasText: 'Create an Account' }).first().click();

    const res = await page.waitForResponse('/customer/section/load/?sections=messages%2Ccustomer%2Ccompare-products%2Clast-ordered-items%2Ccart%2Cdirectory-data%2Ccaptcha%2Cinstant-purchase%2Cpersistent%2Creview%2Cwishlist%2Crecently_viewed_product%2Crecently_compared_product%2Cproduct_data_storage%2Cpaypal-billing-agreement&force_new_section_timestamp=false&_=*');
    const body = await res.json();
    const fullNameFromAPI: string = body.customer.fullname;
    expect(fullNameFromAPI).toBe(`${firstName} ${lastName}`);

    const successMessage = page.locator(SignInPage.successMessage);
    await successMessage.waitFor({ state: 'visible' });
    await expect(successMessage).toContainText('Thank you for registering with Main Website Store.');
  });
});