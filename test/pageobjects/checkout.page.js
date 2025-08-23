import Page from './page.js';
import inventoryPage from './inventory.page.js';

class CheckoutPage extends Page {
    get inputFirstName() { return $('#first-name'); }
    get inputLastName() { return $('#last-name'); }
    get inputPostalCode() { return $('#postal-code'); }
    get btnContinue() { return $('#continue'); }
    get btnFinish() { return $('#finish'); }
    get btnCancel() { return $('#cancel'); }
    get btnBackHome() { return $('#back-to-products'); }
    get summaryTotal() { return $('.summary_total_label'); }
    get summarySubtotal() { return $('.summary_subtotal_label'); }
    get summaryTax() { return $('.summary_tax_label'); }
    get summaryItems() { return $$('.cart_item'); }
    get summaryTitle() { return $('.title'); }
    get completeHeader() { return $('.complete-header'); }

    async assertCheckoutPageLoaded() { // Verify checkout page is loaded
        await expect(this.summaryTitle).toBeDisplayed();
        await expect(this.inputFirstName).toBeDisplayed();
        await expect(this.inputLastName).toBeDisplayed();
        await expect(this.inputPostalCode).toBeDisplayed();
        await expect(this.btnContinue).toBeDisplayed();
        await expect(this.btnCancel).toBeDisplayed();
    }
    async assertCheckoutOverviewPageLoaded() { // Verify checkout overview page is loaded
        await expect(this.summaryTitle).toBeDisplayed();
        await expect(this.summaryTitle).toHaveText('Checkout: Overview');
        await expect(this.summaryItems).toBeElementsArrayOfSize({ gte: 1 });
        await expect(this.summaryTotal).toBeDisplayed();
        await expect(this.btnFinish).toBeDisplayed();
    }
    async assertCheckoutCompletePageLoaded() { // Verify checkout complete page is loaded
        await expect(this.summaryTitle).toBeDisplayed();
        await expect(this.summaryTitle).toHaveText('Checkout: Complete!');
        await expect(this.summaryItems).toBeElementsArrayOfSize(0);
        await expect(this.btnContinue).not.toBeDisplayed();
        await expect(this.completeHeader).toBeDisplayed();
        await expect(this.completeHeader).toHaveText('Thank you for your order!');
        await expect(this.btnBackHome).toBeDisplayed();
    }

    async fillCheckoutForm(firstName, lastName, postalCode) {
        await this.inputFirstName.setValue(firstName);
        await expect(this.inputFirstName).toHaveValue(firstName);

        await this.inputLastName.setValue(lastName);
        await expect(this.inputLastName).toHaveValue(lastName);

        await this.inputPostalCode.setValue(postalCode);
        await expect(this.inputPostalCode).toHaveValue(postalCode);
    }

    async verifyCheckoutItemsDetails(items) { // Verify checkout items match expected details and totals are correct
        const summaryItems = await this.summaryItems;
        expect(summaryItems.length).toBe(items.length);

        let subtotal = 0;
        const taxRate = 0.08; // Assuming an 8% tax rate for calculation
        
        for (let i = 0; i < items.length; i++) {
            const item = summaryItems[i];
            
            await expect(await item.$('.inventory_item_name').getText()).toBe(items[i].productName);
            await expect(await item.$('.inventory_item_price').getText()).toBe(items[i].productPrice);

            const price = parseFloat(items[i].productPrice.replace('$', '')); // Extract numeric value
            subtotal += price; // Accumulate subtotal
        }

        const expectedSubtotal = `Item total: $${subtotal.toFixed(2)}`;
        const expectedTax = `Tax: $${(subtotal * taxRate).toFixed(2)}`;
        const expectedTotal = `Total: $${(subtotal * (1 + taxRate)).toFixed(2)}`;
        // Verify calculated totals match displayed totals
        await expect(this.summarySubtotal).toHaveText(expectedSubtotal);
        await expect(this.summaryTax).toHaveText(expectedTax);
        await expect(this.summaryTotal).toHaveText(expectedTotal);
    }

    async continue() {
        await this.btnContinue.click();
    }

    async finish() {
        await this.btnFinish.click();
    }

    async backHome() {
        const currentUrl = await browser.getUrl();
        await this.btnBackHome.click();

        await browser.waitUntil(
            async () => (await browser.getUrl()) !== currentUrl,
            { timeout: 5000, timeoutMsg: 'User was not redirected to inventory page' }
        );
        await inventoryPage.assertInventoryPageLoaded();
    }

    async cancel() {
        await this.btnCancel.click();
    }
}

export default new CheckoutPage();