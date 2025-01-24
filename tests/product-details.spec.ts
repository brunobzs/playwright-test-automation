import { test } from '@playwright/test';
import ProductPage from '../page-objects/product.page';

test.describe('Product Details Page test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
  });

  test('Should open product details page', async ({ page }) => {
    await ProductPage.searchBy({ page, keyword: 'shirt' }); // Search for a product
    await ProductPage.checkProductDetails(page); // Click on the first product and check the details

  });

  test('Should add a product to the cart', async ({ page }) => {
    await ProductPage.addProductToCart(page);
    await ProductPage.checkChartCounter(page); // Check if the product was added to the cart
  });
})