'use strict';

class BrickType {
    constructor(fuseCount, spriteClass, isMovable) {
        this.fuseCount = fuseCount;
        this.spriteClass = spriteClass;
        this.isMovable = isMovable;
    }

    get isFusable() {
        return this.fuseCount !== -1;
    }
}

const BrickTypeBlack = new BrickType(-1, 'typeblack', false);
const BrickTypeRed = new BrickType(2, 'typered', true);
const BrickTypeGreen = new BrickType(3, 'typegreen', true);
const BrickTypeBlue = new BrickType(4, 'typeblue', true);
const BrickTypeYellow = new BrickType(5, 'typeyellow', true);
const BrickTypeWhite = new BrickType(-1, 'typewhite', true);

class BrickComponent {
    constructor() {
        this.row = 0;
        this.column = 0;
        this.type = BrickTypeBlack;
    }
}