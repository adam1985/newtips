define(['jquery', 'component/utility', './app', './timer', './user', './plat', './announce', 
    './pay', './option', './meal'],
    function($, utility, app, timer, user, plat, announce, pay, option, meal){
        $(function(){

            var ua = navigator.userAgent;

            if( /msie\s+[6789]/i.test(ua) ){
                utility.modal( 'modal-template', {
                    data : {
                        id : 'alert-model',
                        title : '警告',
                        body : '请用新版360、firefox、chrome浏览器浏览该系统~~'
                    },
                    buttons : [
                        {"ty" : "remove", "type" : "cancel"}
                    ]
                });
            }

            if( $('#timer').length ){
                timer();
            }

            if( $('#user').length ){
                user();
            }


            if( $('#plat').length ){
                plat();
            }

            if( $('#announce').length ){
                announce();
            }

            if( $('#pay').length ){
                pay();
            }

            if( $('#option').length ){
                option();
            }

            if( $('#meal').length ){
                meal();
            }

        });
});