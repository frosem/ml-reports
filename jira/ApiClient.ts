/**
 * Jira REST API client.
 */

import { request, type RequestOptions } from 'https';

import type {
  AdfDocument,
  JiraConfig,
  JiraIssuePayload,
  JiraIssueResponse,
  JiraSearchResponse,
} from './types';

export class JiraApiClient {
  private readonly auth: string;
  private readonly baseUrl: string;

  constructor(private readonly config: JiraConfig) {
    this.auth = Buffer.from(`${config.jiraUserEmail}:${config.jiraApiToken}`).toString('base64');
    this.baseUrl = config.jiraBaseUrl;
  }

  async createIssue(summary: string, description: AdfDocument): Promise<JiraIssueResponse> {
    const payload: JiraIssuePayload = {
      fields: {
        description,
        issuetype: { name: this.config.jiraIssueType },
        labels: this.config.labels,
        priority: { name: this.config.jiraPriority },
        project: { key: this.config.jiraProjectKey },
        summary,
      },
    };
    return this.request<JiraIssueResponse>('POST', '/rest/api/3/issue', payload);
  }

  async findExistingIssue(testName: string): Promise<{ key: string } | null> {
    const escaped = testName.replace(/"/g, '\\"');
    const jql = `project = "${this.config.jiraProjectKey}" AND summary ~ "${escaped}" AND status != Done AND status != Closed ORDER BY created DESC`;

    try {
      const response = await this.request<JiraSearchResponse>('POST', '/rest/api/3/search/jql', {
        fields: ['key', 'summary'],
        jql,
        maxResults: 1,
      });
      return response.issues.length > 0 ? { key: response.issues[0].key } : null;
    } catch (error) {
      console.warn(
        `Warning: Could not search for existing issues: ${error instanceof Error ? error.message : error}`
      );
      return null;
    }
  }

  async addComment(issueKey: string, body: AdfDocument): Promise<void> {
    await this.request<unknown>('POST', `/rest/api/3/issue/${issueKey}/comment`, { body });
  }

  getIssueUrl(issueKey: string): string {
    return `${this.baseUrl}/browse/${issueKey}`;
  }

  private request<T>(method: string, endpoint: string, body?: unknown): Promise<T> {
    return new Promise((resolve, reject) => {
      const url = new URL(`${this.baseUrl}${endpoint}`);
      const options: RequestOptions = {
        headers: {
          Accept: 'application/json',
          Authorization: `Basic ${this.auth}`,
          'Content-Type': 'application/json',
        },
        hostname: url.hostname,
        method,
        path: url.pathname + url.search,
        port: 443,
      };

      const req = request(options, (res) => {
        let data = '';
        res.on('data', (chunk: Buffer) => (data += chunk.toString()));
        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve(JSON.parse(data) as T);
            } catch {
              resolve(data as unknown as T);
            }
          } else {
            reject(new Error(`Jira API error (${res.statusCode}): ${data}`));
          }
        });
      });

      req.on('error', reject);
      if (body) req.write(JSON.stringify(body));
      req.end();
    });
  }
}
