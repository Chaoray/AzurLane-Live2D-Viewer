let cookie = document.cookie;
if (cookie === "") {
    cookie = {
        model: config.default_model,
        bg: config.default_background
    }
    saveCookie(cookie);
}

function saveCookie(c) {
    document.cookie = JSON.stringify(c);
}
