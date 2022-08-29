// document.body.onload = function () {
// 	setTimeout(function () {
// 		$('#preloader').fadeOut(700);
// 		// $('body').css({'overflow':'auto'})
// 	}, 700);
// 	setTimeout(function () {
// 		$('#preloader::after').fadeOut(700)
// 	}, 0);
// },
$(document).ready(function () {
	var width = $(window).width();
	if (768 >= width) {
		$(".contacts__item:last-child, #gallary, #fits").detach();
	}
});
$(function () {
	var out = $("a[href^='http'], a[href^='https'], .product__item__img:not > a")
	out.click(function (e) {
		e.preventDefault();
		$('body').addClass('out');
		var t = $(this);
		setTimeout(function () { location.href = t.attr('href'); }, 300);
	});
});
$(document).ready(function () {
	var h = $('header').outerHeight();
	$('.title, .hero__molot, #margintop').css({ 'padding-top': h });
});
$(document).ready(function () {
	var windowWidth = $(window).width();
	$('.error').mousemove(function (event) {
		var moveX = (($(window).width() / 2) - event.pageX) * 0.02;
		var moveY = (($(window).height() / 2) - event.pageY) * 0.02;
		$('.error__404 svg').css('transform', 'translate(' + moveX + 'px,' + moveY + 'px)'),
			$('.error__404 h4, .error__404 p, .error__404 a').css('transform', 'translate(' + moveX + 'px,' + moveY + 'px)'),
			$('.error::after').css('transform', 'translate(' + moveX + 'px,0px)')
	})
});
$(window).scroll(function () {
	var height = $(window).scrollTop();
	if (height > 150) {
		$('header').addClass('scroll'),
			$('.scroll .header__top').fadeOut(400)
	} else {
		$('header').removeClass('scroll'),
			$('.header__top').fadeIn(400)
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
			breakpoint: 1367,
			settings: {
				centerMode: true,
				centerPadding: '30px',
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
			breakpoint: 1367,
			settings: {
				centerMode: true,
				centerPadding: '30px',
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
$(document).ready(function () {
	// Открытие модальных окон
	// Обратная связь
	$("body").on("click", "#open__modal__feedback", function () {
		$("#modal__feedback").fadeIn(300),
			$("body").css("overflow", "hidden")
	}),
		// ВходРегистрация
		$("body").on("click", "#registration", function () {
			$("#modal__reg").fadeIn(300),
				$("body").css("overflow", "hidden")
		}),
		// Вход
		$("body").on("click", "#login", function () {
			$("#modal__login").fadeIn(300),
				$("body").css("overflow", "hidden")
		}),

		// Переход с регистации на логин и обратно
		$("body").on("click", "#open__modal__login", function () {
			$("#modal__login").fadeIn(300),
				$("#modal__reg").fadeOut(300),
				$("body").css("overflow", "hidden")
		}),
		$("body").on("click", "#open__modal__reg", function () {
			$("#modal__reg").fadeIn(300),
				$("#modal__login").fadeOut(300),
				$("body").css("overflow", "hidden")
		}),


		// Закрытие модальных окон
		$(".modal__feedback__close").click(function () {
			$("#modal__feedback").fadeOut(300),
				$("body").css("overflow", "auto")
		}),
		// $("body").on("click", ".header__profile__login", function() {
		// 	$("#modal__reg").fadeIn(300),
		// 	$("body").css("overflow", "hidden")
		// }),
		$(".modal__feedback__close").click(function () {
			$("#modal__reg").fadeOut(300),
				$("body").css("overflow", "auto")
		}),
		$(".modal__feedback__close").click(function () {
			$("#modal__reg").fadeOut(300),
				$("body").css("overflow", "auto")
		}),
		$(".modal__feedback__close").click(function () {
			$("#modal__login").fadeOut(300),
				$("body").css("overflow", "auto")
		});
});
var login = $('.header__profile__login');
login.hover(function () {
	$('.but__personal').addClass('active__but__personal')
}),
	login.mouseleave(function () {
		setTimeout(function () {
			$('.but__personal').removeClass('active__but__personal')
		}, 1500)
	}),

	login.click(function () {
		$('.but__personal').toggleClass('active__but__personal')
	}),
	$('.but__personal span').click(function () {
		$('.but__personal').removeClass('active__but__personal')
	}),

	// Mask Phone JS
	window.addEventListener("DOMContentLoaded", function () {
		var keyCode;

		function mask(event) {
			event.keyCode && (keyCode = event.keyCode);
			var pos = this.selectionStart;
			if (pos < 1) event.preventDefault();
			var matrix = "+7 (___) ___-__-__",
				i = 0,
				def = matrix.replace(/\D/g, ""),
				val = this.value.replace(/\D/g, ""),
				new_value = matrix.replace(/[_\d]/g, function (a) {
					return i < val.length ? val.charAt(i++) || def.charAt(i) : a
				});
			i = new_value.indexOf("_");
			if (i != -1) {
				i < 3 && (i = 1);
				new_value = new_value.slice(0, i)
			}
			var reg = matrix.substr(0, this.value.length).replace(/_+/g,
				function (a) {
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
// FooterDown
(function () {
	footer();
	$(window).resize(function () {
		footer();
	});
	function footer() {
		var docHeight = $(window).height(),
			footerHeight = $('footer').outerHeight(),
			footerTop = $('footer').position().top + footerHeight;
		if (footerTop < docHeight) {
			$('footer').css('margin-top', (docHeight - footerTop) + 'px');
		}
	}
})();


function input_val(dir, elid) {
	//console.log(dir + " " + elid)
	var inputEl = document.getElementById(elid)
	//console.log(inputEl)
	var value = parseInt(inputEl.value, 10)
	if (isNaN(value))
		value = 0
	if (dir == "dec")
		value--
	else if (dir == "inc")
		value++
	else if (dir <= "0")
		return;
	inputEl.value = value
	$("#calc__product__number").keyup(function(e){
		this.value = this.value.replace(/[^0-9\.]/g, '');
	  });
}


















jQuery(document).ready(function () {
	var h = jQuery('header').outerHeight();
	jQuery('.title, .hero__molot, #margintop').css({ 'padding-top': h });
});
jQuery(document).ready(function(){
    var notification = localStorage.getItem("notification");
    if(notification){
        // jQuery(".notification").fadeOut();
		jQuery(".notification").css({'display': 'none'});
    }else{
        jQuery(".notification").fadeIn();
    }
    jQuery("#notification-close").click(function(){
        jQuery(".notification").fadeIn();
        localStorage.setItem("notification", true);
    });
    jQuery("#notification-close").click(function(){
        jQuery(".notification").fadeOut();
        localStorage.setItem("notification", false);
    });
});
// document.body.onload = function () {
// 	setTimeout(function () {
// 		jQuery('#preloader').fadeOut(700);
// 	}, 300);
// 	setTimeout(function () {
// 		jQuery('#preloader::after').fadeOut(700)
// 	}, 300);
// };

// // Запрет на компировани
// jQuery(function(){
// 	jQuery('body *').attr('oncopy', 'return false;');
// 	jQuery('body').on('contextmenu', false);
// });

// Прокрутка до начала страницы
// jQuery(document).ready(function($) {
//     jQuery(this).scrollTop(0);
// });

jQuery(document).ready(function($) {
	var width = $(window).width();
	var hei = jQuery('header').outerHeight();
	if (768 >= width) {
		jQuery("#map, #gallary, #fits, .hero__slider").detach();
		jQuery('.mobile-margin-top').css({ 'padding-top': hei });
	}
});
jQuery(document).ready(function($) {
	jQuery('.page__catalog__list__button').click(function(){
		jQuery('.page__catalog__sidebar .page__catalog__list').css({ 'height': '100%' });
		jQuery('.page__catalog__list__button').detach();
	});
	jQuery('.mobile__menu').click(function(){
		jQuery('.mainmenu').toggleClass('show__mobile__menu');
		jQuery('.mobile__menu').toggleClass('menu__burger__active');
	});
});
// pump_feedback
jQuery(document).ready(function($) {
	jQuery('#pump_feedback').click(function(){
		jQuery('#pump_feedback').fadeOut(0);
		jQuery('#pump_feedback_know').fadeIn(0);
		jQuery('#pump__feedback__none').fadeIn(1300);
	});
	jQuery('#pump_feedback_know').click(function(){
		jQuery('#pump_feedback').fadeIn(0);
		jQuery('#pump_feedback_know').fadeOut(0);
		jQuery('#pump__feedback__none').fadeOut(500);
	});
});


jQuery(document).ready(function($) {
	
	$( ".pf4_form_image_field" ).each(function( index ) {
		var get_bg_img_url = $(this).attr('data-bg');
		$( this ).children().children().children().children().children().css( "background-image", "url("+get_bg_img_url+")" );
	});
	
	$( "body" ).on( "click", ".pf4_form_image_fields label", function() {
		
		var parent_div = $( this ).parent().parent().parent().parent().parent();
		var items_div = parent_div.parent().attr('data-uid') + " .pf4_form_image_field";
		
		$(items_div).removeClass('checked');
  		parent_div.addClass('checked');
	});
});


jQuery(document).ready(function($) {
	var container = jQuery('.page__catalog__list__other').outerHeight();
	var wrap = jQuery('#wrap');
	var win = jQuery(window).width()
	if (container < win){
		jQuery('#wrap').css({'min-height' : '0'})
	}
});
jQuery(document).ready(function($) {
	var h = jQuery('header').outerHeight();
	setTimeout(function(){
		jQuery('.title, .hero__molot').css({ 'padding-top': h });
	}, 600);
});

jQuery(document).ready(function($) {
	var windowWidth = $(window).width();
	jQuery('.error').mousemove(function (event) {
		var moveX = (($(window).width() / 2) - event.pageX) * 0.02;
		var moveY = (($(window).height() / 2) - event.pageY) * 0.02;
		jQuery('.error__404 svg').css('transform', 'translate(' + moveX + 'px,' + moveY + 'px)'),
		jQuery('.error__404 h4, .error__404 p').css('transform', 'translate(' + moveX + 'px,' + moveY + 'px)'),
		jQuery('.error::after').css('transform', 'translate(' + moveX + 'px,0px)')
	})
});
jQuery(document).ready(function($) {
	height = jQuery('header .header__top').height();
	jQuery(window).scroll(function () {
		var scrollTop = jQuery(window).scrollTop();
		if (height > scrollTop){
			jQuery('header').css('margin-top' , -scrollTop),
			jQuery('header').removeClass('scroll'),
			jQuery('.header__top').fadeIn(400)			
		} else{
			jQuery('header').css('margin-top' , 0),
			jQuery('header').addClass('scroll'),
			jQuery('.scroll .header__top').fadeOut(400),
			jQuery('header .container').css({
				'padding' : '0px'
			})

		};
		// if (scrollTop >= height) {
		// 	jQuery('header').addClass('scroll'),
		// 	// jQuery('.scroll .header__top').fadeOut(400),
		// 	jQuery('header .container').css({
		// 		'padding' : '0px'
		// 	})
		// } else {
		// 	jQuery('header').removeClass('scroll')
		// 	// jQuery('.header__top').fadeIn(400)
		// }
		// // console.log(scrollTop);
		// // console.log(height);
	});
	
});

jQuery("body").on("click", "#open__modal__feedback", function () {
	jQuery("#modal__feedback").fadeIn(300),
	jQuery("body").css("overflow", "hidden")
});
// Закрытие модальных окон
jQuery(".modal__feedback__close").click(function () {
	jQuery("#modal__feedback").fadeOut(300),
	jQuery("body").css("overflow", "auto")
});

jQuery(document).ready(function() {
	jQuery("#table__list__catalog").click(function() {
		jQuery(".page__catalog__list, .page__catalog__list__other").toggleClass('page__catalog__table');
		jQuery("#table__list__catalog").toggleClass('table__list__catalog__but');
		// document.cookie = "catalog=table";
		// localStorage.setItem('catalog','table');
	});
	// if (localStorage.getItem('catalog') === 'table'){
	// 	$('.page__catalog__list, .page__catalog__list__other').Class('page__catalog__table');
	// 	$('#table__list__catalog').toggleClass('table__list__catalog__but');
	// }
});

// r_file = 'connect.php';
// jQuery("#test__click").click(function(){
// 	let ajaxurl = '/wp-admin/admin-ajax.php';
// 	var ajaxdata = {
// 		action     : 'clickwhatsapp',
// 		nonce_code : 'myajax.nonce'
// 	};
// 	// alert( 'Если это работает, уже неплохо' );
// 	// e.preventDefault();
// 	jQuery.ajax({
// 		// url: 'connect.php',
// 		url: 'http://hydro.loc/wp-content/themes/hydromarket/assets/js/connect.php',
// 		// async: false,
// 		// dataType : "json",
// 		dataType : "html",
// 		// timeout : 100000,
// 		data: {
// 			action: 'clickwhatsapp'
// 			},
// 		method : "GET",
// 		success : function(data) {
// 			console.info("Success");
// 		},
// 		error : function(e) {
// 			console.info("Error");
// 		},
// 		done : function(e) {
// 			console.info("DONE");
// 		}
// 	});
// });


jQuery('.offer').slick({
	infinite: true,
	swipeToSlide: true,
	touchMove: true,
	speed: 150,
	slidesToShow: 4,
	slidesToScroll: 1,
	centerPadding: '40px',
	autoplay: true,
	autoplaySpeed: 10000,
	lazyLoad: 'ondemand',
	pauseOnHover:true,
	responsive: [
		{
			breakpoint: 1367,
			settings: {
				centerMode: true,
				centerPadding: '30px',
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
jQuery('.partners').slick({
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
			breakpoint: 1367,
			settings: {
				centerMode: true,
				centerPadding: '30px',
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
jQuery('.hero__slider').slick({
	infinite: true,
	swipeToSlide: true,
	touchMove: true,
	speed: 700,
	slidesToShow: 1,
	slidesToScroll: 1,
	centerPadding: '40px',
	autoplay: true,
	autoplaySpeed: 15000,
	lazyLoad: 'ondemand',
	pauseOnHover:true,
});
jQuery('#brands__but').click(function () {
	jQuery('.brands__footer').toggleClass('open__brands',2000);
});
// jQuery('#click_but').click(function() {
//     let count = jQuery('#test__input');
//     count.val(parseInt(count.val())+1);
// });
// brands__footer
// jQuery('.brands__footer').slick({
// 	infinite: true,
// 	swipeToSlide: true,
// 	touchMove: true,
// 	speed: 300,
// 	slidesToShow: 4,
// 	slidesToScroll: 1,
// 	centerPadding: '40px',
// 	autoplay: true,
// 	autoplaySpeed: 10000,
// 	lazyLoad: 'ondemand',
// 	responsive: [
// 		{
// 			breakpoint: 1367,
// 			settings: {
// 				centerMode: true,
// 				centerPadding: '30px',
// 				slidesToShow: 3
// 			}
// 		},
// 		{
// 			breakpoint: 768,
// 			settings: {
// 				arrows: false,
// 				centerMode: true,
// 				centerPadding: '20px',
// 				slidesToShow: 3
// 			}
// 		},
// 		{
// 			breakpoint: 561,
// 			settings: {
// 				arrows: false,
// 				centerMode: true,
// 				centerPadding: '20px',
// 				slidesToShow: 2
// 			}
// 		},
// 		{
// 			breakpoint: 425,
// 			settings: {
// 				arrows: false,
// 				centerMode: true,
// 				centerPadding: '10px',
// 				slidesToShow: 1
// 			}
// 		}
// 	]
// });



