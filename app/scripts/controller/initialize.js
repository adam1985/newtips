define(['jquery', './indexPage',  './interfacePage'],
    function($, indexPage, interfacePage){
        $(function(){
            interfacePage(function(isSuccess, data, client){
                indexPage.apply(null, [].slice.call(arguments, 0));
            });
        });
});