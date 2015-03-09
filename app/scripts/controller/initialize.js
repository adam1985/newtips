define(['jquery', './indexPage',  './interfacePage'],
    function($, indexPage, interfacePage){
        $(function(){
            interfacePage(function(){
                indexPage.apply(null, [].slice.call(arguments, 0));
            });
        });
});