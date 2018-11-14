$(document).ready(function() {
	var rellax = new Rellax('.rellax');
	var $page = $('html, body');
	$('a[href*="#"]').click(function() {
		$page.animate({
			scrollTop: $($.attr(this, 'href')).offset().top
		}, 1000);
		return false;
	});
});
$(document).ready(function() {
	$("#openmenu").click(function(){
		$("#main").fadeIn(200);
		$("#openmenu").animate({left:"-10%"})
	})
}