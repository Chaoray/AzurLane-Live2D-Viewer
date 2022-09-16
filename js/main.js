const app = new PIXI.Application({
    view: document.getElementById("canvas"),
    autoStart: true,
    resizeTo: window,
    backgroundAlpha: 0
});

const model = PIXI.live2d.Live2DModel.fromSync(
    config.character,
    {
        idleMotionGroup: 'idle'
    });

window.onresize = (e) => {
    if (!window.model) return;
    model.scale.set(1);
    model.scale.set(window.innerWidth / model.width);
    model.y = (window.innerHeight - model.height) / 2
    // if (model.x < 0) setTimeout(() => window.onresize(), 1000); // for full height show
};

model.once('load', () => {
    app.stage.addChild(model);
    window.model = model;
    window.onresize();

    model.on('hit', (hitAreaNames) => {
        if (hitAreaNames.includes('Special')) {
            model.motion('touch_special', 0, PIXI.live2d.MotionPriority.NORMAL);
        } else if (hitAreaNames.includes('Head')) {
            model.motion('touch_head', 0, PIXI.live2d.MotionPriority.NORMAL);
        } else if (hitAreaNames.includes('Body')) {
            model.motion('touch_body', 0, PIXI.live2d.MotionPriority.NORMAL);
        }
    });

    app.view.addEventListener('mouseup', (e) => {
        model.motion(`main_${Math.floor(Math.random() * 3) + 1}`, 0, PIXI.live2d.MotionPriority.NORMAL);
    });

    model.motion("login", 0, PIXI.live2d.MotionPriority.FORCE);
});

(function tick() {
    if (!model) return requestAnimationFrame(tick);
    if (!model.internalModel) return requestAnimationFrame(tick);
    if (!model.internalModel.motionManager.playing) model.motion('idle', 0, PIXI.live2d.MotionPriority.IDLE);
    requestAnimationFrame(tick);
})();

loadBackground(config.background);
setBlur(config.blur);
