'use strict';

class GameFacade {
    constructor(ecsManager, board) {
        this.ecsManager = ecsManager;
        this.board = board;
    }

    reset(width, height) {
        this.ecsManager.reset();
        this.board.resize(width, height);
    }

    createBrick(row, column, type) {
        const entity = this.ecsManager.createEntity();
        this._addBrickPosition(entity, row, column);
        this._addBrickBrick(entity, row, column, type);
        this._addBrickSprite(entity, type);
        if (type.isMovable) {
            this._addBrickDisplacement(entity);
        }
        this.board.setBrick(row, column, entity);
        return entity;
    }

    createBlinkingBrickOverlay(row, column, type) {
        const entity = this.ecsManager.createEntity();
        this._addBrickPosition(entity, row, column);
        this._addBrickSprite(entity, type);
        this._addBrickBlink(entity);
        return entity;
    }

    _addBrickPosition(entity, row, column) {
        const positionComponent = new PositionComponent();
        positionComponent.coords = this.board.calculateBrickIdealScreenPosition(row, column);
        this.ecsManager.addComponent(entity, 'position', positionComponent);
    }

    _addBrickBrick(entity, row, column, type) {
        const brickComponent = new BrickComponent();
        brickComponent.row = row;
        brickComponent.column = column;
        brickComponent.type = type;
        this.ecsManager.addComponent(entity, 'brick', brickComponent);
    }

    _addBrickSprite(entity, type) {
        const spriteComponent = new SpriteComponent();
        spriteComponent.width = 64;
        spriteComponent.height = 64;
        spriteComponent.opacity = 1.0;
        spriteComponent.spriteClass = type.spriteClass;
        this.ecsManager.addComponent(entity, 'sprite', spriteComponent);
    }

    _addBrickDisplacement(entity) {
        this.ecsManager.addComponent(entity, 'displacement', new DisplacementComponent());
    }

    _addBrickBlink(entity) {
        const blinkComponent = new BlinkComponent();
        blinkComponent.angle = 0;
        blinkComponent.remainingSeconds = 2;
        this.ecsManager.addComponent(entity, 'blink', blinkComponent);
    }
}
