var count = 0;
var currEnabled = "";
var addReport = {
	init: function() {
		addReport.lianxuOrlisan("lianxu");
		//setDivLoading("cententDiv");
		$('#cententDiv').mask("数据正在加载中,请稍等....");
		addReport.updateReportGetParentData();
		addReport.initDataPool();
		addReport.initXialaType();
		addReport.initXialaType_convergeCheckbox();
		addReport.initXialaType_convergeCheckboxDetail();
		addReport.initXialaType_comboCheckbox();
		//hideDivLoading("cententDiv");
		$('#cententDiv').unmask();
	},
	addModel: function() {
		$("#mymodal").modal("toggle");
	},
	initXialaType: function() {
			$("#xialaType").html("");
			var dataA = {
				"ifId": "srpt-enum-compDropDown"
			};
			var dataStrA = JSON.stringify(dataA);
			var res = commonAjax(configUrl_main.query_compDropDown, dataStrA, "", "");
			//var res = commonAjax("/srpt/rcpt/common/query",dataStrA,"","");  
			if (res.success) {
				var data = res.data;
				for (var item in data) {
					$("#xialaType").append('<option  value="' + data[item].id + '">' + data[item].describe + '</option>')
				};
			} else {
				alert("下拉数据类型加载失败!");
			};
	},
	initXialaType_convergeCheckbox: function() {
		   $("#xialaType_convergeCheckbox").html("");
		   var dataA = {
		   	       "ifId": "srpt-cfg-enum-conv-check"
		   };
		   var dataStrA = JSON.stringify(dataA);
		   //var res = commonAjax(configUrl_main.query_compDropDown, dataStrA, "", "");
		   var res = commonAjax("/sml/query/srpt-cfg-enum-conv-check",dataStrA,"","");  
		   //var data = {"1111":{"id":"111","describe":"111"},"222":{"id":"222","describe":"222"}}
		   if (res.success) {
		   	       var data = res.data;
		           for (var item in data) {
						$("#xialaType_convergeCheckbox").append('<option  value="' + data[item].id + '">' + data[item].describe + '</option>')
				   };
		   } else {
				alert("下拉数据类型加载失败!");
			};
			
	},
	initXialaType_convergeCheckboxDetail: function() {
		      $("#xialaType_convergeCheckboxDetail").html("");
		      var dataA = {
		      	       "ifId": "srpt-cfg-enum-conv-check"
		      };
		      var dataStrA = JSON.stringify(dataA);
		      var res = commonAjax("/sml/query/srpt-cfg-enum-conv-check",dataStrA,"","");  
		      //var data = {"1111":{"id":"111","describe":"111"},"222":{"id":"222","describe":"222"}}
		      if (res.success) {
		      	       var data = res.data;
		              for (var item in data) {
		   				$("#xialaType_convergeCheckboxDetail").append('<option  value="' + data[item].id + '">' + data[item].describe + '</option>')
		   		   };
		      } else {
		   		alert("下拉数据类型加载失败!");
		   	};
		
		  /* var data = {"333":{"id":"333","describe":"333"},"444":{"id":"444","describe":"444"}}
           for (var item in data) {
				$("#xialaType_convergeCheckboxDetail").append('<option  value="' + data[item].id + '">' + data[item].describe + '</option>')
		   };*/
			
	},
	initXialaType_comboCheckbox: function() {
		var url = "/sml/query/srpt-cfg-enum-comp-check",
			param = {
	      	 "ifId": "srpt-cfg-enum-conv-check"
	    };
	    var paramStr = JSON.stringify(param);
	    var res = commonAjax(url,paramStr,"","");
		/*var data = {
				"srpt-enum-city-name,srpt-enum-metro,srpt-enum-shudi":{
					id: "srpt-enum-city-name,srpt-enum-metro,srpt-enum-shudi",
					describe: "行政区,地铁,属地"
				}
		};*/
	    if (res.success) {
			var data = res.data;
			$("#xialaType_comboCheckbox").html("");
			for (var item in data) {
				$("#xialaType_comboCheckbox").append('<option  value="' + data[item].id + '">' + data[item].describe + '</option>')
			}
		} else {
			alert("下拉数据类型加载失败!");
		}
	},
	initDataPool: function() {
		var currSelect = "";

		//找到当前报表的数据源
		var updateReportId = $("#updateReportId").html();
		var dataA = {
			"ifId": "srpt-cfg-menuQueryself",
			"id": updateReportId
		};
		var dataStrA = JSON.stringify(dataA);
		var res = commonAjax(configUrl_main.query_menuQueryself, dataStrA, "", "");
		//var res = commonAjax("/srpt/rcpt/common/query",dataStrA,"","");  
		currSelect = res.data[0].data_source_id;
		currEnabled = res.data[0].enabled;

		//-------------------------------------------
		var data = {
			"ifId": "srpt-enum-dataSource"
		};
		var dataStr = JSON.stringify(data);
		var res1 = commonAjax(configUrl_main.query_dataSource, dataStr, "", "");
		//var res1 = commonAjax("/srpt/rcpt/common/query",dataStr,"",""); 
		var result = res1.data;
		$("#dataPool").html(''); //首先清空
		for (var item in result) {
			if (currSelect == result[item].id_) {
				$("#dataPool").append("<option selected='selected' value='" + result[item].id_ + "'>" + result[item].name_ + "</option>");
			} else {
				$("#dataPool").append("<option value='" + result[item].id_ + "'>" + result[item].name_ + "</option>");
			};
		};
	},
	addTextArea: function(divId) {
		var div = $("#" + divId).find("span").eq(1).html();
		var sqlContent = $("#sqlContent").val();
		//----------------------------------------
		addReport.insertAtCursor(document.getElementById("sqlContent"), div);
		//----------------------------------------
	},
	addElement: function() {
		var lie = 3;
		var htmlStr = "";
		var zujianArray = new Array();
		$("#addDiv").find("div").each(function(index, el) {
			var isRequire = "";
			if ($(this).find("input[type='checkbox']").eq(0).is(':checked')) {
				isRequire = "t_Require";
			} else {
				isRequire = "f_Require";
			};
			var zujianAttrStr = $(this).find("p").eq(0).html();
			var zujianAttr = eval('(' + zujianAttrStr + ')') //字符串转成对象
			zujianAttr.isRequire = isRequire;
			zujianArray.push(zujianAttr);
		});
		// console.log(zujianArray);
		//添加sql信息的select框数据
		//-------------------------------------------------------
		$("#zujianSelect").html("");
		$("#zujianSelect").css("display", "none");
		var lianxuOrlisan = $("input[name = 'lianxuOrlisan']:checked").val();
		var startTime = {
			id: "startTime",
			isRequire: "f_Require",
			label: "开始时间",
		};
		var endTime = {
			id: "endTime",
			isRequire: "f_Require",
			label: "结束时间",
		};
		var discteteTime = {
			id: "discteteTime",
			isRequire: "f_Require",
			label: "离散时间",
		};

		if (lianxuOrlisan == "lianxu") {
			zujianArray.unshift(startTime, endTime);
		}
		else if (lianxuOrlisan == "lisan") {
			zujianArray.unshift(discteteTime);
		}

		var zujianArrayNew = [];
		if (lianxuOrlisan == "lianxu") {
			for (var i = 0; i < zujianArray.length; i++) {
				if (i == 0) {
					continue;
				};
				if (i == 1) {
					continue;
				};
				zujianArrayNew.push(zujianArray[i]);
			};
		}
		else if (lianxuOrlisan == "lisan") {
			for (var i = 0; i < zujianArray.length; i++) {
				if (i == 0) {
					continue;
				};
				zujianArrayNew.push(zujianArray[i]);
			};
		}

		for (var i = 0; i < zujianArray.length; i++) {
			$("#zujianSelect").css("display", "block");
			var zujian = zujianArray[i], 
				id = zujian.id,
				type = zujian.type,
				label = zujian.label;
			var lableGet0 = label.split(",")[0];
			if ( type && type== "indexWarning") {
                  var STR = '<div id="div_' + i + '" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
                  	'<span style="display: inline-block;margin-right: 10px;">是否预警:</span><span style="display: inline-block; ">'+id+'_isWarning</span></div>'
                  $("#zujianSelect").append(STR);

                  var STR = '<div id="div_' + i + '_" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
                  	'<span style="display: inline-block; margin-right: 10px">大包下载速率值:</span><span style="display: inline-block;">'+id+'_bigBaoRateValue</span></div>'
                  $("#zujianSelect").append(STR);

                  var STR = '<div id="div_' + i + '__" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
                  	'<span style="display: inline-block; margin-right: 10px">字段(英文名):</span><span style="display: inline-block;">'+id+'_indexName</span></div>'
                  $("#zujianSelect").append(STR);

                  var STR = '<div id="div_' + i + '___" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
                  	'<span style="display: inline-block; margin-right: 10px">浮动率:</span><span style="display: inline-block;">'+id+'_floatingRate</span></div>'
                  $("#zujianSelect").append(STR);
			}
			else if ( type && type== "conditionToDevice") {
                  var STR = '<div id="div_' + i + '" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
                  	'<span style="display: inline-block;margin-right: 10px;">'+lableGet0+'设备选择</span><span style="display: inline-block; ">shebeiOrduankouIdStr</span></div>'
                    $("#zujianSelect").append(STR);
                  
			}
			else if ( type && type== "conditionToPort") {
                  var STR = '<div id="div_' + i + '" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
                  	'<span style="display: inline-block;margin-right: 10px;">'+lableGet0+'端口选择</span><span style="display: inline-block; ">shebeiOrduankouIdStr</span></div>'
                    $("#zujianSelect").append(STR);
                  
			}
			else if ( type && type== "demoselectNew") {
                  var STR = '<div id="div_' + i + '" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
                  	'<span style="display: inline-block;margin-right: 10px;">是否设备:</span><span style="display: inline-block; ">isShebei</span></div>'
                  $("#zujianSelect").append(STR);

                  var STR = '<div id="div_' + i + '_" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
                  	'<span style="display: inline-block; margin-right: 10px">是否模板:</span><span style="display: inline-block;">isDemo</span></div>'
                  $("#zujianSelect").append(STR);

                  var STR = '<div id="div_' + i + '__" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
                  	'<span style="display: inline-block; margin-right: 10px">条件ID字符串:</span><span style="display: inline-block;">shebeiOrduankouIdStr</span></div>'
                  $("#zujianSelect").append(STR);

                  var STR = '<div id="div_' + i + '___" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
                  	'<span style="display: inline-block; margin-right: 10px">模板ID:</span><span style="display: inline-block;">demoId</span></div>'
                  $("#zujianSelect").append(STR);
			}
			else if ( type && type== "convergeCheckbox") {
                  var STR = '<div id="div_' + i + '" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
                  	'<span style="display: inline-block;margin-right: 10px;">'+lableGet0+'-是否汇聚:</span><span style="display: inline-block; ">'+id+'_isConverge</span></div>'
                  $("#zujianSelect").append(STR);

                  var STR = '<div id="div_' + i + '_" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
                  	'<span style="display: inline-block; margin-right: 10px">' + lableGet0 + ':</span><span style="display: inline-block;">'+id+'_convergeCheckbox</span></div>'
                  $("#zujianSelect").append(STR);
			}
			else if ( type && type== "convergeCheckboxDetail") {
                  var STR = '<div id="div_' + i + '" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
                  	'<span style="display: inline-block;margin-right: 10px;">'+lableGet0+'-是否汇聚:</span><span style="display: inline-block; ">'+id+'_isConverge</span></div>'
                  $("#zujianSelect").append(STR);

                  var STR = '<div id="div_' + i + '_" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
                  	'<span style="display: inline-block; margin-right: 10px">' + lableGet0 + ':</span><span style="display: inline-block;">'+id+'_convergeCheckboxDetail</span></div>'
                  $("#zujianSelect").append(STR);
			}
			else if(type && type== "busyTimeParagraph"){
				var realLabel = label.split("|")[0];
				var STR = '<div id="div_' + i + '" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
					'<span style="display: inline-block; margin-right: 10px;">' + realLabel + ':</span><span style="display: inline-block;">' + id + '</span></div>'
				$("#zujianSelect").append(STR);
			}
			else if(type && type== "comboCheckbox"){
				var STR = '<div id="div_' + i + '" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
              	'<span style="display: inline-block;margin-right: 10px;">'+label+'-条件类型:</span><span style="display: inline-block; ">'+id+'_radioType</span></div>'
              $("#zujianSelect").append(STR);
				var STR = '<div id="div_' + i + '_0" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
              	'<span style="display: inline-block;margin-right: 10px;">'+label+':</span><span style="display: inline-block; ">'+id+'</span></div>'
              $("#zujianSelect").append(STR);
			}
			else{
					var STR = '<div id="div_' + i + '" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
						'<span style="display: inline-block; margin-right: 10px;">' + label + ':</span><span style="display: inline-block;">' + id + '</span></div>'
					$("#zujianSelect").append(STR);
			};
		};

		//-------------------------------------------------------
		var otherConditionDivWidth = $("#otherCondition").width() - 5;
		var tdWidth = (otherConditionDivWidth / lie).toFixed(0);

		var tableFlag = 0;
		for (var i = 0; i < zujianArrayNew.length; i++) { //判断是否有普通组件,添加table的开始标签
			var zujianType = zujianArrayNew[i].type;
			if (zujianType == "text" || zujianType == "select") {
				if (tableFlag < 1) {
					htmlStr += '<table>';
					tableFlag++;
				};

			};
		};

		$("#otherConWai").css("display", "none");
		var ii = -1;
		var jj = 0; //计算除去非tr,td的组件数量
		for (var i = 0; i < zujianArrayNew.length; i++) {
			var zujianNew = zujianArrayNew[i],
				id = zujianNew.id,
				type = zujianNew.type,
				label = zujianNew.label,
				isRequire = zujianNew.isRequire;
			$("#otherConWai").css("display", "block");
			//-------------------------------------
			// type "checkbox"
			// id "qry_3"
			// isRequire "f_Require"
			if (type == "checkbox") {
				jj++;
				if (i == zujianArrayNew.length - 1) {
					htmlStr += '</tr></table>';
				}; //防止最后一个是特殊组件,这样普通组件会缺失
				continue;
			}
			else if (type == "leftRight") {
				jj++;
				if (i == zujianArrayNew.length - 1) {
					htmlStr += '</tr></table>';
				};
				continue;
			}
			else if (type == "leftrightliandong") {
				jj++;
				if (i == zujianArrayNew.length - 1) {
					htmlStr += '</tr></table>';
				};
				continue;
			}
			else if (type == "demoselect") {
				jj++;
				if (i == zujianArrayNew.length - 1) {
					htmlStr += '</tr></table>';
				};
				continue;
			}
			else if (type == "convergeCheckbox") {
				jj++;
				if (i == zujianArrayNew.length - 1) {
					htmlStr += '</tr></table>';
				};
				continue;
			}
			else if (type == "convergeCheckboxDetail") {
				jj++;
				if (i == zujianArrayNew.length - 1) {
					htmlStr += '</tr></table>';
				};
				continue;
			}
			else if (type == "demoselectNew") {
				jj++;
				if (i == zujianArrayNew.length - 1) {
					htmlStr += '</tr></table>';
				};
				continue;
			}
			else if (type == "conditionToDevice") {
				jj++;
				if (i == zujianArrayNew.length - 1) {
					htmlStr += '</tr></table>';
				};
				continue;
			}
			else if (type == "conditionToPort") {
				jj++;
				if (i == zujianArrayNew.length - 1) {
					htmlStr += '</tr></table>';
				};
				continue;
			}
			else if (type == "indexWarning") {
				jj++;
				if (i == zujianArrayNew.length - 1) {
					htmlStr += '</tr></table>';
				};
				continue;
			}
			else if (type == "busyTimeParagraph") {
				jj++;
				if (i == zujianArrayNew.length - 1) {
					htmlStr += '</tr></table>';
				};
				continue;
			}
			else if (type == "cellList") {
				jj++;
				if (i == zujianArrayNew.length - 1) {
					htmlStr += '</tr></table>';
				};
				continue;
			}
			else if (type == "comboCheckbox") {
				jj++;
				if (i == zujianArrayNew.length - 1) {
					htmlStr += '</tr></table>';
				};
				continue;
			}
			//-------------------------------------

			else if (type == "text" || type == "select") { //判断是否添加普通组件

				//是否必填
				//-------------------------------------
				
				var displayflag = "none"
				if (isRequire == "t_Require") {
					displayflag = "inline-block"
				};
				//-------------------------------------

				ii++;

				var groupNum = ii % lie;
				var rowNum = (ii / lie).toFixed(0);
				if (groupNum == 0) {
					htmlStr += '<tr style="height: 50px">';
				};


				if (type == "text") {
					htmlStr += showComponentSource.getshurukuang(tdWidth, label, displayflag, id, type, zujianNew.isRequire);
				};
				if (type == "select") {
					htmlStr += showComponentSource.getxialakuang(tdWidth, label, displayflag, id, type, zujianNew.isRequire, zujianNew.xialaType);
				};

				if (groupNum == lie - 1) {
					htmlStr += '</tr>';
				};
				if (ii + 1 == (zujianArrayNew.length - jj)) {
					htmlStr += '</tr></table>';
				};
			}; //判断是否添加普通组件


		};

		for (var i = 0; i < zujianArrayNew.length; i++) {
			var zujianNew = zujianArrayNew[i],
				id = zujianNew.id,
				type = zujianNew.type,
				label = zujianNew.label,
				isRequire = zujianNew.isRequire;
			if (type == "checkbox") {
				htmlStr += showComponentSource.getfuxuankuang(label, id, type, isRequire, zujianNew.xialaType);
			}
			else if (type == "leftRight") {
				htmlStr += showComponentSource.getleftrightkuang(label, id, type, isRequire, zujianNew.xialaType);
			}
			else if (type == "leftrightliandong") {
				htmlStr += showComponentSource.getleftrightliandong(label, id, type, isRequire, zujianNew.xialaType);
			}
			else if (type == "demoselect") {
				htmlStr += showComponentSource.getdemoselect(label, id, type, isRequire);
			}
			else if (type == "convergeCheckbox") {
				htmlStr += showComponentSource.getconvergeCheckbox(label, id, type, isRequire,zujianNew.xialaType);
			}
			else if (type == "convergeCheckboxDetail") {
				htmlStr += showComponentSource.getconvergeCheckboxDetail(label, id, type, isRequire,zujianNew.xialaType);
			}
			else if (type == "demoselectNew") {
				htmlStr += showComponentSource.getdemoselectNew(label, id, type, isRequire);
			}
			else if (type == "indexWarning") {
				htmlStr += showComponentSource.getindexWarning(label, id, type, isRequire);
			}
			else if (type == "conditionToDevice") {
				htmlStr += showComponentSource.getconditionToDevice(label, id, type, isRequire);
			}
			else if (type == "conditionToPort") {
				htmlStr += showComponentSource.getconditionToPort(label, id, type, isRequire);
			}
			else if (type == "busyTimeParagraph") {
				htmlStr += showComponentSource.getbusyTimeParagraph(label, id, type, isRequire);
			}
			else if (type == "cellList") {
				htmlStr += showComponentSource.getcellList(label, id, type, isRequire);
			}
			else if (type == "comboCheckbox") {
				htmlStr += showComponentSource.getcomboCheckbox(label, id, type, isRequire,zujianNew.xialaType);
			}


		};


		$("#otherCondition").html(htmlStr);
		//添加选中事件
		for (var i = 0; i < zujianArrayNew.length; i++) {
			var zujian = zujianArrayNew[i],
				zujianId = zujian.id,
				zujianLabel = zujian.label,
				zujianType = zujian.type;
			if (zujianType == "checkbox") {

			};
			if (zujianType == "leftRight") {
				suppleMethod.showComponentSource_getleftrightkuang(zujianId);
			};
			if (zujianType == "leftrightliandong") {

			};
			if (zujianType == "demoselectNew") {

			};
			if (zujianType == "busyTimeParagraph") {
				    busyTimeParagraph.defaultCheckedEvent(zujianId, zujianLabel);  
			};
			if (zujianType == "cellList") {
				cellList.defaultInit(zujianId);
			}
		};

	},
	addZujian: function() {
		var ad = document.getElementById("ad");
		var node = document.createElement("div");
		node.style.height = "50px";
		var zujianLabel = $("#zujianLabel").val();
		var zujianType = $("#zujianType").val();
		var xialaType = $("#xialaType").val();


		//-----------------------------------------
		if (zujianType == "fuxuankuang" || zujianType == "leftrightkuang" || zujianType == "leftrightliangdong") {
			//zujianLabel = "checkboxs";
			node.style.height = "83%";
			//node.style.margin = "0 0 10px 0"; 

		}
		else if (zujianType == "demoselect") {
			//zujianLabel = "checkboxs";
			node.style.height = "34%";
			//node.style.margin = "0 0 10px 0"; 

		}
		else if (zujianType == "convergeCheckbox") {
			//zujianLabel = "checkboxs";
			node.style.height = "45%";
			//node.style.margin = "0 0 10px 0"; 

		}
		else if (zujianType == "convergeCheckboxDetail") {
			//zujianLabel = "checkboxs";
			node.style.height = "45%";
			//node.style.margin = "0 0 10px 0"; 

		}
		else if (zujianType == "demoselectNew") {
			//zujianLabel = "checkboxs";
			node.style.height = "45%";
			//node.style.margin = "0 0 10px 0"; 

		}
		else if (zujianType == "indexWarning") {
			//zujianLabel = "checkboxs";
			node.style.height = "45%";
			//node.style.margin = "0 0 10px 0"; 

		}
		else if (zujianType == "conditionToDevice") {
			//zujianLabel = "checkboxs";
			node.style.height = "45%";
			//node.style.margin = "0 0 10px 0"; 

		}
		else if (zujianType == "conditionToPort") {
			//zujianLabel = "checkboxs";
			node.style.height = "45%";
			//node.style.margin = "0 0 10px 0"; 

		}
		else if (zujianType == "busyTimeParagraph") {
			//zujianLabel = "checkboxs";
			node.style.height = "45%";
			//node.style.margin = "0 0 10px 0"; 

		}
		else if (zujianType == "cellList") {
			//zujianLabel = "checkboxs";
			node.style.height = "45%";
			//node.style.margin = "0 0 10px 0"; 
		}
		else if (zujianType == "comboCheckbox") {
			//zujianLabel = "checkboxs";
			node.style.height = "45%";
			//node.style.margin = "0 0 10px 0"; 
		}
		//-----------------------------------------
		var innerHTML = "";
		if (zujianLabel == " " || zujianLabel == "") {
			alert("请输入组件名称!");
		} else {
			if (zujianType == "shurukuang") {
				innerHTML += addComponentSource.getshurukuang(zujianLabel, count);
			}
			else if (zujianType == "xialakuang") {
				innerHTML += addComponentSource.getxialakuang(zujianLabel, count, xialaType);
			}
			else if (zujianType == "fuxuankuang") {
				innerHTML += addComponentSource.getfuxuankuang(zujianLabel, count, xialaType);
			}
			else if (zujianType == "leftrightkuang") {
				innerHTML += addComponentSource.getleftrightkuang(zujianLabel, count, xialaType);
			}
			else if (zujianType == "leftrightliangdong") {
				innerHTML += addComponentSource.getleftrightliandong(zujianLabel, count, xialaType);
			}
			else if (zujianType == "demoselect") {
				innerHTML += addComponentSource.getdemoselect(zujianLabel, count);
			}
			else if (zujianType == "convergeCheckbox") {
				var xialaType = $("#xialaType_convergeCheckbox").val();
				innerHTML += addComponentSource.getconvergeCheckbox(zujianLabel, count,xialaType);
			}
			else if (zujianType == "convergeCheckboxDetail") {
				var xialaType = $("#xialaType_convergeCheckboxDetail").val();
				innerHTML += addComponentSource.getconvergeCheckboxDetail(zujianLabel, count,xialaType);
			}
			else if (zujianType == "demoselectNew") {
				innerHTML += addComponentSource.getdemoselectNew(zujianLabel, count);
			}
			else if (zujianType == "indexWarning") {
				innerHTML += addComponentSource.getindexWarning(zujianLabel, count);
			}
			else if (zujianType == "conditionToDevice") {
				innerHTML += addComponentSource.getconditionToDevice(zujianLabel, count);
			}
			else if (zujianType == "conditionToPort") {
				innerHTML += addComponentSource.getconditionToPort(zujianLabel, count);
			}
			else if (zujianType == "busyTimeParagraph") {
				innerHTML += addComponentSource.getbusyTimeParagraph(zujianLabel, count);
			}
			else if (zujianType == "cellList") {
				innerHTML += addComponentSource.getcellList(zujianLabel, count);
			}
			else if (zujianType == "comboCheckbox") {
				var xialaType = $("#xialaType_comboCheckbox").val();
				innerHTML += addComponentSource.getcomboCheckbox(zujianLabel, count, xialaType);
			}

			count++;
			$("#zujianLabel").val(" ");

			node.innerHTML = innerHTML;
			ad.parentNode.insertBefore(node, ad);
			suppleMethod.addComponentSource_getleftrightkuang();
		};

	},
	delZujian: function(obj) {
		var aa = obj.parentNode;
		aa.parentNode.removeChild(aa);
	},
	xialaChange: function(value) {

		/*if(value == "xialakuang" || value == "fuxuankuang" || value == "leftrightkuang" || value == "leftrightliangdong"){
		    $("#xialaType").css("display","inline-block");
		}else{
		    $("#xialaType").css("display","none");
		};*/
		if (value == "xialakuang" || value == "fuxuankuang" || value == "leftrightkuang" || value == "leftrightliangdong") {
			
			$("#xialaType_chosen").css("display", "inline-block");
		} else {
			$("#xialaType_chosen").css("display", "none");
		};
		if (value == "convergeCheckbox") {
            $("#xialaType_convergeCheckbox_chosen").css("display", "inline-block");
		}else{
			$("#xialaType_convergeCheckbox_chosen").css("display", "none"); 
		};
		if (value == "convergeCheckboxDetail") {
            $("#xialaType_convergeCheckboxDetail_chosen").css("display", "inline-block");
		}else{
			$("#xialaType_convergeCheckboxDetail_chosen").css("display", "none"); 
		};
		if (value == "comboCheckbox") {
            $("#xialaType_comboCheckbox_chosen").css("display", "inline-block");
		}else{
			$("#xialaType_comboCheckbox_chosen").css("display", "none"); 
		};
	},
	lianxuOrlisan: function(value) {
		var zujianArray = [];

		$("#zujianSelect").find('div').each(function(index, el) {
			var obj = {
				label: "",
				id: ""
			};
			$(this).find("span").each(function(index, el) {
				if (index == 0) {

					if ($(this).html().indexOf("时间") > -1) {
						return;
					};
					obj.label = $(this).html();
				};
				if (index == 1) {
					if ($(this).html().indexOf("Time") > -1) {
						return;
					};
					obj.id = $(this).html();
				};

			});
			if (obj.label == "") {
				return;
			};
			zujianArray.push(obj);
		});

		var startTime = {
			id: "startTime",
			isRequire: "f_Require",
			label: "开始时间:",
		};
		var endTime = {
			id: "endTime",
			isRequire: "f_Require",
			label: "结束时间:",
		};
		var discteteTime = {
			id: "discteteTime",
			isRequire: "f_Require",
			label: "离散时间:",
		};

		if (value == "lianxu") {
			$("#lianxuDiv").css("display", "block");
			$("#lisanDiv").css("display", "none");
			zujianArray.unshift(startTime, endTime);
		} else {
			$("#lianxuDiv").css("display", "none");
			$("#lisanDiv").css("display", "block");
			zujianArray.unshift(discteteTime);

		};

		$("#zujianSelect").html("");
		$("#zujianSelect").css("display", "none");
		for (var i = 0; i < zujianArray.length; i++) {
			$("#zujianSelect").css("display", "block");
			var zujian = zujianArray[i],
				zujianId = zujian.id,
				zujianType = zujian.type,
				zujianLabel = zujian.label;
			var lableGet0 = zujianLabel.split(",")[0];
			/*var STR = '<div id="div_' + i + '" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
				'<span style="display: inline-block; margin-right: 10px">' + zujianLabel + '</span><span style="display: inline-block;">' + zujianId + '</span></div>'

			$("#zujianSelect").append(STR);*/
			if ( zujianType && zujianType== "indexWarning") {
                  var STR = '<div id="div_' + i + '" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
                  	'<span style="display: inline-block;margin-right: 10px;">是否预警:</span><span style="display: inline-block; ">'+zujianId+'_isWarning</span></div>'
                  $("#zujianSelect").append(STR);

                  var STR = '<div id="div_' + i + '_" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
                  	'<span style="display: inline-block; margin-right: 10px">大包下载速率值:</span><span style="display: inline-block;">'+zujianId+'_bigBaoRateValue</span></div>'
                  $("#zujianSelect").append(STR);

                  var STR = '<div id="div_' + i + '__" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
                  	'<span style="display: inline-block; margin-right: 10px">字段(英文名):</span><span style="display: inline-block;">'+zujianId+'_indexName</span></div>'
                  $("#zujianSelect").append(STR);

                  var STR = '<div id="div_' + i + '___" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
                  	'<span style="display: inline-block; margin-right: 10px">浮动率:</span><span style="display: inline-block;">'+zujianId+'_floatingRate</span></div>'
                  $("#zujianSelect").append(STR);
			}
			else if ( zujianType && zujianType== "conditionToDevice") {
                  var STR = '<div id="div_' + i + '" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
                  	'<span style="display: inline-block;margin-right: 10px;">'+lableGet0+'设备选择</span><span style="display: inline-block; ">shebeiOrduankouIdStr</span></div>'
                    $("#zujianSelect").append(STR);
                  
			}
			else if ( zujianType && zujianType== "conditionToPort") {
                  var STR = '<div id="div_' + i + '" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
                  	'<span style="display: inline-block;margin-right: 10px;">'+lableGet0+'端口选择</span><span style="display: inline-block; ">shebeiOrduankouIdStr</span></div>'
                    $("#zujianSelect").append(STR);
                  
			}
			else if ( zujianType && zujianType== "demoselectNew") {
                  var STR = '<div id="div_' + i + '" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
                  	'<span style="display: inline-block;margin-right: 10px;">是否设备:</span><span style="display: inline-block; ">isShebei</span></div>'
                  $("#zujianSelect").append(STR);

                  var STR = '<div id="div_' + i + '_" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
                  	'<span style="display: inline-block; margin-right: 10px">是否模板:</span><span style="display: inline-block;">isDemo</span></div>'
                  $("#zujianSelect").append(STR);

                  var STR = '<div id="div_' + i + '__" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
                  	'<span style="display: inline-block; margin-right: 10px">条件ID字符串:</span><span style="display: inline-block;">shebeiOrduankouIdStr</span></div>'
                  $("#zujianSelect").append(STR);

                  var STR = '<div id="div_' + i + '___" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
                  	'<span style="display: inline-block; margin-right: 10px">模板ID:</span><span style="display: inline-block;">demoId</span></div>'
                  $("#zujianSelect").append(STR);
			}
			else if ( zujianType && zujianType== "convergeCheckbox") {
                  var STR = '<div id="div_' + i + '" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
                  	'<span style="display: inline-block;margin-right: 10px;">'+lableGet0+'-是否汇聚:</span><span style="display: inline-block; ">'+zujianId+'_isConverge</span></div>'
                  $("#zujianSelect").append(STR);

                  var STR = '<div id="div_' + i + '_" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
                  	'<span style="display: inline-block; margin-right: 10px">' + lableGet0 + ':</span><span style="display: inline-block;">'+zujianId+'_convergeCheckbox</span></div>'
                  $("#zujianSelect").append(STR);
			}
			else if ( zujianType && zujianType== "convergeCheckboxDetail") {
                  var STR = '<div id="div_' + i + '" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
                  	'<span style="display: inline-block;margin-right: 10px;">'+lableGet0+'-是否汇聚:</span><span style="display: inline-block; ">'+zujianId+'_isConverge</span></div>'
                  $("#zujianSelect").append(STR);

                  var STR = '<div id="div_' + i + '_" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
                  	'<span style="display: inline-block; margin-right: 10px">' + lableGet0 + ':</span><span style="display: inline-block;">'+zujianId+'_convergeCheckboxDetail</span></div>'
                  $("#zujianSelect").append(STR);
			}else{
					var STR = '<div id="div_' + i + '" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
						'<span style="display: inline-block; margin-right: 10px;">' + zujianLabel + ':</span><span style="display: inline-block;">' + zujianId + '</span></div>'
					$("#zujianSelect").append(STR);
			};
		};
	},
	save: function() {

		var report_id = $("#updateReportId").html();
		var reportNames = $("#reportName").val();
		var reportName = reportNames.trim();
		var data_source_id = $("#dataPool").val();
		if (reportName == "" || reportName.trim() == "") {
			alert("名称不能为空!");
			return;
		};
		var flag = addReport.checkUpdateMenueName(reportName);
		if (flag == 1) {
			alert("该名称已存在!");
			return;
		};
		var dataPoolId = $("#dataPool").val();
		var qry_bd_info = {}; //保存条件的数组
		var time = {
			db_info: {
				lianxuOrlisan: ""
			},
			query_param: [],
			count: count
		};

		//添加时间组件信息
		var lianxuOrlisan = $("input[name='lianxuOrlisan']:checked").val();
		var timeTypeArr = new Array(); //保存时间类型的数组
		$("input[name='timeType']:checked").each(function(index, el) {
			timeTypeArr.push($(this).val());
		});
		//后添加
		var timeChecked = document.getElementById('checkbox_timeSelect').checked;
		if(timeChecked) {
			time.db_info.timeChecked = true;
		}else {
			time.db_info.timeChecked = false;
		}
		//
		time.db_info.lianxuOrlisan = lianxuOrlisan;
		time.query_param.push(timeTypeArr);

		qry_bd_info.time = time; //把时间信息放到qry_bd_info中
		//添加其他组件信息 
		var otherCondition = [];
		//添加普通组件
		$("#otherCondition").find("td").each(function(index, el) {
			var zujianAttrStr = $(this).find("p").eq(0).html();
			if (zujianAttrStr == null || zujianAttrStr == "null") {return true;};
			var zujianAttr = eval('(' + zujianAttrStr + ')')
			otherCondition.push(zujianAttr);
		});
		//---保存新增左右选择组件---复选框组件----左右联动组件----------------------------------------  找元素,判断其size();
		$("#otherCondition").find($("span[name = 'otherSpecialCondition']")).each(function(index, el) {
			var leftRightZujianStr = $(this).find('p').eq(0).html();
			if (leftRightZujianStr == null || leftRightZujianStr == "null") {return true;};
			var leftRightZujian = eval('(' + leftRightZujianStr + ')')
			otherCondition.push(leftRightZujian);
		});
		//-------------------------------------------------- 

		//后添加
		//组合查询信息
		var customStr = $('#multiSelCondition').find('p').html();
		if(customStr) {
			otherCondition.push(eval('(' + customStr + ')'));
		}
		//
		qry_bd_info.otherCondition = otherCondition;
		var qry_bd_info_str = JSON.stringify(qry_bd_info); //-----------------------------------------------------------------
		var sql_logic_info = $("#sqlContent").val();
		var parent_id = addReport.getParentId(); //获取父级目录的id;

		var update_time = new Date();
		var update_timedate = update_time.format("yyyyMMddhhmm");
		//------------------------------------------------
		var enabled = 4;
		enabled = (currEnabled == 4 ? 1 : currEnabled);
		//------------------------------------------------
		//修改报表名称到菜单
		var data = {
			"dbId": "srpt",
			"tableName": configUrl_main.dm_co_ba_srpt_menu_tableName,
			//"tableName":"dm_co_ba_srpt_menu",
			"type": "update",
			"conditions": ["id_"],
			"data": {
				"id_": report_id,
				"name_": reportName,
				"type_": 1,
				"enabled": enabled,
				//"data_source_id":data_source_id,
				"descr_": ""
			}
		};
		var dataStr = JSON.stringify(data);
		// var res = commonAjax("/srpt/rcpt/common/update",dataStr,"","");
		// if(res.resultCode == 0){
		//     parent.mainE.updateReportName(report_id,reportName);
		// };

		//修改报表信息
		var dataB = {
			"dbId": "srpt",
			"tableName": configUrl_main.dm_co_ba_srpt_report_tableName,
			//"tableName":"dm_co_ba_srpt_report",
			"type": "update",
			"conditions": ["report_id"],
			"data": {
				"report_id": report_id,
				//"enabled":1, 
				"qry_bd_info": qry_bd_info_str,
				"sql_logic_info": sql_logic_info,
				"data_source_id": data_source_id,
				"update_time@date": update_timedate
				//"field_info": ""
			}
		};
		var indexInfoClear = $("#indexInfoClear").prop("checked");
		if (indexInfoClear) {
           dataB.data.field_info = "";
		};
		var dataStrB = JSON.stringify(dataB);
		var updateReportName = $("#updateReportName").html();
		var msg = "确定保存报表吗?"
		if (confirm(msg) == true) {
			var res = commonAjax(configUrl_main.update_update, dataStr, "", "");
			//var res = commonAjax("/srpt/rcpt/common/update",dataStr,"","");
			if (res.resultCode == 0 || res.msg == "success") {
				parent.mainE.updateReportName(report_id, reportName);
			} else {
				return;
			};
			var res1 = commonAjax(configUrl_main.update_update, dataStrB, "", "");
			//var res1 = commonAjax("/srpt/rcpt/common/update",dataStrB,"","");
			if (res1.resultCode == 0 || res1.msg == "success") {
				var msg1 = "保存成功,发布吗?"
				if (confirm(msg1) == true) {
					addReport.publishReport();
				};
				addReport.closetab(updateReportName); //关闭当前新增页面
			};

		};

	},
	publishReport: function() {
		var updateReportId = $("#updateReportId").html();
		var updateReportName = $("#updateReportName").html();
		var id_name = [updateReportId, updateReportName];
		var data = {
			"ifId": "srpt-cfg-menuQueryself",
			"id": updateReportId
		};
		var dataStr = JSON.stringify(data);
		var res = commonAjax(configUrl_main.query_menuQueryself, dataStr, "", "");
		//var res = commonAjax("/srpt/rcpt/common/query",dataStr,"","");
		var result = res.data;
		var obj = result[0];
		if (obj.enabled == 4) {
			alert("请先保存报表!")
			return;
		};
		parent.mainE.createPublishTab(id_name);
	},

	preview: function() {
		var qry_bd_info = {}; //保存条件的对象
		var time = {
			db_info: {
				lianxuOrlisan: ""
			},
			query_param: [],
			count: count
		};
		//添加时间组件信息
		var lianxuOrlisan = $("input[name='lianxuOrlisan']:checked").val();
		var timeTypeArr = new Array(); //保存时间类型的数组
		$("input[name='timeType']:checked").each(function(index, el) {
			timeTypeArr.push($(this).val());
		});
		//后添加
		var timeChecked = document.getElementById('checkbox_timeSelect').checked;
		if(timeChecked) {
			time.db_info.timeChecked = true;
		}else {
			time.db_info.timeChecked = false;
		}
		//
		
		time.db_info.lianxuOrlisan = lianxuOrlisan;
		time.query_param.push(timeTypeArr);

		qry_bd_info.time = time; //把时间信息放到qry_bd_info中
		//添加其他组件信息 
		var otherCondition = [];
		$("#otherCondition").find("td").each(function(index, el) {
			var zujianAttrStr = $(this).find("p").eq(0).html();
			if (zujianAttrStr == null || zujianAttrStr == "null") {return true;};
			var zujianAttr = eval('(' + zujianAttrStr + ')')
			otherCondition.push(zujianAttr);
		});
		//---保存新增左右选择组件-----------------------------------------------  找元素,判断其size();
		$("#otherCondition").find($("span[name = 'otherSpecialCondition']")).each(function(index, el) {
			var leftRightZujianStr = $(this).find('p').eq(0).html();
			if (leftRightZujianStr == null || leftRightZujianStr == "null") {return true;};
			var leftRightZujian = eval('(' + leftRightZujianStr + ')')
			otherCondition.push(leftRightZujian);
		});
		//-------------------------------------------------- 

		//后添加
		//组合查询信息
		var customStr = $('#multiSelCondition').find('p').html();
		if(customStr) {
			otherCondition.push(eval('(' + customStr + ')'));
		}
		//

		qry_bd_info.otherCondition = otherCondition;
		var qry_bd_info_str = JSON.stringify(qry_bd_info); //为预览时获取全部页面数据
		var sql_logic_infos = $("#sqlContent").val();
		var sql_logic_info = addReport.valueReplace(sql_logic_infos);
		var info_sql_value = [];
		info_sql_value.push(qry_bd_info_str);
		info_sql_value.push(sql_logic_info);
		//console.log("预览打印sql--"+sql_logic_info);
		yulansqlbeiyong = sql_logic_info;
		var qry_bd_info_preview = qry_bd_info_str;
		var previewReportName = $("#reportName").val();
		var previewReportId = $("#updateReportId").html();
		parent.mainE.createPreviewReport(previewReportName, info_sql_value, previewReportId);
	},
	closetab: function(reportName) {
		parent.mainE.closetabs(reportName);
	},
	getParentId: function() {
		var Parent_Id = parent.mainE.getCurryMuluId();
		return Parent_Id;
	},
	getCurrTimeToId: function() {
		var date = new Date();
		var dateStr = date.format("yyyyMMddhhmmss");
		return dateStr;
	},
	reportAddTreeDynamic: function(arr, parent_id) {
		parent.mainE.addReportOf(arr, parent_id);
	},
	updateReportGetParentData: function() {
		var value = parent.mainE.updateDataToupdateReport(); //arr   id,reportName,time,otherCondition
		if (value == null) {
			return;
		};
		$("#curr_id_div").html(value[0]);
		$("#updateReportId").html(value[0]);
		$("#updateReportName").html(value[1]); //关闭tabs时用
		$("#reportName").val(value[1]);
		var time = value[2];
		count = time.count; //数字
		var lianxuOrlisan = time.db_info.lianxuOrlisan; //字符串   lisan   lianxu
		var timeType = time.query_param[0]; //数组 
		var otherCondition = value[3]; //数组,包含对象
		//后添加
		var timeChecked = time.db_info.timeChecked;
		if(timeChecked) {
			$('#checkbox_timeSelect').prop('checked', true);
		}else {
			$('#checkbox_timeSelect').prop('checked', false);
		}
		var otherConditionArr = otherCondition;
		var startTime = {
			id: "startTime",
			isRequire: "f_Require",
			label: "开始时间"
		};
		var endTime = {
			id: "endTime",
			isRequire: "f_Require",
			label: "结束时间"
		};
		var discteteTime = {
			id: "discteteTime",
			isRequire: "f_Require",
			label: "离散时间"
		};

		if (lianxuOrlisan == "lianxu") {
			otherConditionArr.unshift(startTime, endTime);
		};
		if (lianxuOrlisan == "lisan") {
			otherConditionArr.unshift(discteteTime);
		};

		var zujianArray = otherConditionArr;
		var zujianArrayNew = [];
		if (lianxuOrlisan == "lianxu") {
			for (var i = 0; i < zujianArray.length; i++) {
				if (i == 0) {
					continue;
				};
				if (i == 1) {
					continue;
				};
				zujianArrayNew.push(zujianArray[i]);
			};
		};
		if (lianxuOrlisan == "lisan") {
			for (var i = 0; i < zujianArray.length; i++) {
				if (i == 0) {
					continue;
				};
				zujianArrayNew.push(zujianArray[i]);
			};
		};
		//选择显示时间连续还是离散
		$("#" + lianxuOrlisan).attr("checked", "checked");
		addReport.lianxuOrlisan(lianxuOrlisan);

		for (var i = 0; i < timeType.length; i++) {
			$("#checkbox_" + timeType[i]).attr("checked", "checked");
			$("#labels_" + timeType[i]).attr("checked", "checked");
			//显示连续时间框
			//-----------------------------
			showLianxuTime.loadTime();
			$("#timeField_" + timeType[0]).css("display", "inline-block");
			$("#timeField_" + timeType[0] + "2").css("display", "inline-block");
			//-----------------------------
		};
		//还原页面sql
		$("#sqlContent").val(value[4]);
		//添加sql信息的select框数据
		//-------------------------------------------------------
		$("#zujianSelect").html("");
		$("#zujianSelect").css("display", "none");
		for (var i = 0; i < zujianArray.length; i++) {
			$("#zujianSelect").css("display", "block");
			var zujian = zujianArray[i],
				zujianId = zujian.id,
				zujianType = zujian.type,
				zujianLabel = zujian.label;
			var lableGet0 = zujianLabel.split(",")[0];
			/*var STR = '<div id="div_' + i + '" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
				'<span style="display: inline-block; margin-right: 10px">' + zujianLabel + ':</span><span style="display: inline-block; ">' + zujianId + '</span></div>'
			$("#zujianSelect").append(STR);*/
			if ( zujianType && zujianType== "indexWarning") {
                  var STR = '<div id="div_' + i + '" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
                  	'<span style="display: inline-block;margin-right: 10px;">是否预警:</span><span style="display: inline-block; ">'+zujianId+'_isWarning</span></div>'
                  $("#zujianSelect").append(STR);

                  var STR = '<div id="div_' + i + '_" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
                  	'<span style="display: inline-block; margin-right: 10px">大包下载速率值:</span><span style="display: inline-block;">'+zujianId+'_bigBaoRateValue</span></div>'
                  $("#zujianSelect").append(STR);

                  var STR = '<div id="div_' + i + '__" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
                  	'<span style="display: inline-block; margin-right: 10px">字段(英文名):</span><span style="display: inline-block;">'+zujianId+'_indexName</span></div>'
                  $("#zujianSelect").append(STR);

                  var STR = '<div id="div_' + i + '___" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
                  	'<span style="display: inline-block; margin-right: 10px">浮动率:</span><span style="display: inline-block;">'+zujianId+'_floatingRate</span></div>'
                  $("#zujianSelect").append(STR);
			}
			else if ( zujianType && zujianType== "conditionToDevice") {
                  var STR = '<div id="div_' + i + '" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
                  	'<span style="display: inline-block;margin-right: 10px;">'+lableGet0+'设备选择</span><span style="display: inline-block; ">shebeiOrduankouIdStr</span></div>'
                    $("#zujianSelect").append(STR);
                  
			}
			else if ( zujianType && zujianType== "conditionToPort") {
                  var STR = '<div id="div_' + i + '" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
                  	'<span style="display: inline-block;margin-right: 10px;">'+lableGet0+'端口选择</span><span style="display: inline-block; ">shebeiOrduankouIdStr</span></div>'
                    $("#zujianSelect").append(STR);
                  
			}
			else if ( zujianType && zujianType== "demoselectNew") {
                  var STR = '<div id="div_' + i + '" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
                  	'<span style="display: inline-block;margin-right: 10px;">是否设备:</span><span style="display: inline-block; ">isShebei</span></div>'
                  $("#zujianSelect").append(STR);

                  var STR = '<div id="div_' + i + '_" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
                  	'<span style="display: inline-block; margin-right: 10px">是否模板:</span><span style="display: inline-block;">isDemo</span></div>'
                  $("#zujianSelect").append(STR);

                  var STR = '<div id="div_' + i + '__" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
                  	'<span style="display: inline-block; margin-right: 10px">条件ID字符串:</span><span style="display: inline-block;">shebeiOrduankouIdStr</span></div>'
                  $("#zujianSelect").append(STR);

                  var STR = '<div id="div_' + i + '___" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
                  	'<span style="display: inline-block; margin-right: 10px">模板ID:</span><span style="display: inline-block;">demoId</span></div>'
                  $("#zujianSelect").append(STR);
			}
			else if ( zujianType && zujianType== "convergeCheckbox") {
                  var STR = '<div id="div_' + i + '" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
                  	'<span style="display: inline-block;margin-right: 10px;">'+lableGet0+'-是否汇聚:</span><span style="display: inline-block; ">'+zujianId+'_isConverge</span></div>'
                  $("#zujianSelect").append(STR);

                  var STR = '<div id="div_' + i + '_" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
                  	'<span style="display: inline-block; margin-right: 10px">' + lableGet0 + ':</span><span style="display: inline-block;">'+zujianId+'_convergeCheckbox</span></div>'
                  $("#zujianSelect").append(STR);
			}
			else if ( zujianType && zujianType== "convergeCheckboxDetail") {
                  var STR = '<div id="div_' + i + '" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
                  	'<span style="display: inline-block;margin-right: 10px;">'+lableGet0+'-是否汇聚:</span><span style="display: inline-block; ">'+zujianId+'_isConverge</span></div>'
                  $("#zujianSelect").append(STR);

                  var STR = '<div id="div_' + i + '_" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
                  	'<span style="display: inline-block; margin-right: 10px">' + lableGet0 + ':</span><span style="display: inline-block;">'+zujianId+'_convergeCheckboxDetail</span></div>'
                  $("#zujianSelect").append(STR);
			}
			else if ( zujianType && zujianType== "busyTimeParagraph") {
				var realLabel = zujianLabel.split("|")[0];
				var STR = '<div id="div_' + i + '" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
					'<span style="display: inline-block; margin-right: 10px;">' + realLabel + ':</span><span style="display: inline-block;">' + zujianId + '</span></div>'
				$("#zujianSelect").append(STR);
			}
			else if ( zujianType && zujianType== "comboCheckbox") {
                var STR = '<div id="div_' + i + '" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
                	'<span style="display: inline-block;margin-right: 10px;">'+zujianLabel+'-条件类型:</span><span style="display: inline-block; ">'+zujianId+'_radioType</span></div>'
                $("#zujianSelect").append(STR);
                
                var STR = '<div id="div_' + i + '_0" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
            		'<span style="display: inline-block;margin-right: 10px;">'+zujianLabel+':</span><span style="display: inline-block; ">'+zujianId+'</span></div>'
            	$("#zujianSelect").append(STR);
			}
			else{
					var STR = '<div id="div_' + i + '" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;" onclick="addReport.addTextArea(this.id)">' +
						'<span style="display: inline-block; margin-right: 10px;">' + zujianLabel + ':</span><span style="display: inline-block;">' + zujianId + '</span></div>'
					$("#zujianSelect").append(STR);
			};
		};
		//-------------------------------------------------------
		//还原页面组件

		var lie = 3;
		var htmlStr = "";
		var otherConditionDivWidth = $("#otherCondition").width() - 5;
		var tdWidth = (otherConditionDivWidth / lie).toFixed(0);

		var tableFlag = 0;
		for (var i = 0; i < zujianArrayNew.length; i++) { //判断是否有普通组件,添加table的开始标签
			var zujianType = zujianArrayNew[i].type;
			if (zujianType == "text" || zujianType == "select") {
				if (tableFlag < 1) {
					htmlStr += '<table>';
					tableFlag++;
				};

			};
		};


		$("#otherConWai").css("display", "none");

		var ii = -1;
		var jj = 0; //计算除去非tr,td的组件数量

		for (var i = 0; i < zujianArrayNew.length; i++) {
			$("#otherConWai").css("display", "block");
			var zujian = zujianArrayNew[i],
				zujianId = zujian.id,
				zujianType = zujian.type,
				zujianLabel = zujian.label,
				isRequire = zujian.isRequire;

			//-------------------------------------
			// type "checkbox"
			// id "qry_3"
			// isRequire "f_Require"
			if (zujianType == "checkbox") {
				jj++;
				if (i == zujianArrayNew.length - 1) {
					htmlStr += '</tr></table>';
				}; //防止最后一个是特殊组件,这样普通组件会缺失
				continue;
			}
			else if (zujianType == "leftRight") {
				jj++;
				if (i == zujianArrayNew.length - 1) {
					htmlStr += '</tr></table>';
				};
				continue;
			}
			else if (zujianType == "leftrightliandong") {
				jj++;
				if (i == zujianArrayNew.length - 1) {
					htmlStr += '</tr></table>';
				};
				continue;
			}
			else if (zujianType == "demoselect") {
				jj++;
				if (i == zujianArrayNew.length - 1) {
					htmlStr += '</tr></table>';
				};
				continue;
			}
			else if (zujianType == "convergeCheckbox") {
				jj++;
				if (i == zujianArrayNew.length - 1) {
					htmlStr += '</tr></table>';
				};
				continue;
			}
			else if (zujianType == "convergeCheckboxDetail") {
				jj++;
				if (i == zujianArrayNew.length - 1) {
					htmlStr += '</tr></table>';
				};
				continue;
			}
			else if (zujianType == "demoselectNew") {
				jj++;
				if (i == zujianArrayNew.length - 1) {
					htmlStr += '</tr></table>';
				};
				continue;
			}
			else if (zujianType == "indexWarning") {
				jj++;
				if (i == zujianArrayNew.length - 1) {
					htmlStr += '</tr></table>';
				};
				continue;
			}
			else if (zujianType == "conditionToDevice") {
				jj++;
				if (i == zujianArrayNew.length - 1) {
					htmlStr += '</tr></table>';
				};
				continue;
			}
			else if (zujianType == "conditionToPort") {
				jj++;
				if (i == zujianArrayNew.length - 1) {
					htmlStr += '</tr></table>';
				};
				continue;
			}
			else if (zujianType == "busyTimeParagraph") {
				jj++;
				if (i == zujianArrayNew.length - 1) {
					htmlStr += '</tr></table>';
				};
				continue;
			}
			else if (zujianType == "cellList") {
				jj++;
				if (i == zujianArrayNew.length - 1) {
					htmlStr += '</tr></table>';
				};
				continue;
			}
			else if (zujianType == "comboCheckbox") {
				jj++;
				if (i == zujianArrayNew.length - 1) {
					htmlStr += '</tr></table>';
				};
				continue;
			}
			//-------------------------------------

			else if (zujianType == "text" || zujianType == "select") { //判断是否添加普通组件
				//是否必填
				//-------------------------------------
				var displayflag = "none"
				if (isRequire == "t_Require") {
					displayflag = "inline-block"
				};
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
				if (ii + 1 == zujianArrayNew.length - jj) {
					htmlStr += '</tr></table>';
				};
			}
		};


		for (var i = 0; i < zujianArrayNew.length; i++) {
			var zujian = zujianArrayNew[i],
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
				htmlStr += showComponentSource.getcomboCheckbox(zujianLabel, zujianId, zujianType, isRequire, zujian.xialaType);
			}


		};


		$("#otherCondition").html(htmlStr);
		//后添加

		//添加选中事件
		for (var i = 0; i < zujianArrayNew.length; i++) {
			var zujian = zujianArrayNew[i];
			var id = zujian.id;
			var label = zujian.label;
			var type = zujian.type;
			if (type == "checkbox") {

			}
			else if (type == "leftRight") {
				suppleMethod.showComponentSource_getleftrightkuang(id);
			}
			else if (type == "leftrightliandong") {

			}
			else if (type == "busyTimeParagraph") {
				busyTimeParagraph.defaultCheckedEvent(id, label);  
			}
			else if (type == "cellList") {
			    cellList.defaultInit(id);  
			}
		};

		//还原编辑组件        

		var innerHTML = "";
		for (var i = 0; i < otherCondition.length; i++) {
			var zujian = otherCondition[i],
				zujianType = zujian.type,
				zujianLabel = zujian.label,
				zujianId = zujian.id,
				xialaType = zujian.xialaType;
			if (zujianType == "text") {
				innerHTML += reductionComponentSource.getshurukuang(zujianLabel, zujianId);
			}
			else if (zujianType == "select") {
				innerHTML += reductionComponentSource.getxialakuang(zujianLabel, zujianId, xialaType);
			}
			else if (zujianType == "checkbox") {
				innerHTML += reductionComponentSource.getfuxuankuang(zujianLabel, zujianId, xialaType);
			}
			else if (zujianType == "leftRight") {
				innerHTML += reductionComponentSource.getleftrightkuang(zujianLabel, zujianId, xialaType);
			}
			else if (zujianType == "leftrightliandong") {
				innerHTML += reductionComponentSource.getleftrightliandong(zujianLabel, zujianId, xialaType);
			}
			else if (zujianType == "demoselect") {
				innerHTML += reductionComponentSource.getdemoselect(zujianLabel, zujianId);
			}
			else if (zujianType == "convergeCheckbox") {
				innerHTML += reductionComponentSource.getconvergeCheckbox(zujianLabel, zujianId,xialaType);
			}
			else if (zujianType == "convergeCheckboxDetail") {
				innerHTML += reductionComponentSource.getconvergeCheckboxDetail(zujianLabel, zujianId,xialaType);
			}
			else if (zujianType == "demoselectNew") {
				innerHTML += reductionComponentSource.getdemoselectNew(zujianLabel, zujianId);
			}
			else if (zujianType == "indexWarning") {
				innerHTML += reductionComponentSource.getindexWarning(zujianLabel, zujianId);
			}
			else if (zujianType == "conditionToDevice") {
				innerHTML += reductionComponentSource.getconditionToDevice(zujianLabel, zujianId);
			}
			else if (zujianType == "conditionToPort") {
				innerHTML += reductionComponentSource.getconditionToPort(zujianLabel, zujianId);
			}
			else if (zujianType == "busyTimeParagraph") {
				innerHTML += reductionComponentSource.getbusyTimeParagraph(zujianLabel, zujianId);
			}
			else if (zujianType == "cellList") {
				innerHTML += reductionComponentSource.getcellList(zujianLabel, zujianId);
			}
			else if (zujianType == "comboCheckbox") {
				innerHTML += reductionComponentSource.getcomboCheckbox(zujianLabel, zujianId,xialaType);
			}

		};
		innerHTML += '<input id="ad" type="hidden">';
		$("#addDiv").html(innerHTML);

	},
	valueReplace: function(string) {
		string.replace(/\n/g, "");
		string.replace(/\b/g, "");
		string.replace(/\t/g, "");
		string.replace(/\f/g, "");
		string.replace(/\r/g, "");
		string.replace(/\\/g, "");
		return string;

	},
	//向textarea光标处添加文本
	//------------------------------------------------------------------------
	insertAtCursor: function(myField, myValue) {
		if (document.selection) {
			myField.focus();
			sel = document.selection.createRange();
			sel.text = myValue;
			sel.select();
		}
		//MOZILLA/NETSCAPE support 
		else if (myField.selectionStart || myField.selectionStart == '0') {
			var startPos = myField.selectionStart;
			var endPos = myField.selectionEnd;
			// save scrollTop before insert www.keleyi.com
			var restoreTop = myField.scrollTop;
			myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length);
			if (restoreTop > 0) {
				myField.scrollTop = restoreTop;
			}
			myField.focus();
			myField.selectionStart = startPos + myValue.length;
			myField.selectionEnd = startPos + myValue.length;
		} else {
			myField.value += myValue;
			myField.focus();
		}
	},
	checkUpdateMenueName: function(name) {
		var resultMenueNameArr = [];
		var currName = "";
		var parent_id = "";

		var nodeId = $("#updateReportId").html();

		//查询父类id 
		var dataC = {
			"ifId": "srpt-cfg-menuQueryParent",
			"id": JSON.stringify(nodeId)
		};
		var dataStrC = JSON.stringify(dataC);
		var res = commonAjax(configUrl_main.query_menuQueryParent, dataStrC, "", "");
		//var res = commonAjax("/srpt/rcpt/common/query",dataStrC,"","");    
		var result = res.data;
		for (var i = 0; i < result.length; i++) {
			parent_id = result[0].parent_id;
		};

		//查询该同级的名称
		var dataB = {
			"ifId": "srpt-cfg-menuQuery",
			"parent_id": parent_id
		};
		var dataStrB = JSON.stringify(dataB);
		var res1 = commonAjax(configUrl_main.query_menuQuery, dataStrB, "", "");
		//var res1 = commonAjax("/srpt/rcpt/common/query",dataStrB,"","");     
		var result = res1.data;
		for (var i = 0; i < result.length; i++) {
			resultMenueNameArr.push(result[i].name_);
		};

		//得到未修改时的名称
		var dataA = {
			"ifId": "srpt-cfg-menuQueryself",
			"id": nodeId
		};
		var dataStrA = JSON.stringify(dataA);
		var res2 = commonAjax(configUrl_main.query_menuQueryself, dataStrA, "", "");
		//var res2 = commonAjax("/srpt/rcpt/common/query",dataStrA,"",""); 
		currName = res2.data[0].name_;
		//首先把当前这个元素排除掉
		var newArr = [];
		for (var i = 0; i < resultMenueNameArr.length; i++) {
			if (resultMenueNameArr[i] != currName) {
				newArr.push(resultMenueNameArr[i]);
			};
		};
		var flag = 0;
		for (var i = 0; i < newArr.length; i++) {
			if (newArr[i] == name) {
				flag = 1;
			};
		};
		return flag;
	}
};