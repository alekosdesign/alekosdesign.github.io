document.body.onload = function() {
	setTimeout(function() {
		var preloader = document.getElementById("preloader");
		preloader.classList.contains("done") || preloader.classList.add("done");
	}, 500);
};
$(document).ready(function() {
	var h = $('header').height();
	$('.title, .hero__molot').css({'padding-top': h});
});
$('.offer').slick({
	infinite: true,
	swipeToSlide: true,
	touchMove: true,
	speed: 300,
	slidesToShow: 4,
	slidesToScroll: 1,
	centerPadding: '40px',
});
$('.partners').slick({
	infinite: true,
	swipeToSlide: true,
	touchMove: true,
	speed: 300,
	slidesToShow: 4,
	slidesToScroll: 1,
	centerPadding: '40px',
});
$('.hero__slider').slick({
	infinite: true,
	swipeToSlide: true,
	touchMove: true,
	speed: 300,
	slidesToShow: 1,
	slidesToScroll: 1,
	centerPadding: '40px',
});
$(document).ready(function() {
	$("body").on("click", "#open__modal__feedback", function() {
		$("#modal__feedback").fadeIn(300),
		$("body").css("overflow", "hidden")
	}),
	$(".modal__feedback__close").click(function() {
		$("#modal__feedback").fadeOut(300),
		$("body").css("overflow", "auto")
	});

	$("body").on("click", ".header__profile__login", function() {
		$("#modal__reg").fadeIn(300),
		$("body").css("overflow", "hidden")
	}),
	$(".modal__feedback__close").click(function() {
		$("#modal__reg").fadeOut(300),
		$("body").css("overflow", "auto")
	});
	
	$("body").on("click", "#open__modal__login", function() {
		$("#modal__login").fadeIn(300),
		$("#modal__reg").fadeOut(300),
		$("body").css("overflow", "hidden")
	}),
	$(".modal__feedback__close").click(function() {
		$("#modal__reg").fadeOut(300),
		$("body").css("overflow", "auto")
	});

	$("body").on("click", "#open__modal__reg", function() {
		$("#modal__reg").fadeIn(300),
		$("#modal__login").fadeOut(300),
		$("body").css("overflow", "hidden")
	}),
	$(".modal__feedback__close").click(function() {
		$("#modal__login").fadeOut(300),
		$("body").css("overflow", "auto")
	});
});

$(window).scroll(function() {
	30 < $(window).scrollTop() ? $("header").addClass("scroll") : $("header").removeClass("scroll")
});
// Mask Phone JS
window.addEventListener("DOMContentLoaded", function() {
	var keyCode;
	
	function mask(event) {
	event.keyCode && (keyCode = event.keyCode);
	var pos = this.selectionStart;
	if (pos < 1) event.preventDefault();
	var matrix = "+7 (___) ___-__-__",
	i = 0,
	def = matrix.replace(/\D/g, ""),
	val = this.value.replace(/\D/g, ""),
	new_value = matrix.replace(/[_\d]/g, function(a) {
	return i < val.length? val.charAt(i++) || def.charAt(i): a
	});
	i = new_value.indexOf("_");
	if (i != -1) {
	i < 3 && (i = 1);
	new_value = new_value.slice(0, i)
	}
	var reg = matrix.substr(0, this.value.length).replace(/_+/g,
	function(a) {
	return "\\d{1," + a.length + "}"
	}).replace(/[+()]/g, "\\$&");
	reg = new RegExp("^" + reg + "$");
	if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
	if (event.type == "blur" && this.value.length < 5) this.value = ""
	}
	var input = document.querySelector("#tel");
	input.addEventListener("input", mask, false);
	input.addEventListener("focus", mask, false);
	input.addEventListener("blur", mask, false);
	input.addEventListener("keydown", mask, false)
});