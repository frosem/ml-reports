# ml-cypress-testing

E2E Testing Framework with Cypress, Playwright, Allure Reports, and Jira Integration

## 🚀 Features

- **Cypress E2E Tests** - Automated browser testing with TypeScript
- **Playwright E2E Tests** - Cross-browser testing with modern test runner
- **Allure Reports** - Beautiful, detailed test reports
- **Jira Integration** - Automatic bug creation for failed tests
- **GitHub Actions CI/CD** - Automated test execution pipeline
- **GitHub Pages** - Allure report hosting
- **Shared Fixtures & Page Objects** - Cross-framework test data and locators

## 📦 Installation

### Install Dependencies

```bash
npm install
```

### Install Playwright Browsers

```bash
npx playwright install
```

## 🧪 Running Tests

### Cypress

#### Run Cypress tests with Allure

```bash
npm run test:allure
```

#### Run Cypress in headed Chrome browser

```bash
npm run browser:chrome
```

### Playwright

#### Run Playwright tests

```bash
npm run playwright:test
```

#### Run Playwright with UI mode

```bash
npm run playwright:ui
```

### Allure Reports

#### Generate and view Allure report

```bash
npm run allure:report
```

#### Clean previous results

```bash
npm run allure:clean
```

## 🔗 Jira Integration

This project automatically creates Jira bug tickets when tests fail. The integration:

1. Parses Allure test results for failures
2. Checks for existing issues to avoid duplicates
3. Creates new bugs or adds comments to existing ones
4. Includes error details, stack traces, and CI/CD context

### Local Setup

1. Copy the example config:
   ```bash
   cp scripts/jira-config.example.json scripts/jira-config.json
   ```

2. Set environment variables:
   ```bash
   export JIRA_BASE_URL="https://your-domain.atlassian.net"
   export JIRA_USER_EMAIL="your-email@example.com"
   export JIRA_API_TOKEN="your-api-token"
   export JIRA_PROJECT_KEY="TEST"
   ```

3. Generate a Jira API token at: https://id.atlassian.com/manage-profile/security/api-tokens

4. Run the Jira bug creator:
   ```bash
   npm run jira:create-bugs
   ```

### GitHub Actions Setup

Add these secrets to your GitHub repository (`Settings > Secrets and variables > Actions`):

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `JIRA_BASE_URL` | Your Jira instance URL | `https://your-domain.atlassian.net` |
| `JIRA_USER_EMAIL` | Email for Jira authentication | `your-email@example.com` |
| `JIRA_API_TOKEN` | Jira API token | `ATATT3xF...` |
| `JIRA_PROJECT_KEY` | Project key for bug creation | `TEST` |

### Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `JIRA_BASE_URL` | ✅ | - | Jira instance URL |
| `JIRA_USER_EMAIL` | ✅ | - | Jira authentication email |
| `JIRA_API_TOKEN` | ✅ | - | Jira API token |
| `JIRA_PROJECT_KEY` | ✅ | - | Project key for issues |
| `JIRA_ISSUE_TYPE` | ❌ | `Bug` | Issue type to create |
| `JIRA_PRIORITY` | ❌ | `High` | Issue priority |
| `JIRA_LABELS` | ❌ | `automated-test-failure,cypress` | Comma-separated labels |
| `CHECK_EXISTING_ISSUES` | ❌ | `true` | Check for duplicates |
| `ALLURE_RESULTS_DIR` | ❌ | `./allure-results` | Allure results path |

## 🔄 CI/CD Pipeline

The GitHub Actions workflow (`cypress-tests.yml`) automatically:

1. ⚙️ Sets up Node.js environment
2. 📦 Installs dependencies
3. 🧪 Runs Cypress tests with Allure reporting
4. 📊 Generates Allure report
5. 📤 Uploads test artifacts
6. 🐛 Creates Jira bugs for failures
7. 🌐 Deploys Allure report to GitHub Pages

### Triggering the Pipeline

The workflow runs on:
- Push to `main` or `master` branch
- Pull requests to `main` or `master`
- Manual trigger via GitHub Actions UI

## 📁 Project Structure

```
ml-cypress/
├── .github/
│   └── workflows/
│       ├── cypress-tests.yml    # CI/CD pipeline
│       └── pr-validation.yml    # PR validation checks
├── cypress/
│   ├── e2e/                     # Cypress test specs
│   ├── page-actions/            # Cypress page action helpers
│   └── support/                 # Custom commands
├── fixtures/                    # Shared test data (cross-framework)
│   ├── error-messages.json
│   ├── products.json
│   ├── urls.json
│   └── users.json
├── page-objects/                # Shared page objects (cross-framework)
│   ├── CartPageObjects.ts
│   ├── InventoryPageObjects.ts
│   └── LoginPageObjects.ts
├── playwright/
│   ├── page-actions/            # Playwright page action helpers
│   ├── playwright.config.ts     # Playwright configuration
│   └── tests/                   # Playwright test specs
├── scripts/
│   ├── create-jira-bugs.ts      # Jira integration script
│   └── jira-config.example.json # Example configuration
├── allure-results/              # Test results (generated)
├── allure-report/               # HTML report (generated)
├── cypress.config.ts            # Cypress configuration
├── package.json
├── README.md
└── tsconfig.json
```

## 🔧 Configuration

### Cypress Configuration

Edit `cypress.config.ts` to customize:
- `defaultCommandTimeout` - Command timeout duration
- `specPattern` - Test file patterns
- `video` - Video recording on/off
- `viewportWidth/Height` - Browser viewport size

### Playwright Configuration

Edit `playwright/playwright.config.ts` to customize:
- `projects` - Browser configurations (Chromium, Firefox, WebKit)
- `testDir` - Test directory location
- `testIdAttribute` - Custom test ID attribute selector
- `timeout` - Test timeout duration
- `use.trace` - Trace collection settings

### Allure Configuration

Allure settings in `cypress.config.ts`:
- `allureReuseAfterSpec` - Reuse report between specs
- `resultsDir` - Where to store results

## 📊 Viewing Reports

### Local Allure Report

```bash
npm run allure:report
```

### GitHub Pages (after CI runs)

Visit: `https://<username>.github.io/<repo-name>/allure-report`

## 🛠 Development

### Adding New Tests

#### Cypress Tests

1. Create a new spec file in `cypress/e2e/`
2. Use shared page objects from `page-objects/`
3. Use page actions from `cypress/page-actions/`
4. Run tests with `npm run test:allure`

#### Playwright Tests

1. Create a new spec file in `playwright/tests/`
2. Use shared page objects from `page-objects/`
3. Use page actions from `playwright/page-actions/`
4. Run tests with `npm run playwright:test`

### Test Naming Convention

```typescript
describe('Feature - Specific Functionality', () => {
  it('should [action] when [condition]', () => {
    // test implementation
  });
});
```

## 📝 Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run allure:clean` | Clean previous results |
| `npm run allure:report` | Generate and open Allure report |
| `npm run browser:chrome` | Run Cypress tests in headed Chrome |
| `npm run jira:create-bugs` | Create Jira bugs from failures |
| `npm run jira:dry-run` | Test Jira integration without creating issues |
| `npm run playwright:test` | Run Playwright tests |
| `npm run playwright:ui` | Run Playwright with interactive UI |
| `npm run test:allure` | Run Cypress tests with Allure reporting |
| `npm run test:ci` | Full CI pipeline (clean, test, create bugs) |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests locally
5. Submit a pull request

## 📄 License

MIT
