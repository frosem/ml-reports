# ML Cypress Testing

## About

This project provides automation testing examples for [SauceDemo](https://www.saucedemo.com/), a demonstration e-commerce website designed for practicing test automation. The project is built with **Cypress** as the testing framework, **TypeScript** for type-safe code, and **Allure Reports** for comprehensive test reporting and visualization.

## Getting Started

### Prerequisites

Ensure you have the following installed on your system:

- **Node.js** (version 14 or higher recommended)
- **npm** (comes with Node.js)

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/frosem/ml-cypress-testing.git
   cd ml-cypress-testing
   ```

2. Install project dependencies:
   ```bash
   npm install
   ```

3. Verify installation:
   ```bash
   npx cypress verify
   ```

## Running Tests

### Run Tests with Allure Reporting

Run all SauceDemo tests with Allure reporting enabled:

```bash
npm run test:allure
```

This command runs tests in Chrome browser with Allure report generation.

### Run Tests in Browser (Headed Mode)

To watch tests execute in the browser:

```bash
npm run browser:chrome
```

This opens Chrome in headed mode, allowing you to see tests run in real-time.

## Viewing Test Reports

### Generate and View Allure Report

After running tests, generate and automatically open the Allure report:

```bash
npm run allure:report
```

This command will:
- Generate the Allure report from test results
- Automatically open the report in your default browser

The report displays:
- Test execution summary with pass/fail statistics
- Detailed test results with steps and timings
- Screenshots and error details for failed tests
- Test history and trends
- Categorized failures

## Application Context

**SauceDemo** is a sample e-commerce web application that simulates a real online shopping experience. The application includes:

- User authentication with multiple test accounts
- Product inventory browsing
- Shopping cart management
- Checkout workflow
- Order completion

This project demonstrates end-to-end testing patterns for these features using Page Object Model and Application Actions patterns.

## Technologies Used

- **Cypress** - Fast, modern end-to-end testing framework
- **TypeScript** - Adds type safety and better IDE support
- **Allure** - Beautiful and informative test reports
- **@shelex/cypress-allure-plugin** - Integration between Cypress and Allure
- **allure-cypress** - Allure reporter for Cypress

## Project Structure

```
ml-cypress-testing/
├── cypress/
│   ├── e2e/
│   │   └── saucedemo/     # SauceDemo test specifications
│   ├── fixtures/          # Test data (users, products, URLs)
│   ├── page-actions/      # Application actions layer
│   ├── page-objects/      # Page element locators
│   └── support/           # Custom commands and configuration
├── cypress.config.ts      # Cypress configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
```

## Resources

- [SauceDemo Website](https://www.saucedemo.com/)
- [Cypress Documentation](https://docs.cypress.io/)
- [Allure Report Documentation](https://docs.qameta.io/allure/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
