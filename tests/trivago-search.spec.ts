import { test, expect } from '@playwright/test';
import TrivagoSearchPage from "../page-objects/trivago-search.page";

const trivagoSearch: TrivagoSearchPage = new TrivagoSearchPage()

test.describe('Challenge II', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.trivago.com.br');
  });

  test('You must search for "Manaus" and click on the first result', async ({ page }) => {
    const hotelInfo = { name: '', price: '', review: '' };

    // Type and select the value “Manaus” in the search field
    await page.locator(trivagoSearch.searchField).first().fill('Manaus');
    await page.locator(trivagoSearch.searchField).first().press('Enter');
    await page.waitForTimeout(500)
    await expect(page.locator(trivagoSearch.suggestionList)).toBeVisible();
    const suggestionList = page.locator(trivagoSearch.suggestionList);
    await page.waitForTimeout(1000)
    await suggestionList.filter({ hasText: 'Manaus' }).first().click();
    await trivagoSearch.selectDate({ page, isCheckoutDate: false });
    await page.locator('body').click(); // Click outside the search field to close the list of suggestions

    // Click the search button and wait for the API response
    await page.locator(trivagoSearch.searchButton).focus();
    await page.locator(trivagoSearch.searchButton).click();
    const accommodationSearch = await page.waitForResponse('https://www.trivago.com.br/graphql?accommodationSearchQuery');
    const response: any = accommodationSearch.json();
    expect(response.statusCode).toBe(200);

    // Wait for the price log
    await page.waitForResponse('https://www.trivago.com.br/graphql?LogPriceImpression');

    // Sort results by rating and suggestions
    await expect(page.locator(trivagoSearch.sortBy)).toBeVisible();
    await page.locator(trivagoSearch.sortBy).locator('select').selectOption({ label: 'Avaliação e sugestões' });

    // Get the information of the first hotel
    const hotelInfoSelector = page.locator(trivagoSearch.hotelInfo).first();
    hotelInfo.name = await hotelInfoSelector.locator(trivagoSearch.hotelName).innerText();
    hotelInfo.review = await hotelInfoSelector.locator(trivagoSearch.hotelReview).innerText();
    const price: string = await hotelInfoSelector.locator(trivagoSearch.recommendedPrice).innerText();
    hotelInfo.price = price.replace(/[^\d.-]/g, '');

    // Compare hotel information
    console.log(hotelInfo);
    expect(hotelInfo.name).toContain('ibis budget');
    expect(parseFloat(hotelInfo.review)).toBeGreaterThan(8);
    expect(parseFloat(hotelInfo.price)).toBeLessThan(250);
  });
});
