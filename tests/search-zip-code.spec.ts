import {test, expect} from "@playwright/test";
import SearchZipCodePage from "../page-objects/search-zip-code.page";

const searchZipCode: SearchZipCodePage = new SearchZipCodePage();

test.describe("Challenge I", () => {
  test.beforeEach(async ({page}) => {
    await page.goto('http://www.buscacep.correios.com.br');
    await page.waitForSelector(searchZipCode.pageTitle, { state: 'visible' });
    await expect(page.locator(searchZipCode.pageTitle)).toHaveText('Busca CEP');
  });

  test('Perform the search with the value “69005-040”', async ({ page }) => {
    await searchZipCode.searchAddress({
      page,
      addressOrZipCode: '69005-040',
      type: 'Localidade/Logradouro',
    });
  });

  test('Perform the search with the value “Lojas Bemol”', async ({ page }) => {
    await searchZipCode.searchAddress({
      page,
      addressOrZipCode: 'Lojas Bemol',
      type: 'Grande Usuário',
    });
  });
});