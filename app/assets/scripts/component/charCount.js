/*
 * 	Character Count Plugin - jQuery plugin
 * 	Dynamic character count for text areas and input fields
 *	written by Alen Grakalic	
 *	http://cssglobe.com/post/7161/jquery-plugin-simplest-twitterlike-dynamic-character-count-for-textareas
 *
 *	Copyright (c) 2009 Alen Grakalic (http://cssglobe.com)
 *	Dual licensed under the MIT (MIT-LICENSE.txt)
 *	and GPL (GPL-LICENSE.txt) licenses.
 *
 *	Built for jQuery library
 *	http://jquery.com
 *
 */
 define(['jquery'], function($){
 	 (function($) {

 	 	$.fn.charCount = function(options){

            var self = this;
 	 	  
 	 		// default configuration properties
                var defaults = {
                        allowed: 140,
                        warning: 25,
                        selecter: '.editor_toolbar',
                        counterElement: 'span',
                        cssWarning: 'warn',
                        cssExceeded: 'exceeded',
                        counterText: ''
                    },
                    tiptext = '还可以输入';

                options = $.extend(defaults, options);

                function calculate(obj){
                    obj = $(obj);
                    var gifsize = obj.find('img').length * 3;
                    count = obj.text().length + gifsize;
                    var available = options.allowed - count,
                        editorTip = $(obj).next(options.selecter).find('.editor_tip'),
                        availableTxt = '';
                    if(available < 0){
                        availableTxt = '<em class="' + options.cssWarning + '">' + Math.abs(available) + '</em>';
                        tiptext = '已超出';
                    } else {
                        availableTxt = '<em>' + Math.abs(available) + '</em>';
                    }
                    editorTip.html(tiptext + options.counterText + availableTxt + '字');
                }

                this.each(function() {
                    calculate(this);
                    //$(this).keyup(function(){calculate(this)});
                    //$(this).change(function(){calculate(this)});
                });

                return function(){
                    self.each(function() {
                        calculate(this);
                    });
                }
 	 	};

 	 })($);
 });

