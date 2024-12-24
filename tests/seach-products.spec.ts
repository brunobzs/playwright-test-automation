import { test, expect } from '@playwright/test';
import LoginPage from "../page-objects/login.page";
import SearchPage from '../page-objects/search-product.page';

const loginPage = LoginPage;
const searchPage = SearchPage;


test.describe('Search Products Test', () => {
  test.beforeEach(async ({ page }) => {
    await loginPage.accessWebpage({ page });
  });

  test('Search for valid keyword', async ({ page }) => {
    const keyword = 't-shirt';
    // Search by keyword
    await searchPage.searchByKeyword({ page, keyword });

    // Validate the search result
    await searchPage.checkSearchResults({ page, keyword });
  });

  test('Search without results', async ({ page }) => {
    await searchPage.searchByKeyword({ page, keyword: 'motorcycle' });

    // Validate the search result
    const noticeMessage = page.locator(searchPage.noticeMessage)
    await expect(noticeMessage).toBeVisible();
    await expect(noticeMessage).toContainText('Your search returned no results.');
  });
});