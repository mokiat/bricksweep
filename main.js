'use strict';

class IndexFrameManager extends FrameManager {
    constructor() {
        super();
        $('.back-button').click((e) => {
            e.preventDefault();
            this.onBackButtonPressed();
        })
    }

    showBackButton() {
        $('.back-button').show();
    }

    hideBackButton() {
        $('.back-button').hide();
    }
}

$(document).ready(() => {
    $('.collapsible').collapsible();
    $('.modal').modal();

    const progress = new Progress();
    const frameManager = new IndexFrameManager();
    frameManager.register('menu', new MenuFrame(frameManager));
    frameManager.register('tutorial', new TutorialFrame(frameManager));
    frameManager.register('selection', new SelectionFrame(frameManager, progress));
    frameManager.register('game', new GameFrame(frameManager, progress));
    frameManager.open('menu');
});
