import { Page, expect } from '@playwright/test';

class ProductPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

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

  get productItems() {
    return '.product-items > li';
  }

  get noticeMessage() {
    return '.notice';
  }

  // FUNCTIONS --------------------------//

  async checkProductDetails() {
    const productDetails = {
      name: '',
      price: '',
      rating: ''
    }
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

    // Click on the product
    await productItem.click();

    const productReference = productDetails.name.toLowerCase().replace(/ /g, '-');
    expect(this.page.url()).toContain(productReference);

    const detailsAndValues = [
      { detail: this.productPageTitle, value: productDetails.name },
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
    await expect(this.page.locator(this.productPageTitle)).toBeVisible({timeout: 5000});

    // Select product attributes
    const productInfoAttributes = this.page.locator(this.productInfo).locator(this.attributeOptions);
    await productInfoAttributes.nth(3).click();
    await productInfoAttributes.nth(1).click();
    await this.page.locator('button', { hasText: 'Add to Cart' }).first().click(); // Add product to cart
  }

  async checkChartCounter() {
    await expect(this.page.locator(this.chartLoader)).not.toBeVisible({ timeout: 5000 });
    expect(this.page.locator(this.cartCounter)).not.toBe('0');
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