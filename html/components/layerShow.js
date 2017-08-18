$(function(){
	$('#layerAlert').click(function(){
		layer.alert('您还没有登录，请先登录！')
	})
	
	$('#layer0').click(function(){
		layer.open({
			title:'提示',
			content:'这里是您要提示的内容',
			icon:0
		})
	})
	
	$('#layer1').click(function(){
		layer.open({
			title:'提示',
			content:'您的已成功操作了您的业务',
			icon:1
		})
	})
	
	$('#layer2').click(function(){
		layer.open({
			title:'提示',
			content:'操作失败，请核对后重新操作！',
			icon:2
		})
	})
	
	$('#layer3').click(function(){
		layer.confirm('您确定要执行此操作吗?', {
			icon: 3, 
			title:'提示'
		}, function(index){
		  //do something
		  
		  layer.close(index);
		});
	})
	
	$('#layerBu').click(function(){
		layer.open({
		  type: 1,
		  shade: false, //不显示遮罩层
		  title: '列表内容', //不显示标题设为false
		  content: $('#layerCnt'), //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
		  cancel: function(){
		  	//关闭时执行的操作
		  }
		});
	})
})
