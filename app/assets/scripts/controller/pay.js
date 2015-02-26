define(['jquery', 'interface/ajax', 'component/template', 'component/utility', 'validform', 'component/chosen.jquery'],
    function($, ajax, template, utility){
        return function() {

            var chosenSelect = $(".chosen-select"),
                payForm = $('#pay-form'),
                chosenOpt = {
                    disable_search_threshold: 10,
                    allow_single_deselect: true,
                    search_contains : true,
                    no_results_text: "没有找到任何结果!",
                    width: '100%'
                },
                casesLevel = $('#cases-level'),
                yearLevel = $('#year-level'),
                mothodType = $('#method-type'),
                changePayMethod = function( ele ){
                    var quickPay = $('#quick-pay'),
                        type =$(ele.options[ele.selectedIndex]).attr('data-type');
                    if( type ){

                        quickPay.find('.qr-code').addClass('hide');
                        quickPay.find('.qr-' + type).removeClass('hide');
                    } else {
                        quickPay.find('.qr-code').addClass('hide');
                    }
                },
                changePaySum = function(){
                    var cases = casesLevel.val(),
                        caseOption = casesLevel.find(':selected'),
                        yearOption = yearLevel.find(':selected'),
                        years = yearLevel.val(),
                        percent = parseFloat(yearOption.attr('data-percent')),
                        info = JSON.parse(caseOption.attr('data-info')),
                        lists = [
                            {
                                name: 'platform_a',
                                text: '公众平台个数'
                            },
                            {
                                name: 'multiple_a',
                                text: '按天任务个数'
                            },
                            {
                                name: 'single_a',
                                text: '单任务个数'
                            },
                            {
                                name: 'sum',
                                text: '金额'
                            }
                        ];

                        if( cases && years ){
                            $.each( lists, function(i, v){
                                var name = v.name;
                                if( name != 'sum'){
                                    lists[i].value = info[name];
                                } else {
                                    lists[i].value = Math.ceil(( parseInt(info[name]) * parseInt( years ) * percent )).toFixed(2);
                                }
                                
                            });

                            $('#pay-info').html(template.render('pay-info-template', {
                                list: lists
                            }));
                        }
                    
                };

            chosenSelect.chosen(chosenOpt);

            if( casesLevel.length && yearLevel.length ){
                changePaySum();
            }

            if( mothodType.length ){
                changePayMethod(mothodType[0]);
            }

            $(document).on('change', mothodType.selector, function(){
                changePayMethod(this);
            });

            $(document).on('change', yearLevel.selector, function(){
                changePaySum();
            });

            $(document).on('change', casesLevel.selector, function(){
                changePaySum();
            });

            $('.datepicker').datetimepicker({
                format: 'yyyy/mm/dd',
                language: 'zh-CN',
                minView: 'month',
                autoclose: true,
                pickerPosition: 'top-right',
                todayBtn:  1
            });

            utility.Validform({
                selector: payForm,
                btnSubmit: '#submit-btn',
                cb : function( form ){
                    ajax({
                        dataType: 'json',
                        type: 'get',
                        url: payForm.attr('data-action'),
                        data: form.serialize(),
                        success: function( res ){
                            utility.modal( 'modal-template', {
                                data : {
                                    id : 'alert-model',
                                    title : '提示',
                                    body : res.msg
                                },
                                buttons : [
                                    {"ty" : "remove", "type" : "cancel"}
                                ],
                                cb: function(){
                                    if( res.success ){
                                        location.href = '/user/pay/list'
                                    }
                                }
                            });
                        }
                    });
                }
            });


            // 付费帐单列表分页
            var listBox = $('#list-box'),
                tablelist = $('#table-list'),
                pagelist = $('#pagelist'),
                uid = $('#uid').val(),
                page = $('#page').val();

            if( pagelist.length ) {
                (function(page){
                    var arg = arguments;
                    ajax({
                        url : '/user/pay/list',
                        type : 'get',
                        dataType : 'json',
                        data : {
                            p: page,
                            uid: uid
                        },
                        success : function( res ){
                            if( res.success ) {

                                var bootstrapPaginator = pagelist.data('bootstrapPaginator'),
                                    lists = res.data.lists;


                                listBox.html( template.render('list-template', {
                                    paylists : lists
                                }));

                                if( !bootstrapPaginator ) {
                                    if( lists.length ) {
                                        tablelist.removeClass('hide');
                                    }

                                    var page = res.data.page;

                                    if( page.totalPages > 1 ) {
                                        utility.pageinator(pagelist, {
                                            bootstrapMajorVersion: 3,
                                            currentPage: page.currentPage,
                                            totalPages: page.totalPages,
                                            onPageClicked: function(e, originalEvent, type, page){
                                                arg.callee( page );
                                            }
                                        });
                                    }
                                }

                            }
                        }
                    });
                }(page));
            }


            $(document).on('click', '.remove-pay', function(){
                var $this = $(this),
                    tbody = $this.closest('tr'),
                    ppid = $this.attr('data-ppid');

                utility.modal( 'modal-template', {
                    data : {
                        id : 'alert-model',
                        title : '提示',
                        body : '是否真要删除该付费帐单？'
                    },
                    cb : function(){
                        ajax({
                            dataType : 'json',
                            url : '/admin/pay/remove',
                            data : {
                                ppid : ppid
                            },
                            success: function( res ){
                                if( res.success ) {
                                    tbody.remove();
                                } else {
                                    utility.modal( 'modal-template', {
                                        data : {
                                            id : 'alert-model',
                                            title : '提示',
                                            body : res.msg
                                        },
                                        buttons : [
                                            {"ty" : "remove", "type" : "cancel"}
                                        ]
                                    });
                                }
                            }
                        });
                    }
                });

            });
        };
});