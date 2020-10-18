var card = $(".card");

$(document).on("mousemove",function(e) {  
  var ax = -($(window).innerWidth()/2- e.pageX)/20;
  var ay = ($(window).innerHeight()/2- e.pageY)/10;
  card.attr("style", "transform: rotateY("+ax+"deg) rotateX("+ay+"deg);-webkit-transform: rotateY("+ax+"deg) rotateX("+ay+"deg);-moz-transform: rotateY("+ax+"deg) rotateX("+ay+"deg)");
});

$(document).ready(function() {
	$('.black__white').click(function(){
		$('body').toggleClass('white__theme');
		document.getElementById("black__white").innerHTML="White";
	})
})



// window.onbeforeunload = function (e) { 
// 	var e = e || window.event; 
// 	var myMessage= "А вы уже подписались на мои соц. сети?"; 
// 	if (e) { 
// 		e.returnValue = myMessage; 
// 	} 
// 	return myMessage; 
// };



$(document).ready(function() {
	// var tl = new gsap();
	var tl = gsap;

	var logo = $(".hero .logo__white,.hero .logo__black")
	var herotext = $(".hero__h1__eng, .hero__h1__ru")

	// tl.fromTo(logo, 2, {scale:0},{scale:1, easy: Power2.easyOut});
	// tl.fromTo(herotext, 1.2, {x:"-100%"},{x:"0%", ease:Power2.easyInOut},"-=1");
	// tl.from(herotext, 1.2, {opacity: 0, x: -200, color: "red", easy: Power2.easyInOut});
	// tl.from (logo, 1, {
	// 	delay: 0.2,
	// 	y: 20,
	// 	opacity: 0,
	// 	ease:Expo.easeInOut
	// });
	tl.from(logo, 1, {
		delay: 0.4,
		y: 20,
		opacity: 0,
		ease:Expo.easeInOut
	});
});

// ease:Back.easeOut