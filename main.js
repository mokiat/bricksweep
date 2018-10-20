'use strict';

const LevelTypeLocked = 'locked';
const LevelTypeBronze = 'bronze';
const LevelTypeSilver = 'silver';
const LevelTypeGold = 'gold';

class Level {
    constructor(jqElement) {
        this.jqElement = jqElement;
    }

    setEnabled(enabled) {
        if (enabled) {
            this.jqElement.attr('href', '');
        } else {
            this.jqElement.removeAttr('href');
        }
    }

    setType(type) {
        this.jqElement.removeClass(LevelTypeLocked);
        this.jqElement.removeClass(LevelTypeBronze);
        this.jqElement.removeClass(LevelTypeSilver);
        this.jqElement.removeClass(LevelTypeGold);
        this.jqElement.addClass(type);
    }
};

class LevelSet {
    constructor(jqElement) {
        this.jqElement = jqElement;
    }

    getLevel(index) {
        const jqLevelElement = this.jqElement.find('.level').eq(index);
        return new Level(jqLevelElement);
    }
};

class Menu {
    constructor() {
    }

    getLevelSet(index) {
        const jqLevelSetElement = $('.levelset').eq(index);
        return new LevelSet(jqLevelSetElement);
    }
};

$(document).ready(() => {
    $('.collapsible').collapsible();

    const menu = new Menu();
    menu.getLevelSet(0).getLevel(3).setEnabled(true);
    menu.getLevelSet(0).getLevel(3).setType(LevelTypeBronze);
    menu.getLevelSet(0).getLevel(8).setEnabled(true);
    menu.getLevelSet(0).getLevel(8).setType(LevelTypeSilver);
    menu.getLevelSet(1).getLevel(2).setEnabled(true);
    menu.getLevelSet(1).getLevel(2).setType(LevelTypeGold);
});
