/**
 * Wait Helpers
 */
import { type Locator, type Page, type Response } from '@playwright/test';

export interface FilterOptions {
  has?: Locator;
  hasNot?: Locator;
  hasNotText?: RegExp | string;
  hasText?: RegExp | string;
  visible?: boolean;
}

export class WaitHelpers {
  constructor(private readonly page: Page) {}

  /**
   * Wait for an element to reach a specific state
   * @param locator - The locator
   * @param options - Wait options
   */
  async forElement(
    locator: Locator,
    options?: { state?: 'attached' | 'detached' | 'hidden' | 'visible'; timeout?: number }
  ): Promise<void> {
    await locator.waitFor(options);
  }

  /**
   * Wait for element to be visible
   * @param locator - The locator
   * @param timeout - Optional timeout in milliseconds
   */
  async forVisible(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for element to be hidden
   * @param locator - The locator
   * @param timeout - Optional timeout in milliseconds
   */
  async forHidden(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Wait for element to be attached to DOM
   * @param locator - The locator
   * @param timeout - Optional timeout in milliseconds
   */
  async forAttached(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ state: 'attached', timeout });
  }

  /**
   * Wait for element to be detached from DOM
   * @param locator - The locator
   * @param timeout - Optional timeout in milliseconds
   */
  async forDetached(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ state: 'detached', timeout });
  }

  /**
   * Wait for the page to reach a specific load state
   * @param state - The load state to wait for
   * @param options - Optional timeout
   */
  async forLoadState(
    state?: 'domcontentloaded' | 'load' | 'networkidle',
    options?: { timeout?: number }
  ): Promise<void> {
    await this.page.waitForLoadState(state, options);
  }

  /**
   * Wait for URL to match a pattern
   * @param url - URL pattern (string, RegExp, or predicate function)
   * @param options - Optional timeout
   */
  async forUrl(
    url: RegExp | string | ((url: URL) => boolean),
    options?: { timeout?: number, waitUntil?: "load" | "domcontentloaded" | "networkidle" | "commit"; }
  ): Promise<void> {
    await this.page.waitForURL(url, options);
  }

  /**
   * Wait for a fixed amount of time.
   * @param seconds - Time to wait in seconds
   * @deprecated Avoid hardcoded waits. Use explicit waits like forVisible() or forUrl().
   * If you must use this, add `// eslint-disable-next-line deprecation/deprecation` above the call.
   */
  async forTimeout(seconds: number): Promise<void> {
    await this.page.waitForTimeout(seconds * 1000);
  }

  /**
   * Wait for a network response matching a URL pattern
   * @param urlOrPredicate - URL pattern or predicate function
   * @param options - Optional timeout
   */
  async forResponse(
    urlOrPredicate: RegExp | string | ((response: Response) => boolean | Promise<boolean>),
    options?: { timeout?: number }
  ): Promise<Response> {
    return await this.page.waitForResponse(urlOrPredicate, options);
  }

  /**
   * Wait for a network request matching a URL pattern
   * @param urlOrPredicate - URL pattern or predicate function
   * @param options - Optional timeout
   */
  async forRequest(
    urlOrPredicate: RegExp | string | ((request: { url: () => string }) => boolean | Promise<boolean>),
    options?: { timeout?: number }
  ) {
    return await this.page.waitForRequest(urlOrPredicate, options);
  }

  /**
   * Wait for a filtered element to be visible
   * @param locator - The locator
   * @param filter - Filter options
   * @param timeout - Optional timeout in milliseconds
   */
  async forFiltered(locator: Locator, filter: FilterOptions, timeout?: number): Promise<void> {
    await locator.filter(filter).waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for element with specific text to be visible
   * @param locator - The locator
   * @param text - Expected text (string or RegExp)
   * @param timeout - Optional timeout in milliseconds
   */
  async forHasText(locator: Locator, text: RegExp | string, timeout?: number): Promise<void> {
    await locator.filter({ hasText: text }).waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for element without specific text to be visible
   * @param locator - The locator
   * @param text - Text that should not be present (string or RegExp)
   * @param timeout - Optional timeout in milliseconds
   */
  async forHasNotText(locator: Locator, text: RegExp | string, timeout?: number): Promise<void> {
    await locator.filter({ hasNotText: text }).waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for element containing another locator to be visible
   * @param locator - The locator
   * @param has - Locator that should be contained
   * @param timeout - Optional timeout in milliseconds
   */
  async forHas(locator: Locator, has: Locator, timeout?: number): Promise<void> {
    await locator.filter({ has }).waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for element not containing another locator to be visible
   * @param locator - The locator
   * @param hasNot - Locator that should not be contained
   * @param timeout - Optional timeout in milliseconds
   */
  async forHasNot(locator: Locator, hasNot: Locator, timeout?: number): Promise<void> {
    await locator.filter({ hasNot }).waitFor({ state: 'visible', timeout });
  }

}

