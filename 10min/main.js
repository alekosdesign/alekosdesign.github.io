$(window).scroll(function() {
	var height = $(window).scrollTop();
	/*Если сделали скролл на 100px задаём новый класс для header*/
	if(height > 250){

		$('.mainmenu').addClass('addnav');
	} else{
		/*Если меньше 100px удаляем класс для header*/
		$('.mainmenu').removeClass('addnav');
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

function openMenu() {
	document.getElementById('sidebar').classList.toggle('active')
	document.getElementById('id-toggle-btn').classList.toggle('active-btn')
}
document.body.onload = function(){
	setTimeout(function() {
		var preloader = document.getElementById('page-preloader');
		if(!preloader.classList.contains('done') )
		{
			preloader.classList.add('done');
		}
	}, 800); 
}