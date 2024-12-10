import {expect, Page} from "@playwright/test";

interface SearchAddressParams {
  page: Page;
  isCheckoutDate: boolean;
}

class TrivagoSearchPage {
  get searchField(): string {
    return '[data-testid="search-form-destination"]'
  }

  get suggestionList(): string {
    return '[data-testid="search-suggestions"]'
  }

  get searchResult(): string {
    return '[data-testid="ssg-element"]'
  }

  get searchButton(): string {
    return '[data-testid="search-button-with-loader"]'
  }

  get checkInDate(): string {
    return '[data-testid="search-form-calendar-checkin"]'
  }

  get checkOutDate(): string {
    return '[data-testid="search-form-calendar-checkout"]'
  }

  get sortBy(): string {
    return '[data-testid="sorting-selector"]'
  }

  get hotelInfo(): string {
    return '[data-testid="accommodation-list-element"]'
  }

  get hotelName(): string {
    return '[data-testid="item-name"]'
  }

  get hotelReview(): string {
    return '[data-testid="aggregate-rating"] > .space-x-1 > .mt-px > .leading-none > span'
  }

  get recommendedPrice(): string {
    return '[data-testid="recommended-price"]'
  }

  // FUNCTIONS

  /**
   * Select check-in or check-out date.
   *
   * @param { Object } params
   * @param { Boolean } params.isCheckoutDate - If false, selects today's date as the check-in date and if true, selects a date 3 days ahead of today for the check-out date.
   */
  async selectDate (params: SearchAddressParams) {
    const {page, isCheckoutDate} = params;
    let date: Date = new Date();
    if (isCheckoutDate) {
      date.setDate(date.getDate() + 3); // Add 3 days to the current date
    }
    let year: number = date.getFullYear();
    let month: any = date.getMonth() + 1;
    let day: any = date.getDate();
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    const selectedDate = year + "-" + month + "-" + day;
    const selector = isCheckoutDate ? this.checkOutDate : this.checkInDate;
    await page.locator(selector).scrollIntoViewIfNeeded()
    await page.locator(`${selector} > [data-testid="valid-calendar-day-${selectedDate}"]`).click();
    await page.waitForTimeout(500);
  }
}

export default TrivagoSearchPage;
