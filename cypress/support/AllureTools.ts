import { attachment, link, step, testCaseId } from 'allure-cypress';
import { ContentType, logStep, Status, tag } from 'allure-js-commons';
import { BaseAllureTools } from '@shared/allure/BaseAllureTools';
import { allureDecorator } from '@shared/allure/AllureStepDecorator';

class AllureTools extends BaseAllureTools {
  protected attachHtml(name: string, html: string): void {
    attachment(name, html, ContentType.HTML);
  }

  protected addLink(id: string, name: string, type: string): void {
    link(id, name, type);
  }

  protected addLogStep(message: string, status: Status): void {
    logStep(message, status);
  }

  protected addTestCaseId(id: string): void {
    testCaseId(id);
  }
}

const allureTools = new AllureTools();

export const attachAssertion = allureTools.attachAssertion.bind(allureTools);
export const storyLink = allureTools.storyLink.bind(allureTools);
export const testLink = allureTools.testLink.bind(allureTools);
export const allureStep = allureDecorator(step);

// ============================================================================
// Allure Tag Synchronizer
// ============================================================================
// This module intercepts Cypress/Mocha test definitions to automatically
// sync @cypress/grep tags with Allure reports. When a test or suite is
// defined with { tags: ['@smoke'] }, those tags are captured and applied
// to the Allure report when the test runs.
// ============================================================================

type TestOptions = Cypress.TestConfigOverrides & { tags?: string[] };
type SuiteOptions = Cypress.SuiteConfigOverrides & { tags?: string[] };

interface ParsedTestDefinition {
  hasOptions: boolean;
  options?: TestOptions;
  testFunction?: Mocha.Func | Mocha.AsyncFunc;
}

interface ParsedSuiteDefinition {
  hasOptions: boolean;
  options?: SuiteOptions;
  suiteFunction?: () => void;
}

/**
 * Manages tag inheritance from parent suites to child tests.
 * Uses a stack to track nested suite tags.
 */
class TagRegistry {
  private inheritedTags: string[][] = [];

  pushSuiteTags(tags: string[]): void {
    this.inheritedTags.push(tags);
  }

  popSuiteTags(): void {
    this.inheritedTags.pop();
  }

  getAllInheritedTags(): string[] {
    return this.inheritedTags.flat();
  }

  collectAllTags(testTags: string[] = []): string[] {
    return [...this.getAllInheritedTags(), ...testTags];
  }
}

const tagRegistry = new TagRegistry();

/**
 * Parses test definition arguments to extract options and test function.
 */
function parseTestDefinition(
  optionsOrFunction?: TestOptions | Mocha.Func | Mocha.AsyncFunc,
  testFunction?: Mocha.Func | Mocha.AsyncFunc
): ParsedTestDefinition {
  const hasOptions = optionsOrFunction !== undefined && typeof optionsOrFunction !== 'function';

  return {
    hasOptions,
    options: hasOptions ? (optionsOrFunction as TestOptions) : undefined,
    testFunction: hasOptions ? testFunction : (optionsOrFunction as Mocha.Func | Mocha.AsyncFunc),
  };
}

/**
 * Parses suite definition arguments to extract options and suite function.
 */
function parseSuiteDefinition(
  optionsOrFunction?: SuiteOptions | (() => void),
  suiteFunction?: () => void
): ParsedSuiteDefinition {
  const hasOptions = optionsOrFunction !== undefined && typeof optionsOrFunction !== 'function';

  return {
    hasOptions,
    options: hasOptions ? (optionsOrFunction as SuiteOptions) : undefined,
    suiteFunction: hasOptions ? suiteFunction : (optionsOrFunction as () => void),
  };
}

/**
 * Wraps a Mocha test function to apply Allure tags before execution.
 */
function wrapMochaTestWithTags(
  originalTestFunction: Mocha.Func,
  tags: string[]
): Mocha.Func {
  return function (this: Mocha.Context) {
    tags.forEach((t) => tag(t));
    return originalTestFunction.call(this);
  };
}

/**
 * Wraps a Mocha suite function to register tags for child inheritance.
 */
function wrapMochaSuiteWithTags(
  originalSuiteFunction: () => void,
  tags: string[]
): () => void {
  return function () {
    tagRegistry.pushSuiteTags(tags);
    try {
      originalSuiteFunction();
    } finally {
      tagRegistry.popSuiteTags();
    }
  };
}

/**
 * Intercepts Mocha's `it` function to capture and apply tags to Allure.
 */
function interceptMochaIt(original: Mocha.TestFunction): Mocha.TestFunction {
  const intercepted = function (
    title: string,
    optionsOrFunction?: TestOptions | Mocha.Func | Mocha.AsyncFunc,
    testFunction?: Mocha.Func | Mocha.AsyncFunc
  ) {
    const parsed = parseTestDefinition(optionsOrFunction, testFunction);
    const allTags = tagRegistry.collectAllTags(parsed.options?.tags);

    if (allTags.length > 0 && parsed.testFunction) {
      const taggedFunction = wrapMochaTestWithTags(parsed.testFunction as Mocha.Func, allTags);
      return original(title, parsed.options || {}, taggedFunction);
    }

    return original(title, optionsOrFunction as Cypress.TestConfigOverrides, testFunction);
  } as Mocha.TestFunction;

  intercepted.only = original.only;
  intercepted.skip = original.skip;

  return intercepted;
}

/**
 * Intercepts Mocha's `describe`/`context` functions to capture tags for inheritance.
 */
function interceptMochaDescribe(original: Mocha.SuiteFunction): Mocha.SuiteFunction {
  const intercepted = function (
    title: string,
    optionsOrFunction?: SuiteOptions | (() => void),
    suiteFunction?: () => void
  ) {
    const parsed = parseSuiteDefinition(optionsOrFunction, suiteFunction);

    if (parsed.options?.tags && parsed.suiteFunction) {
      const taggedFunction = wrapMochaSuiteWithTags(parsed.suiteFunction, parsed.options.tags);
      return original(title, parsed.options, taggedFunction);
    }

    return original(title, optionsOrFunction as Cypress.SuiteConfigOverrides, suiteFunction);
  } as Mocha.SuiteFunction;

  intercepted.only = original.only;
  intercepted.skip = original.skip;

  return intercepted;
}

/**
 * Enables automatic synchronization of @cypress/grep tags with Allure reports.
 * Tags defined in test and suite options are captured and applied to Allure
 * when tests execute. Suite tags are inherited by all child tests.
 *
 * Call this once in your support file (e2e.ts) after registering @cypress/grep.
 *
 * @example
 * // In e2e.ts
 * registerCypressGrep();
 * enableAllureTagSync();
 *
 * // In test files - tags automatically appear in Allure reports
 * describe('Cart', { tags: ['@cart'] }, () => {
 *   it('should add item', { tags: ['@smoke'] }, () => {
 *     // Test has both @cart and @smoke tags in Allure
 *   });
 * });
 */
export function enableAllureTagSync(): void {
  const global = globalThis as unknown as Record<string, unknown>;
  global.it = interceptMochaIt(it);
  global.describe = interceptMochaDescribe(describe);
  global.context = interceptMochaDescribe(context);
}

