import { Page, expect } from '@playwright/test';

class ProductPage {
  readonly pageTitle: string = '[data-ui-id="page-title-wrapper"]';
  readonly productName: string = '.product-item-name > a';
  readonly productPrice: string = '.price-wrapper';
  readonly productRating: string = '.rating-result';
  readonly productInfo: string = '.product-info-main';
  readonly productSize: string = '.size';
  readonly productColor: string = '.color';
  readonly productAttributeOptions: string = '.swatch-option';
  readonly productItems: string = '.product-items > li';
  readonly chartLoader: string = '.loader > img';
  readonly chartCounter: string = '.counter-number';
  readonly searchInput: string = '#search';
  readonly noticeMessage: string = '.notice';

  constructor(readonly page: Page) {}

  async checkProductDetails() {
    const productDetails = { name: '', price: '', rating: '' }
    const details = [this.productName, this.productPrice, this.productRating];
    const productItem = this.page.locator(this.productItems).first();

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

    await productItem.click(); // Click on the product

    const productReference = productDetails.name.toLowerCase().replace(/ /g, '-');
    expect(this.page.url()).toContain(productReference);

    const detailsAndValues = [
      { detail: this.pageTitle, value: productDetails.name },
      { detail: this.productPrice, value: productDetails.price },
      { detail: this.productRating, value: productDetails.rating },
    ];

    // Check product details
    for (const { detail, value } of detailsAndValues) {
      await expect(this.page.locator(this.productInfo).locator(detail)).toContainText(value);
    }
  }

  async addProductToCart() {
    // Select a product
    await this.page.waitForTimeout(4000);
    await this.page.locator(this.productItems).first().click();
    await expect(this.page.locator(this.pageTitle)).toBeVisible({timeout: 5000});

    // Select product attributes
    const productInfoAttributes = this.page.locator(this.productInfo).locator(this.productAttributeOptions);
    await productInfoAttributes.nth(3).click();
    await productInfoAttributes.nth(1).click();
    await this.page.locator('button', { hasText: 'Add to Cart' }).first().click(); // Add product to cart
  }

  async checkChartCounter() {
    await expect(this.page.locator(this.chartLoader)).not.toBeVisible({ timeout: 5000 });
    expect(this.page.locator(this.chartCounter)).not.toBe('0');
  }

  async searchBy({ keyword }:  { keyword: string; }) {
    await this.page.locator(this.searchInput).fill(keyword);
    await this.page.locator(this.searchInput).press('Enter');
    expect(this.page.url()).toContain(`result/?q=${keyword}`);
    await expect(this.page.locator(this.pageTitle)).toContainText(keyword);
  }

  async checkSearchResults({ success }: { success: boolean }) {
    const products = await this.page.locator(this.productItems).all();
    const noticeMessage = this.page.locator(this.noticeMessage)

    if (success) {
      expect(products.length).toBeGreaterThan(0);
    } else {
      await expect(noticeMessage).toBeVisible();
      await expect(noticeMessage).toContainText('Your search returned no results.');
    }
  }
}

export default ProductPage;