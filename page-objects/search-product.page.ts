import { expect, Page } from "@playwright/test";

// INTERFACES --------------------------//
interface SearchByKeywordParams {
  page: Page;
  keyword: string;
}

interface CheckSearchResultsParams {
  page: Page;
  keyword: string;
}
//-------------------------------------//

class SearchPage {
  get searchInput(): string {
    return '#search';
  }

  get resultPageTitle(): string {
    return '[data-ui-id="page-title-wrapper"]'
  }

  get relatedSearchTermsItems(): string {
    return 'dl > dd';
  }

  get productItems(): string {
    return '.product-items > li';
  }

  get noticeMessage(): string {
    return '.notice';
  }

  // FUNCTIONS --------------------------//

  /**
   * Search by keyword
   *
   * @param {object} params
   * @param {Page} params.page - Playwright page object
   * @param {string} params.keyword - Keyword to search
   */
  async searchByKeyword(params: SearchByKeywordParams) {
    const { page, keyword } = params;

    await page.locator(this.searchInput).fill(keyword);
    await page.locator(this.searchInput).press('Enter');
    expect(page.url()).toContain(`result/?q=${keyword}`);
    await expect(page.locator(this.resultPageTitle)).toContainText(keyword);
  }

  /**
   * Check search results
   *
   * @param {object} params
   * @param {Page} params.page - Playwright page object
   * @param {string} params.keyword - Keyword to check in the search results
   */
  async checkSearchResults(params: CheckSearchResultsParams) {
    const { page, keyword } = params;
    const relatedSearchTerms = await page.locator(this.relatedSearchTermsItems).all()
    for (const terms of relatedSearchTerms) {
      const text: string = await terms.textContent();
      expect(text.toLowerCase()).toContain(keyword);
    }

    // Check if the product items are listed
    const products = await page.locator(this.productItems).all();
    expect(products.length).toBeGreaterThan(0);
  }
}

export default new SearchPage();
