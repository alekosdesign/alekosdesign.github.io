$(document).ready(function() {
	offset = $("#btn").offset();
	$("#btn").on("mouseenter", function(e){
		mouseX = e.pageX;
		mouseY = e.pageY;

		relMouseX = mouseX - offset.left;
		relMouseY = mouseY - offset.top;

		$("#fill").css({left:relMouseX,top:relMouseY});
		$("#fill").animate({height:'1500px',width:'1500px'},500);
	});
	$("#btn").on("mouseleave", function(e){
		mouseX = e.pageX;
		mouseY = e.pageY;

		relMouseX = mouseX - offset.left;
		relMouseY = mouseY - offset.top;

		$("#fill").animate({height:'0px',width:'0px',left:relMouseX,top:relMouseY},300);
	});
});