import { LoginPageActions } from '../../page-actions/LoginPageActions';
import { InventoryPageActions } from '../../page-actions/InventoryPageActions';
import users from '../../fixtures/users.json';

describe('SauceDemo - Login Functionality', () => {
  beforeEach(() => {
    LoginPageActions.visitLoginPage();
  });

  it('should successfully login with valid credentials', () => {
    LoginPageActions.login(users.valid.standard.username, users.valid.standard.password);
    InventoryPageActions.verifyOnInventoryPage();
  });
});
