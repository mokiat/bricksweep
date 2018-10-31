'use strict';

class BlinkSystem {
    constructor(ecsManager) {
        this.ecsManager = ecsManager;
        this.blinkQuery = new ECSQuery(
            (entity) => ecsManager.hasComponent(entity, 'blink'),
            (entity) => ecsManager.hasComponent(entity, 'sprite')
        );
    }

    update(elapsedSeconds) {
        for (let entity of this.ecsManager.search(this.blinkQuery)) {
            const blinkComponent = this.ecsManager.getComponent(entity, 'blink');
            blinkComponent.remainingSeconds -= elapsedSeconds;
            if (blinkComponent.remainingSeconds <= 0.0) {
                this.ecsManager.deleteEntity(entity);
                continue;
            }
            blinkComponent.angle += blinkComponent.angleSpeed * elapsedSeconds;
            const spriteComponent = this.ecsManager.getComponent(entity, 'sprite');
            spriteComponent.opacity = Math.cos(blinkComponent.angle * Math.PI / 180);
        }
    }
}
