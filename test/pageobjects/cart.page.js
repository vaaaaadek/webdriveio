import page from './page.js';

class CartPage extends page {
    get title() { return $('.title'); }
    get cartItems() { return $$('.cart_item'); }
    get checkoutButton() { return $('#checkout'); }
    get continueShoppingButton() { return $('#continue-shopping'); }

    async assertCartPageLoaded() {
        await expect(this.title).toBeDisplayed();
        await expect(this.title).toHaveText('Your Cart');
        await expect(this.cartItems).toBeElementsArrayOfSize({ gte: 0 });
    }

    async assertCartItemsLoaded(itemsCount) { // Verify cart has at least the expected number of items
        const cartItems = await this.cartItems;
        expect(cartItems.length).toBeGreaterThan(itemsCount - 1);

        for (const item of cartItems) {
            await expect(item).toBeDisplayed();
            await expect(item.$('.inventory_item_name')).toBeDisplayed();
            await expect(item.$('.inventory_item_price')).toBeDisplayed();
            await expect(item.$('.cart_quantity')).toBeDisplayed();
        }
    }

    async verifyCartItemsDetails(items) { // Verify cart items match expected details
        const cartItems = await this.cartItems;
        expect(cartItems.length).toBe(items.length);
        
        for (let i = 0; i < items.length; i++) {
            const item = cartItems[i];
            
            await expect(await item.$('.inventory_item_name').getText()).toBe(items[i].productName);
            await expect(await item.$('.inventory_item_price').getText()).toBe(items[i].productPrice);
        }
    }

    async getCartItemsCount() {
        return (await this.cartItems).length;
    }

    async proceedToCheckout() {
        await this.checkoutButton.click();
    }

    async continueShopping() {
        await this.continueShoppingButton.click();
    }
}

export default new CartPage();