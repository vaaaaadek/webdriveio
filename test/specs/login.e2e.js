import { browser, expect } from '@wdio/globals'
import LoginPage from '../pageobjects/login.page.js'
import InventoryPage from '../pageobjects/inventory.page.js'

describe('Login', () => {
    beforeEach(async () => {
        await LoginPage.open();
    });

    it('Valid login', async () => {
        await LoginPage.assertLoginPageLoaded();
        await LoginPage.loginAndVerify(LoginPage.username, LoginPage.password);
        await InventoryPage.assertInventoryPageLoaded(); 
    });

    it('Login with invalid password', async () => {
        await LoginPage.login(LoginPage.username, 'wrongPass');

        await LoginPage.assertLoginError();
    });

    it('Login with invalid login', async () => {
        await LoginPage.login('not_standard_user', LoginPage.password);

        await LoginPage.assertLoginError();
    });
})

