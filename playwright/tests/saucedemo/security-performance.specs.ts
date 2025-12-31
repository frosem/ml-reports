import { test } from '@playwright/test';
import { description, epic, feature, parentSuite, Severity, severity, story, subSuite, suite } from 'allure-js-commons';
import { storyLink, testLink } from '@playwright-support/AllureTools';
import { InventoryPageActions } from '@playwright-page-actions/InventoryPageActions';
import { LoginPageActions } from '@playwright-page-actions/LoginPageActions';
import allure from '@fixtures/management/allure-metadata.json';
import urls from '@fixtures/urls.json';
import users from '@fixtures/users.json';

let inventoryPage: InventoryPageActions;
let loginPage: LoginPageActions;

test.beforeEach(async ({ page }) => {
  await parentSuite(allure.parentSuite);
  await suite(allure.testSuites.platform);
  await epic(allure.epics.platform);
  await storyLink('DEV-6');

  inventoryPage = new InventoryPageActions(page);
  loginPage = new LoginPageActions(page);
});

test.describe(allure.features.security.stories.protectedRoutes, () => {
  test.beforeEach(async () => {
    await subSuite(allure.features.security.stories.protectedRoutes);
    await feature(allure.features.security.name);
    await story(allure.features.security.stories.protectedRoutes);
  });

  test('TC-051: should redirect to login when accessing inventory page directly', async ({ page }) => {
    await severity(Severity.CRITICAL);
    await testLink('TC-051');
    await description('Verify that accessing inventory page without login redirects to login page.');
    await page.goto(`${urls.baseUrl}${urls.paths.inventory}`);
    await loginPage.verifyOnLoginPage();
  });
});

test.describe(allure.features.performance.stories.pageLoadTime, () => {
  test.beforeEach(async () => {
    await subSuite(allure.features.performance.stories.pageLoadTime);
    await feature(allure.features.performance.name);
    await story(allure.features.performance.stories.pageLoadTime);
  });

  test('TC-052: should load performance inventory page within acceptable time', async () => {
    test.slow();
    await severity(Severity.NORMAL);
    await testLink('TC-052');
    await description('Verify that inventory page loads within acceptable time (performance).');
    await loginPage.visitLoginPage();
    await loginPage.login(users.valid.performance.username, users.valid.performance.password);
    await inventoryPage.verifyOnInventoryPage();
  });
});
