/**
 * Page Objects for Checkout Pages
 * Independent locators file for Checkout flow
 */
export const checkoutPageObjects = {
  // Checkout Step One (Customer Info)
  cancelButtonTestId: 'cancel',
  continueButtonTestId: 'continue',
  errorMessageContainerTestId: 'error',
  firstNameInputTestId: 'firstName',
  lastNameInputTestId: 'lastName',
  postalCodeInputTestId: 'postalCode',

  // Checkout Step Two (Summary)
  cartItemContainerCSS: '.cart_item',
  cartListContainerCSS: '.cart_list',
  finishButtonTestId: 'finish',
  inventoryItemNameCSS: '.inventory_item_name',
  itemTotalLabelCSS: '.summary_subtotal_label',
  paymentInfoContainerTestId: 'payment-info-value',
  shippingInfoContainerTestId: 'shipping-info-value',
  summaryInfoContainerCSS: '.summary_info',
  taxLabelCSS: '.summary_tax_label',
  totalLabelCSS: '.summary_total_label',

  // Checkout Complete
  backHomeButtonTestId: 'back-to-products',
  completeHeaderCSS: '.complete-header',
  completeTextCSS: '.complete-text',
  ponyExpressImageCSS: '.pony_express',
};
