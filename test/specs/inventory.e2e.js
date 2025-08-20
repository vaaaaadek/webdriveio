import { browser, expect } from '@wdio/globals'
import LoginPage from '../pageobjects/login.page.js'
import InventoryPage from '../pageobjects/inventory.page.js'

describe('Login', () => {
    beforeEach(async () => {
        await LoginPage.open();
        await LoginPage.login('standard_user', 'secret_sauce');
    });

    it('Logout', async () => {
        await InventoryPage.burgerButton.click();
        expect(InventoryPage.bmMenu).toBeDisplayed();
        
        const items = await InventoryPage.bmMenuItem;
        const visibleItems = [];
        for (const el of items) {
            if (await el.isDisplayed()) {
                visibleItems.push(el);
            }
        }
        expect(visibleItems.length).toBe(4);
        
        expect(InventoryPage.logoutButton).toBeDisplayed();
        expect(InventoryPage.logoutButton).toHaveText('Logout');
        await InventoryPage.logoutButton.click();

        await browser.waitUntil(
            async () => (await browser.getUrl()) === 'https://www.saucedemo.com/',
            { timeout: 5000, timeoutMsg: 'User was not redirected' }
        );
        
        await expect(LoginPage.inputUsername).toBeDisplayed();
        await expect(LoginPage.inputPassword).toBeDisplayed();
        await expect(LoginPage.inputUsername).toHaveText('');
        await expect(LoginPage.inputPassword).toHaveText('');

    });
})

