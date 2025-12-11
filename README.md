# ml-cypress-testing

Cypress E2E Testing Framework with Allure Reports and Jira Integration

## 🚀 Features

- **Cypress E2E Tests** - Automated browser testing with TypeScript
- **Allure Reports** - Beautiful, detailed test reports
- **Jira Integration** - Automatic bug creation for failed tests
- **GitHub Actions CI/CD** - Automated test execution pipeline
- **GitHub Pages** - Allure report hosting

## 📦 Installation

```bash
npm install
```

## 🧪 Running Tests

### Run tests locally with Allure

```bash
npm run test:allure
```

### Run tests in headed Chrome browser

```bash
npm run browser:chrome
```

### Generate and view Allure report

```bash
npm run allure:report
```

### Clean previous results

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
│       └── cypress-tests.yml    # CI/CD pipeline
├── cypress/
│   ├── e2e/                     # Test specs
│   ├── fixtures/                # Test data
│   ├── page-actions/            # Page action helpers
│   ├── page-objects/            # Page object models
│   └── support/                 # Custom commands
├── scripts/
│   ├── create-jira-bugs.ts      # Jira integration script (TypeScript)
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
- `specPattern` - Test file patterns
- `viewportWidth/Height` - Browser viewport size
- `defaultCommandTimeout` - Command timeout duration
- `video` - Video recording on/off

### Allure Configuration

Allure settings in `cypress.config.ts`:
- `resultsDir` - Where to store results
- `allureReuseAfterSpec` - Reuse report between specs

## 📊 Viewing Reports

### Local Allure Report

```bash
npm run allure:report
```

### GitHub Pages (after CI runs)

Visit: `https://<username>.github.io/<repo-name>/allure-report`

## 🛠 Development

### Adding New Tests

1. Create a new spec file in `cypress/e2e/`
2. Use page objects from `cypress/page-objects/`
3. Use page actions from `cypress/page-actions/`
4. Run tests to verify

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
| `npm run test:allure` | Run tests with Allure reporting |
| `npm run browser:chrome` | Run tests in headed Chrome |
| `npm run allure:report` | Generate and open Allure report |
| `npm run allure:clean` | Clean previous results |
| `npm run jira:create-bugs` | Create Jira bugs from failures |
| `npm run jira:dry-run` | Test Jira integration without creating issues |
| `npm run test:ci` | Full CI pipeline (clean, test, create bugs) |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests locally
5. Submit a pull request

## 📄 License

MIT
