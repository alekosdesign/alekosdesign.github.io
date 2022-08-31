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

$('.slider__low').slick({
	infinite: false,
	speed: 300,
	slidesToShow: 4,
	slidesToScroll: 4,
	responsive: [
	  {
		breakpoint: 1024,
		settings: {
		  slidesToShow: 3,
		  slidesToScroll: 3,
		  infinite: true,
		  dots: true
		}
	  },
	  {
		breakpoint: 600,
		settings: {
		  slidesToShow: 2,
		  slidesToScroll: 2
		}
	  },
	  {
		breakpoint: 480,
		settings: {
		  slidesToShow: 1,
		  slidesToScroll: 1
		}
	  }
	  // You can unslick at a given breakpoint now by adding:
	  // settings: "unslick"
	  // instead of a settings object
	]
  });