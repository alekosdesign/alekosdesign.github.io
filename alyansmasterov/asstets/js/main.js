// Mainmenu Scroll Min
$(window).scroll(function(){
	var height = $(window).scrollTop();
	if (height>500){
		$('header').addClass('scroll');
	}else{
		$('header').removeClass('scroll');
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
$(".hamburger").click("click touchstart", function() {
	$(".mainmenu").toggleClass("mobilemenu");
});
$(".mainmenu ul li a").click("click touchstart", function() {
	$(".mainmenu").removeClass("mobilemenu");
});

$("section").click("click touchstart", function() {
	$(".mainmenu").removeClass("mobilemenu");
});