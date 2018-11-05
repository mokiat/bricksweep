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

    listenOnClick(listener) {
        this.jqElement.click((event) => {
            event.preventDefault();
            listener();
        });
    }
}

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
}

class SelectionFrame extends Frame {
    constructor(frameManager, progress) {
        super(frameManager, '#selection');
        this.progress = progress;
        this.levelSetIndex = 0;

        const levelSetElement = this.jqElement.find('.levelset').first();
        this.levelSetPO = new LevelSetPageObject(levelSetElement);
        for (let levelIndex = 0; levelIndex < this.levelSetPO.getLevelCount(); levelIndex++) {
            this.levelSetPO.getLevel(levelIndex).listenOnClick(() => {
                frameManager.open('game', this.levelSetIndex, levelIndex);
            });
        }
    }

    initialize(levelSetIndex) {
        Frame.prototype.initialize.call(this);
        this.levelSetIndex = levelSetIndex;
        this._updateLevels();
    }

    _updateLevels() {
        const levelCount = this.levelSetPO.getLevelCount();
        let skipped = 0;
        for (let levelIndex = 0; levelIndex < levelCount; levelIndex++) {
            const status = this.progress.getStatus(this.levelSetIndex, levelIndex);
            const levelPO = this.levelSetPO.getLevel(levelIndex);
            switch (status) {
                case PROGRESS_UNPLAYED:
                    if (skipped >= MAX_SKIPPED_LEVELS) {
                        levelPO.setEnabled(false);
                        levelPO.setType(LEVEL_TYPE_LOCKED);
                    } else {
                        levelPO.setEnabled(true);
                        levelPO.setType(LEVEL_TYPE_UNLOCKED);
                    }
                    skipped++;
                    break;
                case PROGRESS_BRONZE:
                    levelPO.setEnabled(true);
                    levelPO.setType(LEVEL_TYPE_BRONZE);
                    break;
                case PROGRESS_SILVER:
                    levelPO.setEnabled(true);
                    levelPO.setType(LEVEL_TYPE_SILVER);
                    break;
                case PROGRESS_GOLD:
                    levelPO.setEnabled(true);
                    levelPO.setType(LEVEL_TYPE_GOLD);
                    break;
            }
        }
    }
}
