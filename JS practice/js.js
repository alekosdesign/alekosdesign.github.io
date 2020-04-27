$('.path').hover(
	function () {
		$('.desc').html($(this).attr('desc-data'));

		$('.desc').fadeIn();
	},
	function(){
		$('.desc').fadeOut();
	},
	$('.test__map').mousemove(function(e){
		var pos = $(this).offset()
		var left = e.pageX + 15 + 'px';
		var top = e.pageY + 15 + 'px';
		$('.desc').css({
			top:top,
			left:left
		});
	})
);