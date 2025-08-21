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

}

export default new InventoryPage();
