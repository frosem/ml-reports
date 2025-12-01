import { LoginPageActions } from '../../page-actions/LoginPageActions';
import { InventoryPageActions } from '../../page-actions/InventoryPageActions';
import { CartPageActions } from '../../page-actions/CartPageActions';

describe('SauceDemo - Complete Login and Add to Cart Flow', () => {
  it('should complete full flow: login -> add item -> verify in cart', () => {
    // Step 1: Login (using default standard user)
    LoginPageActions.visitLoginPage();
    LoginPageActions.login();
    InventoryPageActions.verifyOnInventoryPage();

    // Step 2: Add item to cart
    InventoryPageActions.addFirstItemToCart();
    InventoryPageActions.verifyCartBadgeCount(1);

    // Step 3: Navigate to cart
    InventoryPageActions.clickCartIcon();
    CartPageActions.verifyOnCartPage();

    // Step 4: Verify item is in cart
    CartPageActions.verifyCartItemCount(1);
  });
});

