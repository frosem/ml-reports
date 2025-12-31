/**
 * Login Page Actions
 * Application actions for the Login page using LoginPageObjects
 */
import { allureStep, attachAssertion } from '@cypress-support/AllureTools';
import { loginPageObjects } from '@page-objects/LoginPageObjects';
import urls from '@fixtures/urls.json';
import users from '@fixtures/users.json';

export class LoginPageActions {
  /**
   * Visit the SauceDemo login page
   */
  @allureStep()
  static visitLoginPage(): void {
    cy.visit(`${urls.baseUrl}${urls.paths.login}`);
    this.verifyOnLoginPage();
  }

  /**
   * Enter username in the username field
   * @param username - The username to enter
   */
  @allureStep('Enter username: {0}')
  static enterUsernameInput(username: string): void {
    cy.findByTestId(loginPageObjects.usernameInputTestId).type(username);
  }

  /**
   * Enter password in the password field
   * @param password - The password to enter
   */
  @allureStep('Enter password')
  static enterPasswordInput(password: string): void {
    cy.findByTestId(loginPageObjects.passwordInputTestId).type(password);
  }

  /**
   * Click the login button
   */
  @allureStep()
  static clickOnLoginButton(): void {
    cy.findByTestId(loginPageObjects.loginButtonTestId).click();
  }

  /**
   * Perform complete login action
   * @param username - The username to login with (optional, defaults to standard user)
   * @param password - The password to login with (optional, defaults to standard user password)
   */
  @allureStep('Login as: {0}')
  static login(username?: string, password?: string): void {
    const loginUsername = username ?? users.valid.standard.username;
    const loginPassword = password ?? users.valid.standard.password;
    this.enterUsernameInput(loginUsername);
    this.enterPasswordInput(loginPassword);
    this.clickOnLoginButton();
  }

  /**
   * Verify error message is displayed
   * @param expectedMessage - The expected error message text
   */
  @allureStep('{0}')
  static verifyErrorMessage(expectedMessage: string): void {
    cy.findByTestId(loginPageObjects.errorMessageContainerTestId)
      .should('be.visible')
      .invoke('text')
      .then((actualMessage) => {
        attachAssertion(expectedMessage, actualMessage);
        expect(actualMessage).to.contain(expectedMessage);
      });
  }

  /**
   * Verify user is on the login page
   */
  @allureStep()
  static verifyOnLoginPage(): void {
    cy.url().should('eq', `${urls.baseUrl}${urls.paths.login}`);
    cy.findByTestId(loginPageObjects.loginButtonTestId).should('be.visible');
  }
}
