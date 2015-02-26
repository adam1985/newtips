define(['jquery', 'interface/ajax', 'component/loading', 'component/template', 'component/utility',
    'component/bootstrap-datetimepicker.zh-CN', 'component/bootstrap-wysiwyg-init',  'validform', 'component/sco.message', 'component/chosen.jquery', 'component/charCount'],
    function($, ajax, loading, template, utility){
        return function(){

            var platformSelect = $('#platform-select'),
                runModeSelect = $('#run-mode'),
                datetimepicker = $('.datepicker'),
                chosenSelect = $(".chosen-select"),
                timerForm = $('#timer-form'),
                fsend = $('#fsend-select'),
                tab_navs = $('#tab_navs li'),
                tab_content = $('.tab_content'),
                listBox = $('#list-box'),
                pagelist = $('#pagelist'),
                intervalList = $('#interval-list'),
                sendObj = $('#sendObj'),
                detailOpt = $('#detail-opt'),
                detailOptContent = $('#detail-opt-content'),
                emotionSwitch = $('#emotion-switch'),
                emotionWrp = $('#emotion-item-box'),
                contentEdit = $('#wysiwyg-edit'),
                pid = platformSelect.val(),
                page = $('#page').val(),
                runMode = runModeSelect.val() || 0,
                selectType = {
                    "0": "disabled",
                    "1": "able"
                },
                citytips = {"1": "country", "2": "province", "3": "city"},
                chosenOpt = {
                    disable_search_threshold: 10,
                    allow_single_deselect: true,
                    search_contains : true,
                    no_results_text: "没有找到任何结果!",
                    width: '100%'
                },
                datetimepickerUpdate = function( runMode ){
                    var picker = datetimepicker.data('datetimepicker');

                    if( picker ){
                        datetimepicker.datetimepicker('remove');
                    }

                    datetimepicker.find('input').val('');


                    if ( runMode == 0 ){
                        datetimepicker.datetimepicker({
                            format: 'hh:ii:ss',
                            language: 'zh-CN',
                            todayHighlight: true,
                            minuteStep: 2,
                            todayBtn:  1,
                            autoclose: 1,
                            startView: 0
                        });

                    } else if( runMode == 1)  {
                        datetimepicker.datetimepicker({
                            startDate: new Date(),
                            format: 'yyyy/mm/dd hh:ii:ss',
                            language: 'zh-CN',
                            todayHighlight: true,
                            minuteStep: 2,
                            todayBtn:  1,
                            autoclose: 1,
                            startView: 2
                        });
                    }
                },
                mobileLoad = loading(),

                getplatMsg = function( pid, cb){
                    if( pid ){
                        return ajax({
                            url : '/user/weixin/getplatmsg',
                            type : 'get',
                            dataType : 'json',
                            data : {
                                pid : pid
                            },
                            success : function( res ){
                                if( res.success ) {

                                    $('#sendObj').html(template.render('select-opt-template', {
                                        select: {
                                            id: 'js_sendObj',
                                            name: 'massinfo[groupid]',
                                            opts: res.data.list
                                        }
                                    }));

                                    $('#sync-weibo').html(template.render('sync-weibo-template', {
                                        tx_mb_info: res.data.tx_mb_info
                                    }));

                                    $('#mass-history-list').html(template.render('mass-list-template', {
                                        token: res.data.token
                                    }));
                                    $(document.body).data('data-token', res.data.token);

                                }

                                cb && cb();
                            }
                        }, {
                            ishide: true
                        });
                    } else {
                        return utility.createPromise(function(dtd){
                            dtd.resolve();
                        });
                    }

                },
                getCitys = function(pid, cityid, type, inserttype, cb){
                    if( pid ){
                       return ajax({
                           url : '/user/weixin/getcitys',
                           type : 'get',
                           dataType : 'json',
                           data : {
                               pid : pid,
                               id: cityid,
                               type: type
                           },
                           success : function( res ){
                               if( res.success ) {
                                   $('#js_region')[inserttype](template.render('select-opt-template', {
                                       select: {
                                           id: citytips[type],
                                           name: 'massinfo[' + citytips[type] + ']',
                                           opts: res.data.list
                                       }
                                   }));
                               }

                               cb && cb();
                           }
                       }, {
                           ishide: true
                       }); 
                    } else {
                        return utility.createPromise(function(dtd){
                            dtd.resolve();
                        });
                    } 

                },
                toggleMode = function(mode){
                    var type = selectType[mode],
                        chosen = fsend.data('chosen');

                    if( chosen ){
                        if( type == 'disabled' ){
                            utility.chosenUpdate(fsend, {
                                disabled: true
                            });
                        } else if( type == 'able' ) {
                            utility.chosenUpdate(fsend, {
                                disabled: false
                            });
                        }
                    }
                },
                drawChosen = function( select ){
                    select = $(select);

                    var chosen = select.data('chosen');

                    if( chosen ) {
                        select.chosen('destroy');
                    }

                    select.chosen(chosenOpt);

                },
                renderChosen = function( select ){
                    chosenSelect = $( select || ".chosen-select")
                    chosenSelect.chosen(chosenOpt);
                },
                insertItems = function(data){
                    var postFieldItems = $('#post-field-items');
                    if( postFieldItems.length ){
                        postFieldItems.html(template.render('field-items-template', {data:data}));
                    }
                    
                };

            var createPageBar = function( options ){
                    var bootstrapPaginator = pagelist.data('bootstrapPaginator');

                    bootstrapPaginator && bootstrapPaginator.destroy();

                    initPacelist(options);
                };

            var initPacelist = function( options ){
                    var serializeArray = $('#timer-list-form').serializeArray(),
                        serializeObject = {};
                        $.each(serializeArray, function(i, v){
                            serializeObject[v.name] = v.value;
                        });

                    options = $.extend(serializeObject, options);

                    ajax({
                        url : '/user/timer/list',
                        type : 'get',
                        dataType : 'json',
                        data : options,
                        success : function( res ){
                            if( res.success ) {


                                var bootstrapPaginator = pagelist.data('bootstrapPaginator'),
                                    lists = res.data.lists;


                                listBox.html( template.render('list-template', {
                                    taskList : lists
                                }));

                                if(lists.length && !bootstrapPaginator ) {
                                    intervalList.removeClass('hide');
                                }

                                var page = res.data.page;

                                if( page.totalPages > 1 && !pagelist.data('bootstrapPaginator')) {
                                    utility.pageinator(pagelist, {
                                        bootstrapMajorVersion: 3,
                                        currentPage: page.currentPage,
                                        totalPages: page.totalPages,
                                        onPageClicked: function(e, originalEvent, type, page){
                                            var pid = platformSelect.val();
                                            initPacelist({
                                                p: page,
                                                pid: pid
                                            });
                                        }
                                    });
                                }

                                $('[data-toggle="tooltip"]').tooltip();

                            }
                        }
                    }, {ishide: true});

            },
            createCitySelect = function(select, type){
                select = $(select);
                var cityid = select.val(),
                    dropdown_menu = select.closest('.dropdown_menu').next();

                getCitys(pid, cityid, type, 'append', function(){
                    dropdown_menu.remove();
                    renderChosen('#select-'+citytips[type]);
                });

            };

                var pageOption = {
                    p: page
                };

                

                if( pid ){
                    pageOption.pid = pid;

                }


                if( pagelist.length ){
                    createPageBar( pageOption );
                }

                if( platformSelect.length ){
                    datetimepickerUpdate( runMode );
                    renderChosen();
                    mobileLoad.show();
                    getplatMsg(pid).done(function(){
                        getCitys(pid, 0, 1, 'html').done(function(){
                            mobileLoad.hide();
                            renderChosen('.dy-chosen');
                        });
                    });

                    var charCount = contentEdit.charCount({
                        allowed: 600,
                        warning: 0
                    });

                    contentEdit.wysiwyg().on('change', function(){
                        charCount();
                    });

                    insertItems({
                        type: 1,
                        title: '',
                        field: 'content'
                    });
                }


                

                $('#sync-weibo').on('click', '.frm_checkbox_label', function(){
                    var input = $(this).find('input'), 
                        checked = input.prop('checked');
                        input.val(checked ? 1 : 0);
                });

                emotionSwitch.click(function(){
                    var $this = $(this);
                    if( !emotionWrp.is(':visible') ) {
                        emotionWrp.show();
                        if( !$this.data('emodata') ) {
                            ajax({
                                url : '/user/timer/emotion',
                                type : 'get',
                                cache: true,
                                dataType : 'html',
                                success : function( res ){
                                    $this.data('emodata', 1);
                                    emotionWrp.html( res );
                                }
                            });
                        }
                    }
                });

                emotionWrp.on('mouseover', '.emotions_item', function(){
                    var gifurl = $(this).find('i').attr('data-gifurl'),
                        image = new Image();
                        image.src = gifurl;

                        image.onload = function(){
                            emotionWrp.find('.js_emotionPreviewArea').html($(image));

                        };

                });

                emotionWrp.on('click', '.emotions_item', function(){
                    var furl = $(this).find('i'),
                        gifurl = furl.attr('data-gifurl'),
                        title = furl.attr('data-title'),
                        image = new Image();
                        image.setAttribute('alt', 'mo-' + title);
                        image.src = gifurl;
                        //contentEdit.focus(); 
                        contentEdit.append(image);
                        contentEdit.trigger('change');
                        charCount();
                        //var range = window.getSelection().getRangeAt(0);  
                        //range.setStart(range.startContainer,2);
                        
                });

                $(document.body).on('click', function(e){
                    if( $(e.target).closest('.emotion-inner').length < 1){
                        emotionWrp.hide();
                    }
                });

                $(document.body).on('click', '.jump-weixin', function(e){
                    e.preventDefault();
                    var token = $(document.body).data('data-token'),
                        pid = platformSelect.val();
                    if( token ){
                        var url = $(this).attr('href') + '/plat/' + pid;
                        window.open(url, '_blank');
                    }
                });


                tab_navs.click(function(){
                    var $this = $(this), 
                        type = $this.attr('data-type'),
                        wxtitle = $this.attr('data-wxtitle'),
                        modalid = $this.attr('data-modalid'),
                        index = $this.index(),
                        tab = $('#js_msgSender').find($this.attr('data-tab')),

                        modalComplite = function(modal, jqModal){
                            var appmsg = $('#' + modalid).find('.appmsg.selected');
                            if( appmsg.length ){
                                var appmsgBox;
                                
                                appmsgBox = appmsg.parent().clone(true);
                                appmsgBox.find('.appmsg').removeClass('selected');

                                tab_navs.removeClass('selected').eq(index).addClass('selected');
                                tab_content.addClass('dn').eq(index).removeClass('dn');
                                if( type == 2){
                                    var img = appmsgBox.find('.pic'),
                                        src = img.attr('src'),
                                        aElement = $('<a class="imgpic" href="' + src + '" target="_blank" ></a>');
                                        aElement.append(img);
                                        tab.html(aElement);

                                } else {
                                   tab.html(appmsgBox); 
                                }

                                var id = appmsg.attr('data-id'),
                                    title = appmsg.attr('data-title'),
                                    field = $this.attr('data-field');

                                    insertItems({
                                        type: type,
                                        field: field,
                                        title: title,
                                        content: id
                                    });

                                modal.hide();

                                
                            } else {
                                $.scojs_message('请' + wxtitle, 1);
                            }
                            
                        };

                        modalComplite.keeplive = 1;

                        if( modalid ){
                            var data = {
                                url: '/user/weixin/getappmsg',
                                title: wxtitle,
                                pid: pid,
                                type: type,
                                modalid: modalid,
                                cb: modalComplite
                            };
                            if( modalid == 'wx-imgArea'){
                                data.groupid = 1;
                            }
                            new utility.WxDiglog(data);
                        } else {
                            tab_navs.removeClass('selected').eq(index).addClass('selected');
                            tab_content.addClass('dn').eq(index).removeClass('dn');
                            insertItems({
                                type: type,
                                title: '',
                                field: 'content'
                            });
                        }

                });


            $(document).on('change', '.platform-select', function(){
                    pid = this.value;
                    mobileLoad.show();
                    getplatMsg(pid, function(){
                        mobileLoad.hide();
                        drawChosen($('#select-js_sendObj'));
                    });
            });


            $(document).on('change', '.run-mode', function(){
                var pid = platformSelect.val();
                    runMode = this.value;

                datetimepickerUpdate( runMode );
            });


            $(document).on('change', '#select-country', function(){
                createCitySelect(this, 2);
            });

            $(document).on('change', '#select-province', function(){
                createCitySelect(this, 3);
            });

            /** 添加定时任务 */
            utility.Validform({
                selector: '#timer-form',
                btnSubmit: '#add-timer',
                cb : function( form ){ 
                    var istext = contentEdit.is(':visible');

                        if( istext ){
                            content = contentEdit.html(),
                            rex = /<img.*?alt="(.*?)".*?>/gi,
                            htmlrex = /<\/?[^>]*>/g;
                            content = content.replace(rex, '$1').replace(/mo-/g, '/').replace(htmlrex,'');
                            $('#post-field-content').val(content);
                            $('#timer-title').val(contentEdit.text().slice(0, 20));
                        }


                    var serializeArray = timerForm.serializeArray();

                    ajax({
                        url : '/user/timer/add',
                        type : 'post',
                        dataType : 'json',
                        data : serializeArray,
                        success : function( res ){
                            utility.modal( 'modal-template', {
                                data : {
                                    id : 'alert-model',
                                    title: '警告',
                                    body : res.msg
                                },
                                buttons : [
                                    {"ty" : "remove", "type" : "cancel"}
                                ],
                                cb: function(){
                                    location.href = '/user/timer/list';
                                }
                            });
                        }
                    });
                }
            });

            /** 删除定时任务 */
            $(document).on('click', '.remove-timer', function(){
                var $this = $(this),
                    tid = $this.attr('data-tid'),
                    appid = parseInt($this.attr('data-appid')),
                    tr = $this.closest('tr');

                utility.modal( 'modal-template', {
                    data : {
                        id : 'alert-model',
                        title: '警告',
                        body : '是否真要删除该定时任务？'
                    },
                    cb: function(){
                        ajax({
                            url: '/user/timer/remove',
                            type: 'get',
                            dataType: 'json',
                            data: {
                                tid: tid
                            },
                            success: function (res) {
                                if (res.success) {
                                    tr.remove();
                                }
                            }
                        });
                    }
                });

            });


            /** 重启定时任务 */
            $(document).on('click', '.restart-timer', function(){
                var $this = $(this),
                    tid = $this.attr('data-tid'),
                    tr = $this.closest('tr');

                utility.modal( 'modal-template', {
                    data : {
                        id : 'alert-model',
                        title: '警告',
                        body : '是否真要重启该定时任务？'
                    },
                    cb: function(){
                        ajax({
                            url: '/user/timer/restart',
                            type: 'get',
                            dataType: 'json',
                            data: {
                                tid: tid
                            },
                            success: function (res) {
                                utility.modal( 'modal-template', {
                                   data : {
                                       id : 'alert-model',
                                       title: '警告',
                                       body : res.msg
                                   },
                                   buttons : [
                                       {"ty" : "remove", "type" : "cancel"}
                                   ]
                               });
                            }
                        });
                    }
                });

            });


            /** 重启所有定时任务 */
            $(document).on('click', '.restart-all-timer', function(e){
                e.preventDefault();
                var uid = $(this).attr('data-uid');
                $.ajax({
                    url : '/user/timer/restartAll',
                    type : 'get',
                    dataType : 'json',
                    data: {
                        uid: uid
                    },
                    success : function( res ){
                       utility.modal( 'modal-template', {
                           data : {
                               id : 'alert-model',
                               title: '警告',
                               body : res.msg
                           },
                           buttons : [
                               {"ty" : "remove", "type" : "cancel"}
                           ]
                       });
                    }
                });
            });

        };
});