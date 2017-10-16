$(document).ready(function() {
	/**
	 * ajax获取表格数据
	 * */
	$.ajax({
		type: "get",
		url: "../../static/data/orgTree.json",
		success: function(data) {
			
			/**
			 * 对表格数据进行初始化
			 * */
			toTable('#sample_1', 'pid', data, [{
				title: '选择',
				data: 'id',
				width: '60',
				align: 'center',
				render: function(data, row) {
					var content = '<label class="ui-checkbox" style="margin-right:-6px;">';
					content += '<input type="checkbox" data-id="' + row.id + '"  data-name="' + row.name + '" value="' + data + '" name="td-checkbox">';
					content += '<span></span></label>';
					return content;
				}
			}, {
				title: '操作',
				data: 'id',
				width: '80',
				align: 'center',
				render: function(data, row) {
					var html = '';
					html += '<button title="查看" class="btn btn-info btn-link btn-xs"><i class="fa fa-search-plus"></i></button>';
					html += '<button title="编辑" class="btn btn-success btn-link btn-xs"><i class="fa fa-edit"></i></button>';
					return html;
				}
			}, {
				title: '名称',
				data: 'name'
			}, {
				title: 'ID',
				data: 'id'
			}, {
				title: 'PARENTID',
				data: 'pid'
			}])

			/**
			 * 对表格做树形结构的初始化
			 * */
			$('#sample_1').treegrid({
				treeColumn: 2,
				expanderExpandedClass:'fa fa-angle-down font-primary',
				expanderCollapsedClass:'fa fa-angle-right font-primary'
			});
		}
	});
});

/**
 * toTable
 * @param {String} tableDom 表格id
 * @param {String} pidName 树结构关联的pid名称
 * @param {Array} data 数据json
 * @param {JSON} coloum 列的设定 ，支持[title、data、width、align、render]
 * */
function toTable(tableDom, pidName, data, coloum) {
	var $table = $(tableDom);
	$table.html('');
	//添加table header
	var thArray = [];
	$.each(coloum, function(index, item) {
		thArray.push('<th ' + (item.width ? ('width="' + item.width + '" ') : '') + (item.align ? ' style="text-align:' + item.align + '" ' : '') + '>' + (item.title ? item.title : '') + '</th>')
	})
	$table.append('<thead><tr>' + thArray.join('') + '</tr></thead>')
	//添加table body
	var $tbody = $('<tbody></tbody>');
	$.each(data, function(index, rowData) {
		var _tr = $('<tr></tr>');
		$.each(coloum, function(sindex, itemCol) {
			var _td = $('<td></td>');
			var tdValue = rowData[itemCol.data];
			if(itemCol.render) {
				tdValue = itemCol.render(rowData[itemCol.data], rowData);
			}
			_td.html(tdValue);
			if(itemCol.align) {
				_td.css('text-align', itemCol.align);
			}
			_tr.append(_td);
		});
		_tr.addClass("treegrid-" + rowData.id);
		if(rowData[pidName]) {
			_tr.addClass('treegrid-parent-' + rowData[pidName]);
		}
		$tbody.append(_tr);
	});
	$table.append($tbody);

}

/**
 * toTree 将普通结构的数据转化为包含关系的树级结构
 * @param {Array} data 数据
 * @param {JSON} parent_id 关联id的值
 * */
function toTree(data, parent_id) {
	var tree = [];
	var temp;
	for(var i = 0; i < data.length; i++) {
		console.log(data[i].pid);
		if(data[i].pid == parent_id) {
			var obj = data[i];
			temp = toTree(data, data[i].id);
			if(temp.length > 0) {
				obj.children = temp;
			}
			tree.push(obj);
		}
	}
	return tree;
}