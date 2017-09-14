
var table = App.initDataTables('#dataTable',{
	"columns": [{
			"className": "td-checkbox text-center",
			"orderable": false,
			"data": "proId",
			"align": 'center',
			"render": function(data, type, row, meta) {
				var content = '<label class="ui-checkbox">';
					content += '<input type="checkbox"  value="' + data + '" name="td-checkbox">';
					content += '<span></span></label>';
				return content;
			}
		}, {
			"data": "proId",
			"title": "操作",
			"orderable": false,
			"bSort": false,
			"width": "20",
			"align": 'center',
			"className": "text-center",
			"render": function(a, b, c, d) {
				var html = '';
				html += '<button title="查看" onclick="findDetail(' + c.proId + ')" class="btn btn-info btn-link btn-xs"><i class="fa fa-search-plus"></i></button>';
				html += '<button title="编辑" onclick="editDetail(' + c.proId + ')" class="btn btn-success btn-link btn-xs" ' + (a < 3 ? 'disabled="disabled"' : '') + '><i class="fa fa-edit"></i></button>';
				return html;
			}
		},
		{
			"data": "proName",
			"title": "工单名称",
			"width": '160',
			"align": 'left'
		},
		{
			"data": "busiCode",
			"title": "工单编码",
			"width": '120',
			"align": 'left'
		},
		{
			"data": "proCode",
			"title": "项目编码",
			"width": '190',
			"align": 'left'
		},
		{
			"data": "cityName",
			"title": "地市",
			"width": '120',
			"align": 'left'
		},
		{
			"data": "disName",
			"title": "区县",
			"width": '120',
			"align": 'left'
		},
		{
			"data": "providerName",
			"title": "工程服务商",
			"width": '100',
			"align": 'left'
		},
		{
			"data": "providerUserName",
			"title": "工单接收人",
			"width": '100',
			"align": 'left'
		},
		{
			"data": "buildSceneName",
			"title": "建设性质",
			"width": '100',
			"align": 'left'
		},
		{
			"data": "buildTypeName",
			"title": "建设时限",
			"width": '100',
			"align": 'left'
		},
		{
			"data": "proDate",
			"title": "归属工期（天）",
			"width": '100',
			"align": 'left'
		}
	],
	"data": dataTableData,
	"fixedColumns": {
		'leftColumns': 2
	},
	"scrollX":true
})

function findDetail(itemId) {
	$('#findDetailModal').modal('show')
}

function editDetail(itemId) {
	$('#editDetailModal').modal('show')
}

function addItem() {

}

function delItem() {
	var checkedItem = $('#dataTable_wrapper').find('input[type=checkbox][name=td-checkbox]:checked');
	if(checkedItem.length == 0) {
		layer.alert('请先在表格中勾选您要删除的项目', {
			icon: 0,
			skin: 'layer-ext-moon'
		})
		return false;
	} else {
		layer.confirm('您选择了' + checkedItem.length + '条记录，确定要将其删除吗', {
			btn: ['删除', '取消'],
			icon: 0,
			skin: 'layer-ext-moon'
		}, function() {
			//table.ajax.reload();
			layer.msg('已为您删除所选记录！');
		})
	}
}