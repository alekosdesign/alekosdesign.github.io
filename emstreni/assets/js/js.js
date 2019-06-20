$(window).scroll(function() {
	var height = $(window).scrollTop();
	/*Если сделали скролл на 100px задаём новый класс для header*/
	if(height > 350){

		$('.header').addClass('addheader');
	} else{
		/*Если меньше 100px удаляем класс для header*/
		$('.header').removeClass('addheader');
	}

});
$(document).ready(function() {
	var $page = $('html, body');
	$('a[href*="#"]').click(function() {
		$page.animate({
			scrollTop: $($.attr(this, 'href')).offset().top
		}, 1000);
		return false;
	});
});

// document.body.onload = function(){ 
// 	setTimeout(function() { 
// 		var preloader = document.getElementById('page-preloader'); 
// 		if(!preloader.classList.contains('done') ) 
// 		{ 
// 			preloader.classList.add('done'); 
// 		} 
// 	}, 500); 
// };
// $('.icon__menu').on('click', function(e) {
// 	e.preventDefault;
// 	$(this).toggleClass('icon__menu__active');
// });
// $(document).ready(function(){
// 	$('.icon__menu').click(function(){
// 		$('.mainmenu').slideToggle(300);
// 	});
// });
// // открыть по кнопке
// $('.js__modal__form').click(function() { 
// 	$('.js__overlay__form').fadeIn();
// 	$('.js__overlay__form').addClass('disabled');
// });
// $('.js__modal__page').click(function() { 
// 	$('.js__overlay__page').fadeIn();
// 	$('.js__overlay__page').addClass('disabled');
// });
// // закрыть на крестик
// $('.js__modal__close__form').click(function() { 
// 	$('.js__overlay__form').fadeOut();
// });
// $('.js__modal__close__page').click(function() { 
// 	$('.js__overlay__page').fadeOut();
// });
// $(document).ready(function() {
// 	var $page = $('html, body');
// 	$('a[href*="#"]').click(function() {
// 		$page.animate({
// 			scrollTop: $($.attr(this, 'href')).offset().top
// 		}, 1200);
// 		return false;
// 	});
// });
