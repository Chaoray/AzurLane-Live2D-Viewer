const bg = document.getElementById("background");

function loadBackground(path) {
    bg.style.backgroundImage = `url("${path}")`;
}

function setBlur(setting) {
    bg.style.filter = `blur(${setting})`;
}
