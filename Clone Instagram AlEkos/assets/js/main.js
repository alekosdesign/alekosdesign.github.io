$(document).ready(function(){

  var userFeed = new Instafeed({
    get: 'user',
    userId: '3175818341', //search profilePage_
    limit: '2000',
    resolution: 'standard_resolution',
    // template: '<a href="{{link}}" class="instafeed-block" target="_blank" style="background-image:url({{image}})"></a>',
    template: '<div class="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-4"><div class="instafeed__link"><a href="{{link}}" class="instafeed__block" target="_blank" style="background-image:url({{image}})"></a></div></div>',
    accessToken: '3175818341.1677ed0.14296bb5ae2b456b81d9f500fe473429' //http://instagram.pixelunion.net/
  });

  userFeed.run();

});