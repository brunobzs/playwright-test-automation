import { test } from '../page-objects/base';

test.describe('Product Details Page test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
  });

  test('Should open product details page', async ({ productPage }) => {
    await productPage.searchBy({ keyword: 'shirt' }); // Search for a product
    await productPage.checkProductDetails(); // Click on the first product and check the details
  });

  test('Should add a product to the cart', async ({ productPage }) => {
    await productPage.addProductToCart();
    await productPage.checkChartCounter(); // Check if the product was added to the cart
  });
})