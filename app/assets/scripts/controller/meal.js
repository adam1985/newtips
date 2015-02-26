define(['jquery', 'interface/ajax', 'component/template', 'component/utility', 'validform', 'component/chosen.jquery'],
    function($, ajax, template, utility){

        return function() {
            utility.Validform({
                selector: '#addMeal-form',
                btnSubmit: '#submit-btn',
                cb : function( form ){
                    var serialize = form.serializeArray();

                    ajax({
                        dataType: 'json',
                        type: 'get',
                        url: '/admin/meal/add',
                        data: serialize,
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
                                        location.href = '/admin/meal/list'
                                    }
                                }
                            });
                        }
                    });
                }
            });


           // 套餐列表分页
           var listBox = $('#list-box'),
               tablelist = $('#table-list'),
               pagelist = $('#pagelist'),
               page = $('#page').val();

           if( pagelist.length ) {
               (function(page){
                   var arg = arguments;
                   ajax({
                       url : '/admin/meal/list',
                       type : 'get',
                       dataType : 'json',
                       data : {
                           ajax: 1,
                           p: page
                       },
                       success : function( res ){
                           if( res.success ) {

                               var bootstrapPaginator = pagelist.data('bootstrapPaginator'),
                                   lists = res.data.lists;


                               listBox.html( template.render('list-template', {
                                   meallist : lists
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


            $(document).on('click', '.remove-meal', function(e){
                e.preventDefault();
                var $this = $(this),
                    tr = $this.closest('tr');

                utility.modal( 'modal-template', {
                    data : {
                        id : 'alert-model',
                        title : '提示',
                        body : '是否真要删除该套餐？'
                    },
                    cb : function(){
                        ajax({
                            dataType : 'json',
                            url : $this.attr('href'),
                            success: function( res ){
                                if( res.success ) {
                                    tr.remove();
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