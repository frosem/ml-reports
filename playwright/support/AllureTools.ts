import { expect } from '@playwright/test';
import { attachment, ContentType, link, logStep, Status, step, testCaseId } from 'allure-js-commons';
import { BaseAllureTools, buildAssertionMessage } from '@shared/allure/BaseAllureTools';
export { allureStep } from '@shared/allure/AllureStepDecorator';

class AllureTools extends BaseAllureTools {
  protected async attachHtml(name: string, html: string): Promise<void> {
    await attachment(name, html, ContentType.HTML);
  }

  protected async addLink(id: string, name: string, type: string): Promise<void> {
    await link(id, name, type);
  }

  protected async addLogStep(message: string, status: Status): Promise<void> {
    await logStep(message, status);
  }

  protected async addTestCaseId(id: string): Promise<void> {
    await testCaseId(id);
  }
}

const allureTools = new AllureTools();

export const attachAssertion = allureTools.attachAssertion.bind(allureTools);
export const storyLink = allureTools.storyLink.bind(allureTools);
export const testLink = allureTools.testLink.bind(allureTools);

interface AllureExpectOptions {
  /** Label describing the value being asserted */
  label?: string;
  /** Error message shown on failure */
  errorMessage?: string;
}

/**
 * Wraps Playwright's expect with Allure step logging and simplified error messages.
 * @param actual - The locator, page, or value to assert on
 * @param message - Optional custom message for the step/error
 */
export function allureExpect<T>(actual: T, options?: AllureExpectOptions | string) {
  const opts: AllureExpectOptions = typeof options === 'string'
    ? { errorMessage: options }
    : options ?? {};
  return wrapExpect(expect(actual), actual, opts);
}

/**
 * Creates a proxy around Playwright's expect to intercept assertion calls.
 * Logs successful assertions as Allure steps and uses custom message only on failure.
 */
function wrapExpect<T extends object>(expectation: T, original: unknown, options: AllureExpectOptions): T {
  const createProxy = (target: object, methodPrefix: string): T =>
    new Proxy(target, {
      get(t, prop) {
        const value = t[prop as keyof typeof t];

        // Wrap assertion methods to add logging
        if (typeof value === 'function') {
          return async (...args: unknown[]) => {
            const methodName = `${methodPrefix}${String(prop)}`;
            const actualValue = await extractValueFromOriginal(original);
            try {
              const result = await (value as (...a: unknown[]) => Promise<void>).apply(t, args);
              // On step success: auto-generate step name
              await logAssertion(methodName, args, undefined, actualValue, options.label);
              return result;
            } catch {
              // On step failure: use custom message
              const failureMessage = options.errorMessage ?? buildAssertionMessage(Status.FAILED, methodName, actualValue, args, options.label);
              throw new Error(failureMessage);
            }
          };
        }

        // Recursively wrap chained properties like .not
        if (value !== null && typeof value === 'object') {
          return createProxy(value, prop === 'not' ? 'not ' : methodPrefix);
        }

        return value;
      },
    }) as T;

  return createProxy(expectation, '');
}

/**
 * Extracts displayable value from the assertion target.
 */
async function extractValueFromOriginal(original: unknown): Promise<string | null> {
  if (!original || typeof original !== 'object') {
    if (original !== null && original !== undefined) {
      return String(original);
    }
    return null;
  }

  // Playwright Page - return "page" as the subject
  if ('url' in original && 'goto' in original && typeof (original as { url: unknown }).url === 'function') {
    return 'page';
  }

  // Playwright Locator - try to get text content if element exists
  if ('count' in original && typeof (original as { count: unknown }).count === 'function') {
    try {
      const locator = original as {
        count: () => Promise<number>;
        first: () => { textContent: (options?: { timeout: number }) => Promise<string | null> };
        toString: () => string;
      };

      // count() returns immediately without waiting
      const count = await locator.count();
      if (count > 0) {
        // Element exists, try to get text content with minimal timeout
        const text = await locator.first().textContent();
        const trimmedText = text?.trim();
        if (trimmedText) {
          return `"${trimmedText}"`;
        }
      }
    } catch {
      return 'element';
    }

    // If the element does not have a visible text, then we return the locator's string representation
    const str = original.toString();
    if (str !== '' && str !== '[object Object]') {
      return str;
    }
    return 'element';
  }

  return null;
}

/**
 * Logs an assertion step in Allure.
 */
async function logAssertion(
  method: string,
  args: unknown[],
  message?: string,
  actualValue?: string | null,
  label?: string
): Promise<void> {
  const stepMessage = message ?? buildAssertionMessage(Status.PASSED, method, actualValue, args, label);
  await step(stepMessage, async () => {});
}

