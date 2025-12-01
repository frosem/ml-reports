/**
 * Page Objects for Inventory Page
 * Independent locators file for InventoryPage
 */
export const inventoryPageObjects = {
  addToCartButton: (itemName?: string): string => {
    if (itemName) {
      return `button[data-test*="add-to-cart-${itemName.toLowerCase().replace(/\s+/g, '-')}"]`;
    }
    return 'button.btn_inventory';
  },
  addToCartButtonByIndex: (index: number): string => {
    return `.inventory_item:nth-child(${index}) button.btn_inventory`;
  },
  cartIconLink: '.shopping_cart_link',
  cartBadgeContainer: '.shopping_cart_badge',
  inventoryItemsContainer: '.inventory_item',
  inventoryItemNameContainer: '.inventory_item_name',
  inventoryItemPriceContainer: '.inventory_item_price',
};

