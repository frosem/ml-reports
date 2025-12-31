/**
 * Login Page Actions
 */
import { type Page } from '@playwright/test';
import { allureStep } from '@playwright-support/AllureTools';
import { BasePage } from '@playwright-core/BasePage';
import { loginPageObjects } from '@page-objects/LoginPageObjects';
import urls from '@fixtures/urls.json';
import users from '@fixtures/users.json';

export class LoginPageActions extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Visit the SauceDemo login page
   */
  @allureStep()
  async visitLoginPage(): Promise<void> {
    await this.navigateTo(`${urls.baseUrl}${urls.paths.login}`);
    await this.verifyOnLoginPage();
  }

  /**
   * Enter username in the username field
   * @param username - The username to enter
   */
  @allureStep('Enter username: {0}')
  async enterUsernameInput(username: string): Promise<void> {
    await this.fill(this.page.getByTestId(loginPageObjects.usernameInputTestId), username);
  }

  /**
   * Enter password in the password field
   * @param password - The password to enter
   */
  @allureStep('Enter password')
  async enterPasswordInput(password: string): Promise<void> {
    await this.fill(this.page.getByTestId(loginPageObjects.passwordInputTestId), password);
  }

  /**
   * Click the login button
   */
  @allureStep()
  async clickOnLoginButton(): Promise<void> {
    await this.click(this.page.getByTestId(loginPageObjects.loginButtonTestId));
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
    await this.assert.visible(errorContainer);
    const actualMessage = await this.getInnerText(errorContainer);
    await this.assert.attach(expectedMessage, actualMessage);
    await this.assert.containsText(errorContainer, expectedMessage);
  }

  /**
   * Verify user is on the login page
   */
  @allureStep()
  async verifyOnLoginPage(): Promise<void> {
    await this.assert.url(urls.baseUrl);
    await this.assert.visible(this.page.getByTestId(loginPageObjects.loginButtonTestId));
  }
}
