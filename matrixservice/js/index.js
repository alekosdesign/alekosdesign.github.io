$( () => {
	
	//On Scroll Functionality
	$(window).scroll( () => {
		var windowTop = $(window).scrollTop();
		windowTop > 100 ? $('nav').addClass('navShadow') : $('nav').removeClass('navShadow');
		windowTop > 100 ? $('ul').css('top','69px') : $('ul').css('top','80px');
	});
	
	//Click Logo To Scroll To Top
	$('#logo').on('click', () => {
		$('html,body').animate({
			scrollTop: 0
		},500);
	});
	
	//Smooth Scrolling Using Navigation Menu
	$('a[href*="#"]').on('click', function(e){
		$('html,body').animate({
			scrollTop: $($(this).attr('href')).offset().top - 100
		},500);
		e.preventDefault();
	});
	
	//Toggle Menu
	$('#menu-toggle').on('click', () => {
		$('#menu-toggle').toggleClass('closeMenu');
		$('ul').toggleClass('showMenu');
		$('li').on('click', () => {
			$('ul').removeClass('showMenu');
			$('#menu-toggle').removeClass('closeMenu');
		});
		// $('section').toggleClass('blur');
		// $('footer').toggleClass('blur');
	});
	
});

// time play
function getDate()
{
	var date = new Date();
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var seconds = date.getSeconds();
	//По надобности условие ниже повторить с minutes и hours
	if(minutes < 10)
	{
		minutes = '0' + minutes;
	}
	if(seconds < 10)
	{
		seconds = '0' + seconds;
	}
	if(hours < 10)
	{
		hours = '0' + hours;
	}
	document.getElementById('timedisplay').innerHTML = hours + ':' + minutes + ':' + seconds;
}
setInterval(getDate, 0);
