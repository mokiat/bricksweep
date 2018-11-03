'use strict';

class FuseSystem {
    constructor(ecsManager, board, facade) {
        this.ecsManager = ecsManager;
        this.board = board;
        this.facade = facade;
        this.checked = [];
        this.stored = [];
        this.brickQuery = new ECSQuery(
            (entity) => ecsManager.hasComponent(entity, 'brick')
        );
    }

    isComplete() {
        for (let entity of this.ecsManager.search(this.brickQuery)) {
            const brickComponent = this.ecsManager.getComponent(entity, 'brick');
            if (brickComponent.type.isFusable) {
                return false;
            }
        }
        return true;
    }

    isImpossible() {
        for (let brickType of BRICK_TYPES) {
            if (!brickType.isFusable) {
                continue;
            }
            const count = this._getBrickCount(brickType);
            if ((count > 0) && (count < brickType.fuseCount)) {
                return true;
            }
        }
        return false;
    }

    findFuseGroup() {
        this._resetChecked();
        this._resetStored();
        for (let entity of this.ecsManager.search(this.brickQuery)) {
            const brickComponent = this.ecsManager.getComponent(entity, 'brick');
            const group = this._getGroup(brickComponent.row, brickComponent.column);
            if (group.length > 0) {
                return group;
            }
        }
        return [];
    }

    fuseGroup(group) {
        const blinkGroup = [];
        for (let entity of group) {
            const { row, column, type } = this.ecsManager.getComponent(entity, 'brick');
            this.facade.destroyBrick(row, column);
            this.facade.createBrick(row, column, BrickTypeBlack);
            const blinkEntity = this.facade.createBlinkingBrickOverlay(row, column, type);
            blinkGroup.push(blinkEntity);
        }
        return blinkGroup;
    }

    isBlinkComplete(group) {
        for (let entity of group) {
            if (this.ecsManager.hasEntity(entity)) {
                return false;
            }
        }
        return true;
    }

    _getBrickCount(brickType) {
        let count = 0;
        for (let entity of this.ecsManager.search(this.brickQuery)) {
            const brickComponent = this.ecsManager.getComponent(entity, 'brick');
            if (brickComponent.type === brickType) {
                count++;
            }
        }
        return count;
    }

    _resetChecked() {
        const boardSize = this.board.width * this.board.height;
        if (this.checked.length !== boardSize) {
            this.checked = new Array(boardSize);
        }
        this.checked.fill(false);
    }

    _isChecked(row, column) {
        const index = row * this.board.width + column;
        return this.checked[index];
    }

    _markChecked(row, column) {
        const index = row * this.board.width + column;
        this.checked[index] = true;
    }

    _resetStored() {
        const boardSize = this.board.width * this.board.height;
        if (this.stored.length !== boardSize) {
            this.stored = new Array(boardSize);
        }
        this.stored.fill(false);
    }

    _isStored(row, column) {
        const index = row * this.board.width + column;
        return this.stored[index];
    }

    _markStored(row, column) {
        const index = row * this.board.width + column;
        this.stored[index] = true;
    }

    _getGroup(row, column) {
        const entity = this.board.getBrick(row, column);
        const brickComponent = this.ecsManager.getComponent(entity, 'brick');
        if (!brickComponent.type.isFusable) {
            return [];
        }
        const count = this._countSimilar(row, column, brickComponent.type);
        if (count < brickComponent.type.fuseCount) {
            return [];
        }
        const group = [];
        this._storeSimilar(group, row, column, brickComponent.type);
        return group;
    }

    _countSimilar(row, column, type) {
        if (!this.board.contains(row, column)) {
            return 0;
        }
        if (this._isChecked(row, column)) {
            return 0;
        }
        const entity = this.board.getBrick(row, column);
        const brickComponent = this.ecsManager.getComponent(entity, 'brick');
        if (brickComponent.type !== type) {
            return 0;
        }
        this._markChecked(row, column);
        const neighbourCount =
            this._countSimilar(row - 1, column, type) +
            this._countSimilar(row + 1, column, type) +
            this._countSimilar(row, column - 1, type) +
            this._countSimilar(row, column + 1, type);
        return 1 + neighbourCount;
    }

    _storeSimilar(group, row, column, type) {
        if (!this.board.contains(row, column)) {
            return;
        }
        if (this._isStored(row, column)) {
            return;
        }
        const entity = this.board.getBrick(row, column);
        const brickComponent = this.ecsManager.getComponent(entity, 'brick');
        if (brickComponent.type !== type) {
            return;
        }
        group.push(entity);
        this._markStored(row, column);
        this._storeSimilar(group, row - 1, column, type);
        this._storeSimilar(group, row + 1, column, type);
        this._storeSimilar(group, row, column - 1, type);
        this._storeSimilar(group, row, column + 1, type);
    }
}
