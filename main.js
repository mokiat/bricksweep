'use strict';

$(document).ready(() => {
    $('.collapsible').collapsible();

    const progress = new Progress();
    const frameManager = new FrameManager();

    const menuPO = new MenuPageObject();
    const menuController = new MenuController(frameManager, menuPO, progress);
    frameManager.register('menu', new Frame(menuPO, menuController));

    const gamePO = new GamePageObject();
    const gameController = new GameController(frameManager, gamePO);
    frameManager.register('game', new Frame(gamePO, gameController));

    frameManager.open('menu');
});
