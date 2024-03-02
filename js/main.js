const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => p.querySelectorAll(s);

const hitAreaFrames = new PIXI.live2d.HitAreaFrames();
hitAreaFrames.visible = false;
let cookie = loadCookie();

(function main() {    
    initPIXIApplication();
    loadModelToPIXI(cookie.cache.model);
    
    setBackground(cookie.cache.bg);
    
    initControls();
    initWindowEvent();
    onFrameUpdate();
})();

function loadCookie() {
    let cookie = {
        cache: {
            model: Cookies.get('model'),
            bg: Cookies.get('bg')
        },
        save: () => {
            Cookies.set('model', cookie.cache.model);
            Cookies.set('bg', cookie.cache.bg);
        },
    };

    if (Cookies.get('model') === undefined) {
        cookie.cache = {
            model: config.default_model,
            bg: config.default_background
        }
        cookie.save();
    }
    return cookie;
}

function setBackground(path) {
    const background = $("#bg");
    background.style.backgroundImage = `url("${path}")`;
}

function loadModelToPIXI(path) {
    if (!window.app) return;
    if (window.model) window.app.stage.removeChild(window.model);

    $('#loading').style.visibility = 'visible';
    let model = PIXI.live2d.Live2DModel.fromSync(path);

    model.once('load', () => {
        window.app.stage.addChild(model);
        window.model = model;
        window.onresize();

        model.on('hit', (hitAreas) => {
            model.motion(hitAreas[0], 0, PIXI.live2d.MotionPriority.NORMAL);
        });

        model.on("pointerdown", (e) => {
            model.dragging = true;
            model._pointerX = e.data.global.x - model.x;
            model._pointerY = e.data.global.y - model.y;
        });
        model.on("pointermove", (e) => {
            if (model.dragging) {
                model.position.x = e.data.global.x - model._pointerX;
                model.position.y = e.data.global.y - model._pointerY;
            }
        });
        model.on("pointerupoutside", () => (model.dragging = false));
        model.on("pointerup", () => (model.dragging = false));

        window.model.addChild(hitAreaFrames);

        model.internalModel.motionManager.groups.idle = 'idle';
        model.motion("login", 0, PIXI.live2d.MotionPriority.FORCE);

        updateMotionContainer();

        $('#loading').style.visibility = 'hidden';
    });
}

async function fetchFilesInDir(dir) {
    const response = await fetch('https://api.github.com/repos/chaoray/AzurLane-Live2D-Viewer/contents/' + dir);
    const data = await response.json();
    return data;
}

function onFrameUpdate() {
    if (!window.model) return requestAnimationFrame(onFrameUpdate);
    if (!window.model.internalModel) return requestAnimationFrame(onFrameUpdate);
    if (!window.model.internalModel.motionManager.playing) window.model.motion('idle', 0, PIXI.live2d.MotionPriority.IDLE);
    requestAnimationFrame(onFrameUpdate);
}

function resizeModel() {
    if (!window.model) return;
    if (!window.app) return;

    window.model.scale.set(1);
    window.app.stage.scale.set(1);
    const scaleX = window.innerWidth / window.model.width;
    const scaleY = window.innerHeight / window.model.height;
    window.model.scale.set(Math.min(scaleX, scaleY));
    window.model.x = (window.innerWidth - window.model.width) / 2;
    window.model.y = (window.innerHeight - window.model.height) / 2;
}

function initPIXIApplication() {
    window.app = new PIXI.Application({
        view: $("#canvas"),
        autoStart: true,
        resizeTo: window,
        backgroundAlpha: 0
    });

    window.app.view.addEventListener('mouseup', (e) => {
        if (!window.model) return;
        if (e.button !== 0) return;
        window.model.motion(`main_${Math.floor(Math.random() * 3) + 1}`, 0, PIXI.live2d.MotionPriority.NORMAL);
    });

    // PIXI.live2d.config.idleMotionFadingDuration = 0;
}

function initWindowEvent() {
    window.onresize = () => {
        resizeModel();
    };

    window.onmousedown = (e) => {
        if (e.button == 1) {
            resizeModel();
        }
    };

    function getModelCenter() {
        let cx = window.model.x + window.model.width / 2;
        let cy = window.model.y + window.model.height / 2;
        return { x: cx, y: cy };
    }

    window.app.view.onwheel = (e) => {
        let scale = -(Math.sign(e.deltaY) * config.scaleRatio);

        let center1 = getModelCenter();

        window.model.scale.x += scale;
        window.model.scale.y += scale;

        let center2 = getModelCenter();

        window.model.x += center1.x - center2.x;
        window.model.y += center1.y - center2.y;
    };
}

async function initControls() {
    await initModelSelector();
    await initBackgroundDisplay();
    initShowHitAreasCheckBox();
}

async function initModelSelector() {
    let modelSelector = $('#model-select');
    let models = await fetchFilesInDir('assets');
    for (let i = 0; i < models.length; i++) {
        let option = new Option(models[i].name, i, false, false);
        if (cookie.cache.model.includes(models[i].name)) {
            option.selected = true;
        }
        modelSelector.options.add(option);
    }
    modelSelector.onchange = (e) => {
        let index = e.target.value;
        let path = `${models[index].path}/${models[index].name}.model3.json`;
        loadModelToPIXI(path);

        cookie.cache.model = path;
        cookie.save();
    };
}

function initShowHitAreasCheckBox() {
    let checkbox = $("#show-hitareas");
    checkbox.onchange = (e) => {
        hitAreaFrames.visible = e.target.checked;
    };
}

function updateMotionContainer() {
    if (!window.model) return;

    let container = $("#motion-container");
    container.innerHTML = "";

    let motions = Object.keys(window.model.internalModel.motionManager.definitions);
    motions = motions.sort((a, b) => a.localeCompare(b));
    for (let motion of motions) {
        let button = document.createElement('button');
        button.innerHTML = motion;
        button.classList.add('control');
        button.onclick = () => {
            if (!window.model) return;
            window.model.motion(motion, 0, PIXI.live2d.MotionPriority.NORMAL);
        };

        container.appendChild(button);
    }
}

async function initBackgroundDisplay() {
    let displayContainer = $('#background-display');
    $('#bg-select').onclick = () => {
        if (displayContainer.style.visibility === 'hidden') {
            displayContainer.style.visibility = 'visible';
        } else {
            displayContainer.style.visibility = 'hidden';
        }
    };

    let backgrounds = await fetchFilesInDir('bg');
    for (let i = 0; i < backgrounds.length; i++) {
        let img = document.createElement('img');
        img.src = backgrounds[i].path;
        img.title = backgrounds[i].name;
        img.dataset.i = i;
        img.classList.add('background-item');

        img.onclick = (e) => {
            let path = backgrounds[e.target.dataset.i].path;
            setBackground(path);
            cookie.cache.bg = path;
            cookie.save();
        };

        displayContainer.appendChild(img);
    }
}
