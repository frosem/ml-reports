import { test } from '@playwright/test';
import { description, epic, feature, parentSuite, Severity, severity, story, subSuite, suite } from 'allure-js-commons';
import { storyLink, testLink } from '@playwright-support/AllureTools';
import { CartPageActions } from '@playwright-page-actions/CartPageActions';
import { HeaderPageActions } from '@playwright-page-actions/HeaderPageActions';
import { InventoryPageActions } from '@playwright-page-actions/InventoryPageActions';
import { LoginPageActions } from '@playwright-page-actions/LoginPageActions';
import allure from '@fixtures/management/allure-metadata.json';
import products from '@fixtures/products.json';

let cartPage: CartPageActions;
let headerPage: HeaderPageActions;
let inventoryPage: InventoryPageActions;
let loginPage: LoginPageActions;

test.beforeEach(async ({ page }) => {
  await parentSuite(allure.parentSuite);
  await suite(allure.testSuites.userExperience);
  await epic(allure.epics.userExperience);
  await storyLink('DEV-5');

  cartPage = new CartPageActions(page);
  headerPage = new HeaderPageActions(page);
  inventoryPage = new InventoryPageActions(page);
  loginPage = new LoginPageActions(page);

  await loginPage.visitLoginPage();
  await loginPage.login();
  await inventoryPage.verifyOnInventoryPage();
});

test.describe(allure.features.navigation.stories.menuNavigation, () => {
  test.beforeEach(async () => {
    await subSuite(allure.features.navigation.stories.menuNavigation);
    await feature(allure.features.navigation.name);
    await story(allure.features.navigation.stories.menuNavigation);
    await headerPage.verifyBurgerMenuButtonVisible();
  });

  test('TC-048: hamburger menu toggles between open and closed states', async () => {
    await severity(Severity.NORMAL);
    await testLink('TC-048');
    await description('Verify that menu starts closed, opens when clicking burger icon, closes when clicking X.');

    await headerPage.verifyBurgerMenuIsClosed();
    await headerPage.openMenu();
    await headerPage.verifyBurgerMenuIsOpen();
    await headerPage.closeMenu();
    await headerPage.verifyBurgerMenuIsClosed();
  });

  test('TC-075: cart icon in header redirects to cart page', async () => {
    await severity(Severity.NORMAL);
    await testLink('TC-075');
    await description('Clicking cart icon in header redirects to cart page.');

    await headerPage.clickOnCartIcon();
    await cartPage.verifyOnCartPage();
  });
});

test.describe(allure.features.appState.stories.resetState, () => {
  test.beforeEach(async () => {
    await subSuite(allure.features.appState.stories.resetState);
    await feature(allure.features.appState.name);
    await story(allure.features.appState.stories.resetState);
  });

  test('TC-049: should reset app state', async () => {
    await severity(Severity.NORMAL);
    await testLink('TC-049');
    await description('Verify that app state can be reset from the menu.');

    const productItems = [products.items[0].name, products.items[1].name];
    for (const productItem of productItems) {
      await inventoryPage.addItemToCartByName(productItem);
    }
    await inventoryPage.verifyCartBadgeCount(productItems.length);
    await headerPage.resetAppState();
    await inventoryPage.verifyCartBadgeIsNotVisible();
  });
});

test.describe(allure.features.responsiveDesign.stories.mobileViewport, () => {
  test.beforeEach(async () => {
    await subSuite(allure.features.responsiveDesign.stories.mobileViewport);
    await feature(allure.features.responsiveDesign.name);
    await story(allure.features.responsiveDesign.stories.mobileViewport);
  });

  test('TC-050: mobile viewport displays inventory items and toggles menu', async ({ page }) => {
    await severity(Severity.NORMAL);
    await testLink('TC-050');
    await description('At iPhone 12/13 Pro viewport (390x844), inventory page shows items and menu opens/closes.');

    await page.setViewportSize({ height: 844, width: 390 });

    await inventoryPage.verifyOnInventoryPage();
    await headerPage.verifyBurgerMenuButtonVisible();
    await headerPage.openMenu();
    await headerPage.verifyBurgerMenuIsOpen();
    await headerPage.closeMenu();
    await headerPage.verifyBurgerMenuIsClosed();
  });
});
