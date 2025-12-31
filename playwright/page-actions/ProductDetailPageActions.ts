/**
 * Product Detail Page Actions
 */
import { type Page } from '@playwright/test';
import { allureStep } from '@playwright-support/AllureTools';
import { BasePage } from '@playwright-core/BasePage';
import { productDetailPageObjects } from '@page-objects/ProductDetailPageObjects';
import urls from '@fixtures/urls.json';

export class ProductDetailPageActions extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Verify user is on the product detail page
   */
  @allureStep()
  async verifyOnProductDetailPage(): Promise<void> {
    await this.assert.url(new RegExp(urls.paths.inventoryItem));
    await this.assert.visible(this.page.getByTestId(productDetailPageObjects.inventoryItemNameTestId));
  }

  /**
   * Add product to cart from detail page
   */
  @allureStep()
  async clickOnAddToCartButton(): Promise<void> {
    await this.click(this.page.getByTestId(productDetailPageObjects.addToCartButtonTestId));
  }

  /**
   * Remove product from cart from detail page
   */
  @allureStep()
  async clickOnRemoveFromCartButton(): Promise<void> {
    await this.click(this.page.getByTestId(productDetailPageObjects.removeButtonTestId));
  }

  /**
   * Click back to products button
   */
  @allureStep()
  async clickOnBackToProductsButton(): Promise<void> {
    await this.click(this.page.getByTestId(productDetailPageObjects.backToProductsButtonTestId));
  }

  /**
   * Verify add to cart button is visible
   */
  @allureStep()
  async verifyAddToCartButtonVisible(): Promise<void> {
    await this.assert.visible(this.page.getByTestId(productDetailPageObjects.addToCartButtonTestId));
  }

  /**
   * Verify remove button is visible (item is in cart)
   */
  @allureStep()
  async verifyRemoveButtonVisible(): Promise<void> {
    await this.assert.visible(this.page.getByTestId(productDetailPageObjects.removeButtonTestId));
  }

}
