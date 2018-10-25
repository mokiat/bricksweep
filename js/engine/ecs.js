'use strict';

const ECS_MAX_ENTITIES = 1024;

class ECSSlot {
    constructor() {
        this.components = new Map();
    }
};

class ECSQuery {
    constructor(...filters) {
        this.filters = filters;
    }

    matches(entity) {
        for (let filter of this.filters) {
            if (!filter(entity)) {
                return false;
            }
        }
        return true;
    }
};

class ECSManager {
    constructor() {
        this.freeID = 0;
        this.reset();
    }

    reset() {
        this.slots = new Map();
    }

    createEntity() {
        if (this.slots.size === ECS_MAX_ENTITIES) {
            throw new Error('maximum number of entities reached');
        }

        const entity = this.freeID;
        this.freeID++;
        this.slots.set(entity, new ECSSlot());
        return entity;
    }

    deleteEntity(entity) {
        if (!this.slots.delete(entity)) {
            throw new Error('trying to delete an entity that is already gone');
        }
    }

    hasEntity(entity) {
        return this.slots.has(entity);
    }

    addComponent(entity, name, component) {
        const slot = this.slots.get(entity);
        slot.components.set(name, component);
    }

    removeComponent(entity, name) {
        const slot = this.slots.get(entity);
        slot.components.delete(name);
    }

    getComponent(entity, name) {
        const slot = this.slots.get(entity);
        return slot.components.get(name);
    }

    hasComponent(entity, name) {
        const slot = this.slots.get(entity);
        return slot.components.has(name);
    }

    *search(query) {
        for (let entity of this.slots.keys()) {
            if (query.matches(entity)) {
                yield entity;
            }
        }
    }
};
