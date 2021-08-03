// Mainmenu Scroll Min
$(window).scroll(function(){
	var height = $(window).scrollTop();
	if (height>500){
		$('header').addClass('scroll');
	}else{
		$('header').removeClass('scroll');
	}
});

// $(document).ready(function(){
// 	document.getElementById('open').onclick = function(){
// 		localStorage.setItem('say','open');
// 		document.getElementById('spratat').style.display = 'none';
// 	};
// 	document.getElementById('close').onclick = function(){
// 		localStorage.setItem('say','close');
// 		// window.location.href = 'http://google.com';
// 		document.getElementById('zapret').style.display = 'block';
// 	};

// 	if (localStorage.getItem('say') == 'open'){
// 		document.getElementById('spratat').style.display = 'none';
// 	}
// 	else if (localStorage.getItem('say') == 'close'){
// 		document.getElementById('zapret').style.display = 'block';
// 	};

// 	document.getElementById('izmena').onclick = function(){
// 		delete localStorage['say'];
// 		document.getElementById('zapret').style.display = 'none';
// 	};
// });



$(document).ready(function() {
	var $page = $('html, body');
	$('a[href*="#"]').click(function() {
		$page.animate({
			scrollTop: $($.attr(this, 'href')).offset().top
		}, 1000);
		return false;
	});
});
$(".hamburger").click("click touchstart", function() {
	$(".mainmenu").toggleClass("mobilemenu");
});
$(".mainmenu ul li a").click("click touchstart", function() {
	$(".mainmenu").removeClass("mobilemenu");
});

$("section").click("click touchstart", function() {
	$(".mainmenu").removeClass("mobilemenu");
});

// Calc
function demontajcalc(){
	var area = $("#area").val();
	var other1 = $("#other1").val();
	var other2 = $("#other2").val();

	var calctotal = (area*200) + (other1*500) + (other2*1000);
	if ($("#dismantling_1").prop("checked")) {
		calctotal = calctotal + 1000;
	}
	if ($("#dismantling_2").prop("checked")) {
		calctotal = calctotal + 5000;
	}
	$("#calctotal").html(calctotal);
	// document.write(calctotal);
	// alert(isNaN(calctotal));
	// alert(calctotal);
}