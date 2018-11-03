'use strict';

const DISPLACE_THRESHOLD = 0.5;

class DisplaceSystem {
    constructor(ecsManager, board, facade) {
        this.ecsManager = ecsManager;
        this.board = board;
        this.facade = facade;
        this.ghostBrick = ECS_INVALID_ENTITY;
        this.displacementQuery = new ECSQuery(
            (entity) => ecsManager.hasComponent(entity, 'position'),
            (entity) => ecsManager.hasComponent(entity, 'brick'),
            (entity) => ecsManager.hasComponent(entity, 'displacement')
        );
        this.dragStart = new Vec2();
        this.reset();
    }

    reset() {
        this.moves = 0;
        this.selectedEntity = ECS_INVALID_ENTITY;
        if (this.ecsManager.hasEntity(this.ghostBrick)) {
            this.ecsManager.deleteEntity(this.ghostBrick);
        }
        this.ghostBrick = this._createGhostBrickEntity();
    }

    getMoves() {
        return this.moves;
    }

    update() {
        for (let entity of this.ecsManager.search(this.displacementQuery)) {
            const displacementComponent = this.ecsManager.getComponent(entity, 'displacement');
            if (!displacementComponent.active) {
                continue;
            }
            const positionComponent = this.ecsManager.getComponent(entity, 'position');
            const brickComponent = this.ecsManager.getComponent(entity, 'brick');
            const position = this.board.calculateBrickIdealScreenPosition(brickComponent.row, brickComponent.column);
            position.inc(displacementComponent.amount);
            positionComponent.coords.setTo(position);
        }
    }

    onMouseDown(x, y) {
        // console.log('[displace system] mouse down: %d / %d', x, y);
        const mousePosition = new Vec2(x, y);
        for (let entity of this.ecsManager.search(this.displacementQuery)) {
            if (this._isEntityUnderMouse(entity, mousePosition)) {
                this.dragStart.setTo(mousePosition);
                this.selectedEntity = entity;
                break;
            }
        }
    }

    onMouseUp(x, y) {
        // console.log('[displace system] mouse up: %d / %d', x, y);
        this._cancelDisplacement();

    }

    onMouseMove(x, y) {
        // console.log('[displace system] mouse move: %d / %d', x, y);
        this._resetDisplacedBricks();

        if (!this.ecsManager.hasEntity(this.selectedEntity)) {
            this.selectedEntity = ECS_INVALID_ENTITY;
            return;
        }

        const mousePosition = new Vec2(x, y);
        const dragDistance = mousePosition.getDec(this.dragStart);
        const brickComponent = this.ecsManager.getComponent(this.selectedEntity, 'brick');

        const isHorizontalDrag = Math.abs(dragDistance.x) > Math.abs(dragDistance.y);
        if (isHorizontalDrag) {
            if (dragDistance.x > BRICK_WIDTH * DISPLACE_THRESHOLD) {
                if (this._shiftBricksHorizontally(brickComponent.row, brickComponent.column, +1)) {
                    this.moves++;
                }
                this._cancelDisplacement();
                return;
            }
            if (dragDistance.x < -BRICK_WIDTH * DISPLACE_THRESHOLD) {
                if (this._shiftBricksHorizontally(brickComponent.row, brickComponent.column, -1)) {
                    this.moves++;
                }
                this._cancelDisplacement();
                return;
            }
            this._displaceBricksHorizontally(brickComponent.row, brickComponent.column, dragDistance.x);
        } else {
            if (dragDistance.y > BRICK_HEIGHT * DISPLACE_THRESHOLD) {
                if (this._shiftBricksVertically(brickComponent.row, brickComponent.column, +1)) {
                    this.moves++;
                }
                this._cancelDisplacement();
                return;
            }
            if (dragDistance.y < -BRICK_HEIGHT * DISPLACE_THRESHOLD) {
                if (this._shiftBricksVertically(brickComponent.row, brickComponent.column, -1)) {
                    this.moves++;
                }
                this._cancelDisplacement();
                return;
            }
            this._displaceBricksVertically(brickComponent.row, brickComponent.column, dragDistance.y);
        }
    }

    _createGhostBrickEntity() {
        const entity = this.ecsManager.createEntity();

        const positionComponent = new PositionComponent();
        this.ecsManager.addComponent(entity, 'position', positionComponent);

        const spriteComponent = new SpriteComponent();
        spriteComponent.width = BRICK_WIDTH;
        spriteComponent.height = BRICK_HEIGHT;
        spriteComponent.opacity = 0.5;
        spriteComponent.spriteClass = '';
        spriteComponent.depth = 80;
        this.ecsManager.addComponent(entity, 'sprite', spriteComponent);

        return entity;
    }

    _isEntityUnderMouse(entity, mousePosition) {
        const positionComponent = this.ecsManager.getComponent(entity, 'position');
        const entityCoords = positionComponent.coords;
        return (entityCoords.x <= mousePosition.x) &&
            (entityCoords.y <= mousePosition.y) &&
            (entityCoords.x + BRICK_WIDTH > mousePosition.x) &&
            (entityCoords.y + BRICK_HEIGHT > mousePosition.y);
    }

    _cancelDisplacement() {
        this.selectedEntity = ECS_INVALID_ENTITY;
        this._resetDisplacedBricks();
        const spriteComponent = this.ecsManager.getComponent(this.ghostBrick, 'sprite');
        spriteComponent.spriteClass = '';
    }

    _resetDisplacedBricks() {
        for (let entity of this.ecsManager.search(this.displacementQuery)) {
            const displacementComponent = this.ecsManager.getComponent(entity, 'displacement');
            displacementComponent.active = false;
            const spriteComponent = this.ecsManager.getComponent(entity, 'sprite');
            spriteComponent.opacity = 1.0;
            spriteComponent.depth = 50;
        }
    }

    _displaceBricksHorizontally(row, column, horizontalDistance) {
        const minColumn = this._findFurthestHorizontally(row, column, -1);
        const maxColumn = this._findFurthestHorizontally(row, column, +1);
        const displaceAmount = new Vec2(horizontalDistance, 0.0);

        if (horizontalDistance > 0) {
            const ghostPositionComponent = this.ecsManager.getComponent(this.ghostBrick, 'position');
            ghostPositionComponent.coords.setTo(this.board.calculateBrickIdealScreenPosition(row, minColumn - 1));
            ghostPositionComponent.coords.inc(displaceAmount);
            const brick = this.board.getBrick(row, maxColumn);
            const brickSpriteComponent = this.ecsManager.getComponent(brick, 'sprite');
            const ghostSpriteComponent = this.ecsManager.getComponent(this.ghostBrick, 'sprite');
            ghostSpriteComponent.spriteClass = brickSpriteComponent.spriteClass;
        } else {
            const ghostPositionComponent = this.ecsManager.getComponent(this.ghostBrick, 'position');
            ghostPositionComponent.coords.setTo(this.board.calculateBrickIdealScreenPosition(row, maxColumn + 1));
            ghostPositionComponent.coords.inc(displaceAmount);
            const brick = this.board.getBrick(row, minColumn);
            const brickSpriteComponent = this.ecsManager.getComponent(brick, 'sprite');
            const ghostSpriteComponent = this.ecsManager.getComponent(this.ghostBrick, 'sprite');
            ghostSpriteComponent.spriteClass = brickSpriteComponent.spriteClass;
        }

        for (let c = minColumn; c <= maxColumn; c++) {
            this._displaceBrick(row, c, displaceAmount);
        }
    }

    _displaceBricksVertically(row, column, verticalDistance) {
        const minRow = this._findFurthestVertically(row, column, -1);
        const maxRow = this._findFurthestVertically(row, column, +1);
        const displaceAmount = new Vec2(0.0, verticalDistance);

        if (verticalDistance > 0) {
            const ghostPositionComponent = this.ecsManager.getComponent(this.ghostBrick, 'position');
            ghostPositionComponent.coords.setTo(this.board.calculateBrickIdealScreenPosition(minRow - 1, column));
            ghostPositionComponent.coords.inc(displaceAmount);
            const brick = this.board.getBrick(maxRow, column);
            const brickSpriteComponent = this.ecsManager.getComponent(brick, 'sprite');
            const ghostSpriteComponent = this.ecsManager.getComponent(this.ghostBrick, 'sprite');
            ghostSpriteComponent.spriteClass = brickSpriteComponent.spriteClass;
        } else {
            const ghostPositionComponent = this.ecsManager.getComponent(this.ghostBrick, 'position');
            ghostPositionComponent.coords.setTo(this.board.calculateBrickIdealScreenPosition(maxRow + 1, column));
            ghostPositionComponent.coords.inc(displaceAmount);
            const brick = this.board.getBrick(minRow, column);
            const brickSpriteComponent = this.ecsManager.getComponent(brick, 'sprite');
            const ghostSpriteComponent = this.ecsManager.getComponent(this.ghostBrick, 'sprite');
            ghostSpriteComponent.spriteClass = brickSpriteComponent.spriteClass;
        }

        for (let r = minRow; r <= maxRow; r++) {
            this._displaceBrick(r, column, displaceAmount);
        }
    }

    _displaceBrick(row, column, amount) {
        const entity = this.board.getBrick(row, column);
        if (entity === ECS_INVALID_ENTITY) {
            return;
        }
        const displacementComponent = this.ecsManager.getComponent(entity, 'displacement');
        displacementComponent.active = true;
        displacementComponent.amount.setTo(amount);
        const spriteComponent = this.ecsManager.getComponent(entity, 'sprite');
        spriteComponent.opacity = 0.5;
        spriteComponent.depth = 80;
    }

    _shiftBricksHorizontally(row, column, direction) {
        const minColumn = this._findFurthestHorizontally(row, column, -1);
        const maxColumn = this._findFurthestHorizontally(row, column, +1);
        if (minColumn === maxColumn) {
            return false;
        }
        if (direction < 0) {
            for (let c = minColumn; c < maxColumn; c++) {
                this.facade.swapBricks(row, c, row, c + 1);
            }
        } else {
            for (let c = maxColumn; c > minColumn; c--) {
                this.facade.swapBricks(row, c, row, c - 1);
            }
        }
        return true;
    }

    _shiftBricksVertically(row, column, direction) {
        const minRow = this._findFurthestVertically(row, column, -1);
        const maxRow = this._findFurthestVertically(row, column, +1);
        if (minRow === maxRow) {
            return false;
        }
        if (direction < 0) {
            for (let r = minRow; r < maxRow; r++) {
                this.facade.swapBricks(r, column, r + 1, column);
            }
        } else {
            for (let r = maxRow; r > minRow; r--) {
                this.facade.swapBricks(r, column, r - 1, column);
            }
        }
        return true;
    }

    _findFurthestHorizontally(row, column, direction) {
        let entity = this.board.getBrick(row, column + direction);
        while (this.ecsManager.hasEntity(entity) && this.ecsManager.hasComponent(entity, 'displacement')) {
            column += direction;
            entity = this.board.getBrick(row, column + direction);
        }
        return column;
    }

    _findFurthestVertically(row, column, direction) {
        let entity = this.board.getBrick(row + direction, column);
        while (this.ecsManager.hasEntity(entity) && this.ecsManager.hasComponent(entity, 'displacement')) {
            row += direction;
            entity = this.board.getBrick(row + direction, column);
        }
        return row;
    }
}
