import loginPage from '../pageobjects/login.page.js';
import inventoryPage from '../pageobjects/inventory.page.js';
import cartPage from '../pageobjects/cart.page.js';

describe('Inventory', () => {
    beforeEach(async () => { // Ensure user is logged in before each test
        await loginPage.open();
        await loginPage.loginAndVerify(loginPage.username, loginPage.password);
        await inventoryPage.expectCartDisplayedProperly(0); // Ensure cart is empty before tests
    });

    describe('Logout', () => {
        it('should log out and redirect to login page', async () => {
            await inventoryPage.logoutAndVerify();        
            await loginPage.assertLoginPageLoaded();
        });
    });

    describe('Cart Persistence', () => {
        it('should save the cart after logout and restore after login', async () => {
            let products = []; // Array to hold product details
            products.push(await inventoryPage.addProductToCart(0)); // Add first product to cart
            // products.push(await InventoryPage.addProductToCart(1)); // Add second product to cart

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
    });

    describe('Sorting', () => {
        it('should load and define product sorting options', async () => {
            await inventoryPage.assertProductSortOptionsLoaded();
            await inventoryPage.assertSortingOPtionsDefined();
        });

        it('should apply each product sorting option correctly', async () => {
            for (const option of await inventoryPage.sortingOptions) {
            await inventoryPage.chooseProductSortOption(option);
            await inventoryPage.verifySortingApplied();
            }
        });
    });

    describe('Footer Links', () => {
        it('should verify footer links are displayed correctly', async () => {
            await inventoryPage.verifyFooterLinks();
        });

        it('should verify each social link navigates correctly', async () => {
            for (const link of await inventoryPage.footerLinks) {
            await inventoryPage.goToSocialLink(link); 
            await inventoryPage.assertInventoryPageLoaded(); // Ensure we return to inventory page   
            }
        });
    });

});
