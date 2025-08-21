import { browser, expect } from '@wdio/globals'
import LoginPage from '../pageobjects/login.page.js'
import InventoryPage from '../pageobjects/inventory.page.js'
import CartPage from '../pageobjects/cart.page.js'

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
        const products = []; // Array to hold product details
        products.push(await InventoryPage.addProductToCart(0)); // Add first product to cart
        // products.push(await InventoryPage.addProductToCart(1)); // Add second product to cart
                
        expect(InventoryPage.cartIcon).toBeDisplayed();
        expect(InventoryPage.cartIcon).toHaveText(products.length.toString());

        // await browser.pause(2000); // Pause to ensure cart icon is updated

        await InventoryPage.logoutAndVerify();
        await LoginPage.assertLoginPageLoaded();

        await LoginPage.loginAndVerify(LoginPage.username, LoginPage.password);
        await InventoryPage.assertInventoryPageLoaded();

        await InventoryPage.proceedToCart();
        await CartPage.assertCartPageLoaded();
        await CartPage.assertCartItemsLoaded(products.length);
        await CartPage.verifyCartItemsDetails(products); //now it verifies all items in the cart

    });
})

