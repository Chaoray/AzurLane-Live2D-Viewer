const app = new PIXI.Application({
    view: document.getElementById("canvas"),
    autoStart: true,
    resizeTo: window,
    backgroundAlpha: 0
});

loadModel(config.default_model);
loadBackground(config.default_background);
setBlur(config.blur);

window.onresize = (e) => {
    if (!window.model) return;

    window.model.scale.set(1);
    const scaleX = window.innerWidth / window.model.width;
    const scaleY = window.innerHeight / window.model.height;
    window.model.scale.set(Math.min(scaleX, scaleY));
    window.model.x = (window.innerWidth - window.model.width) / 2;
    window.model.y = (window.innerHeight - window.model.height) / 2;
};

app.view.addEventListener('mouseup', () => {
    if (!window.model) return;
    window.model.motion(`main_${Math.floor(Math.random() * 3) + 1}`, 0, PIXI.live2d.MotionPriority.NORMAL);
});

(function tick() {
    if (!window.model) return requestAnimationFrame(tick);
    if (!window.model.internalModel) return requestAnimationFrame(tick);
    if (!window.model.internalModel.motionManager.playing) window.model.motion('idle', 0, PIXI.live2d.MotionPriority.IDLE);
    requestAnimationFrame(tick);
})();

let model_selector = document.getElementById('model-select');
for (let i = 0; i < data.models.length; i++) {
    model_selector.options.add(new Option(data.models[i], data.models[i], false, false));
}
model_selector.onchange = (e) => {
    loadModel(`assets/${e.target.value}/${e.target.value}.model3.json`);
};

let bg_selector = document.getElementById('bg-select');
for (let i = 0; i < data.backgrounds.length; i++) {
    bg_selector.options.add(new Option(data.backgrounds[i], data.backgrounds[i], false, false));
}
bg_selector.onchange = (e) => {
    loadBackground(`bg/${e.target.value}`);
};
