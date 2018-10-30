'use strict';

class SceneInitializer {
    constructor(facade) {
        this.facade = facade;
    }

    applyLevel(level) {
        this.facade.reset(level.width, level.height);
        let brickIndex = 0;
        for (let y = 0; y < level.height; y++) {
            for (let x = 0; x < level.width; x++) {
                const brickName = level.bricks[brickIndex++];
                const brickType = this._getBrickType(brickName);
                this.facade.createBrick(y, x, brickType);
            }
        }
    }

    _getBrickType(name) {
        switch (name) {
            case 'black':
                return BrickTypeBlack;
            case 'red':
                return BrickTypeRed;
            case 'green':
                return BrickTypeGreen;
            case 'blue':
                return BrickTypeBlue;
            case 'yellow':
                return BrickTypeYellow;
            case 'white':
                return BrickTypeWhite;
            default:
                throw new Error(`unsupported brick '${name}'`);
        }
    }
}
