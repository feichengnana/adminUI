$(document).ready(function() {
    $.fn.zTree.init($("#treeDemo"), {
        check: {
            enable: true,
            chkboxType: {
                "Y": "",
                "N": ""
            }
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            beforeClick: beforeClick,
            onCheck: onCheck
        }
    }, zNodes);
    $.fn.zTree.init($("#modalTreeDemo"), {
        check: {
            enable: true,
            chkboxType: {
                "Y": "",
                "N": ""
            }
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            beforeClick: beforeModalClick
        }
    }, zNodes);

//  $('#treeTable').bootstrapTable({
//      url: '../data/treeData.json',
//      clickToSelect: true,
//      treeShowField: 'name',
//      columns: [{
//          checkbox: true
//      }, {
//          field: 'id',
//          title: 'ID'
//      }, {
//          field: 'pid',
//          title: 'PID'
//      }, {
//          field: 'name',
//          title: '部门'
//      }, {
//          field: 'count',
//          title: '人数'
//      }]
//  })
});

function beforeClick(treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
    zTree.checkNode(treeNode, !treeNode.checked, null, true);
    return false;
}

function onCheck(e, treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
        nodes = zTree.getCheckedNodes(true),
        v = "";
    for(var i = 0, l = nodes.length; i < l; i++) {
        v += nodes[i].name + ",";
    }
    if(v.length > 0) v = v.substring(0, v.length - 1);
    var cityObj = $("#selectTree");
    cityObj.attr("value", v);
}

function beforeModalClick(treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj("modalTreeDemo");
    zTree.checkNode(treeNode, !treeNode.checked, null, true);
    return false;
}

function showTree() {
    var selectObj = $("#selectTree");
    var selectOffset = selectObj.offset();
    var selectWidth = selectObj.outerWidth();
    $("#treeContent").css({
        left: selectOffset.left + "px",
        top: selectOffset.top + selectObj.outerHeight() + "px",
        width: selectObj.outerWidth()
    }).slideDown("fast");

    $("body").bind("mousedown", onBodyDown);
}

function hideMenu() {
    $("#treeContent").fadeOut("fast");
    $("body").unbind("mousedown", onBodyDown);
}

function onBodyDown(event) {
    if(!(event.target.id == "selectTree" || event.target.id == "treeContent" || $(event.target).parents("#treeContent").length > 0)) {
        hideMenu();
    }
}

function saveModalTree() {
    var zTree = $.fn.zTree.getZTreeObj("modalTreeDemo"),
        nodes = zTree.getCheckedNodes(true),
        v = "";
    for(var i = 0, l = nodes.length; i < l; i++) {
        v += nodes[i].name + ",";
    }
    if(v.length > 0) v = v.substring(0, v.length - 1);
    var cityObj = $("#modalTtee");
    cityObj.attr("value", v);
    $('#modalTree').modal('hide')
}

function saveModalTableTree() {
    var selectRow = $('#treeTable').bootstrapTable('getSelections');
    var varr = [];
    for(var i = 0, l = selectRow.length; i < l; i++) {
        varr.push(selectRow[i].name);
    }
    var v = varr.join(',');
    $('#tableTree').val(v);
    $('#modalTableTree').modal('hide');
}

jQuery(document).ready(function() {
    selectL2R.init('#selectL2R',['01','03']);
    $('#getSelectL2R').click(function(){
        var result = selectL2R.getResult('#selectL2R');
        $('#selectL2RResult').text(result);
    })
    selectL2R.init('#selectL2R-ul');
    $('#getSelectL2R-ul').click(function(){
        var result = selectL2R.getResult('#selectL2R-ul');
        $('#selectL2RResult-ul').text(result);
    })
});