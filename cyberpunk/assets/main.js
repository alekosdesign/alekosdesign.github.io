$(document).ready(function(){
	$("#menuicon").click(function(){
		$("#mainmenu").css("left","0px");
		function showMenu(){
			$("#mainmenu").css("-webkit-clip-path","polygon(0 0,100% 0,100% 100%,0% 100%)");
			$("#menuicon").animate({right:'-100'},300);
		}
		$('#bg-image').addClass('blur');
		$('section').addClass('blur');
		setTimeout(showMenu,100);
	});

	$("#close").click(function(){
		$("#mainmenu").css("-webkit-clip-path","polygon(0 0,0% 0,100% 100%,0% 100%)");
		function hideMenu(){
			$("#mainmenu").css("left","-300px");
			$("#menuicon").animate({right:'40'},300);
		}
		$('#bg-image').removeClass('blur');
		$('section').removeClass('blur');

		setTimeout(hideMenu,300);

		function originalLayout(){
			$("#mainmenu").css("-webkit-clip-path","polygon(0 0,100% 0,0% 100%,0% 100%)");
		}
		setTimeout(originalLayout,600);
	});
	$("section").click(function(){
		$("#mainmenu").css("-webkit-clip-path","polygon(0 0,0% 0,100% 100%,0% 100%)");
		function hideMenu(){
			$("#mainmenu").css("left","-300px");
			$("#menuicon").animate({right:'40'},300);
		}
		$('#bg-image').removeClass('blur');
		$('section').removeClass('blur');

		setTimeout(hideMenu,300);

		function originalLayout(){
			$("#mainmenu").css("-webkit-clip-path","polygon(0 0,100% 0,0% 100%,0% 100%)");
		}
		setTimeout(originalLayout,600);
	});
	$("#bg-image").click(function(){
		$("#mainmenu").css("-webkit-clip-path","polygon(0 0,0% 0,100% 100%,0% 100%)");
		function hideMenu(){
			$("#mainmenu").css("left","-300px");
			$("#menuicon").animate({right:'40'},300);
		}
		$('#bg-image').removeClass('blur');
		$('section').removeClass('blur');

		setTimeout(hideMenu,300);

		function originalLayout(){
			$("#mainmenu").css("-webkit-clip-path","polygon(0 0,100% 0,0% 100%,0% 100%)");
		}
		setTimeout(originalLayout,600);
	});

});

$(document).ready(function() {
	var $page = $('html, body');
	$('a[href*="#"]').click(function() {
		$page.animate({
			scrollTop: $($.attr(this, 'href')).offset().top
		}, 1000);
		e.preventDefault();
		return false;
	});
});
