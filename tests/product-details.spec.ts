import { test } from '@playwright/test';
import ProductPage from '../page-objects/product.page';

test.describe('Product Details Page test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
  });

  test('Should open product details page', async ({ page }) => {
    // Search for a product
    await ProductPage.searchBy({ page, keyword: 'shirt' });

    // Click on the first product and check the details
    await ProductPage.checkProductDetails(page);
  });

  test('Should add a product to the cart', async ({ page }) => {
    await ProductPage.addProductToCart(page);

    // Check if the product was added to the cart
    await ProductPage.checkChartCounter(page);
  });
})