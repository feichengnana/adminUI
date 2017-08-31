var chartCount = echarts.init(document.getElementById('echartCount'),'shine');
var option =   {
	color:['#d48265', '#91c7ae','#c4ccd3', '#ca8622', '#89B5DB','#D53A35','#2F4554','#61A0A8'],
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c}"
    },
    grid:{
    	x:0,
    	y:0,
    	x2:0,
    	y2:0
    },
    legend: {
        orient : 'horizontal',
        x : 'left',
        data:['项目编制','项目设计','项目施工','项目验收','项目完成','\n','新建','改造','扩容']
    },
    toolbox: {
        show : true,
        feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false},
            magicType : {
                show: true, 
                type: ['pie', 'funnel']
            },
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    calculable : false,
    series : [
        {
            name:'业务阶段',
            type:'pie',
            radius : [100, 140],
            
            // for funnel
            x: '60%',
            width: '35%',
            funnelAlign: 'left',
            max: 1048,
            
            data:[
                {value:335, name:'项目编制'},
                {value:310, name:'项目设计'},
                {value:234, name:'项目施工'},
                {value:135, name:'项目验收'},
                {value:1048, name:'项目完成'}
            ]
        },
        {
            name:'建设性质',
            type:'pie',
            selectedMode: 'single',
            radius : [0, 70],
            
            // for funnel
            x: '20%',
            width: '40%',
            funnelAlign: 'right',
            max: 1548,
            
            itemStyle : {
                normal : {
                    label : {
                        position : 'inner'
                    },
                    labelLine : {
                        show : false
                    }
                }
            },
            data:[
                {value:335, name:'新建'},
                {value:679, name:'改造'},
                {value:1548, name:'扩容'}
            ]
        }
    ]
};
chartCount.setOption(option);

var chartMonth = echarts.init(document.getElementById('echartMonth'));
var option2 =  {
    title : {
        text: '',
        subtext: ''
    },
    tooltip : {
        trigger: 'item'
    },
    legend: {
    	show:false,
    	data:['项目数量']
    },
    grid:{
    	x:25,
    	x2:40,
    	y2:20
    },
    toolbox: {
        show : true,
        feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false},
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    calculable : true,
    xAxis : [
        {
        	name:'月份',
            type : 'category',
            boundaryGap : false,
            data : ['01','02','03','04','05','06','07','08','09','10','11','12']
        }
    ],
    yAxis : [
        {
        	name:'项目数量',
            type : 'value',
            axisLabel : {
                formatter: '{value}'
            }
        }
    ],
    series : [
        {
            name:'项目数',
            type:'line',
            smooth:true,
            data:[0,0,0,0,15,30,4,0,0,0,0,0],
            markPoint : {
                data : [
                    {type : 'max', name: '最大值'},
                    {type : 'min', name: '最小值'}
                ]
            },
            markLine : {
                data : [
                    {type : 'average', name: '平均值'}
                ]
            }
        }
    ]
};
chartMonth.setOption(option2);

//执行tab页下的图表，默认执行第一个
$('#echartAreaTab a[data-toggle=tab]').on('shown.bs.tab',function(e){
	//获取已激活的标签页的名称
	var activeTab = $(e.target)[0].hash;
	if(activeTab == '#echartAreaTab1') loadArea1();
	if(activeTab == '#echartAreaTab2') loadArea2();
	if(activeTab == '#echartAreaTab3') loadArea3();
	
})
//默认触发第一个tab;
loadArea1();
function loadArea1(){
	var chartArea = echarts.init(document.getElementById('echartArea1'));
	var option =  {
		color:['#91c7ae','#c4ccd3', '#ca8622', '#89B5DB'],
	    tooltip : {
	        trigger: 'axis',
	        axisPointer : {        
	            type : 'shadow'        
	        }
	    },
	    toolbox: {
	        show : true,
	        feature : {
	            magicType : {show: true, type: ['line', 'bar']},
	            dataView : {show: true, readOnly: false},
	            restore : {show: true},
	            saveAsImage : {show: true}
	        }
	    },
		label:{ 
			normal:{ 
				show: true, 
				position: 'top'
			}
		},
	    grid:{
	    	x:25,
	    	x2:40,
	    	y2:20
	    },
	    calculable : true,
	    legend: {
	        data:['一次性验收未通过项目数','一次性验收通过项目数','设计阶段','施工阶段','验收阶段','验收通过','超时项目数','未超时项目数']
	    },
	    xAxis : [
	        { 
	        	name:'建设\n单位',
	            type : 'category',
	            data : ['济南','青岛','淄博','枣庄','东营','烟台','潍坊','济宁','泰安','威海','日照','莱芜','临沂','德州','聊城','滨州','菏泽']
	        }
	    ],
	    yAxis : [
	        {
	        	name:'项目数量',
	            type : 'value',
	            axisLabel : {
	                formatter: '{value}'
	            }
	        }
	    ],
	    series : [
	        {
	            name:'设计阶段',
	            type:'bar',
	            data:[0,28,13,2,3,5,0,3,2,5,8,1,14,5,3,4,0],
//	            markLine : {
//	                data : [
//	                    {type : 'average', name: '平均值'}
//	                ]
//	            }
	        },
	        {
	            name:'施工阶段',
	            type:'bar',
	            data:[0,5,2,0,0,0,1,0,2,0,0,1,1,1,0,2,0],
//	            markLine : {
//	                data : [
//	                    {type : 'average', name: '平均值'}
//	                ]
//	            }
	        },
	        {
	            name:'验收阶段',
	            type:'bar',
	            data:[0,37,3,0,1,1,3,0,1,5,0,1,0,0,1,0,1],
//	            markLine : {
//	                data : [
//	                    {type : 'average', name: '平均值'}
//	                ]
//	            }
	        },
	        {
	            name:'验收通过',
	            type:'bar',
	            data:[11,1,0,1,6,25,37,0,1,0,0,0,0,1,1,0,1],
//	            markLine : {
//	                data : [
//	                    {type : 'average', name: '平均值'}
//	                ]
//	            }
	        }
	    ]
	};
	chartArea.setOption(option);
}

function loadArea2(){
		var chartArea = echarts.init(document.getElementById('echartArea2'));
	var option =  {
		color:['#CF4541','#547B96','#CA8622'],
	    tooltip : {
	        trigger: 'axis',
	        axisPointer : {        
	            type : 'shadow'        
	        }
	    },
	    toolbox: {
	        show : true,
	        feature : {
	            magicType : {show: true, type: ['line', 'bar']},
	            dataView : {show: true, readOnly: false},
	            restore : {show: true},
	            saveAsImage : {show: true}
	        }
	    },
		label:{ 
			normal:{ 
				show: true, 
				position: 'top'
			}
		},
	    grid:{
	    	x:25,
	    	x2:40,
	    	y2:20
	    },
	    calculable : true,
	    legend: {
	        data:['超时项目数','未超时项目数','超时率']
	    },
	    xAxis : [
	        { 
	        	name:'建设\n单位',
	            type : 'category',
	            data : ['济南','青岛','淄博','枣庄','东营','烟台','潍坊','济宁','泰安','威海','日照','莱芜','临沂','德州','聊城','滨州','菏泽']
	        }
	    ],
	    yAxis : [
	        {
	        	name:'项目数量',
	            type : 'value',
	            axisLabel : {
	                formatter: '{value}'
	            }
	        },
	        {
	            name: '超时率',
	            type: 'value',
	            min: 0,
	            max: 1,
	            interval: 0.1,
	            axisLabel: {
	                formatter: '{value} %'
	            }
	        }
	    ],
	    series : [
	        {
	            name:'超时项目数',
	            type:'bar',
	            data:[0,24,0,1,0,1,3,0,0,2,8,0,2,4,1,3,0],
	            markLine : {
	                data : [
	                    {type : 'average', name: '平均值'}
	                ]
	            }
	        },
	        {
	            name:'未超时项目数',
	            type:'bar',
	            data:[8,47,18,2,10,30,38,3,6,8,0,3,13,3,4,3,2],
//	            markLine : {
//	                data : [
//	                    {type : 'average', name: '平均值'}
//	                ]
//	            }
	        },
	        {
	            name:'超时率',
	            type:'line',
            	smooth:true,
	            yAxisIndex: 1,
	            data:[0,0.34,0,0.33,0,0.03,0.07,0,0,0.2,1,0,0.13,0.57,0.2,0.5,0],
	        }
	    ]
	};
	chartArea.setOption(option);
}

function loadArea3(){
		var chartArea = echarts.init(document.getElementById('echartArea3'));
	var option =  {
		color:['#D45956','#61A0A8','#CA8622'],
	    tooltip : {
	        trigger: 'axis',
	        axisPointer : {        
	            type : 'shadow'        
	        }
	    },
	    toolbox: {
	        show : true,
	        feature : {
	            magicType : {show: true, type: ['line', 'bar']},
	            dataView : {show: true, readOnly: false},
	            restore : {show: true},
	            saveAsImage : {show: true}
	        }
	    },
		label:{ 
			normal:{ 
				show: true, 
				position: 'top'
			}
		},
	    grid:{
	    	x:25,
	    	x2:48,
	    	y2:20
	    },
	    calculable : true,
	    legend: {
	        data:['一次性验收未通过项目数','一次性验收通过项目数','一次性验收通过率']
	    },
	    xAxis : [
	        { 
	        	name:'建设\n单位',
	            type : 'category',
	            data : ['济南','青岛','淄博','枣庄','东营','烟台','潍坊','济宁','泰安','威海','日照','莱芜','临沂','德州','聊城','滨州','菏泽']
	        }
	    ],
	    yAxis : [
	        {
	        	name:'项目数量',
	            type : 'value',
	            axisLabel : {
	                formatter: '{value}'
	            }
	        },
	        {
	            name: '一次性验收通过率',
	            type: 'value',
	            min: 0,
	            max: 1,
	            interval: 0.1,
	            axisLabel: {
	                formatter: '{value} %'
	            }
	        }
	    ],
	    series : [
	        {
	            name:'一次性验收未通过项目数',
	            type:'bar',
	            data:[0,24,0,1,0,1,3,0,0,2,8,0,2,4,1,3,0],
	            markLine : {
	                data : [
	                    {type : 'average', name: '平均值'}
	                ]
	            }
	        },
	        {
	            name:'一次性验收通过项目数',
	            type:'bar',
	            data:[8,47,18,2,10,30,38,3,6,8,0,3,13,3,4,3,2],
//	            markLine : {
//	                data : [
//	                    {type : 'average', name: '平均值'}
//	                ]
//	            }
	        },
	        {
	            name:'一次性验收通过率',
	            type:'line',
            	smooth:true,
	            yAxisIndex: 1,
	            data:[0,0.34,0,0.33,0,0.03,0.07,0,0,0.2,1,0,0.13,0.57,0.2,0.5,0],
	        }
	    ]
	};
	chartArea.setOption(option);
}

