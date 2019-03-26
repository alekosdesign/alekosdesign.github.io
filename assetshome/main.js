// $(document).ready(function() {
// 	var rellax = new Rellax('.rellax');
// 	var $page = $('html, body');
// 	$('a[href*="#"]').click(function() {
// 		$page.animate({
// 			scrollTop: $($.attr(this, 'href')).offset().top
// 		}, 1000);
// 		return false;
// 	});
// });
// $(document).ready(function() {
// 	$("#openmenu").click(function(){
// 		$("#main").fadeIn(200);
// 		$("#openmenu").animate({left:"-10%"})
// 	})
// });


// why it doesn't work on firefox?
var card = $(".card");

$(document).on("mousemove",function(e) {  
  var ax = -($(window).innerWidth()/2- e.pageX)/20;
  var ay = ($(window).innerHeight()/2- e.pageY)/10;
  card.attr("style", "transform: rotateY("+ax+"deg) rotateX("+ay+"deg);-webkit-transform: rotateY("+ax+"deg) rotateX("+ay+"deg);-moz-transform: rotateY("+ax+"deg) rotateX("+ay+"deg)");
});