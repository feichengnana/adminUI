/***
Wrapper/Helper Class for datagrid based on jQuery Datatable Plugin
***/
var Dtools = function() {

	var tableOptions; // main options
	var dataTable; // datatable object
	var table; // actual table jquery object
	var tableContainer; // actual table container object
	var tableWrapper; // actual table wrapper jquery object
	var tableInitialized = false;
	var ajaxParams = {}; // set filter mode
	var the;

	var countSelectedRecords = function() {
		var selected = $('tbody > tr > td:nth-child(1) input[type="checkbox"]:checked', table).size();
		var text = tableOptions.dataTable.language.uiGroupActions;
		if(selected > 0) {
			$('.table-group-actions > span', tableWrapper).text(text.replace("_TOTAL_", selected));
		} else {
			$('.table-group-actions > span', tableWrapper).text("");
		}
	};

	return {

		//main function to initiate the module
		init: function(options) {

			if(!$().dataTable) {
				return;
			}

			the = this;

			// default settings
			options = $.extend(true, {
				src: "", // actual table  
				filterApplyAction: "filter",
				filterCancelAction: "filter_cancel",
				resetGroupActionInputOnSuccess: true,
				loadingMessage: '加载中...',
				dataTable: {
					"order": [],
					"dom": '<"clearfix"<"#table-btns.pull-left"><"pull-right" B><"pull-right mr-10" f>>t<"clearfix dt-footer-wrapper" <"pull-left" <"inline-block" i><"inline-block"l>><"pull-right" p>>', //生成样式
					"pageLength": 10,
					"language": {
						"uiGroupActions": "共选中 _TOTAL_ 条数据:  ",
						"uiAjaxRequestGeneralError": "请求失败，请检查网络设置是否正确！",
						"processing": "处理中..."
					},
					"oLanguage": {
						"sProcessing": "处理中...",
						"sLengthMenu": "&nbsp;&nbsp;&nbsp;&nbsp;每页显示  _MENU_ 条记录",
						"sZeroRecords": "没有匹配结果",
						"sInfo": "当前为第 _START_ 至 _END_ 条记录，共 _TOTAL_ 条记录",
						"sInfoEmpty": "当前为第 0 至 0 条记录，共 0 项",
						"sInfoFiltered": "(由 _MAX_ 条记录结果过滤)",
						"sInfoPostFix": "",
						"sSearch": "",
						"sSearchPlaceholder": "输入关键字筛选表格",
						"sUrl": "",
						"sDecimal": "",
						"sThousands": ",",
						"sEmptyTable": "表中数据为空",
						"sLoadingRecords": "载入中...",
						"sInfoThousands": ",",
						"oPaginate": {
							"sFirst": "首页",
							"sPrevious": "上页",
							"sNext": "下页",
							"sLast": "末页"
						},
						"oAria": {
							"sSortAscending": ": 以升序排列此列",
							"sSortDescending": ": 以降序排列此列"
						},
						"buttons": {
							"copy": "<i title='复制到剪切板' class='fa fa-copy'></i>",
							"excel": "<i title='导出表格' class='fa fa-table'></i>",
							"pdf": "<i title='导出PDF' class='fa fa-file-pdf-o'></i>",
							"colvis": "<i title='列' class='glyphicon glyphicon-th'></i>",
							"copyTitle": "复制到剪切板",
							"copySuccess": {
								1: "已经复制当前记录到剪贴板",
								_: "已经复制 %d 条记录到剪切板"
							}
						}
					},
					"orderCellsTop": true,
					"columnDefs": [{ //设置列可排序，第一列为checkbox的除外
						'orderable': false,
						'targets': [0]
					}],
					"autoWidth": false,
					"processing": true,
					"serverSide": true,
					"scrollX": true,
					"scrollCollapse": true,
					"processing": true,
					"paging": true,

					"ajax": {
						"url": "",
						"type": "POST",
						"timeout": 20000,
						"data": function(data) { // add request parameters before submit
							$.each(ajaxParams, function(key, value) {
								data[key] = value;
							});
							App.blockUI({
								message: tableOptions.loadingMessage,
								target: tableContainer,
								overlayColor: 'none',
								cenrerY: true,
								boxed: true
							});
						},
						"dataSrc": function(res) { // Manipulate the data returned from the server
//							if(res.customActionMessage) {
//								App.alert({
//									type: (res.customActionStatus == 'OK' ? 'success' : 'danger'),
//									icon: (res.customActionStatus == 'OK' ? 'check' : 'warning'),
//									message: res.customActionMessage,
//									container: tableWrapper,
//									place: 'prepend'
//								});
//							}
//
//							if(res.customActionStatus) {
//								if(tableOptions.resetGroupActionInputOnSuccess) {
//									$('.table-group-action-input', tableWrapper).val("");
//								}
//							}
//
//							if($('.group-checkable', table).size() === 1) {
//								$('.group-checkable', table).attr("checked", false);
//							}
//
//							if(tableOptions.onSuccess) {
//								tableOptions.onSuccess.call(undefined, the, res);
//							}
//
//							App.unblockUI(tableContainer);

							return res.data;
						},
						"error": function() { // handle general connection errors
							if(tableOptions.onError) {
								tableOptions.onError.call(undefined, the);
							}

							App.alert({
								type: 'danger',
								icon: 'warning',
								message: tableOptions.dataTable.language.uiAjaxRequestGeneralError,
								container: tableWrapper,
								place: 'prepend'
							});

							App.unblockUI(tableContainer);
						}
					},
					"drawCallback": function(oSettings) { 
						if(tableInitialized === false) {
							tableInitialized = true; 
							table.show(); 
						}
						countSelectedRecords();

						if(tableOptions.onDataLoad) {
							tableOptions.onDataLoad.call(undefined, the);
						}
					}
				}
			}, options);

			tableOptions = options;

			// create table's jquery object
			table = $(options.src);
			tableContainer = table.parents(".table-container");

			// apply the special class that used to restyle the default datatable
			var tmp = $.fn.dataTableExt.oStdClasses;

			$.fn.dataTableExt.oStdClasses.sWrapper = $.fn.dataTableExt.oStdClasses.sWrapper + " dataTables_extended_wrapper";
			$.fn.dataTableExt.oStdClasses.sFilterInput = "form-control input-xs input-sm input-inline";
			$.fn.dataTableExt.oStdClasses.sLengthSelect = "form-control input-xs input-sm input-inline";

			// initialize a datatable
			console.log(JSON.stringify(tableOptions.dataTable));
			dataTable = table.DataTable(options.dataTable);

			// revert back to default
			$.fn.dataTableExt.oStdClasses.sWrapper = tmp.sWrapper;
			$.fn.dataTableExt.oStdClasses.sFilterInput = tmp.sFilterInput;
			$.fn.dataTableExt.oStdClasses.sLengthSelect = tmp.sLengthSelect;

			// get table wrapper
			tableWrapper = table.parents('.dataTables_wrapper');

			// build table group actions panel
			if($('.table-actions-wrapper', tableContainer).size() === 1) {
				$('.table-group-actions', tableWrapper).html($('.table-actions-wrapper', tableContainer).html()); // place the panel inside the wrapper
				$('.table-actions-wrapper', tableContainer).remove(); // remove the template container
			}
			// handle group checkboxes check/uncheck
			$('.group-checkable', table).change(function() {
				var set = table.find('tbody > tr > td:nth-child(1) input[type="checkbox"]');
				var checked = $(this).prop("checked");
				$(set).each(function() {
					$(this).prop("checked", checked);
				});
				countSelectedRecords();
			});

			// handle row's checkbox click
			table.on('change', 'tbody > tr > td:nth-child(1) input[type="checkbox"]', function() {
				countSelectedRecords();
			});

			// handle filter submit button click
			table.on('click', '.filter-submit', function(e) {
				e.preventDefault();
				the.submitFilter();
			});

			// handle filter cancel button click
			table.on('click', '.filter-cancel', function(e) {
				e.preventDefault();
				the.resetFilter();
			});
		},

		submitFilter: function() {
			the.setAjaxParam("action", tableOptions.filterApplyAction);

			// get all typeable inputs
			$('textarea.form-filter, select.form-filter, input.form-filter:not([type="radio"],[type="checkbox"])', table).each(function() {
				the.setAjaxParam($(this).attr("name"), $(this).val());
			});

			// get all checkboxes
			$('input.form-filter[type="checkbox"]:checked', table).each(function() {
				the.addAjaxParam($(this).attr("name"), $(this).val());
			});

			// get all radio buttons
			$('input.form-filter[type="radio"]:checked', table).each(function() {
				the.setAjaxParam($(this).attr("name"), $(this).val());
			});

			dataTable.ajax.reload();
		},

		resetFilter: function() {
			$('textarea.form-filter, select.form-filter, input.form-filter', table).each(function() {
				$(this).val("");
			});
			$('input.form-filter[type="checkbox"]', table).each(function() {
				$(this).attr("checked", false);
			});
			the.clearAjaxParams();
			the.addAjaxParam("action", tableOptions.filterCancelAction);
			dataTable.ajax.reload();
		},

		getSelectedRowsCount: function() {
			return $('tbody > tr > td:nth-child(1) input[type="checkbox"]:checked', table).size();
		},

		getSelectedRows: function() {
			var rows = [];
			$('tbody > tr > td:nth-child(1) input[type="checkbox"]:checked', table).each(function() {
				rows.push($(this).val());
			});

			return rows;
		},

		setAjaxParam: function(name, value) {
			ajaxParams[name] = value;
		},

		addAjaxParam: function(name, value) {
			if(!ajaxParams[name]) {
				ajaxParams[name] = [];
			}

			skip = false;
			for(var i = 0; i < (ajaxParams[name]).length; i++) { // check for duplicates
				if(ajaxParams[name][i] === value) {
					skip = true;
				}
			}

			if(skip === false) {
				ajaxParams[name].push(value);
			}
		},

		clearAjaxParams: function(name, value) {
			ajaxParams = {};
		},

		getDataTable: function() {
			return dataTable;
		},

		getTableWrapper: function() {
			return tableWrapper;
		},

		gettableContainer: function() {
			return tableContainer;
		},

		getTable: function() {
			return table;
		}

	};

};