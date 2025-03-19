import { test } from '../page-objects/base';

test.describe('Search Products Test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
  });

  test('Search for valid keyword search should return one result', async ({ productPage }) => {
    await productPage.searchBy({ keyword: 't-shirt' }); // Search by keyword
    await productPage.checkSearchResults({ success: true }); // Validate the search result
  });

  test('Search for a invalid keyword search should not return results', async ({ productPage }) => {
    await productPage.searchBy({ keyword: 'motorcycle' });
    await productPage.checkSearchResults({ success: false });
  });
});