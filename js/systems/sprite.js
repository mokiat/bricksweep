'use strict';

class SpriteSystem {
    constructor(ecsManager) {
        this.ecsManager = ecsManager;
        this.spriteQuery = new ECSQuery(
            (entity) => ecsManager.hasComponent(entity, 'position'),
            (entity) => ecsManager.hasComponent(entity, 'sprite')
        );
        this.reset();
    }

    reset() {
        this.cache = new Map();
    }

    update() {
        this._cleanup();
        for (let entity of this.ecsManager.search(this.spriteQuery)) {
            const position = this.ecsManager.getComponent(entity, 'position');
            const sprite = this.ecsManager.getComponent(entity, 'sprite');
            const element = this._getElementForEntity(entity);
            element.css('left', `${position.coords.x}px`);
            element.css('top', `${position.coords.y}px`);
            element.css('width', `${sprite.width}px`);
            element.css('height', `${sprite.height}px`);
            element.css('opacity', sprite.opacity);
            element.css('z-index', 100 - sprite.depth);
            if (!element.hasClass(sprite.spriteClass)) {
                element.removeClass();
                element.addClass('tile');
                element.addClass(sprite.spriteClass);
            }
        }
    }

    _cleanup() {
        for (let entity of this.cache.keys()) {
            if (!this.ecsManager.hasEntity(entity)) {
                const element = this.cache.get(entity);
                element.remove();
                this.cache.delete(entity);
            }
        }
    }

    _getElementForEntity(entity) {
        if (this.cache.has(entity)) {
            return this.cache.get(entity);
        }
        const element = $('<div></div>').appendTo('.tileset');
        this.cache.set(entity, element);
        return element;
    }
};
