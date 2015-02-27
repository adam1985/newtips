define(['jquery'], function($){
       return function(){

            var sliderContainer = $('#slider-container'),
                titleHead = $('.title-head');
           titleHead.hover(function(){
                var $this = $(this);
                $this.addClass('title-active');
            }, function(){
                var $this = $(this);
                $this.removeClass('title-active');
            });

           $('.player-hander').hover(function(){
               $(this).find('.player_btn_on').removeClass('dn');
               $(this).find('.player_btn').addClass('dn');
           }, function(){
               $(this).find('.player_btn').removeClass('dn');
               $(this).find('.player_btn_on').addClass('dn');
           });

           sliderContainer.hover(function(){
               var $this = $(this), player_btn = $this.find('.player-hander');
               player_btn.css('display', 'block');

           }, function(){
               var $this = $(this), player_btn = $this.find('.player-hander');
               player_btn.css('display', 'none');
           });



       };
});