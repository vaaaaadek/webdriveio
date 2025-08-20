import { browser, expect } from '@wdio/globals'
import LoginPage from '../pageobjects/login.page.js'
import InventoryPage from '../pageobjects/inventory.page.js'

describe('Login page', () => {
    it('should show error with invalid password', async () => {
        await LoginPage.open();
        
        await LoginPage.login('standard_user', 'wrongPass');

        await expect(LoginPage.errorMessage).toBeDisplayed();
        await expect(LoginPage.errorMessage).toHaveText(
            'Epic sadface',
            { containing: true }
        );
        await expect(LoginPage.errorIcon).toBeElementsArrayOfSize({ eq: 2 });
    });
})

