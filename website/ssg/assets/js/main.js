// document.body.onload = function() {
//     setTimeout(function() {
//         var preloader = document.getElementById("preloader");
//         preloader.classList.contains("done") || preloader.classList.add("done");
//     }, 500);
// }
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
$('.hero__slider').slick({
	infinite: true,
	speed: 500,
	// centerMode: true,
	cssEase: 'linear',
	autoplay: true,
	autoplaySpeed: 1500,
	arrow: false
});