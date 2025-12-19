import { InventoryPageActions } from '@cypress-page-actions/InventoryPageActions';
import { LoginPageActions } from '@cypress-page-actions/LoginPageActions';
import errorMessages from '@fixtures/error-messages.json';
import users from '@fixtures/users.json';

beforeEach(() => {
  LoginPageActions.visitLoginPage();
  LoginPageActions.verifyOnLoginPage();
});

describe('SauceDemo - Login Functionality', () => {

  it('should successfully login with valid credentials', () => {
    LoginPageActions.login(
      users.valid.standard.username,
      users.valid.standard.password
    );
    InventoryPageActions.verifyOnInventoryPage();
  });

  it('should display error message with invalid credentials', () => {
    LoginPageActions.login(
      users.invalid.wrongCredentials.username,
      users.invalid.wrongCredentials.password
    );
    LoginPageActions.verifyErrorMessage(errorMessages.login.invalidCredentials);
  });

  it('should display error message with empty username', () => {
    LoginPageActions.enterPasswordInput(users.valid.standard.password);
    LoginPageActions.clickLoginButton();
    LoginPageActions.verifyErrorMessage(errorMessages.login.usernameRequired);
  });

  it('should display error message with empty password', () => {
    LoginPageActions.enterUsernameInput(users.valid.standard.username);
    LoginPageActions.clickLoginButton();
    LoginPageActions.verifyErrorMessage(errorMessages.login.passwordRequired);
  });

  it('should display error message with locked out user', () => {
    LoginPageActions.login(
      users.invalid.lockedOut.username,
      users.invalid.lockedOut.password
    );
    LoginPageActions.verifyErrorMessage(errorMessages.login.lockedOut);
  });
});

