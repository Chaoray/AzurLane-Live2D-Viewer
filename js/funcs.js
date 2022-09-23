const bg = document.getElementById("bg");

function loadBackground(path) {
    bg.style.backgroundImage = `url("${path}")`;
}

function setBlur(setting) {
    bg.style.filter = `blur(${setting})`;
}

function loadModel(path) {
    if (!app) return;
    if (window.model) app.stage.removeChild(window.model);

    let m = PIXI.live2d.Live2DModel.fromSync(path);

    m.once('load', () => {
        app.stage.addChild(m);
        window.model = m;
        window.onresize();

        m.on('hit', (hitAreaNames) => {
            if (hitAreaNames.includes('Special')) {
                m.motion('touch_special', 0, PIXI.live2d.MotionPriority.NORMAL);
            } else if (hitAreaNames.includes('Head')) {
                m.motion('touch_head', 0, PIXI.live2d.MotionPriority.NORMAL);
            } else if (hitAreaNames.includes('Body')) {
                m.motion('touch_body', 0, PIXI.live2d.MotionPriority.NORMAL);
            }
        });

        m.motion("login", 0, PIXI.live2d.MotionPriority.FORCE);
    });
}