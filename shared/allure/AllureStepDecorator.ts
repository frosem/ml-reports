/**
 * Allure Step Decorator
 *
 * Provides the @allureStep decorator for wrapping methods as stepswith Allure reports.
 */
import { step } from 'allure-js-commons';

/**
 * Converts camelCase method name to readable format.
 * e.g., "formatMethodName" → "Format Method Name"
 */
function formatMethodName(name: string): string {
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

/**
 * Interpolates {0}, {1}, {n} placeholders with argument values.
 */
function interpolateStepName(template: string, args: unknown[]): string {
  return template.replace(/\{(\d+)\}/g, (match, key) => {
    const index = parseInt(key, 10);
    if (!isNaN(index) && index < args.length) {
      return String(args[index]);
    }
    return match;
  });
}

/**
 * Checks if template starts with a placeholder like {0}, {1}, etc.
 */
function startsWithPlaceholder(template: string): boolean {
  return /^\{\d+\}/.test(template);
}

/**
 * Step function type compatible with Allure's step signature
 */
export type StepFunction = <T>(name: string, body: (...args: unknown[]) => T | PromiseLike<T>) => T | PromiseLike<T>;

/**
 * Creates an allureStep decorator for a specific step implementation.
 *
 * @param stepFunction - The framework-specific step function
 * @returns A decorator factory function
 */
export function allureDecorator(stepFunction: StepFunction) {
  /**
   * Decorator for wrapping methods with Allure steps.
   *
   * @param stepName - Optional step name template with `{n}` placeholders
   *
   * **Examples:**
   *
   * ```ts
   * // No args - uses formatted method name
   * // Output: "Visit Page"
   * ＠allureStep()
   * function visitPage() { ... }
   *
   * // Placeholder only - prepends method name
   * // Output: "Enter Input: hello"
   * ＠allureStep('{0}')
   * function enterInput(value: string) { ... }
   *
   * // Custom template
   * // Output: "Login as: admin"
   * ＠allureStep('Login as: {0}')
   * function login(username: string) { ... }
   * ```
   */
  return function allureStep(stepName?: string) {
    return function <T extends (...args: never[]) => unknown>(
      originalMethod: T,
      context: ClassMethodDecoratorContext
    ): T {
      const methodName = String(context.name);

      return function (this: unknown, ...args: Parameters<T>): ReturnType<T> {
        let name: string;

        // If no args provided, always use formatted method name
        if (args.length === 0 || !stepName) {
          name = formatMethodName(methodName);
        } else {
          const interpolated = interpolateStepName(stepName, args);
          // If template starts with placeholder, prepend method name
          name = startsWithPlaceholder(stepName)
            ? `${formatMethodName(methodName)}: ${interpolated}`
            : interpolated;
        }

        return stepFunction(name, () => {
          return originalMethod.apply(this, args);
        }) as ReturnType<T>;
      } as T;
    };
  };
}

export const allureStep = allureDecorator(step);

