'use strict';

const BRICK_SPEED = 600;

class MotionSystem {
    constructor(ecsManager, board) {
        this.ecsManager = ecsManager;
        this.board = board;
        this.motionQuery = new ECSQuery(
            (entity) => ecsManager.hasComponent(entity, 'position'),
            (entity) => ecsManager.hasComponent(entity, 'brick')
        );
    }

    update(elapsedSeconds) {
        for (let entity of this.ecsManager.search(this.motionQuery)) {
            const position = this.ecsManager.getComponent(entity, 'position');
            const brick = this.ecsManager.getComponent(entity, 'brick');

            const idealPosition = this.board.calculateBrickIdealScreenPosition(brick.row, brick.column);
            const delta = idealPosition.getDec(position.coords);
            if (delta.getLengthSquared() > 0.0001) {
                const distance = Math.min(elapsedSeconds * BRICK_SPEED, delta.getLength())
                position.coords.inc(delta.getResized(distance));
            }
        }
    }
}
