define(['jquery', 'interface/ajax', 'component/template', 'component/utility', 'validform'],
    function($, ajax, template, utility){
        return function() {



            $(document).on('click', '#verifyChange', function(e){
                e.preventDefault();
                var verifyImg = $('#verifyImg'),
                    imgSrc = verifyImg.attr('src');

                    if( imgSrc ){
                        imgSrc = imgSrc.replace(/(r=)\d+/, '$1' + (+new Date));
                        verifyImg.attr('src', imgSrc);
                    }

            });

            utility.Validform({
                selector: '#addplat-form',
                btnSubmit: '#submit-btn',
                cb : function( form ){
                    var formSerialize = form.serialize(),
                        account = $('#account').val();
                    ajax({
                        dataType: 'json',
                        type: 'get',
                        url: '/user/plat/login',
                        data: formSerialize,
                        success: function( res ){
                            if( res.success ){
                                if(res.data.ret == 0){
                                    ajax({
                                        dataType: 'json',
                                        type: 'post',
                                        url: '/user/plat/add',
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
                                                        location.href = '/user/plat/list';
                                                    }
                                                }
                                            });
                                        }
                                    });
                                } else {

                                    if(res.data.ret == -8){
                                        $('#verifybox').html(template.render('verifyImg-template', {
                                            url: '/user/plat/imgcode?account=' + account + '&r=' + (+new Date)
                                        }));

                                    } 

                                    utility.modal( 'modal-template', {
                                        data : {
                                            id : 'alert-model',
                                            title : '警告',
                                            body : '帐号或密码有误，请仔细核查~~'
                                        },
                                        buttons : [
                                            {"ty" : "remove", "type" : "cancel"}
                                        ]
                                    });

                                }
                            }
                        }
                    });


                }
            });


            // 公众平台列表分页
            var listBox = $('#list-box'),
                tablelist = $('#table-list'),
                pagelist = $('#pagelist'),
                uid = $('#uid').val(),
                page = $('#page').val();

            if( pagelist.length ) {
                (function(page){
                    var arg = arguments;
                    ajax({
                        url : '/user/plat/list',
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
                                    plats : lists
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

            $(document).on('click', '.remove-user', function(){
                var $this = $(this),
                    tbody = $this.closest('tr'),
                    pid = $this.attr('data-pid');

                utility.modal( 'modal-template', {
                    data : {
                        id : 'alert-model',
                        title : '提示',
                        body : '是否真要删除公众平台？'
                    },
                    cb : function(){
                        ajax({
                            dataType : 'json',
                            url : '/user/plat/remove',
                            data : {
                                pid : pid
                            },
                            success: function( res ){
                                if( res.success ) {
                                    tbody.remove();
                                }
                            }
                        });
                    }
                });

            });
        };
});