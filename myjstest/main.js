window.onload = function(){
	document.querySelector('#sidemenu').onmouseover = menuShow;
	document.querySelector('#sidemenu').onmouseout = menuHide;
	document.onkeydown = function(event){
		if (event.code == 'Escape') menuHide();
	}
	function menuShow(){
		// querySelector ищет блок с этим id или классом
		document.querySelector('#sidemenu').style.right = 0;
	}
	function menuHide(){
		document.querySelector('#sidemenu').style.right = '-30vw';
		// document.querySelector('#sidemenu').style.box-shadow = '0 0 20px black';
	}


	// Проверка на время и рабочие часы или нет
	var thistime = new Date(),
		curr_hour = thistime.getHours(),
		dateblock = document.querySelector('.hero__form h1 span');

	// Если час больше 11 и меньше 20, то...
	if (curr_hour >= '11' && curr_hour <= '20'){
		document.querySelector('.hero__form h1').style.color = 'green';
	}
	else{
		document.querySelector('.hero__form h1').style.color = 'red';
	}
	// вывод часов в html
	var time = setInterval(function() {
		var date = new Date();
		document.getElementById("time").innerHTML = (date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds());
	}, 1000);


	// Дни недели
	var date = new Date(),
		weekday = date.getDay()
		spanday = document.getElementById('thisday'),
		spanweek = document.getElementById('weekday');

	if (weekday <= '5'){
		this.console.log('Рабочие дни');
		var weekdays = 'Рабочие дни';
	} else{
		this.console.log('Выходные выходные')
		var weekdays = 'Выходные выходные';
	}


	// Проверка на день недели
	function thisdaysweek(){
		if (weekday == '1'){
			spanday.innerHTML = 'Понедельник';
		} else if(weekday == '2'){
			spanday.innerHTML = 'Вторник';
		} else if (weekday == '3'){
			spanday.innerHTML = 'Среда';
		} else if (weekday == '4'){
			spanday.innerHTML = 'Четверг';
		} else if (weekday == '5'){
			spanday.innerHTML = 'Пятница';
		} else if (weekday == '6'){
			spanday.innerHTML = 'Суббота';
		} else {
			spanday.innerHTML = 'Воскресенье';
		}
	}
	thisdaysweek();
}