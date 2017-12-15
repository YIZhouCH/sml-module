   var height = "";
   var rowNum = "";
   var val = "";
   var sortName = "";
   var currHeadMetas = "";
   var initHeadMetas = "";
   var addDemoType = "";
   var index_addColor = "";
   var select_id = "";
   var startTime = "";	//用于计算接口请求耗时

   var field_info_all = [];
   var filter_data_database = [];

   var drill = {
             selectNodeId:"",              //树图上新选择的钻取报表id
             selectNodeText:"",
             alreadyChildrenId:"",          //已经保存过得钻取报表id
             fieldname:""                  //已经选中过得钻取字段
   };
   var configHyperLinkTreeSelectParams = {};
   
   var dataBaseFilterCondition = [];
   var filterCondition = [];
   var globalVariablePostJson = {};


   var reportQueryResult = {
   	init: function() {
   		//旧算法
   		/*height = kk - 83;
   		rowNum = Math.floor(height / 30);*/

		var clientH = document.documentElement.clientHeight;
		var gridH = clientH - 120;	//184是除去grid以外, 其他所有的高
		rowNum = Math.floor((gridH-17)/30);	//17是预留横向滚动条高度
		height = rowNum*30+17;
		
         reportQueryResult.getReportResultData("init");
         //reportQueryResult.queryReportFieldColor(); 
         reportQueryResult.isShowOrHideFilterCon();

   	},
      isShowOrHideFilterCon : function(){
      		var report_id = val[0].reportCheckInfo.report_id;
             var data = {
               "report_id": report_id
             };
             var dataStr = JSON.stringify(data);
             var res = commonAjax("/sml/invoke/srptAssistantService/showFilter/srpt-cfg-reportInfo", dataStr, "", "");
             if (res.success) {
             //if (true) {
                    if (res.data.flag == "show") {
                    //if (true) {
                         $("#configHyperLink_qingchu").css("display","inline-block");
                         $("#configHyperLink_shujuguolv").css("display","inline-block");
                         //展示图标, 并初始化echarts相关内容
                         $("#echarts_show_icon").css("display","inline-block");
                         reportEcharts.initEchartsFields(report_id);
                    };
             };
      },
   	orShow: function() {
   		$("#download_div").css('display', 'block');
   	},
   	orHidden: function() {
   		$("#download_div").css('display', 'none');
   	},
   	queryReportFieldColor: function() {
   		var data = {
   			"report_id": val[0].reportCheckInfo.report_id
   		};
   		var dataStr = JSON.stringify(data);
   		var res = commonAjax(configUrl_main.srpt_rcpt_queryReportFieldColor, dataStr, "", "");
   		//var res = commonAjax("/srpt/rcpt/queryReportFieldColor",dataStr,"",""); 
   		if (res.success) {
   			return res.data; //[{"id":"20160603145441","name":"他","type":"1","strategy":"[{\"min\":\"\",\"color\":\"FFFFFF\",\"max\":\"\"}]","field":"EGCI"},{"id":"20160603145418","name":"全国通取","type":"1","strategy":"[{\"min\":\"\",\"color\":\"FFFFFF\",\"max\":\"\"}]","field":"行政区域"}]
   		} else {
   			alert("获取颜色数据失败!");
   		};
   	},
   	/*queryReportLieWidth : function(){
   	                  var data = {
   	                               "ifId":"srpt-cfg-reportInfo",
   	                               "report_id":val[0].reportCheckInfo.report_id,
   	                               "fields":"stamp"
   	                               };
   	                   var dataStr = JSON.stringify(data);
   	                   var res = commonAjax(configUrl_main.query_reportInfo,dataStr,"",""); 
   	                   //var res = commonAjax("/srpt/rcpt/common/query",dataStr,"",""); 
   	                   var stampStr = res.data.STAMP;
   	                   if (stampStr == null || stampStr == "null") {
   	                       return [];
   	                   };
   	                   //console.log("stampStr----"+stampStr);
   	                   var stampArr = eval('(' + stampStr + ')');
   	                   //console.log(stampArr);
   	                   return stampArr;
   	},*/
   	getReportResultData: function(flaga) {


   		if (fromWhere == "autoReportId") {
   			val = parent.autoReport.showQueryReportResultData();
   		};
   		if (fromWhere == "mainE") {
   			val = parent.mainE.showQueryReportResultData();
   		};
   		if (fromWhere == "myReport") {
   			val = parent.myReport.showQueryReportResultData();
   		};
   		if (fromWhere == "reportQuery") {
   			val = parent.reportQuery.showQueryReportResultData();
   		};

   		var data = val[0];
   		$("#Gridtitle").html(val[1]);
   		$("#echartsTitle").html(val[1]+"趋势图");
   		var columnsConfigs = [];
   		var columnsConfig = [];
   		if (data.data == null) {
   			$("#con_list").html("数据加载失败!");
   			return;
   		};

   		var columnsName = data.data.headMetas;
   		initHeadMetas = columnsName;


         filter_data_database = val[0].filter_data; 
   		//init  index "field_info" data
   		if (flaga == "init") {
   			if (data.field_info == null || data.field_info == "null") {
   				reportQueryResult.initField_info();
   			} else {
   				field_info_all = val[0].field_info;
   			};
   		} else {
   			$("#con_grid_div").html("");
   			var htmlStr = '<table id="con_grid_div_grid"></table>' +
   				'<div id="con_grid_div_gridPager"></div>';
   			$("#con_grid_div").html(htmlStr);
   		};

   		var sorted_field_info_all = reportQueryResult.sortsObject(field_info_all);

   		var columnsNameNew = [];
   		for (var i = 0; i < sorted_field_info_all.length; i++) {
   			columnsNameNew.push(sorted_field_info_all[i].fieldname);
   		};
   		currHeadMetas = columnsNameNew;
   		//是否着色---------------------------------------------------

   		var curryReportAddRuleArr = reportQueryResult.queryReportFieldColor();
   		//var curryReportAddLieWidthArr = reportQueryResult.queryReportLieWidth();

   		if (curryReportAddRuleArr.length == 0) {
   			//不着色
   			for (var i = 0; i < sorted_field_info_all.length; i++) {
   				var currObject = sorted_field_info_all[i];
   				sortName = columnsName[0].fieldname;
   				if (currObject.fieldname == "地市") {
   					var obj = {
   						name: '',
   						index: '',
   						width: 80,
   						align: "center"
   					};
                  if (currObject.isDrill == "1") {
                     obj.formatter = function(cellVal, options, rowObjs) {
                             return '<span style="color:blue;text-decoration:underline;cursor:pointer" onclick=\'reportQueryResult.drillEventDeal('+ JSON.stringify(options) +','+ JSON.stringify(rowObjs) + ')\'>'+cellVal+'</span>'   
                     }
                  };
   					obj.name = currObject.fieldname;
   					obj.index = currObject.fieldname;
   					if (currObject.linewidth != 0) {
   						obj.width = currObject.linewidth;
   					} else {
   						var wid = reportQueryResult.strlen(currObject.fieldname);
   						if (wid * 9 < 100) {
   							obj.width = 100;
   						} else {
   							obj.width = wid * 9;
   						};
   					};
   					if (currObject.isshow == "false") {
   						obj.hidden = true;
   					};
   					columnsConfig.push(obj);
   				} else if (currObject.fieldname == "省") {
   					var obj = {
   						name: '',
   						index: '',
   						width: 80,
   						align: "center"
   					};
                  if (currObject.isDrill == "1") {
                     obj.formatter = function(cellVal, options, rowObjs) {
                             return '<span style="color:blue;text-decoration:underline;cursor:pointer" onclick=\'reportQueryResult.drillEventDeal('+ JSON.stringify(options) +','+ JSON.stringify(rowObjs) + ')\'>'+cellVal+'</span>'   
                     }
                  };
   					obj.name = currObject.fieldname;
   					obj.index = currObject.fieldname;
   					if (currObject.linewidth != 0) {
   						obj.width = currObject.linewidth;
   					} else {
   						var wid = reportQueryResult.strlen(currObject.fieldname);
   						if (wid * 9 < 100) {
   							obj.width = 100;
   						} else {
   							obj.width = wid * 9;
   						};
   					};
   					if (currObject.isshow == "false") {
   						obj.hidden = true;
   					};
   					columnsConfig.push(obj);
   				} else {
   					var obj = {
   						name: '',
   						index: '',
   						width: 130,
   						align: "center",
   					};
                  if (currObject.isDrill == "1") {
                     obj.formatter = function(cellVal, options, rowObjs) {''
                             //return "<span style='color:blue;text-decoration:underline;cursor:pointer' onclick='reportQueryResult.drillEventDeal("+ JSON.stringify(options) +","+ JSON.stringify(rowObjs) +")'>"+cellVal+"</span>" 
                             return '<span style="color:blue;text-decoration:underline;cursor:pointer" onclick=\'reportQueryResult.drillEventDeal('+ JSON.stringify(options) +','+ JSON.stringify(rowObjs) + ')\'>'+cellVal+'</span>' 
                     }
                  };
   					obj.name = currObject.fieldname;
   					obj.index = currObject.fieldname;
   					if (currObject.linewidth != 0) {
   						obj.width = currObject.linewidth;
   					} else {
   						var wid = reportQueryResult.strlen(currObject.fieldname);
   						if (wid * 9 < 100) {
   							obj.width = 100;
   						} else {
   							obj.width = wid * 9;
   						};
   					};
   					if (currObject.isshow == "false") {
   						obj.hidden = true;
   					};
   					columnsConfig.push(obj);
   				};
   			};
   		} else {
   			//[{"id":"20160603145441","name":"着色名称","type":"1","strategy":"[{\"min\":\"\",\"color\":\"FFFFFF\",\"max\":\"\"}]","field":"字段名"}]
   			//着色 
   			var columnsNameItem = "";
   			for (var i = 0; i < columnsNameNew.length; i++) {
   				columnsNameItem = columnsNameNew[i];
   				sortName = columnsNameNew[0];
   				var currObject = sorted_field_info_all[i];
   				var currName = columnsNameNew[i];
   				var mm_z = 0; //判断非着色字段只加载一次
   				for (var j = 0; j < curryReportAddRuleArr.length; j++) {
   					var item = curryReportAddRuleArr[j];

   					//-----------------------------------------------
   					for (var k = 0; k < curryReportAddRuleArr.length; k++) {
   						if (currName == curryReportAddRuleArr[k].field) {
   							mm_z++;
   						};
   					};

   					//---------------------------------------

   					if (currName == item.field) { //判断着色字段

   						if (item.type == 1) { //区间着色
   							var obj = {
   								name: columnsNameNew[i],
   								index: columnsNameNew[i],
   								width: 120,
   								align: "center",
   								formatter: function(cellVal, options, rowObjs) {
   									//return  "<a href='javascript:openWin(\""+cellVal+"\")'><span style='color:red'>"+cellVal+"</span></a>" 
   									var color = "";
   									//var strategy_str = item.strategy;
   									//获取当前字段的名称-----------------------------------------
   									var strategy_str = "";
   									var colName = options.colModel.name;
   									for (var k = 0; k < curryReportAddRuleArr.length; k++) {
   										if (curryReportAddRuleArr[k].field == colName) {
   											strategy_str = curryReportAddRuleArr[k].strategy;
   											break;
   										};
   									};
   									//----------------------------------------------
   									if (strategy_str == "") {
   										return "<span>" + cellVal + "</span>"
   									} else {
   										var strategyArr = $.parseJSON(strategy_str);
   										for (var k = 0; k < strategyArr.length; k++) {
   											var item_str = strategyArr[k];
   											var item_obj = item_str;
   											//var item_obj = $.parseJSON(item_str);
   											var min = item_obj.min;
   											var max = item_obj.max;
   											if (k == 0) {
   												if (max == "" || max == null || max == "null") {
   													if (min < cellVal || cellVal == min) {
   														color = item_obj.color;
   													};
   												} else {
   													if ((min < cellVal && cellVal < max) || cellVal == min) {
   														color = item_obj.color;
   													};
   												};

   											} else if (k == strategyArr.length - 1) {
   												if (min == "" || min == null || min == "null") {
   													if (cellVal < max) {
   														color = item_obj.color;
   													};
   												} else if (max == "" || max == null || max == "null") {
                                          if (cellVal > min) {
                                             color = item_obj.color;
                                          };
                                       } else {
   													if ((min < cellVal && cellVal < max) || cellVal == min) {
   														color = item_obj.color;
   													};
   												};
   											} else {
   												if ((min < cellVal && cellVal < max) || cellVal == min) {
   													color = item_obj.color;
   												};
   											};
   										};

   										return "<span style='width:100%;display:inline-block;background-color:#" + color + "'>" + cellVal + "</span>"
   									};
   								}
   							};
   							if (currObject.linewidth != 0) {
   								obj.width = currObject.linewidth;
   							} else {
   								var wid = reportQueryResult.strlen(currObject.fieldname);
   								if (wid * 9 < 100) {
   									obj.width = 100;
   								} else {
   									obj.width = wid * 9;
   								};
   							};
   							if (currObject.isshow == "false") {
   								obj.hidden = true;
   							};
   							columnsConfig.push(obj);
   						};
   						if (item.type == 0) { //枚举着色
   							/* [{"id": "20160606152641","name": "属地分公司","type": "0","strategy": [{"feilName": "普陀区","color": "FF1D10","check": false },],*/
   							var obj = {
   								name: columnsNameNew[i],
   								index: columnsNameNew[i],
   								width: 120,
   								align: "center",
   								formatter: function(cellVal, options, rowObjs) {
   									var cellVal = cellVal.toString();

   									var strategy_str = "";
   									var colName = options.colModel.name;
   									for (var k = 0; k < curryReportAddRuleArr.length; k++) {
   										if (curryReportAddRuleArr[k].field == colName) {
   											strategy_str = curryReportAddRuleArr[k].strategy;
   											break;
   										};
   									};

   									var strategyArr = $.parseJSON(strategy_str);
   									var retur = "";
   									for (var k = 0; k < strategyArr.length; k++) {
   										var item_str = strategyArr[k];
   										//var item_obj = $.parseJSON(item_str);
   										var item_obj = item_str;
   										var color = item_obj.color;
   										var feilName = item_obj.feilName;


   										if (feilName == cellVal) {
   											retur = "<span style='width:100%;display:inline-block;background-color:#" + color + "'>" + cellVal + "</span>";
   											break;
   										} else {
   											if (item_obj.check == true) {
   												if (cellVal.indexOf(feilName) != -1) {
   													var length_s = feilName.length;
   													var length_B = cellVal.length;
   													var index = cellVal.indexOf(feilName);
   													retur = "<span style='width:100%;display:inline-block;background-color:#" + color + "'>" + cellVal + "</span>"
   													//retur = "<span>"+cellVal.substring(0,index)+"</span><span style='color:#"+color+"'>"+cellVal.substring(index,index+length_s)+"</span><span>"+cellVal.substring(index+length_s,length_B)+"</span>"
   													break;
   												} else {
   													retur = "<span>" + cellVal + "</span>";
   												}
   											} else {
   												retur = "<span>" + cellVal + "</span>";
   											};

   										};
   									};
   									return retur;

   								}
   							};
   							if (currObject.linewidth != 0) {
   								obj.width = currObject.linewidth;
   							} else {
   								var wid = reportQueryResult.strlen(currObject.fieldname);
   								if (wid * 9 < 100) {
   									obj.width = 100;
   								} else {
   									obj.width = wid * 9;
   								};
   							};
   							if (currObject.isshow == "false") {
   								obj.hidden = true;
   							};
   							columnsConfig.push(obj);
   						};
   					} else {
   						if (mm_z == 0) {
   							var obj = {
   								name: '',
   								index: '',
   								width: 140,
   								align: "center"
   							};
                        if (currObject.isDrill == "1") {
                           obj.formatter = function(cellVal, options, rowObjs) {
                                   return '<span style="color:blue;text-decoration:underline;cursor:pointer" onclick=\'reportQueryResult.drillEventDeal('+ JSON.stringify(options) +','+ JSON.stringify(rowObjs) + ')\'>'+cellVal+'</span>'   
                           }
                        };
   							obj.name = columnsNameNew[i];
   							obj.index = columnsNameNew[i];
   							if (currObject.linewidth != 0) {
   								obj.width = currObject.linewidth;
   							} else {
   								var wid = reportQueryResult.strlen(currObject.fieldname);
   								if (wid * 9 < 100) {
   									obj.width = 100;
   								} else {
   									obj.width = wid * 9;
   								};
   							};
   							if (currObject.isshow == "false") {
   								obj.hidden = true;
   							};
   							columnsConfig.push(obj);
   							mm_z++;
   						};
   					};
   				};

   			};

   		};
   		//---------------------------------------------------------------------
   		//旧算法, 浙江和上海差了1px
         /*if (flag2017216143611 == "true") {
          height = height-2;
//          console.log("减了");
         }else{
            height = height-1;
         };*/
//         console.log("表格高度:"+height);
         $("#whiteDiv").height(height - 15);
   		//初始化表格
   		$("#con_grid_div_grid").jqGrid({
   			height: height,
   			rowNum: rowNum,
   			datatype: "local",
   			colNames: columnsNameNew,
   			shrinkToFit: false,
   			autoScroll: true,
   			rowList: [rowNum, 50, 100, 1000],
   			rownumbers: false,
            //scrollOffset:10,
   			pgbuttons: true,
   			sortname: sortName,
   			sortorder: "desc",
   			colModel: columnsConfig,
   			pager: "#con_grid_div_gridPager",
   			pgtext: "{0}共{1}页",
   			beforeRequest: function(){
   				startTime = new Date().getTime();
   			},
   			gridComplete: function(){
   				//计算接口请求耗时
   				var endTime = new Date().getTime();
   				var useTime = (endTime - startTime) / 1000;
   				var pager_right_text = $("#con_grid_div_gridPager_right > div").text();
   				$("#con_grid_div_gridPager_right > div").text(pager_right_text+" (用时"+useTime+"s)");
   				
   				//判断表格滚动条上的  白条条 是否显示
   				var rowNumNow = $("#con_grid_div_grid").jqGrid("getGridParam", "rowNum"),
   					rowList = $("#con_grid_div_grid").jqGrid("getGridParam", "rowList");
   				if(rowNumNow == rowList[0]){
   					$("#whiteDiv").show();
   				}else{
   					$("#whiteDiv").hide();
   				}
   			}
   		});

   		var postJson = data.reportCheckInfo;
   		if (parent.mainE) {
   			var info_sql_value = parent.mainE.previewReportToData();
   			if (info_sql_value.length > 0) {
   				postJson.logic_sql_info = info_sql_value[1];
   				parent.mainE.clearPreviewReportToData(); //用完之后将参数清空
   			};
   		};
         //添加数据过滤条件  dataFilter
         if (flaga == "dataFilter") {
                 postJson.filter_data = filterCondition;
                 //postJson.dataFilter = filterCondition;
         }; 
         //添加用户名
         //防止单点登录获取不到用户名-------------------------------------------------------------
                 var userInfo = "";
                var userinfoDiv=$(window.top.document.getElementById('userinfo'));
                userInfo =  userinfoDiv.find('div[id = "tab_1_1"]').find('div').eq(1).find('div').eq(1).html();
                if (userInfo == null) {
                    userInfo = $.cookie("inas_portallogin_user_username");
                }else{
                    var re1 = new RegExp("\n", "g");
                    userInfo = userInfo.replace(re1, ""); 
                    userInfo = userInfo.trim(); 
                };
         //---------------------------------------------------------  
         postJson.conditions.username = userInfo;     
         globalVariablePostJson = postJson;
   		$("#con_grid_div_grid").jqGrid("setGridParam", {
   			url: eastcom.baseURL + configUrl_main.srpt_rcpt_checkOrQueryReportAuto,
   			//url : eastcom.baseURL+"/srpt/rcpt/checkOrQueryReportAuto", 
   			datatype: "json",
   			mtype: 'POST',
   			jsonReader: {
   				root: "data.elements",
   				records: "data.total",
   				total: "data.pageNum",
   				page: "data.pageNo"
   			},
   			postData: {
   				params: JSON.stringify(postJson)
   			},
   			page: 1
   		}).trigger("reloadGrid");




   	},
   	exportExcel: function(type) {
   		var totalCount = 0;
   		var str = $(".ui-paging-info").html();
   		if (str.indexOf("-") > 0) {
   			var totals = str.substring(str.indexOf("共") + 1, str.indexOf("条"));
   			var totalCount = totals.trim();
   			totalCount.replace(/-/g, "/")
   			var reg = new RegExp(" ", "g");
   			totalCount = totalCount.replace(reg, "");

   		};


   		var action = "";
   		/*if(totalCount < 50000){
   		     action = eastcom.baseURL + '/srpt/rcpt/exportAll';
   		}else{
   		     action = eastcom.baseURL + '/srpt/rcpt/exportBatch?totalCount='+totalCount;
   		};*/
   		if (type == "xls") {
   			action = eastcom.baseURL + configUrl_main.srpt_rcpt_exportAll;
   			//action = eastcom.baseURL + '/srpt/rcpt/exportAll';
   		} else {
   			action = eastcom.baseURL + configUrl_main.srpt_rcpt_exportBatch_totalCount + totalCount;
   			//action = eastcom.baseURL + '/srpt/rcpt/exportBatch?totalCount='+totalCount;
   		};

   		ToExcelOrCSVPage({
   			myGrid: $("#con_grid_div_grid").jqGrid("getGridParam"),
   			action: action,
   			title: val[1],
   			isThereCheckBox: false, //第一列是否有选择框或序号，是否导出第一列
   			isHidden: false, //是否导出隐藏列，true 导出
   			isComplexHeader: true //是否多级表头，暂支持两级表头
   		});
   	},
   	addColor: function() {
   		$("#addColor").modal("toggle");
   		var htmlStr = "";
   		for (var i = 0; i < currHeadMetas.length; i++) {
   			htmlStr += '<div style="height:40px">' +
   				'<a href="javascript:void(0)" style="height: 34px;padding-top: 7px;display:inline-block;" title="' + currHeadMetas[i] + '">' +
   				'<span id="name_' + i + '" style="display:inline-block; border:0px solid #e8e8e8;width:100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + currHeadMetas[i] + ':</span>' +
   				'</a>' +
   				'<span style="margin-left:10px">' +
   				'<select id="type_' + i + '" style="width:160px" onchange="reportQueryResult.changeClear(this.id)">' +
   				'<option value="1">区间</option>' +
   				'<option value="0">枚举</option>' +
   				'</select>' +
   				'</span>' +
   				'<span style="display:inline-block;border: 1px solid #e8e8e8;border-radius: 4px;height: 37px;width: 255px;margin-left:20px">'
   				//---------------------------------------------
   				//+     '<span style="display:block;border: 1px solid #e8e8e8;border-radius: 4px;height: 37px;width: 300px;margin:0 0 10px 0 ">'
   				//+       '<input placeholder="模板名称...." id="demoName_mohu" style="width: 260px;border: none;height: 34px;padding: 2px 5px" onkeypress="if(event.keyCode==13){colorDemo.demoQuery();}"/>'
   				//+       '<img style="cursor: pointer;" height="30px" width="30px" src="../../static/reportManageSys/images/fangdajing.png" onclick="colorDemo.demoQuery()">'
   				//+     '</span>'
   				//---------------------------------------------
   				+
   				'<input id="colorDemo_' + i + '" values="" style="width:87%;height:34px;cursor: pointer;border-radius:4px;padding-left: 5px;border:0px solid #a9a9a9;" placeholder="点击选取着色模板...." readonly="readonly" onclick="reportQueryResult.addColorDemo(\'type_' + i + '\',\'' + i + '\')"/>' +
   				'<img id="img_' + i + '" style="cursor: pointer;display:none" height="25px" width="24px" src="../../static/reportManageSys/images/closehong.png" onclick="reportQueryResult.clickClear(\'' + i + '\')">' +
   				'</span>' +
   				'</div>'
   		};

   		$("#content").html(htmlStr);
   		reportQueryResult.huanyuanFieldColor();
   	},
   	changeClear: function(id) {
   		var id_num = id.substring(5, 6);
   		$("#colorDemo_" + id_num).attr('values', '');
   		$("#colorDemo_" + id_num).attr('value', '');
   	},
   	clickClear: function(id) {
   		//var id_num = id.substring(5,6);
   		$("#colorDemo_" + id).attr('values', '');
   		$("#colorDemo_" + id).attr('value', '');
   		$("#img_" + id).css('display', 'none');
   	},
   	huanyuanFieldColor: function() {
   		var curryReportAddRule = reportQueryResult.queryReportFieldColor();
   		//[{"id":"20160603145441","name":"他","type":"1","strategy":"[{\"min\":\"\",\"color\":\"FFFFFF\",\"max\":\"\"}]","field":"EGCI"}]
   		$("#content").find('div').each(function(index, el) {
   			var text = $(this).find('span').eq(0).text();
   			var id = $(this).find('span').eq(0).attr('id');
   			var id_num = id.substring(5, 6);
   			for (var i = 0; i < curryReportAddRule.length; i++) {
   				var item = curryReportAddRule[i];
   				if (text.indexOf(item.field) >= 0) {
   					$("#type_" + id_num).find("option[value='" + item.type + "']").attr("selected", true);
   					$("#colorDemo_" + id_num).attr('values', item.id);
   					$("#colorDemo_" + id_num).attr('value', item.name);
   					$("#img_" + id_num).css('display', 'inline-block');
   				};
   			};
   		});
   	},
   	addColors: function() {
   		//获取页面值
   		var field_color = {};
   		var _key = "";
   		var _value = "";
   		$("#content").find('div').each(function(index, el) {
   			$(this).find('span').each(function(index_n, el_n) {
   				switch (index_n) {
   					case 0:
   						_key = $(this).text();
   						break;
   					case 1:
   						break;
   					case 2:
   						_value = $(this).find('input').eq(0).attr('values');
   						if (_value == "") {
   							_key = "";
   						} else {
   							_key = _key.substring(0, _key.length - 1);
   							field_color[_key] = _value;
   							_key = ""; //用完值清空
   							_value = "";
   						};
   						break;
   				};
   			});
   		});

   		var id = val[0].reportCheckInfo.report_id;
   		var data = {
   			"dbId": "srpt",
   			"tableName": configUrl_main.dm_co_ba_srpt_report_tableName,
   			//"tableName":"dm_co_ba_srpt_report",
   			"type": "update",
   			"conditions": ["report_id"],
   			"data": {
   				"report_id": id,
   				//"algo_instru":"算法说明",
   				//"field_href":"字段超链接配置",
   				"field_color": JSON.stringify(field_color),
   			}
   		};
   		var dataStr = JSON.stringify(data);
   		var res = commonAjax(configUrl_main.update_update, dataStr, "", "");
   		//var res = commonAjax("/srpt/rcpt/common/update",dataStr,"","");  
   		//{"resultCode":0,"msg":"SUCCESS_NO_INFO","size":[-2]}
   		if (res.resultCode == 0 || res.msg == "success") {
   			alert("保存成功!");
   		} else {
   			alert("保存失败!");
   		};

   		$("#addColor").modal("hide");
   	},
   	addColorDemo: function(val, index) {
   		select_id = "";
   		index_addColor = index;
   		addDemoType = $("#" + val).val();
   		$("#addColorDemo").modal("toggle");

   		$("#con_grid_div_d").html("");
   		var htmelStr = '<table id="con_grid_div_grid_d"></table>' +
   			'<div id="con_grid_div_gridPager_d"></div>';
   		$("#con_grid_div_d").html(htmelStr);


   		var columnsName = ['', '模板名称', '模板类型', '详细信息'];
   		var columnsConfig = [{
   			name: 'id',
   			index: 'id',
   			width: 0.1,
   			align: "center"
   		}, {
   			name: 'name',
   			index: 'name',
   			width: 50,
   			align: "center"
   		}, {
   			name: 'type',
   			index: 'type',
   			width: 25,
   			align: "center",
   			formatter: function(cellVal, options, rowObjs) {
   				switch (cellVal) {
   					case '0':
   						return "枚举";
   						break;
   					case '1':
   						return "区间";
   						break;
   				};
   			}
   		}, {
   			name: 'strategy',
   			index: 'strategy',
   			width: 80,
   			align: "center"
   		}];
   		//初始化表格
   		jQuery("#con_grid_div_grid_d").jqGrid("clearGridData");
   		$("#con_grid_div_grid_d").jqGrid({
   			height: 150,
   			//rowNum : rowNum,
   			datatype: "local",
   			colNames: columnsName,
   			shrinkToFit: false,
   			autoScroll: true,
            scrollOffset:1,
   			rownumbers: false,
   			rownumWidth: 40,
   			pgbuttons: true,
   			colModel: columnsConfig,
   			onSelectRow: function(rowid, status) {
   				select_id = rowid;
   			},
   			ondblClickRow: function(rowid, iRow, iCol, e) {
   				select_id = rowid;
   				reportQueryResult.addColorDemoDetail();
   			}
   		});

   		//加载数据  
   		jQuery("#con_grid_div_grid_d").jqGrid("clearGridData"); //清除表格之前的数据
   		var data = {
   			"ifId": "srpt-enum-colorCfg",
   			"type": addDemoType
   		};
   		var dataStr = JSON.stringify(data);
   		var res = commonAjax(configUrl_main.query_colorCfg, dataStr, "", "");
   		//var res = commonAjax("/srpt/rcpt/common/query",dataStr,"","");
   		var dataObj = res.data;
   		var resultArr = [];
   		for (var item in dataObj) {
   			resultArr.push(dataObj[item]);
   		};
   		for (var i = 0; i < resultArr.length; i++) {
   			jQuery("#con_grid_div_grid_d").jqGrid('addRowData', i + 1, resultArr[i]);
   		};
   	},
   	demoQuery: function() {
   		jQuery("#con_grid_div_grid_d").jqGrid("clearGridData"); //清除表格之前的数据
   		var demoName_mohu = $("#demoName_mohu").val();
   		var type = addDemoType;
   		//加载数据  
   		var data = {
   			"ifId": "srpt-enum-colorCfg",
   			"name": demoName_mohu,
   			"type": type
   		};
   		var dataStr = JSON.stringify(data);
   		var res = commonAjax(configUrl_main.query_colorCfg, dataStr, "", "");
   		//var res = commonAjax("/srpt/rcpt/common/query",dataStr,"","");
   		var dataObj = res.data;
   		var resultArr = [];
   		for (var item in dataObj) {
   			resultArr.push(dataObj[item]);
   		};
   		for (var i = 0; i < resultArr.length; i++) {
   			jQuery("#con_grid_div_grid_d").jqGrid('addRowData', i + 1, resultArr[i]);
   		};

   	},
   	addColorDemos: function() {
   		if (select_id == "") {
   			alert("请选择模板!");
   			return;
   		};
   		var index = index_addColor
   		var id = $("#con_grid_div_grid_d").find("#" + select_id).eq(0).find('td[aria-describedby="con_grid_div_grid_d_id"]').html();
   		var name = $("#con_grid_div_grid_d").find("#" + select_id).eq(0).find('td[aria-describedby="con_grid_div_grid_d_name"]').html();

   		$("#colorDemo_" + index).val(name);
   		$("#colorDemo_" + index).attr('values', id);
   		$("#img_" + index).css('display', 'inline-block');
   		$("#addColorDemo").modal("hide");


   	},
   	addColorDemoDetail: function() {
   		//var id = $("#"+select_id).find('td[aria-describedby="con_grid_div_grid_d_id"]').html();
   		var id = $("#con_grid_div_grid_d").find("#" + select_id).eq(0).find('td[aria-describedby="con_grid_div_grid_d_id"]').html();
   		var name = $("#con_grid_div_grid_d").find("#" + select_id).eq(0).find('td[aria-describedby="con_grid_div_grid_d_name"]').html();
   		var type = $("#con_grid_div_grid_d").find("#" + select_id).eq(0).find('td[aria-describedby="con_grid_div_grid_d_type"]').html();
   		var strategy = $("#con_grid_div_grid_d").find("#" + select_id).eq(0).find('td[aria-describedby="con_grid_div_grid_d_strategy"]').html();
   		switch (type) {
   			case "区间":
   				reportQueryResult.addColorDemoDetail_qujian(id, name, type, strategy);
   				break;
   			case "枚举":
   				reportQueryResult.addColorDemoDetail_meiju(id, name, type, strategy);
   				break;

   		};
   	},
   	addColorDemoDetail_qujian: function(id, name, type, strategy) {
   		$("#addColorDemoDetail_qujian").modal("toggle");
   		//清空操作-------------------------------------------
   		$("#addDiv_qujian").find('div').each(function(index, el) {
   			if (index != 0) {
   				$(this).css('display', 'none').attr('sf', '0');
   			};
   			$(this).find('input[type="text"]').each(function(index_n, el_n) {
   				switch (index_n) {
   					case 0:
   						$(this).val("");
   						break;
   					case 1:
   						$(this).val("");
   						break;
   					case 2:
   						$(this).val("FFFFFF");
   						$(this).css('background-color', '#FFFFFF');
   						break;
   				};
   			});
   		});
   		//-------------------------------------------

   		$("#colorDemoId_qujian").val(name);
   		var strategyArr = $.parseJSON(strategy);
   		for (var i = 0; i < strategyArr.length; i++) {
   			if (i == 0) {
   				$("#addDiv_qujian").find('div[sf ="1"]').first().find('input[type = "text"]').each(function(index, el) {
   					switch (index) {
   						case 0:
   							$(this).val(strategyArr[i].min);
   							break;
   						case 1:
   							$(this).val(strategyArr[i].max);
   							break;
   						case 2:
   							$(this).val(strategyArr[i].color);
   							$(this).css('background-color', '#' + strategyArr[i].color);
   							break;
   					};
   				});
   			} else {
   				$("#addDiv_qujian").find('div[sf ="1"]').last().next('div').css('display', 'block').attr('sf', '1').find('input[type = "text"]').each(function(index, el) {
   					switch (index) {
   						case 0:
   							$(this).val(strategyArr[i].min);
   							break;
   						case 1:
   							$(this).val(strategyArr[i].max);
   							break;
   						case 2:
   							$(this).val(strategyArr[i].color);
   							$(this).css('background-color', '#' + strategyArr[i].color);
   							break;
   					};
   				});
   			};

   		};
   	},
   	addColorDemoDetail_meiju: function(id, name, type, strategy) {
   		$("#addColorDemoDetail_meiju").modal("toggle");
   		//清空操作----------------------------------------
   		$("#addDiv_meiju").find('div').each(function(index, el) {
   			if (index != 0) {
   				$(this).css('display', 'none').attr('sf', '0');
   			};
   			$(this).find('input[type="text"]').each(function(index_n, el_n) {
   				/*$(el_n).val("");*/
   				switch (index_n) {
   					case 0:
   						$(this).val("");
   						break;
   					case 1:
   						$(this).val("FFFFFF");
   						$(this).css('background-color', '#FFFFFF');
   						break;
   				};
   			});
   			$(this).find('input[type="checkbox"]').each(function(index_n, el_n) {
   				$(el_n).prop('checked', false);
   			});
   		});
   		//----------------------------------------
   		$("#colorDemoId_meiju").val(name);
   		var strategyArr = $.parseJSON(strategy);
   		for (var i = 0; i < strategyArr.length; i++) {
   			if (i == 0) {
   				$("#addDiv_meiju").find('div[sf ="1"]').first().find('input').each(function(index, el) {
   					switch (index) {
   						case 0:
   							$(this).val(strategyArr[i].feilName);
   							break;
   						case 1:
   							$(this).prop('checked', strategyArr[i].check);
   							break;
   						case 2:
   							$(this).val(strategyArr[i].color);
   							$(this).css('background-color', '#' + strategyArr[i].color);
   							break;
   					};
   				});
   			} else {
   				$("#addDiv_meiju").find('div[sf ="1"]').last().next('div').css('display', 'block').attr('sf', '1').find('input').each(function(index, el) {
   					switch (index) {
   						case 0:
   							$(this).val(strategyArr[i].feilName);
   							break;
   						case 1:
   							$(this).prop('checked', strategyArr[i].check);
   							break;
   						case 2:
   							$(this).val(strategyArr[i].color);
   							$(this).css('background-color', '#' + strategyArr[i].color);
   							break;
   					};
   				});
   			};

   		};
   	},
   	saveColumnWidth: function() {

   		//con_grid_div_grid_记录时间
   		/* var w = $("#con_grid_div_grid_记录时间").css('width');
   		 var w1 = $("#con_grid_div_grid_用时").css('width');
   		 var w2 = $("#con_grid_div_grid_用时(ms)").css('width');
   		 */

   		/*var data = val[0];
   		var  columnsName = data.data.headMetas;  //[]
   		 for(var i=0;i<columnsName.length;i++){

   		        alert(columnsName[i]+"的宽:"+$("#con_grid_div_grid_"+columnsName[i]).css("width"));
   		 };*/

   		$("#con_grid_div").find('th[role = "columnheader"]').each(function(index, el) {
   			var idStr = $(this).attr('id');
   			var idzhen = idStr.replace("con_grid_div_grid_", "");
   			var w = $(this).css('width');
   			var widths = parseInt(w);
   			for (var i = 0; i < field_info_all.length; i++) {
   				var currI = field_info_all[i];
   				if (idzhen == currI.fieldname) {
   					currI.linewidth = widths;
   				};
   			};
   		});
   		//console.log(widthArr);
   		var id = val[0].reportCheckInfo.report_id;
   		var data = {
   			"dbId": "srpt",
   			"tableName": configUrl_main.dm_co_ba_srpt_report_tableName,
   			//"tableName":"dm_co_ba_srpt_report",
   			"type": "update",
   			"conditions": ["report_id"],
   			"data": {
   				"report_id": id,
   				"field_info": JSON.stringify(field_info_all),
   			}
   		};
   		var dataStr = JSON.stringify(data);
   		var res = commonAjax(configUrl_main.update_update, dataStr, "", "");
   		//var res = commonAjax("/srpt/rcpt/common/update",dataStr,"",""); 
   		if (res.success) {
   			eastcom.showMsg("success", "列宽保存成功!");
   			setTimeout('$("#msg-cnt").empty()', 3000);
   		} else {
   			eastcom.showMsg("danger", "列宽保存失败!");
   			setTimeout('$("#msg-cnt").empty()', 3000);
   		};
   	},
   	seekFieldArith: function() {
         $("#fieldArith").modal("toggle");
   		$("#fieldArith").css("top","0px");

   		var id = val[0].reportCheckInfo.report_id;
   		//加载描述
   		var data = {
   			"ifId": "srpt-cfg-reportInfo",
   			"report_id": id
   		};
   		var dataStr = JSON.stringify(data);
   		var res = commonAjax(configUrl_main.query_reportInfo, dataStr, "", "");
   		//var res = commonAjax("/srpt/rcpt/common/query",dataStr,"","");
   		if (res.data == null || res.data == "null") {
   			return;
   		};
   		var algo_instru = res.data.algo_instru;
   		$("#algo_instru").html(algo_instru);


   		$("#con_grid_div_e").html("");
   		var htmelStr = '<table id="con_grid_div_grid_e"></table>' +
   			'<div id="con_grid_div_gridPager_e"></div>';
   		$("#con_grid_div_e").html(htmelStr);

   		//加载字段说明表格
   		var columnsName_field = ['字段名', '算法', '说明'];
   		var columnsConfig_field = [{
   			name: 'NAME',
   			index: 'NAME',
   			width: 1,
   			align: "center"
   		}, {
   			name: 'DESCR_',
   			index: 'DESCR_',
   			width: 1,
   			align: "center",
   			formatter: function(cellVal, options, rowObjs) {
   				return cellVal == null ? "--" : cellVal;
   			}
   		}, {
   			name: 'STRATEGY',
   			index: 'STRATEGY',
   			width: 1,
   			align: "center",
   			formatter: function(cellVal, options, rowObjs) {
   				var ces = cellVal;
   				if (typeof(cellVal) != "string") {
   					ces = JSON.stringify(cellVal);
   				};

   				return ces.indexOf("[]") != -1 ? "--" : ces
   			}
   		}];
   		//初始化表格
   		$("#con_grid_div_grid_e").jqGrid("clearGridData");
   		$("#con_grid_div_grid_e").jqGrid({
   			height: 150,
   			rowNum: 1000000,
   			datatype: "local",
   			colNames: columnsName_field,
   			colModel: columnsConfig_field,
   			shrinkToFit: true,
   			autoScroll: true
            //scrollOffset:1
   			//rownumbers:true,
   			//rownumWidth:80,
   			//pgbuttons: true,
   			//pager: "#con_grid_div_gridPager_e",
   			//pgtext: "{0}共{1}页",

   		});


   		var data = {
   			"id": id,
   			"type": "3"
   		};
   		var dataStr = JSON.stringify(data);
   		var res = commonAjax(configUrl_main.srpt_rcpt_getColumnDesc, dataStr, "", "");
   		//var res = commonAjax("/srpt/rcpt/getColumnDesc",dataStr,"",""); 
   		var data = res.data;

   		var mydata = [];

   		for (var i = 0; i < data.length; i++) {
   			var obj = {};
   			obj.NAME = data[i].columnCN;
   			obj.DESCR_ = data[i].descr;
   			obj.STRATEGY = data[i].strategy;
   			mydata.push(obj);
   		};


   		for (var i = 0; i <= mydata.length; i++) {
   			jQuery("#con_grid_div_grid_e").jqGrid('addRowData', i + 1, mydata[i]);
   		};
   		$("#con_grid_div_grid_e").trigger("reloadGrid");
   	},
   	showOrhideAndSort: function() {
   		$("#showOrhideAndSort").modal("toggle");
   		var field_info = field_info_all;
   		reportQueryResult.showOrhideAndSort_cell(field_info);
   	},
   	showOrhideAndSort_clear: function() {
   		var field_info = val[0].field_info;
   		reportQueryResult.showOrhideAndSort_cell(field_info);
   	},
   	showOrhideAndSort_cell: function(params) {
   		var field_info_self = params;
   		/*field_info = [{
   		             "sortflag":0,                      
   		             "fieldname":"开始时间0",         
   		             "isshow":"true"             
   		           }] */
   		var Arr_Object = reportQueryResult.sortsObject(field_info_self);
   		var htmlStr = "";
   		for (var i = 0; i < Arr_Object.length; i++) {
   			var item = Arr_Object[i];
   			htmlStr += '<tr>' +
   				'<td style="vertical-align: middle;">'
   			if (item.isshow == "true") {
   				htmlStr += '<input name="allchecked" id="check_' + item.fieldname + '" type="checkbox" checked="checked"/>';
   			} else {
   				htmlStr += '<input name="allchecked" id="check_' + item.fieldname + '" type="checkbox"/>';

   			};
   			htmlStr += '<span id="' + item.fieldname + '">' + item.fieldname + '</span>' +
   				'</td>' +
               '<td>' +
                   '<select>' + 
                        '<option value="varchar" '+(item.fieldType == "varchar" ? 'selected':'')+' >字符串类型</option>' +
                        '<option value="number" '+(item.fieldType == "number" ? 'selected':'')+' >数字类型</option>' +
                        '<option value="nocondition" '+(item.fieldType == "nocondition" ? 'selected':'')+' >不可作为条件</option>' +
                   '</select>' + 
                   '<span id="' + item.fieldname + '"></span>' +       
               '</td>' + 
   				'</tr>';
   		};
   		$("#content_table").html(htmlStr);
   		reportQueryResult.tableSort(); //let it have sort function
   	},
   	allchecked: function() {
   		var falg = $("#allcheck").prop("checked");
   		if (falg) {
   			$("input[name ='allchecked']").each(function(index, el) {
   				$(el).prop('checked', true);
   			});
   		} else {
   			$("input[name ='allchecked']").each(function(index, el) {
   				$(el).prop('checked', false);
   			});
   		};
   	},
   	showOrhideAndSorts: function() {
   		$("#content_table").find('tr').each(function(index, el) {
   			$(this).find('td').eq(0).each(function(index_n, el_n) {
   				var checked = $(el_n).find('input').eq(0).prop("checked");
   				var spanId = $(el_n).find('span').eq(0).attr('id');
   				for (var i = 0; i < field_info_all.length; i++) {
   					var itemCurr = field_info_all[i];
   					if (itemCurr.fieldname == spanId) {
   						itemCurr.sortflag = index;
   						itemCurr.isshow = JSON.stringify(checked);
   					};
   				};
   			});
            $(this).find('td').eq(1).each(function(index_n, el_n) {
               var spanId = $(el_n).find('span').eq(0).attr('id'); 
               var fieldType = $(el_n).find('select').eq(0).val();
               for (var i = 0; i < field_info_all.length; i++) {
                  var itemCurr = field_info_all[i];
                  if (itemCurr.fieldname == spanId) {
                      itemCurr.fieldType = fieldType;
                  };
               };
            });
   		});
   		reportQueryResult.showOrhideAndSorts_save();
   	},
   	showOrhideAndSorts_save: function() {
   		var id = val[0].reportCheckInfo.report_id;
   		var data = {
   			"dbId": "srpt",
   			"tableName": configUrl_main.dm_co_ba_srpt_report_tableName,
   			//"tableName":"dm_co_ba_srpt_report",
   			"type": "update",
   			"conditions": ["report_id"],
   			"data": {
   				"report_id": id,
   				"field_info": JSON.stringify(field_info_all),
   			}
   		};
   		var dataStr = JSON.stringify(data);
   		//调整数据库顺序和是否显示------------------
   		var res = commonAjax(configUrl_main.update_update, dataStr, "", "");
   		//var res = commonAjax("/srpt/rcpt/common/update",dataStr,"",""); 
   		if (res.msg == "SUCCESS_NO_INFO" || res.msg == "success") {
   			eastcom.showMsg("success", "保存成功!");
   			setTimeout('$("#msg-cnt").empty()', 3000);
   			$("#showOrhideAndSort").modal("hide");
   		} else {
   			eastcom.showMsg("danger", "保存失败!");
   			setTimeout('$("#msg-cnt").empty()', 3000);
   		};
   		reportQueryResult.getReportResultData();
   		//调整页面表格顺序和是否显示----------------------------
   		/* "sortflag":i,                      
   		 "fieldname":currHeadMetas[i],         
   		 "isshow":"true"  */
   		/*var indexNums=[];
                                  var showArr=[];
                                  var hideArr=[];
                                  for (var j = 0; j < field_info_all.length; j++) {
                                          $("#content_table").find('tr').each(function(index, el) {
                                                  $(this).find('td').eq(0).each(function(index_n, el_n) {
                                                          var spanId = $(el_n).find('span').eq(0).attr('id');
                                                          if (spanId == field_info_all[j].fieldname) {
                                                            indexNums.push(index);
                                                          }; 
                                                                
                                                  });
                                          });
                                  };
                                 
                                  for (var i = 0; i < field_info.length; i++) {
                                            if (field_info[i].isshow == "true" || field_info[i].isshow == true) {
                                                    showArr.push(field_info[i].fieldname);
                                            }else{
                                                    hideArr.push(field_info[i].fieldname); 
                                            };
                                  };
                                  $("#con_grid_div_grid").jqGrid("remapColumns",indexNums,true,false);
                                  $("#con_grid_div_grid").jqGrid("showCol",showArr);
                                  $("#con_grid_div_grid").jqGrid("hideCol",hideArr);*/

   	},
   	tableSort: function() {
   		var tbody = $('#example_table > tbody');
   		var rows = tbody.children();
   		var selectedRow;
   		//压下鼠标时选取行
   		rows.mousedown(function() {
   			selectedRow = this;
   			tbody.css('cursor', 'move');
   			//return false; //防止拖动时选取文本内容，必须和 mousemove 一起使用
   		});
   		rows.mousemove(function() {
   			return false; //防止拖动时选取文本内容，必须和 mousedown 一起使用
   		});
   		//释放鼠标键时进行插入
   		rows.mouseup(function() {
   			if (selectedRow) {
   				if (selectedRow != this) {
   					$(this).before($(selectedRow)).removeClass('mouseOver'); //插入                           
   				}
   				tbody.css('cursor', 'default');
   				selectedRow = null;
   			}
   		});
   		//标示当前鼠标所在位置
   		rows.hover(
   			function() {
   				if (selectedRow && selectedRow != this) {
   					$(this).addClass('mouseOver'); //区分大小写的，写成 'mouseover' 就不行           
   				}
   			},
   			function() {
   				if (selectedRow && selectedRow != this) {
   					$(this).removeClass('mouseOver');
   				}
   			}
   		);

   		//当用户压着鼠标键移出 tbody 时，清除 cursor 的拖动形状，以前当前选取的 selectedRow      
   		tbody.mouseover(function(event) {
   			event.stopPropagation(); //禁止 tbody 的事件传播到外层的 div 中
   		});
   		$('#contain').mouseover(function(event) {
   			if ($(event.relatedTarget).parents('#content')) //event.relatedTarget: 获取该事件发生前鼠标所在位置处的元素
   			{
   				tbody.css('cursor', 'default');
   				selectedRow = null;
   			}
   		});

   	},
   	sortsObject: function(obj) {
   		if (obj) {
   			obj.sort(function(a, b) {
   				return a.sortflag - b.sortflag
   			});
   		}
   		return obj;
   	},
   	initField_info: function() {
   		if (initHeadMetas.length == 0) {
   			eastcom.showMsg("danger", "表头加载失败!");
   			setTimeout('$("#msg-cnt").empty()', 3000);
   			return;
   		};
   		for (var i = 0; i < initHeadMetas.length; i++) {
   			var objectInArr = {
   				"sortflag": i,
   				"fieldname": initHeadMetas[i],
   				"linewidth": 0,
   				"isshow": "true",
               "fieldType":"varchar"
   			};

   			field_info_all.push(objectInArr);
   		};


   		var id = val[0].reportCheckInfo.report_id;
   		var data = {
   			"dbId": "srpt",
   			"tableName": configUrl_main.dm_co_ba_srpt_report_tableName,
   			//"tableName":"dm_co_ba_srpt_report",
   			"type": "update",
   			"conditions": ["report_id"],
   			"data": {
   				"report_id": id,
   				"field_info": JSON.stringify(field_info_all),
   			}
   		};
   		var dataStr = JSON.stringify(data);
   		//调整数据库顺序和是否显示------------------
   		var res = commonAjax(configUrl_main.update_update, dataStr, "", "");
   	},
   	strlen: function(str) {
   		var len = 0;
   		for (var i = 0; i < str.length; i++) {
   			var c = str.charCodeAt(i);
   			//单字节加1
   			if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
   				len++;
   			} else {
   				len += 2;
   			}
   		}
   		return len;
   	},
      zhuanhuaunTreeData: function(data) {
      var array = [];
      var flag = false; //判断是否有子文件
      if (data.length > 0) {
         for (var i = 0; i < data.length; i++) {
            var object = {};
            object.id = data[i].id_;
            object.text = data[i].name_; //wenbenguanzhu
            var array_two = "";
            if (data[i].type == 1) {
               if (data[i].enabled == 2) {
                  object.iconCls = "icon-wenbenfabu";
               };
               if (data[i].enabled == 3) {
                  object.iconCls = "icon-wenbenguanzhu";
               };
               object.attributes = {
                  "ishasChilds": false,
                  "parent_id": data[i].parent_id,
                  "type":1
               };
            };
            if (data[i].type == 0) {
               flag = true;
               object.attributes = {
                  "ishasChilds": true,
                  "parent_id": data[i].parent_id,
                  "type":0
               };
               array_two = reportQueryResult.zhuanhuaunTreeData(data[i].children);
            };
            if (flag) {
               object.state = 'closed';
               flag = false;
            }
            object.children = array_two;
            array.push(object);
         }
      };
      return array;
   },


      //某列可超链接配置-----------------------------------------------------------

      /*configHyperLink : function(){
              $("#configHyperLink").modal("toggle");

              var field_info_self = field_info_all;
         field_info = [{
                      "sortflag":0,                      
                      "fieldname":"开始时间0",         
                      "isshow":"true"             
                    }] 
         var Arr_Object = reportQueryResult.sortsObject(field_info_self);
         var htmlStr = "";
         for (var i = 0; i < Arr_Object.length; i++) {
                var item = Arr_Object[i];

         };
      }, */
      configHyperLinkHeadModal_load : function(){
                    drill.selectField = "";
                    $("#configHyperLinkHeadModal").modal("toggle");
                    var field_info_self = field_info_all;
                    field_info = [{
                                 "sortflag":0,                      
                                 "fieldname":"开始时间0",         
                                 "isshow":"true"             
                               }] 
                    var Arr_Object = reportQueryResult.sortsObject(field_info_self);
                    var htmlStr = "";
                    //追加---------------------------------------------
                        var dataA = {
                                    "ifId":"srpt-cfg-reportInfo",
                                    "fields":"field_info",
                                    "report_id":val[0].reportCheckInfo.report_id
                                    };
                        var dataStrA = JSON.stringify(dataA);  
                        var resA = commonAjax(configUrl_main.query, dataStrA, "", ""); 
                        var field_info_getNews = resA.data.FIELD_INFO;
                        var field_info_getNew = JSON.parse(field_info_getNews);   //eval('('+field_info_getNews+')');  
                    //---------------------------------------------
                    for (var i = 0; i < Arr_Object.length; i++) {
                           var item = Arr_Object[i];
                           htmlStr += '<tr isSelect = "0" fieldname="'+item.fieldname+'" >'
                                   +       '<td style="vertical-align: middle;"><span>'+item.fieldname+'</span></td>';
                                   //追加-------------------------------------------------------------
                                            
                                        //增加对应的字段属性
                                        for (var j = 0; j < field_info_getNew.length; j++) {
                                                var currO = field_info_getNew[j];
                                                if (currO.fieldname == item.fieldname) {
                                                     if (currO.isDrill && currO.isDrill == "1") {
                                                        //params
                                                        var currReportId = val[0].reportCheckInfo.report_id;
                                                        var currFieldName = item.fieldname;
                                                        var currSpan = "curr_"+j;

                                                        htmlStr  +=  '<td style="max-width:300px;vertical-align: middle;" ><span currspan = "curr_'+j+'" drillHerf = "'+currO.drillHerf+'">'+currO.drillHerfText+'('+currO.drillHerf+')</span></td>';
                                                        htmlStr  +=  '<td style="vertical-align: middle;">'
                                                                          +'<span currspan = "curr_'+j+'" style="display: inline-block;cursor: pointer;" title="清除链接" onclick="reportQueryResult.clearLink(\''+currReportId+'\',\''+currFieldName+'\',\''+currSpan+'\')">'
                                                                            +'<img  src="../../static/reportManageSys/images/closehong.png">'
                                                                          +'</span>'
                                                                     +'</td>';
                                                     }else{
                                                        htmlStr  +=  '<td><span></span></td>';
                                                        htmlStr  +=  '<td><span></span></td>';
                                                     };
                                                };
                                        };
                                   //-------------------------------------------------------------
                           htmlStr  +=  '</tr>';

                    };  
                    $("#content_table_head").empty();
                    $("#content_table_head").html(htmlStr); 

                    $("#content_table_head").find('tr').each(function(index, el) {

                              $(this).on('click',function(event) {
                                    var isSelect = $(this).attr('isSelect');
                                    if (isSelect == "1") {
                                           $(this).css('background-color', '#fff');
                                           $(this).attr('isSelect', '0');
                                           //console.log("1365alreadyChildrenId==="+$(this).find('span').eq(1).attr('drillHerf'));
                                           if ($(this).find('span').eq(1).attr('drillHerf')) {
                                               drill.alreadyChildrenId = "";
                                           };
                                           drill.fieldname = "";



                                    }else{
                                           $("#content_table_head").find('tr').css('background-color', '#fff');
                                           $("#content_table_head").find('tr').attr('isSelect', '0');
                                           $(this).css('background-color', '#d1eefe');
                                           $(this).attr('isSelect', '1');
                                           //console.log("1372alreadyChildrenId==="+$(this).find('span').eq(1).attr('drillHerf'));
                                           if ($(this).find('span').eq(1).attr('drillHerf')) {
                                               drill.alreadyChildrenId = $(this).find('span').eq(1).attr('drillHerf');
                                           };
                                           drill.fieldname = $(this).attr('fieldname');
                                    };
                              });
                              $(this).on('mouseenter',function(event) {
                                    var isSelect = $(this).attr('isSelect'); 
                                    if (isSelect != "1") {
                                         $(this).css('background-color', '#e8e8e8');
                                    };
                              });
                              $(this).on('mouseleave',function(event) {
                                    var isSelect = $(this).attr('isSelect');
                                    if (isSelect != "1") {
                                         $(this).css('background-color', '#fff');
                                    };
                              });


                    });

                   if (drill.fieldname != "") {
                              $("#content_table_head").find('tr').each(function(index, el) {
                                     var fieldname = $(this).attr('fieldname');
                                     if (drill.fieldname == fieldname) {
                                          //drill.fieldname = "";
                                          $(this).trigger('click');
                                     };
                              });
                   }; 

      },
      configHyperLinks_one : function(){
                   var flag = false;
                   $("#content_table_head").find('tr').each(function(index, el) {
                                 var isSelect = $(this).attr('isSelect');
                                 if (isSelect == "1") {
                                      drill.selectField = $(this).find('span').eq(0).html();
                                      flag = true;
                                 };
                   });

                   if (!flag) {alert("请选择要下钻的字段");return;};
                   reportQueryResult.configHyperLinks_one_next();
      },
      configHyperLinks_one_next : function(){
                   $("#configHyperLinkHeadModal").modal("hide");
                   //--reportQueryResult.configHyperLink(); 
                   var field_info = field_info_all;
                   reportQueryResult.configHyperLinkParam_load(field_info);
      },
      configHyperLink : function(){
               $("#configHyperLinkTreeModal").modal("toggle");
               $("#configHyperLinkTree").empty();
               if (_CacheFun._getCache("configHyperLinkTreeData") && _CacheFun._getCache("configHyperLinkTreeData") != null) {
                  var data = _CacheFun._getCache("configHyperLinkTreeData"); //拿去缓存对象中的数据
                  reportQueryResult.loadConfigHyperLinkTree(data);
               } else {
                     $("#configHyperLinkTreeDiv").mask("数据加载中....");
                     var param = {
                                 "username": "",
                                 "enabled": [1, 2, 3],
                                 "type": "1",
                                 "report_name": ""
                              };
                     var paramStr = JSON.stringify(param);         

                    $.ajax({
                           url: eastcom.baseURL + configUrl_main.srpt_rcpt_syncQueryReport,
                           type: 'POST',
                           async: true,
                           dataType: "json",
                           contentType: "application/json",
                           data: paramStr,
                           success: function(data) {
                                       var res = data;
                                       if (!res.success) {
                                           alert("菜单加载失败!");
                                          return;
                                       };
                                       if (res.data == null || res.data == "null") {
                                          $('#configHyperLinkTree').html("暂无报表可查看!")
                                          return;
                                       };
                                       var dataArr = res.data;
                                       var initData = reportQueryResult.zhuanhuaunTreeData(dataArr);
                                       _CacheFun._bindCache("configHyperLinkTreeData", initData);
                                       reportQueryResult.loadConfigHyperLinkTree(initData);
                                                   
                           },
                           complete: function(XMLHttpRequest, textStatus) {
                                     $("#configHyperLinkTreeDiv").unmask();
                           },
                           error: function() {
                                    //请求出错处理
                                    alert("菜单加载失败!");
                                    return;
                           }
                    });
               };

              
      }, 
      loadConfigHyperLinkTree : function(initData){
               //loadTree
                     $('#configHyperLinkTree').empty();
                     $('#configHyperLinkTree').tree({
                        data: initData,
                        lines: true,
                        animate: true,
                     }); //tree  


                     //默认选中曾经超链接的字报表 
                     if (drill.alreadyChildrenId != "") {
                           var nodeTarget = $('#configHyperLinkTree').tree('find', drill.alreadyChildrenId);
                           if (nodeTarget) {
                             $('#configHyperLinkTree').tree('expandTo', nodeTarget.target);
                             $('#configHyperLinkTree').tree('select', nodeTarget.target);
                             $('#configHyperLinkTree').tree('scrollTo', nodeTarget.target);
                           };
                           drill.alreadyChildrenId = "";
                  };

      },
      configHyperLinks_two : function(){
                     drill.selectNodeId = "";
                     drill.selectNodeText = "";
                     var selectNode = $('#configHyperLinkTree').tree('getSelected');
                     if (selectNode == null || selectNode == "null") {alert("您尚未选择下钻的报表!");return;};
                     var ishasChilds = selectNode.attributes.ishasChilds;
                     if(ishasChilds){
                          alert("请选择要下钻的报表,而不是文件夹!");
                          console.log(drill);
                          return; 
                     }else{
                            drill.selectNodeId = selectNode.id;
                            drill.selectNodeText = selectNode.text;
                          //还要做好多事
                     };

                     reportQueryResult.configHyperLinks_two_next();
      },
      configHyperLinks_two_next : function(){
                    
                    //--var field_info = field_info_all;
                    //--reportQueryResult.configHyperLinkParam_load(field_info);
                           //-----------------------------------------------------------



                            var dataA = {
                                        "ifId":"srpt-cfg-reportInfo",
                                        "fields":"field_info",
                                        "report_id":val[0].reportCheckInfo.report_id
                                        };
                            var dataStrA = JSON.stringify(dataA);  
                            var resA = commonAjax(configUrl_main.query, dataStrA, "", ""); 
                            var field_info_getNews = resA.data.FIELD_INFO;
                            var field_info_getNew = JSON.parse(field_info_getNews);   //eval('('+field_info_getNews+')');      
                            //增加对应的字段属性
                            for (var i = 0; i < field_info_getNew.length; i++) {
                                       var item = field_info_getNew[i];
                                       if (item.fieldname == drill.selectField) {
                                            item.isDrill = "1";
                                            item.drillHerf = drill.selectNodeId;
                                            item.drillHerfText = drill.selectNodeText;
                                            item.drillParamColumn = drill.drillParamColumn;
                                       };
                            };

                    //--------------------------------        
                            var id = val[0].reportCheckInfo.report_id;
                            var data = {
                               "dbId": "srpt",
                               "tableName": configUrl_main.dm_co_ba_srpt_report_tableName,
                               //"tableName":"dm_co_ba_srpt_report",
                               "type": "update",
                               "conditions": ["report_id"],
                               "data": {
                                  "report_id": id,
                                  "field_info": JSON.stringify(field_info_getNew),
                               }
                            };
                            var dataStr = JSON.stringify(data);
                            var res = commonAjax(configUrl_main.update_update, dataStr, "", "");
                            //var res = commonAjax("/srpt/rcpt/common/update",dataStr,"",""); 
                            if (res.msg == "SUCCESS_NO_INFO" || res.msg == "success") {
                               eastcom.showMsg("success", "链接保存成功!");
                               setTimeout('$("#msg-cnt").empty()', 3000);
                               $("#configHyperLinkTreeModal").modal("hide");
                               reportQueryResult.getReportResultData();
                            } else {
                               eastcom.showMsg("danger", "链接保存失败!");
                               setTimeout('$("#msg-cnt").empty()', 3000);
                            };
                     //--------------------------------         
      },
      configHyperLinkTree_pre : function(){
                   $("#configHyperLinkTreeModal").modal("hide"); 
                   //--reportQueryResult.configHyperLinkHeadModal_load();
                   var field_info = field_info_all;
                   reportQueryResult.configHyperLinkParam_load(field_info);
      },
      
      configHyperLinkParam_load : function(params){
                   $("#configHyperLinkParamModal").modal("toggle");
                   //console.log(drill);
                   var field_info_self = params;
                   var Arr_Object_param = reportQueryResult.sortsObject(field_info_self);
                   var htmlStr = "";
                   //==================================================
                   //将已经配好的勾选列初始化勾选 
                   var dataA = {
                               "ifId":"srpt-cfg-reportInfo",
                               "fields":"field_info",
                               "report_id":val[0].reportCheckInfo.report_id
                               };
                   var dataStrA = JSON.stringify(dataA);  
                   var resA = commonAjax(configUrl_main.query, dataStrA, "", ""); 
                   var field_info_Param = eval('('+resA.data.FIELD_INFO+')');
                   var drillParamColumnString = "";
                   for (var i = 0; i < field_info_Param.length; i++) {
                          var item = field_info_Param[i];
                          if(item.fieldname == drill.selectField){
                              drillParamColumnString = item.drillParamColumn;
                          };
                   };
                   //==================================================
                   
                   for (var i = 0; i < Arr_Object_param.length; i++) {
                          var item = Arr_Object_param[i];
                          var currFieldName = item.fieldname;
                          var isChecked = false;

                          if (drillParamColumnString && drillParamColumnString.indexOf(currFieldName) > -1) {
                              isChecked = true; 
                          };
                          htmlStr += '<tr>'
                                  +       '<td style="vertical-align: middle;width: 48px;">'
                                  +          '<input type="checkbox" '+(isChecked?'checked':'')+' values = "'+currFieldName+'"/>'
                                  +       '</td>'
                                  +       '<td style="vertical-align: middle;"><span>'+currFieldName+'</span></td>';
                          htmlStr  +=  '</tr>';

                   };  
                   $("#content_table_head_param").empty();
                   $("#content_table_head_param").html(htmlStr); 
                   

      },
      configHyperLinks_three : function(){
                  //这里首先要把钻取到的报表id isDrill:1    drillHerf:id
                  //然后再保存参数对应关系

                  /*
                     ../srpt/rcpt/common/query
                  {"ifId":"srpt-cfg-reportInfo",
                  "fields":"field_info",
                  "report_id":"20170217112636"}
                  */
                  //first getNew field_info

                 //获取作为钻取的参数列-----------------------------------------
                 var param_string = "";
                 $("#content_table_head_param").find("tr").each(function(index, el) {
                          var isCheck = $(el).find('input[type = "checkbox"]').prop("checked"); 
                          if (isCheck) {
                                param_string += $(el).find('input[type = "checkbox"]').attr("values") +",";
                          };  
                 });
                 console.log(param_string);
                 drill.drillParamColumn = param_string;
                 $("#configHyperLinkParamModal").modal("hide");
                 reportQueryResult.configHyperLink();


                   
      },
      configHyperLinkParam_pre : function(){
                  $("#configHyperLinkParamModal").modal("hide"); 
                  //--reportQueryResult.configHyperLink();
                  reportQueryResult.configHyperLinkHeadModal_load();
      },
      clearLink : function(currReportId,currFieldName,currSpan){
              //数据库清空
                       var dataA = {
                                   "ifId":"srpt-cfg-reportInfo",
                                   "fields":"field_info",
                                   "report_id":currReportId
                                   };
                       var dataStrA = JSON.stringify(dataA);  
                       var resA = commonAjax(configUrl_main.query, dataStrA, "", ""); 
                       var field_info_getNews = resA.data.FIELD_INFO;
                       var field_info_getNew = JSON.parse(field_info_getNews);   //eval('('+field_info_getNews+')');      
                       //增加对应的字段属性
                       for (var i = 0; i < field_info_getNew.length; i++) {
                                  var item = field_info_getNew[i];
                                  if (item.fieldname == currFieldName) {
                                       item.isDrill = "0";
                                       item.drillHerf = "";
                                       item.drillHerfText = "";
                                       item.drillParamColumn = "";
                                  };
                       };

               //--------------------------------        
                       var data = {
                          "dbId": "srpt",
                          "tableName": configUrl_main.dm_co_ba_srpt_report_tableName,
                          //"tableName":"dm_co_ba_srpt_report",
                          "type": "update",
                          "conditions": ["report_id"],
                          "data": {
                             "report_id": currReportId,
                             "field_info": JSON.stringify(field_info_getNew),
                          }
                       };
                       var dataStr = JSON.stringify(data);
                       var res = commonAjax(configUrl_main.update_update, dataStr, "", "");
                       //var res = commonAjax("/srpt/rcpt/common/update",dataStr,"",""); 
                       //界面清空
                       if (res.msg == "SUCCESS_NO_INFO" || res.msg == "success") {
                                $("span[currspan = "+currSpan+"]").each(function(index, el) {
                                  $(this).empty();  
                                });
                       }else{
                               eastcom.showMsg("danger", "链接保存失败!");
                               setTimeout('$("#msg-cnt").empty()', 3000);
                       };
                //--------------------------------    

              //界面清空
              event.stopPropagation();
              
     },
     configHyperLinkTreeSelect : function(){
              var reportName_mohu = $("#reportName_mohu").val().trim(); 
              var param = {
                           "ifId":"srpt-cfg-drill-queryRptLike", 
                           "name":reportName_mohu
                       };
              var paramStr = JSON.stringify(param);         

              $("#configHyperLinkTreeDivLoading").mask("数据加载中....");
              $.ajax({
                    url: eastcom.baseURL + configUrl_main.query,
                    type: 'POST',
                    async: true,
                    dataType: "json",
                    contentType: "application/json",
                    data: paramStr,
                    success: function(data) {
                                var res = data;
                                if (!res.success) {
                                    alert("搜索失败!");
                                   return;
                                };
                                var dataArr= [];
                                if (res.data[0].REPORT_IDS == null || res.data[0].REPORT_IDS == "null") {
                                          
                                }else{
                                          var dataString = res.data[0].REPORT_IDS;
                                          dataArr = dataString.split(",");
                                };

                                //var dataArr = ["20160613135404","20160818100855","20160518094913","20161013133513","20170214134017"];
                                $("#selectLength").html(dataArr.length);

                                if (dataArr.length != 0) {
                                      //configHyperLinkTreeSelectParams
                                      configHyperLinkTreeSelectParams.arr = dataArr;
                                      configHyperLinkTreeSelectParams.len = dataArr.length;
                                      configHyperLinkTreeSelectParams.num = 0;
                                      
                                      
                                      var nodeTarget = $('#configHyperLinkTree').tree('find', dataArr[0]);
                                      if (nodeTarget) {
                                        //$('#configHyperLinkTree').tree('collapseAll');
                                        $('#configHyperLinkTree').tree('expandTo', nodeTarget.target);
                                        //document.getElementById("configHyperLinkTreeDiv").scrollTop = 0; 
                                        $('#configHyperLinkTree').tree('scrollTo', nodeTarget.target);
                                        $('#configHyperLinkTree').tree('select', nodeTarget.target);
                                      };
                                 }else{
                                      $('#configHyperLinkTree').tree('collapseAll');
                                      var data = _CacheFun._getCache("configHyperLinkTreeData"); //拿去缓存对象中的数据
                                      reportQueryResult.loadConfigHyperLinkTree(data);

                                 };
                                
                                            
                    },
                    complete: function(XMLHttpRequest, textStatus) {
                              $("#configHyperLinkTreeDivLoading").unmask();
                    },
                    error: function() {
                             //请求出错处理
                             alert("菜单加载失败!");
                             return;
                    }
             });

             


     },
     configHyperLinkTree_up : function(){
             var num = configHyperLinkTreeSelectParams.num;
             var len = configHyperLinkTreeSelectParams.len;
             num = num-1 == -1 ? len-1 : num-1;
             configHyperLinkTreeSelectParams.num = num;
             var id = configHyperLinkTreeSelectParams.arr[num];
             console.log("上--"+id);
             var nodeTarget = $('#configHyperLinkTree').tree('find', id);
             if (nodeTarget) {
               //$('#configHyperLinkTree').tree('collapseAll');
               $('#configHyperLinkTree').tree('expandTo', nodeTarget.target);
               //document.getElementById("configHyperLinkTreeDiv").scrollTop = 0; 
               $('#configHyperLinkTree').tree('scrollTo', nodeTarget.target);
               $('#configHyperLinkTree').tree('select', nodeTarget.target);
             };

     },
     configHyperLinkTree_down : function(){
             var num = configHyperLinkTreeSelectParams.num;
             var len = configHyperLinkTreeSelectParams.len;
             num = num+1 == len ? 0 : num+1;
             configHyperLinkTreeSelectParams.num = num;
             var id = configHyperLinkTreeSelectParams.arr[num];
             console.log("下--"+id);
             var nodeTarget = $('#configHyperLinkTree').tree('find', id);
             if (nodeTarget) {
               //$('#configHyperLinkTree').tree('collapseAll');
               $('#configHyperLinkTree').tree('expandTo', nodeTarget.target);
               //document.getElementById("configHyperLinkTreeDiv").scrollTop = 0; 
               $('#configHyperLinkTree').tree('scrollTo', nodeTarget.target);
               $('#configHyperLinkTree').tree('select', nodeTarget.target);
             };

     },
     drillEventDeal : function(options, rowObjs){
               console.log(options);
               console.log(rowObjs);
               //alert("处理钻取事件");
               //获取子报表id
               var report_id = "";
               var indexName = options.colModel.index;
               var dataA = {
                               "ifId":"srpt-cfg-reportInfo",
                               "fields":"field_info",
                               "report_id":val[0].reportCheckInfo.report_id
                           };
                   var dataStrA = JSON.stringify(dataA);  
                   var resA = commonAjax(configUrl_main.query_reportInfo, dataStrA, "", ""); 
                   var field_info_Param = eval('('+resA.data.FIELD_INFO+')');
                   var drilldrillHerfString = "";
                   for (var i = 0; i < field_info_Param.length; i++) {
                          var item = field_info_Param[i];
                          if(item.fieldname == indexName){
                              report_id = item.drillHerf;
                          };
                   };

//========================================================
               var conditions = {"isContinue":"",
                                 "timeType":"hour",
                                 "startTime":"",
                                 "endTime":"",
                                 "discteteTime":"",
                                 "sidx":null,
                                 "sord":"asc",
                                 "multiSelectWX":""
                                
                               };
               // for (var i = 0; i < 100; i++) {
               //           var o = "qry_"+ i;
               //           conditions[o] = "";         
               // };
               //动态添加qry_0,....================================================================== 
                 var dataSA = {
                               "ifId":"srpt-cfg-reportInfo",
                               "fields":"qry_bd_info",
                               "report_id":report_id
                           };
                   var dataStrSA = JSON.stringify(dataSA);  
                   var resSA = commonAjax(configUrl_main.query, dataStrSA, "", ""); 
                   var qry_bd_info = eval('('+resSA.data.QRY_BD_INFO+')');
                   var otherCondition_arr = qry_bd_info.otherCondition;
                   for (var i = 0; i < otherCondition_arr.length; i++) {
                              var currObj =  otherCondition_arr[i];
                              var id = currObj.id;
                              conditions[id] = ""; 
                   };
               //================================================================== 

               conditions.isContinue = globalVariablePostJson.conditions.isContinue;
               conditions.timeType = globalVariablePostJson.conditions.timeType;
               conditions.startTime = globalVariablePostJson.conditions.startTime;
               conditions.endTime = globalVariablePostJson.conditions.endTime;
               conditions.discteteTime = globalVariablePostJson.conditions.discteteTime;

               conditions.column_cn =  options.colModel.index;
               conditions.report_id_p = val[0].reportCheckInfo.report_id ;
               $.extend(conditions, rowObjs);
               
              
                   
               //-----------------------------------------------------------
               //添加用户名
               //防止单点登录获取不到用户名-------------------------------------------------------------
                       var userInfo = "";
                      var userinfoDiv=$(window.top.document.getElementById('userinfo'));
                      userInfo =  userinfoDiv.find('div[id = "tab_1_1"]').find('div').eq(1).find('div').eq(1).html();
                      if (userInfo == null) {
                          userInfo = $.cookie("inas_portallogin_user_username");
                      }else{
                          var re1 = new RegExp("\n", "g");
                          userInfo = userInfo.replace(re1, ""); 
                          userInfo = userInfo.trim(); 
                      };
               //---------------------------------------------------------  
               conditions.username = userInfo;   
               var data = {
                  "report_id": report_id,
                  "conditions": conditions,
                  "logic_sql_info": ""
               };
               var dataStr = JSON.stringify(data);
               var res = commonAjax(configUrl_main.srpt_rcpt_checkOrQueryReport, dataStr, "", "");
               //var res = commonAjax("/srpt/rcpt/checkOrQueryReport",dataStr,"","");
               if (!res.success) {
                  $("body").unmask();
                  alert("查询异常!");
                  return;
               };
               //parent.mainE.createQueryResultTab(res);
               if (fromWhere == "autoReportId") {
                  parent.autoReport.createQueryResultTab(res);
               };
               if (fromWhere == "mainE") {
                  parent.mainE.createQueryResultTab(res);
               };
               if (fromWhere == "myReport") {
                  parent.myReport.createQueryResultTab(res);
               };
               if (fromWhere == "reportQuery") {
                  parent.reportQuery.createQueryResultTab(res);
               };









     },
     dataFilter : function(){
             $("#dataFilterModal").modal("toggle");
             var field_info = field_info_all;
             reportQueryResult.dataFilter_loadModalData(field_info);
             if (filterCondition.length > 0) {
                  reportQueryResult.backLastCondition();
             }else{
                  reportQueryResult.backDataBaseCondition();
             };
     },
     dataFilter_loadModalData : function(params){
             var field_info_self = params;
             /*field_info = [{
                          "sortflag":0,                      
                          "fieldname":"开始时间0",         
                          "isshow":"true"             
                        }] */
             var Arr_Object = reportQueryResult.sortsObject(field_info_self);
             var htmlStr = "";
             for (var i = 0; i < Arr_Object.length; i++) {
               var item = Arr_Object[i];
                      //htmlStr += '<input name="allchecked" id="check_' + item.fieldname + '" type="checkbox" checked="checked"/>';
                      //htmlStr += '<span id="' + item.fieldname + '">' + item.fieldname + '</span>' +
               if (item.isshow == "true") {  //加载显示的字段,隐藏字段不显示,不能成为过滤条件
                     var xiansuiji = Math.random() > 0.5 ? true : false ;
                     if( item.fieldType &&item.fieldType == "varchar"){  //字符串类型字段
                            htmlStr += '<tr>';
                            htmlStr += '<td><input style="width:80px" type="text" value="不可用" disabled = "false"/></td>'
                                    +  '<td>'
                                    +      '<select style="width:80px" disabled = "false">'
                                    +      '<option value="">不可用</option>'
                                    +      '<option value=">">大于</option>'
                                    +      '<option value="=">等于</option>'
                                    +      '<option value="<">小于</option>'
                                    +      '</select>'
                                    +  '</td>'
                                    +  '<td style="vertical-align:middle">'
                                    +      '<span id="' + item.fieldname + '">' + item.fieldname + '</span>'
                                    +      '<span id="' + item.fieldType + '" style="display:none"></span>'
                                    +  '</td>'
                                    +  '<td>'
                                    +      '<select style="width:85px">'
                                    +      '<option value="=">=</option>'
                                    +      '<option value="!=">!=</option>'
                                    +      '<option value="like">like</option>'
                                    +      '<option value="not like">not like</option>'
                                    +      '</select>'
                                    +  '</td>'
                                    +  '<td>'
                                    +      '<input style="width:80px" type="text" />'
                                    +  '</td>'

                            htmlStr +='</tr>';
                     }else if (item.fieldType &&item.fieldType == "number") {  //数字类型字段
                            htmlStr += '<tr>';
                            htmlStr += '<td><input style="width:80px" type="text"/></td>'
                                    +  '<td>'
                                    +      '<select style="width:80px">'
                                    +      '<option value=">=">\≤</option>'
                                    +      '<option value="=">=</option>'
                                    +      '<option value="<">\<</option>'
                                    +      '</select>'
                                    +  '</td>'
                                    +  '<td style="vertical-align:middle">'
                                    +      '<span id="' + item.fieldname + '">' + item.fieldname + '</span>'
                                    +      '<span id="' + item.fieldType + '" style="display:none"></span>'
                                    +  '</td>'
                                    +  '<td>'
                                    +      '<select style="width:85px">'
                                    +      '<option value="<=">\≤</option>'
                                    +      '<option value="=">=</option>'
                                    +      '<option value="<">\<</option>'
                                    +      '</select>'
                                    +  '</td>'
                                    +  '<td>'
                                    +      '<input style="width:80px" type="text" />'
                                    +  '</td>'

                            htmlStr +='</tr>';
                     }else{

                            htmlStr += '<tr>';
                            htmlStr += '<td><input style="width:80px" type="text" value="不可用" disabled = "false"/></td>'
                                    +  '<td>'
                                    +      '<select style="width:80px" disabled = "false">'
                                    +      '<option value="">不可用</option>'
                                    +      '<option value=">">大于</option>'
                                    +      '<option value="=">等于</option>'
                                    +      '<option value="<">小于</option>'
                                    +      '</select>'
                                    +  '</td>'
                                    +  '<td style="vertical-align:middle">'
                                    +      '<span id="' + item.fieldname + '">' + item.fieldname + '</span>'
                                    +      '<span id="' + item.fieldType + '" style="display:none"></span>'
                                    +  '</td>'
                                    +  '<td>'
                                    +      '<select style="width:85px" disabled = "false">'
                                    +      '<option value="=">=</option>'
                                    +      '<option value="!=">!=</option>'
                                    +      '<option value="like">like</option>'
                                    +      '<option value="not like">not like</option>'
                                    +      '</select>'
                                    +  '</td>'
                                    +  '<td>'
                                    +      '<input style="width:80px" type="text" disabled = "false" />'
                                    +  '</td>'

                            htmlStr +='</tr>'; 
                     };
               };
             };
             $("#content_table_dataFilter").html(htmlStr);
             //reportQueryResult.tableSort(); //let it have sort function

     },
     dataFilter_save : function(){
              //获取过滤条件    filterCondition  数组 存放条件
              var suspendFlag = false;
              var currPageGetCondition = [];
              $("#content_table_dataFilter").find('tr').each(function(index, el) {
                     var fieldname = $(this).find('td').eq(2).find('span').eq(0).attr("id");
                     var fieldType = $(this).find('td').eq(2).find('span').eq(1).attr("id");
                     var minVal = $(this).find('td').eq(0).find('input').eq(0).val();
                     var minSymbol = $(this).find('td').eq(1).find('select').eq(0).val();
                     var maxSymbol = $(this).find('td').eq(3).find('select').eq(0).val();
                     var maxVal = $(this).find('td').eq(4).find('input').eq(0).val();
                     var fieldObj = {
                               "fieldname":fieldname,
                               "fieldType":fieldType,
                               "minVal":"",
                               "minSymbol":"",
                               "maxSymbol":"",
                               "maxVal":""
                     };
                     if (fieldType == "varchar") {   //判断数据类型为varchar的处理方式
                            if (maxVal.trim() == "") {
                                 //eastcom.showMsg("danger", "匹配值不能为空!");
                                 //setTimeout('$("#msg-cnt").empty()', 3000);
                            }else{
                                 fieldObj.maxSymbol = maxSymbol; 
                                 fieldObj.maxVal = maxVal; 
                                 currPageGetCondition.push(fieldObj);
                            };

                     }else if (fieldType == "number"){   //判断数据类型为number的处理方式
                            if (minVal.trim() == "" && maxVal.trim() == "" ) {
                                 //eastcom.showMsg("danger", "值不能为空!");
                                 //setTimeout('$("#msg-cnt").empty()', 3000); 
                            }else{
                                 /*if (!(/^[0-9]*$/.test(minVal))) {
                                     eastcom.showMsg("danger", fieldname+"最小值非数字类型");
                                     setTimeout('$("#msg-cnt").empty()', 3000); 
                                     suspendFlag  = true; 
                                     return;
                                 }else if (!(/^[0-9]*$/.test(maxVal))) {
                                     eastcom.showMsg("danger", fieldname+"最大值非数字类型");
                                     setTimeout('$("#msg-cnt").empty()', 3000);  
                                     suspendFlag  = true; 
                                     return;
                                 };*/
                                 if (!(minVal == "" || maxVal =="")) {
                                          if (eval(minVal + ">" + maxVal)) {
                                              eastcom.showMsg("danger", fieldname+"最大值小于最小值");
                                              setTimeout('$("#msg-cnt").empty()', 3000);  
                                              suspendFlag  = true; 
                                              return;
                                          } 
                                 };
                                 
                                 fieldObj.minVal = minVal; 
                                 fieldObj.minSymbol = minSymbol; 
                                 fieldObj.maxSymbol = maxSymbol; 
                                 fieldObj.maxVal = maxVal; 
                                 currPageGetCondition.push(fieldObj);
                            };
                     };
              });
              if (suspendFlag) { return;};  //如果条件不合理,不往下执行
              filterCondition = currPageGetCondition;
              console.log(currPageGetCondition);

              //处理查询逻辑 将参数带过去查询
        
              reportQueryResult.getReportResultData("dataFilter");   //带数据过滤的查询
              //判断查询条件是否要保存到数据库
              var isSaveCondition = $("#isSaveCondition").prop("checked");
              //console.log("是否要保存数据库==" +isSaveCondition);
              if (isSaveCondition) {
                  //调用接口,将条件保存数据库
                  var id = val[0].reportCheckInfo.report_id;
                  var data = {
                     "dbId": "srpt",
                     "tableName": configUrl_main.dm_co_ba_srpt_report_tableName,
                     //"tableName":"dm_co_ba_srpt_report",
                     "type": "update",
                     "conditions": ["report_id"],
                     "data": {
                        "report_id": id,
                        "filter_data": JSON.stringify(currPageGetCondition),
                     }
                  };
                  var dataStr = JSON.stringify(data);
                  //保存数据过滤条件到数据库------------------
                  var res = commonAjax(configUrl_main.update_update, dataStr, "", "");


              };
              $("#dataFilterModal").modal("hide");


     },
     backDataBaseCondition : function(){
                 //filter_data_database
                 //调用接口,将条件保存数据库
                 var id = val[0].reportCheckInfo.report_id;
                 var data = {
                             "fields":"FILTER_DATA",
                             "report_id":id
                           };

                 var dataStr = JSON.stringify(data);
                 
                 var res = commonAjax("/sml/query/srpt-cfg-reportInfo", dataStr, "", "");
                 filter_data_database =  eval('(' + res.data.FILTER_DATA + ')');


                 $("#content_table_dataFilter").find('tr').each(function(index, el) {
                       var fieldname = $(this).find('td').eq(2).find('span').eq(0).attr("id");
                       var fieldType = $(this).find('td').eq(2).find('span').eq(1).attr("id");
                       var minVal = $(this).find('td').eq(0).find('input').eq(0).val();
                       var minSymbol = $(this).find('td').eq(1).find('select').eq(0).val();
                       var maxSymbol = $(this).find('td').eq(3).find('select').eq(0).val();
                       var maxVal = $(this).find('td').eq(4).find('input').eq(0).val();
                       
                       //全部还原为空
                       if (fieldType == "varchar") {
                               $(this).find('td').eq(3).find('select').eq(0).val("=");
                               $(this).find('td').eq(4).find('input').eq(0).val("");
                       }else if (fieldType == "number") {
                               $(this).find('td').eq(0).find('input').eq(0).val("");
                               $(this).find('td').eq(1).find('select').eq(0).val("≤");
                               $(this).find('td').eq(3).find('select').eq(0).val("≤");
                               $(this).find('td').eq(4).find('input').eq(0).val("");
                       };
                       //填充已有的条件
                       if (filter_data_database == null) {
                                reportQueryResult.clearCondition();
                                return;
                       };
                       for (var i = 0; i < filter_data_database.length; i++) {
                              var item = filter_data_database[i];
                              if (fieldType == "varchar") {
                                      if (item.fieldname == fieldname) {
                                            $(this).find('td').eq(3).find('select').eq(0).val(item.maxSymbol);
                                            $(this).find('td').eq(4).find('input').eq(0).val(item.maxVal);
                                      }; 
                              }else if (fieldType == "number"){
                                      if (item.fieldname == fieldname) {
                                            $(this).find('td').eq(0).find('input').eq(0).val(item.minVal);
                                            $(this).find('td').eq(1).find('select').eq(0).val(item.minSymbol);
                                            $(this).find('td').eq(3).find('select').eq(0).val(item.maxSymbol);
                                            $(this).find('td').eq(4).find('input').eq(0).val(item.maxVal);
                                      }; 
                              };
                              
                       };


                 });       
     },
     backLastCondition : function(){
                 //filterCondition
               $("#content_table_dataFilter").find('tr').each(function(index, el) {
                     var fieldname = $(this).find('td').eq(2).find('span').eq(0).attr("id");
                     var fieldType = $(this).find('td').eq(2).find('span').eq(1).attr("id");
                     var minVal = $(this).find('td').eq(0).find('input').eq(0).val();
                     var minSymbol = $(this).find('td').eq(1).find('select').eq(0).val();
                     var maxSymbol = $(this).find('td').eq(3).find('select').eq(0).val();
                     var maxVal = $(this).find('td').eq(4).find('input').eq(0).val();
                     
                     //全部还原为空
                     if (fieldType == "varchar") {
                             $(this).find('td').eq(3).find('select').eq(0).val("=");
                             $(this).find('td').eq(4).find('input').eq(0).val("");
                     }else if (fieldType == "number") {
                             $(this).find('td').eq(0).find('input').eq(0).val("");
                             $(this).find('td').eq(1).find('select').eq(0).val("≤");
                             $(this).find('td').eq(3).find('select').eq(0).val("≤");
                             $(this).find('td').eq(4).find('input').eq(0).val("");
                     };
                     //填充已有的条件
                     for (var i = 0; i < filterCondition.length; i++) {
                            var item = filterCondition[i];
                            if (fieldType == "varchar") {
                                    if (item.fieldname == fieldname) {
                                          $(this).find('td').eq(3).find('select').eq(0).val(item.maxSymbol);
                                          $(this).find('td').eq(4).find('input').eq(0).val(item.maxVal);
                                    }; 
                            }else if (fieldType == "number"){
                                    if (item.fieldname == fieldname) {
                                          $(this).find('td').eq(0).find('input').eq(0).val(item.minVal);
                                          $(this).find('td').eq(1).find('select').eq(0).val(item.minSymbol);
                                          $(this).find('td').eq(3).find('select').eq(0).val(item.maxSymbol);
                                          $(this).find('td').eq(4).find('input').eq(0).val(item.maxVal);
                                    }; 
                            };
                            
                     };


               });       

     },
     clearCondition : function(){
                $("#content_table_dataFilter").find('tr').each(function(index, el) {
                      var fieldname = $(this).find('td').eq(2).find('span').eq(0).attr("id");
                      var fieldType = $(this).find('td').eq(2).find('span').eq(1).attr("id");
                      var minVal = $(this).find('td').eq(0).find('input').eq(0).val();
                      var minSymbol = $(this).find('td').eq(1).find('select').eq(0).val();
                      var maxSymbol = $(this).find('td').eq(3).find('select').eq(0).val();
                      var maxVal = $(this).find('td').eq(4).find('input').eq(0).val();
                      
                      //全部还原为空
                      if (fieldType == "varchar") {
                              $(this).find('td').eq(3).find('select').eq(0).val("=");
                              $(this).find('td').eq(4).find('input').eq(0).val("");
                      }else if (fieldType == "number") {
                              $(this).find('td').eq(0).find('input').eq(0).val("");
                              $(this).find('td').eq(1).find('select').eq(0).val("≤");
                              $(this).find('td').eq(3).find('select').eq(0).val("≤");
                              $(this).find('td').eq(4).find('input').eq(0).val("");
                      };
                }); 
     },
     clearDataFilter : function(){
               if(confirm("确定要清空条件吗？")){
                        console.log("-----清除查询------");
                        var id = val[0].reportCheckInfo.report_id;
                       /* var data = {
                           "dbId": "srpt",
                           "tableName": configUrl_main.dm_co_ba_srpt_report_tableName,
                           //"tableName":"dm_co_ba_srpt_report",
                           "type": "update",
                           "conditions": ["report_id"],
                           "data": {
                              "report_id": id,
                              "filter_data": JSON.stringify(currPageGetCondition),
                           }
                        };*/
                        var data = {
                        "dbId":"srpt",
                        "tableName": configUrl_main.dm_co_ba_srpt_report_tableName,
                        //"tableName":"dm_co_ba_srpt_report",
                        "type":"update",
                        "conditions":["report_id"],
                        "data":{
                           "report_id":id,
                           "FILTER_DATA":""
                        }
                        }
                        var dataStr = JSON.stringify(data);
                        //保存数据过滤条件到数据库------------------
                        var res = commonAjax(configUrl_main.update_update, dataStr, "", "");
                        if (res.resultCode == 0) {
                             filterCondition = [];
                             reportQueryResult.getReportResultData("dataFilter");
                             filter_data_database = [];
                        };
            };
     }



};






   //缓存对象
var _CacheFun = {
   __cache: {},
   //获取所有缓存对象
   _getCacheObj: function() {
      if (!this.__cache) {
         this.__cache = {};
      }
      return this.__cache;
   },
   //新增一个对象到缓存里
   _bindCache: function(id, data) {
      var cache = this._getCacheObj();
      cache[id] = data;
   },
   //获取一个对象从缓存里
   _getCache: function(id) {
      var cache = this._getCacheObj();
      if (cache) {
         if (id && id.length) {
            return cache[id];
         } else {
            return null;
         }
      } else {
         return null;
      }
   },
   //清空缓存
   _clearCache: function() {
      this.__cache = {};
   }
};