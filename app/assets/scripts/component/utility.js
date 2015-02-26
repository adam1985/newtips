
define(['jquery', './template', 'interface/ajax', './bootstrap', 'pageinator'], function ($, template, ajax) {

    /**
     * 使用严格模式
     */
    'use strict';

    var utility_ = {};

    /** 模式窗口 */
    var modal = function( templateId, config ){
            this.templateId = templateId;
            this.data = config.data || {};
            this.cb = config.cb || $.noop;
            this.options = config.options || {};
            var buttons = [
                    { type : 'ok', class: 'btn btn-success', btnClass: 'btn-ok', text : '确定' },
                    { type : 'cancel', class: 'btn', text : '取消' }
            ];

            this.buttons = this.disposeButtons(buttons, config.buttons);

            this.jqModal = this.createModal();
            this.addEvent();
    };

    modal.prototype.disposeButtons = function(def, butsConf) {
        def = def || [];
        butsConf = butsConf || [];
        var defClass = {
                "ok" : "btn btn-primary",
                "cancel" : "btn"
        },
        defText = {
            "ok" : "确定",
            "cancel" : "取消"
        };

        $.each( butsConf, function(i, v) {
            var ty = v.ty;
            if( ty == 'add' ){
                def.push({ type : v.type, class: v.class || defClass[v.type] || 'btn', btnClass: v.btnClass || null,
                    text : v.text || defText[v.type], cb : v.cb });
            } else if( ty == 'remove' ){
                $.each(def.concat(), function(index, val){
                    if(v.type == val.type ){
                        def.splice(index, 1);
                    }
                });
            } else if( ty == 'modify' ){
                delete v.ty;
                $.each(def.concat(), function(index, val){
                    if(v.type == val.type ){
                        delete v.type;
                        if( v ){
                            $.each(v, function(key, value){
                                val[key] = value;
                            });
                        }
                    }
                });
            }
        });

        this.data = $.extend(this.data, {
            buttons : def
        });

        return def;

    };


    modal.prototype.createModal = function(){
        $(document.body).append(template.render( this.templateId, {
            modal : this.data
        }));

        var modal = $('#' + this.data.id);
        modal.modal( this.options );
        return modal;
    };

    modal.prototype.show = function( cb ){
        var self = this;
        cb = cb || $.noop;
        self.jqModal.off('shown.bs.modal');
        self.jqModal.on('shown.bs.modal', function(){
            cb( self.jqModal );
        });

        this.jqModal.modal('show');

        return this;
    };

    modal.prototype.hide = function( cb ){
        var self = this;
        cb = cb || $.noop;
        self.jqModal.off('hidden.bs.modal');
        self.jqModal.on('hidden.bs.modal', function(){
            cb( self.jqModal );
        });
        this.jqModal.modal('hide');
        return this;
    };

    modal.prototype.addEvent = function(){
        var btn = this.jqModal.find('.modal-btn'),
            self = this,
            cb = $.noop;

        btn.on('click', function(){
            var index = parseInt($(this).attr('data-index'));
            if( self.buttons[index].type == 'ok'){
                cb = self.buttons[index].cb || self.cb;
            }

            if( !cb.keeplive ){
                self.hide(function(){
                    cb(self, self.jqModal);
                });
            } else {
                cb(self, self.jqModal);
            }
            
            
        });


        return this;
    };


    modal.prototype.update = function( config ){
        var self = this,
            jqModal = self.jqModal;
            self.cb = config.cb || $.noop;
            self.data = config.data || {};
            this.buttons = this.disposeButtons(this.buttons, config.buttons);
            jqModal.find('.modal-dialog').html(template.render( 'modal-content-template', {
                modal : this.data
            }));
            this.addEvent();
            self.show();

        return this;
    };

    var modalState = {};
    utility_.modal = function( templateId, config ){
        
        config.data = config.data || {};
        config.data = $.extend({
            title: '提示'
        }, config.data);
        var cacheId = config.data.id || templateId,
            _modal = modalState[cacheId];

        if( modalState[cacheId] ) {
            _modal.update( config );
        } else {
            modalState[cacheId] = _modal = new modal(templateId, config);
        }

        return _modal;
    };


    /** 验证表单 */
    utility_.Validform = function( config ){
        config = $.extend({
            type: 'ajax',
            label: '.label-text',
            cb: $.noop
        }, config);
        $(config.selector).Validform({
                btnSubmit: config.btnSubmit,
                tipSweep: true,
                tiptype:function(msg,o,cssctl){
                    var objtip=$("#err-tiper");
                    if(o.type != 2 ) {
                        cssctl(objtip,o.type);
                        objtip.show().text(msg);
                    } else {
                        objtip.hide();
                    }
                },
                label: config.label,
                datatype: {
                    select: function(gets,obj,curform,regxp){
                        if( $(obj).prop('disabled') ) {
                            return true;
                        } else {
                            if( gets.length >>> 0 ){
                                return true;
                            }
                        }
                        return false;
                    },
                    charcount: function(gets,obj,curform,regxp){
                        if($('.js_textArea').is(':visible')){
                            if($('.js_editorTip .warn').length){
                                return false;
                            }
                            if( $.trim($('#wysiwyg-edit').html()).length == 0 ){
                                return obj.attr('nullmsg');
                            }
                        }
                        return true;
                    }
                },
                beforeSubmit: function( form ) {
                    if( config.type == 'ajax'){
                        config.cb( form );
                        return false;
                    }
                }
            });
    };

    /** 分页处理 */
    utility_.pageinator = function( ele, config ){
        config = config || {};
        config = $.extend({
            numberOfPages: 5,
            itemContainerClass: function (type, page, current) {
                return (page === current) ? "active" : "pointer-cursor";
            },
            itemTexts: function(type, page, current){
                switch (type) {
                    case "first": return '<i class="fa fa-chevron-left"></i><i class="fa fa-chevron-left"></i>';
                    case "prev": return '<i class="fa fa-chevron-left"></i>';
                    case "next": return '<i class="fa fa-chevron-right"></i>';
                    case "last": return '<i class="fa fa-chevron-right"></i><i class="fa fa-chevron-right"></i>';
                    case "page": return page;
                }
            },
            tooltipTitles: function (type, page, current) {
                switch (type) {
                    case "first": return "第一页";
                    case "prev": return "上一页";
                    case "next": return "下一页";
                    case "last": return "最后一页";
                    case "page": return "第" + page + "页";
                }
            }
        }, config);


        return ele.bootstrapPaginator(config);

    };

    /** 下拉框状态更新 */
    utility_.chosenUpdate = function( ele, config, attr){
        ele = $(ele);
        config = $.extend({}, config);
        attr = attr || 'attr';
        $.each(config, function(key, val){
            ele[attr](key, val);
        });
        ele.trigger("chosen:updated");
    };


    var WxDiglog = function( config ){
          this.config = config;
          this.getRemoteData(1, true);
          this.bindEvent();
    };

    WxDiglog.prototype.getRemoteData = function(page, init){
        var config = this.config, data = {
            pid: config.pid,
            page: page,
            type: config.type
        },
        groupid = this.groupid || this.config.groupid;
        if( this.keyword ){
            data.keyword = this.keyword;
        }
        if( groupid ){
            data.groupid =  groupid;
        }

        ajax({
            url: config.url,
            data: data,
            success: function(res){
                if( res.success ){
                    var token = $(document.body).data('data-token');
                    if( init ){
                        utility_.modal( 'modal-template', {
                            options: {backdrop: 'static'},
                            data : {
                                id : config.modalid,
                                title: config.title,
                                cls: config.cls || 'wx-dialog',
                                body : template.render(config.modalid + '-template', {
                                    data:res.data,
                                    token: token
                                })
                            },
                            cb: config.cb || $.noop
                        });
                    } else {
                        $('#' + config.modalid).find('.modal-body').html(template.render(config.modalid + '-template', {data:res.data, token: token}));
                    }
                    
                }
            }
        });
    };

    WxDiglog.prototype.bindEvent = function(){
        var self = this;
        $(document).off('click');
        $(document).off('keydown');
        $(document).on('click', '.page_next', function(){
            var $this = $(this),
                currentPage = parseInt($this.attr('data-cur')),
                totalPages = parseInt($this.attr('data-total')),
                nextpage = currentPage + 1;
                if( nextpage >= totalPages ){
                    nextpage = totalPages;
                }

                self.getRemoteData(nextpage);

        });
        $(document).on('click', '.page_prev', function(){
            var $this = $(this),
                currentPage = parseInt($this.attr('data-cur')),
                prevpage = currentPage - 1;
                if( prevpage < 1 ){
                    prevpage = 1;
                }

                self.getRemoteData(prevpage);

        });

        $(document).on('click', '.page_go', function(){
            var $this = $(this),
                pages = parseInt($this.prev('input').val());

                if( !isNaN(pages) ){
                    self.getRemoteData(pages);
                } 

        });

        $(document).on('click', '#searchCloseBt', function(){
                $('#msgSearchInput').val('');
                self.keyword = null;
                self.getRemoteData(1);
        });

        $(document).on('click', '#msgSearchBtn', function(){
            self.keyword = $('#msgSearchInput').val();
            self.getRemoteData(1);

        });

        $(document).on('keydown', '#msgSearchInput', function(e){
            if(e.keyCode == 13){
                self.keyword = $('#msgSearchInput').val();
                self.getRemoteData(1);
            }
        });

        $(document).on('click', '.appmsg', function(e){
            var $this = $(this),
                modalBox = $this.closest('#' + self.config.modalid),
                appmsgs = modalBox.find('.appmsg');
                appmsgs.removeClass('selected');
                $this.addClass('selected');
        });

        $(document).on('click', '.inner_menu_box dd', function(){
            var groupid = $(this).attr('data-groupid');
            self.groupid = groupid;
            $('.inner_menu_box dd').removeClass('selected');
            $(this).addClass('selected');
            self.getRemoteData(1);
        });

        $(document).on('click', '.frm_radio_label', function(){
            var $this = $(this),
                input = $this.find('.audio-radio');
                if(input.prop('checked')){
                    var media_item = $this.closest('.media_item'),
                        appmsgs = $('#' + self.config.modalid).find('.appmsg'),
                        appmsg = media_item.find('.appmsg');
                        appmsgs.removeClass('selected');
                        appmsg.addClass('selected');
                }
        });

    };

    utility_.WxDiglog = WxDiglog;

    utility_.createPromise = function( fn ){
        var dtd = $.Deferred();
        fn( dtd );
        return dtd.promise(fn);
    };

    return utility_;

});


