import { $ } from '@wdio/globals'
import Page from './page.js';
import InventoryPage from './inventory.page.js';

class LoginPage extends Page {
    get username () { return 'standard_user'; }
    get password () { return 'secret_sauce'; }

    get inputUsername () { return $('#user-name'); }
    get inputPassword () { return $('#password'); }
    get btnSubmit () { return $('[name="login-button"]'); }
    get errorMessage () { return $('.error-message-container'); }
    get errorIcon () { return $$('[class*="error_icon"]'); } 

    async assertLoginPageLoaded() {
        await expect(this.inputUsername).toBeDisplayed();
        await expect(this.inputPassword).toBeDisplayed();
        await expect(this.btnSubmit).toBeDisplayed();

        await expect(this.inputUsername).toHaveText('');
        await expect(this.inputPassword).toHaveText('');
    }

    async login (username, password) {
        await this.inputUsername.setValue(username);
        await this.inputPassword.setValue(password);
        await this.btnSubmit.click();
    }

    async loginAndVerify (username, password) {
        const currentUrl = await browser.getUrl();
        
        await this.login(username, password);

        await browser.waitUntil(
            async () => (await browser.getUrl()) !== currentUrl,
            { timeout: 5000, timeoutMsg: 'User was not redirected' }
        );

        await InventoryPage.assertInventoryPageLoaded();
    }

    async assertLoginError() {
        await expect(this.inputUsername).toHaveElementClass('error');
        await expect(this.inputPassword).toHaveElementClass('error');

        await expect(this.errorMessage).toBeDisplayed();
        await expect(this.errorMessage).toHaveText(
            'Epic sadface',
            { containing: true }
        );
        
        await expect(this.errorIcon).toBeElementsArrayOfSize({ eq: 2 });
    }

    open () {
        return super.open('');
    }
}

export default new LoginPage();
