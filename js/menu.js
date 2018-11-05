'use strict';

class MenuFrame extends Frame {
    constructor(frameManager) {
        super(frameElement, '#menu');

        $('#open-tutorial').click((e) => {
            e.preventDefault();
            frameManager.open('tutorial');
        });

        $('#open-levels3x3').click((e) => {
            e.preventDefault();
            frameManager.open('selection', 0);
        });

        $('#open-levels4x3').click((e) => {
            e.preventDefault();
            frameManager.open('selection', 1);
        });
    }

    isBackEnabled() {
        return false;
    }
}
