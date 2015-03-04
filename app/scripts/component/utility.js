
define(['jquery'], function ($) {

    /**
     * 使用严格模式
     */
    'use strict';

    var utility_ = {};

    utility_.tryCatch = function(cb){
        try{
            cb();
        }catch(e){

        }
    };

    return utility_;
});


