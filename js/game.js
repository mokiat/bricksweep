'use strict';

const GAME_STATE_IDLE = 0;
const GAME_STATE_CHANGED = 1;
const GAME_STATE_STABLE = 2;
const GAME_STATE_BLINK = 3;
const GAME_STATE_VICTORY = 4;
const GAME_STATE_DEFEAT = 5;

const GAME_ACHIEVEMENT_BRONZE = 'bronze';
const GAME_ACHIEVEMENT_SILVER = 'silver';
const GAME_ACHIEVEMENT_GOLD = 'gold';

class DialogPageObject {
    constructor(jqElement) {
        this.jqElement = jqElement;
        this.modal = M.Modal.init(this.jqElement.get(0), {
            dismissible: false
        });
    }

    listenOnExit(callback) {
        this.jqElement.find('#dialog-exit').click(() => {
            callback();
        });
    }

    listenOnRetry(callback) {
        this.jqElement.find('#dialog-retry').click(() => {
            callback();
        });
    }

    listenOnContinue(callback) {
        this.jqElement.find('#dialog-continue').click(() => {
            callback();
        });
    }

    openPaused() {
        this._clear();
        this.jqElement.find('#label-paused').show();
        this.jqElement.find('#dialog-continue').show();
        this._open();
    }

    openDefeat() {
        this._clear();
        this.jqElement.find('#label-defeat').show();
        this._open();
    }

    openVictory(achievement) {
        this._clear();
        this.jqElement.find('#label-victory').show();
        switch (achievement) {
            case GAME_ACHIEVEMENT_BRONZE:
                this.jqElement.find('#achievement-bronze').show();
                break;
            case GAME_ACHIEVEMENT_SILVER:
                this.jqElement.find('#achievement-silver').show();
                break;
            case GAME_ACHIEVEMENT_GOLD:
                this.jqElement.find('#achievement-gold').show();
                break;
        }
        this.jqElement.find('#dialog-continue').show();
        this._open();
    }

    _clear() {
        this.jqElement.find('.label').hide();
        this.jqElement.find('.achievement').hide();
        this.jqElement.find('#dialog-continue').hide();
    }

    _open() {
        this.modal.open();
    }
}

class StatusPageObject {
    constructor(jqElement) {
        this.jqElement = jqElement;
    }

    setTargetMoves(moves) {
        this.jqElement.find('#target-moves').text(moves);
    }

    setCurrentMoves(moves) {
        this.jqElement.find('#current-moves').text(moves);
    }
}

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
        this.jqElement.on('touchstart', (e) => {
            this._notifyTouchEvent(e, listener);
        });
        this.jqElement.mousedown((e) => {
            e.preventDefault();
            this._notifyMouseEvent(e, listener);
        });
    }

    listenOnMouseUp(listener) {
        this.jqElement.on('touchend', (e) => {
            this._notifyTouchEvent(e, listener);
        });
        this.jqElement.mouseup((e) => {
            this._notifyMouseEvent(e, listener);
        });
    }

    listenOnMouseMove(listener) {
        this.jqElement.on('touchmove', (e) => {
            this._notifyTouchEvent(e, listener);
        });
        this.jqElement.mousemove((e) => {
            this._notifyMouseEvent(e, listener);
        });
    }

    _notifyTouchEvent(e, listener) {
        e.preventDefault();
        const touch = event.targetTouches[0];
        const offset = this.jqTilesetElement.offset();
        listener(
            touch.pageX - offset.left,
            touch.pageY - offset.top
        );
    }

    _notifyMouseEvent(e, listener) {
        e.preventDefault();
        const offset = this.jqTilesetElement.offset();
        listener(
            e.pageX - offset.left,
            e.pageY - offset.top
        );
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

        this.statusPO = new StatusPageObject(this.jqElement.find('#status').first());

        this.dialogPO = new DialogPageObject(this.jqElement.find('#dialog').first());
        this.dialogPO.listenOnExit(() => {
            this.frameManager.openPrevious();
        });
        this.dialogPO.listenOnRetry(() => {
            this._clearScene();
            this._initScene(this.activeLevel);
        });
        this.dialogPO.listenOnContinue(() => {
            if ((this.gameState === GAME_STATE_VICTORY) && (this.levelIndex < 23)) {
                this._playLevel(this.levelSetIndex, this.levelIndex + 1);
            }
        });

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
            if (this.displacementSystem.onMouseMove(x, y)) {
                this._setStateToChanged();
                this.displacementSystem.onMouseUp(x, y);
            }
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

        this._playLevel(levelSetIndex, levelIndex);

        let lastTime = new Date().valueOf();
        this.updateInterval = setInterval(() => {
            const currentTime = new Date().valueOf();
            const elaspedSeconds = (currentTime - lastTime) / 1000;
            this._updateScene(elaspedSeconds);
            lastTime = currentTime;
        }, 50);
    }

    release() {
        clearInterval(this.updateInterval);
        Frame.prototype.release.call(this);
    }

    onBackPressed() {
        this.dialogPO.openPaused();
    }

    _playLevel(levelSetIndex, levelIndex) {
        this.levelSetIndex = levelSetIndex;
        this.levelIndex = levelIndex;
        this._clearScene();
        this._loadLevel(levelSetIndex, levelIndex, (level) => {
            this._initScene(level);
        });
    }

    _clearScene() {
        this.gameState = GAME_STATE_IDLE;
        this.blinkGroup = [];

        this.statusPO.setTargetMoves(0);
        this.statusPO.setCurrentMoves(0);

        this.ecsManager.reset();
        this.displacementSystem.reset();
        this.tipSystem.cancel();
        this.spriteSystem.update(0);
    }

    _loadLevel(levelSetIndex, levelIndex, callback) {
        console.log('loading level %d-%d', levelSetIndex, levelIndex);
        $.get(`/assets/levels/set${levelSetIndex}/level${levelIndex}.json`, callback);
    }

    _initScene(level) {
        console.log('level size: %d / %d', level.width, level.height);
        this.activeLevel = level;
        this.sceneInitializer.applyLevel(level);
        this.statusPO.setTargetMoves(level.gold_moves);
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
        this.statusPO.setCurrentMoves(moves);

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
        this.gameState = GAME_STATE_STABLE;
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
        this.gameState = GAME_STATE_VICTORY;
        const moves = this.displacementSystem.getMoves();
        if (moves <= this.activeLevel.gold_moves) {
            this.progress.setStatus(this.levelSetIndex, this.levelIndex, PROGRESS_GOLD);
            this.dialogPO.openVictory(GAME_ACHIEVEMENT_GOLD);
        } else if (moves <= this.activeLevel.silver_moves) {
            this.progress.setStatus(this.levelSetIndex, this.levelIndex, PROGRESS_SILVER);
            this.dialogPO.openVictory(GAME_ACHIEVEMENT_SILVER);
        } else {
            this.progress.setStatus(this.levelSetIndex, this.levelIndex, PROGRESS_BRONZE);
            this.dialogPO.openVictory(GAME_ACHIEVEMENT_BRONZE);
        }
    }

    _setStateToDefeat() {
        console.log('[game] state: defeat');
        this.gameState = GAME_STATE_DEFEAT;
        this.dialogPO.openDefeat();
    }
}
