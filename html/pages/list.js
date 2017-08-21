var table = $('#dataTable');
var fixedHeaderOffset = 0;
var table = table.dataTable({
	"order": [], //默认排序查询,为空则表示取消默认排序否则复选框一列会出现小箭头 
	"columns": [{
			"className": "td-checkbox text-center",
			"orderable": false,
			"data": "proId",
			"align": 'center',
			"render": function(data, type, row, meta) {
				var content = '<label class="checkbox">';
				content += '    <input type="checkbox" name="td-checkbox" value="' + data + '" />';
				content += '</label>';
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
	"scrollX": true,
	"scrollCollapse": true,
	fixedHeader: {
		header: true,
		headerOffset: fixedHeaderOffset
	},
	"data": dataTableData,
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
	"dom": '<"clearfix"<"#table-btns.pull-left"><"pull-right" B><"pull-right mr-10" f>>t<"clearfix dt-footer-wrapper" <"pull-left" <"inline-block" i><"inline-block"l>><"pull-right" p>>', //生成样式
	"scrollCollapse": true,
	"processing": true,
	"paging": true,
	"fixedColumns": {
		'leftColumns': 2
	},
	"language": {
		"emptyTable": "没有关联的需求信息!",
		"thousands": ","
	},
	"pageLength": 10,
	"columnDefs": [{ // 所有列默认值
		"targets": "_all",
		"defaultContent": ''
	}],
	"buttons": ['copy', 'excel', 'colvis'], //'pdf',
	"initComplete": function(settings, json) {
		var html = $('#toolbars').html();
		$('#table-btns').append(html);
	},
	drawCallback: function() {
		// 取消全选  
		$(":checkbox[name='td-checkbox']").prop('checked', false);
	}
});

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
			layer.msg('已为您删除所选记录！');
		})
	}
}