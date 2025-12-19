import { CartPageActions } from '../../page-actions/CartPageActions';
import { InventoryPageActions } from '../../page-actions/InventoryPageActions';
import { LoginPageActions } from '../../page-actions/LoginPageActions';
import products from '../../../fixtures/products.json';

beforeEach(() => {
  LoginPageActions.visitLoginPage();
  LoginPageActions.login();
  InventoryPageActions.verifyOnInventoryPage();
});

describe('SauceDemo - Add Item to Cart', () => {

  it('should add first item to cart and verify in cart', () => {
    // Get the name of the first item before adding to cart
    InventoryPageActions.getFirstItemName().then((itemName) => {
      const firstItemName = itemName.trim();

      // Add first item to cart
      InventoryPageActions.addFirstItemToCart();

      // Verify cart badge shows 1 item
      InventoryPageActions.verifyCartBadgeCount(1);

      // Navigate to cart
      InventoryPageActions.clickCartIcon();
      CartPageActions.verifyOnCartPage();

      // Verify cart contains 1 item
      CartPageActions.verifyCartItemCount(1);

      // Verify the item name matches
      CartPageActions.verifyCartContainsItem(firstItemName);
    });
  });

  it('should add item to cart by name and verify', () => {
    const product = products.items[2];

    // Add item by name to cart
    InventoryPageActions.addItemToCartByName(product.name);

    // Verify cart badge shows 1 item
    InventoryPageActions.verifyCartBadgeCount(1);

    // Navigate to cart
    InventoryPageActions.clickCartIcon();
    CartPageActions.verifyOnCartPage();

    // Verify cart contains 1 item
    CartPageActions.verifyCartItemCount(1);

    // Verify the item name matches
    CartPageActions.verifyCartContainsItem(product.name);
  });

  it('should add multiple items to cart', () => {
    // Add first item
    InventoryPageActions.addFirstItemToCart();
    InventoryPageActions.verifyCartBadgeCount(1);

    // Add second item
    InventoryPageActions.addItemToCartByIndex(2);
    InventoryPageActions.verifyCartBadgeCount(2);

    // Navigate to cart
    InventoryPageActions.clickCartIcon();
    CartPageActions.verifyOnCartPage();

    // Verify cart contains 2 items
    CartPageActions.verifyCartItemCount(2);
  });

  it('should add item to cart and verify item details', () => {
    // Get item details before adding to cart
    InventoryPageActions.getFirstItemName().then((name) => {
      const itemName = name.trim();

      InventoryPageActions.getFirstItemPrice().then((price) => {
        const itemPrice = price.trim();

        // Add item to cart
        InventoryPageActions.addFirstItemToCart();

        // Navigate to cart
        InventoryPageActions.clickCartIcon();
        CartPageActions.verifyOnCartPage();

        // Verify item details in cart
        CartPageActions.verifyCartContainsItem(itemName);
        CartPageActions.verifyFirstCartItemPrice(itemPrice);
      });
    });
  });

  it('should remove item from cart', () => {
    // Add item to cart
    InventoryPageActions.addFirstItemToCart();
    InventoryPageActions.verifyCartBadgeCount(1);

    // Navigate to cart
    InventoryPageActions.clickCartIcon();
    CartPageActions.verifyOnCartPage();

    // Remove item from cart
    CartPageActions.removeItemByIndex(0);

    // Verify cart is empty
    CartPageActions.verifyCartIsEmpty();
    InventoryPageActions.verifyCartBadgeNotVisible();
  });
});

