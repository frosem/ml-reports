/**
 * Login Page Actions
 * Application actions for the Login page using LoginPageObjects
 */
import { loginPageObjects } from '../page-objects/LoginPageObjects';

export class LoginPageActions {
  /**
   * Visit the SauceDemo login page
   */
  static visitLoginPage(): void {
    cy.visit('https://www.saucedemo.com/');
  }

  /**
   * Perform complete login action
   * @param username - The username to login with
   * @param password - The password to login with
   */
  static login(username: string, password: string): void {
    cy.get(loginPageObjects.usernameInput).type(username);
    cy.get(loginPageObjects.passwordInput).type(password);
    cy.get(loginPageObjects.loginButton).click();
  }
}
