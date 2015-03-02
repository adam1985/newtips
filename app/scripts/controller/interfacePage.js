define(['jquery'], function($){
       return function() {
           var external = window.external;
            var uid = "%7B41180A60-822D-F797-24D4-EEDB65ED16FC%7D" , userid, gid = 3,
                isSuccess = false,
                clientSucess = false,
                REQUESTCOUNT = 2,
                index = 0;

           // 拼接地址
           var joinInterfaceUrl = function(){
                var url = 'http://rec.moviebox.baofeng.net/channel/';

               if( gid ){
                   url += gid + '/';
               }

               if( uid ){
                   url += uid + '/';
               }

               if( userid ){
                   url += userid + '/';
               }

               url += '8.js';

               return url;
           };

           // 拼接图片地址
           var getImageUrl = function( config ){
               var baseUrl = 'http://box.bfimg.com';
                if( config.movieid ){
                    var mod = config.movieid % 500;
                    return baseUrl + '/tips/' + mod + '/' + config.movieid + '53_270*184.jpg';
                } else {
                    return baseUrl + config.img_url;
                }
           };

           //数据处理
           var dataDispose = function( data ){
                    var lists = [];
               $.each(data, function(){

               });
           };

           (function(){
               if( index < REQUESTCOUNT ){
                   if( external ){
                       try{
                           uid = external.getuid();
                           userid = window.external.getuserid();
                           gid = window.external.getgid();
                       }catch(e){}

                   }

                   if( !uid || !gid ){
                       index++;
                       arguments.callee();
                   }
               }
           }());

           if( uid && gid ){
               clientSucess = true;
           }

           if( clientSucess ){
               $.ajax({
                   url: joinInterfaceUrl(),
                   type: 'get',
                   dataType: 'jsonp'
               }).done(function(data){
                   console.log(data);
               });
           }


       }
});