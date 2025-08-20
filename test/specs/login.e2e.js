import { browser, expect } from '@wdio/globals'
import LoginPage from '../pageobjects/login.page.js'
import InventoryPage from '../pageobjects/inventory.page.js'

describe('Login page', () => {
    it('should login with valid credentials', async () => {
        await LoginPage.open();

        await LoginPage.login('standard_user', 'secret_sauce');

        await expect(InventoryPage.title).toHaveText('Products');
        await expect(InventoryPage.cartIcon).toBeDisplayed();
        await expect(InventoryPage.products).toBeElementsArrayOfSize({ gte: 1 });        

    })
})

