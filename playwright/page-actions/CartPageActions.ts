/**
 * Cart Page Actions for Playwright
 * Application actions for the Cart page using CartPageObjects
 */
import { type Page, expect } from '@playwright/test';
import { cartPageObjects } from '../../page-objects/CartPageObjects';
import urls from '../../fixtures/urls.json';

export class CartPageActions {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Verify user is on the cart page
   */
  async verifyOnCartPage(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(urls.paths.cart));
    await expect(this.page.getByTestId(cartPageObjects.cartItemsContainerTestId).first()).toBeVisible();
  }

  /**
   * Get the number of items in the cart
   * @returns The count
   */
  async getCartItemCount(): Promise<number> {
    return await this.page.getByTestId(cartPageObjects.cartItemsContainerTestId).count();
  }

  /**
   * Verify cart contains the expected number of items
   * @param expectedCount - The expected number of items
   */
  async verifyCartItemCount(expectedCount: number): Promise<void> {
    await expect(this.page.getByTestId(cartPageObjects.cartItemsContainerTestId)).toHaveCount(expectedCount);
  }

  /**
   * Verify cart contains an item with the specified name
   * @param itemName - The name of the item to verify
   */
  async verifyCartContainsItem(itemName: string): Promise<void> {
    await expect(this.page.getByTestId(cartPageObjects.cartItemNameContainerTestId)).toContainText(itemName);
  }

  /**
   * Get the name of the first cart item
   * @returns The item name
   */
  async getFirstCartItemName(): Promise<string> {
    const text = await this.page
      .getByTestId(cartPageObjects.cartItemNameContainerTestId)
      .first()
      .textContent();
    return (text ?? '').trim();
  }

  /**
   * Get the price of the first cart item
   * @returns The item price
   */
  async getFirstCartItemPrice(): Promise<string> {
    const text = await this.page
      .getByTestId(cartPageObjects.cartItemPriceContainerTestId)
      .first()
      .textContent();
    return (text ?? '').trim();
  }

  /**
   * Verify the first cart item has the expected price
   * @param expectedPrice - The expected price text
   */
  async verifyFirstCartItemPrice(expectedPrice: string): Promise<void> {
    await expect(
      this.page.getByTestId(cartPageObjects.cartItemPriceContainerTestId).first()
    ).toContainText(expectedPrice);
  }

  /**
   * Remove item from cart by index
   * @param index - The index of the item to remove (0-based)
   */
  async removeItemByIndex(index: number): Promise<void> {
    await this.page
      .getByTestId(cartPageObjects.cartItemsContainerTestId)
      .nth(index)
      .locator(cartPageObjects.removeButtonCSS)
      .click();
  }

  /**
   * Click continue shopping button
   */
  async clickContinueShopping(): Promise<void> {
    await this.page.getByTestId(cartPageObjects.continueShoppingButtonTestId).click();
  }

  /**
   * Click checkout button
   */
  async clickCheckout(): Promise<void> {
    await this.page.getByTestId(cartPageObjects.checkoutButtonTestId).click();
  }

  /**
   * Verify cart is empty
   */
  async verifyCartIsEmpty(): Promise<void> {
    await expect(this.page.getByTestId(cartPageObjects.cartItemsContainerTestId)).toHaveCount(0);
  }
}
