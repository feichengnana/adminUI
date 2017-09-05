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
            data:[0,0,0,0,15,30,4,0,0,0,0,0],
            smooth:true,
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

var chartArea = echarts.init(document.getElementById('echartArea'));
var option3 =  {
    tooltip : {
        trigger: 'axis'
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
    grid:{
    	x:25,
    	x2:40,
    	y2:20
    },
    calculable : true,
    legend: {
        data:['未超时项目数','超时项目数','一次性验收未通过项目数','一次性验收通过项目数','设计阶段','施工阶段','验收阶段','验收通过']
    },
    xAxis : [
        { 
        	name:'建设单位',
            type : 'category',
            data : ['长清区','平阴县','济阳县','商河县','高新区','历城区','天桥区','槐荫区','历下区','市中区','章丘市']
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
            name:'未超时项目数',
            type:'line',
            data:[4,0,0,0,0,3,0,8,0,0,14]
        },
        {
            name:'超时项目数',
            type:'line',
            data:[3,0,0,0,0,0,0,3,0,0,0]
        },
        {
            name:'一次性验收未通过项目数',
            type:'bar',
            tooltip : {trigger: 'item'},
            stack: '验收',
            data:[2,0,0,0,0,1,0,4,0,0,7]
        },
        {
            name:'一次性验收通过项目数',
            type:'bar',
            tooltip : {trigger: 'item'},
            stack: '验收',
            data:[1,0,0,0,0,0,0,0,0,0,1]
        },
        {
            name:'设计阶段',
            type:'bar',
            tooltip : {trigger: 'item'},
            stack: '进度',
            data:[3,0,0,0,0,2,0,4,0,0,14]
        },
        {
            name:'施工阶段',
            type:'bar',
            tooltip : {trigger: 'item'},
            stack: '进度',
            data:[0,0,0,0,0,0,0,2,0,0,3]
        },
        {
            name:'验收阶段',
            type:'bar',
            tooltip : {trigger: 'item'},
            stack: '进度',
            data:[1,0,0,0,0,0,0,1,0,0,3]
        },
        {
            name:'验收通过',
            type:'bar',
            tooltip : {trigger: 'item'},
            stack: '进度',
            data:[3,0,0,0,0,1,0,4,0,0,8]
        }
    ]
};
chartArea.setOption(option3);
