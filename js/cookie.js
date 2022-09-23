let cookie = document.cookie;
if (cookie === "") {
    cookie = {
        model: config.default_model,
        bg: config.default_background
    }
    saveCookie(cookie);
} else {
    cookie = JSON.parse(cookie);
}

function saveCookie(c) {
    document.cookie = JSON.stringify(c);
}
