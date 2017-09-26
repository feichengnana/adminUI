$(function(){
	$('#validForm').bootstrapValidator({
		/**
	    * 生效规则（三选一）
	    * enabled 字段值有变化就触发验证
	    * disabled,submitted 当点击提交时验证并展示错误信息
	    */
		live: 'enabled',
	    /**
	    * 为每个字段设置统一触发验证方式（也可在fields中为每个字段单独定义），默认是live配置的方式，数据改变就改变
	    * 也可以指定一个或多个（多个空格隔开） 'focus blur keyup'
	    */
		trigger:'live focus blur keyup',
	    message:'校验未通过',
	    container: 'popover',
	    fields:{
	        limitStr:{
	            validators:{
	                notEmpty:{
	                    message:'您输入的字段不能为空'
	                },
	                stringLength:{
	                    min:6,
	                    max:20,
	                    message:'请输入6~20个字符'
	                },
	                different:{
	                    field:'password',
	                    message:'不能与密码重复'
	                }
	            }
	        },
	        password:{
	            validators:{
	                notEmpty:{
	                    message:'请输入密码'
	                },
	                stringLength:{
	                    min:6,
	                    max:20,
	                    message:'请输入6~20位的密码'
	                },
	                regexp:{
	                    regexp:/^[a-zA-Z0-9_]+$/,
	                    message:'密码只能为字母数字或下划线的组合'
	                },
	                different:{
	                    field:'limitStr',
	                    message:'不能与用户名相同'
	                }
	            }
	        },
	        repassword:{
	            validators:{
	                notEmpty:{
	                    message:'请再次确认密码'
	                },
	                stringLength:{
	                    min:6,
	                    max:20,
	                    message:'密码限制在6~20位'
	                },
	                regexp:{
	                    regexp:/^[a-zA-Z0-9_]+$/,
	                    message:'密码只能为字母数字或下划线的组合'
	                },
	                identical:{
	                    field:'password',
	                    message:'两次密码不一致'
	                }
	            }
	        },
	        email:{
	            validators:{
	                notEmpty:{
	                    message:'邮箱不能为空'
	                },
	                emailAddress:{
	                    message:'请输入合法的邮箱'
	                }
	            }
	        },
	        url:{
	            validators:{
	                notEmpty:{
	                    message:'url不能为空'
	                },
	                uri:{
	                    message:'请输入合法的url'
	                }
	            }
	        },
	        regexp:{
	            validators:{
	                notEmpty:{
	                    message:'字段不能为空'
	                },
	                regexp:{
	                    regexp:/^[a-zA-Z0-9_]+$/,
	                    message:'只能为字母数字或下划线'
	                }
	            }
	        },
	        age:{
	            validators:{
	                notEmpty:{
	                    message:'请输入年龄'
	                },
	                greaterThan: {
	                    value: 18,
	                    message:'年龄要大于18周岁'
	                },
	                lessThan: {
	                    value: 100,
	                    message:'年龄要小于100周岁'
	                }
	            }
	        },
	        gender:{
	        	validators:{
	                notEmpty:{
	                    message:'请选择性别'
	                }
	            }
	        },
	        likes:{
	        	validators:{
	                notEmpty:{
	                    message:'请选择兴趣'
	                },
	                choice:{
	                    min: 2,
	                    max: 4,
	                    message:'请选择2~4个'
	                }
	            }
	        },
	        dateTime:{
	            validators:{
	                notEmpty:{
	                    message:'请填写生日'
	                },
	                date:{
	                    format:'YYYY-MM-DD',
	                    message:'请按照YYYY-MM-DD格式输入正确的日期'
	                }
	            }
	        },
	        dateTimePicker:{
	            validators:{
	                notEmpty:{
	                    message:'请选择日期'
	                },
	                date:{
	                    format:'YYYY-MM-DD',
	                    message:'请按照YYYY-MM-DD格式输入正确的日期'
	                }
	            }
	        },
	        fourthFile:{
	            validators:{
	                notEmpty:{
	                    message:'请选择附件'
	                },
	                file:{
	                    extension: 'pdf',
	                    type: 'application/pdf',
	                    //minSize: 1024,
	                    maxSize: 10*1024*1024,
	                    message:'请选择一个低于10M的pdf文件'
	                }
	            }
	        },
	        remote:{
	            validators:{
	                type: 'POST',
	                url: 'remote.php',
	                message: '名称不可用',
	                delay: 1000
	            }
	        }
	    }
	})

	$('#validForm').find('[type=reset]').click(function(){
		console.log(11);
		$('#validForm').data('bootstrapValidator').resetForm();
	})
	$('#validForm2').bootstrapValidator({
		excluded: [':disabled', ':not(:visible)'],
	    message:'校验未通过',
	    container: 'tooltip',
	    fields:{
	        onlyChinese:{
	            validators:{
	                chinese:{}
	            }
	        },
	        onlyEnglish:{
	            validators:{
	                english:{}
	            }
	        },
	        phoneNumber:{
	            validators:{
	                phoneNumber:{}
	            }
	        },
	        telNumber:{
	            validators:{
	                telNumber:{}
	            }
	        },
	        ip:{
	            validators:{
	                ip:{}
	            }
	        },
	        gender1:{
	        	selector:'.ui-radio-list',
	        	validators:{
	                ui_choice_noEmpty:{}
	            }
	        },
	        likes1:{
	        	selector:'.ui-checkbox-list',
	        	validators:{
	                ui_choice_noEmpty:{
	                    message:'请选择兴趣'
	                },
	                ui_choice:{
	                    min: 2,
	                    max: 4,
	                    message:'请选择2~4个'
	                }
	            }
	        },
	        fourthFile1:{
	        	selector:'#fourthFile1Trigger',
	        	validators:{
	                ui_file_notEmpty:{
	                    message:'请选择附件'
	                },
	                ui_file:{
	                    extension: 'pdf',
	                    type: 'application/pdf',
	                    //minSize: 1024,
	                    maxSize: 10*1024*1024,
	                    message:'请选择一个低于10M的pdf文件'
	                }
	            }
	        }
	    }
	})
	
	$('.ui-checkbox-list input[type=checkbox]').on('change',function(e){
		$('#validForm2').data('bootstrapValidator').revalidateField('likes1');
	})
	$('.ui-radio-list input[type=radio]').on('change',function(e){
		$('#validForm2').data('bootstrapValidator').revalidateField('gender1');
	})
	$('.date-picker').on('changeDate', function(e) {
	  $('#validForm').data('bootstrapValidator').revalidateField('dateTime');
	});
	$('#fourthFile1').on('change', function(e) {
	  $('#validForm2').data('bootstrapValidator').revalidateField('fourthFile1');
	});
})


