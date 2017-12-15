require(['echarts'], function (ec) {
});
var ecConfig = require('echarts/config');
var zrColor = require('zrender/tool/color');

var echObjects = {}; // echObjects 全局对象


//画图方法
var eastcom_echarts_drawChart = {

    init: function (chartId, option) { //初始化方法
        var me = this;

        require(['echarts', 'echarts/theme/macarons', 'echarts/chart/bar', 'echarts/chart/line',
            'echarts/chart/pie', 'echarts/chart/gauge'
        ], function (ec, theme, bar, line, pie, gauge) {
            var myChart = ec.init(document.getElementById(chartId), theme);
            echObjects[chartId] = myChart;
            me.loadEchart(chartId, option);
            me.resize(chartId);
            //me.initEvent();
        });

    },
    resize: function (chartId) {
        window.onresize = function () {
            for (var chartId in echObjects) {
                echObjects[chartId].resize();
            }
        }
    },
    loadEchart: function (chartId, optionObj) { //加载chart的方法
        var me = this;
        var myChart = echObjects[chartId];

        var option = optionObj; //获得option对象
        if (option == null) { //为空这提示div里的内容，类似not data
            document.getElementById(chartId).innerHTML = me.chartHtml;
            echObjects[chartId] = null; //清空全局变量里的chart对象
        } else {
            myChart.setOption(option);
            // if(chartId == "picture" ){
            // window.onresize = myChart.resize;
            // };
        }
    },
    getOption: function () { //获取option对象
        var option = {
            backgroundColor: "#ffffff" //背景色，设置成全白，不设置属性，则透明
        };
        return option;
    },

    initEvent: function () { //初始化chart监听事件，更多参考api
        var me = this;
        //var myChart = echObjects[me.chartId];
    }
};
//----用户报表查看次数TOP10-- 柱状图--------------------------------------------------------------------
var eastcom_echarts_bar = {
    loadDataToChart: function (chartId, users, counts, nameTip) { //加载chart
        var me = this;
        var option = me.initOption(users, counts, nameTip);
        eastcom_echarts_drawChart.init(chartId, option);
    },
    initOption: function (users, counts, nameTip) { //获取option对象
        var option = {
            //                         title: {
            //                             text: ''
            //                         },
            //                         tooltip: {},
            //                         legend: {
            //                             data:['销量']
            //                         },
            tooltip: {
                formatter: nameTip + ": {b}<br/>查看次数 : {c}次",
                position: function (arr) {
                    return [arr[0] - 65, arr[1] - 50];
                }
            },
            grid: {
                x: '50',
                y: '20',
                x2: '10',
                y2: '50'
            },
            xAxis: {
                data: users, //list
                // name:'用户名',
                axisLabel: {
                    interval: '0',
                    rotate: '30'
                }
            },
            yAxis: {
                name: '次数'
            },
            series: [{
                //name: '',
                type: 'bar',
                data: counts
            }]
        };
        return option;
    }
};

//-------当前用户报表查看次数TOP10------柱状图----------
var eastcom_echarts_preBar = {
    loadDataToChart: function (chartId, reports, counts) { //加载chart
        var me = this;
        var option = me.initOption(reports, counts);
        eastcom_echarts_drawChart.init(chartId, option);
    },
    initOption: function (reports, counts) { //获取option对象
        var option = {
            //	                         title: {
            //	                             text: ''
            //	                         },
            tooltip: {},
            grid: {
                x: '30',
                y: '20',
                x2: '10',
                y2: '65'
            },
            xAxis: {
                data: reports,
                // name:'报表名称',
                axisLabel: {
                    interval: '0',
                    rotate: '15'
                }
            },
            yAxis: {
                name: "次数"
            },
            series: [{
                //	                             name: '',
                label: {
                    normal: {
                        show: true,
                        formatter: '{b}'
                    }
                },
                type: 'bar',
                data: counts
            }]
        };
        return option;
    }
};
//----------报表数量趋势图------一折线-----------
var eastcom_echarts_line = {
    loadDataToChart: function (chartId, creatTimes, counts) { //加载chart
        var me = this;
        var option = me.initOption(creatTimes, counts);
        eastcom_echarts_drawChart.init(chartId, option);
    },
    initOption: function (creatTimes, counts) { //获取option对象
        //	     var  option = {
        //	    			    tooltip : {
        //	    			        trigger: 'axis'
        //	    			    },
        //	    			    legend: {
        //	    			        data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
        //	    			    },
        //	    			    toolbox: {
        //	    			        show : true,
        //	    			        feature : {
        //	    			            mark : {show: true},
        //	    			            dataView : {show: true, readOnly: false},
        //	    			            magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
        //	    			            restore : {show: true},
        //	    			            saveAsImage : {show: true}
        //	    			        }
        //	    			    },
        //	    			    calculable : true,
        //	    			    xAxis : [
        //	    			        {
        //	    			            type : 'category',
        //	    			            boundaryGap : false,
        //	    			            data : ['周一','周二','周三','周四','周五','周六','周日']
        //	    			        }
        //	    			    ],
        //	    			    yAxis : [
        //	    			        {
        //	    			            type : 'value'
        //	    			        }
        //	    			    ],
        //	    			    series : [
        //	    			        {
        //	    			            name:'邮件营销',
        //	    			            type:'line',
        //	    			            stack: '总量',
        //	    			            itemStyle: {normal: {areaStyle: {type: 'default'}}},
        //	    			            data:[120, 132, 101, 134, 90, 230, 210]
        //	    			        }
        //
        //	    			    ]
        //	    			};
        var option = {
            title: {
                show: 'false'
            },
            grid: {
                x: '40',
                y: '20',
                x2: '10',
                y2: '50'
            },
            tooltip: {
                trigger: 'axis'
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },

            xAxis: [{
                type: 'category',
                boundaryGap: false,
                data: creatTimes,
                axisLabel: {
                    interval: '0',
                    rotate: '30'
                }
            }],
            yAxis: [{
                type: 'value'
            }],
            series: [{
                name: '报表数量',
                type: 'line',
                stack: '总量',
                itemStyle: {
                    normal: {
                        areaStyle: {
                            type: 'default'
                        }
                    }
                },
                data: counts
            }

            ]
            //	        		    series : [
            //	        		        {
            //	        		            name:'报表数量趋势',
            //	        		            type:'line',
            //	        		            stack: '总量',
            //	        		            areaStyle: {normal: {}},
            //	        		            data:[120, 132, 101, 134, 90, 230, 210,455,233,222,280,300,]
            //	        		        }
            //	        		    ]
        };

        return option;
    }
};
//--------报表访问次数TOP10-----饼图--------------------------
var eastcom_echarts_pieV = {
    loadDataToChart: function (chartId, list, rNames) { //加载chart
        var me = this;
        var option = me.initOption(list, rNames);
        eastcom_echarts_drawChart.init(chartId, option);
    },
    initOption: function (list, rNames) { //获取option对象
        option = {
            //	    			    title : {
            //	    			        text: '报表访问次数TOP10',
            //	    			        show:'false',
            //	    			        x:'center'
            //	    			    },
            tooltip: {
                trigger: 'item',
                formatter: "{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'right',
                y: 'center',
                itemGap: 3,
                data: rNames
            },
            series: [{
                //   name: '访问来源',
                type: 'pie',
                radius: '69%',
                center: ['30%', '50%'],

                data: list,
                itemStyle: {
                    normal: {
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    },

                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        };
        return option;
    }
};
//--------用户报表数量占比TOP10 -----饼图--------------------------
var eastcom_echarts_pieU = {
    loadDataToChart: function (chartId, list, uNames) { //加载chart
        var me = this;
        var option = me.initOption(list, uNames);
        eastcom_echarts_drawChart.init(chartId, option);
    },
    initOption: function (list, uNames) { //获取option对象
        option = {
            //	    			    title : {
            //	    			        text: '报表访问次数TOP10',
            //	    			        show:'false',
            //	    			        x:'center'
            //	    			    },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                itemGap: 5,
                x: 'right',
                y: 'center',
                data: uNames
            },
            series: [{
                //   name: '访问来源',
                type: 'pie',
                radius: '69%',
                center: ['30%', '50%'],

                data: list,
                itemStyle: {
                    normal: {
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    },

                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        };
        return option;
    }
};