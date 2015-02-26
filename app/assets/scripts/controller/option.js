define(['jquery', 'interface/ajax', 'component/template', 'component/utility', 'validform', 'component/chosen.jquery'],
    function($, ajax, template, utility){

        return function() {

            var chosenOpt = {
                disable_search_threshold: 10,
                allow_single_deselect: true,
                search_contains : true,
                no_results_text: "没有找到任何结果!",
                width: '100%'
            },
            changeType = function(type){
                type = type || 0;
                var value = textTypeBox.attr('data-value'),
                    textField = textTypeBox.find('.text-field');
                    if( textField.length ){
                        value = textField.val();
                    }
                    textTypeBox.html(template.render('text-type-template', {
                        type: type,
                        value: value
                    }));
            },
            textTypeBox = $('#text-type-box'),
            type = textTypeBox.attr('data-type');
            $('.type-chosen-select').chosen(chosenOpt);

            $(document).on('change', '#opt-type', function(){
                var type = this.value || 0;
                    changeType(type);
            });

            if( textTypeBox.length ){
                changeType(type);
            }
            
            utility.Validform({
                selector: '#addoption-form',
                btnSubmit: '#submit-btn',
                cb : function( form ){
                    var serialize = form.serializeArray(),
                        check = $('#change-status').prop('checked'),
                        status = check ? 1 : 0;
                    serialize.push({
                        name: 'status',
                        value: status
                    });

                    ajax({
                        dataType: 'json',
                        type: 'get',
                        url: '/admin/option/add',
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
                                        location.href = '/admin/option'
                                    }
                                }
                            });
                        }
                    });
                }
            });


            utility.Validform({
                selector: '#option-form',
                btnSubmit: '#submit-btn',
                cb : function( form ){

                    var changeStatus = form.find('.change-status'),
                        serialize = form.serializeArray();

                        changeStatus.each(function(i, v){
                            var check = this.checked,
                                field = $(v).attr('data-field'),
                                status = check ? 1 : 0;

                            serialize.push({
                                name: field + '[status]',
                                value: status
                            });    

                        });

                    ajax({
                        dataType: 'json',
                        type: 'POST',
                        url: '/admin/option',
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
                                ]
                            });
                        }
                    });
                }
            });


            $(document).on('click', '.remove-opt', function(e){
                e.preventDefault();
                var $this = $(this),
                    formGroup = $this.closest('.form-group');

                utility.modal( 'modal-template', {
                    data : {
                        id : 'alert-model',
                        title : '提示',
                        body : '是否真要删除该字段？'
                    },
                    cb : function(){
                        ajax({
                            dataType : 'json',
                            url : $this.attr('href'),
                            success: function( res ){
                                if( res.success ) {
                                    formGroup.remove();
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