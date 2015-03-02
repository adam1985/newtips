define(['jquery', './indexPage',  './interfacePage'],
    function($, indexPage, interfacePage){
        $(function(){
            indexPage();
            interfacePage();
        });
});