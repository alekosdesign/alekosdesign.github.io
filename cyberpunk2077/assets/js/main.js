// Preloader
// document.body.onload = function(){ 
// 	setTimeout(function() { 
// 		var preloader = document.getElementById('page-preloader'); 
// 		if(!preloader.classList.contains('done') )
// 		{ 
// 			preloader.classList.add('done');
// 		} 
// 	}, 500); 
// };
// Mainmenu Scroll Min
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

// Parallax
$(window).scroll(function(){
	var slt = $(window).scrollTop();
	// console.log(slt);
	if (slt > 0){
		$('#hero__logo').css('transform','translate(0,' + slt/4 + 'px)');
		// $('.apple').css('transform','translate(0,-' + slt/2 + 'px)');
	}
});
