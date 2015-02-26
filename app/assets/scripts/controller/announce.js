define(['jquery', 'interface/ajax', 'component/template', 'component/utility', 'validform'],
    function($, ajax, template, utility){
        return function() {

            utility.Validform({
                selector: '#announce-form',
                btnSubmit: '#submit-btn',
                cb : function( form ){
                    ajax({
                        dataType: 'json',
                        type: 'post',
                        url: '/admin/announce/add',
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
                                        location.href = '/admin/announce/list';
                                    }
                                }
                            });
                        }
                    });
                }
            });

            // 公众平台列表分页
            var listBox = $('#list-box'),
                tablelist = $('#table-list'),
                pagelist = $('#pagelist');

            if( pagelist.length ) {
                (function(page){
                    var arg = arguments;
                    ajax({
                        url : '/admin/announce/list',
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
                                    announce : lists
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
           

            $(document).on('click', '.remove-announce', function(){
                var $this = $(this),
                    tbody = $this.closest('tr'),
                    aid = $this.attr('data-aid');

                utility.modal( 'modal-template', {
                    data : {
                        id : 'alert-model',
                        title : '提示',
                        body : '是否真要删除该公告信息？'
                    },
                    cb : function(){
                        ajax({
                            dataType : 'json',
                            url : '/admin/announce/remove',
                            data : {
                                aid : aid
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