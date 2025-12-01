# ML Cypress Testing

## Overview

This project contains automated testing examples for [SauceDemo](https://www.saucedemo.com/), a demonstration website designed for practicing test automation. The tests are written in **TypeScript** using **Cypress** as the testing framework, with **Allure Reports** for comprehensive test reporting and visualization.

## Features

- 🎯 **SauceDemo Application**: Automated tests for the SauceDemo e-commerce demo site
- 🔧 **Cypress Framework**: Fast, reliable end-to-end testing framework
- 📊 **Allure Reports**: Beautiful, detailed test reports with rich visualizations
- 📝 **TypeScript**: Type-safe test code for better maintainability and developer experience

## Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (version 14 or higher recommended)
- **npm** or **yarn** package manager

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/frosem/ml-cypress-testing.git
   cd ml-cypress-testing
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

## Usage

### Running Tests

To run the tests in headless mode:
```bash
npm run test
```
or
```bash
npx cypress run
```

To open Cypress Test Runner in interactive mode:
```bash
npm run test:open
```
or
```bash
npx cypress open
```

### Generating Allure Reports

After running the tests, generate and view Allure reports:

1. Generate the report:
   ```bash
   npm run allure:generate
   ```
   or
   ```bash
   allure generate allure-results --clean
   ```

2. Open the report:
   ```bash
   npm run allure:open
   ```
   or
   ```bash
   allure open allure-report
   ```

## Project Structure

```
ml-cypress-testing/
├── cypress/
│   ├── e2e/              # Test files
│   ├── fixtures/         # Test data
│   ├── support/          # Custom commands and utilities
│   └── screenshots/      # Screenshots from test runs
├── allure-results/       # Allure test results (generated)
├── allure-report/        # Allure HTML report (generated)
├── cypress.config.ts     # Cypress configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Project dependencies and scripts
```

## Test Examples

This project demonstrates various automation testing patterns including:
- User authentication flows
- Product browsing and filtering
- Shopping cart functionality
- Checkout processes
- Form validation
- End-to-end user journeys

## Technologies

- **Cypress**: Modern web automation testing framework
- **TypeScript**: Typed superset of JavaScript
- **Allure**: Test report framework for clear test execution visualization
- **Node.js**: JavaScript runtime environment

## Contributing

Feel free to fork this repository and submit pull requests to add more test cases or improve existing ones.

## License

This project is for educational and demonstration purposes.

## Resources

- [SauceDemo](https://www.saucedemo.com/) - The application under test
- [Cypress Documentation](https://docs.cypress.io/)
- [Allure Documentation](https://docs.qameta.io/allure/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
