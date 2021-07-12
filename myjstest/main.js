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

// Время на первом экране
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
		spanday = document.getElementById('thisday');

	document.getElementById('year').innerHTML = date.getFullYear();
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
	function thisdaysweekcolor(){
		if (weekday <= '5'){
			spanday.style.color = 'green';
		} else {
			spanday.style.color = 'red';
		}
	}
	thisdaysweekcolor();
	thisdaysweek();



// Галерея ховер
	








}

// Скрытие и раскрытие пароля
function togglePassword(){
	var input__password = document.querySelector('.password'),
		icon__password = document.querySelector('.login__form__password__icon');
	if ( input__password.type === 'password' ){
		input__password.type = 'text';
		icon__password.classList.add('selected');
	}
	else {
		input__password.type = 'password';
		icon__password.classList.remove('selected');
	}
}


// Генератор паролей

// function generationPassword(lenght, charset){
// 	let generationPasswordlet = "";

// 	for (let i = 0; i < lenght; i++){
// 		generationPasswordlet += charset[
// 			Math.floor(
// 				Math.random() * charset.lenght
// 			)
// 		];
// 	}
// 	return generationPasswordlet;
// }
// innerHTML.querySelector(generationPasswordlet);
// generationPassword (5, "abcdfeg012345");

// Калькулятор
const skolkoNum = document.getElementById('skolko_num'),
	skoltoRange = document.getElementById('skolko_range'),
	stoitNum = document.getElementById('stoit_num'),
	stoitRange = document.getElementById('stoit_range'),
	dva = document.getElementById('dva'),
	chetiry = document.getElementById('chetiry'),
	desit = document.getElementById('desit'),
	poltos = document.getElementById('poltos'),
	allPrice = document.getElementById('all_price');

const inputRange = document.getElementById('calculate__input__range');

const sell = document.getElementsByClassName('skidka');

const assingValera = () => {
	skolkoNum.value = skoltoRange.value;
	stoitNum.value = stoitRange.value;
}
assingValera();


const precent = [
	{
		name: 'dva',
		precent: 2
	},
	{
		name: 'chetiry',
		precent: 4
	},
	{
		name: 'desit',
		precent: 10
	},
	{
		name: 'poltos',
		precent: 50
	}
]
let sellPrecent = precent[0].precent
console.log(sellPrecent);