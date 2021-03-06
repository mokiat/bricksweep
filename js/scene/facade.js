'use strict';

class GameFacade {
    constructor(ecsManager, board, tipSystem) {
        this.ecsManager = ecsManager;
        this.board = board;
        this.tipSystem = tipSystem;
    }

    reset(width, height) {
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

    destroyBrick(row, column) {
        const entity = this.board.getBrick(row, column);
        this.ecsManager.deleteEntity(entity);
        this.board.setBrick(row, column, ECS_INVALID_ENTITY);
    }

    createBlinkingBrickOverlay(row, column, type) {
        const entity = this.ecsManager.createEntity();
        this._addBrickPosition(entity, row, column);
        this._addBrickSprite(entity, type);
        this._addBrickBlink(entity);
        return entity;
    }

    swapBricks(firstRow, firstColumn, secondRow, secondColumn) {
        const firstEntity = this.board.getBrick(firstRow, firstColumn);
        const firstPositionComponent = this.ecsManager.getComponent(firstEntity, 'position');
        const firstCoords = firstPositionComponent.coords.clone();
        const firstBrickComponent = this.ecsManager.getComponent(firstEntity, 'brick');

        const secondEntity = this.board.getBrick(secondRow, secondColumn);
        const secondPositionComponent = this.ecsManager.getComponent(secondEntity, 'position');
        const secondCoords = secondPositionComponent.coords.clone();
        const secondBrickComponent = this.ecsManager.getComponent(secondEntity, 'brick');

        firstPositionComponent.coords.setTo(secondCoords);
        firstBrickComponent.row = secondRow;
        firstBrickComponent.column = secondColumn;
        this.board.setBrick(secondRow, secondColumn, firstEntity);

        secondPositionComponent.coords.setTo(firstCoords);
        secondBrickComponent.row = firstRow;
        secondBrickComponent.column = firstColumn;
        this.board.setBrick(firstRow, firstColumn, secondEntity);
    }

    activateTip(row, column) {
        const position = this.board.calculateBrickIdealScreenPosition(row, column);
        this.tipSystem.activate(position);
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
        spriteComponent.width = BRICK_WIDTH;
        spriteComponent.height = BRICK_HEIGHT;
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
