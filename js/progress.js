'use strict';

const PROGRESS_UNPLAYED = 'unplayed';
const PROGRESS_BRONZE = 'bronze';
const PROGRESS_SILVER = 'silver';
const PROGRESS_GOLD = 'gold';

class Progress {
    getStatus(levelSetIndex, levelIndex) {
        return PROGRESS_UNPLAYED;
    }
}
