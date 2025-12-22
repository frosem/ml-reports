import { test } from '@playwright/test';
import { description, epic, feature, parentSuite, Severity, severity, story, suite } from 'allure-js-commons';
import { storyLink, testLink } from '@playwright-support/AllureTools';
import { CartPageActions } from '@playwright-page-actions/CartPageActions';
import { InventoryPageActions } from '@playwright-page-actions/InventoryPageActions';
import { LoginPageActions } from '@playwright-page-actions/LoginPageActions';
import allure from '@fixtures/management/allure-metadata.json';
import products from '@fixtures/products.json';

let cartPage: CartPageActions;
let inventoryPage: InventoryPageActions;
let loginPage: LoginPageActions;

test.beforeEach(async ({ page }) => {
  await parentSuite(allure.parentSuite);
  await suite(allure.testSuites.cartOperations);
  await epic(allure.epics.cart);
  await feature(allure.features.cartManagement.name);
  await storyLink('DEV-2');

  loginPage = new LoginPageActions(page);
  inventoryPage = new InventoryPageActions(page);
  cartPage = new CartPageActions(page);

  await loginPage.visitLoginPage();
  await loginPage.login();
  await inventoryPage.verifyOnInventoryPage();
});

test.describe('Add Item to Cart', () => {
  test.beforeEach(async () => {
    await story(allure.features.cartManagement.stories.addToCart);
    await severity(Severity.CRITICAL);
  });

  test('should add first item to cart and verify in cart', async () => {
    await testLink('QA-6');
    await description('Verifies that the first product can be added to the cart.');

    const firstItemName: string = await inventoryPage.getFirstItemName();
    await inventoryPage.addFirstItemToCart();
    await inventoryPage.verifyCartBadgeCount(1);
    await inventoryPage.clickOnCartIcon();
    await cartPage.verifyOnCartPage();
    await cartPage.verifyCartItemCount(1);
    await cartPage.verifyCartContainsItem(firstItemName);
  });

  test('should add item to cart by name and verify', async () => {
    await testLink('QA-7');
    await description('Verifies that a specific product can be added to the cart by its name.');

    const product = products.items[2];
    await inventoryPage.addItemToCartByName(product.name);
    await inventoryPage.verifyCartBadgeCount(1);
    await inventoryPage.clickOnCartIcon();
    await cartPage.verifyOnCartPage();
    await cartPage.verifyCartItemCount(1);
    await cartPage.verifyCartContainsItem(product.name);
  });

  test('should add multiple items to cart', async () => {
    await testLink('QA-8');
    await description('Verifies that multiple products can be added to the cart simultaneously.');

    await inventoryPage.addFirstItemToCart();
    await inventoryPage.verifyCartBadgeCount(1);
    await inventoryPage.addItemToCartByIndex(2);
    await inventoryPage.verifyCartBadgeCount(2);
    await inventoryPage.clickOnCartIcon();
    await cartPage.verifyOnCartPage();
    await cartPage.verifyCartItemCount(2);
  });

  test('should add item to cart and verify item details', async () => {
    await testLink('QA-9');
    await description('Verifies that product details (name, price) are preserved when added to the cart.');

    const itemName: string = await inventoryPage.getFirstItemName();
    const itemPrice: string = await inventoryPage.getFirstItemPrice();
    await inventoryPage.addFirstItemToCart();
    await inventoryPage.clickOnCartIcon();
    await cartPage.verifyOnCartPage();
    await cartPage.verifyCartContainsItem(itemName);
    await cartPage.verifyFirstCartItemPrice(itemPrice);
  });
});

test.describe('Remove Item from Cart', () => {
  test('should remove item from cart', async () => {
    await story(allure.features.cartManagement.stories.removeFromCart);
    await severity(Severity.CRITICAL);
    await testLink('QA-10');
    await description('Verifies that a product can be removed from the cart.');

    await inventoryPage.addFirstItemToCart();
    await inventoryPage.verifyCartBadgeCount(1);
    await inventoryPage.clickOnCartIcon();
    await cartPage.verifyOnCartPage();
    await cartPage.removeItemButtonByIndex(0);
    await cartPage.verifyCartIsEmpty();
    await inventoryPage.verifyCartBadgeIsNotVisible();
  });
});
