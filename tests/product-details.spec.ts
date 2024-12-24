import { test, expect  } from '@playwright/test';
import LoginPage from '../page-objects/login.page';
import SearchPage from '../page-objects/search-product.page';
import ProductDetailsPage from "../page-objects/product-details.page";

const loginPage = LoginPage
const productDetailsPage = ProductDetailsPage
const searchPage = SearchPage

test.describe('Product Details Page test', () => {
  test.beforeEach(async ({ page }) => {
    await loginPage.accessWebpage({ page });
  });

  test('View product details', async ({ page }) => {
    // Search for a product
    await searchPage.searchByKeyword({ page, keyword: 'shirt' });

    // Click on the first product and check the details
    await productDetailsPage.checkProductDetails(page);
  });

  test('Add a product to the cart', async ({ page }) => {
    await productDetailsPage.addProductToCart(page);

    // Check if the product was added to the cart
    await productDetailsPage.checkChartCounter(page);
  });
})