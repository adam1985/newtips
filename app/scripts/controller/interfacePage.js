define(['jquery',  'component/imgReady', 'component/utility', 'tpl/index'], function($,imgReady, utility,  indextpl){
       return function(cb) {
           var external = window.external;
            var uid = "" , userid = "", gid = "",
                isSuccess = false,
                clientSucess = false,
                REQUESTCOUNT = 2,
                TIMEOUT = 5000,
                index = 0;

           var createPromise = function( fn ){
               var dtd = $.Deferred();
               fn( dtd );
               return dtd.promise(fn);
           };

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
                    return baseUrl + '/tips/' + mod + '/' + config.movieid + '/53_270*184.jpg';
                } else {
                    return baseUrl + config.img_url;
                }
           };

           // 播放量处理
           var movieView = function( count ){
                var MIN = 3e4, RANMIN = 5e5, RANMAX = 3e6,
                ran = RANMIN + parseInt(Math.random() * ( RANMAX - RANMIN ));
                if( count < MIN ){
                    count =  ran;
                }
               return parseInt((count / 1e4) * 10) / 10 + '万' ;
           };

           // 影片类型
           var movieType = function( type ){
                    type = parseInt(type);
                    return type;
           };

           // 影片集数
           var film_location = function( location ){
                    return String(location).slice(0, location.length - 2);
           };

           //数据处理
           var dataDispose = function( data ){
                    var lists = [];
               $.each(data, function(i, v){
                    var obj = {
                        loadfail: 'images/fail.png',
                        img_status: 1,
                        movie_click: movieView(v.movie_click || 0),
                        wid: v.wid,
                        rcode: v.rcode,
                        dt: v.dt
                    };

                   if(v.dt == "movie"){
                       obj.title = v.title;
                       obj.brief = v.brief;
                       obj.hd_type = v.hd_type;
                       obj.img_url = getImageUrl({movieid: v.movieid});
                       obj.complete_status = v.complete_status;
                       obj.area_catlog_typeid = v.area_catlog_typeid;
                       obj.latest_location = v.latest_location;
                       obj.mediatype = "&mediatype=album&mediaid=" + v.aid;
                       obj.storm = "Storm://" + v.wid + "00000" + v.aid + "||aid=" + v.aid + "||movieid=" + v.movieid + "||channel=tips/online/index.html||pid=tips";
                       obj.movieType = movieType(v.area_catlog_typeid);
                       obj.location = film_location(v.latest_location);


                   } else if(v.dt == "video"){
                       obj.title = v.name;
                       obj.brief = v.sub_title;
                       obj.img_url = getImageUrl({img_url: v.img_url});
                       obj.mediatype = "&mediatype=video&mediaid=" + v.vid;
                       obj.storm = v.storm_short+"||aid="+v.aid+"||movieid=0||channel=tips/online/index.html||pid=tips||special=http://moviebox.baofeng.net/newbox1.0/newmicrovideo.html";
                   }

                   lists.push(obj);

               });

               return lists;
           };

           // 检测图片加载
           var imageReadys = function( data , cb){
               var promiseList = [];
               $.each(data, function(i, v){
                   promiseList.push(createPromise(function( dtd ){
                       var index = 1, len = 3,img_url = v.img_url;
                       (function(){
                           var arg = arguments;
                           if( index < len ){
                               imgReady(img_url, function(){
                                   data[i].img_status = index;
                                   dtd.resolve();
                               }, $.noop, function(){
                                   img_url = location.href + v.loadfail;
                                   index++;
                                   arg.callee();
                               });
                           } else {
                               data[i].img_status = index;
                               dtd.resolve();
                           }
                       }());

                   }));
               });

               $.when.apply($.Deferred, promiseList).done(function(){
                   cb && cb(data);
               });
           };

           (function(){
               if( index < REQUESTCOUNT ){
                   if( external ){
                       utility.tryCatch(function(){
                           uid = external.getuid();
                           userid = external.getuserid();
                           gid = external.getgid();
                       });
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
                   //url:"http://test.com/8.js",
                   //jsonpCallback: 'jquerycall',
                   type: 'get',
                   dataType: 'jsonp',
                   timeout: TIMEOUT
               }).done(function(res){
                   var data = [];
                   if($.isArray(res)){
                       data = dataDispose([]);
                   } else {

                       data = dataDispose(res.data);
                   }

                   if( data.length ){
                       imageReadys(data, function(data){
                           $('#tips-box').html(indextpl({lists: data}));
                           isSuccess = true;
                           cb(isSuccess, data, {
                               uid: uid,
                               userid: userid,
                               gid: gid
                           });
                       });
                   } else {
                       isSuccess = false;
                       cb(isSuccess);
                   }

               }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
                   cb(isSuccess);
               });
           } else {
               cb(isSuccess);
           }
       }
});
