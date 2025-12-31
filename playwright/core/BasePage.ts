/**
 * Base Page Actions
 * Provides common utility methods for all page actions.
 */
import { type Locator, type Page, type Response } from '@playwright/test';
import { Assertions } from '@playwright-core/Assertions';
import { Waits } from '@playwright-core/Waits';

export interface ClickOptions {
  button?: 'left' | 'middle' | 'right';
  clickCount?: number;
  delay?: number;
  force?: boolean;
  noWaitAfter?: boolean;
  timeout?: number;
}

export interface FillOptions {
  force?: boolean;
  noWaitAfter?: boolean;
  timeout?: number;
}

export interface NavigationOptions {
  timeout?: number;
  waitUntil?: 'commit' | 'domcontentloaded' | 'load' | 'networkidle';
}

export interface ScreenshotOptions {
  fullPage?: boolean;
  path?: string;
  quality?: number;
  type?: 'jpeg' | 'png';
}

export abstract class BasePage {
  readonly page: Page;
  protected readonly assert: Assertions;
  protected readonly wait: Waits;

  constructor(page: Page) {
    this.page = page;
    this.assert = new Assertions(page);
    this.wait = new Waits(page);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Navigation Methods
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Navigate to a URL
   * @param url - The URL to navigate to
   * @param options - Navigation options
   */
  protected async navigateTo(url: string, options?: NavigationOptions): Promise<Response | null> {
    return await this.page.goto(url, options);
  }

  /**
   * Reload the current page
   * @param options - Navigation options
   */
  protected async reloadPage(options?: NavigationOptions): Promise<Response | null> {
    return await this.page.reload(options);
  }

  /**
   * Go back in browser history
   * @param options - Navigation options
   */
  protected async goBack(options?: NavigationOptions): Promise<Response | null> {
    return await this.page.goBack(options);
  }

  /**
   * Go forward in browser history
   * @param options - Navigation options
   */
  protected async goForward(options?: NavigationOptions): Promise<Response | null> {
    return await this.page.goForward(options);
  }

  /**
   * Get the current page URL
   */
  protected getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Get the current page title
   */
  protected async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Element Interaction Methods
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Click on an element
   * @param locator - The locator
   * @param options - Click options
   */
  protected async click(locator: Locator, options?: ClickOptions): Promise<void> {
    await locator.click(options);
  }

  /**
   * Double-click on an element
   * @param locator - The locator
   * @param options - Click options
   */
  protected async doubleClick(locator: Locator, options?: ClickOptions): Promise<void> {
    await locator.dblclick(options);
  }

  /**
   * Right-click on an element
   * @param locator - The locator
   * @param options - Click options
   */
  protected async rightClick(locator: Locator, options?: Omit<ClickOptions, 'button'>): Promise<void> {
    await locator.click({ ...options, button: 'right' });
  }

  /**
   * Fill an input field (clears existing content first)
   * @param locator - The locator
   * @param value - The value to fill
   * @param options - Fill options
   */
  protected async fill(locator: Locator, value: string, options?: FillOptions): Promise<void> {
    await locator.fill(value, options);
  }

  /**
   * Type text into an element (simulates real keystrokes)
   * @param locator - The locator
   * @param text - The text to type
   * @param options - Type options
   */
  protected async type(
    locator: Locator,
    text: string,
    options?: { delay?: number; noWaitAfter?: boolean; timeout?: number }
  ): Promise<void> {
    await locator.pressSequentially(text, options);
  }

  /**
   * Clear an input field
   * @param locator - The locator
   */
  protected async clear(
    locator: Locator,
    options?: { force?: boolean; noWaitAfter?: boolean; timeout?: number; }
  ): Promise<void> {
    await locator.clear(options);
  }

  /**
   * Press a keyboard key
   * @param key - The key to press (e.g., 'Enter', 'Tab', 'Escape')
   */
  protected async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  /**
   * Hover over an element
   * @param locator - The locator
   * @param options - Hover options
   */
  protected async hover(
    locator: Locator,
    options?: { force?: boolean; timeout?: number }
  ): Promise<void> {
    await locator.hover(options);
  }

  /**
   * Focus on an element
   * @param locator - The locator
   */
  protected async focus(locator: Locator): Promise<void> {
    await locator.focus();
  }

  /**
   * Blur (unfocus) the currently focused element
   */
  protected async blur(): Promise<void> {
    await this.page.evaluate(() => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Form Interaction Methods
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Select options from a dropdown by value
   * @param locator - The locator for the select element
   * @param values - The values to select
   */
  protected async selectByValue(locator: Locator, ...values: string[]): Promise<string[]> {
    return await locator.selectOption(values);
  }

  /**
   * Select options from a dropdown by label (visible text)
   * @param locator - The locator for the select element
   * @param labels - The labels to select
   */
  protected async selectByLabel(locator: Locator, ...labels: string[]): Promise<string[]> {
    return await locator.selectOption(labels.map(label => ({ label })));
  }

  /**
   * Select options from a dropdown by index
   * @param locator - The locator for the select element
   * @param indices - The indices to select
   */
  protected async selectByIndex(locator: Locator, ...indices: number[]): Promise<string[]> {
    return await locator.selectOption(indices.map(index => ({ index })));
  }

  /**
   * Check a checkbox or radio button
   * @param locator - The locator
   * @param options - Check options
   */
  protected async check(
    locator: Locator,
    options?: { force?: boolean; timeout?: number }
  ): Promise<void> {
    await locator.check(options);
  }

  /**
   * Uncheck a checkbox
   * @param locator - The locator
   * @param options - Uncheck options
   */
  protected async uncheck(
    locator: Locator,
    options?: { force?: boolean; timeout?: number }
  ): Promise<void> {
    await locator.uncheck(options);
  }

  /**
   * Set the checked state of a checkbox or radio button
   * @param locator - The locator
   * @param checked - Whether to check or uncheck
   * @param options - Options
   */
  protected async setChecked(
    locator: Locator,
    checked: boolean,
    options?: { force?: boolean; timeout?: number }
  ): Promise<void> {
    await locator.setChecked(checked, options);
  }

  /**
   * Upload files to an input element
   * @param locator - The locator for the file input
   * @param files - Path(s) to the file(s) to upload
   */
  protected async uploadFiles(locator: Locator, files: string | string[]): Promise<void> {
    await locator.setInputFiles(files);
  }

  /**
   * Clear uploaded files from an input element
   * @param locator - The locator for the file input
   */
  protected async clearUploadedFiles(locator: Locator): Promise<void> {
    await locator.setInputFiles([]);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Element State Methods
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Check if an element is visible
   * @param locator - The locator
   */
  protected async isVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }

  /**
   * Check if an element is hidden
   * @param locator - The locator
   */
  protected async isHidden(locator: Locator): Promise<boolean> {
    return await locator.isHidden();
  }

  /**
   * Check if an element is enabled
   * @param locator - The locator
   */
  protected async isEnabled(locator: Locator): Promise<boolean> {
    return await locator.isEnabled();
  }

  /**
   * Check if an element is disabled
   * @param locator - The locator
   */
  protected async isDisabled(locator: Locator): Promise<boolean> {
    return await locator.isDisabled();
  }

  /**
   * Check if a checkbox or radio is checked
   * @param locator - The locator
   */
  protected async isChecked(locator: Locator): Promise<boolean> {
    return await locator.isChecked();
  }

  /**
   * Check if an element is editable
   * @param locator - The locator
   */
  protected async isEditable(locator: Locator): Promise<boolean> {
    return await locator.isEditable();
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Element Content Methods
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Get the text content of an element
   * @param locator - The locator
   */
  protected async getText(locator: Locator): Promise<string> {
    const text = await locator.textContent();
    return (text ?? '').trim();
  }

  /**
   * Get the inner text of an element (only visible text)
   * @param locator - The locator
   */
  protected async getInnerText(locator: Locator): Promise<string> {
    const text = await locator.innerText();
    return text.trim();
  }

  /**
   * Get all text contents from matched elements
   * @param locator - The locator
   */
  protected async getAllTexts(locator: Locator): Promise<string[]> {
    const texts = await locator.allTextContents();
    return texts.map(t => t.trim());
  }

  /**
   * Get the inner HTML of an element
   * @param locator - The locator
   */
  protected async getInnerHTML(locator: Locator): Promise<string> {
    return await locator.innerHTML();
  }

  /**
   * Get the value of an input element
   * @param locator - The locator
   */
  protected async getInputValue(locator: Locator): Promise<string> {
    return await locator.inputValue();
  }

  /**
   * Get an attribute value from an element
   * @param locator - The locator
   * @param name - The attribute name
   */
  protected async getAttribute(locator: Locator, name: string): Promise<null | string> {
    return await locator.getAttribute(name);
  }

  /**
   * Get multiple attribute values from an element
   * @param locator - The locator
   * @param names - The attribute names
   */
  protected async getAttributes(locator: Locator, names: string[]): Promise<Record<string, null | string>> {
    const result: Record<string, null | string> = {};
    for (const name of names.sort()) {
      result[name] = await locator.getAttribute(name);
    }
    return result;
  }

  /**
   * Get the count of matched elements
   * @param locator - The locator
   */
  protected async getCount(locator: Locator): Promise<number> {
    return await locator.count();
  }

  /**
   * Get the bounding box of an element
   * @param locator - The locator
   */
  protected async getBoundingBox(
    locator: Locator
  ): Promise<null | { height: number; width: number; x: number; y: number }> {
    return await locator.boundingBox();
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Scroll Methods
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Scroll an element into view
   * @param locator - The locator
   * @param options - Scroll options
   */
  protected async scrollIntoView(locator: Locator, options?: ScrollIntoViewOptions): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
    if (options) {
      await locator.evaluate((el, opts) => {
        el.scrollIntoView(opts);
      }, options);
    }
  }

  /**
   * Scroll to the top of the page
   */
  protected async scrollToTop(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  /**
   * Scroll to the bottom of the page
   */
  protected async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  /**
   * Scroll by a specific amount
   * @param x - Horizontal scroll amount in pixels
   * @param y - Vertical scroll amount in pixels
   */
  protected async scrollBy(x: number, y: number): Promise<void> {
    await this.page.evaluate(([deltaX, deltaY]) => window.scrollBy(deltaX, deltaY), [x, y] as const);
  }

  /**
   * Scroll to a specific position
   * @param x - X coordinate
   * @param y - Y coordinate
   */
  protected async scrollTo(x: number, y: number): Promise<void> {
    await this.page.evaluate(([posX, posY]) => window.scrollTo(posX, posY), [x, y] as const);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Dialog Handling Methods
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Accept the next dialog that appears
   * @param promptText - Optional text to enter in a prompt dialog
   */
  protected async acceptDialog(promptText?: string): Promise<void> {
    this.page.once('dialog', async dialog => {
      await dialog.accept(promptText);
    });
  }

  /**
   * Dismiss the next dialog that appears
   */
  protected async dismissDialog(): Promise<void> {
    this.page.once('dialog', async dialog => {
      await dialog.dismiss();
    });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Frame Methods
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Get a frame by name or URL
   * @param nameOrUrl - Frame name or URL pattern
   */
  protected getFrame(nameOrUrl: RegExp | string) {
    if (typeof nameOrUrl === 'string') {
      return this.page.frame(nameOrUrl);
    }
    return this.page.frame({ url: nameOrUrl });
  }

  /**
   * Get all frames on the page
   */
  protected getFrames() {
    return this.page.frames();
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Screenshot Methods
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Take a screenshot of the page
   * @param options - Screenshot options
   */
  protected async takeScreenshot(options?: ScreenshotOptions): Promise<Buffer> {
    return await this.page.screenshot(options);
  }

  /**
   * Take a screenshot of a specific element
   * @param locator - The locator
   * @param options - Screenshot options
   */
  protected async takeElementScreenshot(
    locator: Locator,
    options?: Omit<ScreenshotOptions, 'fullPage'>
  ): Promise<Buffer> {
    return await locator.screenshot(options);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Storage Methods
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Get a value from local storage
   * @param key - The storage key
   */
  protected async getLocalStorageItem(key: string): Promise<null | string> {
    return await this.page.evaluate((k) => localStorage.getItem(k), key);
  }

  /**
   * Set a value in local storage
   * @param key - The storage key
   * @param value - The value to set
   */
  protected async setLocalStorageItem(key: string, value: string): Promise<void> {
    await this.page.evaluate(([k, v]) => localStorage.setItem(k, v), [key, value] as const);
  }

  /**
   * Remove an item from local storage
   * @param key - The storage key
   */
  protected async removeLocalStorageItem(key: string): Promise<void> {
    await this.page.evaluate((k) => localStorage.removeItem(k), key);
  }

  /**
   * Clear all local storage
   */
  protected async clearLocalStorage(): Promise<void> {
    await this.page.evaluate(() => localStorage.clear());
  }

  /**
   * Get a value from session storage
   * @param key - The storage key
   */
  protected async getSessionStorageItem(key: string): Promise<null | string> {
    return await this.page.evaluate((k) => sessionStorage.getItem(k), key);
  }

  /**
   * Set a value in session storage
   * @param key - The storage key
   * @param value - The value to set
   */
  protected async setSessionStorageItem(key: string, value: string): Promise<void> {
    await this.page.evaluate(([k, v]) => sessionStorage.setItem(k, v), [key, value] as const);
  }

  /**
   * Clear all session storage
   */
  protected async clearSessionStorage(): Promise<void> {
    await this.page.evaluate(() => sessionStorage.clear());
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Cookie Methods
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Get all cookies for the current page
   */
  protected async getCookies() {
    return await this.page.context().cookies();
  }

  /**
   * Get a specific cookie by name
   * @param name - The cookie name
   */
  protected async getCookie(name: string) {
    const cookies = await this.getCookies();
    return cookies.find(cookie => cookie.name === name);
  }

  /**
   * Clear all cookies
   */
  protected async clearCookies(): Promise<void> {
    await this.page.context().clearCookies();
  }
}
