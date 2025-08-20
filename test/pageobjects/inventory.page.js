import { $ } from '@wdio/globals'
import Page from './page.js';


class InventoryPage extends Page {
    get title() { return $('.title'); }
    get cartIcon() { return $('#shopping_cart_container'); }
    get products() { return $$('.inventory_item'); }    
    
}

export default new InventoryPage();
