import { Page, expect } from '@playwright/test';

class ProductPage {
  readonly page: Page;
  readonly pageTitle: string;
  readonly productName: string;
  readonly productPrice: string;
  readonly productRating: string;
  readonly productInfo: string;
  readonly productSize: string;
  readonly productColor: string;
  readonly productAttributeOptions: string;
  readonly productItems: string;
  readonly chartLoader: string;
  readonly chartCounter: string;
  readonly searchInput: string;
  readonly noticeMessage: string;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = '[data-ui-id="page-title-wrapper"]';
    this.productName = '.product-item-name > a';
    this.productPrice = '.price-wrapper';
    this.productRating = '.rating-result';
    this.productInfo = '.product-info-main';
    this.productSize = '.size';
    this.productColor = '.color';
    this.productAttributeOptions = '.swatch-option';
    this.productItems = '.product-items > li';
    this.chartLoader = '.loader > img';
    this.chartCounter = '.counter-number';
    this.searchInput = '#search';
    this.noticeMessage = '.notice';
  }

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