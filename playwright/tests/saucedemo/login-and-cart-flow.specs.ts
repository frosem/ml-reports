import { test } from '@playwright/test';
import { CartPageActions } from '../../page-actions/CartPageActions';
import { InventoryPageActions } from '../../page-actions/InventoryPageActions';
import { LoginPageActions } from '../../page-actions/LoginPageActions';

test.describe('SauceDemo - Complete Login and Add to Cart Flow', () => {
  test('should complete full flow: login -> add item -> verify in cart', async ({ page }) => {
    let cartPage: CartPageActions = new CartPageActions(page);
    let inventoryPage: InventoryPageActions = new InventoryPageActions(page);
    let loginPage: LoginPageActions = new LoginPageActions(page);

    await loginPage.visitLoginPage();
    await loginPage.login();
    await inventoryPage.verifyOnInventoryPage();

    await inventoryPage.addFirstItemToCart();
    await inventoryPage.verifyCartBadgeCount(1);

    await inventoryPage.clickCartIcon();
    await cartPage.verifyOnCartPage();

    await cartPage.verifyCartItemCount(1);
  });
});
