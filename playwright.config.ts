import '@shared/config/env.config';
import { defineConfig, devices } from '@playwright/test';
import { getAllureConfig, settings } from '@shared/config/allure.config';
import allure from '@shared/fixtures/management/allure-metadata.json';
import packageJson from './package.json';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './playwright/tests',
  testMatch: '**/*.spec?(s).ts',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? packageJson.config.workers : undefined,
  /**
   * Reporter to use. See https://playwright.dev/docs/test-reporters
   *
   * Built-in reporters:
   * - 'list'   : Shows each test on a new line as it runs (default, good for local dev)
   * - 'line'   : Single updating line, minimal output (good for CI logs)
   * - 'dot'    : Outputs dots for pass/fail (minimal, quick feedback)
   * - 'html'   : Interactive HTML report with screenshots/traces (outputFolder, open: 'always'|'never'|'on-failure')
   * - 'json'   : JSON output for programmatic processing (outputFile: 'results.json')
   * - 'junit'  : JUnit XML for CI systems like Jenkins (outputFile: 'results.xml')
   * - 'github' : GitHub Actions annotations on PRs (auto-enabled in GH Actions)
   *
   * Third-party reporters (install via npm):
   * - 'allure-playwright' : Rich interactive reports with history, trends, and detailed steps
   */
  reporter: [
    ['list'], // Terminal output during test runs
    // ['dot'], // Minimal dots output (. for pass, F for fail)
    // ['line'], // Single updating line per test
    // ['html', { open: 'never', outputFolder: 'playwright-report' }], // Interactive HTML report
    // ['json', { outputFile: 'test-results.json' }], // JSON for CI/programmatic use
    // ['junit', { outputFile: 'test-results.xml' }], // JUnit XML for Jenkins/CI
    [
      'allure-playwright',
      {
        ...getAllureConfig('playwright'),
        detail: true, /* If true, add detailed information about each step to the report (API calls, hooks, expect assertions). */
        suiteTitle: false, /* If true, implicitly add each test into a test suite named after its file name. */
      },
    ],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',
    actionTimeout: 10000, /* Default timeout for actions (click, fill, etc.) that wait for elements */
    testIdAttribute: 'data-test',
    screenshot: settings.attachScreenshotOnFailure
      ? { mode: 'only-on-failure', fullPage: true }
      : 'off',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    video: 'on',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: allure.parentSuite,
      use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
