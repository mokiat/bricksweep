'use strict';

const BRICK_WIDTH = 64;
const BRICK_HEIGHT = 64;
const BRICK_MARGIN = 10;

class Board {
    constructor() {
        this.bricks = [];
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
        this.bricks = new Array(width, height);
    }

    contains(row, column) {
        return (row >= 0) && (column >= 0) && (row < this.height) && (column < this.width);
    }

    setBrick(row, column, tile) {
        this.bricks[row * this.width + column] = tile;
    }

    getBrick(row, column) {
        if (!this.contains(row, column)) {
            return ECS_INVALID_ENTITY;
        }
        return this.bricks[row * this.width + column];
    }

    calculateBrickIdealScreenPosition(row, column) {
        return new Vec2(
            column * (BRICK_WIDTH + BRICK_MARGIN),
            row * (BRICK_HEIGHT + BRICK_MARGIN)
        );
    }

    calculateScreenWidth() {
        return this.width * BRICK_WIDTH + (this.width - 1) * BRICK_MARGIN;
    }

    calculateScreenHeight() {
        return this.height * BRICK_HEIGHT + (this.height - 1) * BRICK_MARGIN;
    }
}
