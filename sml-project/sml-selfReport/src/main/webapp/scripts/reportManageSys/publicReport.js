var timeParam = [];
var publicReport = {
	init: function() {
		$('body').mask("数据正在加载中,请稍等....");
		publicReport.showReportGetData();
		$('body').unmask();

	},
	showReportGetData: function() {
		var report_id = publicReport.getCurryId();
		var report_name = publicReport.getCurryName();
		var data = {
			"ifId": "srpt-cfg-reportInfo",
			"report_id": report_id
		};
		var dataStr = JSON.stringify(data);
		var res = commonAjax(configUrl_main.query_reportInfo, dataStr, "", "");
		//var res = commonAjax("/srpt/rcpt/common/query",dataStr,"","");
		if (res.data.qry_bd_info == null) {
			$('body').unmask();
			alert("新建报表请先编辑!");
			if (fromWhere != "autoReportId") {
				parent.mainE.closetabs(report_name);
			};
			return;
		}

		var qry_bd_info_Json = eval('(' + res.data.qry_bd_info + ')')
		var time = qry_bd_info_Json.time;
		var otherCondition = qry_bd_info_Json.otherCondition;

		///////////////////////////////////////////////////////////////////////////////////////////
		///////////////////////////////////////////////////////////////////////////////////////////
		///////////////////////////////////////////////////////////////////////////////////////////
		///////////////////////////////////////////////////////////////////////////////////////////
		//这里需要处理一些样式问题
		var timeTypeArr = time.query_param;
		var timeTypeStr = "";
		for (var yy = 0; yy < timeTypeArr.length; yy++) {
			 timeTypeStr += timeTypeArr[yy];
		}
		if (timeTypeStr.indexOf("min") == -1) {
			var k = document.body.offsetWidth; 
			$("body").css('overflow-x', 'hidden'); 
			document.getElementById("cententDiv").style.width = 0.88*k +"px";
			document.getElementById("otherCondition").style.width = 0.88*k +"px";
		}





		///////////////////////////////////////////////////////////////////////////////////////////
		///////////////////////////////////////////////////////////////////////////////////////////
		///////////////////////////////////////////////////////////////////////////////////////////
		///////////////////////////////////////////////////////////////////////////////////////////

		publicReport.showTime(time);
		// console.log(time);
		publicReport.showOtherCondition(otherCondition);
	},
	showTime: function(time) {
		var lianxuOrlisan = time.db_info.lianxuOrlisan;
		var timeType = time.query_param[0];

		timeParam.push(lianxuOrlisan);
		timeParam.push(timeType);

		var timeChecked = time.db_info.timeChecked;

		var ifshowtime = timeType.length;
		if (ifshowtime > 0) {
			if (lianxuOrlisan == "lianxu") {
				$("#lianxuDiv").css("display", "block");
				if(timeChecked) {
					$('#lianxu_timetype').css("display", "none");
				}
				showLianxuTime.init();
			};
			if (lianxuOrlisan == "lisan") {
				$("#lisanDiv").css("display", "block");
				if(timeChecked) {
					$('#lisan_timetype').css("display", "none");
				}
				showLisanTime.init();
			};
		};
	},
	showTimeParam: function() {
		return timeParam;
	},
	showOtherCondition: function(otherCondition) {
		var otherConditionArr = otherCondition;
		var zujianArray = otherConditionArr;
		var lie = 3;
		var htmlStr = "";

		var otherConditionDivWidth = $("#otherCondition").width() - 5;
		var tdWidth = (otherConditionDivWidth / lie).toFixed(0);

		htmlStr += '<table>'
		$("#otherConWai").css("display", "none");

		var ii = -1;
		var jj = 0; //计算除去非tr,td的组件数量


		for (var i = 0; i < zujianArray.length; i++) {
			//是否必填
			//-------------------------------------
			var zujian = zujianArray[i],
				zujianId = zujian.id,
				zujianType = zujian.type,
				zujianLabel = zujian.label,
				isRequire = zujian.isRequire;
			var displayflag = "none"
			if (isRequire == "t_Require") {
				displayflag = "inline-block"
			};

			//-------------------------------------
			$("#otherConWai").css("display", "block");

			//-------------------------------------
			// type "checkbox"
			// id "qry_3"
			// isRequire "f_Require"
			if (zujianType == "checkbox") {
				jj++;
				if (i == zujianArray.length - 1) {
					htmlStr += '</tr></table>';
				}; //防止最后一个是特殊组件,这样普通组件会缺失
				continue;
			}
			else if (zujianType == "leftRight") {
				jj++;
				if (i == zujianArray.length - 1) {
					htmlStr += '</tr></table>';
				};
				continue;
			}
			else if (zujianType == "leftrightliandong") {
				jj++;
				if (i == zujianArray.length - 1) {
					htmlStr += '</tr></table>';
				};
				continue;
			}
			else if (zujianType == "demoselect") {
				jj++;
				if (i == zujianArray.length - 1) {
					htmlStr += '</tr></table>';
				};
				continue;
			}
			else if (zujianType == "convergeCheckbox") {
				jj++;
				if (i == zujianArray.length - 1) {
					htmlStr += '</tr></table>';
				};
				continue;
			}
			else if (zujianType == "convergeCheckboxDetail") {
				jj++;
				if (i == zujianArray.length - 1) {
					htmlStr += '</tr></table>';
				};
				continue;
			}
			else if (zujianType == "demoselectNew") {
				jj++;
				if (i == zujianArray.length - 1) {
					htmlStr += '</tr></table>';
				};
				continue;
			}
			else if (zujianType == "indexWarning") {
				jj++;
				if (i == zujianArray.length - 1) {
					htmlStr += '</tr></table>';
				};
				continue;
			}
			else if (zujianType == "conditionToDevice") {
				jj++;
				if (i == zujianArray.length - 1) {
					htmlStr += '</tr></table>';
				};
				continue;
			}
			else if (zujianType == "conditionToPort") {
				jj++;
				if (i == zujianArray.length - 1) {
					htmlStr += '</tr></table>';
				};
				continue;
			}
			else if (zujianType == "busyTimeParagraph") {
				jj++;
				if (i == zujianArray.length - 1) {
					htmlStr += '</tr></table>';
				};
				continue;
			}
			else if (zujianType == "cellList") {
				jj++;
				if (i == zujianArray.length - 1) {
					htmlStr += '</tr></table>';
				};
				continue;
			}
			else if (zujianType == "comboCheckbox") {
				jj++;
				if (i == zujianArray.length - 1) {
					htmlStr += '</tr></table>';
				};
				continue;
			}
			//-------------------------------------
			ii++;
			var groupNum = ii % lie;
			var rowNum = (ii / lie).toFixed(0);
			if (groupNum == 0) {
				htmlStr += '<tr style="height: 50px">';
			};
			if (zujianType == "text") {
				htmlStr += showComponentSource.getshurukuang(tdWidth, zujianLabel, displayflag, zujianId, zujianType, isRequire);
			};
			if (zujianType == "select") {
				htmlStr += showComponentSource.getxialakuang(tdWidth, zujianLabel, displayflag, zujianId, zujianType, isRequire, zujian.xialaType);
			};

			if (groupNum == lie - 1) {
				htmlStr += '</tr>';
			};
			if (ii + 1 == zujianArray.length - jj) {
				htmlStr += '</tr></table>';
			};
		};

		for (var i = 0; i < zujianArray.length; i++) {
			var zujian = zujianArray[i],
				zujianId = zujian.id,
				zujianType = zujian.type,
				zujianLabel = zujian.label,
				isRequire = zujian.isRequire;
			if (zujianType == "checkbox") {
				htmlStr += showComponentSource.getfuxuankuang(zujianLabel, zujianId, zujianType, isRequire, zujian.xialaType);
			}
			else if (zujianType == "leftRight") {
				htmlStr += showComponentSource.getleftrightkuang(zujianLabel, zujianId, zujianType, isRequire, zujian.xialaType);
			}
			else if (zujianType == "leftrightliandong") {
				htmlStr += showComponentSource.getleftrightliandong(zujianLabel, zujianId, zujianType, isRequire, zujian.xialaType);
			}
			else if (zujianType == "demoselect") {
				htmlStr += showComponentSource.getdemoselect(zujianLabel, zujianId, zujianType, isRequire);
			}
			else if (zujianType == "convergeCheckbox") {
				htmlStr += showComponentSource.getconvergeCheckbox(zujianLabel, zujianId, zujianType, isRequire,zujian.xialaType);
			}
			else if (zujianType == "convergeCheckboxDetail") {
				htmlStr += showComponentSource.getconvergeCheckboxDetail(zujianLabel, zujianId, zujianType, isRequire,zujian.xialaType);
			}
			else if (zujianType == "demoselectNew") {
				htmlStr += showComponentSource.getdemoselectNew(zujianLabel, zujianId, zujianType, isRequire);
			    //将radio显示
				$("#showRadiodemoselectNew").css('display', 'inline-block');
			}
			else if (zujianType == "indexWarning") {
				htmlStr += showComponentSource.getindexWarning(zujianLabel, zujianId, zujianType, isRequire);
			}
			else if (zujianType == "conditionToDevice") {
				htmlStr += showComponentSource.getconditionToDevice(zujianLabel, zujianId, zujianType, isRequire);
			}
			else if (zujianType == "conditionToPort") {
				htmlStr += showComponentSource.getconditionToPort(zujianLabel, zujianId, zujianType, isRequire);
			}
			else if (zujianType == "busyTimeParagraph") {
				htmlStr += showComponentSource.getbusyTimeParagraph(zujianLabel, zujianId, zujianType, isRequire);
			}
			else if (zujianType == "cellList") {
				htmlStr += showComponentSource.getcellList(zujianLabel, zujianId, zujianType, isRequire);
			}
			else if (zujianType == "comboCheckbox") {
				htmlStr += showComponentSource.getcomboCheckbox(zujianLabel, zujianId, zujianType, isRequire,zujian.xialaType);
			}


		}

        if(htmlStr == '<table><tr style="height: 50px"></tr></table>'){
               htmlStr ="";
        }
		$("#otherCondition").html(htmlStr);

		//后添加
		// console.log(otherCondition);
		
		//添加选中事件
		for (var i = 0;i < zujianArray.length; i++) {
			var zujian = zujianArray[i],
				zujianId = zujian.id,
				zujianLabel = zujian.label,
				zujianType = zujian.type;
			if (zujianType == "checkbox") {

			}
			else if (zujianType == "leftRight") {
				suppleMethod.showComponentSource_getleftrightkuang(zujianId);
			}
			else if (zujianType == "leftrightliandong") {

			}
			else if (zujianType == "demoselect") {

			}
			else if (zujianType == "busyTimeParagraph") {
				    busyTimeParagraph.defaultCheckedEvent(zujianId, zujianLabel);  
			}
			else if (zujianType == "cellList") {
				cellList.defaultInit(zujianId);  
			};


		};
	},

	getCurryId: function() {
		var Parent_Id = "";
		//var Parent_Id_mainE = parent.mainE.getCurryReportId();
		if (fromWhere == "autoReportId") {
			Parent_Id = parent.autoReport.getCurryReportId();
		};
		if (fromWhere == "mainE") {
			Parent_Id = parent.mainE.getCurryReportId();
		};
		if (fromWhere == "myReport") {
			Parent_Id = parent.myReport.getCurryReportId();
		};
		if (fromWhere == "reportQuery") {
			Parent_Id = parent.reportQuery.getCurryReportId();
		};
		$("#curr_id_div").html(Parent_Id);
		return Parent_Id;
	},
	getCurryName: function() {
		var Parent_Name = "";
		//var Parent_Name = parent.mainE.getCurryReportName();
		if (fromWhere == "autoReportId") {
			Parent_Id = parent.autoReport.getCurryReportName();
		};
		if (fromWhere == "mainE") {
			Parent_Id = parent.mainE.getCurryReportName();
		};
		if (fromWhere == "myReport") {
			Parent_Id = parent.myReport.getCurryReportName();
		};
		if (fromWhere == "reportQuery") {
			Parent_Id = parent.reportQuery.getCurryReportName();
		};
		return Parent_Name;
	},
	panduanIsnull: function(val) {
		var value = $("#" + val.id).val();
		if (value == "" && val.name == "t_Require") {
//			$("#" + val.id).next("span").show();
			$("#" + val.id).next("span").text("请输入值!");
		};
		if (value != "" && val.name == "t_Require") {
//			$("#" + val.id).next("span").hide();
			$("#" + val.id).next("span").text("*");
		};
	},
	query: function() {
		publicReport.validVal();
	},
	validVal: function() {
		var flag = 0;
		$("input[name = 't_Require']").each(function() { //------------------------------------------------------------------
			var val = $(this).val();
			if (val == "") {
				$(this).next("span").show();
				flag = 1;
			};
		});
		if (flag == 1) {
			return;
		} //判断是否能提交

		//查询时获取页面条件
		var luanxulisan = timeParam[0];
		var isContinue = "";
		// 获取连续的开始结束时间
		var startTime = "";
		var endTime = "";
		if (luanxulisan == "lianxu") {
			isContinue = "t";
			var timeType = $("input[name = 'timeType']:checked").val();
			var pre_startTime = $("#timeField_" + timeType).val();
			var pre_endTime = $("#timeField_" + timeType + '2').val();

			if (pre_startTime == "undefined" || pre_startTime == undefined) {
				pre_startTime = "2016-05-26"
			};
			if (pre_endTime == "undefined" || pre_endTime == undefined) {
				pre_endTime = "2016-06-26"
			};
			//2016-06-26
			startTime = publicReport.updateTimeStyle(timeType, pre_startTime);
			endTime = publicReport.updateTimeStyle(timeType, pre_endTime);
			if (startTime > endTime) {
				alert("开始时间不能大于结束时间！");
				return;
			};

		};
		//获取离散时间
		if (luanxulisan == "lisan") {
			isContinue = "f";
			var timeType = $("input[name = 'timeType2']:checked").val();
			var timeStr = ""; //要传递的时间
			var timeStrs = "";
			$("#resUl").find("input[type = 'checkbox']").each(function(index, el) {
				var lidisplayflag = $(this).parent().css("display");
				if (lidisplayflag != "none") {
					timeStrs += $(this).val() + ',';
				};
			});
			var length = timeStrs.length;
			timeStr = timeStrs.substring(0, length - 1);
			//判断报表是否有时间------
			var isDisplay = $("#lisanDiv").css('display');
			if (isDisplay == "none") {
				timeStr = "201601010000"
			};

			if (timeStr == "") {
				alert("请选择时间！");
				return;
			};
		};

		//获取页面其他条件
		var otherCondition = [];
		$("#otherCondition").find("td").each(function(index, el) {
			var zujianAttrStr = $(this).find("p").eq(0).html();
			if (zujianAttrStr == null || zujianAttrStr == "null") {return true;};
			var zujianAttr = eval('(' + zujianAttrStr + ')');
			otherCondition.push(zujianAttr);
		});
		//---获取页面的其他特殊条件-----------------------------------------------  找元素,判断其size();
		$("#otherCondition").find($("span[name = 'otherSpecialCondition']")).each(function(index, el) {
			var leftRightZujianStr = $(this).find('p').eq(0).html();
			if (leftRightZujianStr == null || leftRightZujianStr == "null") {return true;};
			var leftRightZujian = eval('(' + leftRightZujianStr + ')')
			otherCondition.push(leftRightZujian);
		});
		//-------------------------------------------------- 


		var conditions = {
			isContinue: isContinue,
			timeType: timeType,
			startTime: startTime,
			endTime: endTime,
			discteteTime: timeStr,
			sidx: null,
			sord: "asc"

		};
		//后添加
		// console.log(conditions);
		
		//给conditions增加其他条件属性
		
		for (var i = 0; i < otherCondition.length; i++) {
			var id = otherCondition[i].id,
				type = otherCondition[i].type;
			//添加普通组件的值
			if (type == "text" || type == "select") {
				conditions[id] = $("#" + id).val();
			}
			//添加特殊组件的值
			//--------------------------------------------------------------------------------
			
			//添加左右选择组件值
			else if (type == "leftRight") {
				var cunfang_ids = "";
				$("#" + id).find('span[id =list_right_' + id + ']').find('span').each(function(index, el) {
					var flag = $(this).css('display'); //none  block   判断是否可选
					if (flag == "block") {
						cunfang_ids += $(this).attr('avalue') + ",";
					};

				});
				var cunfang_id = cunfang_ids.substring(0, cunfang_ids.length - 1);
				conditions[id] = cunfang_id;
			}
			
			//添加复选框的值
			else if (type == "checkbox") {
				var cunfang_ids = "";
				$("#" + id).find('input[name =' + id + ']').each(function(index, el) {
					var flag = $(this).is(':checked'); // true  false  判断是否选中
					if (flag) {
						cunfang_ids += $(this).val() + ",";
					};

				});
				var cunfang_id = cunfang_ids.substring(0, cunfang_ids.length - 1);
				conditions[id] = cunfang_id;
			}
			
			//添加模板配置的值
			else if (type == "demoselect") {
				var cunfang_ids = $("#" + id).find("span[sc ='1']").eq(0).find('span').eq(1).html(); //--------------------------------------------------
				conditions[id] = cunfang_ids;
			}
			
			//添加汇聚复选值
			else if (type == "convergeCheckbox") {
				//var cunfang_ids = $("#" + id).find("span[sc ='1']").eq(0).find('span').eq(1).html(); //--------------------------------------------------
				//conditions[id] = cunfang_ids;
				conditions[id + "_isConverge"] = $("#" + id).find("input[name = '"+id+"_isConverge']:checked").val();
				var qry_convergeCheckboxStr = "";
				$("#" + id).find("input[name='"+id+"_convergeCheckbox']:checked").each(function(index, el) {
					                 qry_convergeCheckboxStr += $(this).attr("values") + ","; 
				});
				if (qry_convergeCheckboxStr == "") {alert("请至少勾选一个!");return;};
				qry_convergeCheckboxStr = qry_convergeCheckboxStr.substring(0,qry_convergeCheckboxStr.length-1);
				conditions[id+"_convergeCheckbox"] = qry_convergeCheckboxStr;
			}
			
			//添加汇聚复选值详情
			else if (type == "convergeCheckboxDetail") {
				//var cunfang_ids = $("#" + id).find("span[sc ='1']").eq(0).find('span').eq(1).html(); //--------------------------------------------------
				//conditions[id] = cunfang_ids;
				conditions[id + "_isConverge"] = $("#" + id).find("input[name = '"+id+"_isConverge']:checked").val();
				var qry_convergeCheckboxDetailStr = "";
				$("#" + id).find("input[name='"+id+"_convergeCheckboxDetail']:checked").each(function(index, el) {
					                 qry_convergeCheckboxDetailStr += $(this).attr("values") + ","; 
				});
				if (qry_convergeCheckboxDetailStr == "") {alert("请至少勾选一个!");return;};
				qry_convergeCheckboxDetailStr = qry_convergeCheckboxDetailStr.substring(0,qry_convergeCheckboxDetailStr.length-1);
				conditions[id+"_convergeCheckboxDetail"] = qry_convergeCheckboxDetailStr;
			}
			
			//添加设备端口模板
			else if (type == "demoselectNew") {

				//获取设备端口查询条件
                var seekType = $("#" + id).find("li.hover").attr('name');   // tabmenue_tiaojian   tabmenue_muban
                var shebeiOrduankou =$("input[name = '_seekQueryType']:checked").val();       //shebei   duankou
                var getChecked = $("#"+id+"_tree_tiaojian").tree('getChecked',['checked','indeterminate']);
                var shebeiOrduankouIdStr = "";
                for (var j = 0; j < getChecked.length; j++) {
                	var currObj = getChecked[j];
                	if (shebeiOrduankou == "shebei" && currObj.attributes.ishasChilds == true) {
                        shebeiOrduankouIdStr += currObj.id +",";
                	};
                	if (shebeiOrduankou == "duankou" && currObj.attributes.ishasChilds == false) {
                        shebeiOrduankouIdStr += currObj.id + ",";
                	};
                };
                shebeiOrduankouIdStr = shebeiOrduankouIdStr.substring(0,shebeiOrduankouIdStr.length-1);
                if (seekType == "tabmenue_tiaojian" && shebeiOrduankouIdStr == "") {alert("请选择设备或端口!");return};

                //获取模板查询条件
                var demoId = $("#" + id).find("span[sc = '1']").eq(0).find('span').eq(1).html(); 
                if (demoId == null) {demoId = "";};
                if (seekType == "tabmenue_muban" && demoId == "") {alert("请选择模板!");return};

                
				conditions.isDemo = seekType == "tabmenue_tiaojian"?"f":"t";   //是否模板查询
				if (seekType == "tabmenue_tiaojian") {
					conditions.isShebei = shebeiOrduankou == "shebei"?"t":"f";     //是否设备查询
				}else{
					conditions.isShebei = $("#" + id).find("span[sc = '1']").eq(0).find('span').eq(2).html();     //是否设备查询
				};
				conditions.shebeiOrduankouIdStr = shebeiOrduankouIdStr;     //是否设备查询
				conditions.demoId = demoId;     // 根据模板查询,模板id


				//console.log(conditions)
			}
			
			//添加设备条件
			else if (type == "conditionToDevice" || type == "conditionToPort") {
                
                var getChecked = $("#"+id+"_tree_tiaojian").tree('getChecked',['checked','indeterminate']);
                var shebeiOrduankouIdStr = "";
                for (var j = 0; j < getChecked.length; j++) {
                	var currObj = getChecked[j];
                    shebeiOrduankouIdStr += currObj.id +",";
                };
                shebeiOrduankouIdStr = shebeiOrduankouIdStr.substring(0,shebeiOrduankouIdStr.length-1);
                if (shebeiOrduankouIdStr == "") {alert("请选择设备或端口!");return};

				conditions.shebeiOrduankouIdStr = shebeiOrduankouIdStr;     //是否设备查询
				//console.log(conditions)
			}
			
			//添加指标预警
			else if (type == "indexWarning") {
                //校验字段过长企且前28位相同的比较
    //             var tempFlag = false;
				// var arrayVaule = new Array();  //定义数组   
				// $("#"+id+"_index option").each(function(){  //遍历所有option  
				// 	  var val = $(this).val();   //获取option值   
				// 	  if(val!=''){  
				// 	       arrayVaule.push(val.substring(0,28));  //添加到数组中  
				// 	  }  
				// });
				// var nary = arrayVaule.sort();
				// for (var k = 0; k < nary.length; i++) {
				//   if (nary[k] == nary[k + 1]) {
				//         tempFlag = true;
				//   }
				// };
				// if(tempFlag){
				// 	alert("别名过长且前28位重复,SQL处理不了,建议修改SQL!!!");
				// 	return;
				// }; 


				var usuallyOrwarning = $("#" + id).find('input[name = "'+id+'_usuallyOrwarning"]:checked').val();
                var _bigBaoRate = $("#"+id+"_bigBaoRate").val();
                var _index = $("#"+id+"_index").val();
                var _indexValue = $("#"+id+"_indexValue").val();
                
                //_index = _index.substring(0,28) + "_F";  //处理有些字段过长,只取前28位
                _index += "_FT";  // 添加浮动率标识
                if(_index == "1"){
				   conditions[id+"_isWarning"] = "f";
                }else{
				   conditions[id+"_isWarning"] = usuallyOrwarning == "warning"?"t":"f";
                }
				conditions[id+"_bigBaoRateValue"] = _bigBaoRate;
				conditions[id+"_indexName"] = _index;
				conditions[id+"_floatingRate"] = _indexValue;
			}
			
			//忙时时间段条件
			else if (type == "busyTimeParagraph") {
                var timeStr = ""; //  "00,01,02"
                $("#"+id).find("input[name = "+id+"]").each(function(index, el) {
                	           if ($(el).prop("checked")) {
                	               timeStr += $(el).attr('values') + ",";
                	           };
                });
                if (timeStr == "") {alert("请至少选择一个忙时间点!");return};

				conditions[id] = timeStr.substring(0,timeStr.length-1);     //是否设备查询
				//console.log(conditions)
			}
			
			//小区列表条件的值
			else if (type == "cellList") {
				var lacciArr = $("#"+id+"_textarea").val().split("\n");
				conditions[id] = lacciArr.join(",");
			}
			//组合复选框条件的值
			else if (type == "comboCheckbox") {
				var radioType = $("#"+id+"_radio > span > input[type='radio']:checked").val(),
	        		checkboxArr = $("#"+id+"_"+radioType+" > span > input[type='checkbox']:checked"),
	        		valArr = [];
	        	for(var box_i=0, box_len=checkboxArr.length; box_i<box_len; box_i++){
	        		valArr.push(checkboxArr[box_i].value);
	        	}
        	
	        	conditions[id+"_radioType"] = radioType;
				conditions[id] = valArr.join(",");
			}
		}
		//---------------------------------------------------------------------------------------------
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
		//调用接口传递条件   
		//var report_id = publicReport.getCurryId(); 
		var report_id = $("#curr_id_div").html();
		var data = {
			"report_id": report_id,
			"conditions": conditions,
			"logic_sql_info": ""
		};
		var dataStr = JSON.stringify(data);
		$('body').mask("数据加载中,请稍等.....")
		var res = commonAjax(configUrl_main.srpt_rcpt_checkOrQueryReport, dataStr, "", "");
		//var res = commonAjax("/srpt/rcpt/checkOrQueryReport",dataStr,"","");
		if (!res || !res.success) {
			$("body").unmask();
			alert("查询异常!");
			return;
		};
		$("body").unmask();
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
	updateTimeStyle: function(type, time) {
		var re1 = new RegExp("-", "g");
		var re2 = new RegExp(":", "g");
		var re3 = new RegExp(" ", "g");
		var time = time.replace(re1, "");
		var time = time.replace(re2, "");
		var time = time.replace(re3, "");

		if (type == "hour") {
			time += "00";
		};
		if (type == "day") {
			time += "0000";
		};
		if (type == "week") {
			time += "000000";
		};
		if (type == "month") {
			time += "000000";
		};
		return time;
	}
};