'use strict';

const TIP_ANIMATION_DURATION = 5;
const TIP_HAND_SPEED = 64;

class TipSystem {
    constructor(ecsManager) {
        this.ecsManager = ecsManager;

        this.origin = new Vec2();
        this.totalElapsedSeconds = TIP_ANIMATION_DURATION + 1;
        this.arrowEntity = ECS_INVALID_ENTITY;
        this.handEntity = ECS_INVALID_ENTITY;
    }

    activate(position) {
        this.origin = position;
        this.totalElapsedSeconds = 0;
        this.arrowEntity = this._createArrow(position);
        this.handEntity = this._createHand(position);
    }

    cancel() {
        this.totalElapsedSeconds = TIP_ANIMATION_DURATION + 1;
        this._deleteEntities();
    }

    update(elapsedSeconds) {
        if (this.totalElapsedSeconds > TIP_ANIMATION_DURATION) {
            this._deleteEntities();
            return;
        }
        this.totalElapsedSeconds += elapsedSeconds;

        const positionComponent = this.ecsManager.getComponent(this.handEntity, 'position');
        positionComponent.coords.x += elapsedSeconds * TIP_HAND_SPEED;
        if (positionComponent.coords.x > this.origin.x + 128) {
            positionComponent.coords.x = this.origin.x;
        }
    }

    _createArrow(position) {
        const entity = this.ecsManager.createEntity();

        const positionComponent = new PositionComponent();
        positionComponent.coords = new Vec2(
            position.x + BRICK_WIDTH / 3,
            position.y
        );
        this.ecsManager.addComponent(entity, 'position', positionComponent);

        const spriteComponent = new SpriteComponent();
        spriteComponent.width = 128;
        spriteComponent.height = 64;
        spriteComponent.opacity = 0.8;
        spriteComponent.spriteClass = 'typearrow';
        this.ecsManager.addComponent(entity, 'sprite', spriteComponent);

        return entity;
    }

    _createHand(position) {
        const entity = this.ecsManager.createEntity();

        const positionComponent = new PositionComponent();
        positionComponent.coords = new Vec2(
            position.x,
            position.y + BRICK_HEIGHT / 2
        );
        this.ecsManager.addComponent(entity, 'position', positionComponent);

        const spriteComponent = new SpriteComponent();
        spriteComponent.width = 64;
        spriteComponent.height = 64;
        spriteComponent.opacity = 0.8;
        spriteComponent.spriteClass = 'typehand';
        this.ecsManager.addComponent(entity, 'sprite', spriteComponent);

        return entity;
    }

    _deleteEntities() {
        if (this.ecsManager.hasEntity(this.arrowEntity)) {
            this.ecsManager.deleteEntity(this.arrowEntity);
        }
        if (this.ecsManager.hasEntity(this.handEntity)) {
            this.ecsManager.deleteEntity(this.handEntity);
        }
    }
}
