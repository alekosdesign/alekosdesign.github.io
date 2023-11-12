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

jQuery(document).ready(function () {
	// jQuery("body").on("click", ".header__call", function (){
	// 	jQuery('#feedback__modal').fadeIn(700);
	// }),
	// jQuery("body").on("click", "#feedback__cross", function (){
	// 	jQuery('#feedback__modal').fadeOut(700);
	// }),
	// $('.header__call').click(function(event) {
	// 	event.preventDefault();
	// 	this.blur();
	// 	$.get(this.href, function(html) {
	// 	  $(html).appendTo('body').modal();
	// 	});
	// });
	// jQuery("body").on("click", ".header__call", function () {
	// 	jQuery("#feedback__modal").fadeIn(300)
	// 	// jQuery("body").css("overflow", "hidden")
	// });
	// // Закрытие модальных окон
	jQuery(".header__call").click(function () {
		jQuery("#feedback__modal").addClass('open');
	});
	jQuery("#feedback__cross").click(function () {
		jQuery("#feedback__modal").removeClass('open');
	});
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
    jQuery(window).scroll(function() {
        var sl = jQuery(window).scrollTop();
        if (sl > 0) {
			// jQuery('.logo__hero').css({transform : 'translateY(' + sl / 6 + 'px)' });
            // jQuery('.logo__hero img').css('transform', '0, ' sl / 2 + 'px')
			// $('.containe2r').css({transform : 'scale('+ $resizerWidth +')'});
        };
    })
});
// 650px
// transform: translateY(10px );



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







