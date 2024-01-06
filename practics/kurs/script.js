// const getRates = async () => {
// 	try {
// 		const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
// 		const data = await response.json();
// 		const exchangeRate = {
// 			dollar: data.Valute.USD.Value,
// 			CNY: data.Valute.CNY.Value
// 		};
// 		return exchangeRate;
// 	} catch (error) {
// 		console.error('Ошибка получения данных:', error);
// 	}
// 	try {
// 		const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json');
// 		const data = await response.json();
// 		const exchangeRate = {
// 			bitcoin: data.bpi.USD.rate_float,
// 			tether: data.bpi.USDT.rate_float
// 		};
// 		return exchangeRate;
// 	} catch (error) {
// 		console.error('Ошибка получения данных:', error);
// 	}
// };
// const displayRates = async () => {
// 	const rates = await getRates();
// 	if (rates) {
// 		document.getElementById('bitcoin').innerText = `1 Биткойн = ${rates.bitcoin} Доллоров`;
// 		document.getElementById('tether').innerText = `1 Tether = ${rates.tether} USDT`;
// 		document.getElementById('dollar').innerText = `1 Доллар = ${rates.dollar} Рублей`;
// 		document.getElementById('CNY').innerText = `1 Йен = ${rates.CNY} Рублей`;

// 	}
// };

// displayRates();
// https://bank.bcs.ru/currency
// service-card__table

// async function fetchHtml(url) {
//   try {
// 	const response = await fetch(url);
// 	if (!response.ok) {
// 	  throw new Error(`HTTP error! status: ${response.status}`);
// 	} else {
// 	  return await response.text();
// 	}
//   } catch (error) {
// 	console.error(`Ошибка при запросе ${url}:`, error);
//   }
// }

// async function parseBCSCurrency(html) {
//   const parser = new DOMParser();
//   const doc = parser.parseFromString(html, "text/html");

//   const table = doc.querySelector(".service-card__table");
//   if (!table) {
// 	throw new Error("Блок с валютами не найден");
//   }

//   const rows = table.querySelectorAll("tr");
//   const result = {};
//   rows.forEach((row) => {
// 	const cells = row.querySelectorAll("td");
// 	if (cells.length >= 4) {
// 	  const currency = cells[1].textContent.trim();
// 	  const rate = cells[3].textContent.trim();
// 	  result[currency] = rate;
// 	}
//   });

//   return result;
// }

// async function displayRates() {
//   const html = await fetchHtml("https://bank.bcs.ru/currency");
//   const rates = await parseBCSCurrency(html);
//   let output = "Курсы валют:<br>";
//   for (let currency in rates) {
// 	output += `${currency}: ${rates[currency]}<br>`;
//   }
//   document.getElementById("bks").innerHTML = output;
// }

// displayRates().catch((error) => console.error("Ошибка:", error));




// async function fetchAndParsePage() {
// 	// Отправляем HTTP-запрос к странице
// 	const response = await fetch('https://bank.bcs.ru/currency');
	
// 	// Преобразуем ответ в текст
// 	const text = await response.text();
	
// 	// Создаем новый экземпляр DOMParser
// 	const parser = new DOMParser();
	
// 	// Преобразуем текст в Document
// 	const doc = parser.parseFromString(text, 'text/html');
	
// 	// Ищем таблицу с классом 'service-card__table'
// 	const table = doc.querySelector('.service-card__table');
	
// 	if (!table) {
// 	  console.error('Table not found');
// 	  return;
// 	}
	
// 	// Извлекаем все строки из таблицы
// 	const rows = Array.from(table.rows);
	
// 	// Для каждой строки извлекаем данные и выводим их в консоль
// 	rows.forEach(row => {
// 	  const cells = Array.from(row.cells);
// 	  console.log(`${cells[0].textContent}: ${cells[1].textContent}`);
// 	});
//    }
   
//    // Запускаем функцию
//    fetchAndParsePage().catch(console.error);


async function fetchAndParseBankiPage() {
	// Send an HTTP request to the page
	const response = await fetch('https://www.banki.ru/');
	
	// Convert the response to text
	const text = await response.text();
	
	// Create a new instance of DOMParser
	const parser = new DOMParser();
	
	// Convert the text to a Document
	const doc = parser.parseFromString(text, 'text/html');
	
	// Find the elements containing the currency rates
	const rateElements = doc.querySelectorAll('.currency-item__value');
	
	if (!rateElements || rateElements.length === 0) {
		console.error('Rate elements not found');
		return;
	}
	
	// Extract the rate values
	const rates = Array.from(rateElements).map(element => element.textContent);
	
	// Set the innerHTML of the element with id "bks" to the rates
	document.getElementById('bks').innerHTML = `Currency Rates: ${rates.join(', ')}`;
 }
 
 fetchAndParseBankiPage().catch(console.error);