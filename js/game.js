'use strict';

const GAME_STATE_IDLE = 0;
const GAME_STATE_CHANGED = 1;
const GAME_STATE_STABLE = 2;
const GAME_STATE_BLINK = 3;
const GAME_STATE_VICTORY = 4;
const GAME_STATE_DEFEAT = 5;

class PlayAreaPageObject {
    constructor(jqElement) {
        this.jqElement = jqElement;
        this.jqTilesetElement = jqElement.find('.tileset').first();
    }

    resize(width, height) {
        this.jqTilesetElement.css('width', `${width}px`);
        this.jqTilesetElement.css('height', `${height}px`);
    }

    listenOnMouseDown(listener) {
        this.jqElement.mousedown((e) => {
            const offset = this.jqTilesetElement.offset();
            listener(
                e.pageX - offset.left,
                e.pageY - offset.top
            );
        });
    }

    listenOnMouseUp(listener) {
        this.jqElement.mouseup((e) => {
            const offset = this.jqTilesetElement.offset();
            listener(
                e.pageX - offset.left,
                e.pageY - offset.top
            );
        });
    }

    listenOnMouseMove(listener) {
        this.jqElement.mousemove((e) => {
            const offset = this.jqTilesetElement.offset();
            listener(
                e.pageX - offset.left,
                e.pageY - offset.top
            );
        });
    }
}

class GameFrame extends Frame {
    constructor(frameManager, progress) {
        super(frameManager, '#game');
        this.progress = progress;
        this.gameState = GAME_STATE_IDLE;
        this.blinkGroup = [];
        this.ecsManager = new ECSManager();
        this.board = new Board();
        this.spriteSystem = new SpriteSystem(this.ecsManager);
        this.motionSystem = new MotionSystem(this.ecsManager, this.board);
        this.blinkSystem = new BlinkSystem(this.ecsManager);
        this.tipSystem = new TipSystem(this.ecsManager);
        this.gameFacade = new GameFacade(this.ecsManager, this.board, this.tipSystem);
        this.fuseSystem = new FuseSystem(this.ecsManager, this.board, this.gameFacade);
        this.displacementSystem = new DisplaceSystem(this.ecsManager, this.board, this.gameFacade);
        this.sceneInitializer = new SceneInitializer(this.gameFacade);

        this.playAreaPO = new PlayAreaPageObject(this.jqElement.find('.area').first());
        this.playAreaPO.listenOnMouseDown((x, y) => {
            if (this.gameState !== GAME_STATE_IDLE) {
                return;
            }
            this.displacementSystem.onMouseDown(x, y);
        });
        this.playAreaPO.listenOnMouseMove((x, y) => {
            if (this.gameState !== GAME_STATE_IDLE) {
                return;
            }
            this.displacementSystem.onMouseMove(x, y);
        });
        this.playAreaPO.listenOnMouseUp((x, y) => {
            this.displacementSystem.onMouseUp(x, y);
            if (this.gameState === GAME_STATE_IDLE) {
                this._setStateToChanged();
            }
        });

    }

    initialize(levelSetIndex, levelIndex) {
        Frame.prototype.initialize.call(this);

        this.levelSetIndex = levelSetIndex;
        this.levelIndex = levelIndex;
        this._clearScene();
        this._loadLevel(levelSetIndex, levelIndex, (level) => {
            this._initScene(level);
        });

        let lastTime = new Date().valueOf();
        this.updateInterval = setInterval(() => {
            const currentTime = new Date().valueOf();
            const elaspedSeconds = (currentTime - lastTime) / 1000;
            this._updateScene(elaspedSeconds);
            lastTime = currentTime;
        }, 100);
    }

    release() {
        clearInterval(this.updateInterval);
        Frame.prototype.release.call(this);
    }

    _clearScene() {

    }

    _loadLevel(levelSetIndex, levelIndex, callback) {
        console.log('loading level %d-%d', levelSetIndex, levelIndex);
        $.get(`/assets/levels/set${levelSetIndex}/level${levelIndex}.json`, callback);
    }

    _initScene(level) {
        console.log('level size: %d / %d', level.width, level.height);
        this.gameState = GAME_STATE_IDLE;
        this.blinkGroup = [];

        this.tipSystem.cancel();
        this.sceneInitializer.applyLevel(level);
        this.displacementSystem.reset();

        const tilesetWidth = this.board.calculateScreenWidth();
        const tilesetHeight = this.board.calculateScreenHeight();
        this.playAreaPO.resize(tilesetWidth, tilesetHeight);
    }

    _updateScene(elapsedSeconds) {
        if (this.displacementSystem.getMoves() > 0) {
            this.tipSystem.cancel();
        }
        this.motionSystem.update(elapsedSeconds);
        this.blinkSystem.update(elapsedSeconds);
        this.tipSystem.update(elapsedSeconds);
        this.displacementSystem.update(elapsedSeconds);
        this.spriteSystem.update(elapsedSeconds);

        if ((this.gameState === GAME_STATE_BLINK) && (this.fuseSystem.isBlinkComplete(this.blinkGroup))) {
            this._setStateToChanged();
        }
    }

    _setStateToIdle() {
        console.log('[game] state: idle');
        this.gameState = GAME_STATE_IDLE;
    }

    _setStateToChanged() {
        console.log('[game] state: changed');
        this.gameState = GAME_STATE_CHANGED;

        const moves = this.displacementSystem.getMoves();
        // TODO: display moves via presenter

        const group = this.fuseSystem.findFuseGroup();
        if (group.length > 0) {
            this.blinkGroup = this.fuseSystem.fuseGroup(group);
            this._setStateToBlink();
        } else {
            this._setStateToStable();
        }
    }

    _setStateToBlink() {
        console.log('[game] state: blink');
        this.gameState = GAME_STATE_BLINK;
    }

    _setStateToStable() {
        console.log('[game] state: stable');
        if (this.fuseSystem.isComplete()) {
            this._setStateToVictory();
        } else if (this.fuseSystem.isImpossible()) {
            this._setStateToDefeat();
        } else {
            this._setStateToIdle();
        }
    }

    _setStateToVictory() {
        console.log('[game] state: victory');

    }

    _setStateToDefeat() {
        console.log('[game] state: defeat');

    }
}
