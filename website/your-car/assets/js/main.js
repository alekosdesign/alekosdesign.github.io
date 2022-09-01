// // Preloader
// document.body.onload = function(){
// 	setTimeout(function() {
// 		var preloader = document.getElementById('page-preloader');
// 		if(!preloader.classList.contains('done') )
// 		{
// 			preloader.classList.add('done');
// 		}
// 	}, 500);
// };
// // Mainmenu Scroll Min
// $(window).scroll(function(){
// 	var height = $(window).scrollTop();
// 	if (height > 50){
// 		$('header').addClass('scroll');
// 	}else{
// 		$('header').removeClass('scroll');
// 	}
// });
// $(document).ready(function() {
// 	var $page = $('html, body');
// 	$('a[href*="#"]').click(function() {
// 		$page.animate({
// 			scrollTop: $($.attr(this, 'href')).offset().top
// 		}, 1000);
// 		return false;
// 	});
// });
// $('.mainmenu').click("click touchstart", function(){
// 	$('nav').toggleClass("active__mainmenu");
// 	$('section, .hero').toggleClass("blur");
// 	$('.mainmenu').toggleClass("close");
// });
// // Parallax
// $(document).ready(function() {
// 	$(window).scroll(function(){
// 		var sl = $(window).scrollTop();
// 		if (sl>0) {
// 			$('.hero .hero__bg__smoke').css('margin-top',sl/2 +'px')
// 			$('.hero .hero__bg__smoke__2').css('margin-top',sl +'px')
// 		}
// 	})
// });

// Mainmenu Scroll Min
$(window).scroll(function(){
	var height = $(window).scrollTop();
	if (height>500){
		$('.header').addClass('scroll');
	}else{
		$('.header').removeClass('scroll');
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
jQuery(".slider__low").slick({
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,

});
