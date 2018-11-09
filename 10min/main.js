$(window).scroll(function() {
var height = $(window).scrollTop();
     /*Если сделали скролл на 100px задаём новый класс для header*/
if(height > 150){

$('nav').addClass('addnav');
} else{
     /*Если меньше 100px удаляем класс для header*/
$('nav').removeClass('addnav');
}

});