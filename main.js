'use strict';

$(document).ready(() => {
    $('.collapsible').collapsible();

    const progress = new Progress();

    const menuPO = new MenuPageObject();
    const menuController = new MenuController(menuPO, progress);
    menuController.initialize();
});
