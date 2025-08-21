import loginPage from '../pageobjects/login.page.js';
import inventoryPage from '../pageobjects/inventory.page.js';
import cartPage from '../pageobjects/cart.page.js';

describe('Inventory', () => {
    beforeEach(async () => {
        await loginPage.open();
        await loginPage.login(loginPage.username, loginPage.password);
        await inventoryPage.assertInventoryPageLoaded();
        await inventoryPage.expectCartDisplayedProperly(0); // Ensure cart is empty before tests
    });
    
    it('Logout', async () => {
        await inventoryPage.logoutAndVerify();        
        await loginPage.assertLoginPageLoaded();
    });

    it('Saving the cart after logout', async () => {
        const products = []; // Array to hold product details
        // products.push(await inventoryPage.addProductToCart(0)); // Add first product to cart
        // products.push(await InventoryPage.addProductToCart(1)); // Add second product to cart
        
        // await browser.pause(2000); // Pause to ensure cart icon is updated

        await inventoryPage.expectCartDisplayedProperly(products.length);


        await inventoryPage.logoutAndVerify();
        await loginPage.assertLoginPageLoaded();

        await loginPage.loginAndVerify(loginPage.username, loginPage.password);
        await inventoryPage.assertInventoryPageLoaded();

        await inventoryPage.proceedToCart();
        await cartPage.assertCartPageLoaded();
        await cartPage.assertCartItemsLoaded(products.length);
        await cartPage.verifyCartItemsDetails(products); //now it verifies all items in the cart

    });
    
    it('Sorting', async () => {
        await inventoryPage.assertProductSortOptionsLoaded();
        await inventoryPage.assertSortingOPtionsDefined();

        for (const option of await inventoryPage.sortingOptions) {
            await inventoryPage.chooseProductSortOption(option);
            await inventoryPage.verifySortingApplied();
        }        

    });

});

