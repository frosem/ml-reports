import { test } from '@playwright/test';
import { description, epic, feature, parentSuite, Severity, severity, story, subSuite, suite } from 'allure-js-commons';
import { storyLink, testLink } from '@playwright-support/AllureTools';
import { CartPageActions } from '@playwright-page-actions/CartPageActions';
import { CheckoutPageActions } from '@playwright-page-actions/CheckoutPageActions';
import { HeaderPageActions } from '@playwright-page-actions/HeaderPageActions';
import { InventoryPageActions } from '@playwright-page-actions/InventoryPageActions';
import { LoginPageActions } from '@playwright-page-actions/LoginPageActions';
import { ProductDetailPageActions } from '@playwright-page-actions/ProductDetailPageActions';
import allure from '@fixtures/management/allure-metadata.json';
import products from '@fixtures/products.json';

let cartPage: CartPageActions;
let checkoutPage: CheckoutPageActions;
let headerPage: HeaderPageActions;
let inventoryPage: InventoryPageActions;
let loginPage: LoginPageActions;
let productDetailPage: ProductDetailPageActions;

test.beforeEach(async ({ page }) => {
  await parentSuite(allure.parentSuite);
  await suite(allure.testSuites.cart);
  await epic(allure.epics.shopping);
  await feature(allure.features.cart.name);
  await storyLink('DEV-2');

  cartPage = new CartPageActions(page);
  checkoutPage = new CheckoutPageActions(page);
  headerPage = new HeaderPageActions(page);
  inventoryPage = new InventoryPageActions(page);
  loginPage = new LoginPageActions(page);
  productDetailPage = new ProductDetailPageActions(page);

  await loginPage.visitLoginPage();
  await loginPage.login();
  await inventoryPage.verifyOnInventoryPage();
});

test.describe(allure.features.cart.stories.addToCart, { tag: ['@cart'] }, () => {
  test.beforeEach(async () => {
    await subSuite(allure.features.cart.stories.addToCart);
    await story(allure.features.cart.stories.addToCart);
    await severity(Severity.CRITICAL);
  });

  test('TC-023: should add single item to cart', { tag: ['@smoke', '@critical'] }, async () => {
    await testLink('TC-023');
    await description('Verify that a single item can be added to the cart.');

    await inventoryPage.addItemToCartByName(products.items[0].name);
    await inventoryPage.verifyCartBadgeCount(1);
    await inventoryPage.clickOnCartIcon();
    await cartPage.verifyOnCartPage();
    await cartPage.verifyCartContainsItem(products.items[0].name);
  });

  test('TC-024: should add multiple items to cart', { tag: ['@regression', '@high'] }, async () => {
    await testLink('TC-024');
    await description('Verify that multiple different items can be added to the cart.');

    const itemsToAdd = [products.items[1], products.items[2], products.items[3]];
    for (const item of itemsToAdd) {
      await inventoryPage.addItemToCartByName(item.name);
    }
    await inventoryPage.verifyCartBadgeCount(itemsToAdd.length);
    await inventoryPage.clickOnCartIcon();
    await cartPage.verifyCartItemCount(itemsToAdd.length);
  });

  test('TC-025: should not add same item twice', { tag: ['@regression', '@medium'] }, async () => {
    await testLink('TC-025');
    await description('Verify that adding the same item twice does not duplicate it in cart.');

    await inventoryPage.addItemToCartByName(products.items[4].name);
    await inventoryPage.verifyCartBadgeCount(1);
    await inventoryPage.verifyRemoveButtonVisibleForItem(products.items[4].name);
    await inventoryPage.clickOnCartIcon();
    await cartPage.verifyCartItemCount(1);
  });

  test('TC-037: should add item from product detail page', { tag: ['@regression', '@high', '@inventory'] }, async () => {
    await testLink('TC-037');
    await description('Verify that an item can be added to cart from the product detail page.');

    await inventoryPage.clickOnProductName(products.items[5].name);
    await productDetailPage.verifyOnProductDetailPage();
    await productDetailPage.clickOnAddToCartButton();
    await inventoryPage.verifyCartBadgeCount(1);
  });

});

test.describe(allure.features.cart.stories.removeFromCart, { tag: ['@cart'] }, () => {
  test.beforeEach(async () => {
    await subSuite(allure.features.cart.stories.removeFromCart);
    await story(allure.features.cart.stories.removeFromCart);
    await severity(Severity.CRITICAL);
  });

  test('TC-026: should remove item from inventory page', { tag: ['@smoke', '@critical'] }, async () => {
    await testLink('TC-026');
    await description('Verify that an item can be removed from cart while on inventory page.');

    await inventoryPage.addItemToCartByName(products.items[1].name);
    await inventoryPage.verifyCartBadgeCount(1);
    await inventoryPage.removeItemFromCartByName(products.items[1].name);
    await inventoryPage.verifyCartBadgeIsNotVisible();
  });

  test('TC-027: should remove item from cart page', { tag: ['@smoke', '@critical'] }, async () => {
    await testLink('TC-027');
    await description('Verify that an item can be removed from the cart page.');

    await inventoryPage.addItemToCartByName(products.items[2].name);
    await inventoryPage.clickOnCartIcon();
    await cartPage.verifyOnCartPage();
    await cartPage.removeItemByName(products.items[2].name);
    await cartPage.verifyCartIsEmpty();
  });

  test('TC-028: should remove all items from cart', { tag: ['@regression', '@high'] }, async () => {
    await testLink('TC-028');
    await description('Verify that all items can be removed from the cart.');

    const itemsToRemove = [products.items[3], products.items[4]];
    for (const item of itemsToRemove) {
      await inventoryPage.addItemToCartByName(item.name);
    }
    await inventoryPage.clickOnCartIcon();
    await cartPage.verifyCartItemCount(itemsToRemove.length);
    for (const item of itemsToRemove) {
      await cartPage.removeItemByName(item.name);
    }
    await cartPage.verifyCartIsEmpty();
  });

});

test.describe(allure.features.cart.stories.viewCart, { tag: ['@cart'] }, () => {
  test.beforeEach(async () => {
    await subSuite(allure.features.cart.stories.viewCart);
    await story(allure.features.cart.stories.viewCart);
  });

  test('TC-029: cart page shows all added items', { tag: ['@smoke', '@critical'] }, async () => {
    await severity(Severity.CRITICAL);
    await testLink('TC-029');
    await description('Cart page displays each item that was added from inventory.');

    await inventoryPage.addItemToCartByName(products.items[0].name);
    await inventoryPage.addItemToCartByName(products.items[5].name);
    await inventoryPage.clickOnCartIcon();
    await cartPage.verifyOnCartPage();
    await cartPage.verifyCartContainsItem(products.items[0].name);
    await cartPage.verifyCartContainsItem(products.items[5].name);
  });

  test('TC-030: cart badge reflects number of items added and removed', { tag: ['@regression', '@medium'] }, async () => {
    await severity(Severity.NORMAL);
    await testLink('TC-030');
    await description('Cart badge shows 0 when empty, increments on add, decrements on remove.');

    await inventoryPage.verifyCartBadgeIsNotVisible();
    await inventoryPage.addItemToCartByName(products.items[2].name);
    await inventoryPage.verifyCartBadgeCount(1);
    await inventoryPage.addItemToCartByName(products.items[3].name);
    await inventoryPage.verifyCartBadgeCount(2);
    await inventoryPage.removeItemFromCartByName(products.items[2].name);
    await inventoryPage.verifyCartBadgeCount(1);
  });

  test('TC-032: continue shopping button redirects to inventory page', { tag: ['@regression', '@medium', '@navigation'] }, async () => {
    await severity(Severity.NORMAL);
    await testLink('TC-032');
    await description('Clicking Continue Shopping from cart redirects to inventory page.');

    await inventoryPage.addItemToCartByName(products.items[4].name);
    await inventoryPage.clickOnCartIcon();
    await cartPage.verifyOnCartPage();
    await cartPage.clickOnContinueShoppingButton();
    await inventoryPage.verifyOnInventoryPage();
  });

  test('TC-033: checkout button redirects to checkout step one', { tag: ['@smoke', '@critical', '@checkout'] }, async () => {
    await severity(Severity.CRITICAL);
    await testLink('TC-033');
    await description('Clicking Checkout from cart redirects to checkout information page.');

    await inventoryPage.addItemToCartByName(products.items[1].name);
    await inventoryPage.clickOnCartIcon();
    await cartPage.verifyOnCartPage();
    await cartPage.clickOnCheckoutButton();
    await checkoutPage.verifyOnCheckoutStepOne();
  });

  test('TC-035: cart page shows zero items when no products added', { tag: ['@regression', '@low'] }, async () => {
    await severity(Severity.NORMAL);
    await testLink('TC-035');
    await description('Cart page displays 0 items when user has not added any products.');

    await inventoryPage.clickOnCartIcon();
    await cartPage.verifyCartIsEmpty();
  });

  test('TC-036: cart shows 3 items when 3 products are added', { tag: ['@regression', '@medium'] }, async () => {
    await severity(Severity.NORMAL);
    await testLink('TC-036');
    await description('Cart item count matches number of products added from inventory.');

    await inventoryPage.addItemToCartByName(products.items[0].name);
    await inventoryPage.addItemToCartByName(products.items[2].name);
    await inventoryPage.addItemToCartByName(products.items[4].name);
    await inventoryPage.clickOnCartIcon();
    await cartPage.verifyCartItemCount(3);
  });

  test('TC-060: should verify item no longer in cart after removal', { tag: ['@regression', '@medium'] }, async () => {
    await severity(Severity.NORMAL);
    await testLink('TC-060');
    await description('Verify that removed item is no longer displayed in cart.');

    await inventoryPage.addItemToCartByName(products.items[3].name);
    await inventoryPage.clickOnCartIcon();
    await cartPage.verifyCartContainsItem(products.items[3].name);
    await cartPage.removeItemByName(products.items[3].name);
    await cartPage.verifyCartDoesNotContainItem(products.items[3].name);
  });
});

test.describe(allure.features.cart.stories.cartPersistence, { tag: ['@cart'] }, () => {
  test.beforeEach(async () => {
    await subSuite(allure.features.cart.stories.cartPersistence);
    await story(allure.features.cart.stories.cartPersistence);
  });

  test('TC-031: should persist cart after logout and login', { tag: ['@regression', '@high', '@auth'] }, async () => {
    await severity(Severity.NORMAL);
    await testLink('TC-031');
    await description('Verify that cart contents persist after logout and login.');

    await inventoryPage.addItemToCartByName(products.items[5].name);
    await inventoryPage.verifyCartBadgeCount(1);
    await headerPage.logout();
    await loginPage.verifyOnLoginPage();
    await loginPage.login();
    await inventoryPage.verifyOnInventoryPage();
    await inventoryPage.verifyCartBadgeCount(1);
  });
});

