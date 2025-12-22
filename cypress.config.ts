import { defineConfig } from "cypress";
import { allureCypress } from "allure-cypress/reporter";
import { getAllureConfig } from "@shared/config/allure.config";

export default defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.specs.ts',
    setupNodeEvents(on, config) {
      allureCypress(on, config, getAllureConfig('cypress'));
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
    grepFilterSpecs: true,
  }
});
