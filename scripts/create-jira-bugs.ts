/**
 * Creates Jira bug tickets for failed Allure test results.
 *
 * Required environment variables:
 * - ALLURE_RESULTS_DIR, JIRA_API_TOKEN, JIRA_BASE_URL, JIRA_PROJECT_KEY, JIRA_USER_EMAIL
 *
 * Optional:
 * - GITHUB_BRANCH, GITHUB_COMMIT_SHA, GITHUB_RUN_URL
 */

import { appendFileSync, existsSync, readFileSync, readdirSync } from 'fs';
import { join } from 'path';

import {
  LabelName,
  Status,
  type AllureResult,
  type AllureStep,
  type FailedStep,
  type FailedTestInfo,
  type Label,
} from '@shared/allure/ResultTypes';
import { JiraBugService } from '@jira/BugService';
import type { JiraConfig, ProcessingResult } from '@jira/types';

// Configuration

function loadConfig(): JiraConfig {
  return {
    allureResultsDir: process.env.ALLURE_RESULTS_DIR || '',
    checkExistingIssues: process.env.CHECK_EXISTING_ISSUES !== 'false',
    githubBranch: process.env.GITHUB_BRANCH || '',
    githubCommitSha: process.env.GITHUB_COMMIT_SHA || '',
    githubRunUrl: process.env.GITHUB_RUN_URL || '',
    jiraApiToken: process.env.JIRA_API_TOKEN || '',
    jiraBaseUrl: process.env.JIRA_BASE_URL || '',
    jiraIssueType: process.env.JIRA_ISSUE_TYPE || 'Bug',
    jiraPriority: process.env.JIRA_PRIORITY || 'High',
    jiraProjectKey: process.env.JIRA_PROJECT_KEY || '',
    jiraUserEmail: process.env.JIRA_USER_EMAIL || '',
    labels: (process.env.JIRA_LABELS || 'automated-test-failure').split(',').map((l) => l.trim()),
  };
}

function validateConfig(config: JiraConfig): void {
  const required: Array<keyof JiraConfig> = [
    'allureResultsDir',
    'jiraApiToken',
    'jiraBaseUrl',
    'jiraProjectKey',
    'jiraUserEmail',
  ];
  const missing = required.filter((k) => !config[k]);

  if (missing.length > 0) {
    const vars = missing.map((k) => k.replace(/([A-Z])/g, '_$1').toUpperCase());
    throw new Error(
      `Missing required environment variables:\n${vars.map((v) => `  - ${v}`).join('\n')}`
    );
  }
}

// Allure parsing

function extractLabel(labels: Label[] | undefined, name: string): string | null {
  return labels?.find((l) => l.name === name)?.value || null;
}

function extractFailedSteps(steps: AllureStep[]): FailedStep[] {
  const failed: FailedStep[] = [];
  for (const step of steps) {
    if (step.status === Status.BROKEN || step.status === Status.FAILED) {
      failed.push({ name: step.name, status: step.status, statusDetails: step.statusDetails });
    }
    if (step.steps?.length) failed.push(...extractFailedSteps(step.steps));
  }
  return failed;
}

function parseAllureResults(resultsDir: string): FailedTestInfo[] {
  if (!existsSync(resultsDir)) {
    console.log(`⚠️ Allure results directory not found: ${resultsDir}`);
    return [];
  }

  const files = readdirSync(resultsDir).filter((f) => f.endsWith('-result.json'));
  const failed: FailedTestInfo[] = [];

  for (const file of files) {
    try {
      const content = readFileSync(join(resultsDir, file), 'utf8');
      const result = JSON.parse(content) as AllureResult;

      if (result.status === Status.BROKEN || result.status === Status.FAILED) {
        failed.push({
          duration: result.stop && result.start ? result.stop - result.start : 0,
          errorMessage: result.statusDetails?.message || 'No error message available',
          errorTrace: result.statusDetails?.trace || '',
          fullName: result.fullName || result.name || 'Unknown Test',
          historyId: result.historyId || result.uuid,
          name: result.name || 'Unknown Test',
          package: extractLabel(result.labels, LabelName.PACKAGE) || '',
          status: result.status,
          steps: extractFailedSteps(result.steps || []),
          suite: extractLabel(result.labels, LabelName.SUITE) || 'Unknown Suite',
          uuid: result.uuid,
        });
      }
    } catch (error) {
      console.error(`Error parsing ${file}:`, error instanceof Error ? error.message : error);
    }
  }

  return failed;
}

// Output

function printSummary(results: ProcessingResult): void {
  console.log('\n' + '='.repeat(50));
  console.log('📊 Summary\n');

  if (results.created.length) {
    console.log(`✅ Created ${results.created.length} new issue(s):`);
    results.created.forEach((r) => console.log(`   - ${r.issueKey}: ${r.test}`));
  }
  if (results.updated.length) {
    console.log(`📝 Updated ${results.updated.length} existing issue(s):`);
    results.updated.forEach((r) => console.log(`   - ${r.issueKey}: ${r.test}`));
  }
  if (results.errors.length) {
    console.log(`❌ Failed to process ${results.errors.length} test(s):`);
    results.errors.forEach((r) => console.log(`   - ${r.test}: ${r.error}`));
  }
}

function writeGitHubOutput(results: ProcessingResult): void {
  const outputFile = process.env.GITHUB_OUTPUT;
  if (!outputFile) return;

  const allIssues = [...results.created, ...results.updated];
  const output = [
    `errors=${results.errors.length}`,
    `issue_links=${allIssues.map((r) => `[${r.issueKey}](${r.url})`).join(', ')}`,
    `issues_created=${results.created.length}`,
    `issues_details=${JSON.stringify(allIssues)}`,
    `issues_updated=${results.updated.length}`,
  ].join('\n');

  appendFileSync(outputFile, output);
}

// Main

async function main(): Promise<void> {
  console.log('🚀 Allure to Jira Bug Creator\n');

  const config = loadConfig();
  try {
    validateConfig(config);
  } catch (error) {
    console.error('❌', error instanceof Error ? error.message : error);
    process.exit(1);
  }

  console.log('📂 Parsing Allure results...');
  const failedTests = parseAllureResults(config.allureResultsDir);

  if (failedTests.length === 0) {
    console.log('✅ No test failures found. Exiting.');
    return;
  }

  console.log(`\n🔍 Found ${failedTests.length} failed test(s):\n`);
  failedTests.forEach((t, i) => console.log(`   ${i + 1}. ${t.name} (${t.status})`));

  console.log('\n📝 Creating Jira issues...\n');
  const service = new JiraBugService(config);
  const results = await service.processFailedTests(failedTests);

  printSummary(results);
  writeGitHubOutput(results);

  if (results.errors.length) process.exit(1);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
