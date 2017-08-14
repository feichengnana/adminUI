(function($){
    //自定义表单验证规则
    $.fn.bootstrapValidator.validators.chinese = {
        validate:function(validator, $field, options){
            var reg = /^[\u4e00-\u9fa5]+$/;
            return {valid:reg.test($field.val()),message:'只能输入中文'};
        }
    }
    $.fn.bootstrapValidator.validators.english = {
        validate:function(validator, $field, options){
            var reg = /^[A-Za-z]+$/;
            return {valid:reg.test($field.val()),message:'只能输入英文'};
        }
    }
    $.fn.bootstrapValidator.validators.phoneNumber = {
        validate:function(validator, $field, options){
            var reg = /0?(13|14|15|17|18)[0-9]{9}/;
            return {valid:reg.test($field.val()),message:'请输入正确的手机号码'};
        }
    }
    $.fn.bootstrapValidator.validators.telNumber = {
        validate:function(validator, $field, options){
            var reg = /[0-9-()（）]{7,18}/;
            return {valid:reg.test($field.val()),message:'请输入正确的座机号码'};
        }
    }
    $.fn.bootstrapValidator.validators.ip  = {
        validate:function(validator, $field, options){
            var reg = /((?:(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d?\d))/;
            return {valid:reg.test($field.val()),message:'请输入正确的IP地址'};
        }
    }
    
}(window.jQuery))
