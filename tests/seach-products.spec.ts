import { test, expect } from '@playwright/test';
import ProductPage from "../page-objects/product.page";

test.describe('Search Products Test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
  });

  test('Search for valid keyword search should return one result', async ({ page }) => {
    const keyword = 't-shirt';
    await ProductPage.searchBy({ page, keyword }); // Search by keyword
    await ProductPage.checkSearchResults({ page, keyword }); // Validate the search result
  });

  test('Search for a invalid keyword search should not return results', async ({ page }) => {
    await ProductPage.searchBy({ page, keyword: 'motorcycle' });

    // Validate the search result
    const noticeMessage = page.locator(ProductPage.noticeMessage)
    await expect(noticeMessage).toBeVisible();
    await expect(noticeMessage).toContainText('Your search returned no results.');
  });
});