import { test } from '@playwright/test';
import { description, epic, feature, parentSuite, Severity, severity, story, subSuite, suite } from 'allure-js-commons';
import { storyLink, testLink } from '@playwright-support/AllureTools';
import { CartPageActions } from '@playwright-page-actions/CartPageActions';
import { CheckoutPageActions } from '@playwright-page-actions/CheckoutPageActions';
import { InventoryPageActions } from '@playwright-page-actions/InventoryPageActions';
import { LoginPageActions } from '@playwright-page-actions/LoginPageActions';
import allure from '@fixtures/management/allure-metadata.json';
import messages from '@fixtures/messages.json';
import products from '@fixtures/products.json';
import users from '@fixtures/users.json';

let cartPage: CartPageActions;
let checkoutPage: CheckoutPageActions;
let inventoryPage: InventoryPageActions;
let loginPage: LoginPageActions;

test.beforeEach(async ({ page }) => {
  await parentSuite(allure.parentSuite);
  await suite(allure.testSuites.checkout);
  await epic(allure.epics.shopping);
  await feature(allure.features.checkout.name);
  await storyLink('DEV-4');

  cartPage = new CartPageActions(page);
  checkoutPage = new CheckoutPageActions(page);
  inventoryPage = new InventoryPageActions(page);
  loginPage = new LoginPageActions(page);

  await loginPage.visitLoginPage();
  await loginPage.login();
  await inventoryPage.verifyOnInventoryPage();
  await inventoryPage.addItemToCartByName(products.items[0].name);
  await inventoryPage.clickOnCartIcon();
  await cartPage.verifyOnCartPage();
  await cartPage.clickOnCheckoutButton();
  await checkoutPage.verifyOnCheckoutStepOne();
});

test.describe(allure.features.checkout.stories.enterShippingInfo, { tag: ['@checkout'] }, () => {
  test.beforeEach(async () => {
    await subSuite(allure.features.checkout.stories.enterShippingInfo);
    await story(allure.features.checkout.stories.enterShippingInfo);
  });

  test('TC-038: should enter valid checkout information', { tag: ['@smoke', '@critical'] }, async () => {
    await severity(Severity.CRITICAL);
    await testLink('TC-038');
    await description('Verify that valid checkout information can be entered and submitted.');

    await checkoutPage.fillCheckoutInformation(
      users.checkout.firstName,
      users.checkout.lastName,
      users.checkout.postalCode
    );
    await checkoutPage.clickOnContinueButton();
    await checkoutPage.verifyOnCheckoutStepTwo();
  });

  test('TC-039: should validate missing first name', { tag: ['@regression', '@medium'] }, async () => {
    await severity(Severity.NORMAL);
    await testLink('TC-039');
    await description('Verify that checkout fails when first name is missing.');

    await checkoutPage.enterLastName(users.checkout.lastName);
    await checkoutPage.enterPostalCode(users.checkout.postalCode);
    await checkoutPage.clickOnContinueButton();
    await checkoutPage.verifyErrorMessage(messages.checkout.firstNameRequired);
  });

  test('TC-040: should validate missing last name', { tag: ['@regression', '@medium'] }, async () => {
    await severity(Severity.NORMAL);
    await testLink('TC-040');
    await description('Verify that checkout fails when last name is missing.');

    await checkoutPage.enterFirstName(users.checkout.firstName);
    await checkoutPage.enterPostalCode(users.checkout.postalCode);
    await checkoutPage.clickOnContinueButton();
    await checkoutPage.verifyErrorMessage(messages.checkout.lastNameRequired);
  });

  test('TC-041: should validate missing postal code', { tag: ['@regression', '@medium'] }, async () => {
    await severity(Severity.NORMAL);
    await testLink('TC-041');
    await description('Verify that checkout fails when postal code is missing.');

    await checkoutPage.enterFirstName(users.checkout.firstName);
    await checkoutPage.enterLastName(users.checkout.lastName);
    await checkoutPage.clickOnContinueButton();
    await checkoutPage.verifyErrorMessage(messages.checkout.postalCodeRequired);
  });

  test('TC-042: should cancel checkout', { tag: ['@regression', '@medium', '@navigation'] }, async () => {
    await severity(Severity.NORMAL);
    await testLink('TC-042');
    await description('Verify that user can cancel checkout and return to cart page.');

    await checkoutPage.clickOnCancelButton();
    await cartPage.verifyOnCartPage();
  });
});

test.describe(allure.features.checkout.stories.orderSummary, { tag: ['@checkout'] }, () => {
  test.beforeEach(async () => {
    await subSuite(allure.features.checkout.stories.orderSummary);
    await story(allure.features.checkout.stories.orderSummary);
  });

  test('TC-043: order summary page shows item total', { tag: ['@smoke', '@critical'] }, async () => {
    await severity(Severity.CRITICAL);
    await testLink('TC-043');
    await description('Checkout step two displays the order total amount.');

    await checkoutPage.fillCheckoutInformation();
    await checkoutPage.clickOnContinueButton();
    await checkoutPage.verifyOnCheckoutStepTwo();
    await checkoutPage.verifyOrderTotalDisplayed();
  });

  test('TC-044: should display ordered product items in summary', { tag: ['@regression', '@high'] }, async () => {
    await severity(Severity.NORMAL);
    await testLink('TC-044');
    await description('Verify that the ordered item appears in the order summary.');

    await checkoutPage.fillCheckoutInformation();
    await checkoutPage.clickOnContinueButton();
    await checkoutPage.verifyOnCheckoutStepTwo();
    await checkoutPage.verifySummaryContainsItem(products.items[0].name);
  });

  test('TC-053: should display payment and shipping information', { tag: ['@regression', '@medium'] }, async () => {
    await severity(Severity.NORMAL);
    await testLink('TC-053');
    await description('Verify that payment and shipping information is displayed in summary.');

    await checkoutPage.fillCheckoutInformation();
    await checkoutPage.clickOnContinueButton();
    await checkoutPage.verifyOnCheckoutStepTwo();
    await checkoutPage.verifyPaymentInformationDisplayed();
    await checkoutPage.verifyShippingInformationDisplayed();
    await checkoutPage.verifyCartItemInSummary();
  });

});

test.describe(allure.features.checkout.stories.completeOrder, { tag: ['@checkout'] }, () => {
  test.beforeEach(async () => {
    await subSuite(allure.features.checkout.stories.completeOrder);
    await story(allure.features.checkout.stories.completeOrder);
  });

  test('TC-045: finish button redirects to order confirmation page', { tag: ['@smoke', '@critical'] }, async () => {
    await severity(Severity.CRITICAL);
    await testLink('TC-045');
    await description('Clicking Finish on checkout summary redirects to order complete page.');

    await checkoutPage.fillCheckoutInformation();
    await checkoutPage.clickOnContinueButton();
    await checkoutPage.verifyOnCheckoutStepTwo();
    await checkoutPage.clickOnFinishOrderButton();
    await checkoutPage.verifyOnCheckoutComplete();
  });
});

test.describe(allure.features.checkout.stories.orderConfirmation, { tag: ['@checkout'] }, () => {
  test.beforeEach(async () => {
    await subSuite(allure.features.checkout.stories.orderConfirmation);
    await story(allure.features.checkout.stories.orderConfirmation);
    await checkoutPage.fillCheckoutInformation();
    await checkoutPage.clickOnContinueButton();
    await checkoutPage.clickOnFinishOrderButton();
    await checkoutPage.verifyOnCheckoutComplete();
  });

  test('TC-046: should display order confirmation', { tag: ['@smoke', '@critical'] }, async () => {
    await severity(Severity.CRITICAL);
    await testLink('TC-046');
    await description('Verify that order confirmation message is displayed.');

    await checkoutPage.verifyOrderConfirmationMessage();
    await checkoutPage.verifyPonyExpressImage();
  });

  test('TC-047: should return to home page after completing an order', { tag: ['@regression', '@medium', '@navigation'] }, async () => {
    await severity(Severity.NORMAL);
    await testLink('TC-047');
    await description('Verify that user can return to inventory after completing order.');

    await checkoutPage.clickBackHome();
    await inventoryPage.verifyOnInventoryPage();
  });

  test('TC-055: order confirmation page shows thank you message', { tag: ['@regression', '@low'] }, async () => {
    await severity(Severity.NORMAL);
    await testLink('TC-055');
    await description('Order complete page displays confirmation text to user.');

    await checkoutPage.verifyCompleteTextDisplayed();
  });
});

test.describe(allure.features.checkout.stories.completeOrder, { tag: ['@checkout'] }, () => {
  test('TC-078: cart is empty after completing purchase and returning to inventory', { tag: ['@regression', '@high', '@cart'] }, async () => {
    await subSuite(allure.features.checkout.stories.completeOrder);
    await story(allure.features.checkout.stories.completeOrder);
    await severity(Severity.CRITICAL);
    await testLink('TC-078');
    await description('After checkout, Back Home returns to inventory with an empty cart badge.');

    await checkoutPage.completeCheckout();
    await checkoutPage.clickBackHome();
    await inventoryPage.verifyOnInventoryPage();
    await inventoryPage.verifyCartBadgeIsNotVisible();
  });
});

