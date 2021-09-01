// document.body.onload = function() {
// 	setTimeout(function() {
// 		var preloader = document.getElementById("preloader");
// 		preloader.classList.contains("done") || preloader.classList.add("done");
// 	}, 500);
// };
$(document).ready(function() {
	var width = $(window).width();
	if (768 >= width){
		$(".contacts__item:last-child, #gallary, #fits").detach();
	}
});
$(document).ready(function() {
	var h = $('header').outerHeight();
	$('.title, .hero__molot').css({'padding-top': h});
});
$(window).scroll(function() {
	var height = $(window).scrollTop();
	if (height > 150) {
		$('header').addClass('scroll'),
		$('.scroll .header__top>*').fadeOut(400)
	} else {
		$('header').removeClass('scroll'),
		$('.header__top>*').fadeIn(400)
	}
});


$('.offer').slick({
	infinite: true,
	swipeToSlide: true,
	touchMove: true,
	speed: 300,
	slidesToShow: 4,
	slidesToScroll: 1,
	centerPadding: '40px',
	autoplay: true,
	autoplaySpeed: 10000,
	lazyLoad: 'ondemand',
	responsive: [
		{
		  breakpoint: 1025,
		  settings: {
			centerMode: true,
			centerPadding: '40px',
			slidesToShow: 3
		  }
		},
		{
		  breakpoint: 768,
		  settings: {
			arrows: false,
			centerMode: true,
			centerPadding: '20px',
			slidesToShow: 3
		  }
		},
		{
		  breakpoint: 561,
		  settings: {
			arrows: false,
			centerMode: true,
			centerPadding: '20px',
			slidesToShow: 2
		  }
		},
		{
		  breakpoint: 425,
		  settings: {
			arrows: false,
			centerMode: true,
			centerPadding: '10px',
			slidesToShow: 1
		  }
		}
	  ]
});
$('.partners').slick({
	infinite: true,
	swipeToSlide: true,
	touchMove: true,
	speed: 300,
	slidesToShow: 4,
	slidesToScroll: 1,
	centerPadding: '40px',
	autoplay: true,
	autoplaySpeed: 10000,
	lazyLoad: 'ondemand',
	responsive: [
		{
		  breakpoint: 1025,
		  settings: {
			centerMode: true,
			centerPadding: '40px',
			slidesToShow: 3
		  }
		},
		{
		  breakpoint: 768,
		  settings: {
			arrows: false,
			centerMode: true,
			centerPadding: '20px',
			slidesToShow: 3
		  }
		},
		{
		  breakpoint: 561,
		  settings: {
			arrows: false,
			centerMode: true,
			centerPadding: '20px',
			slidesToShow: 2
		  }
		},
		{
		  breakpoint: 425,
		  settings: {
			arrows: false,
			centerMode: true,
			centerPadding: '10px',
			slidesToShow: 1
		  }
		}
	  ]
});
$('.hero__slider').slick({
	infinite: true,
	swipeToSlide: true,
	touchMove: true,
	speed: 300,
	slidesToShow: 1,
	slidesToScroll: 1,
	centerPadding: '40px',
	autoplay: true,
	autoplaySpeed: 15000,
	lazyLoad: 'ondemand',
});
$(document).ready(function() {
	// Открытие модальных окон
	// Обратная связь
	$("body").on("click", "#open__modal__feedback", function() {
		$("#modal__feedback").fadeIn(300),
		$("body").css("overflow", "hidden")
	}),
	// ВходРегистрация
	$("body").on("click", "#registration", function() {
		$("#modal__reg").fadeIn(300),
		$("body").css("overflow", "hidden")
	}),
	// Вход
	$("body").on("click", "#login", function() {
		$("#modal__reg").fadeIn(300),
		$("body").css("overflow", "hidden")
	}),

	// Переход с регистации на логин и обратно
	$("body").on("click", "#open__modal__login", function() {
		$("#modal__login").fadeIn(300),
		$("#modal__reg").fadeOut(300),
		$("body").css("overflow", "hidden")
	}),
	$("body").on("click", "#open__modal__reg", function() {
		$("#modal__reg").fadeIn(300),
		$("#modal__login").fadeOut(300),
		$("body").css("overflow", "hidden")
	}),


	// Закрытие модальных окон
	$(".modal__feedback__close").click(function() {
		$("#modal__feedback").fadeOut(300),
		$("body").css("overflow", "auto")
	}),
	// $("body").on("click", ".header__profile__login", function() {
	// 	$("#modal__reg").fadeIn(300),
	// 	$("body").css("overflow", "hidden")
	// }),
	$(".modal__feedback__close").click(function() {
		$("#modal__reg").fadeOut(300),
		$("body").css("overflow", "auto")
	}),
	$(".modal__feedback__close").click(function() {
		$("#modal__reg").fadeOut(300),
		$("body").css("overflow", "auto")
	}),
	$(".modal__feedback__close").click(function() {
		$("#modal__login").fadeOut(300),
		$("body").css("overflow", "auto")
	});
});
var login = $('.header__profile__login');
login.hover(function(){
	$('.but__personal').addClass('active__but__personal')
}),
login.mouseleave(function(){
	setTimeout(function(){
		$('.but__personal').removeClass('active__but__personal')
	}, 1000)
}),
login.click(function(){
	$('.but__personal').toggleClass('active__but__personal')
}),
$('.but__personal span').click(function(){
	$('.but__personal').removeClass('active__but__personal')
}),

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