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
    
    $.fn.bootstrapValidator.validators.ui_choice_noEmpty  = {
        validate:function(validator, $field, options){
            return {valid:$field.find('input:checked').length>0,message:options.message?options.message:'该项为必选项'};
        }
    }
    $.fn.bootstrapValidator.validators.ui_choice  = {
        validate:function(validator, $field, options){
        	
            var checkedItem = $field.find('input:checked');
            console.log(checkedItem.length);
            var flag = true;
            if(options.min>checkedItem.length) flag = false;
            if(options.max<checkedItem.length) flag = false;
            
            return {valid:flag,message:options.message};
        }
    }
    $.fn.bootstrapValidator.i18n.ui_file = $.extend($.fn.bootstrapValidator.i18n.file || {}, {
        'default': '请先选择一个合法的文件'
    });
    $.fn.bootstrapValidator.validators.ui_file_notEmpty  = {
        validate:function(validator, $field, options){
        	$field = $field.closest('.form-group-file').find('input[type=file]');
            return {valid:$field.val()!='',message:options.message?options.message:'该项为必选项'};
        }
    }
    $.fn.bootstrapValidator.validators.ui_file = {
        html5Attributes: {
            extension: 'extension',
            maxfiles: 'maxFiles',
            minfiles: 'minFiles',
            maxsize: 'maxSize',
            minsize: 'minSize',
            maxtotalsize: 'maxTotalSize',
            mintotalsize: 'minTotalSize',
            message: 'message',
            type: 'type'
        },
        validate: function(validator, $field, options) {
        	$field = $field.closest('.form-group-file').find('input[type=file]');
        	console.log($field.val());
            var value = $field.val();
            if (value === '') {
                return true;
            }

            var ext,
                extensions = options.extension ? options.extension.toLowerCase().split(',') : null,
                types      = options.type      ? options.type.toLowerCase().split(',')      : null,
                html5      = (window.File && window.FileList && window.FileReader);

            if (html5) {
                // Get FileList instance
                var files     = $field.get(0).files,
                    total     = files.length,
                    totalSize = 0;

                if ((options.maxFiles && total > parseInt(options.maxFiles, 10))        // Check the maxFiles
                    || (options.minFiles && total < parseInt(options.minFiles, 10)))    // Check the minFiles
                {
                    return {valid:false,message:options.message};
                }

                for (var i = 0; i < total; i++) {
                    totalSize += files[i].size;
                    ext        = files[i].name.substr(files[i].name.lastIndexOf('.') + 1);

                    if ((options.minSize && files[i].size < parseInt(options.minSize, 10))                      // Check the minSize
                        || (options.maxSize && files[i].size > parseInt(options.maxSize, 10))                   // Check the maxSize
                        || (extensions && $.inArray(ext.toLowerCase(), extensions) === -1)                      // Check file extension
                        || (files[i].type && types && $.inArray(files[i].type.toLowerCase(), types) === -1))    // Check file type
                    {
                        return {valid:false,message:options.message};
                    }
                }

                if ((options.maxTotalSize && totalSize > parseInt(options.maxTotalSize, 10))        // Check the maxTotalSize
                    || (options.minTotalSize && totalSize < parseInt(options.minTotalSize, 10)))    // Check the minTotalSize
                {
                    return {valid:false,message:options.message};
                }
            } else {
                // Check file extension
                ext = value.substr(value.lastIndexOf('.') + 1);
                if (extensions && $.inArray(ext.toLowerCase(), extensions) === -1) {
                    return {valid:false,message:options.message};
                }
            }

            return true;
        }
    };
}(window.jQuery))
