import loginPage from '../pageobjects/login.page.js'
import inventoryPage from '../pageobjects/inventory.page.js'

describe('Login', () => {
    beforeEach(async () => {
        await loginPage.open();
    });

    it('Valid login', async () => {
        await loginPage.assertLoginPageLoaded();
        await loginPage.loginAndVerify(loginPage.username, loginPage.password);
        await inventoryPage.assertInventoryPageLoaded(); 
    });

    it('Login with invalid password', async () => {
        await loginPage.login(loginPage.username, 'wrongPass');

        await loginPage.assertLoginError();
    });

    it('Login with invalid login', async () => {
        await loginPage.login('not_standard_user', loginPage.password);

        await loginPage.assertLoginError();
    });
});

