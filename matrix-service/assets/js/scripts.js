document.body.onload = function(){ 
	setTimeout(function() { 
		var preloader = document.getElementById('page-preloader'); 
		if(!preloader.classList.contains('done') ) 
		{ 
			preloader.classList.add('done1');
			$("body").css("overflow","auto");
			setTimeout( function(){
				$('.done').detach();
			},500)
		} 
	}, 4500); 
};
if ($(window).width()<620){
	$('.arrow, .feedback__item').detach();
};
if ($(window).width()>620){
	ymaps.ready(init);
};
function init() {
	var map = new ymaps.Map('map', {
		center: [43.11788390,131.885746],
		zoom: 17,
		controls: ['zoomControl'],
		behaviors: ['drag']
	});
	var placemark = new ymaps.Placemark([43.117892,131.883257],{
		hintContent: '<div class="map__balloon"><h3><img src="assets/img/logo.svg">Matrix-Service</h3><b>Режим работы</b><p>ул. Алеутская д.24</p><p>Вход в арке, справой стороны<br>Зелёная дверь.</p></div>'

	},{
		iconLayout: 'default#image',
		iconImageHref: 'assets/img/mylogo_no_bgd.png',
		iconImageSize: [94, 54]
	});

	map.geoObjects.add(placemark);

};
$(document).ready(function(){
	$('.slider').slick({
		centerMode: false,
		centerPadding: '60px',
		slidesToShow: 5,
		responsive: [
		{
			breakpoint: 2048,
			settings: {
				arrows: true,
				centerMode: true,
				centerPadding: '40px',
				slidesToShow: 3
			}
		},
		{
			breakpoint: 1280,
			settings: {
				arrows: true,
				centerMode: true,
				centerPadding: '40px',
				slidesToShow: 3
			}
		},
		{
			breakpoint: 769,
			settings: {
				arrows: true,
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
		var moveX = (($(window).width() / 2) - event.pageX) * 0.01;
		var OffermoveX = (($(window).width() / 2) - event.pageX) * 0.02;
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
// Modal
$(document).ready(function(){
	$('body').on('click','#modal',function(){
		$('.modal').fadeIn(300);
		$('.modal__overlay').fadeIn(300);
		$('body').css("overflow","hidden");
	}),
	$('.cross, .modal__overlay').click(function(){
		$('.modal').fadeOut(300);
		$('.modal__overlay').fadeOut(300);
		$('body').css("overflow","auto");
	})
});