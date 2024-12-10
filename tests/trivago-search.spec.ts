import {test, expect, Locator} from '@playwright/test';
import TrivagoSearchPage from "../page-objects/trivago-search.page";

const trivagoSearch: TrivagoSearchPage = new TrivagoSearchPage()

test.describe('Challenge II', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.trivago.com.br');
  });

  test('You must search for "Manaus" and click on the first result', async ({ page }) => {
    const hotelInfo = { name: '', price: '', review: '' };

    // Type and select the value “Manaus” in the search field
    const searchField: Locator = page.locator(trivagoSearch.searchField).first();
    await searchField.fill('Manaus');
    await searchField.press('Enter');

    await page.waitForTimeout(500)

    const suggestionList: Locator = page.locator(trivagoSearch.suggestionList);
    await expect(suggestionList).toBeVisible();
    await page.waitForTimeout(1000)
    await suggestionList.filter({ hasText: 'Manaus' }).first().click();
    await trivagoSearch.selectDate({ page, isCheckoutDate: false });
    await page.locator('body').click(); // Click outside the search field to close the list of suggestions

    // Click the search button and wait for the API response
    const searchButton: Locator = page.locator(trivagoSearch.searchButton);
    await searchButton.focus();
    await searchButton.click();
    const accommodationSearch = await page.waitForResponse('https://www.trivago.com.br/graphql?accommodationSearchQuery');
    const response: any = accommodationSearch.json();
    expect(response.statusCode).toBe(200);

    // Wait for the price log
    await page.waitForResponse('https://www.trivago.com.br/graphql?LogPriceImpression');

    // Sort results by rating and suggestions
    const sortByButton: Locator = page.locator(trivagoSearch.sortBy);
    await expect(sortByButton).toBeVisible();
    await sortByButton.locator('select').selectOption({ label: 'Avaliação e sugestões' });

    // Get the information of the first hotel
    const hotelInfoSelector: Locator = page.locator(trivagoSearch.hotelInfo).first();
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
