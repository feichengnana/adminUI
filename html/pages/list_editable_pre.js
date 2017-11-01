var nEditing = null;
var nNew = false;
/*初始化表格*/
var oTable = App.initDataTables('#dataTable', {
	"toolbars": "#toolbars",
	"ajax": "../../static/data/editTable.json",
	"columns": [
		{
			"data": "proName",
			"title": "工单名称",
			"width": '160'
		},
		{
			"data": "busiCode",
			"title": "工单编码",
			"width": '120'
		},
		{
			"data": "cityName",
			"title": "地市",
			"width": '120'
		},
		{
			"data": "disName",
			"title": "区县",
			"width": '120'
		},
		{
			"data": null,
			"title": "编辑",
			"width": '60',
			"align": 'center',
			"render":function(data, type, row, meta){
				return "<button class='btn primary btn-outline btn-xs edit'>编辑</button>"
			}
		},
		{
			"data": null,
			"title": "删除",
			"width": '60',
			"align": 'center',
			"render":function(data, type, row, meta){
				return "<button class='btn yellow btn-outline btn-xs delete'>删除</button>"
			}
		}
	],
	//按照第一列的名称排序
	"ordering":true,
    "order": [
        [0, "asc"]
    ] 
})
/*绑定表格内部按钮的操作*/
var table = $('#dataTable');

/*删除一行*/
table.on('click', '.delete', function(e) {
	e.preventDefault();
	var _btn = this;
	layer.confirm('您确定要删除此记录吗?', {
		icon: 3, 
		title:'提示'
	}, function(layerObj){
	  	var nRow = $(_btn).parents('tr')[0];
	  	console.log(nRow);
	  	//var aData = oTable.fnGetData(nRow); //当前行的数据
		oTable.fnDeleteRow(nRow);
		//删除成功，进行ajax数据同步
	  	layer.close(layerObj);
	});
		
});

/*删除编辑行*/
table.on('click', '.cancel', function(e) {
	e.preventDefault();
	if(nNew) {
		oTable.fnDeleteRow(nEditing);
		nEditing = null;
		nNew = false;
	} else {
		restoreRow(oTable, nEditing);
		nEditing = null;
	}
});

/*编辑当前行*/
table.on('click', '.edit', function(e) {
	e.preventDefault();
	nNew = false;

	var nRow = $(this).parents('tr')[0];

	if(nEditing !== null && nEditing != nRow) {
		/* 再次编辑前使之前的编辑项复原 */
		restoreRow(oTable, nEditing);
		editRow(oTable, nRow);
		nEditing = nRow;
	} else if(nEditing == nRow && this.innerHTML == "保存") {
		saveRow(oTable, nEditing);
		nEditing = null;
		//更新成功，进行ajax数据同步
	} else {
		editRow(oTable, nRow);
		nEditing = nRow;
	}
});

/*添加一行*/
function addItem(event) {
	event.preventDefault();
	if(nNew && nEditing) {
		layer.confirm('尚有编辑项未保存，您确定要保存吗?', {
			icon: 3, 
			title:'提示'
		}, function(layerObj){
		  	saveRow(oTable, nEditing); 
			nEditing = null;
			nNew = false;
			addEmptyRow();
			layer.close(layerObj);
		},function(layerObj){
			oTable.fnDeleteRow(nEditing);
			nEditing = null;
			nNew = false;
			addEmptyRow();
			return;
		});
	}else{
		addEmptyRow();
	}
}

function addEmptyRow(){
	var aiNew = oTable.fnAddData({
		"proId": "",
		"proName": "",
		"busiCode": "",
		"cityName": "",
		"disName": ""
		});
	var nRow = oTable.fnGetNodes(aiNew[0]);
	editRow(oTable, nRow);
	nEditing = nRow;
	nNew = true;
}

/*复原行*/
function restoreRow(oTable, nRow) {
	var aData = oTable.fnGetData(nRow);
	var jqTds = $('>td', nRow);

	for(var i = 0, iLen = jqTds.length; i < iLen; i++) {
		var field = $(jqTds[i]).find('input').attr('name');
		oTable.fnUpdate(aData[field], nRow, i, false);
	}

	oTable.fnDraw();
}

/*编辑行*/
function editRow(oTable, nRow) {
	var aData = oTable.fnGetData(nRow);
	console.log(aData);
	var jqTds = $('>td', nRow);
	jqTds[0].innerHTML = '<input type="text" class="form-control input-small" name="proName" value="' + aData.proName + '">';
	jqTds[1].innerHTML = '<input type="text" class="form-control input-small" name="busiCode" value="' + aData.busiCode + '">';
	jqTds[2].innerHTML = '<input type="text" class="form-control input-small" name="cityName" value="' + aData.cityName + '">';
	jqTds[3].innerHTML = '<input type="text" class="form-control input-small" name="disName" value="' + aData.disName + '">';
	jqTds[4].innerHTML = '<button class="btn primary btn-outline btn-xs edit">保存</button>';
	jqTds[5].innerHTML = '<button class="btn yellow btn-outline btn-xs cancel">取消</button>';
}

/*保存行*/
function saveRow(oTable, nRow) {
	var jqInputs = $('input', nRow);
	oTable.fnUpdate(jqInputs[0].value, nRow, 0, false);
	oTable.fnUpdate(jqInputs[1].value, nRow, 1, false);
	oTable.fnUpdate(jqInputs[2].value, nRow, 2, false);
	oTable.fnUpdate(jqInputs[3].value, nRow, 3, false);
	oTable.fnUpdate('<button class="btn primary btn-outline btn-xs edit">编辑</button>', nRow, 4, false);
	oTable.fnUpdate('<button class="btn yellow btn-outline btn-xs delete">删除</button>', nRow, 5, false);
	oTable.fnDraw();
}
