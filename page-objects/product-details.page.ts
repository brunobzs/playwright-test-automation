import { expect, Page, Locator } from '@playwright/test';
import SearchPage from './search-product.page';

const searchPage = SearchPage;

class ProductDetailsPage {
  get productName(): string {
    return '.product-item-name > a';
  }

  get productPrice(): string {
    return '.price-wrapper';
  }

  get productRating(): string {
    return '.rating-result';
  }

  get productPageTitle(): string {
    return '[data-ui-id="page-title-wrapper"]'
  }

  get productInfo(): string {
    return '.product-info-main';
  }

  get size(): string {
    return '.size';
  }

  get color(): string {
    return '.color';
  }

  get attributeOptions(): string {
    return '.swatch-option';
  }

  get chartLoader(): string {
    return '.loader > img';
  }

  get cartCounter(): string {
    return '.counter-number';
  }

  // FUNCTIONS --------------------------//

  /**
   * Check product details
   *
   * @param {Page} page - Playwright page object
   */
  async checkProductDetails(page: Page) {
    const productDetails: { name: string, price: string, rating: string } = {
      name: '',
      price: '',
      rating: ''
    }
    const details: string[] = [this.productName, this.productPrice, this.productRating];
    const productItem: Locator = page.locator(searchPage.productItems).first();

    // Get product details
    for (const detail of details) {
      const index: number = details.indexOf(detail);
      const text: string = await productItem.locator(detail).textContent();
      const textCleaned: string = text.trim();

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

    const productReference: string = productDetails.name.toLowerCase().replace(/ /g, '-');
    expect(page.url()).toContain(productReference);

    const detailsAndValues: { detail: string, value: string}[] = [
      { detail: this.productPageTitle, value: productDetails.name },
      { detail: this.productPrice, value: productDetails.price },
      { detail: this.productRating, value: productDetails.rating },
    ];

    // Check product details
    for (const { detail, value } of detailsAndValues) {
      await expect(page.locator(this.productInfo).locator(detail)).toContainText(value);
    }
  }

  /**
   * Add a product to the cart
   *
   * @param {Page} page - Playwright page object
   */
  async addProductToCart(page: Page) {
    // Select a product
    await page.waitForTimeout(4000);
    await page.locator(searchPage.productItems).first().click();
    await expect(page.locator(this.productPageTitle)).toBeVisible({timeout: 5000});

    // Select product attributes
    const productInfoAttributes = page.locator(this.productInfo).locator(this.attributeOptions);
    await productInfoAttributes.nth(3).click();
    await productInfoAttributes.nth(1).click();
    await page.locator('button', {hasText: 'Add to Cart'}).first().click(); // Add product to cart
  }

  /**
   * Check if the product was added to the cart
   *
   * @param {Page} page - Playwright page object
   */
  async checkChartCounter(page: Page) {
    await expect(page.locator(this.chartLoader)).not.toBeVisible({ timeout: 5000 });
    expect(page.locator(this.cartCounter)).not.toBe('0');
  }
}

export default new ProductDetailsPage();