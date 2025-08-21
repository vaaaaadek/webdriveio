import { browser, expect } from '@wdio/globals'
import LoginPage from '../pageobjects/login.page.js'
import InventoryPage from '../pageobjects/inventory.page.js'

describe('Login', () => {
    beforeEach(async () => {
        await LoginPage.open();
        await LoginPage.login(LoginPage.username, LoginPage.password);
    });

    it('Logout', async () => {
        await InventoryPage.logoutAndVerify();        
        await LoginPage.assertLoginPageLoaded();
    });

    it('Saving the cart after logout', async () => {
        const productName = await InventoryPage.products[0].$('.inventory_item_name').getText();

        await InventoryPage.products[0].$('.btn_inventory').click();
        expect(InventoryPage.products[0].$('.btn_inventory')).toHaveText('Remove');
        
        expect (InventoryPage.cartIcon).toBeDisplayed();
        expect (InventoryPage.cartIcon).toHaveText('1');

        await InventoryPage.logoutAndVerify();
        await LoginPage.assertLoginPageLoaded();

        await LoginPage.loginAndVerify(LoginPage.username, LoginPage.password);
        await InventoryPage.assertInventoryPageLoaded();

    });
})

