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
  cartBadgeSpanTestId: 'shopping-cart-badge',
  cartIconLinkTestId: 'shopping-cart-link',
  inventoryItemContainerTestId: 'inventory-item',
  inventoryItemDescriptionTestId: 'inventory-item-desc',
  inventoryItemImageCSS: '.inventory_item_img img',
  inventoryItemNameContainerTestId: 'inventory-item-name',
  inventoryItemPriceContainerTestId: 'inventory-item-price',
  removeButtonCSS: (itemName?: string): string => {
    if (itemName) {
      return `[data-test="remove-${itemName.toLowerCase().replace(/\s+/g, '-')}"]`;
    }
    return '[data-test^="remove-"]';
  },
  sortDropdownTestId: 'product-sort-container',
};

