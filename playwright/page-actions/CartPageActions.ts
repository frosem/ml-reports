/**
 * Cart Page Actions
 */
import { type Page } from '@playwright/test';
import { allureStep } from '@playwright-support/AllureTools';
import { BasePage } from '@playwright-core/BasePage';
import { cartPageObjects } from '@page-objects/CartPageObjects';
import urls from '@fixtures/urls.json';

export class CartPageActions extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Verify user is on the cart page
   */
  @allureStep()
  async verifyOnCartPage(): Promise<void> {
    await this.assert.url(new RegExp(urls.paths.cart));
  }

  /**
   * Verify cart contains the expected number of items
   * @param expectedCount - The expected number of items
   */
  @allureStep('Verify cart item count: {0}')
  async verifyCartItemCount(expectedCount: number): Promise<void> {
    await this.assert.count(this.page.getByTestId(cartPageObjects.cartItemsContainerTestId), expectedCount);
  }

  /**
   * Verify cart contains an item with the specified name
   * @param itemName - The name of the item to verify
   */
  @allureStep('Verify cart contains: {0}')
  async verifyCartContainsItem(itemName: string): Promise<void> {
    const itemLocator = this.page
      .getByTestId(cartPageObjects.cartItemNameContainerTestId)
      .filter({ hasText: itemName });
    await this.assert.visible(itemLocator, `Cart should contain item "${itemName}"`);
  }

  /**
   * Click continue shopping button
   */
  @allureStep()
  async clickOnContinueShoppingButton(): Promise<void> {
    await this.click(this.page.getByTestId(cartPageObjects.continueShoppingButtonTestId));
  }

  /**
   * Click checkout button
   */
  @allureStep()
  async clickOnCheckoutButton(): Promise<void> {
    await this.click(this.page.getByTestId(cartPageObjects.checkoutButtonTestId));
  }

  /**
   * Verify cart is empty
   */
  @allureStep()
  async verifyCartIsEmpty(): Promise<void> {
    await this.assert.count(this.page.getByTestId(cartPageObjects.cartItemsContainerTestId), 0);
  }

  /**
   * Remove item from cart by name
   * @param itemName - The name of the item to remove
   */
  @allureStep('Remove from cart: {0}')
  async removeItemByName(itemName: string): Promise<void> {
    const itemContainer = this.page
      .getByTestId(cartPageObjects.cartItemsContainerTestId)
      .filter({ hasText: itemName });
    await this.click(itemContainer.locator(cartPageObjects.removeButtonCSS));
  }

  /**
   * Verify cart does not contain item
   * @param itemName - The item name that should not be in cart
   */
  @allureStep('Verify cart does not contain: {0}')
  async verifyCartDoesNotContainItem(itemName: string): Promise<void> {
    await this.assert.hidden(
      this.page.getByTestId(cartPageObjects.cartItemNameContainerTestId).filter({ hasText: itemName })
    );
  }

}
