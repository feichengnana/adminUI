var Login = function() {

    var handleLogin = function() {

//      $('.login-form').validate({
//          errorElement: 'span', //default input error message container
//          errorClass: 'help-block', // default input error message class
//          focusInvalid: false, // do not focus the last invalid input
//          rules: {
//              username: {
//                  required: true
//              },
//              password: {
//                  required: true
//              },
//              remember: {
//                  required: false
//              }
//          },
//
//          messages: {
//              username: {
//                  required: "用户名不能为空！"
//              },
//              password: {
//                  required: "密码不能为空！"
//              }
//          },
//
//          invalidHandler: function(event, validator) {    
//              $('.alert-danger', $('.login-form')).show();
//          },
//
//          highlight: function(element) { 
//              $(element).closest('.form-group').addClass('has-error'); 
//          },
//
//          success: function(label) {
//              label.closest('.form-group').removeClass('has-error');
//              label.remove();
//          },
//
//          errorPlacement: function(error, element) {
//              error.insertAfter(element.closest('.input-icon'));
//          },
//
//          submitHandler: function(form) {
//              form.submit(); 
//          }
//      });

        $('.login-form input').keypress(function(e) {
            if (e.which == 13) {
                if ($('.login-form').validate().form()) {
                    $('.login-form').submit(); //form validation success, call ajax form submit
                }
                return false;
            }
        });

        $('.forget-form input').keypress(function(e) {
            if (e.which == 13) {
                if ($('.forget-form').validate().form()) {
                    $('.forget-form').submit();
                }
                return false;
            }
        });
    }

    return {
       
        init: function() {

            handleLogin();

            // 初始化左侧图片
//          $('.login-bg').backstretch([
//              "../../static/img/login/d1.jpg",
//              "../../static/img/login/d2.jpg"
//              ], {
//                fade: 1000,
//                duration: 8000
//              }
//          );

        }

    };

}();

jQuery(document).ready(function() {
    Login.init();
});