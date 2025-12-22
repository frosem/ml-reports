import { description, epic, feature, Severity, severity, story } from 'allure-js-commons';
import { storyLink, testLink } from '@cypress-support/AllureTools';
import { CartPageActions } from '@cypress-page-actions/CartPageActions';
import { InventoryPageActions } from '@cypress-page-actions/InventoryPageActions';
import { LoginPageActions } from '@cypress-page-actions/LoginPageActions';
import allure from '@fixtures/management/allure-metadata.json';
import products from '@fixtures/products.json';

beforeEach(() => {
  epic(allure.epics.cart);
  feature(allure.features.cartManagement.name);
  storyLink('DEV-2');

  LoginPageActions.visitLoginPage();
  LoginPageActions.login();
  InventoryPageActions.verifyOnInventoryPage();
});

describe(allure.parentSuite, () => {
  describe(allure.testSuites.cartOperations, () => {
    describe('Add Item to Cart', () => {
      beforeEach(() => {
        story(allure.features.cartManagement.stories.addToCart);
        severity(Severity.CRITICAL);
      });

      it('should add first item to cart and verify in cart', () => {
        testLink('QA-6');
        description('Verifies that the first product can be added to the cart.');

        InventoryPageActions.getFirstItemName().then((itemName) => {
          const firstItemName = itemName.trim();
          InventoryPageActions.addFirstItemToCart();
          InventoryPageActions.verifyCartBadgeCount(1);
          InventoryPageActions.clickOnCartIcon();
          CartPageActions.verifyOnCartPage();
          CartPageActions.verifyCartItemCount(1);
          CartPageActions.verifyCartContainsItem(firstItemName);
        });
      });

      it('should add item to cart by name and verify', () => {
        testLink('QA-7');
        description('Verifies that a specific product can be added to the cart by its name.');

        const product = products.items[2];
        InventoryPageActions.addItemToCartByName(product.name);
        InventoryPageActions.verifyCartBadgeCount(1);
        InventoryPageActions.clickOnCartIcon();
        CartPageActions.verifyOnCartPage();
        CartPageActions.verifyCartItemCount(1);
        CartPageActions.verifyCartContainsItem(product.name);
      });

      it('should add multiple items to cart', () => {
        testLink('QA-8');
        description('Verifies that multiple products can be added to the cart simultaneously.');

        InventoryPageActions.addFirstItemToCart();
        InventoryPageActions.verifyCartBadgeCount(1);
        InventoryPageActions.addItemToCartByIndex(2);
        InventoryPageActions.verifyCartBadgeCount(2);
        InventoryPageActions.clickOnCartIcon();
        CartPageActions.verifyOnCartPage();
        CartPageActions.verifyCartItemCount(2);
      });

      it('should add item to cart and verify item details', () => {
        testLink('QA-9');
        description('Verifies that product details (name, price) are preserved when added to the cart.');

        InventoryPageActions.getFirstItemName().then((name) => {
          const itemName = name.trim();
          InventoryPageActions.getFirstItemPrice().then((price) => {
            const itemPrice = price.trim();
            InventoryPageActions.addFirstItemToCart();
            InventoryPageActions.clickOnCartIcon();
            CartPageActions.verifyOnCartPage();
            CartPageActions.verifyCartContainsItem(itemName);
            CartPageActions.verifyFirstCartItemPrice(itemPrice);
          });
        });
      });
    });

    describe('Remove Item from Cart', () => {
      it('should remove item from cart', () => {
        story(allure.features.cartManagement.stories.removeFromCart);
        severity(Severity.CRITICAL);
        testLink('QA-10');
        description('Verifies that a product can be removed from the cart.');

        InventoryPageActions.addFirstItemToCart();
        InventoryPageActions.verifyCartBadgeCount(1);
        InventoryPageActions.clickOnCartIcon();
        CartPageActions.verifyOnCartPage();
        CartPageActions.removeItemButtonByIndex(0);
        CartPageActions.verifyCartIsEmpty();
        InventoryPageActions.verifyCartBadgeIsNotVisible();
      });
    });
  });
});
