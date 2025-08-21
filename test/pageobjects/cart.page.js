import { $, expect } from '@wdio/globals'
import Page from './page.js';
import InventoryPage from './inventory.page.js';

class CartPage extends Page {
    get title() { return $('.title'); }
    get cartItems() { return $$('.cart_item'); }
    get checkoutButton() { return $('#checkout'); }
    get continueShoppingButton() { return $('#continue-shopping'); }

    async assertCartPageLoaded() {
        await expect(this.title).toBeDisplayed();
        await expect(this.title).toHaveText('Your Cart');
        await expect(this.cartItems).toBeElementsArrayOfSize({ gte: 0 });
    }

    async assertCartItemsLoaded(itemsCount) {
        const cartItems = await this.cartItems;
        expect(cartItems.length).toBeGreaterThan(itemsCount - 1);

        for (const item of cartItems) {
            await expect(item).toBeDisplayed();
            await expect(item.$('.inventory_item_name')).toBeDisplayed();
            await expect(item.$('.inventory_item_price')).toBeDisplayed();
            await expect(item.$('.cart_quantity')).toBeDisplayed();
        }
    }

    async verifyCartItemsDetails(items) {
        const cartItems = await this.cartItems;
        expect(cartItems.length).toBe(items.length);
        
        for (let i = 0; i < items.length; i++) {
            const item = cartItems[i];
            
            expect(await item.$('.inventory_item_name').getText()).toBe(items[i].productName);
            expect(await item.$('.inventory_item_price').getText()).toBe(items[i].productPrice);
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