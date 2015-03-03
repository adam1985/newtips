define(['jquery', 'component/jquery.slider'], function($){
       return function(){

            var sliderContainer = $('#slider-container'),
                titleHead = $('.title-head');
           /*titleHead.hover(function(){
                var $this = $(this);
                $this.addClass('title-active');
            }, function(){
                var $this = $(this);
                $this.removeClass('title-active');
            });*/

           $('.icon-box').find('span').hover(function(){
               var $this = $(this);
               $this.addClass($this.attr('data-type') + '-hover');
           }, function(){
               var $this = $(this);
               $this.removeClass($this.attr('data-type') + '-hover');
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


           // 图片轮播

          $('#tips-box').slider({
               wrap: sliderContainer,
               diyTag: '.slider-item',
               buttons: '#change-tips',
               buttonTag: 'li',
               eachMove: function(slider){
                   if( window.DD_belatedPNG){
                       DD_belatedPNG.fixPng( slider.find('.video-view')[0] );

                   }

               },
               type: 'fade',
               width: 270,
               timer: 5000,
               speed: 'slow',
               effect: 'easeInCubic',
               eventType: 'mouseover',
               className: 'active',
               autoplay: true
            });
       };
});