define(['jquery', 'interface/ajax',  'component/template', 'component/utility',
        'component/bootstrap-datetimepicker.zh-CN', 'validform', 'pageinator', 'component/chosen.jquery'],
    function($, ajax, template, utility){
        return function() {
            var registerForm = $('#register-form');
            utility.Validform({
                selector: registerForm,
                btnSubmit: '#submit-btn',
                cb : function( form ){
                    ajax({
                        dataType: 'json',
                        type: 'post',
                        url: registerForm.attr('data-action'),
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
                                        location.href = '/login';
                                    }
                                }
                            });
                        }
                    });
                }
            });

            utility.Validform({
                selector: '#login-form',
                btnSubmit: '#submit-btn',
                cb : function( form ){
                    ajax({
                        dataType: 'json',
                        type: 'post',
                        url: '/login',
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
                                            location.href = '/user/timer/index'
                                        }
                                    }
                                });
                            }
                    });
                }
            });


            $('.datepicker').datetimepicker({
                format: 'yyyy/mm/dd',
                language: 'zh-CN',
                minView: 'month',
                pickerPosition: 'top-right',
                autoclose: true,
                todayBtn:  1
            });

            var chosenSelect = $(".chosen-select"),
                chosenOpt = {
                    disable_search_threshold: 10,
                    allow_single_deselect: true,
                    search_contains : true,
                    no_results_text: "没有找到任何结果!",
                    width: '100%'
                };

            chosenSelect.chosen( chosenOpt);



            utility.Validform({
                selector: '#checkuser-form',
                btnSubmit: '#submit-btn',
                cb : function( form ){
                    ajax({
                        dataType: 'json',
                        type: 'post',
                        url: '/admin/user/check',
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
                                        location.href = '/admin/user/list';
                                    }
                                }
                            });
                        }
                    });
                }
            });

            $(document).on('click', '.remove-user', function(){
                var $this = $(this),
                    tbody = $this.closest('tr'),
                    uid = $this.attr('data-uid');

                utility.modal( 'modal-template', {
                    data : {
                        id : 'alert-model',
                        title : '提示',
                        body : '是否真要删除该用户？'
                    },
                    cb : function(){
                        ajax({
                            dataType : 'json',
                            url : '/admin/user/remove',
                            data : {
                                uid : uid
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

            $(document).on('click', '.disable-user', function(){
                var $this = $(this),
                    uid = $this.attr('data-uid'),
                    status = $this.attr('data-status');
                ajax({
                    dataType : 'json',
                    url : '/admin/user/stop',
                    data : {
                        uid : uid,
                        status : status
                    },
                    success : function( res ){
                        utility.modal('modal-template', {
                            data : {
                                id : 'alert-model',
                                title : '提示',
                                body : res.msg
                            },
                            buttons : [
                                {"ty" : "remove", "type" : "cancel"}
                            ],
                            cb : function(){
                                if( res.success ){
                                    location.href = '/admin/user/list';
                                }
                            }
                        });
                    }
                });
            });


            // 用户列表分页
            var listBox = $('#list-box'),
                tablelist = $('#table-list'),
                pagelist = $('#pagelist');

            if( pagelist.length ) {
                (function(page){
                    var arg = arguments;
                    ajax({
                        url : '/admin/user/list',
                        type : 'get',
                        dataType : 'json',
                        data : {
                            p: page
                        },
                        success : function( res ){
                            if( res.success ) {

                                var bootstrapPaginator = pagelist.data('bootstrapPaginator'),
                                    lists = res.data.lists;


                                listBox.html( template.render('list-template', {
                                    users : lists
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
                }(1));
            }


        };
});