# ML Cypress Testing

## About

This project provides automation testing examples for [SauceDemo](https://www.saucedemo.com/), a demonstration e-commerce website designed for practicing test automation. The project is built with **Cypress** as the testing framework, **TypeScript** for type-safe code, and **Allure Reports** for comprehensive test reporting and visualization.

## Getting Started

### Prerequisites

Ensure you have the following installed on your system:

- **Node.js** (version 18 or higher recommended)
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

### Interactive Mode

Open Cypress Test Runner in interactive mode to run tests with a visual interface:

```bash
npm run cy:open
```

This will open the Cypress UI where you can select and run individual tests with live reloading.

### Headless Mode

Run all tests in headless mode (useful for CI/CD):

```bash
npm run cy:run
```

or

```bash
npm test
```

## Generating Test Reports

This project uses Allure for generating detailed test execution reports.

### Generate Allure Report

After running tests in headless mode, generate the Allure report:

```bash
npm run allure:report
```

### View Allure Report

Open the generated report in your browser:

```bash
npm run allure:open
```

The report will display:
- Test execution summary
- Detailed test results with steps
- Screenshots and attachments
- Historical trends
- Failed test details

## Application Context

**SauceDemo** is a sample e-commerce web application that simulates a real online shopping experience. The application includes:

- User authentication with multiple test accounts
- Product inventory browsing
- Shopping cart management
- Checkout workflow
- Order completion

This project demonstrates end-to-end testing patterns for these features using modern automation practices.

## Technologies Used

- **Cypress** - Fast, modern end-to-end testing framework
- **TypeScript** - Adds type safety and better IDE support
- **Allure** - Beautiful and informative test reports
- **@shelex/cypress-allure-plugin** - Integration between Cypress and Allure

## Project Structure

```
ml-cypress-testing/
├── cypress/
│   ├── e2e/          # Test specifications
│   ├── fixtures/     # Test data files
│   └── support/      # Custom commands and utilities
├── cypress.config.ts # Cypress configuration
├── tsconfig.json     # TypeScript configuration
└── package.json      # Dependencies and scripts
```

## Resources

- [SauceDemo Website](https://www.saucedemo.com/)
- [Cypress Documentation](https://docs.cypress.io/)
- [Allure Report Documentation](https://docs.qameta.io/allure/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
