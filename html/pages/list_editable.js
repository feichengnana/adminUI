
/*初始化表格*/
var oTable = App.initEditableDatatables('#dataTable', {
	"toolbars": "#toolbars",
	"addRowBtn":"#addItemBtn",
	//"ajax": "../../static/data/editTable.json",
	"columns": [
		{
			"data": "proName",
			"title": "工单名称",
			"width": '160',
			"isEditable":false
		},
		{
			"data": "busiCode",
			"title": "工单编码",
			"width": '120',
			"isEditable":true
		},
		{
			"data": "cityName",
			"title": "地市",
			"width": '120',
			"isEditable":true
		},
		{
			"data": "disName",
			"title": "区县",
			"width": '120',
			"isEditable":true
		}
	],
	//按照第一列的名称排序
	"ordering":true,
    "order": [
        [0, "asc"]
    ],
    "fnDeleteEditRow":function(row){
    	console.log('删除了一行，数据为：'+JSON.stringify(row));
    },
    "fnValidEditRow":function(row){
    	var flag = true;
    	//对数据进行逻辑校验
    	console.log('用户要新增一条记录，数据为:'+JSON.stringify(row));
    	if(row.busiCode==''){
    		layer.open({
				title:'提示',
				content:'工单编码不能为空',
				icon:0
			})
    		flag = false;
    	}
    	return flag;
    },
    "fnSaveEditRow":function(row){
    	console.log('新增了一行，数据为：'+JSON.stringify(row));
    }
})
