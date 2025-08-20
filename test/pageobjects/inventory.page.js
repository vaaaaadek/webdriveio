import { $ } from '@wdio/globals'
import Page from './page.js';


class InventoryPage extends Page {
    get title() { return $('.title'); }
    get cartIcon() { return $('#shopping_cart_container'); }
    get products() { return $$('.inventory_item'); }    
    get burgerButton() { return $('#react-burger-menu-btn'); }
    get bmMenu() { return $('.bm-menu-wrap'); }
    get bmMenuItem() { return $$('.menu-item'); }
    get logoutButton() { return $('#logout_sidebar_link'); }

}

export default new InventoryPage();
