import { $ } from '@wdio/globals'
import Page from './page.js';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class LoginPage extends Page {
    get inputUsername () { return $('#user-name'); }
    get inputPassword () { return $('#password'); }
    get btnSubmit () { return $('[name="login-button"]'); }
    get errorMessage () { return $('.error-message-container'); }
    get errorIcon () { return $$('[class*="error_icon"]'); } 

    async login (username, password) {
        await this.inputUsername.setValue(username);
        await this.inputPassword.setValue(password);
        await this.btnSubmit.click();
    }

    open () {
        return super.open('');
    }
}

export default new LoginPage();
