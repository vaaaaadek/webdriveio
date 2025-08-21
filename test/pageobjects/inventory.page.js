import page from './page.js';
import loginPage from './login.page.js';

class InventoryPage extends page {
    get title() { return $('.title'); }
    get cartIcon() { return $('#shopping_cart_container'); }
    get products() { return $$('.inventory_item'); }    
    get burgerButton() { return $('#react-burger-menu-btn'); }
    get bmMenu() { return $('.bm-menu-wrap'); }
    get bmMenuItem() { return $$('.menu-item'); }
    get logoutButton() { return $('#logout_sidebar_link'); }
    get productSortContainer() { return $('.product_sort_container'); }
    get sortingOptions() { return this.productSortContainer.$$('option'); }

    get sortStrategies() {
        return {
            'az': { type: 'name', text: 'Name (A to Z)', fn: arr => [...arr].sort() }, // Sort by name A-Z
            'za': { type: 'name', text: 'Name (Z to A)', fn: arr => [...arr].sort().reverse() }, // Sort by name Z-A
            'lohi': { type: 'price', text: 'Price (low to high)', fn: arr => [...arr].sort((a, b) => a - b) }, // Sort by price low to high
            'hilo': { type: 'price', text: 'Price (high to low)', fn: arr => [...arr].sort((a, b) => b - a) }, // Sort by price high to low
        };
    }


    async assertInventoryPageLoaded() {
        await expect(this.title).toBeDisplayed();
        await expect(this.title).toHaveText('Products');
        await expect(this.cartIcon).toBeDisplayed();
        await expect(this.products).toBeElementsArrayOfSize({ gte: 1 });
    }

    async openBurgerMenu() {
        await this.burgerButton.click();
        await expect(this.bmMenu).toBeDisplayed();
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

    async expectCartDisplayedProperly(itemCount) {
        expect(this.cartIcon).toBeDisplayed();
        expect(this.cartIcon).toHaveText(itemCount.toString());
    }

    async assertProductSortOptionsLoaded() {
        expect(this.productSortContainer).toBeDisplayed();

        const options = await this.sortingOptions;
        expect(options.length).toBeGreaterThan(0);
        for (const option of options) {
            expect(await option.getText()).toBeDefined();
        }
    }

    async assertSortingOPtionsDefined() {
        const options = await this.sortingOptions;
        expect(options.length).toBeGreaterThan(0);
        
        for (const option of options) {
            const value = await option.getValue();
            const text = await option.getText();

            expect(value).toBeDefined();
            expect(this.sortStrategies).toHaveProperty(value); // Check if the value exists in sortStrategies
            expect(this.sortStrategies[value].fn).toBeInstanceOf(Function); // Ensure it's a function
            expect(this.sortStrategies[value].type).toBeDefined(); // Ensure type is defined
            expect(this.sortStrategies[value].text).toBeDefined(); // Ensure text is defined
            expect(this.sortStrategies[value].fn([])).toBeInstanceOf(Array); // Ensure it returns an array

            expect(text).toBeDefined();
            expect(text).toBe(this.sortStrategies[value].text); // Ensure the text matches the strategy description
        }
    }

    async chooseProductSortOption(option) {
        const optionValue = await option.getValue();
        
        await this.productSortContainer.click();
        await this.productSortContainer.selectByAttribute('value', optionValue);

        await browser.pause(500); // Wait for sorting to apply
        expect(await this.productSortContainer.getValue()).toBe(optionValue); // Ensure the selected option is correct
    }

    async verifySortingApplied() {
        const selectedValue = await this.productSortContainer.getValue();
        const strategy = await this.sortStrategies[selectedValue];

        const products = await this.products;
        expect(products.length).toBeGreaterThan(0);

        let values = [];

        if (strategy.type === 'name') {
            for (const product of products) {
                const text = (await product.$('.inventory_item_name')).getText();
                values.push(text);
            }
        } else if (strategy.type === 'price') {
            for (const product of products) {
                const priceText = (await product.$('.inventory_item_price')).getText();
                values.push(parseFloat((await priceText).replace('$', '')));
            }
        }

        const sortedValues = strategy.fn(values);
        expect(values).toEqual(sortedValues);
    }

    async logoutAndVerify() {
        await this.openBurgerMenu();
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
