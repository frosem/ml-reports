import { readFileSync } from 'node:fs';
import { platform, release, version } from 'node:os';
import { join } from 'node:path';
import { Status } from 'allure-js-commons';
import allure from '@fixtures/management/allure-metadata.json';
import integrations from '@fixtures/management/integrations.json';

export interface AllureSettings {
  /** Use Allure-wrapped expect with step logging, or plain Playwright expect */
  allureExpectEnabled: boolean;
  /** Attach screenshot to Allure report on test failure */
  attachScreenshotOnFailure: boolean;
  /** Show detailed assertion context (actual vs expected values) in step names */
  detailedAssertionMessages: boolean;
  /** Include environment info (OS, Node version, etc.) in Allure report */
  includeEnvironmentInfo: boolean;
  /** Log each assertion as a separate Allure step */
  stepLogging: boolean;
}

export const settings: AllureSettings = {
  allureExpectEnabled: true,
  attachScreenshotOnFailure: true,
  detailedAssertionMessages: true,
  includeEnvironmentInfo: true,
  stepLogging: true,
};

export type Framework = 'cypress' | 'playwright';

/**
 * Directory configuration for Allure results and reports.
 * All directory logic is handled by allure-cli.ts - these are used internally.
 */
export const directories = {
  history: 'history',
  report: 'allure-report/suite',
  results: 'allure-results/suite',
  reportOnDemand: 'allure-report/on-demand',
  resultsOnDemand: 'allure-results/on-demand',
  retentionDays: 30,
};

/**
 * Common Allure reporter configuration shared between Cypress and Playwright.
 */
export function getAllureConfig(framework: Framework) {
  return {
    categories: buildCategories(framework),
    environmentInfo: settings.includeEnvironmentInfo ? buildEnvironmentInfo(framework) : {},
    globalLabels: {
      layer: 'e2e',
      parentSuite: allure.parentSuite,
    },
    links: {
      story: {
        nameTemplate: 'Jira: %s',
        urlTemplate: integrations.links.jira,
      },
      tms: {
        nameTemplate: 'Qase: %s',
        urlTemplate: integrations.links.qase,
      },
    },
    resultsDir: process.env.ALLURE_RESULTS_DIR ?? `${directories.results}/${framework}`,
  };
}

/**
 * Reads package version from node_modules.
 */
function getPackageVersion(packageName: string): string {
  try {
    const packagePath = join(process.cwd(), 'node_modules', packageName, 'package.json');
    const pkg = JSON.parse(readFileSync(packagePath, 'utf-8')) as { version: string };
    return pkg.version;
  } catch {
    return 'unknown';
  }
}

/**
 * Builds environment info with framework name and versions.
 */
function buildEnvironmentInfo(framework: Framework) {
  const packages = frameworkPackages[framework];

  return {
    'reporting': `allure v${getPackageVersion(packages.allure)}`,
    'framework': `${framework} v${getPackageVersion(packages.framework)}`,
    'node': `node ${process.version}`,
    'platform': platform(),
    'release': release(),
    'version': version(),
  };
}

/**
 * Framework message regex patterns for Allure categories.
 * These patterns match actual error messages from each test framework.
 *
 * Documentation:
 * - Cypress errors: https://docs.cypress.io/app/references/error-messages
 * - Testing Library queries (Cypress): https://testing-library.com/docs/queries/about
 * - Playwright assertions: https://playwright.dev/docs/test-assertions
 */
export const categories = {
  cypress: {
    // net::ERR_* from Chrome, ECONNREFUSED from Node
    connectionProblem: '.*ECONNREFUSED.*|.*net::ERR_.*|.*Failed to fetch.*',
    // Cypress visibility assertion: "expected <element> to be visible"
    // Cypress covering: "is being covered by another element"
    contentNotAccessible: '.*expected .* to be visible.*|.*is being covered by another element.*',
    // @testing-library/dom queries - getMissingError functions
    contentNotFound: '.*Unable to find.*',
    // SauceDemo application-specific login error prefix
    loginFailed: '.*Epic sadface:.*',
    // Cypress page load timeout message
    pageTookTooLong: '.*cy\\.visit\\(\\) timed out.*|.*page load timed out.*',
    // Catch-all for unexpected errors
    unexpectedError: '.*',
    // Chai assertion format: "AssertionError: expected X to Y Z"
    wrongValueDisplayed: '.*AssertionError: expected .* to .*',
  },
  playwright: {
    // net::ERR_* from Chrome, ECONNREFUSED from Node
    connectionProblem: '.*ECONNREFUSED.*|.*net::ERR_.*|.*Failed to fetch.*',
    // playwright/lib/matchers/toBeTruthy.js visibility checks
    contentNotAccessible: '.*element is not visible.*|.*element is outside of the viewport.*',
    // Playwright locator timeout - matcherHint.js call log format
    contentNotFound: '.*waiting for getByTestId.*|.*waiting for locator.*',
    // SauceDemo application-specific login error prefix
    loginFailed: '.*Epic sadface:.*',
    // playwright-core/lib/server/progress.js:68
    pageTookTooLong: '.*Timeout \\d+ms exceeded.*|.*page\\.goto:.*Timeout.*',
    // Catch-all for unexpected errors
    unexpectedError: '.*',
    // playwright/lib/matchers/matcherHint.js:31 - "expect(locator).toX(expected) failed"
    // matcherHint.js:42-48 - "Expected substring:", "Received string:"
    wrongValueDisplayed: '.*expect\\(locator\\)\\.to.* failed.*|.*Expected substring:.*|.*Expected string:.*',
  },
};

const frameworkPackages: Record<Framework, { allure: string; framework: string }> = {
  cypress: { allure: 'allure-cypress', framework: 'cypress' },
  playwright: { allure: 'allure-playwright', framework: '@playwright/test' },
};

/**
 * Builds Allure categories with framework-specific regex patterns.
 */
function buildCategories(framework: Framework) {
  const patterns = categories[framework];

  return [
    {
      name: 'Login Failed',
      description: 'User could not log in due to invalid credentials or account restrictions',
      matchedStatuses: [Status.FAILED],
      messageRegex: patterns.loginFailed,
    },
    {
      name: 'Connection Problem',
      description: 'The application could not be reached or the server is unavailable',
      matchedStatuses: [Status.BROKEN, Status.FAILED],
      messageRegex: patterns.connectionProblem,
    },
    {
      name: 'Page Took Too Long to Load',
      description: 'The page did not finish loading within the allowed time',
      matchedStatuses: [Status.BROKEN, Status.FAILED],
      messageRegex: patterns.pageTookTooLong,
    },
    {
      name: 'Content Not Found',
      description: 'A required element (button, field, text) was not found on the page',
      matchedStatuses: [Status.FAILED],
      messageRegex: patterns.contentNotFound,
    },
    {
      name: 'Content Not Accessible',
      description: 'The element exists but is hidden or blocked from interaction',
      matchedStatuses: [Status.FAILED],
      messageRegex: patterns.contentNotAccessible,
    },
    {
      name: 'Wrong Value Displayed',
      description: 'The displayed text or value was different from what was expected',
      matchedStatuses: [Status.FAILED],
      messageRegex: patterns.wrongValueDisplayed,
    },
    {
      name: 'Unexpected Error',
      description: 'The test stopped due to an unhandled problem',
      matchedStatuses: [Status.BROKEN],
      messageRegex: patterns.unexpectedError,
    },
  ];
}

