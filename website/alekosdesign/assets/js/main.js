// document.body.onload = function () {
// 	setTimeout(function () {
// 		jQuery('#preloader').fadeOut(700);
// 		// jQuery('body').css({'overflow':'auto'})
// 	}, 700);
// 	setTimeout(function () {
// 		jQuery('#preloader::after').fadeOut(700)
// 	}, 0);
// },
jQuery(document).ready(function () {
	jQuery("body").on("click", ".burger", function (){
		jQuery('.menu').addClass('menuactive');
	}),
	jQuery("body").on("click", "#cross", function (){
		jQuery('.menu').removeClass('menuactive');
	})	
});




jQuery(window).scroll(function () {
	// var height = jQuery(window).scrollTop();
	// if (height > 5) {
	// 	jQuery(".hero::after").css({'opacity':'1'});
	// } else {

	// }
	
	var height = jQuery(window).scrollTop();
	if (height > 250) {
		jQuery('header').addClass('scroll')
	} else {
		jQuery('header').removeClass('scroll')
	}
});
jQuery(document).ready(function() {
	var $element = jQuery('#gallary');
	let counter = 0;
    jQuery(window).scroll(function() {
        var sl = jQuery(window).scrollTop(),
			scroll = jQuery(window).scrollTop() + jQuery(window).height(),
			offset = $element.offset().top,
			fixed = offset - jQuery(window).height();

        if (sl > 0){
			jQuery('.hero__face').css({
				transform : 'translate(-50%, ' + sl / 1 + 'px)' }
			);
			jQuery('.lines').css({
				'filter': 'blur(' + sl / 100 + 'px)'
			});
			// jQuery('.hero__logo__stroke, .hero__logo__fill').css({
			// 	'filter': 'blur(' + sl / 100 + 'px)'
			// });
        }
		if(scroll > offset && counter == 0) {
			jQuery('.hero__face').css({
				'transform' : 'translate(-50%, ' + fixed + 'px)'
			});
		}
		console.log(counter);
    });
});


jQuery(document).ready(function() {
    // var windowWidth = jQuery(window).width();
	jQuery('#exp').mousemove(function(event) {
		jQuery('.exp__bg img').css('filter', 'blur(2px)')
	}),
	jQuery('#exp').mouseleave(function(event) {
		jQuery('.exp__bg img').css('filter', 'blur(0)')
		jQuery('.exp__block ').css('transform', 'translate(0px, 0px)');
	}),
    jQuery('#exp').mousemove(function(event) {
        var moveX = ((jQuery(window).width() / 2) - event.pageX) * 0.01;
        var moveY = ((jQuery(window).height() / 4) - event.pageY) * 0.01;
        jQuery('.exp__block ').css('transform', 'translate(' + moveX + 'px,' + moveY + 'px)');

    })
});
function clock(){
	var time = new Date(),
			date = (time.getDate() < 10 ) ? '0' + time.getDate() : time.getDate(),
			month = (time.getMonth() < 10 ) ? '0' + time.getMonth() : time.getMonth(),
			year = time.getFullYear(),
		   	hours = (time.getHours() < 10) ? '0' + time.getHours() : time.getHours(),
		  	minutes = (time.getMinutes() < 10) ? '0' + time.getMinutes() : time.getMinutes();
	document.getElementById('clock').innerHTML = hours + ':' + minutes;
	document.getElementById('today').innerHTML = date + '.' + month + '.' + year;

	if(hours < 20){
		jQuery('#clock__dot').css({
			'background': '#1FDD32'
		});
	}
  }; 
  setInterval(clock, 1000);
  clock();

// jQuery(document).ready(function(){
// 	jQuery(window).scroll(function(){
// 	  if (document.body.scrollTop >= 10) {
// 		jQuery(".hero").css({
// 		  'background':'#181818'
// 		});
// 	  };
// 	});
//   });
  
// // Запрет на компировани
// jQuery(function(){
// 	jQuery('body *').attr('oncopy', 'return false;');
// 	jQuery('body').on('contextmenu', false);
// });

// Прокрутка до начала страницы
// jQuery(document).ready(function(jQuery) {
//     jQuery(this).scrollTop(0);
// });



// jQuery(document).ready(function(jQuery) {
// 	var windowWidth = jQuery(window).width();
// 	jQuery('.error').mousemove(function (event) {
// 		var moveX = ((jQuery(window).width() / 2) - event.pageX) * 0.02;
// 		var moveY = ((jQuery(window).height() / 2) - event.pageY) * 0.02;
// 		jQuery('.error__404 svg').css('transform', 'translate(' + moveX + 'px,' + moveY + 'px)'),
// 		jQuery('.error__404 h4, .error__404 p').css('transform', 'translate(' + moveX + 'px,' + moveY + 'px)'),
// 		jQuery('.error::after').css('transform', 'translate(' + moveX + 'px,0px)')
// 	})
// });


// jQuery("body").on("click", "#open__modal__feedback", function () {
// 	jQuery("#modal__feedback").fadeIn(300),
// 	jQuery("body").css("overflow", "hidden")
// });
// // Закрытие модальных окон
// jQuery(".modal__feedback__close").click(function () {
// 	jQuery("#modal__feedback").fadeOut(300),
// 	jQuery("body").css("overflow", "auto")
// });




