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


$(document).ready(function()
	var x = 0, y = 0,
	vx = 0, vy = 0,
	ax = 0, ay = 0;

	var man=$('.man');

	if (window.DeviceMotionEvent != undefined) {
		window.ondevicemotion = function(e) {
			ax = event.accelerationIncludingGravity.x * 5;
			ay = event.accelerationIncludingGravity.y * 5;
		}

		setInterval( function() {
			var landscapeOrientation = window.innerWidth/window.innerHeight < 1;
			if ( landscapeOrientation) {
				vx = vx + ay;
				vy = vy + ax;
			} else {
				vy = vy - ay;
				vx = vx + ax;
			}
			vx = vx * 0.98;
			vy = vy * 0.98;
			y = parseInt(y + vy / 50);
			x = parseInt(x + vx / 50);

			boundingBoxCheck();

			man.style.top = y + "px";
			man.style.left = x + "px";

		}, 25);
	} 


	function boundingBoxCheck(){
		if (x<0) { x = 0; vx = -vx; }
		if (y<0) { y = 0; vy = -vy; }
		if (x>document.documentElement.clientWidth-20) { x = document.documentElement.clientWidth-20; vx = -vx; }
		if (y>document.documentElement.clientHeight-20) { y = document.documentElement.clientHeight-20; vy = -vy; }

	}