import { $ } from '@wdio/globals'
import Page from './page.js';
import loginPage from './login.page.js';


class InventoryPage extends Page {
    get title() { return $('.title'); }
    get cartIcon() { return $('#shopping_cart_container'); }
    get products() { return $$('.inventory_item'); }    
    get burgerButton() { return $('#react-burger-menu-btn'); }
    get bmMenu() { return $('.bm-menu-wrap'); }
    get bmMenuItem() { return $$('.menu-item'); }
    get logoutButton() { return $('#logout_sidebar_link'); }

    async assertInventoryPageLoaded() {
        await expect(this.title).toBeDisplayed();
        await expect(this.title).toHaveText('Products');
        await expect(this.cartIcon).toBeDisplayed();
        await expect(this.products).toBeElementsArrayOfSize({ gte: 1 });
    }

    async expectVisibleMenuItemsToBe(count) {
        const items = await this.bmMenuItem;
        const visibleItems = [];
        for (const el of items) {
            if (await el.isDisplayed()) {
                visibleItems.push(el);
            }
        }
        expect(visibleItems.length).toBe(count);
    }

    async logoutAndVerify() {
        await this.burgerButton.click();
        expect(this.bmMenu).toBeDisplayed();

        await this.expectVisibleMenuItemsToBe(4);

        expect(this.logoutButton).toBeDisplayed();
        expect(this.logoutButton).toHaveText('Logout');
        await this.logoutButton.click();

        await browser.waitUntil(
            async () => (await browser.getUrl()) === 'https://www.saucedemo.com/',
            { timeout: 5000, timeoutMsg: 'User was not redirected' }
        );

        await loginPage.assertLoginPageLoaded();
    }

    async addProductToCart(productIndex) {
        const product = this.products[productIndex];
        const addButton = await product.$('.btn_inventory');
        await addButton.click();
        expect(await addButton).toHaveText('Remove');
        expect(await product.$('.inventory_item_name')).toBeDisplayed();

        return {
            productIndex: productIndex,
            productName: await product.$('.inventory_item_name').getText(), 
            productPrice: await product.$('.inventory_item_price').getText()
        };
    }

    async removeProductFromCart(productIndex) {
        const product = this.products[productIndex];
        const removeButton = await product.$('.btn_inventory');
        await removeButton.click();
        return removeButton;
    }

    async assertProductRemovedFromCart(productIndex) {
        const product = this.products[productIndex];
        expect(await product.$('.btn_inventory')).toHaveText('Add to cart');
    }

    async proceedToCart() {
        await this.cartIcon.click();
        await browser.waitUntil(
            async () => (await browser.getUrl()) === 'https://www.saucedemo.com/cart.html',
            { timeout: 5000, timeoutMsg: 'User was not redirected to cart page' }
        );
    }

}

export default new InventoryPage();
