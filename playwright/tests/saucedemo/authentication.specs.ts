import { test } from '@playwright/test';
import { description, epic, feature, parentSuite, Severity, severity, story, subSuite, suite } from 'allure-js-commons';
import { storyLink, testLink } from '@playwright-support/AllureTools';
import { HeaderPageActions } from '@playwright-page-actions/HeaderPageActions';
import { InventoryPageActions } from '@playwright-page-actions/InventoryPageActions';
import { LoginPageActions } from '@playwright-page-actions/LoginPageActions';
import allure from '@fixtures/management/allure-metadata.json';
import messages from '@fixtures/messages.json';
import users from '@fixtures/users.json';

let headerPage: HeaderPageActions;
let inventoryPage: InventoryPageActions;
let loginPage: LoginPageActions;

test.beforeEach(async ({ page }) => {
  await parentSuite(allure.parentSuite);
  await suite(allure.testSuites.authentication);
  await epic(allure.epics.userManagement);
  await feature(allure.features.authentication.name);
  await storyLink('DEV-1');

  headerPage = new HeaderPageActions(page);
  inventoryPage = new InventoryPageActions(page);
  loginPage = new LoginPageActions(page);

  await loginPage.visitLoginPage();
});

test.describe(allure.features.authentication.stories.validLogin, () => {
  test.beforeEach(async () => {
    await subSuite(allure.features.authentication.stories.validLogin);
    await story(allure.features.authentication.stories.validLogin);
    await severity(Severity.CRITICAL);
  });

  test('TC-001: standard user redirects to inventory page after login', async () => {
    await testLink('TC-001');
    await description('Standard user with valid credentials is redirected to inventory page.');

    await loginPage.login(users.valid.standard.username, users.valid.standard.password);
    await inventoryPage.verifyOnInventoryPage();
  });

  test('TC-002: problem user redirects to inventory page after login', async () => {
    await testLink('TC-002');
    await description('Problem user with valid credentials is redirected to inventory page.');

    await loginPage.login(users.valid.problem.username, users.valid.problem.password);
    await inventoryPage.verifyOnInventoryPage();
  });

  test('TC-003: performance glitch user redirects to inventory page after login', async ({ page }) => {
    // Performance glitch user intentionally delays responses - increase timeout
    page.setDefaultTimeout(30000);
    await testLink('TC-003');
    await description('Performance glitch user is redirected to inventory page (delayed response expected).');

    await loginPage.login(users.valid.performance.username, users.valid.performance.password);
    await inventoryPage.verifyOnInventoryPage();
  });

  test('TC-004: error user redirects to inventory page after login', async () => {
    await testLink('TC-004');
    await description('Error user with valid credentials is redirected to inventory page.');

    await loginPage.login(users.valid.error.username, users.valid.error.password);
    await inventoryPage.verifyOnInventoryPage();
  });

  test('TC-005: visual user redirects to inventory page after login', async () => {
    await testLink('TC-005');
    await description('Visual user with valid credentials is redirected to inventory page.');

    await loginPage.login(users.valid.visual.username, users.valid.visual.password);
    await inventoryPage.verifyOnInventoryPage();
  });
});

test.describe(allure.features.authentication.stories.invalidLogin, () => {
  test.beforeEach(async () => {
    await subSuite(allure.features.authentication.stories.invalidLogin);
    await story(allure.features.authentication.stories.invalidLogin);
    await severity(Severity.NORMAL);
  });

  test('TC-006: should display error with wrong password', async () => {
    await testLink('TC-006');
    await description('Verify that login fails with correct username but wrong password.');

    await loginPage.login(users.valid.standard.username, 'wrong_password');
    await loginPage.verifyErrorMessage(messages.login.invalidCredentials);
  });

  test('TC-007: should display error with wrong username', async () => {
    await testLink('TC-007');
    await description('Verify that login fails with incorrect username.');

    await loginPage.login(users.invalid.wrongCredentials.username, users.invalid.wrongCredentials.password);
    await loginPage.verifyErrorMessage(messages.login.invalidCredentials);
  });

  test('TC-008: should display error with empty username', async () => {
    await testLink('TC-008');
    await description('Verify that login fails when username is not provided.');

    await loginPage.enterPasswordInput(users.valid.standard.password);
    await loginPage.clickOnLoginButton();
    await loginPage.verifyErrorMessage(messages.login.usernameRequired);
  });

  test('TC-009: should display error with empty password', async () => {
    await testLink('TC-009');
    await description('Verify that login fails when password is not provided.');

    await loginPage.enterUsernameInput(users.valid.standard.username);
    await loginPage.clickOnLoginButton();
    await loginPage.verifyErrorMessage(messages.login.passwordRequired);
  });
});

test.describe(allure.features.authentication.stories.accountSecurity, () => {
  test.beforeEach(async () => {
    await subSuite(allure.features.authentication.stories.accountSecurity);
    await story(allure.features.authentication.stories.accountSecurity);
  });

  test('TC-010: should block locked out user', async () => {
    await severity(Severity.CRITICAL);
    await testLink('TC-010');
    await description('Verify that a locked out user cannot access the application.');

    await loginPage.login(users.invalid.lockedOut.username, users.invalid.lockedOut.password);
    await loginPage.verifyErrorMessage(messages.login.lockedOut);
  });
});

test.describe(allure.features.authentication.stories.logout, () => {
  test.beforeEach(async () => {
    await subSuite(allure.features.authentication.stories.logout);
    await story(allure.features.authentication.stories.logout);
  });

  test('TC-011: logout redirects to login page', async () => {
    await severity(Severity.CRITICAL);
    await testLink('TC-011');
    await description('User is redirected to login page after clicking logout.');

    await loginPage.login();
    await inventoryPage.verifyOnInventoryPage();
    await headerPage.logout();
    await headerPage.verifyLoggedOut();
    await loginPage.verifyOnLoginPage();
  });
});

test.describe(allure.features.authentication.stories.sessionManagement, () => {
  test.beforeEach(async () => {
    await subSuite(allure.features.authentication.stories.sessionManagement);
    await story(allure.features.authentication.stories.sessionManagement);
  });

  test('TC-012: should persist session after page refresh', async () => {
    await severity(Severity.NORMAL);
    await testLink('TC-012');
    await description('Verify that user session persists after refreshing the page.');

    await loginPage.login();
    await inventoryPage.verifyOnInventoryPage();
    await loginPage.page.reload();
    await inventoryPage.verifyOnInventoryPage();
  });
});
