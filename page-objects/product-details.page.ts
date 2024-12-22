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
}

export default new ProductDetailsPage();