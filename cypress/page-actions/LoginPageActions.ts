/**
 * Login Page Actions
 * Application actions for the Login page using LoginPageObjects
 */
import { loginPageObjects } from '@page-objects/LoginPageObjects';
import urls from '@fixtures/urls.json';
import users from '@fixtures/users.json';

export class LoginPageActions {
  /**
   * Visit the SauceDemo login page
   */
  static visitLoginPage(): void {
    cy.visit(`${urls.baseUrl}${urls.paths.login}`);
  }

  /**
   * Enter username in the username field
   * @param username - The username to enter
   */
  static enterUsernameInput(username: string): void {
    cy.findByTestId(loginPageObjects.usernameInputTestId).type(username);
  }

  /**
   * Enter password in the password field
   * @param password - The password to enter
   */
  static enterPasswordInput(password: string): void {
    cy.findByTestId(loginPageObjects.passwordInputTestId).type(password);
  }

  /**
   * Click the login button
   */
  static clickLoginButton(): void {
    cy.findByTestId(loginPageObjects.loginButtonTestId).click();
  }

  /**
   * Perform complete login action
   * @param username - The username to login with (optional, defaults to standard user)
   * @param password - The password to login with (optional, defaults to standard user password)
   */
  static login(username?: string, password?: string): void {
    const loginUsername = username ?? users.valid.standard.username;
    const loginPassword = password ?? users.valid.standard.password;
    LoginPageActions.enterUsernameInput(loginUsername);
    LoginPageActions.enterPasswordInput(loginPassword);
    LoginPageActions.clickLoginButton();
  }

  /**
   * Verify error message is displayed
   * @param expectedMessage - The expected error message text
   */
  static verifyErrorMessage(expectedMessage: string): void {
    cy.findByTestId(loginPageObjects.errorMessageContainerTestId)
      .should('be.visible')
      .and('contain.text', expectedMessage);
  }

  /**
   * Verify user is on the login page
   */
  static verifyOnLoginPage(): void {
    cy.findByTestId(loginPageObjects.usernameInputTestId).should('be.visible');
    cy.findByTestId(loginPageObjects.passwordInputTestId).should('be.visible');
    cy.findByTestId(loginPageObjects.loginButtonTestId).should('be.visible');
  }
}
