import "@shared/config/env.config";
import { allureCypress } from "allure-cypress/reporter";
import { defineConfig } from "cypress";
import { getAllureConfig } from "@shared/config/allure.config";
import cypressSplit from "cypress-split";

export default defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.specs.ts',
    setupNodeEvents(on, config) {
      allureCypress(on, config, getAllureConfig('cypress'));
      require('@cypress/grep/plugin').plugin(config);
      cypressSplit(on, config);
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
    // When running test with tags like --env grepTags="@smoke":
    /* Don't run spec files that have no tests matching the tag */
    grepFilterSpecs: true,
    /* Only show executed tests in results, hide the rest entirely */
    grepOmitFiltered: true,
  }
});
