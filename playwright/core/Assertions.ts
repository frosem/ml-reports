/**
 * Assertions
 */
import { type Locator, type Page } from '@playwright/test';
import { attachAssertion, expect, type ExpectOptions } from '@playwright-support/AllureTools';

export type AriaRole = Parameters<Page['getByRole']>[0];

export class Assertions {
  constructor(private readonly page: Page) {}

  /**
   * Attach assertion details as HTML to Allure report
   * @param expected - The expected value
   * @param actual - The actual value
   */
  async attach(expected: string, actual: string): Promise<void> {
    await attachAssertion(expected, actual);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Page Assertions
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Assert that the current URL matches the expected URL
   * @param expectedUrl - The expected URL (string or RegExp)
   * @param options - Assertion options
   */
  async url(expectedUrl: RegExp | string, options?: ExpectOptions | string): Promise<void> {
    await expect(this.page, options).toHaveURL(expectedUrl);
  }

  /**
   * Assert that the page title matches the expected title
   * @param expectedTitle - The expected title (string or RegExp)
   * @param options - Assertion options
   */
  async title(expectedTitle: RegExp | string, options?: ExpectOptions | string): Promise<void> {
    await expect(this.page, options).toHaveTitle(expectedTitle);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Visibility Assertions
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Assert that an element is visible
   * @param locator - The locator
   * @param options - Assertion options
   */
  async visible(locator: Locator, options?: ExpectOptions | string): Promise<void> {
    await expect(locator, options).toBeVisible();
  }

  /**
   * Assert that an element is hidden
   * @param locator - The locator
   * @param options - Assertion options
   */
  async hidden(locator: Locator, options?: ExpectOptions | string): Promise<void> {
    await expect(locator, options).toBeHidden();
  }

  /**
   * Assert that an element is attached to the DOM
   * @param locator - The locator
   * @param options - Assertion options
   */
  async attached(locator: Locator, options?: ExpectOptions | string): Promise<void> {
    await expect(locator, options).toBeAttached();
  }

  /**
   * Assert that an element is not attached to the DOM
   * @param locator - The locator
   * @param options - Assertion options
   */
  async detached(locator: Locator, options?: ExpectOptions | string): Promise<void> {
    await expect(locator, options).not.toBeAttached();
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Text Assertions
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Assert that an element contains specific text
   * @param locator - The locator
   * @param text - The expected text
   * @param options - Assertion options
   */
  async containsText(
    locator: Locator,
    text: RegExp | string,
    options?: ExpectOptions | string
  ): Promise<void> {
    await expect(locator, options).toContainText(text);
  }

  /**
   * Assert that an element has specific text (exact match)
   * @param locator - The locator
   * @param text - The expected text
   * @param options - Assertion options
   */
  async hasText(
    locator: Locator,
    text: RegExp | string | string[],
    options?: ExpectOptions | string
  ): Promise<void> {
    await expect(locator, options).toHaveText(text);
  }

  /**
   * Assert that an element does not contain specific text
   * @param locator - The locator
   * @param text - The text that should not be present
   * @param options - Assertion options
   */
  async notContainsText(
    locator: Locator,
    text: RegExp | string,
    options?: ExpectOptions | string
  ): Promise<void> {
    await expect(locator, options).not.toContainText(text);
  }

  /**
   * Assert that an element is empty (no text content)
   * @param locator - The locator
   * @param options - Assertion options
   */
  async empty(locator: Locator, options?: ExpectOptions | string): Promise<void> {
    await expect(locator, options).toBeEmpty();
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Attribute Assertions
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Assert that an element has a specific attribute value
   * @param locator - The locator
   * @param name - The attribute name
   * @param value - The expected attribute value
   * @param options - Assertion options
   */
  async hasAttribute(
    locator: Locator,
    name: string,
    value: RegExp | string,
    options?: ExpectOptions | string
  ): Promise<void> {
    await expect(locator, options).toHaveAttribute(name, value);
  }

  /**
   * Assert that an element has a specific CSS class
   * @param locator - The locator
   * @param className - The expected class name(s)
   * @param options - Assertion options
   */
  async hasClass(
    locator: Locator,
    className: RegExp | string | string[],
    options?: ExpectOptions | string
  ): Promise<void> {
    await expect(locator, options).toHaveClass(className);
  }

  /**
   * Assert that an element has a specific CSS property value
   * @param locator - The locator
   * @param name - The CSS property name
   * @param value - The expected CSS value
   * @param options - Assertion options
   */
  async hasCss(
    locator: Locator,
    name: string,
    value: RegExp | string,
    options?: ExpectOptions | string
  ): Promise<void> {
    await expect(locator, options).toHaveCSS(name, value);
  }

  /**
   * Assert that an element has a specific id
   * @param locator - The locator
   * @param id - The expected id
   * @param options - Assertion options
   */
  async hasId(
    locator: Locator,
    id: RegExp | string,
    options?: ExpectOptions | string
  ): Promise<void> {
    await expect(locator, options).toHaveId(id);
  }

  /**
   * Assert that an element has a specific accessible name
   * @param locator - The locator
   * @param name - The expected accessible name
   * @param options - Assertion options
   */
  async hasAccessibleName(
    locator: Locator,
    name: RegExp | string,
    options?: ExpectOptions | string
  ): Promise<void> {
    await expect(locator, options).toHaveAccessibleName(name);
  }

  /**
   * Assert that an element has a specific accessible description
   * @param locator - The locator
   * @param description - The expected accessible description
   * @param options - Assertion options
   */
  async hasAccessibleDescription(
    locator: Locator,
    description: RegExp | string,
    options?: ExpectOptions | string
  ): Promise<void> {
    await expect(locator, options).toHaveAccessibleDescription(description);
  }

  /**
   * Assert that an element has a specific role
   * @param locator - The locator
   * @param role - The expected ARIA role
   * @param options - Assertion options
   */
  async hasRole(
    locator: Locator,
    role: AriaRole,
    options?: ExpectOptions | string
  ): Promise<void> {
    await expect(locator, options).toHaveRole(role);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Count Assertions
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Assert that an element count matches expected
   * @param locator - The locator
   * @param count - The expected count
   * @param options - Assertion options
   */
  async count(
    locator: Locator,
    count: number,
    options?: ExpectOptions | string
  ): Promise<void> {
    await expect(locator, options).toHaveCount(count);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Form Element Assertions
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Assert that an input has a specific value
   * @param locator - The locator
   * @param value - The expected value
   * @param options - Assertion options
   */
  async inputValue(
    locator: Locator,
    value: RegExp | string,
    options?: ExpectOptions | string
  ): Promise<void> {
    await expect(locator, options).toHaveValue(value);
  }

  /**
   * Assert that a multi-select has specific values
   * @param locator - The locator
   * @param values - The expected values
   * @param options - Assertion options
   */
  async inputValues(
    locator: Locator,
    values: (RegExp | string)[],
    options?: ExpectOptions | string
  ): Promise<void> {
    await expect(locator, options).toHaveValues(values);
  }

  /**
   * Assert that an element is enabled
   * @param locator - The locator
   * @param options - Assertion options
   */
  async enabled(locator: Locator, options?: ExpectOptions | string): Promise<void> {
    await expect(locator, options).toBeEnabled();
  }

  /**
   * Assert that an element is disabled
   * @param locator - The locator
   * @param options - Assertion options
   */
  async disabled(locator: Locator, options?: ExpectOptions | string): Promise<void> {
    await expect(locator, options).toBeDisabled();
  }

  /**
   * Assert that an element is editable
   * @param locator - The locator
   * @param options - Assertion options
   */
  async editable(locator: Locator, options?: ExpectOptions | string): Promise<void> {
    await expect(locator, options).toBeEditable();
  }

  /**
   * Assert that an element is not editable
   * @param locator - The locator
   * @param options - Assertion options
   */
  async notEditable(locator: Locator, options?: ExpectOptions | string): Promise<void> {
    await expect(locator, options).not.toBeEditable();
  }

  /**
   * Assert that a checkbox/radio is checked
   * @param locator - The locator
   * @param options - Assertion options
   */
  async checked(locator: Locator, options?: ExpectOptions | string): Promise<void> {
    await expect(locator, options).toBeChecked();
  }

  /**
   * Assert that a checkbox/radio is not checked
   * @param locator - The locator
   * @param options - Assertion options
   */
  async notChecked(locator: Locator, options?: ExpectOptions | string): Promise<void> {
    await expect(locator, options).not.toBeChecked();
  }

  /**
   * Assert that an element is focused
   * @param locator - The locator
   * @param options - Assertion options
   */
  async focused(locator: Locator, options?: ExpectOptions | string): Promise<void> {
    await expect(locator, options).toBeFocused();
  }

  /**
   * Assert that an element is not focused
   * @param locator - The locator
   * @param options - Assertion options
   */
  async notFocused(locator: Locator, options?: ExpectOptions | string): Promise<void> {
    await expect(locator, options).not.toBeFocused();
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Visual Assertions
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Assert that an element matches a screenshot
   * @param locator - The locator
   * @param name - The snapshot name
   * @param options - Assertion options
   */
  async matchesScreenshot(
    locator: Locator,
    name?: string | string[],
    options?: ExpectOptions | string
  ): Promise<void> {
    await expect(locator, options).toHaveScreenshot(name);
  }

  /**
   * Assert that the page matches a screenshot
   * @param name - The snapshot name
   * @param options - Assertion options
   */
  async pageMatchesScreenshot(
    name?: string | string[],
    options?: ExpectOptions | string
  ): Promise<void> {
    await expect(this.page, options).toHaveScreenshot(name);
  }
}

