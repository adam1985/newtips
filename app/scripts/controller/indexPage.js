define(['jquery', 'component/utility', 'component/jquery.slider'], function($, utility){
       return function(isSuccess, data, client){

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
                        var vv = slider.find('.video-view');
                          if(vv.length){
                            DD_belatedPNG.fixPng( vv[0] );
                          }
                           
                       }
                   },
                   type: 'fade',
                   width: 270,
                   timer: 5000,
                   speed: 'fast',
                   effect: 'easeInCubic',
                   eventType: 'mouseover',
                   className: 'active',
                   autoplay: true
               });

               // 获取索引
               var getIndex = function (ele, selector) {
                       selector = selector || '.slider-item';
                       var sliderItem = $(ele).closest(selector);

                       return parseInt(sliderItem.attr('data-index') || 0);
                   };

               // 报数统计
               var tipsReport = function(title, mediaid, sid, type){
                   var ver = '';
                   utility.tryCatch(function(){
                       ver = window.external.getver();
                   });

                   var data = {
                       pid: 'tips',
                       channel: 'tips/online/index.html',
                       x: '000',
                       y: '000',
                       title: title,
                       areacode: '',
                       publishedid: '',
                       sid: sid,
                       mediatype: 'album',
                       mediaid: mediaid,
                       sort: '',
                       isad: 0,
                       userid: client.userid,
                       groupid: client.gid,
                       path: '',
                       type: type,
                       uid: client.uid,
                       ver: ver,
                       r: +new Date

                   },

                   url = 'http://clicklog.moviebox.baofeng.com/click.php?' + $.param(data);

                   new Image().src = url;

                   return url;
               };

               // 播放接口吊起
               var gotoplay = function(storm, index){
                   var film = data[index];

                   utility.tryCatch(function(){
                       window.external.gotoplay(storm);
                       tipsReport(film.title, film.aid, film.wid, 'play');
                   });
               };

               // 点击播放
               sliderContainer.find('a.jump').on('click', function(e){
                   e.preventDefault();
                   var target = $(e.target),
                       index = getIndex(target);
                   if(target.closest('.icon-box').length == 0){
                       gotoplay($(this).attr('data-href'), index);
                   }
                   return false;
               });

               // 点击小按钮播放
               changeTips.find('a').on('click', function(e){
                   e.preventDefault();
                   var index = getIndex(e.target, 'li');
                   gotoplay(this.href, index);
                   return false;
               });

               // 添加到播放列表
               $('.add-list').on('click', function(e){
                   var $this = $(this), storm = $this.attr('data-storm'),
                       index = getIndex($this),
                       film = data[index];
                   utility.tryCatch(function(){
                       window.external.addtolist(storm);
                       tipsReport(film.title, film.aid, film.wid, 'add');
                   });
               });

               // 添加收藏
               $('.add-favorite').on('click', function(e){
                   var storm = $(this).attr('data-storm'),
                       index = getIndex(this),
                       film = data[index];

                   utility.tryCatch(function(){
                       window.external.favorite(storm);
                       tipsReport(film.title, film.aid, film.wid, 'shoucang');
                   });
               });

               // 通知客户端页面加载成功
               utility.tryCatch(function(){
                   //alert('loadcomplete');
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