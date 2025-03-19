import { Page, expect } from '@playwright/test';

class ProductPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get product() {
    return {
      name: '.product-item-name > a',
      price: '.price-wrapper',
      rating: '.rating-result',
      pageTitle: '[data-ui-id="page-title-wrapper"]',
      info: '.product-info-main',
      size: '.size',
      color: '.color',
      attributeOptions: '.swatch-option'
    }
  }

  get chart() {
    return {
      loader: '.loader > img',
      counter: '.counter-number'
    };
  }

  get searchInput() {
    return '#search';
  }

  get resultPageTitle() {
    return '[data-ui-id="page-title-wrapper"]'
  }

  get productItems() {
    return '.product-items > li';
  }

  get noticeMessage() {
    return '.notice';
  }

  // FUNCTIONS --------------------------//

  async checkProductDetails() {
    const productDetails = { name: '', price: '', rating: '' }
    const details = [this.product.name, this.product.price, this.product.rating];
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

    // Click on the product
    await productItem.click();

    const productReference = productDetails.name.toLowerCase().replace(/ /g, '-');
    expect(this.page.url()).toContain(productReference);

    const detailsAndValues = [
      { detail: this.product.pageTitle, value: productDetails.name },
      { detail: this.product.price, value: productDetails.price },
      { detail: this.product.rating, value: productDetails.rating },
    ];

    // Check product details
    for (const { detail, value } of detailsAndValues) {
      await expect(this.page.locator(this.product.info).locator(detail)).toContainText(value);
    }
  }

  async addProductToCart() {
    // Select a product
    await this.page.waitForTimeout(4000);
    await this.page.locator(this.productItems).first().click();
    await expect(this.page.locator(this.product.pageTitle)).toBeVisible({timeout: 5000});

    // Select product attributes
    const productInfoAttributes = this.page.locator(this.product.info).locator(this.product.attributeOptions);
    await productInfoAttributes.nth(3).click();
    await productInfoAttributes.nth(1).click();
    await this.page.locator('button', { hasText: 'Add to Cart' }).first().click(); // Add product to cart
  }

  async checkChartCounter() {
    await expect(this.page.locator(this.chart.loader)).not.toBeVisible({ timeout: 5000 });
    expect(this.page.locator(this.chart.counter)).not.toBe('0');
  }

  async searchBy({ keyword }:  { keyword: string; }) {
    await this.page.locator(this.searchInput).fill(keyword);
    await this.page.locator(this.searchInput).press('Enter');
    expect(this.page.url()).toContain(`result/?q=${keyword}`);
    await expect(this.page.locator(this.resultPageTitle)).toContainText(keyword);
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