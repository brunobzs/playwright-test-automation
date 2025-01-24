import { expect, Page } from '@playwright/test';

class ProductPage {
  get productName() {
    return '.product-item-name > a';
  }

  get productPrice() {
    return '.price-wrapper';
  }

  get productRating() {
    return '.rating-result';
  }

  get productPageTitle() {
    return '[data-ui-id="page-title-wrapper"]'
  }

  get productInfo() {
    return '.product-info-main';
  }

  get size() {
    return '.size';
  }

  get color() {
    return '.color';
  }

  get attributeOptions() {
    return '.swatch-option';
  }

  get chartLoader() {
    return '.loader > img';
  }

  get cartCounter() {
    return '.counter-number';
  }

  get searchInput() {
    return '#search';
  }

  get resultPageTitle() {
    return '[data-ui-id="page-title-wrapper"]'
  }

  get relatedSearchTermsItems() {
    return 'dl > dd';
  }

  get productItems() {
    return '.product-items > li';
  }

  get noticeMessage() {
    return '.notice';
  }

  // FUNCTIONS --------------------------//

  async checkProductDetails(page: Page) {
    const productDetails = {
      name: '',
      price: '',
      rating: ''
    }
    const details = [this.productName, this.productPrice, this.productRating];
    const productItem = page.locator(this.productItems).first();

    // Get product details
    for (const detail of details) {
      const index = details.indexOf(detail);
      const text = await productItem.locator(detail).textContent();
      const textCleaned = text.trim();

      if (index === 0) {
        productDetails.name = textCleaned;
      } else if (index === 1) {
        productDetails.price = textCleaned;
      } else {
        productDetails.rating = textCleaned;
      }
    }

    // Click on the product
    await productItem.click();

    const productReference = productDetails.name.toLowerCase().replace(/ /g, '-');
    expect(page.url()).toContain(productReference);

    const detailsAndValues = [
      { detail: this.productPageTitle, value: productDetails.name },
      { detail: this.productPrice, value: productDetails.price },
      { detail: this.productRating, value: productDetails.rating },
    ];

    // Check product details
    for (const { detail, value } of detailsAndValues) {
      await expect(page.locator(this.productInfo).locator(detail)).toContainText(value);
    }
  }

  async addProductToCart(page: Page) {
    // Select a product
    await page.waitForTimeout(4000);
    await page.locator(this.productItems).first().click();
    await expect(page.locator(this.productPageTitle)).toBeVisible({timeout: 5000});

    // Select product attributes
    const productInfoAttributes = page.locator(this.productInfo).locator(this.attributeOptions);
    await productInfoAttributes.nth(3).click();
    await productInfoAttributes.nth(1).click();
    await page.locator('button', { hasText: 'Add to Cart' }).first().click(); // Add product to cart
  }

  /**
   * Check if the product was added to the cart
   */
  async checkChartCounter(page: Page) {
    await expect(page.locator(this.chartLoader)).not.toBeVisible({ timeout: 5000 });
    expect(page.locator(this.cartCounter)).not.toBe('0');
  }

  /**
   * Search by keyword
   */
  async searchBy({ page, keyword }:  { page: Page; keyword: string; }) {
    await page.locator(this.searchInput).fill(keyword);
    await page.locator(this.searchInput).press('Enter');
    expect(page.url()).toContain(`result/?q=${keyword}`);
    await expect(page.locator(this.resultPageTitle)).toContainText(keyword);
  }

  async checkSearchResults({ page, keyword }: { page: Page; keyword: string; }) {
    const relatedSearchTerms = await page.locator(this.relatedSearchTermsItems).all()
    for (const terms of relatedSearchTerms) {
      const text = await terms.textContent();
      expect(text.toLowerCase()).toContain(keyword);
    }

    // Check if the product items are listed
    const products = await page.locator(this.productItems).all();
    expect(products.length).toBeGreaterThan(0);
  }
}

export default new ProductPage();