import loginPage from '../pageobjects/login.page.js'

describe('Login', () => {
    beforeEach(async () => { // Ensure we start from the login page before each test
        await loginPage.open();
    });

    describe('Login with valid credentials', () => {
        it('should login with valid credentials', async () => {
            await loginPage.assertLoginPageLoaded();
            await loginPage.loginAndVerify(loginPage.username, loginPage.password);
        });
    });

    describe('Login with invalid credentials', () => {
        it('should show error for invalid password', async () => {
            await loginPage.login(loginPage.username, 'wrongPass');
            await loginPage.assertLoginError();
        });

        it('should show error for invalid username', async () => {
            await loginPage.login('not_standard_user', loginPage.password);
            await loginPage.assertLoginError();
        });
    });
});

