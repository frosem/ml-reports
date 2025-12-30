import { Status } from 'allure-js-commons';

/**
 * Base class for Allure tools shared between Cypress and Playwright.
 */
export abstract class BaseAllureTools {
  protected abstract attachHtml(name: string, html: string): void | Promise<void>;
  protected abstract addLink(id: string, name: string, type: string): void | Promise<void>;
  protected abstract addLogStep(message: string, status: Status): void | Promise<void>;
  protected abstract addTestCaseId(id: string): void | Promise<void>;

  /**
   * Log assertion with expected and actual values
   */
  async attachAssertion(expected: string, actual: string): Promise<void> {
    await this.attachHtml('Assertion Details', this.generateAssertionHtml(expected, actual));
  }

  /**
   * Add a Jira story link
   */
  async storyLink(storyId: string): Promise<void> {
    await this.addLink(storyId, `Story ${storyId}`, 'story');
  }

  /**
   * Add a TMS link and test case ID for tracking
   */
  async testLink(testId: string): Promise<void> {
    await this.addTestCaseId(testId);
    await this.addLink(testId, `Test Case ${testId}`, 'tms');
  }

  protected generateAssertionHtml(expected: string, actual: string): string {
    const isMatch = expected === actual;
    const expectedColor = '#97cc64';
    const actualColor = isMatch ? expectedColor : '#fd5a3e';
    const statusText = (isMatch ? Status.PASSED : 'Mismatch').toUpperCase();

    const badgeStyle = 'margin-top: 10px; padding: 5px 10px; color: white; border-radius: 4px; display: inline-block; font-weight: bold;';
    const circleStyle = 'display: inline-block; width: 12px; height: 12px; border-radius: 50%; margin-right: 8px;';

    return [
      '<div style="font-family: monospace; padding: 10px;">',
      '  <div style="margin-bottom: 8px; display: flex; align-items: center;">',
      `    <span style="${circleStyle} background: ${expectedColor};"></span>`,
      `    <b style="color: ${expectedColor};">[Expected]:</b>&nbsp;${expected}`,
      '  </div>',
      '  <div style="margin-bottom: 8px; display: flex; align-items: center;">',
      `    <span style="${circleStyle} background: ${actualColor};"></span>`,
      `    <b style="color: ${actualColor};">[Actual]:</b>&nbsp;${actual}`,
      '  </div>',
      `  <div style="${badgeStyle} background: ${actualColor};">`,
      `    ${statusText}`,
      '  </div>',
      '</div>',
    ].join('\n');
  }
}

/**
 * All the pieces needed to build a human readable assertion message.
 *
 * @example
 * {
 *   actual: 'Add to cart',
 *   expected: 'Remove',
 *   method: 'toContainText',
 *   modifier: 'soft',
 *   negated: true,
 *   status: Status.FAILED
 * }
 * // Produces: "Failed soft 'Add to cart' to not contain text 'Remove'"
 */
export interface AssertionContext {
  actual: string | null;
  expected?: string;
  label?: string;
  method: string;
  modifier?: string;
  negated?: boolean;
  status: Status;
}

/**
 * Creates a readable message from assertion context.
 *
 * @example
 * buildAssertionMessage({ status: Status.PASSED, method: 'toBeVisible', actual: 'Login' })
 * // Returns: "Passed 'Login' to be visible"
 *
 * buildAssertionMessage({ status: Status.FAILED, method: 'toContainText', actual: 'Hello', expected: 'World', modifier: 'soft' })
 * // Returns: "Failed soft 'Hello' to contain text 'World'"
 */
export function buildAssertionMessage(ctx: AssertionContext): string {
  const status = ctx.status.charAt(0).toUpperCase() + ctx.status.slice(1);
  const actual = quoteValue(ctx.actual ?? 'element');
  const method = formatMethod(ctx.method, ctx.negated);
  const expected = ctx.expected ? quoteValue(ctx.expected) : '';
  const expectedLabel = expected && ctx.label ? ctx.label : '';
  return [status, ctx.modifier, actual, ctx.label, method, expected, expectedLabel].filter(Boolean).join(' ');
}

/**
 * Turns method names like "toContainText" into "to contain text".
 * When negated, produces "to not contain text" instead of "not to contain text".
 *
 * @example
 * formatMethod('toBeVisible')           // "to be visible"
 * formatMethod('toContainText', true)   // "to not contain text"
 * formatMethod('toHaveCount', false)    // "to have count"
 */
function formatMethod(method: string, negated?: boolean): string {
  const formatted = method
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .toLowerCase()
    .trim();
  return negated ? formatted.replace(/^to /, 'to not ') : formatted;
}

/**
 * Wraps a value in single quotes for display.
 * Removes existing quotes to avoid double quoting.
 *
 * @example
 * quoteValue('hello')    // "'hello'"
 * quoteValue('"hello"')  // "'hello'"
 */
function quoteValue(value: string): string {
  if (!value) return '';
  return `'${value.replace(/^(["'])(.*)\1$/, '$2')}'`;
}

