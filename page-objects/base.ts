import { test as base } from '@playwright/test'
import LogInPage from "./login.page";
import ProductPage from "./product.page";
import SignInPage from "./signin.page";

type MyFixtures = {
  loginPage: LogInPage;
  productPage: ProductPage;
  signInPage: SignInPage;
}

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LogInPage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  signInPage: async ({ page }, use) => {
    await use(new SignInPage(page));
  }
})

export { expect } from '@playwright/test'