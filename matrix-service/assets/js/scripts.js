document.body.onload = function(){ 
	setTimeout(function() { 
		var preloader = document.getElementById('page-preloader'); 
		if(!preloader.classList.contains('done') ) 
		{ 
			preloader.classList.add('done'); 
		} 
	}, 500); 
};
$(document).ready(function() {
	new Instafeed({
		get: "user",
		userId: "1245509771",
		limit: "4",
		resolution: "standard_resolution",
		template: '<a href="{{link}}" class="insta__item" target="_blank"><img src="{{image}}" alt=""></a>',
		accessToken: "1245509771.1677ed0.4602b4742d6b4faab162e3f0559bf9f5"
	}).run()
})


$(document).ready(function(){
	$('.slider').slick({
		centerMode: true,
		centerPadding: '60px',
		slidesToShow: 3,
		responsive: [
		{
			breakpoint: 1680,
			settings: {
				arrows: false,
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
				centerPadding: '40px',
				slidesToShow: 1
			}
		}
		]
	});
})
$(document).ready(function(){
	$('.arrow').click(function(){
		$('.map__info').toggleClass('mobile__map')
	}),
	$('.mobile__bot').click(function(){
		$('header .mainmenu').toggleClass('mobile__menu');
		$('.mobile__bot__top').toggleClass('mobile__bot__top__active');
		$('.mobile__bot__bot').toggleClass('mobile__bot__bot__active');
		$('.header__logo').css({
			'z-index':'1000',
		});
	}),
	$('#feedback').click(function(){
		$('.feedback__over').css({
			'left':'0',
		});
		$('.feedback__form').css({
			'right':'-50%',
		});
	}),
	$('#contact').click(function(){
		$('.feedback__form').css({
			'right':'0',
		});
		$('.feedback__over').css({
			'left':'-50%',
		});
	})
})

// Parallax
$(document).ready(function() {
	var windowWidth = $(window).width();
	$('.hero').mousemove(function(event) {
		var moveX = (($(window).width() / 2) - event.pageX) * 0.02;
		var OffermoveX = (($(window).width() / 2) - event.pageX) * 0.04;
		$('.hero .offer').css('transform', 'translate(' + OffermoveX + 'px, 0px)');
		$('.hero .offer__img').css('transform', 'translate(' + moveX + 'px,0px)');
	})
});

// Menu
$(window).scroll(function() {
	var height = $(window).scrollTop();
	if (height > 50) {
		$('header').addClass('scroll')
	} else {
		$('header').removeClass('scroll')
	}
});



$(document).ready(function() {
	$(".prog__item__count").each(function() {
		$(this).prop("Counter", 0).animate({
			Counter: $(this).text()
		}, {
			duration: 8e3,
			easing: "swing",
			step: function(e) {
				$(this).text(Math.ceil(e))
			}
		})
	})
});
