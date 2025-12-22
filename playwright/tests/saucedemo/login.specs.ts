import { test } from '@playwright/test';
import { description, epic, feature, parentSuite, Severity, severity, story, suite } from 'allure-js-commons';
import { storyLink, testLink } from '@playwright-support/AllureTools';
import { InventoryPageActions } from '@playwright-page-actions/InventoryPageActions';
import { LoginPageActions } from '@playwright-page-actions/LoginPageActions';
import allure from '@fixtures/management/allure-metadata.json';
import errorMessages from '@fixtures/error-messages.json';
import users from '@fixtures/users.json';

let inventoryPage: InventoryPageActions;
let loginPage: LoginPageActions;

test.beforeEach(async ({ page }) => {
  await parentSuite(allure.parentSuite);
  await suite(allure.testSuites.authentication);
  await epic(allure.epics.userManagement);
  await feature(allure.features.authentication.name);
  await storyLink('DEV-1');

  loginPage = new LoginPageActions(page);
  inventoryPage = new InventoryPageActions(page);

  await loginPage.visitLoginPage();
  await loginPage.verifyOnLoginPage();
});

test.describe('Sign In to the Store', () => {
  test('should successfully login with valid credentials', async () => {
    await story(allure.features.authentication.stories.validLogin);
    await severity(Severity.CRITICAL);
    await testLink('QA-1');
    await description('Users with valid credentials can access their account.');

    await loginPage.login(
      users.valid.standard.username,
      users.valid.standard.password
    );
    await inventoryPage.verifyOnInventoryPage();
  });

  test.describe('Blocked Sign In', () => {
    test('should display error message with locked out user', async () => {
      await story(allure.features.authentication.stories.accountSecurity);
      await severity(Severity.CRITICAL);
      await testLink('QA-5');
      await description('Locked out users are blocked from accessing the application.');

      await loginPage.login(
        users.invalid.lockedOut.username,
        users.invalid.lockedOut.password
      );
      await loginPage.verifyErrorMessage(errorMessages.login.lockedOut);
    });
  });

  test.describe('Invalid Sign In', () => {
    test.beforeEach(async () => {
      await story(allure.features.authentication.stories.invalidLogin);
      await severity(Severity.NORMAL);
    });

    test('should display error message with invalid credentials', async () => {
      await testLink('QA-2');
      await description('The application rejects sign-in attempts with incorrect username or password.');

      await loginPage.login(
        users.invalid.wrongCredentials.username,
        users.invalid.wrongCredentials.password
      );
      await loginPage.verifyErrorMessage(errorMessages.login.invalidCredentials);
    });

    test('should display error message with empty username', async () => {
      await testLink('QA-3');
      await description('The application requires a username to be entered before signing in.');

      await loginPage.enterPasswordInput(users.valid.standard.password);
      await loginPage.clickOnLoginButton();
      await loginPage.verifyErrorMessage(errorMessages.login.usernameRequired);
    });

    test('should display error message with empty password', async () => {
      await testLink('QA-4');
      await description('The application requires a password to be entered before signing in.');

      await loginPage.enterUsernameInput(users.valid.standard.username);
      await loginPage.clickOnLoginButton();
      await loginPage.verifyErrorMessage(errorMessages.login.passwordRequired);
    });
  });
});

