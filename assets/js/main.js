// Animation GSAP
gsap.from(".plug h1:nth-child(1)",{
	y: 600,
	opacity: 0,
	ease: Expo.easeInOut
}),
gsap.from(".plug h1:nth-child(2)",{
	y: 600,
	opacity: 0,
	ease: Expo.easeInOut,
	duration: 1
});

$(document).ready(function() {
	$('.black__white').click(function(){
		$('body').toggleClass('white__theme');
		// document.getElementById("black__white").innerHTML="White";
		// $('body').addClass('white');
		localStorage.setItem('theme','white');
	})
	if (localStorage.getItem('theme') === 'white'){
		$('body').toggleClass('white__theme');
	}
});

// Animation Pages
$(function() {
	$('a').click(function(e){
		e.preventDefault();
		$('body').addClass('out');
		var t = $(this);
		setTimeout(function(){ location.href = t.attr('href'); }, 900);
	});
});
