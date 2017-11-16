$(document).ready(function() {
	var treeTable = $('#treeTable').treegridData({
		id: 'ORG_ID',
		parentColumn: 'PARENT_ID',
		type: "GET", //请求数据的ajax类型
		url: '../../static/data/orgTree.json', //请求数据的ajax的url
		ajaxParams: {}, //请求数据的ajax的data属性
		treeColumn: 2,//在哪一列上面显示展开按钮
		expandAll: true,  //是否全部展开
		expanderExpandedClass:'fa fa-angle-down font-primary',
		expanderCollapsedClass:'fa fa-angle-right font-primary',
		saveState:true,
		saveStateName:'treeTable-state',
		columns: [{
				title: '选择',
				field: 'ORG_ID',
				width: '60',
				align: 'center',
				render: function(data, row) {
					var content = '<label class="ui-checkbox" style="margin-right:-6px;">';
					content += '<input type="checkbox" data-id="' + row.ORG_ID + '"  data-name="' + row.ORG_NAME + '" value="' + data + '" name="td-checkbox">';
					content += '<span></span></label>';
					return content;
				}
			}, {
				title: '操作',
				field: 'ORG_ID',
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
				field: 'ORG_NAME'
			}, {
				title: 'ID',
				field: 'ORG_ID'
			}, {
				title: 'PARENTID',
				field: 'PARENT_ID'
			}
		]
	});
	
	
	setTimeout(function(){
		//console.log(treeTable);
		//reload
		//treeTable.reload();
		var allNodes = $('#treeTable').treegrid('getRootNodes');
	   console.log(allNodes);
	},3000)
	
});
