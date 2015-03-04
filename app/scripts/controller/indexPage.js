define(['jquery', 'component/utility', 'component/jquery.slider'], function($, utility){
       return function(isSuccess, data){

           if(isSuccess){
               var sliderContainer = $('#slider-container'),
                   titleHead = $('.title-head'),
                   changeTips = $('#change-tips');
               /*titleHead.hover(function(){
                var $this = $(this);
                $this.addClass('title-active');
                }, function(){
                var $this = $(this);
                $this.removeClass('title-active');
                });*/

               if( window.DD_belatedPNG ){
                   DD_belatedPNG.fix(".fixpng");
               }

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
                   buttons: changeTips,
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

               // 播放接口吊起
               var gotoplay = function(storm){
                   utility.tryCatch(function(){
                       window.external.gotoplay(storm);
                   });
               };

               // 点击播放
               sliderContainer.find('a.jump').on('click', function(e){
                   e.preventDefault();
                   gotoplay(this.href);
                   return false;
               });

               // 点击小按钮播放
               changeTips.find('a').on('click', function(e){
                   e.preventDefault();
                   gotoplay(this.href);
                   return false;
               });

               // 添加到播放列表
               $('.add-list').on('click', function(e){
                   var storm = $(this).attr('data-storm');
                   utility.tryCatch(function(){
                       window.external.gotoplay(storm);
                   });
               });

               // 添加收藏
               $('.add-favorite').on('click', function(e){
                   var storm = $(this).attr('data-storm');
                   utility.tryCatch(function(){
                       window.external.gotoplay(storm);
                   });
               });

               // 通知客户端页面加载成功
               utility.tryCatch(function(){
                   window.external.loadcomplete();
               });

           }else{
               // 通知客户端清风接口加载失败
               utility.tryCatch(function(){
                   window.external.loadfail(1);
               });
           }


       };
});