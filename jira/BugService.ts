/**
 * Creates Jira bugs from failed tests.
 */

import { AdfBuilder } from './AdfBuilder';
import { JiraApiClient } from './ApiClient';

import type { FailedTestInfo } from '@shared/allure/ResultTypes';
import type { JiraConfig, ProcessingResult } from './types';

export class JiraBugService {
  private readonly client: JiraApiClient;

  constructor(private readonly config: JiraConfig) {
    this.client = new JiraApiClient(config);
  }

  async processFailedTests(failedTests: FailedTestInfo[]): Promise<ProcessingResult> {
    const results: ProcessingResult = { created: [], errors: [], updated: [] };

    for (const test of failedTests) {
      try {
        await this.processTest(test, results);
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error(`   ❌ Failed to create issue for "${test.name}": ${msg}`);
        results.errors.push({ error: msg, test: test.name });
      }
    }

    return results;
  }

  private async processTest(test: FailedTestInfo, results: ProcessingResult): Promise<void> {
    if (this.config.checkExistingIssues) {
      const existing = await this.client.findExistingIssue(test.name);
      if (existing) {
        console.log(`   ℹ️ Found existing issue ${existing.key} for "${test.name}"`);
        await this.client.addComment(existing.key, this.buildComment(test));
        console.log(`   📝 Added comment to ${existing.key}`);
        results.updated.push({
          issueKey: existing.key,
          test: test.name,
          url: this.client.getIssueUrl(existing.key),
        });
        return;
      }
    }

    const summary = `[Automated] Test Failure: ${test.name}`.substring(0, 255);
    const issue = await this.client.createIssue(summary, this.buildDescription(test));
    console.log(`   ✅ Created ${issue.key} for "${test.name}"`);
    results.created.push({
      issueKey: issue.key,
      test: test.name,
      url: this.client.getIssueUrl(issue.key),
    });
  }

  private buildDescription(test: FailedTestInfo) {
    const builder = new AdfBuilder()
      .heading(2, '🐛 Automated Test Failure Report')
      .heading(3, '📋 Test Information')
      .bulletList((list) =>
        list
          .item('Duration', `${test.duration}ms`)
          .item('Full Name', test.fullName)
          .item('Status', test.status.toUpperCase())
          .item('Suite', test.suite)
          .item('Test ID', test.historyId || test.uuid)
          .item('Test Name', test.name)
      )
      .heading(3, '❌ Error Details')
      .codeBlock(test.errorMessage.substring(0, 2000));

    if (test.errorTrace) {
      builder
        .heading(3, '📚 Stack Trace')
        .expand('Click to expand', (b) => b.codeBlock(test.errorTrace.substring(0, 5000)));
    }

    if (test.steps.length > 0) {
      builder.heading(3, '📝 Failed Steps').bulletList((list) => {
        test.steps.slice(0, 10).forEach((s) => list.plainItem(`${s.name} (${s.status})`));
      });
    }

    this.addGitHubContext(builder);

    return builder
      .rule()
      .paragraph((p) =>
        p
          .text('🤖 ')
          .italic('This issue was automatically created by the test automation pipeline.')
      )
      .build();
  }

  private buildComment(test: FailedTestInfo) {
    const builder = new AdfBuilder()
      .paragraph((p) => p.text('🔄 ').bold('This test failed again'))
      .paragraph(`Date: ${new Date().toISOString()}`);

    if (this.config.githubRunUrl) {
      builder.paragraph((p) =>
        p.text('GitHub Actions Run: ').link(this.config.githubRunUrl, this.config.githubRunUrl)
      );
    }

    if (test.errorMessage) {
      builder.codeBlock(test.errorMessage.substring(0, 500));
    }

    return builder.build();
  }

  private addGitHubContext(builder: AdfBuilder): void {
    const { githubBranch, githubCommitSha, githubRunUrl } = this.config;
    if (!githubBranch && !githubCommitSha && !githubRunUrl) return;

    builder.heading(3, '🔗 CI/CD Context').bulletList((list) => {
      if (githubBranch) list.item('Branch', githubBranch);
      if (githubCommitSha) list.item('Commit', githubCommitSha.substring(0, 8));
      if (githubRunUrl) list.itemWithLink('GitHub Actions Run', 'View Run', githubRunUrl);
    });
  }
}
