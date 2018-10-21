'use strict';

class GamePageObject {
    constructor() {
        this.jqElement = $('#game');
    }

    show() {
        this.jqElement.removeAttr('hidden');
    }

    hide() {
        this.jqElement.attr('hidden', '');
    }
};

class GameController {
    constructor(frameManager, gamePO) {
        this.gamePO = gamePO;
    }

    initialize(levelSetIndex, levelIndex) {
        console.log('playing level set: %d; level: %d', levelSetIndex, levelIndex);
    }
};