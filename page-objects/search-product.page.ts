import {expect, Page} from "@playwright/test";

// INTERFACES --------------------------//
interface SeachByKeywordParams {
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
   * @param {string} params.keyword - Keyword to search
   */
  async searchByKeyword(params: SeachByKeywordParams) {
    const { page, keyword } = params;

    await page.locator(this.searchInput).fill(keyword);
    await page.locator(this.searchInput).press('Enter');
    await page.waitForURL(`result/?q=${keyword}`);
    await expect(page.locator(this.resultPageTitle)).toContainText(keyword);
  }
}

export default new SearchPage();