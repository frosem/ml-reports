/**
 * Login Page Actions
 * Application actions for the Login page using LoginPageObjects
 */
import { type Page } from '@playwright/test';
import { allureStep, attachAssertion, expect } from '@playwright-support/AllureTools';
import { loginPageObjects } from '@page-objects/LoginPageObjects';
import urls from '@fixtures/urls.json';
import users from '@fixtures/users.json';

export class LoginPageActions {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Visit the SauceDemo login page
   */
  @allureStep()
  async visitLoginPage(): Promise<void> {
    await this.page.goto(`${urls.baseUrl}${urls.paths.login}`);
  }

  /**
   * Enter username in the username field
   * @param username - The username to enter
   */
  @allureStep('Enter username: {0}')
  async enterUsernameInput(username: string): Promise<void> {
    await this.page.getByTestId(loginPageObjects.usernameInputTestId).fill(username);
  }

  /**
   * Enter password in the password field
   * @param password - The password to enter
   */
  @allureStep('Enter password')
  async enterPasswordInput(password: string): Promise<void> {
    await this.page.getByTestId(loginPageObjects.passwordInputTestId).fill(password);
  }

  /**
   * Click the login button
   */
  @allureStep()
  async clickOnLoginButton(): Promise<void> {
    await this.page.getByTestId(loginPageObjects.loginButtonTestId).click();
  }

  /**
   * Perform complete login action
   * @param username - The username to login with (optional, defaults to standard user)
   * @param password - The password to login with (optional, defaults to standard user password)
   */
  @allureStep('Login as: {0}')
  async login(username?: string, password?: string): Promise<void> {
    const loginUsername = username ?? users.valid.standard.username;
    const loginPassword = password ?? users.valid.standard.password;
    await this.enterUsernameInput(loginUsername);
    await this.enterPasswordInput(loginPassword);
    await this.clickOnLoginButton();
  }

  /**
   * Verify error message is displayed
   * @param expectedMessage - The expected error message text
   */
  @allureStep('{0}')
  async verifyErrorMessage(expectedMessage: string): Promise<void> {
    const errorContainer = this.page.getByTestId(loginPageObjects.errorMessageContainerTestId);
    await expect(errorContainer).toBeVisible();
    const actualMessage = await errorContainer.innerText();
    await attachAssertion(expectedMessage, actualMessage);
    await expect(errorContainer).toContainText(expectedMessage);
  }

  /**
   * Verify user is on the login page
   */
  @allureStep()
  async verifyOnLoginPage(): Promise<void> {
    await expect(this.page.getByTestId(loginPageObjects.usernameInputTestId)).toBeVisible();
    await expect(this.page.getByTestId(loginPageObjects.passwordInputTestId)).toBeVisible();
    await expect(this.page.getByTestId(loginPageObjects.loginButtonTestId)).toBeVisible();
  }
}
