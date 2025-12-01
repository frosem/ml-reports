import { defineConfig } from 'cypress';
import { allureCypress } from '@shelex/cypress-allure-plugin';

export default defineConfig({
  e2e: {
    baseUrl: 'https://www.saucedemo.com',
    specPattern: 'cypress/e2e/**/*.{cy,specs.cy}.{js,ts}',
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(on, config) {
      allureCypress(on, config);
      return config;
    },
    env: {
      allureReuseAfterSpec: true,
    },
    video: false,
    screenshotOnRunFailure: true,
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
  },
});
