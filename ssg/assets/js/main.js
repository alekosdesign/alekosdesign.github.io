document.body.onload = function() {
    setTimeout(function() {
        var preloader = document.getElementById("preloader");
        preloader.classList.contains("done") || preloader.classList.add("done");
    }, 500);
}