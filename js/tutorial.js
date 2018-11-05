'use strict';

class TutorialFrame extends Frame {
    constructor(frameManager) {
        super(frameManager, '#tutorial');
    }

    hide() {
        // hackish way to stop the youtube video on tutorial close.
        // the official API is cumbersome and the 'postMessage' approach
        // offers no compatibility guarantees.
        this.jqElement.find('#tutorial-player').each(function () {
            this.src += '';
        })
        Frame.prototype.hide.call(this);
    }
}
