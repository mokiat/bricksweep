'use strict';

class FrameManager {
    constructor() {
        this.frames = new Map();
        this.currentFrame = null;
        this.frameStack = [];
    }

    register(name, frame) {
        this.frames.set(name, frame);
    }

    unregister(name) {
        this.frames.delete(name);
    }

    open(name, ...args) {
        if (!this.frames.has(name)) {
            throw new Error(`no frame registered for name '${name}'`);
        }

        this.frameStack.unshift({
            name: name,
            args: args
        });

        this._switchToFrame(name, ...args);
    }

    openPrevious() {
        this.frameStack.shift();

        if (this.frameStack.length === 0) {
            throw new Error('cannot go any further back!');
        }
        const { name, args } = this.frameStack[0];
        this._switchToFrame(name, ...args);
    }

    onBackButtonPressed() {
        if (!this.currentFrame) {
            return;
        }
        this.currentFrame.onBackPressed();
    }

    showBackButton() {
        console.log('not implemented');
    }

    hideBackButton() {
        console.log('not implemented');
    }

    _switchToFrame(name, ...args) {
        const lastFrame = this.currentFrame;
        const newFrame = this.frames.get(name);
        newFrame.initialize(...args);
        if (lastFrame) {
            lastFrame.hide();
        }
        if (newFrame.isBackEnabled()) {
            this.showBackButton();
        } else {
            this.hideBackButton();
        }
        newFrame.show();
        if (lastFrame) {
            lastFrame.release();
        }
        this.currentFrame = newFrame;
    }
}
