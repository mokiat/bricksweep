'use strict';

class Frame {
    constructor(frameManager, jqElementName) {
        this.frameManager = frameManager;
        this.jqElement = $(jqElementName).first();
    }

    initialize(...args) {
    }

    release() {
    }

    show() {
        this.jqElement.removeAttr('hidden');
    }

    hide() {
        this.jqElement.attr('hidden', '');
    }

    isBackEnabled() {
        return true;
    }

    onBackPressed() {
        this.frameManager.openPrevious();
    }
}
