$(document).ready(function() {
	document.ondragstart = noselect;  
	document.onselectstart = noselect; 
	function noselect() {return false;} 
});
$(document).ready(function() {
	var man=$('.man');
	var luna=$('.luna');
	var planet=$('.planet');
	var roket=$('.roket');
	var bg_22=$('.bg_2_2');
	var bg_21=$('.bg_2_1');

	var bg=$('section');

	bg.mousemove(function(e){
		var valueX=(e.pageX * 1 / 25); 
		var valueY=(e.pageY * 1 / 35); 

		roket.css({
			'transform':'translate3d('+valueX+'px,'+valueY+'px,0)'
		});
	});
	bg.mousemove(function(e){
		var valueX=(e.pageX * 1 / -15); 
		var valueY=(e.pageY * 1 / -5); 

		man.css({
			'transform':'translate3d('+valueX+'px,'+valueY+'px,0) '
		});
	});

	bg.mousemove(function(e){
		var valueX=(e.pageX * -1 / 5); 
		var valueY=(e.pageY * -1 / 20); 

		luna.css({
			'transform':'translate3d('+valueX+'px,'+valueY+'px,0)'
		});
	});

	bg.mousemove(function(e){
		var valueX=(e.pageX * -1 / 10); 
		var valueY=(e.pageY * -1 / 15); 

		planet.css({
			'transform':'translate3d('+valueX+'px,'+valueY+'px,0) '
		});
	});

	bg.mousemove(function(e){
		var valueX=(e.pageX * -1 / -15); 
		var valueY=(e.pageY * -1 / 15); 

		bg_22.css({
			'transform':'translate3d('+valueX+'px,'+valueY+'px,0) '
		});
	});
	bg.mousemove(function(e){
		var valueX=(e.pageX * -1 / 15); 
		var valueY=(e.pageY * -1 / 15); 

		bg_21.css({
			'transform':'translate3d('+valueX+'px,'+valueY+'px,0) '
		});
	});
});

