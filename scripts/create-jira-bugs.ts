/**
 * Allure to Jira Bug Creator
 *
 * This script parses Allure test results and creates Jira bug tickets
 * for any failed or broken tests.
 *
 * Required Environment Variables:
 * - JIRA_BASE_URL: Your Jira instance URL (e.g., https://your-domain.atlassian.net)
 * - JIRA_USER_EMAIL: The email associated with your Jira account
 * - JIRA_API_TOKEN: Your Jira API token (generate at https://id.atlassian.com/manage-profile/security/api-tokens)
 * - JIRA_PROJECT_KEY: The project key where bugs will be created (e.g., "BUG" or "TEST")
 *
 * Optional Environment Variables:
 * - GITHUB_RUN_URL: Link to the GitHub Actions run
 * - GITHUB_BRANCH: The branch where the test ran
 * - GITHUB_COMMIT_SHA: The commit SHA
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

// ============================================================================
// Type Definitions
// ============================================================================

interface AllureLabel {
    name: string;
    value: string;
}

interface AllureStatusDetails {
    message?: string;
    trace?: string;
}

interface AllureStep {
    name: string;
    status: string;
    statusDetails?: AllureStatusDetails;
    steps?: AllureStep[];
}

interface AllureResult {
    fullName?: string;
    historyId?: string;
    labels?: AllureLabel[];
    name?: string;
    status: string;
    statusDetails?: AllureStatusDetails | null;
    start?: number;
    steps?: AllureStep[];
    stop?: number;
    uuid: string;
}

interface FailedStep {
    name: string;
    status: string;
    statusDetails?: AllureStatusDetails;
}

interface FailedTestInfo {
    duration: number;
    errorMessage: string;
    errorTrace: string;
    fullName: string;
    historyId: string;
    name: string;
    package: string;
    status: string;
    steps: FailedStep[];
    suite: string;
    uuid: string;
}

interface JiraConfig {
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

interface JiraIssueFields {
    description: JiraAdfDocument;
    issuetype: { name: string };
    labels: string[];
    priority: { name: string };
    project: { key: string };
    summary: string;
}

interface JiraIssuePayload {
    fields: JiraIssueFields;
}

interface JiraCreateIssueResponse {
    id: string;
    key: string;
    self: string;
}

interface JiraSearchResponse {
    issues: Array<{
        id: string;
        key: string;
        self: string;
    }>;
    maxResults: number;
    startAt: number;
    total: number;
}

interface JiraAdfContent {
    attrs?: Record<string, unknown>;
    content?: JiraAdfContent[];
    marks?: Array<{ attrs?: Record<string, unknown>; type: string }>;
    text?: string;
    type: string;
}

interface JiraAdfDocument {
    content: JiraAdfContent[];
    type: 'doc';
    version: 1;
}

interface JiraCommentPayload {
    body: JiraAdfDocument;
}

interface ProcessingResult {
    created: Array<{ issueKey: string; test: string; url: string }>;
    errors: Array<{ error: string; test: string }>;
    updated: Array<{ issueKey: string; test: string; url: string }>;
}

// ============================================================================
// Configuration
// ============================================================================

const config: JiraConfig = {
    allureResultsDir: process.env.ALLURE_RESULTS_DIR || './allure-results',
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
    labels: (process.env.JIRA_LABELS || 'automated-test-failure').split(',').map(l => l.trim())
};

// ============================================================================
// Allure Result Parsing
// ============================================================================

/**
 * Extract a specific label value from Allure labels array
 */
function extractLabel(labels: AllureLabel[] | undefined, name: string): string | null {
    if (!Array.isArray(labels)) {
        return null;
    }
    const label = labels.find(l => l.name === name);
    return label?.value || null;
}

/**
 * Extract failed steps from test steps recursively
 */
function extractFailedSteps(steps: AllureStep[]): FailedStep[] {
    const failedSteps: FailedStep[] = [];

    for (const step of steps) {
        if (step.status === 'broken' || step.status === 'failed') {
            failedSteps.push({
                name: step.name,
                status: step.status,
                statusDetails: step.statusDetails
            });
        }
        // Recursively check nested steps
        if (step.steps && step.steps.length > 0) {
            failedSteps.push(...extractFailedSteps(step.steps));
        }
    }

    return failedSteps;
}

/**
 * Parse all Allure result files and extract failed tests
 */
function parseAllureResults(): FailedTestInfo[] {
    const resultsDir = config.allureResultsDir;

    if (!fs.existsSync(resultsDir)) {
        console.log(`⚠️ Allure results directory not found: ${resultsDir}`);
        return [];
    }

    const files = fs.readdirSync(resultsDir);
    const resultFiles = files.filter(f => f.endsWith('-result.json'));

    const failedTests: FailedTestInfo[] = [];

    for (const file of resultFiles) {
        try {
            const filePath = path.join(resultsDir, file);
            const content = fs.readFileSync(filePath, 'utf8');
            const result: AllureResult = JSON.parse(content) as AllureResult;

            // Check for failed or broken status
            if (result.status === 'broken' || result.status === 'failed') {
                const testInfo: FailedTestInfo = {
                    duration: result.stop && result.start ? result.stop - result.start : 0,
                    errorMessage: result.statusDetails?.message || 'No error message available',
                    errorTrace: result.statusDetails?.trace || '',
                    fullName: result.fullName || result.name || 'Unknown Test',
                    historyId: result.historyId || result.uuid,
                    name: result.name || 'Unknown Test',
                    package: extractLabel(result.labels, 'package') || '',
                    status: result.status,
                    steps: extractFailedSteps(result.steps || []),
                    suite: extractLabel(result.labels, 'suite') || 'Unknown Suite',
                    uuid: result.uuid
                };
                failedTests.push(testInfo);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`Error parsing ${file}:`, errorMessage);
        }
    }

    return failedTests;
}

// ============================================================================
// Jira ADF Document Building
// ============================================================================

/**
 * Helper to create a bullet item with label and value
 */
function createBulletItem(label: string, value: string): JiraAdfContent {
    return {
        content: [{
            content: [
                { marks: [{ type: 'strong' }], text: `${label}: `, type: 'text' },
                { text: value || 'N/A', type: 'text' }
            ],
            type: 'paragraph'
        }],
        type: 'listItem'
    };
}

/**
 * Helper to create a bullet item with a link
 */
function createBulletItemWithLink(label: string, linkText: string, url: string): JiraAdfContent {
    return {
        content: [{
            content: [
                { marks: [{ type: 'strong' }], text: `${label}: `, type: 'text' },
                { marks: [{ attrs: { href: url }, type: 'link' }], text: linkText, type: 'text' }
            ],
            type: 'paragraph'
        }],
        type: 'listItem'
    };
}

/**
 * Build Jira description in Atlassian Document Format (ADF)
 */
function buildJiraDescription(testInfo: FailedTestInfo): JiraAdfContent[] {
    const content: JiraAdfContent[] = [
        // Header
        {
            attrs: { level: 2 },
            content: [{ text: '🐛 Automated Test Failure Report', type: 'text' }],
            type: 'heading'
        },

        // Test Information
        {
            attrs: { level: 3 },
            content: [{ text: '📋 Test Information', type: 'text' }],
            type: 'heading'
        },
        {
            content: [
                createBulletItem('Duration', `${testInfo.duration}ms`),
                createBulletItem('Full Name', testInfo.fullName),
                createBulletItem('Status', testInfo.status.toUpperCase()),
                createBulletItem('Suite', testInfo.suite),
                createBulletItem('Test ID', testInfo.historyId || testInfo.uuid),
                createBulletItem('Test Name', testInfo.name)
            ],
            type: 'bulletList'
        },

        // Error Details
        {
            attrs: { level: 3 },
            content: [{ text: '❌ Error Details', type: 'text' }],
            type: 'heading'
        },
        {
            attrs: { language: 'text' },
            content: [{ text: testInfo.errorMessage.substring(0, 2000), type: 'text' }],
            type: 'codeBlock'
        }
    ];

    // Add stack trace if available
    if (testInfo.errorTrace) {
        content.push(
            {
                attrs: { level: 3 },
                content: [{ text: '📚 Stack Trace', type: 'text' }],
                type: 'heading'
            },
            {
                attrs: { title: 'Click to expand stack trace' },
                content: [
                    {
                        attrs: { language: 'text' },
                        content: [{ text: testInfo.errorTrace.substring(0, 5000), type: 'text' }],
                        type: 'codeBlock'
                    }
                ],
                type: 'expand'
            }
        );
    }

    // Add failed steps if available
    if (testInfo.steps.length > 0) {
        content.push(
            {
                attrs: { level: 3 },
                content: [{ text: '📝 Failed Steps', type: 'text' }],
                type: 'heading'
            },
            {
                content: testInfo.steps.slice(0, 10).map(step => ({
                    content: [{
                        content: [{ text: `${step.name} (${step.status})`, type: 'text' }],
                        type: 'paragraph'
                    }],
                    type: 'listItem'
                })),
                type: 'bulletList'
            }
        );
    }

    // Add GitHub context if available
    if (config.githubBranch || config.githubCommitSha || config.githubRunUrl) {
        const contextItems: JiraAdfContent[] = [];

        if (config.githubBranch) {
            contextItems.push(createBulletItem('Branch', config.githubBranch));
        }
        if (config.githubCommitSha) {
            contextItems.push(createBulletItem('Commit', config.githubCommitSha.substring(0, 8)));
        }
        if (config.githubRunUrl) {
            contextItems.push(createBulletItemWithLink('GitHub Actions Run', 'View Run', config.githubRunUrl));
        }

        content.push(
            {
                attrs: { level: 3 },
                content: [{ text: '🔗 CI/CD Context', type: 'text' }],
                type: 'heading'
            },
            {
                content: contextItems,
                type: 'bulletList'
            }
        );
    }

    // Add footer
    content.push(
        { type: 'rule' },
        {
            content: [
                { marks: [], text: '🤖 ', type: 'text' },
                {
                    marks: [{ type: 'em' }],
                    text: 'This issue was automatically created by the Cypress test automation pipeline.',
                    type: 'text'
                }
            ],
            type: 'paragraph'
        }
    );

    return content;
}

// ============================================================================
// Jira API Functions
// ============================================================================

/**
 * Make an HTTPS request to Jira API
 */
function makeJiraRequest<T>(
    method: string,
    endpoint: string,
    body?: unknown
): Promise<T> {
    return new Promise((resolve, reject) => {
        const url = new URL(`${config.jiraBaseUrl}${endpoint}`);
        const auth = Buffer.from(`${config.jiraUserEmail}:${config.jiraApiToken}`).toString('base64');

        const options: https.RequestOptions = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json'
            },
            hostname: url.hostname,
            method,
            path: url.pathname + url.search,
            port: 443
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk: Buffer) => {
                data += chunk.toString();
            });
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

        if (body) {
            req.write(JSON.stringify(body));
        }

        req.end();
    });
}

/**
 * Create a Jira issue using the REST API
 */
async function createJiraIssue(testInfo: FailedTestInfo): Promise<JiraCreateIssueResponse> {
    const description = buildJiraDescription(testInfo);
    const summary = `[Automated] Test Failure: ${testInfo.name}`.substring(0, 255);

    const issueData: JiraIssuePayload = {
        fields: {
            description: {
                content: description,
                type: 'doc',
                version: 1
            },
            issuetype: {
                name: config.jiraIssueType
            },
            labels: config.labels,
            priority: {
                name: config.jiraPriority
            },
            project: {
                key: config.jiraProjectKey
            },
            summary
        }
    };

    return makeJiraRequest<JiraCreateIssueResponse>('POST', '/rest/api/3/issue', issueData);
}

/**
 * Check if a similar issue already exists in Jira
 */
async function checkExistingIssue(testInfo: FailedTestInfo): Promise<{ key: string } | null> {
    const escapedName = testInfo.name.replace(/"/g, '\\"');
    const jql = `project = "${config.jiraProjectKey}" AND summary ~ "${escapedName}" AND status != Done AND status != Closed ORDER BY created DESC`;

    try {
        // Using the new /rest/api/3/search/jql endpoint (replaces deprecated /rest/api/3/search)
        const searchPayload = {
            jql,
            maxResults: 1,
            fields: ['key', 'summary']
        };

        const response = await makeJiraRequest<JiraSearchResponse>(
            'POST',
            '/rest/api/3/search/jql',
            searchPayload
        );

        if (response.issues && response.issues.length > 0) {
            return { key: response.issues[0].key };
        }

        return null;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.warn(`Warning: Could not search for existing issues: ${errorMessage}`);
        return null;
    }
}

/**
 * Add a comment to an existing Jira issue
 */
async function addCommentToIssue(issueKey: string, testInfo: FailedTestInfo): Promise<void> {
    const commentContent: JiraAdfContent[] = [
        {
            content: [
                { marks: [], text: '🔄 ', type: 'text' },
                { marks: [{ type: 'strong' }], text: 'This test failed again', type: 'text' }
            ],
            type: 'paragraph'
        },
        {
            content: [
                { text: `Date: ${new Date().toISOString()}`, type: 'text' }
            ],
            type: 'paragraph'
        }
    ];

    if (config.githubRunUrl) {
        commentContent.push({
            content: [
                { text: 'GitHub Actions Run: ', type: 'text' },
                {
                    marks: [{ attrs: { href: config.githubRunUrl }, type: 'link' }],
                    text: config.githubRunUrl,
                    type: 'text'
                }
            ],
            type: 'paragraph'
        });
    }

    if (testInfo.errorMessage) {
        commentContent.push({
            attrs: { language: 'text' },
            content: [{ text: testInfo.errorMessage.substring(0, 500), type: 'text' }],
            type: 'codeBlock'
        });
    }

    const comment: JiraCommentPayload = {
        body: {
            content: commentContent,
            type: 'doc',
            version: 1
        }
    };

    await makeJiraRequest<unknown>('POST', `/rest/api/3/issue/${issueKey}/comment`, comment);
}

// ============================================================================
// Configuration Validation
// ============================================================================

/**
 * Validate required configuration
 */
function validateConfig(): boolean {
    const requiredFields: Array<keyof JiraConfig> = [
        'jiraApiToken',
        'jiraBaseUrl',
        'jiraProjectKey',
        'jiraUserEmail'
    ];

    const missing = requiredFields.filter(key => !config[key]);

    if (missing.length > 0) {
        console.error('❌ Missing required environment variables:');
        missing.forEach(key => {
            const envVar = key.replace(/([A-Z])/g, '_$1').toUpperCase();
            console.error(`   - ${envVar}`);
        });
        console.error('\nPlease set these in your GitHub repository secrets.');
        return false;
    }

    return true;
}

// ============================================================================
// Main Execution
// ============================================================================

async function main(): Promise<void> {
    console.log('🚀 Allure to Jira Bug Creator\n');

    // Validate configuration
    if (!validateConfig()) {
        process.exit(1);
    }

    // Parse Allure results
    console.log('📂 Parsing Allure results...');
    const failedTests = parseAllureResults();

    if (failedTests.length === 0) {
        console.log('✅ No test failures found. Exiting.');
        return;
    }

    console.log(`\n🔍 Found ${failedTests.length} failed test(s):\n`);
    failedTests.forEach((test, i) => {
        console.log(`   ${i + 1}. ${test.name} (${test.status})`);
    });

    // Create Jira issues for each failure
    console.log('\n📝 Creating Jira issues...\n');

    const results: ProcessingResult = {
        created: [],
        errors: [],
        updated: []
    };

    for (const test of failedTests) {
        try {
            // Check for existing issue if enabled
            if (config.checkExistingIssues) {
                const existingIssue = await checkExistingIssue(test);
                if (existingIssue) {
                    console.log(`   ℹ️ Found existing issue ${existingIssue.key} for "${test.name}"`);
                    await addCommentToIssue(existingIssue.key, test);
                    console.log(`   📝 Added comment to ${existingIssue.key}`);
                    results.updated.push({
                        issueKey: existingIssue.key,
                        test: test.name,
                        url: `${config.jiraBaseUrl}/browse/${existingIssue.key}`
                    });
                    continue;
                }
            }

            // Create new issue
            const issue = await createJiraIssue(test);
            console.log(`   ✅ Created ${issue.key} for "${test.name}"`);
            results.created.push({
                issueKey: issue.key,
                test: test.name,
                url: `${config.jiraBaseUrl}/browse/${issue.key}`
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`   ❌ Failed to create issue for "${test.name}": ${errorMessage}`);
            results.errors.push({
                error: errorMessage,
                test: test.name
            });
        }
    }

    // Print summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Summary\n');

    if (results.created.length > 0) {
        console.log(`✅ Created ${results.created.length} new issue(s):`);
        results.created.forEach(r => console.log(`   - ${r.issueKey}: ${r.test}`));
    }

    if (results.updated.length > 0) {
        console.log(`📝 Updated ${results.updated.length} existing issue(s):`);
        results.updated.forEach(r => console.log(`   - ${r.issueKey}: ${r.test}`));
    }

    if (results.errors.length > 0) {
        console.log(`❌ Failed to process ${results.errors.length} test(s):`);
        results.errors.forEach(r => console.log(`   - ${r.test}: ${r.error}`));
    }

    // Write results to file for GitHub Actions
    const outputFile = process.env.GITHUB_OUTPUT;
    if (outputFile) {
        const output = [
            `issues_created=${results.created.length}`,
            `issues_updated=${results.updated.length}`,
            `errors=${results.errors.length}`
        ].join('\n');
        fs.appendFileSync(outputFile, output);
    }

    // Exit with error if there were failures
    if (results.errors.length > 0) {
        process.exit(1);
    }
}

// Run
main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});

