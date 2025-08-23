import loginPage from '../pageobjects/login.page.js'
import inventoryPage from '../pageobjects/inventory.page.js'

describe('Login', () => {
    beforeEach(async () => { // Ensure we start from the login page before each test
        await loginPage.open();
    });

    it('Valid login', async () => { // Verify login with valid credentials
        await loginPage.assertLoginPageLoaded();
        await loginPage.loginAndVerify(loginPage.username, loginPage.password);
    });

    it('Login with invalid password', async () => { // Verify login with invalid password
        await loginPage.login(loginPage.username, 'wrongPass');
        await loginPage.assertLoginError();
    });

    it('Login with invalid login', async () => { // Verify login with invalid username
        await loginPage.login('not_standard_user', loginPage.password);
        await loginPage.assertLoginError();
    });
});

