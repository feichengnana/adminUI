/**
 * 2017-10-20新建
 * 参考http://www.cnblogs.com/landeanfen/p/6776152.html
 * 修改：增加对column的处理
 *  title:'',//列名
 *  data:'',//字段名
 * 	width:'',//宽度设定
 *  align:'center',//取值left/center/right
 * 	render:function(data,row), //data字段值，data为当前row的json值，可以对字段进行自定义
 * 
 * 2017-11-14更改
 * 增加target.reload方法
 * 
 * */
(function($) {
	"use strict";

	$.fn.treegridData = function(options, param) {
		//如果是调用方法
		if(typeof options == 'string') {
			return $.fn.treegridData.methods[options](this, param);
		}

		//如果是初始化组件
		options = $.extend({}, $.fn.treegridData.defaults, options || {});
		var target = $(this);
		//得到根节点
		target.getRootNodes = function(data) {
			var result = [];
			$.each(data, function(index, item) {
				if(!item[options.parentColumn]) {
					result.push(item);
				}
			});
			return result;
		};
		var j = 0;

		/**
		 * 根据td的值和列的设置，输出列内容
		 * @param {JSON} row 当前记录的数据
		 * @param {JSON} column 当前列的配置
		 * */
		target.getTd = function(row, column) {
			var td = $('<td></td>');
			var colVal = row[column.field];
			if(column.render) {
				colVal = column.render(row[column.field], row);
				if(colVal == undefined) {
					colVal = row[column.field]
				}
			}
			td.html(colVal);
			//设置css
			if(column.width) {
				td.attr('width', column.width)
			}
			if(column.align) {
				td.css({
					'text-align': column.align
				})
			}
			return td;
		};

		//递归获取子节点并且设置子节点
		target.getChildNodes = function(data, parentNode, parentIndex, tbody) {
			$.each(data, function(i, item) {
				if(item[options.parentColumn] == parentNode[options.id]) {
					var tr = $('<tr></tr>');
					var nowParentIndex = (parentIndex + (j++) + 1);
					tr.addClass('treegrid-' + nowParentIndex);
					tr.addClass('treegrid-parent-' + parentIndex);
					$.each(options.columns, function(index, column) {
						tr.append(target.getTd(item, column));
					});
					tbody.append(tr);
					target.getChildNodes(data, item, nowParentIndex, tbody)
				}
			});
		};
		/**
		 * 构造表头，根据options.columns
		 * */
		target.initHeader = function(){
			var thr = $('<tr></tr>');
			$.each(options.columns, function(i, item) {
				var th = $('<th></th>');
				if(item.width) th.attr('width', item.width);
				if(item.align) th.css('text-align', item.align);
				th.text(item.title);
				thr.append(th);
			});
			var thead = $('<thead></thead>');
			thead.append(thr);
			target.append(thead);
		}
		
		/**
		 * 构造表体，根据data
		 * */
		target.initBody = function(data){
			var tbody = $('<tbody></tbody>');
			var rootNode = target.getRootNodes(data);
			$.each(rootNode, function(i, item) {
				var rootIndex = (++j);
				var tr = $('<tr></tr>');
				tr.addClass('treegrid-' + rootIndex);
				$.each(options.columns, function(index, column) {
					tr.append(target.getTd(item, column));
				});
				tbody.append(tr);
				target.getChildNodes(data, item, rootIndex, tbody);
			});
			target.append(tbody);
		}
		
		target.initTreeTable = function(){
			target.treegrid({
				treeColumn: options.treeColumn ? options.treeColumn : 0,
				expanderExpandedClass: options.expanderExpandedClass,
				expanderCollapsedClass: options.expanderCollapsedClass,
				initialState: options.expandAll ? 'expanded':'collapsed',
				saveState: options.saveState ? options.saveState :false,
				saveStateName: options.saveStateName ? options.saveStateName : 'tree-grid-state'
			});
		}
		

		//初始化表格
		target.initTable = function(data) {
			target.html('');
			//构造表头
			target.initHeader();
			//构造表体
			target.initBody(data);
			//初始化表格
			target.initTreeTable();
		};

		if(!target.hasClass('table')) target.addClass('table');
		if(options.striped) {
			if(!target.hasClass('table-striped')) target.addClass('table-striped');
		}
		if(options.bordered) {
			if(!target.hasClass('table-bordered')) target.addClass('table-bordered');
		}
		if(options.url) {
			$.ajax({
				type: options.type,
				url: options.url,
				data: options.ajaxParams,
				dataType: "JSON",
				success: function(data, textStatus, jqXHR) {
					target.initTable(data);
				}
			});
		} else {
			//也可以通过defaults里面的data属性通过传递一个数据集合进来对组件进行初始化....
			if(options.data) target.initTable(options.data);
			else return;
		}
		target.reload = function(){
			if(options.url) {
				$.ajax({
					type: options.type,
					url: options.url,
					data: options.ajaxParams,
					dataType: "JSON",
					success: function(data, textStatus, jqXHR) {
						//console.log(data);
						target.initBody(data);
						target.initTreeTable();
					}
				});
			} else {
				//也可以通过defaults里面的data属性通过传递一个数据集合进来对组件进行初始化....
				if(options.data){
					target.initBody(data);
					target.initTreeTable();
				}else return;
			}
		}
		return target;
	};

	$.fn.treegridData.methods = {
		getAllNodes: function(target, data) {
			return target.treegrid('getAllNodes');
		},
		//组件的其他方法也可以进行类似封装........
	};

	$.fn.treegridData.defaults = {
		id: 'id',
		parentColumn: 'parentId',
		data: [], //构造table的数据集合
		type: "GET", //请求数据的ajax类型
		url: null, //请求数据的ajax的url
		ajaxParams: {}, //请求数据的ajax的data属性
		treeColumn: 0, //在哪一列上面显示展开按钮,默认第一列
		expandAll: true, //是否全部展开
		striped: false, //是否各行渐变色
		bordered: false, //是否显示边框
		columns: [],
		expanderExpandedClass: 'glyphicon glyphicon-chevron-down', //展开的按钮的图标
		expanderCollapsedClass: 'glyphicon glyphicon-chevron-right' //缩起的按钮的图标
	};
})(jQuery);

//$('#tb').treegridData({
//  id: 'id',
//  parentColumn: 'parentId',
//  type: "GET", //请求数据的ajax类型
//  url: '/TestMVC/GetData',   //请求数据的ajax的url
//  ajaxParams: {}, //请求数据的ajax的data属性
//  treeColumn: 0,//在哪一列上面显示展开按钮
//  //expandAll: false,  //是否全部展开
//  columns: [
//      {
//          title: '机构名称',
//          field: 'Name'
//      },
//      {
//          title: '机构描述',
//          field: 'Desc'
//      }
//  ]
//});