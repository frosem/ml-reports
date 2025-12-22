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
 * Formats camelCase method name to readable format.
 * e.g., "toContainText" → "to contain text"
 * e.g., "not.toBeVisible" → "not to be visible"
 */
function formatAssertionMethod(method: string): string {
  return method
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .toLowerCase()
    .trim();
}

/**
 * Wraps value in single quotes, normalizing any existing quotes.
 */
function quoteValue(value: string): string {
  if (!value) return '';
  // Strip matching quote pairs (single or double) from start and end
  const stripped = value.replace(/^(["'])(.*)\1$/, '$2');
  return `'${stripped}'`;
}

/**
 * Builds an assertion message based on status.
 */
export function buildAssertionMessage(
  status: Status,
  method: string,
  actualValue: string | null,
  args: unknown[],
  label: string = ''
): string {
  const prefix = (status.charAt(0).toUpperCase() + status.slice(1)).trim();
  const actual = quoteValue(actualValue ?? 'element');
  const expected = quoteValue(args.length > 0 ? String(args[0]).trim() : '');
  const formattedMethod = formatAssertionMethod(method);
  const suffix = label ? ` ${label}` : '';
  return `${prefix} ${actual}${suffix} ${formattedMethod} ${expected}${suffix}`;
}

