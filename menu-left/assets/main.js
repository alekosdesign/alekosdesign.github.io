$(document).ready(function(){
	$("#menuicon").click(function(){
		$("#mainmenu").css("left","0px");
		function showMenu(){
			$("#mainmenu").css("-webkit-clip-path","polygon(0 0,100% 0,100% 100%,0% 100%)");
			$("#menuicon").animate({right:'-100'},300);
		}
		$('#bg-image').addClass('blur');
		setTimeout(showMenu,100);
	});

	$("#close").click(function(){
		$("#mainmenu").css("-webkit-clip-path","polygon(0 0,0% 0,100% 100%,0% 100%)");
		function hideMenu(){
			$("#mainmenu").css("left","-300px");
			$("#menuicon").animate({right:'50'},300);
		}
		$('#bg-image').removeClass('blur');
		setTimeout(hideMenu,300);

		function originalLayout(){
			$("#mainmenu").css("-webkit-clip-path","polygon(0 0,100% 0,0% 100%,0% 100%)");
		}
		setTimeout(originalLayout,600);
	});
});