/**
 * Header Page Actions
 */
import { type Page } from '@playwright/test';
import { allureStep } from '@playwright-support/AllureTools';
import { BasePage } from '@playwright-core/BasePage';
import { headerPageObjects } from '@page-objects/HeaderPageObjects';
import urls from '@fixtures/urls.json';

export class HeaderPageActions extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Open the hamburger menu
   */
  @allureStep()
  async openMenu(): Promise<void> {
    await this.click(this.page.locator(headerPageObjects.burgerMenuButtonId));
    await this.wait.forVisible(this.page.locator(headerPageObjects.logoutSidebarLinkId));
  }

  /**
   * Close the hamburger menu
   */
  @allureStep()
  async closeMenu(): Promise<void> {
    await this.click(this.page.locator(headerPageObjects.burgerMenuCloseButtonId));
    await this.wait.forHidden(this.page.locator(headerPageObjects.logoutSidebarLinkId));
  }

  /**
   * Click logout from the menu
   */
  @allureStep()
  async logout(): Promise<void> {
    await this.openMenu();
    await this.click(this.page.locator(headerPageObjects.logoutSidebarLinkId));
  }

  /**
   * Reset application state from the menu
   */
  @allureStep()
  async resetAppState(): Promise<void> {
    await this.openMenu();
    await this.click(this.page.locator(headerPageObjects.resetAppStateLinkId));
    await this.closeMenu();
  }

  /**
   * Verify user is logged out and on login page
   */
  @allureStep()
  async verifyLoggedOut(): Promise<void> {
    await this.assert.url(`${urls.baseUrl}${urls.paths.login}`);
  }

  /**
   * Verify the burger menu button is visible
   */
  @allureStep()
  async verifyBurgerMenuButtonVisible(): Promise<void> {
    await this.assert.visible(this.page.locator(headerPageObjects.burgerMenuButtonId));
  }

  /**
   * Verify the burger menu is open
   */
  @allureStep()
  async verifyBurgerMenuIsOpen(): Promise<void> {
    await this.assert.visible(this.page.locator(headerPageObjects.logoutSidebarLinkId));
  }

  /**
   * Verify the burger menu is closed
   */
  @allureStep()
  async verifyBurgerMenuIsClosed(): Promise<void> {
    await this.assert.hidden(this.page.locator(headerPageObjects.logoutSidebarLinkId));
  }

  /**
   * Navigate to cart
   */
  @allureStep()
  async clickOnCartIcon(): Promise<void> {
    await this.click(this.page.getByTestId(headerPageObjects.shoppingCartLinkTestId));
  }
}
