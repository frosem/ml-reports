/**
 * Page Objects for Inventory Page
 * Independent locators file for InventoryPage
 */
export const inventoryPageObjects = {
  addToCartButtonCSS: (itemName?: string): string => {
    if (itemName) {
      return `[data-test="add-to-cart-${itemName.toLowerCase().replace(/\s+/g, '-')}"]`;
    }
    return '.btn_inventory';
  },
  addToCartButtonCSSByIndex: (index: number): string => {
    return `.inventory_item:nth-child(${index}) .btn_inventory`;
  },
  cartBadgeSpanTestId: 'shopping-cart-badge',
  cartIconLinkTestId: 'shopping-cart-link',
  inventoryItemNameContainerTestId: 'inventory-item-name',
  inventoryItemPriceContainerTestId: 'inventory-item-price',
  inventoryItemContainerTestId: 'inventory-item',
};

