define(['jquery'], function(jQuery){
    (function ($) { //图片轮播放器
        var Class = {
            create: function () {
                return function () {
                    this.initialize.apply(this, arguments);
                }
            }
        };

        var _slider = Class.create();
        _slider.prototype = {
            constructor: _slider.prototype.constructor,
            initialize: function ($this, options) {
                var self = this;
                options = $.extend({ //默认参数设置
                    wrap: '#slide-box', //滑动ID
                    diyTag: 'li', //diy滚动区选择器
                    prev: '#play-prev', //上一张ID
                    next: '#play-next', //下一张ID
                    buttons: '#slide-button', //按钮ID
                    buttonTag: 'li', //diy按钮区选择器
                    eachMove: null, //回调函数
                    type: 'move', // 效果类型 move | fade
                    width: 800, //滑动宽度
                    timer: 3000, //播放时间间隔
                    speed: 'slow', //播放速度
                    effect: 'easeInCubic', //动画算法
                    eventType: 'click', //事件类型
                    className: 'on', //切换类
                    autoplay: false //是否播放
                }, options);

                $.each(options, function (i, v) {
                    self[i] = v;
                });

                self.box = $this;
                self.lists = $(options.wrap, $this).find(options.diyTag);
                self.len = this.lists.length;
                self.buttons = $(options.buttons, $this).find(options.buttonTag);
                self.prev = $(options.prev, $this);
                self.next = $(options.next, $this);
                self.index = 0;
                self.animateAble = true;
                self.timeout = null;
                if (self.autoplay) self.start_play();
                self.change_play();
                self.handler();
            },

            invoke: function (index, fixWidth) { // 播放至某一张
                var self = this;
                if (self.len > 1) {
                    if (self.animateAble) {
                        self.animateAble = false;
                    } else {
                        return;
                    }

                    self.removecur(self.buttons, index);

                    if (self.type === 'move') {

                        self.lists.eq(index).clearQueue().animate({
                            'left': 0
                        }, self.speed, self.effect, function () {
                            $(this).addClass(self.className);
                        });

                        self.lists.filter('.' + self.className).clearQueue().animate({
                            'left': -fixWidth
                        }, self.speed, self.effect, function () {
                            $(this).animate({
                                'left': fixWidth
                            }, 0, function () {
                                self.animateAble = true;
                            }).removeClass(self.className);
                        });
                    } else if (self.type === 'fade') {

                        self.lists.fadeOut(0, function () {
                            self.lists.removeClass( self.className );
                            self.animateAble = true;
                        });
                        self.lists.eq(index).fadeIn(self.speed, function () {
                            $(this).addClass(self.className);
                            self.animateAble = true;
                        });
                    }

                    self.eachMove && self.eachMove(self.lists.eq(index), index, self.len);
                }
            },

            play_prev: function () { // 上一张

                this.type === 'move' && this.moveStyle(-Math.abs(this.width));
                this.index > 0 ? this.index-- : this.index = this.len - 1;
                this.invoke(this.index, -Math.abs(this.width));
            },

            play_next: function () { // 下一张

                this.type === 'move' && this.moveStyle(Math.abs(this.width));
                this.index < this.len - 1 ? this.index++ : this.index = 0;
                this.invoke(this.index, Math.abs(this.width));
            },

            goto_play: function () { // 按钮事件
                var self = this;
                var toggleSlide = function(ele){
                    var index = $(ele).index();
                    if (self.index === index) return;
                    self.index = index;
                    self.type === 'move' && self.moveStyle(self.width);
                    self.invoke(self.index, self.width);
                };
                self.buttons[ self.eventType ](function () {
                    var $this = this;
                    self.lists.clearQueue();
                    if(self.eventType == 'mouseover'){
                        self.timeout && clearTimeout(self.timeout);
                        self.timeout = setTimeout(function(){
                            toggleSlide($this);
                        }, 100);
                    } else {
                        toggleSlide($this);
                    }

                });
            },

            handler: function () { // 绑定事件
                var self = this;
                self.prev[ self.eventType ](function () {
                    self.animateAble && self.play_prev();
                });
                self.next[ self.eventType ](function () {
                    self.animateAble && self.play_next();
                });
                this.goto_play();

            },

            interval_play: function () { // 间隔播放
                var self = this;
                return setInterval(function () {
                    self.index < self.len - 1 ? self.index++ : self.index = 0;
                    self.type === 'move' && self.moveStyle(self.width);
                    self.invoke(self.index, self.width);
                }, self.timer);
            },

            change_play: function () { // 切换播放
                var self = this;
                this.box.hover(function () {
                    self.stop_play.call(self);
                }, function () {
                    self.start_play.call(self);
                });
            },

            start_play: function () { // 开始播放

                this.timeout = this.interval_play();

            },

            stop_play: function () { // 停止播放
                this.timeout && clearInterval(this.timeout);
            },

            removecur: function (buttons, index) { // 按钮切换
                buttons.removeClass(this.className).eq(index).addClass(this.className);
            },

            moveStyle: function (width) { // 按钮切换
                this.lists.not('.' + this.className).css('left', width);
            }

        };

        $.fn.extend({ // 增加插件
            slider: function (options) {
                return this.each(function () {
                    new _slider($(this), options);
                });
            }
        });

    }(jQuery));
});

