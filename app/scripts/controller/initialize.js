define(['jquery', './indexPage',  './interfacePage'],
    function($, indexPage, interfacePage){
        $(function(){
            interfacePage(function(isSuccess, data){
                indexPage(isSuccess, data);
            });
        });
});