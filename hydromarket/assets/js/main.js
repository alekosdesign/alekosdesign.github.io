document.body.onload = function() {
	setTimeout(function() {
		var preloader = document.getElementById("preloader");
		preloader.classList.contains("done") || preloader.classList.add("done");
	}, 500);
}
var h = $('header').height();
$('.hero__slider').css({'padding-top': h});
$('.offer').slick({
	infinite: true,
	swipeToSlide: true,
	touchMove: true,
	speed: 300,
	slidesToShow: 4,
	slidesToScroll: 1,
	centerPadding: '40px',
});
$('.partners').slick({
	infinite: true,
	swipeToSlide: true,
	touchMove: true,
	speed: 300,
	slidesToShow: 4,
	slidesToScroll: 1,
	centerPadding: '40px',
});
$('.hero__slider').slick({
	infinite: true,
	swipeToSlide: true,
	touchMove: true,
	speed: 300,
	slidesToShow: 1,
	slidesToScroll: 1,
	centerPadding: '40px',
});
// lightbox.option({
// 	'resizeDuration': 200,
// 	'wrapAround': true
//   })
// $(document).ready(function() {
//     $("body").on("click", "#modal", function() {
//         $(".modal").fadeIn(300),
//         $(".modal__overlay").fadeIn(300),
//         $("body").css("overflow", "hidden")
//     }),
//     $(".cross, .modal__overlay").click(function() {
//         $(".modal").fadeOut(300),
//         $(".modal__overlay").fadeOut(300),
//         $("body").css("overflow", "auto")
//     })
// }),
$(window).scroll(function() {
	150 < $(window).scrollTop() ? $("header").addClass("scroll") : $("header").removeClass("scroll")
})
