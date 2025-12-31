/**
 * Checkout Page Actions
 */
import { type Page } from '@playwright/test';
import { allureStep } from '@playwright-support/AllureTools';
import { BasePage } from '@playwright-core/BasePage';
import { checkoutPageObjects } from '@page-objects/CheckoutPageObjects';
import messages from '@fixtures/messages.json';
import urls from '@fixtures/urls.json';
import users from '@fixtures/users.json';

export class CheckoutPageActions extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Checkout Step One (Customer Info)
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Verify user is on checkout step one page
   */
  @allureStep()
  async verifyOnCheckoutStepOne(): Promise<void> {
    await this.assert.url(new RegExp(urls.paths.checkoutStepOne));
    await this.assert.visible(this.page.getByTestId(checkoutPageObjects.firstNameInputTestId));
  }

  /**
   * Enter first name
   * @param firstName - The first name to enter
   */
  @allureStep('Enter first name: {0}')
  async enterFirstName(firstName: string): Promise<void> {
    await this.fill(this.page.getByTestId(checkoutPageObjects.firstNameInputTestId), firstName);
  }

  /**
   * Enter last name
   * @param lastName - The last name to enter
   */
  @allureStep('Enter last name: {0}')
  async enterLastName(lastName: string): Promise<void> {
    await this.fill(this.page.getByTestId(checkoutPageObjects.lastNameInputTestId), lastName);
  }

  /**
   * Enter postal code
   * @param postalCode - The postal code to enter
   */
  @allureStep('Enter postal code: {0}')
  async enterPostalCode(postalCode: string): Promise<void> {
    await this.fill(this.page.getByTestId(checkoutPageObjects.postalCodeInputTestId), postalCode);
  }

  /**
   * Fill all checkout information
   * @param firstName - First name
   * @param lastName - Last name
   * @param postalCode - Postal code
   */
  @allureStep("Fill checkout information - First name: '{0}', Last name: '{1}', Postal code: '{2}'")
  async fillCheckoutInformation(firstName?: string, lastName?: string, postalCode?: string): Promise<void> {
    await this.enterFirstName(firstName ?? users.checkout.firstName);
    await this.enterLastName(lastName ?? users.checkout.lastName);
    await this.enterPostalCode(postalCode ?? users.checkout.postalCode);
  }

  /**
   * Click continue button
   */
  @allureStep()
  async clickOnContinueButton(): Promise<void> {
    await this.click(this.page.getByTestId(checkoutPageObjects.continueButtonTestId));
  }

  /**
   * Click cancel button
   */
  @allureStep()
  async clickOnCancelButton(): Promise<void> {
    await this.click(this.page.getByTestId(checkoutPageObjects.cancelButtonTestId));
  }

  /**
   * Verify error message is displayed
   * @param expectedMessage - The expected error message
   */
  @allureStep('{0}')
  async verifyErrorMessage(expectedMessage: string): Promise<void> {
    const errorContainer = this.page.getByTestId(checkoutPageObjects.errorMessageContainerTestId);
    await this.assert.visible(errorContainer);
    await this.assert.containsText(errorContainer, expectedMessage);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Checkout Step Two (Summary)
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Verify user is on checkout step two page
   */
  @allureStep()
  async verifyOnCheckoutStepTwo(): Promise<void> {
    await this.assert.url(new RegExp(urls.paths.checkoutStepTwo));
    await this.assert.visible(this.page.locator(checkoutPageObjects.summaryInfoContainerCSS));
  }

  /**
   * Verify total is displayed in order summary
   */
  @allureStep()
  async verifyOrderTotalDisplayed(): Promise<void> {
    await this.assert.visible(this.page.locator(checkoutPageObjects.totalLabelCSS));
  }

  /**
   * Click finish button
   */
  @allureStep()
  async clickOnFinishOrderButton(): Promise<void> {
    await this.click(this.page.getByTestId(checkoutPageObjects.finishButtonTestId));
  }

  /**
   * Verify order summary contains expected item
   * @param itemName - The expected item name
   */
  @allureStep('Verify summary information contains: {0}')
  async verifySummaryContainsItem(itemName: string): Promise<void> {
    const itemLocator = this.page.locator(checkoutPageObjects.cartListContainerCSS)
      .locator(checkoutPageObjects.inventoryItemNameCSS)
      .filter({ hasText: itemName });
    await this.assert.visible(itemLocator, { errorMessage: `Item "${itemName}" should be in order summary` });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Checkout Complete
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Verify user is on checkout complete page
   */
  @allureStep()
  async verifyOnCheckoutComplete(): Promise<void> {
    await this.assert.url(new RegExp(urls.paths.checkoutComplete));
    await this.assert.visible(this.page.locator(checkoutPageObjects.completeHeaderCSS));
  }

  /**
   * Verify order confirmation message
   */
  @allureStep()
  async verifyOrderConfirmationMessage(): Promise<void> {
    await this.assert.containsText(
      this.page.locator(checkoutPageObjects.completeHeaderCSS),
      messages.checkout.orderConfirmation
    );
  }

  /**
   * Verify the pony express image is displayed
   */
  @allureStep()
  async verifyPonyExpressImage(): Promise<void> {
    await this.assert.visible(this.page.locator(checkoutPageObjects.ponyExpressImageCSS));
  }

  /**
   * Verify payment information is displayed
   */
  @allureStep('Verify payment information is displayed')
  async verifyPaymentInformationDisplayed(): Promise<void> {
    await this.assert.visible(this.page.getByTestId(checkoutPageObjects.paymentInfoContainerTestId));
  }

  /**
   * Verify shipping information is displayed
   */
  @allureStep('Verify shipping information is displayed')
  async verifyShippingInformationDisplayed(): Promise<void> {
    await this.assert.visible(this.page.getByTestId(checkoutPageObjects.shippingInfoContainerTestId));
  }

  /**
   * Verify order complete text is displayed
   */
  @allureStep('Verify order completed message is displayed')
  async verifyCompleteTextDisplayed(): Promise<void> {
    await this.assert.visible(this.page.locator(checkoutPageObjects.completeTextCSS));
  }

  /**
   * Verify cart item is displayed in summary
   */
  @allureStep()
  async verifyCartItemInSummary(): Promise<void> {
    await this.assert.visible(this.page.locator(checkoutPageObjects.cartItemContainerCSS));
  }

  /**
   * Click back home button
   */
  @allureStep()
  async clickBackHome(): Promise<void> {
    await this.click(this.page.getByTestId(checkoutPageObjects.backHomeButtonTestId));
  }

  /**
   * Complete full checkout flow with default info
   */
  @allureStep()
  async completeCheckout(): Promise<void> {
    await this.fillCheckoutInformation();
    await this.clickOnContinueButton();
    await this.verifyOnCheckoutStepTwo();
    await this.clickOnFinishOrderButton();
    await this.verifyOnCheckoutComplete();
  }
}

