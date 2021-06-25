$(document).ready(function() {
	if (localStorage.getItem('theme') === 'white'){
		$('body').toggleClass('white__theme');
	}
});


var card = $(".card");
$(document).on("mousemove",function(e) {  
  var ax = -($(window).innerWidth()/2- e.pageX)/20;
  var ay = ($(window).innerHeight()/2- e.pageY)/10;
  card.attr("style", "transform: rotateY("+ax+"deg) rotateX("+ay+"deg);-webkit-transform: rotateY("+ax+"deg) rotateX("+ay+"deg);-moz-transform: rotateY("+ax+"deg) rotateX("+ay+"deg)");
});

$(document).ready(function() {
	$('.black__white').click(function(){
		$('body').toggleClass('white__theme');
		// document.getElementById("black__white").innerHTML="White";
		// $('body').addClass('white');
		localStorage.setItem('theme','white');
	})
})


// $(document).ready(function(){
// 	document.getElementById('open').onclick = function(){
// 		localStorage.setItem('say','open');
// 		document.getElementById('spratat').style.display = 'none';
// 	};
// 	document.getElementById('close').onclick = function(){
// 		localStorage.setItem('say','close');
// 		// window.location.href = 'http://google.com';
// 		document.getElementById('zapret').style.display = 'block';
// 	};

// 	if (localStorage.getItem('say') == 'open'){
// 		document.getElementById('spratat').style.display = 'none';
// 	}
// 	else if (localStorage.getItem('say') == 'close'){
// 		document.getElementById('zapret').style.display = 'block';
// 	};

// 	document.getElementById('izmena').onclick = function(){
// 		delete localStorage['say'];
// 		document.getElementById('zapret').style.display = 'none';
// 	};
// });

$(document).ready(function() {
	var tl = gsap;

	var logo = $(".hero .logo__white,.hero .logo__black")
	var herotext = $(".hero__h1__eng, .hero__h1__ru")
	tl.from(logo, 1, {
		delay: 0.4,
		y: 20,
		opacity: 0,
		ease:Expo.easeInOut
	});
});
