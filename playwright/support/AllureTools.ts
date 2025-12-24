import { expect as playwrightExpect, test } from '@playwright/test';
import { attachment, ContentType, link, logStep, Status, step, testCaseId } from 'allure-js-commons';
import { type AssertionContext, BaseAllureTools, buildAssertionMessage } from '@shared/allure/BaseAllureTools';
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

export interface ExpectOptions {
  errorMessage?: string;
  label?: string;
  soft?: boolean;
}

/**
 * Wraps Playwright's expect with Allure step logging and simplified error messages.
 * @param actual - The locator, page, or value to assert on
 * @param options - Optional custom message for the step/error
 */
function expectFn<T>(actual: T, options?: ExpectOptions | string) {
  const opts: ExpectOptions = typeof options === 'string'
    ? { errorMessage: options }
    : options ?? {};
  return wrapExpect(playwrightExpect(actual), actual, opts);
}

// Copy all properties from Playwright's expect
for (const key of Object.keys(playwrightExpect) as Array<keyof typeof playwrightExpect>) {
  (expectFn as unknown as Record<string, unknown>)[key] = playwrightExpect[key];
}

// Override soft to wrap with Allure logging
expectFn.soft = <T>(actual: T, options?: ExpectOptions | string) => {
  const opts: ExpectOptions = typeof options === 'string'
    ? { errorMessage: options, soft: true }
    : { ...options, soft: true };
  return wrapExpect(playwrightExpect.soft(actual), actual, opts);
};

export const expect = expectFn as typeof playwrightExpect & {
  <T>(actual: T, options?: ExpectOptions | string): ReturnType<typeof playwrightExpect<T>>;
  soft: <T>(actual: T, options?: ExpectOptions | string) => ReturnType<typeof playwrightExpect<T>>;
};

/**
 * Gets the count of soft assertion errors from Playwright's test info.
 */
function getSoftErrorCount(): number {
  try {
    const info = test.info();
    return info.errors.length;
  } catch {
    return 0;
  }
}

/**
 * Creates a proxy around Playwright's expect to intercept assertion calls.
 * Logs successful assertions as Allure steps and uses custom message only on failure.
 */
function wrapExpect<T extends object>(expectation: T, original: unknown, options: ExpectOptions): T {
  const createProxy = (target: object, negated: boolean): T =>
    new Proxy(target, {
      get(t, prop) {
        const value = t[prop as keyof typeof t];

        // Only wrap assertion methods (start with 'to'), pass through asymmetric matchers
        const propName = String(prop);
        const isAssertion = typeof value === 'function' && propName.startsWith('to');

        if (isAssertion) {
          return async (...args: unknown[]) => {
            const actualValue = await extractValueFromOriginal(original);
            const errorCountBefore = getSoftErrorCount();

            const ctx: AssertionContext = {
              actual: actualValue,
              expected: args.length > 0 ? String(args[0]).trim() : undefined,
              label: options.label,
              method: propName,
              modifier: options.soft ? 'soft' : undefined,
              negated,
              status: Status.PASSED,
            };

            try {
              const result = await (value as (...a: unknown[]) => Promise<void>).apply(t, args);
              const errorCountAfter = getSoftErrorCount();

              if (errorCountAfter > errorCountBefore) {
                // Soft assertion failed (didn't throw but added error)
                const failureMessage = options.errorMessage ?? buildAssertionMessage({ ...ctx, status: Status.FAILED });
                await Promise.resolve(step(failureMessage, () => { throw new Error(failureMessage); })).catch(() => {});
                const errors = test.info().errors;
                if (errors.length > 0) {
                  errors[errors.length - 1].message = failureMessage;
                }
              } else {
                // Assertion passed
                await step(buildAssertionMessage(ctx), async () => {});
              }
              return result;
            } catch (error) {
              // Regular assertion failed (threw error)
              const failureMessage = options.errorMessage ?? buildAssertionMessage({ ...ctx, status: Status.FAILED });
              await Promise.resolve(step(failureMessage, () => { throw new Error(failureMessage); })).catch(() => {});
              if (error instanceof Error) {
                error.message = failureMessage;
              }
              throw error;
            }
          };
        }

        // Recursively wrap chained properties like .not
        if (value !== null && typeof value === 'object') {
          return createProxy(value, prop === 'not');
        }

        return value;
      },
    }) as T;

  return createProxy(expectation, false);
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

