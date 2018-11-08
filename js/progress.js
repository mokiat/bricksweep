'use strict';

const PROGRESS_UNPLAYED = 'unplayed';
const PROGRESS_BRONZE = 'bronze';
const PROGRESS_SILVER = 'silver';
const PROGRESS_GOLD = 'gold';

class Progress {
    constructor() {
        if (typeof (Storage) === 'undefined') {
            alert('html5 storage not supported by browser!')
            throw new Error('html5 storage not supported by browser!');
        }

    }

    getStatus(levelSetIndex, levelIndex) {
        const status = localStorage.getItem(`${levelSetIndex}-${levelIndex}`);
        if (!status) {
            return PROGRESS_UNPLAYED;
        }
        return status;
    }

    setStatus(levelSetIndex, levelIndex, status) {
        localStorage.setItem(`${levelSetIndex}-${levelIndex}`, status);
    }
}
