'use strict';

class Frame {
    constructor(pageObject, controller) {
        this.pageObject = pageObject;
        this.controller = controller;
    }
};

class FrameManager {
    constructor() {
        this.frames = new Map();
    }

    register(name, frame) {
        this.frames.set(name, frame);
    }

    open(name, ...args) {
        const frame = this.frames.get(name);
        frame.controller.initialize(...args);

        this._hideAll();
        frame.pageObject.show();
    }

    _hideAll() {
        for (let frame of this.frames.values()) {
            frame.pageObject.hide();
        }
    }
};