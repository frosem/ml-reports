import { test } from '@playwright/test';
import { description, epic, feature, parentSuite, Severity, severity, story, subSuite, suite } from 'allure-js-commons';
import { storyLink, testLink } from '@playwright-support/AllureTools';
import { InventoryPageActions } from '@playwright-page-actions/InventoryPageActions';
import { LoginPageActions } from '@playwright-page-actions/LoginPageActions';
import { ProductDetailPageActions } from '@playwright-page-actions/ProductDetailPageActions';
import allure from '@fixtures/management/allure-metadata.json';
import products from '@fixtures/products.json';

let inventoryPage: InventoryPageActions;
let loginPage: LoginPageActions;
let productDetailPage: ProductDetailPageActions;

test.beforeEach(async ({ page }) => {
  await parentSuite(allure.parentSuite);
  await suite(allure.testSuites.inventory);
  await epic(allure.epics.productCatalog);
  await feature(allure.features.inventory.name);
  await storyLink('DEV-3');

  inventoryPage = new InventoryPageActions(page);
  loginPage = new LoginPageActions(page);
  productDetailPage = new ProductDetailPageActions(page);

  await loginPage.visitLoginPage();
  await loginPage.login();
  await inventoryPage.verifyOnInventoryPage();
});

test.describe(allure.features.inventory.stories.productDisplay, () => {
  test.beforeEach(async () => {
    await subSuite(allure.features.inventory.stories.productDisplay);
    await story(allure.features.inventory.stories.productDisplay);
  });

  test('TC-013: should display all products on inventory page', async () => {
    await severity(Severity.CRITICAL);
    await testLink('TC-013');
    await description('Verify that all 6 products are displayed on the inventory page.');

    await inventoryPage.verifyItemCount(6);
  });

});

test.describe(allure.features.inventory.stories.viewProductDetails, () => {
  test.beforeEach(async () => {
    await subSuite(allure.features.inventory.stories.viewProductDetails);
    await story(allure.features.inventory.stories.viewProductDetails);
  });

  test('TC-014: should navigate to product detail page', async () => {
    await severity(Severity.CRITICAL);
    await testLink('TC-014');
    await description('Verify that clicking on a product navigates to its detail page.');

    await inventoryPage.clickOnProductName(products.items[0].name);
    await productDetailPage.verifyOnProductDetailPage();
  });

  test('TC-016: should add product to cart from detail page', async () => {
    await severity(Severity.CRITICAL);
    await testLink('TC-016');
    await description('Verify that a product can be added to cart from the detail page.');

    await inventoryPage.clickOnProductName(products.items[1].name);
    await productDetailPage.verifyOnProductDetailPage();
    await productDetailPage.clickOnAddToCartButton();
    await productDetailPage.verifyRemoveButtonVisible();
    await inventoryPage.verifyCartBadgeCount(1);
  });

  test('TC-022: back to products button redirects to inventory page', async () => {
    await severity(Severity.NORMAL);
    await testLink('TC-022');
    await description('Clicking Back to products from detail page redirects to inventory.');

    await inventoryPage.clickOnProductName(products.items[2].name);
    await productDetailPage.verifyOnProductDetailPage();
    await productDetailPage.clickOnBackToProductsButton();
    await inventoryPage.verifyOnInventoryPage();
  });

  test('TC-072: should remove item from detail page', async () => {
    await severity(Severity.NORMAL);
    await testLink('TC-072');
    await description('Verify that item can be removed from cart on product detail page.');

    await inventoryPage.clickOnProductName(products.items[3].name);
    await productDetailPage.clickOnAddToCartButton();
    await productDetailPage.verifyRemoveButtonVisible();
    await productDetailPage.clickOnRemoveFromCartButton();
    await productDetailPage.verifyAddToCartButtonVisible();
  });

});

test.describe(allure.features.inventory.stories.sortProducts, () => {
  test.beforeEach(async () => {
    await subSuite(allure.features.inventory.stories.sortProducts);
    await story(allure.features.inventory.stories.sortProducts);
  });

  test('TC-017: should sort products A-Z', async () => {
    await severity(Severity.NORMAL);
    await testLink('TC-017');
    await description('Verify that products can be sorted alphabetically A to Z.');

    await inventoryPage.sortProducts('az');
    await inventoryPage.verifyProductsSortedAZ();
  });

  test('TC-018: should sort products Z-A', async () => {
    await severity(Severity.NORMAL);
    await testLink('TC-018');
    await description('Verify that products can be sorted alphabetically Z to A.');

    await inventoryPage.sortProducts('za');
    await inventoryPage.verifyProductsSortedZA();
  });

  test('TC-019: should sort products by price low to high', async () => {
    await severity(Severity.NORMAL);
    await testLink('TC-019');
    await description('Verify that products can be sorted by price from low to high.');

    await inventoryPage.sortProducts('lohi');
    await inventoryPage.verifyProductsSortedPriceLowToHigh();
  });

  test('TC-020: should sort products by price high to low', async () => {
    await severity(Severity.NORMAL);
    await testLink('TC-020');
    await description('Verify that products can be sorted by price from high to low.');

    await inventoryPage.sortProducts('hilo');
    await inventoryPage.verifyProductsSortedPriceHighToLow();
  });
});
