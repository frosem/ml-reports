import { storyLink, testLink } from '@cypress-support/AllureTools';
import { description, epic, feature, Severity, severity, story } from 'allure-js-commons';
import { InventoryPageActions } from '@cypress-page-actions/InventoryPageActions';
import { LoginPageActions } from '@cypress-page-actions/LoginPageActions';
import allure from '@fixtures/management/allure-metadata.json';
import errorMessages from '@fixtures/error-messages.json';
import users from '@fixtures/users.json';

beforeEach(() => {
  epic(allure.epics.userManagement);
  feature(allure.features.authentication.name);
  storyLink('DEV-1');

  LoginPageActions.visitLoginPage();
  LoginPageActions.verifyOnLoginPage();
});

describe(allure.parentSuite, () => {
  describe(allure.testSuites.authentication, () => {
    describe('Sign In to the Store', () => {
      it('should successfully login with valid credentials', () => {
        story(allure.features.authentication.stories.validLogin);
        severity(Severity.CRITICAL);
        testLink('QA-1');
        description('Users with valid credentials can access their account.');

        LoginPageActions.login(
          users.valid.standard.username,
          users.valid.standard.password
        );
        InventoryPageActions.verifyOnInventoryPage();
      });

      describe('Blocked Sign In', () => {
        it('should display error message with locked out user', () => {
          story(allure.features.authentication.stories.accountSecurity);
          severity(Severity.CRITICAL);
          testLink('QA-5');
          description('Locked out users are blocked from accessing the application.');

          LoginPageActions.login(
            users.invalid.lockedOut.username,
            users.invalid.lockedOut.password
          );
          LoginPageActions.verifyErrorMessage(errorMessages.login.lockedOut);
        });
      });

      describe('Invalid Sign In', () => {
        beforeEach(() => {
          story(allure.features.authentication.stories.invalidLogin);
          severity(Severity.NORMAL);
        });

        it('should display error message with invalid credentials', () => {
          testLink('QA-2');
          description('The application rejects sign-in attempts with incorrect username or password.');

          LoginPageActions.login(
            users.invalid.wrongCredentials.username,
            users.invalid.wrongCredentials.password
          );
          LoginPageActions.verifyErrorMessage(errorMessages.login.invalidCredentials);
        });

        it('should display error message with empty username', () => {
          testLink('QA-3');
          description('The application requires a username to be entered before signing in.');

          LoginPageActions.enterPasswordInput(users.valid.standard.password);
          LoginPageActions.clickOnLoginButton();
          LoginPageActions.verifyErrorMessage(errorMessages.login.usernameRequired);
        });

        it('should display error message with empty password', () => {
          testLink('QA-4');
          description('The application requires a password to be entered before signing in.');

          LoginPageActions.enterUsernameInput(users.valid.standard.username);
          LoginPageActions.clickOnLoginButton();
          LoginPageActions.verifyErrorMessage(errorMessages.login.passwordRequired);
        });
      });
    });
  });
});
