'use strict';

const LEVEL_TYPE_LOCKED = 'locked';
const LEVEL_TYPE_UNLOCKED = 'unlocked';
const LEVEL_TYPE_BRONZE = 'bronze';
const LEVEL_TYPE_SILVER = 'silver';
const LEVEL_TYPE_GOLD = 'gold';

const MAX_SKIPPED_LEVELS = 2;

class LevelPageObject {
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
        this.jqElement.removeClass(LEVEL_TYPE_LOCKED);
        this.jqElement.removeClass(LEVEL_TYPE_UNLOCKED);
        this.jqElement.removeClass(LEVEL_TYPE_BRONZE);
        this.jqElement.removeClass(LEVEL_TYPE_SILVER);
        this.jqElement.removeClass(LEVEL_TYPE_GOLD);
        this.jqElement.addClass(type);
    }

    onClick(listener) {
        this.jqElement.click((event) => {
            event.preventDefault();
            listener();
        });
    }
};

class LevelSetPageObject {
    constructor(jqElement) {
        this.jqElement = jqElement;
    }

    getLevelCount() {
        return this.jqElement.find('.level').length;
    }

    getLevel(index) {
        const jqLevelElement = this.jqElement.find('.level').eq(index);
        return new LevelPageObject(jqLevelElement);
    }
};

class MenuPageObject {
    constructor() {
        this.jqElement = $('#menu');
    }

    show() {
        this.jqElement.removeAttr('hidden');
    }

    hide() {
        this.jqElement.attr('hidden', '');
    }

    getLevelSetCount() {
        return this.jqElement.find('.levelset').length;
    }

    getLevelSet(index) {
        const jqLevelSetElement = this.jqElement.find('.levelset').eq(index);
        return new LevelSetPageObject(jqLevelSetElement);
    }
};

class MenuController {
    constructor(frameManager, menuPO, progress) {
        this.frameManager = frameManager;
        this.menuPO = menuPO;
        this.progress = progress;

        for (let levelSetIndex = 0; levelSetIndex < this.menuPO.getLevelSetCount(); levelSetIndex++) {
            const levelSetPO = this.menuPO.getLevelSet(levelSetIndex);
            for (let levelIndex = 0; levelIndex < levelSetPO.getLevelCount(); levelIndex++) {
                levelSetPO.getLevel(levelIndex).onClick(() => {
                    frameManager.open('game', levelSetIndex, levelIndex);
                });
            }
        }
    }

    initialize() {
        this.updateLevels();
    }

    updateLevels() {
        const levelSetCount = this.menuPO.getLevelSetCount();
        for (let levelSetIndex = 0; levelSetIndex < levelSetCount; levelSetIndex++) {
            this.updateLevelSetLevels(levelSetIndex);
        }
    }

    updateLevelSetLevels(levelSetIndex) {
        const levelSetPO = this.menuPO.getLevelSet(levelSetIndex);
        const levelCount = levelSetPO.getLevelCount();

        let skipped = 0;
        for (let levelIndex = 0; levelIndex < levelCount; levelIndex++) {
            const status = this.progress.getStatus(levelSetIndex, levelIndex);
            const levelPO = levelSetPO.getLevel(levelIndex);
            switch (status) {
                case ProgressUnplayed:
                    if (skipped >= MAX_SKIPPED_LEVELS) {
                        levelPO.setEnabled(false);
                        levelPO.setType(LEVEL_TYPE_LOCKED);
                    } else {
                        levelPO.setEnabled(true);
                        levelPO.setType(LEVEL_TYPE_UNLOCKED);
                    }
                    skipped++;
                    break;
                case BRONZE:
                    levelPO.setEnabled(true);
                    levelPO.setType(LEVEL_TYPE_BRONZE);
                    break;
                case SILVER:
                    levelPO.setEnabled(true);
                    levelPO.setType(LEVEL_TYPE_SILVER);
                    break;
                case GOLD:
                    levelPO.setEnabled(true);
                    levelPO.setType(LEVEL_TYPE_GOLD);
                    break;
            }
        }
    }
};
