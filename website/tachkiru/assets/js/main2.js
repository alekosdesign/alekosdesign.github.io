jQuery('.offer__only__slider').slick({
	centerMode: true,
	slidesToShow: 1,
	infinite: true,
	speed: 1200,
	autoplay: false,
	arrows: true,
	prevArrow: jQuery('.offer__only__arrow .arrow__prev'),
	nextArrow: jQuery('.offer__only__arrow .arrow__next'),
	responsive: [
		{
		  breakpoint: 1025,
		  settings: {
			slidesToShow: 1,
			slidesToScroll: 1,
			dots: true
		  }
		}
	  ]
});

jQuery('.offer__slider').slick({
	centerMode: true,
	slidesToShow: 2,
	infinite: true,
	speed: 1200,
	autoplay: false,
	arrows: true,
	prevArrow: jQuery('.offer__arrow .arrow__prev'),
	nextArrow: jQuery('.offer__arrow .arrow__next'),
	responsive: [
		{
		  breakpoint: 1025,
		  settings: {
			slidesToShow: 1,
			slidesToScroll: 1,
			infinite: true,
			dots: true
		  }
		}
	  ]
});