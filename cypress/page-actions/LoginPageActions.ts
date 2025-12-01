/**
 * Login Page Actions
 * Application actions for the Login page using LoginPageObjects
 */
import { loginPageObjects } from '../page-objects/LoginPageObjects';
import urls from '../fixtures/urls.json';
import users from '../fixtures/users.json';

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
  static enterUsername(username: string): void {
    cy.get(loginPageObjects.usernameInput).type(username);
  }

  /**
   * Enter password in the password field
   * @param password - The password to enter
   */
  static enterPassword(password: string): void {
    cy.get(loginPageObjects.passwordInput).type(password);
  }

  /**
   * Click the login button
   */
  static clickLoginButton(): void {
    cy.get(loginPageObjects.loginButton).click();
  }

  /**
   * Perform complete login action
   * @param username - The username to login with (optional, defaults to standard user)
   * @param password - The password to login with (optional, defaults to standard user password)
   */
  static login(username?: string, password?: string): void {
    const loginUsername = username ?? users.valid.standard.username;
    const loginPassword = password ?? users.valid.standard.password;
    LoginPageActions.enterUsername(loginUsername);
    LoginPageActions.enterPassword(loginPassword);
    LoginPageActions.clickLoginButton();
  }

  /**
   * Verify error message is displayed
   * @param expectedMessage - The expected error message text
   */
  static verifyErrorMessage(expectedMessage: string): void {
    cy.get(loginPageObjects.errorMessageContainer)
      .should('be.visible')
      .and('contain.text', expectedMessage);
  }

  /**
   * Verify user is on the login page
   */
  static verifyOnLoginPage(): void {
    cy.get(loginPageObjects.usernameInput).should('be.visible');
    cy.get(loginPageObjects.passwordInput).should('be.visible');
    cy.get(loginPageObjects.loginButton).should('be.visible');
  }
}
