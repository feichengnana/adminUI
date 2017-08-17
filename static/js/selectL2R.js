/**
 * 左右选择
 * 支持table、ul
 * 支持初始化数据，initData为要选中条目的id
 * 支持获取选择，结果为选中条目的id数组
 * 如有任何问题或优化，请联系杨娜娜：feichengnana@163.com
 * */

var selectL2R = function() {
    var handleFun = function(el,initData) {
        var $selLeft = $(el).find('.selectL').children();
        var $selRight = $(el).find('.selectR').children();
        var $selOpt = $(el).find('.selectL2R-actions');
        var optNode;
        var classWarning = 'warning';
        var classSucess = 'success';
        if($selLeft[0].nodeName == 'TABLE') {
            optNode = 'tbody tr';
            $selNode = $selLeft.find('tr');
        }else if($selLeft[0].nodeName == 'UL') {
            optNode = 'li';
            classWarning = 'list-group-item-' + classWarning;
            classSucess = 'list-group-item-' + classSucess;
        }
        $selLeft.find(optNode).on('click',function() {
            var $curNode = $(this);
            if($curNode.hasClass(classWarning)) {
                $curNode.removeClass(classWarning);
            } else if(!$curNode.hasClass(classSucess)) {
                $curNode.addClass(classWarning);
            }
        })
        $selRight.delegate(optNode,'click',function() {
            var $curNode = $(this);
            if($curNode.hasClass(classWarning)) {
                $curNode.removeClass(classWarning);
            } else{
                $curNode.addClass(classWarning);
            }
        })
        $selOpt.find('.selectL2R-select').on('click',function(){
            var selectingNode = $selLeft.find(optNode+'.'+classWarning);
            if(selectingNode.length == 0){
                alert('请先在左侧列表中选择要选择的内容');
            }else{
                var dom = selectingNode.removeClass(classWarning).clone();
                $selRight.append(dom);
                sequRight();
                selectingNode.addClass(classSucess);
            }
        })
        $selOpt.find('.selectL2R-delete').on('click',function(){
            var selectingNode = $selRight.find(optNode+'.'+classWarning);
            if(selectingNode.length == 0){
                alert('请先在右侧列表中选择要移除的内容');
            }else{
                selectingNode.each(function(){
                    var dom = $(this);
                    var domId = dom.data('id');
                    dom.remove();
                    removeDom(domId);
                })
            }
        })
        $selOpt.find('.selectL2R-deleteAll').on('click',function(){
            $selRight.find(optNode).remove();
            $selLeft.find(optNode).removeClass(classSucess);
        })
        $selOpt.find('.selectL2R-selectAll').on('click',function(){
            $selRight.find(optNode).remove();
            var trs = $selLeft.find(optNode).removeClass(classSucess).removeClass(classWarning).addClass(classSucess);
            $selRight.append(trs.clone().removeClass(classSucess));
            sequRight();
        })
        if(initData && typeof(initData) == 'object'){
            var initDataLength = initData.length;
            $selLeft.find(optNode).each(function(){
                var tnode = $(this);
                var id = tnode.data('id');
                for (var i = 0;i<initDataLength;i++) {
                    if(id == initData[i]){
                        $selRight.append(tnode.clone());
                        sequRight();
                        tnode.addClass(classSucess);
                        break;
                    }
                }
            })
        }
        
        function removeDom(domId){
            $selLeft.find(optNode+'.'+classSucess).each(function(){
                if($(this).data('id') ==  domId){
                    $(this).removeClass(classSucess);
                }
            });
        }
        function sequRight(){
            if(optNode == 'tbody tr'){
                $selRight.find(optNode).each(function(index){
                    $(this).find('td:first').text(index+1);
                });
            }
        }

    }
    function getSelection(el){
        var $selLeft = $(el).find('.selectL').children();
        var $selRight = $(el).find('.selectR').children();
        var optNode;
        if($selLeft[0].nodeName == 'TABLE') {
            optNode = 'tbody tr';
        }else if($selLeft[0].nodeName == 'UL') {
            optNode = 'li';
        }
        var idArr  = [];
        $selRight.find(optNode).each(function(){
            var id = $(this).data('id');
            idArr.push(id);
        })
        return idArr;
    }
    
    return {
        /*
         * 初始化插件，可以通过initData来初始化数据
         */
        init: function(el,initData) {
            handleFun(el,initData);
        },
        /*
         * 获取选择结果，结果为数据id的组合
         */
        getResult: function(el) {
            return getSelection(el);
        }
    }
}()