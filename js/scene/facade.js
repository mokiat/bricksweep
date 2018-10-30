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

        const positionComponent = new PositionComponent();
        positionComponent.coords = this.board.calculateBrickIdealScreenPosition(row, column);
        this.ecsManager.addComponent(entity, 'position', positionComponent);

        const brickComponent = new BrickComponent();
        brickComponent.row = row;
        brickComponent.column = column;
        brickComponent.type = type;
        this.ecsManager.addComponent(entity, 'brick', brickComponent);

        const spriteComponent = new SpriteComponent();
        spriteComponent.width = 64;
        spriteComponent.height = 64;
        spriteComponent.opacity = 1.0;
        spriteComponent.spriteClass = type.spriteClass;
        this.ecsManager.addComponent(entity, 'sprite', spriteComponent);

        if (type.isMovable) {
            this.ecsManager.addComponent(entity, 'displacement', new DisplacementComponent());
        }

        this.board.setBrick(row, column, entity);

        return entity;
    }
}
