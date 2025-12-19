import { test } from '@playwright/test';
import { CartPageActions } from '../../page-actions/CartPageActions';
import { InventoryPageActions } from '../../page-actions/InventoryPageActions';
import { LoginPageActions } from '../../page-actions/LoginPageActions';
import products from '../../../fixtures/products.json';

let cartPage: CartPageActions;
let inventoryPage: InventoryPageActions;
let loginPage: LoginPageActions;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPageActions(page);
  inventoryPage = new InventoryPageActions(page);
  cartPage = new CartPageActions(page);

  await loginPage.visitLoginPage();
  await loginPage.login();
  await inventoryPage.verifyOnInventoryPage();
});

test.describe('SauceDemo - Add Item to Cart', () => {

  test('should add first item to cart and verify in cart', async () => {
    const firstItemName: string = await inventoryPage.getFirstItemName();
    await inventoryPage.addFirstItemToCart();
    await inventoryPage.verifyCartBadgeCount(1);
    await inventoryPage.clickCartIcon();
    await cartPage.verifyOnCartPage();
    await cartPage.verifyCartItemCount(1);
    await cartPage.verifyCartContainsItem(firstItemName);
  });

  test('should add item to cart by name and verify', async () => {
    const product = products.items[2];
    await inventoryPage.addItemToCartByName(product.name);
    await inventoryPage.verifyCartBadgeCount(1);
    await inventoryPage.clickCartIcon();
    await cartPage.verifyOnCartPage();
    await cartPage.verifyCartItemCount(1);
    await cartPage.verifyCartContainsItem(product.name);
  });

  test('should add multiple items to cart', async () => {
    await inventoryPage.addFirstItemToCart();
    await inventoryPage.verifyCartBadgeCount(1);
    await inventoryPage.addItemToCartByIndex(2);
    await inventoryPage.verifyCartBadgeCount(2);
    await inventoryPage.clickCartIcon();
    await cartPage.verifyOnCartPage();
    await cartPage.verifyCartItemCount(2);
  });

  test('should add item to cart and verify item details', async () => {
    const itemName: string = await inventoryPage.getFirstItemName();
    const itemPrice: string = await inventoryPage.getFirstItemPrice();
    await inventoryPage.addFirstItemToCart();
    await inventoryPage.clickCartIcon();
    await cartPage.verifyOnCartPage();
    await cartPage.verifyCartContainsItem(itemName);
    await cartPage.verifyFirstCartItemPrice(itemPrice);
  });

  test('should remove item from cart', async () => {
    await inventoryPage.addFirstItemToCart();
    await inventoryPage.verifyCartBadgeCount(1);
    await inventoryPage.clickCartIcon();
    await cartPage.verifyOnCartPage();
    await cartPage.removeItemByIndex(0);
    await cartPage.verifyCartIsEmpty();
    await inventoryPage.verifyCartBadgeNotVisible();
  });
});
