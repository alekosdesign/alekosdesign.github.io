document.body.onload = function () {
	setTimeout(function () {
		jQuery('#preloader').addClass('done');
		jQuery('#preloader').delay(300).fadeOut(300);
		jQuery('body').css({'overflow':'auto'})
	}, 700);
	setTimeout(function () {
		jQuery('#preloader::after').fadeOut(700)
	}, 0,)
};
jQuery( "li.menu-item" ).hover(function() {  // mouse enter
    jQuery( this ).find( " > .sub-menu" ).css({transform : 'translateY(100%)' }); // display immediate child
},
function(){ // mouse leave
    if ( !jQuery(this).hasClass("current_page_item") ) {  // check if current page
        jQuery( this ).find( ".sub-menu" ).css({transform : 'translateY(0%)' }); // hide if not current page
    }
});
jQuery(".mobile__menu").click(function () {
	jQuery(".mainmenu__mobile").addClass('mainmenu__active');
});
jQuery(document).on("click", "#cross", function (){
	jQuery(".mainmenu__mobile.mainmenu__active").removeClass('mainmenu__active');
});
// jQuery(document).ready(function() {
//     jQuery(window).scroll(function() {
//         var sl = jQuery(window).scrollTop();
//         if (sl > 0) {
// 			jQuery('.hero__text').css({transform : 'translate(-50%,' + sl / 6 + 'px)' });
//         };
//     })
// });
jQuery(document).ready(function () {
	// jQuery(".header__call").click(function () {
	// 	jQuery("#feedback__modal").addClass('open');
	// 	// jQuery('.hero, section, footer').toggleClass('all_in__blur');
	// });
	// jQuery("#feedback__cross").click(function () {
	// 	jQuery("#feedback__modal").removeClass('open');
	// 	// jQuery('.hero, section, footer').removeClass('all_in__blur');
	// });
	// jQuery(document).mouseup(function (e) {
	// 	var container = jQuery('.feedback__modal');
	// 	if (container.has(e.target).length === 0){
	// 		jQuery("#feedback__modal").removeClass('open');
	// 	}
	// });
});
var acc = jQuery('.accordion__item');
var i;
for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
	this.classList.toggle("active");
	var panel = this.nextElementSibling;
	if (panel.style.maxHeight) {
		panel.style.maxHeight = null;
	} else {
		panel.style.maxHeight = panel.scrollHeight * 5 + "px";
	} 
  });
}

jQuery('.social__slider').slick({
	// centerMode: true,
	slidesToShow: 1,
	infinite: true,
	speed: 1200,
	autoplay: true,
	arrows: true,
	prevArrow: jQuery('.social__slider__arrow .arrow__prev'),
	nextArrow: jQuery('.social__slider__arrow .arrow__next')
});
jQuery('.hero__slider').slick({
	centerMode: true,
	slidesToShow: 1,
	infinite: true,
	speed: 1200,
	autoplay: false,
	arrows: false,
});

// let toggleButton = document.querySelector('.dark__mode'); // Предполагается, что у вас есть кнопка с id="toggle"

// toggleButton.addEventListener('click', function() {
//    document.body.classList.toggle('dark-mode');
// });




jQuery.getJSON("http://ip-api.com/json/{query}?fields=city,timezone", function(data) {
	var table_body = "";
	jQuery.each(data, function(k, v) {
		table_body += "<tr><td>" + k + "</td><td><b>" + v + "</b></td></tr>";
	});
	jQuery("#GeoResults").html(table_body);
});