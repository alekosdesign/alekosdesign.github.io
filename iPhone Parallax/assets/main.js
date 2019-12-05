$(document).ready(function() {
	document.ondragstart = noselect;  
	document.onselectstart = noselect; 
	function noselect() {return false;} 
});
$(document).ready(function() {
	var iphone__hover__layar_1=$('.iphone__hover__layar_1');
	var iphone__hover__layar_2=$('.iphone__hover__layar_2');
	var iphone__hover__layar_3=$('.iphone__hover__layar_3');
	var iphone__hover__layar_4=$('.iphone__hover__layar_4');
	var iphone__hover__layar_5=$('.iphone__hover__layar_5');
	var iphone__hover__layar_6=$('.iphone__hover__layar_6');
	var iphone__hover__layar_7=$('.iphone__hover__layar_7');
	var iphone__hover__layar_8=$('.iphone__hover__layar_8');
	var iphone__hover__layar_9=$('.iphone__hover__layar_9');
	var iphone__hover__layar_10=$('.iphone__hover__layar_10');

	var bg=$('section');

	bg.mousemove(function(e){
		var valueX=(e.pageX * 1 / 55); 
		var valueY=(e.pageY * 1 / 55); 

		iphone__hover__layar_1.css({
			'transform':'translate3d('+valueX+'px,'+valueY+'px,0)'
		});
	});
	bg.mousemove(function(e){
		var valueX=(e.pageX * 1 / 45); 
		var valueY=(e.pageY * 1 / 45); 

		iphone__hover__layar_2.css({
			'transform':'translate3d('+valueX+'px,'+valueY+'px,0)'
		});
	});
	bg.mousemove(function(e){
		var valueX=(e.pageX * 1 / 35); 
		var valueY=(e.pageY * 1 / 35); 

		iphone__hover__layar_3.css({
			'transform':'translate3d('+valueX+'px,'+valueY+'px,0)'
		});
	});
	bg.mousemove(function(e){
		var valueX=(e.pageX * 1 / 25); 
		var valueY=(e.pageY * 1 / 25); 

		iphone__hover__layar_4.css({
			'transform':'translate3d('+valueX+'px,'+valueY+'px,0)'
		});
	});
	bg.mousemove(function(e){
		var valueX=(e.pageX * 1 / 15); 
		var valueY=(e.pageY * 1 / 15); 

		iphone__hover__layar_5.css({
			'transform':'translate3d('+valueX+'px,'+valueY+'px,0)'
		});
	});
	bg.mousemove(function(e){
		var valueX=(e.pageX * 1 / 5); 
		var valueY=(e.pageY * 1 / 5); 

		iphone__hover__layar_6.css({
			'transform':'translate3d('+valueX+'px,'+valueY+'px,0)'
		});
	});
	bg.mousemove(function(e){
		var valueX=(e.pageX * 1 / -5); 
		var valueY=(e.pageY * 1 / -5); 

		iphone__hover__layar_7.css({
			'transform':'translate3d('+valueX+'px,'+valueY+'px,0)'
		});
	});
	bg.mousemove(function(e){
		var valueX=(e.pageX * 1 / -15); 
		var valueY=(e.pageY * 1 / -15); 

		iphone__hover__layar_8.css({
			'transform':'translate3d('+valueX+'px,'+valueY+'px,0)'
		});
	});
	bg.mousemove(function(e){
		var valueX=(e.pageX * 1 / -25); 
		var valueY=(e.pageY * 1 / -25); 

		iphone__hover__layar_9.css({
			'transform':'translate3d('+valueX+'px,'+valueY+'px,0)'
		});
	});
	bg.mousemove(function(e){
		var valueX=(e.pageX * 1 / -35); 
		var valueY=(e.pageY * 1 / -35); 

		iphone__hover__layar_10.css({
			'transform':'translate3d('+valueX+'px,'+valueY+'px,0)'
		});
	});
});

