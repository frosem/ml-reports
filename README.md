# ml-allure-reports

E2E Testing Framework with Allure Reports for Cypress and Playwright.

![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Cypress](https://img.shields.io/badge/Cypress-14.x-69D3A7?logo=cypress&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-1.x-2EAD33?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0tMiAxNWwtNS01IDEuNDEtMS40MUwxMCAxNC4xN2w3LjU5LTcuNTlMMTkgOGwtOSA5eiIvPjwvc3ZnPg==&logoColor=white)
![Allure](https://img.shields.io/badge/Allure-Report-FF5722?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0wIDE4Yy00LjQxIDAtOC0zLjU5LTgtOHMzLjU5LTggOC04IDggMy41OSA4IDgtMy41OSA4LTggOHoiLz48L3N2Zz4=)
---
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI/CD-2088FF?logo=githubactions&logoColor=white&style=flat-square)
![Jira](https://img.shields.io/badge/Jira-Integration-0052CC?logo=jira&logoColor=white&style=flat-square)

---

## 📑 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Tests](#running-tests)
- [Allure Reports](#allure-reports)
- [Jira Integration](#jira-integration)
- [CI/CD](#cicd)
- [Project Structure](#project-structure)
- [Scripts Reference](#scripts-reference)

---

## ⚙️ Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| Node.js | 20+ | [Download](https://nodejs.org/) |
| Java JDK | 8+ | Required by Allure CLI. [Download](https://adoptium.net/) |

Verify installations:

```bash
node --version
java -version
```

---

## 📦 Installation

```bash
# Clone and install dependencies
npm install

# Install Playwright browsers (if using Playwright)
npm run playwright:install
```

---

## 🧪 Running Tests

### ![Cypress](https://img.shields.io/badge/-Cypress-69D3A7?logo=cypress&logoColor=white&style=flat-square)

```bash
npm run cypress:test          # Run tests, output results to allure-results/cypress
npm run cypress:allure        # Run tests, generate report, open in browser
```

### ![Playwright](https://img.shields.io/badge/-Playwright-2EAD33?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0tMiAxNWwtNS01IDEuNDEtMS40MUwxMCAxNC4xN2w3LjU5LTcuNTlMMTkgOGwtOSA5eiIvPjwvc3ZnPg==&logoColor=white&style=flat-square)

```bash
npm run playwright:test       # Run tests, output results to allure-results/playwright
npm run playwright:allure     # Run tests, generate report, open in browser
```

### Running Tests with Tags

Filter tests by priority (`@critical`, `@high`, `@medium`, `@low`), type (`@smoke`, `@regression`), or feature (`@auth`, `@cart`, `@checkout`, etc.).

**Cypress**

```bash
npx cypress run --env grepTags="@critical"         # Single tag
npx cypress run --env grepTags="@critical @high"   # Tests with either tag
npx cypress run --env grepTags="@critical+@high"   # Tests with both tags
```

**Playwright**

```bash
npx playwright test --grep "@critical"                  # Single tag
npx playwright test --grep "@critical|@high"            # Tests with either tag
npx playwright test --grep "(?=.*@critical)(?=.*@high)" # Tests with both tags
```

---

## 📊 Allure Reports

### Directory Structure

```
allure-results/
├── suite/                    # Full test suite runs (no tags)
│   ├── cypress/
│   └── playwright/
└── on-demand/                # Filtered runs (with --tags)
    ├── cypress/
    └── playwright/

allure-report/
├── suite/
│   ├── cypress/
│   └── playwright/
└── on-demand/
    ├── cypress/
    └── playwright/
```

### Allure CLI Commands

Manage reports via the `allure-cli.ts` script:

| Command | Description |
|---------|-------------|
| `npm run allure -- run <framework>` | Run tests with sharding, generate report, open in browser |
| `npm run allure -- run <framework> --tags=@smoke` | Run only tests matching tags |
| `npm run allure -- run <framework> --shards=2` | Override number of parallel shards |
| `npm run allure -- clean` | Remove all results and reports |
| `npm run allure -- clean <framework>` | Remove results and reports for specified framework |
| `npm run allure -- clean:old` | Remove results older than 30 days |
| `npm run allure -- generate <framework>` | Generate report from existing results |
| `npm run allure -- history <framework>` | Copy history from previous report to results |
| `npm run allure -- open <framework>` | Open the generated report |

**Examples:**

```bash
npm run allure -- run playwright --tags=@smoke,@critical
npm run allure -- run cypress --tags=@auth --shards=2
npm run allure -- run playwright                          # Full suite, default shards from config in package.json
```

### Report Features

**Categories** — Failures are auto-classified by error patterns (e.g., timeouts, assertion mismatches). Add or modify categories in `shared/config/allure.config.ts`.

**Links** — Link tests to management tools using `storyLink()` and `testLink()` helpers.

### Settings

You can customize how Allure integrates with your tests by editing `shared/config/allure.config.ts`. These settings let you control what gets captured in your reports:

| Setting | What it does |
|---------|--------------|
| Allure expect | Use the Allure expect that logs assertions as steps, or stick with Playwright expect |
| Screenshot on failure | Attach a screenshot when a test fails |
| Detailed messages | Show the actual and expected values in assertion step names |
| Environment info | Include environment information in reporting |
| Step logging | Log each assertion as a separate step in the report |

All settings are enabled by default. Turn any off if needed for simpler reports or faster test runs.

### Allure Helpers

Functions created in `AllureTools.ts`:

| Function | Purpose |
|----------|---------|
| `allureStep` | Decorator to wrap methods as Allure steps |
| `attachAssertion` | Attach assertion details as HTML |
| `storyLink` | URL link to a ticket story |
| `testLink` | URL link to a test case |

> 💡 **Playwright Tip:** Import `expect` from `@playwright-support/AllureTools` instead of `@playwright/test` — it logs each assertion as an Allure step, improving report readability by showing what was checked and the actual values.

---

## 🔗 Jira Integration

When tests fail, the `create-jira-bugs.ts` script parses Allure results and creates Jira issues.

### Configuration

Set these environment variables:

```bash
export JIRA_BASE_URL="https://your-domain.atlassian.net"
export JIRA_USER_EMAIL="your-email@example.com"
export JIRA_API_TOKEN="your-api-token"
export JIRA_PROJECT_KEY="TEST"
```

> 🔑 Generate an API token at: https://id.atlassian.com/manage-profile/security/api-tokens

### Commands

```bash
npm run jira:create-bugs      # Create Jira issues from failures
npm run jira:dry-run          # Preview without creating issues
```

---

## 🔄 CI/CD

### GitHub Actions

The `e2e-tests.yml` workflow runs tests via GitHub Actions dispatch:

1. Navigate to **Actions** → **E2E Tests Report**
2. Click **Run workflow**
3. Configure options:
   - **Framework**: Select `cypress` or `playwright`
   - **Create bug reports**: Enable to create Jira issues for failed tests
4. Click **Run workflow**

### Required Secrets

Add to repository settings (`Settings > Secrets and variables > Actions`):

| Secret | Description |
|--------|-------------|
| `JIRA_API_TOKEN` | Jira API token |
| `JIRA_BASE_URL` | Jira instance URL |
| `JIRA_PROJECT_KEY` | Project key for issue creation |
| `JIRA_USER_EMAIL` | Email for Jira authentication |

### Report Hosting

Reports deploy to GitHub Pages organized by branch and run ID:

```
/allure-report/
├── main/
│   ├── 12345678901/
│   └── 12345678902/
└── feature-branch/
    └── 12345678903/
```

---

## 📁 Project Structure

```
ml-allure-reports/
├── .github/workflows/
│   ├── e2e-tests.yml             # E2E pipeline
│   └── pr-validation.yml         # PR checks
├── cypress/
│   ├── e2e/                      # Test specs
│   ├── page-actions/             # Page action classes
│   └── support/
│       └── AllureTools.ts        # Cypress Allure helpers
├── playwright/
│   ├── core/
│   │   ├── Assertions.ts         # Assertion methods
│   │   ├── BasePage.ts           # Base class for page actions
│   │   └── Waits.ts              # Wait methods
│   ├── page-actions/             # Page action classes
│   ├── support/
│   │   └── AllureTools.ts        # Allure reporting utilities
│   └── tests/                    # Test specs
├── scripts/
│   ├── allure-cli.ts             # Allure CLI tool
│   └── create-jira-bugs.ts       # Jira integration
├── shared/
│   ├── allure/
│   │   ├── AllureStepDecorator.ts
│   │   └── BaseAllureTools.ts
│   ├── config/
│   │   └── allure.config.ts      # Shared Allure configuration
│   ├── fixtures/                 # Test data (JSON)
│   └── page-objects/             # Shared page object selectors
├── cypress.config.ts
├── playwright.config.ts
├── package.json
└── tsconfig.json
```

---

## 📜 Scripts Reference

`<framework>` = `cypress` | `playwright`

| Script | Description |
|--------|-------------|
| `npm run <framework>:allure` | Run framework tests and open report |
| `npm run <framework>:install` | Install framework dependencies |
| `npm run <framework>:test` | Run framework tests |
| `npm run <framework>:verify` | Verify framework installation |
| `npm run allure -- run <framework>` | Run tests with sharding and generate report |
| `npm run allure -- clean` | Remove all results and reports |
| `npm run allure -- clean:old` | Remove results older than 30 days |
| `npm run allure -- generate <framework>` | Generate HTML report from results |
| `npm run allure -- history <framework>` | Copy history from previous report |
| `npm run allure -- open <framework>` | Open the generated report |
| `npm run jira:create-bugs` | Create Jira issues from failures |
| `npm run jira:dry-run` | Preview Jira integration (no creation) |
| `npm run prettier:fix` | Format code with Prettier |
| `npm run test:ci` | CI pipeline: clean, test, create bugs |
| `npm run typecheck` | TypeScript type checking |

---

## 📄 License

MIT
