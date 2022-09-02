// Preloader
document.body.onload = function(){
	setTimeout(function() {
		var preloader = document.getElementById('page-preloader');
		if(!preloader.classList.contains('done') )
		{
			preloader.classList.add('done');
			setTimeout(function(){
				jQuery('#page-preloader').css({ 'display': 'none' });
			}, 300);
		}
	}, 500);
};

jQuery(document).ready(function() {
    jQuery(window).width(),
    jQuery(".hero").mousemove(function(e) {
        var xpage = .01 * (jQuery(window).width() / 2 - e.pageX)
          , ypage = .02 * (jQuery(window).width() / 2 - e.pageY);
		  jQuery(".car__hero").css("transform", "translate(" + xpage + "px, " + ypage + "px)")
    })
});
jQuery(document).ready(function () {
	var h = jQuery('footer').outerHeight();
	jQuery('.wrap__footer').css({ 'height': h });
});
// Mainmenu Scroll Min
jQuery(window).scroll(function(){
	var height = jQuery(window).scrollTop();
	if (height>250){
		jQuery('.header').addClass('scroll');
	}else{
		jQuery('.header').removeClass('scroll');
	}
});
jQuery(document).ready(function() {
	var jQuerypage = jQuery('html, body');
	jQuery('a[href*="#"]').click(function() {
		jQuerypage.animate({
			scrollTop: jQuery(jQuery.attr(this, 'href')).offset().top
		}, 1000);
		return false;
	});
});
jQuery(".slider__low").slick({
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,

});
