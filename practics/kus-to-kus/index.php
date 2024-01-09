<?php




// URL страницы с курсами валют
$url = 'https://www.vl.ru/dengi/';

// Инициализация cURL сессии
$ch = curl_init($url);

// Настройка параметров cURL
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, false);

// Выполнение запроса
$html = curl_exec($ch);

// Закрытие сессии
curl_close($ch);

// Проверка на ошибки
if ($html === false) {
    die('Error fetching the URL');
}

// Устанавливаем кодировку UTF-8 для DOMDocument
$dom = new DOMDocument('1.0', 'UTF-8');

// Отключение предупреждений и загрузка HTML
libxml_use_internal_errors(true);
$dom->loadHTML('<?xml encoding="UTF-8">' . $html);
libxml_clear_errors();

// Поиск элементов с курсами валют
$xpath = new DOMXPath($dom);
$rows = $xpath->query("//tr[contains(@class, 'rates-desktop__table-row')]");


$bankData = [];

foreach ($rows as $row) {
    $bankName = trim($xpath->query(".//a[contains(@class, 'rates-desktop__bank-name')]", $row)->item(0)->nodeValue);
    if (!isset($bankData[$bankName])) {
        $bankData[$bankName] = [];
    }

    $currencyCells = $xpath->query(".//td[contains(@class, 'rates-desktop__table-cell')]", $row);
    foreach ($currencyCells as $cell) {
        $currency = $cell->getAttribute('data-currency');
        $sellRate = $cell->getAttribute('data-sell');
        if ($currency && $sellRate) {
            $bankData[$bankName][$currency] = $sellRate;
        }
    }
}


// Конец таблицы

echo '<!DOCTYPE html>';
echo '<html lang="ru">';
echo '<head>';
echo '<meta charset="UTF-8">';
echo '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
echo '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">';
echo '<title>Курсы валют в банках</title>';
echo '</head>';
echo '<body>';
echo '<div class="container mt-5">';

// Вывод таблицы с классами Bootstrap для стилизации и адаптации
echo '<table class="table table-bordered table-responsive-sm">';
echo '</thead>';
echo '<tbody>';
// Выводим данные в таблицу
echo '<table border="1">';
echo '<tr><th>Банк</th><th>USD</th><th>EUR</th><th>CNY</th><th>JPY</th><th>KRW</th><th>THB</th><th>HKD</th></tr>';

foreach ($bankData as $bankName => $currencies) {
    echo '<tr>';
    echo '<td>' . htmlspecialchars($bankName) . '</td>';
    // Выводим курсы валют для каждого банка
    foreach (['USD', 'EUR', 'CNY', 'JPY', 'KRW', 'THB', 'HKD'] as $currency) {
        echo '<td>' . htmlspecialchars($currencies[$currency] ?? '-') . '</td>';
    }
    echo '</tr>';
}
echo '</tbody>';
echo '</table>';
echo '</div>'; // Закрытие контейнера Bootstrap
echo '</body>';
echo '</html>';