import { defineConfig } from "cypress";
import allureWriter from "@shelex/cypress-allure-plugin/writer";
import { allureCypress } from "allure-cypress/reporter";

export default defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.specs.cy.ts',
    setupNodeEvents(on, config) {
      allureWriter(on, config);
      allureCypress(on, {
        resultsDir: "allure-results"
      });
      return config;
    },
  },
  video: true,
  viewportHeight: 720,
  viewportWidth: 1280,
  responseTimeout: 35000,
  chromeWebSecurity: false,
  screenshotOnRunFailure: true,
  defaultCommandTimeout: 35000,
  experimentalMemoryManagement: true,
  env: {
    allureReuseAfterSpec: true,
    grepFilterSpecs: true
  }
});
