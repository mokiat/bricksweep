'use strict';

class IndexFrameManager extends FrameManager {
    constructor() {
        super();
    }

    showBackButton() {
        $('.back-button').removeAttr('hidden');
    }

    hideBackButton() {
        $('.back-button').attr('hidden', '');
    }
}

$(document).ready(() => {
    $('.collapsible').collapsible();

    const progress = new Progress();

    const frameManager = new IndexFrameManager();
    $('.back-button').click((e) => {
        e.preventDefault();
        frameManager.onBackButtonPressed();
    })
    frameManager.register('menu', new MenuFrame(frameManager));
    frameManager.register('tutorial', new TutorialFrame(frameManager));
    frameManager.register('selection', new SelectionFrame(frameManager, progress));
    frameManager.open('menu');
});
