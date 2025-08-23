import page from './page.js';
import loginPage from './login.page.js';
import cartPage from './cart.page.js';

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
    get footer() { return $('.footer'); }
    get footerListItems() { return this.footer.$$('li'); }
    get footerLinks() { return this.footer.$$('li a'); }
    
    get sortStrategies() { // Define sorting strategies
        return {
            'az': { type: 'name', text: 'Name (A to Z)', fn: arr => [...arr].sort() }, // Sort by name A-Z
            'za': { type: 'name', text: 'Name (Z to A)', fn: arr => [...arr].sort().reverse() }, // Sort by name Z-A
            'lohi': { type: 'price', text: 'Price (low to high)', fn: arr => [...arr].sort((a, b) => a - b) }, // Sort by price low to high
            'hilo': { type: 'price', text: 'Price (high to low)', fn: arr => [...arr].sort((a, b) => b - a) }, // Sort by price high to low
        };
    }

    get expectedSocialLinks() { // Define expected social links
        return {
            'social_twitter': {href: 'https://twitter.com/saucelabs', text: 'Twitter'},
            'social_facebook': {href: 'https://www.facebook.com/saucelabs', text: 'Facebook'},
            'social_linkedin': {href: 'https://www.linkedin.com/company/sauce-labs/', text: 'LinkedIn'},
        };
    }

    async assertInventoryPageLoaded() { // Verify inventory page is loaded
        await expect(this.title).toBeDisplayed();
        await expect(this.title).toHaveText('Products');
        await expect(this.cartIcon).toBeDisplayed();
        await expect(this.products).toBeElementsArrayOfSize({ gte: 1 });
    }

    async openBurgerMenu() { 
        await this.burgerButton.click();
        await expect(this.bmMenu).toBeDisplayed();
    }

    async expectVisibleMenuItemsToBe(count) { // Verify number of visible menu items
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
        await expect(this.cartIcon).toBeDisplayed();

        if (itemCount === 0) {
            await expect(this.cartIcon).not.toHaveText();
            return;
        }
        await expect(this.cartIcon).toHaveText(itemCount.toString());
    }

    async assertProductSortOptionsLoaded() {
        await expect(this.productSortContainer).toBeDisplayed();

        const options = await this.sortingOptions;
        expect(options.length).toBeGreaterThan(0);
        for (const option of options) {
            expect(await option.getText()).toBeDefined();
        }
    }

    async assertSortingOPtionsDefined() { // Verify sorting options are defined correctly
        const options = await this.sortingOptions;
        expect(options.length).toBeGreaterThan(0);
        
        for (const option of options) {
            const value = await option.getValue();
            const text = await option.getText();

            expect(value).toBeDefined();
            expect(this.sortStrategies).toHaveProperty(value); // Check if the value exists in sortStrategies

            expect(text).toBeDefined();
            expect(text).toBe(this.sortStrategies[value].text); // Ensure the text matches the strategy description
        }
    }

    async chooseProductSortOption(option) {
        const optionValue = await option.getValue();
        
        await this.productSortContainer.click();
        await this.productSortContainer.selectByAttribute('value', optionValue);

        await browser.pause(500); // Wait for sorting to apply
        await expect(await this.productSortContainer.getValue()).toBe(optionValue); // Ensure the selected option is correct
    }

    async verifySortingApplied() { // Verify products are sorted correctly
        const selectedValue = await this.productSortContainer.getValue();
        const strategy = await this.sortStrategies[selectedValue];

        const products = await this.products;
        expect(products.length).toBeGreaterThan(0);

        let values = [];

        if (strategy.type === 'name') { // Extract product names or prices based on sorting type
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

    async logoutAndVerify() { // Logout and verify redirection to login page
        await this.openBurgerMenu();
        await this.expectVisibleMenuItemsToBe(4);

        await expect(this.logoutButton).toBeDisplayed();
        await expect(this.logoutButton).toHaveText('Logout');
        await this.logoutButton.click();

        await browser.waitUntil(
            async () => (await browser.getUrl()) === 'https://www.saucedemo.com/',
            { timeout: 5000, timeoutMsg: 'User was not redirected' }
        );

        await loginPage.assertLoginPageLoaded();
    }

    async addProductToCart(productIndex) { // Add product to cart by index and return its details
        const product = this.products[productIndex];
        const addButton = await product.$('.btn_inventory');
        await addButton.click();
        await expect(await addButton).toHaveText('Remove');
        await expect(await product.$('.inventory_item_name')).toBeDisplayed();

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
        await expect(await product.$('.btn_inventory')).toHaveText('Add to cart');
    }

    async proceedToCart() { // Navigate to cart page and verify redirection
        const currentUrl = await browser.getUrl();
        await this.cartIcon.click();
        await browser.waitUntil(
            async () => (await browser.getUrl()) !== currentUrl,
            { timeout: 5000, timeoutMsg: 'User was not redirected to cart page' }
        );

        await cartPage.assertCartPageLoaded();
    }

    async verifyFooterLinks() { // Verify footer links are displayed correctly
        await expect(this.footer).toBeDisplayed();

        const listItems = await this.footerListItems;
        expect(listItems.length).toBeGreaterThan(0);

        for (let i = 0; i < listItems.length; i++) {
            const listItem = listItems[i];
            await expect(await listItem).toBeDisplayed();

            const classAttr = await listItem.getAttribute('class');
            if (!this.expectedSocialLinks.hasOwnProperty(classAttr)) {
                continue; // Skip non-social links
            }
            const href = await listItem.$('a').getAttribute('href');
            const text = await listItem.$('a').getText();

            const expected = this.expectedSocialLinks[classAttr];
            expect(href).toBe(expected.href);
            expect(text).toBe(expected.text);            
        }        
    }

    async goToSocialLink(link) { // Navigate to social link and verify URL
        const originalWindow = await browser.getWindowHandle();
        await link.click();

        await browser.waitUntil(
            async () => (await browser.getWindowHandles()).length > 1,
            { timeout: 5000, timeoutMsg: 'New window did not open' }
        );

        const windows = await browser.getWindowHandles();
        const newWindow = windows.find(handle => handle !== originalWindow);
        await browser.switchToWindow(newWindow);

        const newUrl = await browser.getUrl();
        const normalizedUrl = newUrl.toLowerCase().replace(/[-_]/g, ''); // Normalize URL for comparison

        if (!newUrl.includes('saucelabs')) { // Additional check for non-saucelabs URLs
            // For example, Twitter URL might redirect to a localized version
            // So we check the page content for 'saucelabs'
            // instead of relying solely on the URL
            const pageText = await $('body').getText();
            const normalizedText = pageText.toLowerCase().replace(/[^a-z0-9]/g, '');
            expect(normalizedText).toContain('saucelabs');
        }

        await browser.closeWindow();
        await browser.switchToWindow(originalWindow);
    }

}

export default new InventoryPage();
