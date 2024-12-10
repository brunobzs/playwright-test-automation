import {expect, Page} from "@playwright/test";

interface SearchAddressParams {
  page: Page;
  addressOrZipCode: string;
  type: string;
}

class SearchZipCodePage {
  get pageTitle(): string {
    return '#titulo_tela > h2'
  }
  get address(): string {
    return '#endereco';
  }

  get zipCodeType(): string {
    return '#tipoCEP';
  }

  get pageTitleResult(): string {
    return '#mensagem-resultado'
  }

  // FUNCTIONS

  /**
   * Search for an address or zip code.
   *
   * @param { Object } params
   * @param { String } params.addressOrZipCode - Enter an Address or Zip Code.
   * @param { String } params.type - Enter the type of ZIP code: Locality/Street, Promotional ZIP Code, Community Post Office Box, Large User, Operational Unit or All.
   */
  async searchAddress(params: SearchAddressParams) {
    const { page, addressOrZipCode, type } = params

    // Expected value
    const address = {
      street: "Rua Miranda Leão" + type !== 'Grande Usuário' ? '' : ', 41Lojas Bemol',
      neighborhood: 'Centro',
      locality: 'Manaus/AM',
      zipCode: type !== 'Grande Usuário' ? '69005-040' : '69005-901'
    }

    await page.locator(this.address).fill(addressOrZipCode)
    await page.locator(this.zipCodeType).selectOption(type)
    await page.locator('button').filter({ hasText: "Buscar" }).click()

    // Compare the search value with the expected result.
    await page.waitForSelector(this.pageTitleResult, { state: 'visible' })
    const resultText: string = await page.locator(this.pageTitleResult).textContent()

    expect(resultText).toContain('Resultado da Busca por Endereço ou CEP')

    const {street, neighborhood, locality, zipCode} = address
    const searchResult = [
      { field: street, index: 0 },
      { field: neighborhood, index: 1 },
      { field: locality, index: 2 },
      { field: zipCode, index: 3 }
    ];

    for (const { field, index } of searchResult) {
      const result: string = await page.locator('tbody').locator('tr').locator('td').nth(index).textContent()
      expect(result).toContain(field)
    }
  }
}

export default SearchZipCodePage;
