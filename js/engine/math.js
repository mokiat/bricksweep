'use strict';

class Vec2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    inc(other) {
        this.x += other.x;
        this.y += other.y;
    }

    getInc(other) {
        return new Vec2(
            this.x + other.x,
            this.y + other.y
        );
    }

    dec(other) {
        this.x -= other.x;
        this.y -= other.y;
    }

    getDec(other) {
        return new Vec2(
            this.x - other.x,
            this.y - other.y
        );
    }

    getLengthSquared() {
        return this.x * this.x + this.y * this.y;
    }

    getLength() {
        return Math.sqrt(this.getLengthSquared());
    }

    getResized(newLenght) {
        const ratio = newLenght / this.getLength();
        return new Vec2(
            this.x * ratio,
            this.y * ratio
        );
    }
}