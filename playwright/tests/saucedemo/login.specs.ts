import { test } from '@playwright/test';
import { InventoryPageActions } from '@playwright-page-actions/InventoryPageActions';
import { LoginPageActions } from '@playwright-page-actions/LoginPageActions';
import errorMessages from '@fixtures/error-messages.json';
import users from '@fixtures/users.json';

let loginPage: LoginPageActions;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPageActions(page);
  await loginPage.visitLoginPage();
  await loginPage.verifyOnLoginPage();
});

test.describe('SauceDemo - Login Functionality', () => {

  test('should successfully login with valid credentials', async ({ page }) => {
    const inventoryPage = new InventoryPageActions(page);

    await loginPage.login(
      users.valid.standard.username,
      users.valid.standard.password
    );
    await inventoryPage.verifyOnInventoryPage();
  });

  test('should display error message with invalid credentials', async () => {
    await loginPage.login(
      users.invalid.wrongCredentials.username,
      users.invalid.wrongCredentials.password
    );
    await loginPage.verifyErrorMessage(errorMessages.login.invalidCredentials);
  });

  test('should display error message with empty username', async () => {
    await loginPage.enterPasswordInput(users.valid.standard.password);
    await loginPage.clickLoginButton();
    await loginPage.verifyErrorMessage(errorMessages.login.usernameRequired);
  });

  test('should display error message with empty password', async () => {
    await loginPage.enterUsernameInput(users.valid.standard.username);
    await loginPage.clickLoginButton();
    await loginPage.verifyErrorMessage(errorMessages.login.passwordRequired);
  });

  test('should display error message with locked out user', async () => {
    await loginPage.login(
      users.invalid.lockedOut.username,
      users.invalid.lockedOut.password
    );
    await loginPage.verifyErrorMessage(errorMessages.login.lockedOut);
  });
});
