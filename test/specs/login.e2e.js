import { browser, expect } from '@wdio/globals'
import LoginPage from '../pageobjects/login.page.js'
import InventoryPage from '../pageobjects/inventory.page.js'

describe('Login', () => {
    beforeEach(async () => {
        await LoginPage.open();
    });

    it('Valid login', async () => {
        const currentUrl = await browser.getUrl();

        await LoginPage.login('standard_user', 'secret_sauce');

        await browser.waitUntil(
            async () => (await browser.getUrl()) !== currentUrl,
            { timeout: 5000, timeoutMsg: 'User was not redirected' }
        );

        await expect(InventoryPage.title).toBeDisplayed();        
        await expect(InventoryPage.title).toHaveText('Products');
        await expect(InventoryPage.cartIcon).toBeDisplayed();
        await expect(InventoryPage.products).toBeElementsArrayOfSize({ gte: 1 });        

    });

    it('Login with invalid password', async () => {
        await LoginPage.login('standard_user', 'wrongPass');

        await expect(LoginPage.inputUsername).toHaveElementClass('error');
        await expect(LoginPage.inputPassword).toHaveElementClass('error');

        await expect(LoginPage.errorMessage).toBeDisplayed();
        await expect(LoginPage.errorMessage).toHaveText(
            'Epic sadface',
            { containing: true }
        );
        await expect(LoginPage.errorIcon).toBeElementsArrayOfSize({ eq: 2 });
    });

    it('Login with invalid login', async () => {
        await LoginPage.login('not_standard_user', 'secret_sauce');

        await expect(LoginPage.inputUsername).toHaveElementClass('error');
        await expect(LoginPage.inputPassword).toHaveElementClass('error');

        await expect(LoginPage.errorMessage).toBeDisplayed();
        await expect(LoginPage.errorMessage).toHaveText(
            'Epic sadface',
            { containing: true }
        );
        await expect(LoginPage.errorIcon).toBeElementsArrayOfSize({ eq: 2 });
    });
})

