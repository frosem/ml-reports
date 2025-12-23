/**
 * Types for Jira API and document building.
 */

export interface JiraConfig {
  allureResultsDir: string;
  checkExistingIssues: boolean;
  githubBranch: string;
  githubCommitSha: string;
  githubRunUrl: string;
  jiraApiToken: string;
  jiraBaseUrl: string;
  jiraIssueType: string;
  jiraPriority: string;
  jiraProjectKey: string;
  jiraUserEmail: string;
  labels: string[];
}

export interface AdfContent {
  attrs?: Record<string, unknown>;
  content?: AdfContent[];
  marks?: Array<{ attrs?: Record<string, unknown>; type: string }>;
  text?: string;
  type: string;
}

export interface AdfDocument {
  content: AdfContent[];
  type: 'doc';
  version: 1;
}

export interface JiraIssuePayload {
  fields: {
    description: AdfDocument;
    issuetype: { name: string };
    labels: string[];
    priority: { name: string };
    project: { key: string };
    summary: string;
  };
}

export interface JiraIssueResponse {
  id: string;
  key: string;
  self: string;
}

export interface JiraSearchResponse {
  issues: Array<{ id: string; key: string; self: string }>;
  maxResults: number;
  startAt: number;
  total: number;
}

export interface IssueResult {
  issueKey: string;
  test: string;
  url: string;
}

export interface ProcessingResult {
  created: IssueResult[];
  errors: Array<{ error: string; test: string }>;
  updated: IssueResult[];
}
