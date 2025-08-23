import loginPage from '../pageobjects/login.page.js';
import inventoryPage from '../pageobjects/inventory.page.js';
import cartPage from '../pageobjects/cart.page.js';
import checkoutPage from '../pageobjects/checkout.page.js';

describe('Checkout', () => {
    beforeEach(async () => { // Ensure user is logged in before each test
            await loginPage.open();
            await loginPage.loginAndVerify(loginPage.username, loginPage.password);
            await inventoryPage.expectCartDisplayedProperly(0); // Ensure cart is empty before tests
    });
    
    describe('Valid checkout flow', () => {
        it('should complete checkout successfully with multiple products', async () => { 
            let products = []; // Array to hold product details
            products.push(await inventoryPage.addProductToCart(0)); // Add first product to cart
            products.push(await inventoryPage.addProductToCart(1)); // Add second product to cart
            
            await inventoryPage.expectCartDisplayedProperly(products.length);
            
            await inventoryPage.proceedToCart();
            await cartPage.assertCartItemsLoaded(products.length);
            await cartPage.verifyCartItemsDetails(products); //now it verifies all items in the cart

            await cartPage.proceedToCheckout();
            await checkoutPage.assertCheckoutPageLoaded();
            
            await checkoutPage.fillCheckoutForm('John', 'Doe', '12345');
            await checkoutPage.continue();
            await checkoutPage.assertCheckoutOverviewPageLoaded();

            await checkoutPage.verifyCheckoutItemsDetails(products); // Verify items in overview match cart
            await checkoutPage.finish(); 
            await checkoutPage.assertCheckoutCompletePageLoaded();       
            
            await checkoutPage.backHome();
            await inventoryPage.expectCartDisplayedProperly(0); // Ensure cart is empty after checkout
        });
    });

    describe('Checkout with empty cart', () => {
        it('should display "cart is empty" error message', async () => { 
            await inventoryPage.proceedToCart();
            await cartPage.assertCartItemsLoaded(0);
            await cartPage.expectCartEmptyError(); 
        });
    });

    describe('Continue shopping from cart', () => {
        it('should return to inventory page when "Continue Shopping" is clicked', async () => { 
            await inventoryPage.addProductToCart(0); // Add a product to ensure cart is not empty
            await inventoryPage.expectCartDisplayedProperly(1);
            
            await inventoryPage.proceedToCart();
            await cartPage.assertCartItemsLoaded(1);
            
            await cartPage.continueShopping();
            await inventoryPage.assertInventoryPageLoaded(); // Verify redirection to inventory page
        });
    });

});

