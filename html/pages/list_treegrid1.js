$(document).ready(function() {
	var treeTable = $('#treeTable').treegrid({
		expanderExpandedClass: 'fa fa-angle-down font-primary',
		expanderCollapsedClass: 'fa fa-angle-right font-primary',
		initialState:'expanded',
		saveState: true
	});
	
	console.log(treeTable);
	var allNodes = treeTable.treegrid('getRootNodes');
	console.log(allNodes);
});
