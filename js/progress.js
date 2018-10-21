'use strict';

const ProgressUnplayed = 'unplayed';
const ProgressBronze = 'bronze';
const ProgressSilver = 'silver';
const ProgressGold = 'gold';

class Progress {
    getStatus(levelSetIndex, levelIndex) {
        return ProgressUnplayed;
    }
};
