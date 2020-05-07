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