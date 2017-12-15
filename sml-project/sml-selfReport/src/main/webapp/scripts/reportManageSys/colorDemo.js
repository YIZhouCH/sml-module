var height = "";
var rowNum = "";
var select_id = "";
var colorDemo = {
	init: function() {
		height = kk - 83;
		rowNum = Math.floor(height / 30);
		$("#demoName_mohu").val("");
		colorDemo.initGrid();
	},
	//----------------------------------------------------
	addDemo_qujian_before: function() {
		$("#baocunId").html("");
		colorDemo.addDemo_qujian();
	},
	addDemo_qujian: function() {
		$("#addDemo_qujian").modal("toggle");
		$("#colorDemoId_qujian").val("");
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
	},
	addField_qujian: function() {
		$("#addDiv_qujian").find('div[sf="1"]').next('div').last().css('display', 'block').attr('sf', '1');
	},
	delField_qujian: function(obj) {
		$(obj).parent().css('display', 'none').attr('sf', '0');
	},
	addDemos_qujian: function() {
		var id = "";
		var idDiv = $("#baocunId").html();
		var idTime = colorDemo.getCurrTimeToId();
		var name = $("#colorDemoId_qujian").val();
		if (name.trim() == "") {
			alert("名称不能为空!");
			return;
		};
		var strategy = [];
		$("#addDiv_qujian").find('div[sf ="1"]').each(function(index, el) {
			var objSmall = {};
			var min = "";
			var color = "";
			var max = "";
			$(el).find('input').each(function(index_n, el_n) {
				switch (index_n) {
					case 0:
						min = $(el_n).val();
						break;
					case 1:
						max = $(el_n).val();
						break;
					case 2:
						color = $(el_n).val();
						break;
				};
			});
			objSmall.min = min;
			objSmall.color = color;
			objSmall.max = max;
			strategy.push(objSmall);
		});


		//添加调用接口
		if (idDiv == "") {
			id = idTime;
			var data = {
				"dbId": "srpt",
				"tableName": configUrl_main.dm_co_ba_srpt_head_tpl_tableName,
				//"tableName":"dm_co_ba_srpt_head_tpl",
				"type": "insert",
				"data": {
					"id": id,
					"name": name,
					"type": "1",
					"strategy": JSON.stringify(strategy)
				}
			};
			var dataStr = JSON.stringify(data);
			var res = commonAjax(configUrl_main.update_insert, dataStr, "", "");
			//var res = commonAjax("/srpt/rcpt/common/update",dataStr,"",""); 
			if (res.resultCode == "0" || res.msg == "success") {
				alert("保存成功!");
				$("#addDemo_qujian").modal("hide");
				colorDemo.initGrid();
			};
		} else {
			id = idDiv;
			var dataA = {
				"dbId": "srpt",
				"tableName": configUrl_main.dm_co_ba_srpt_head_tpl_tableName,
				//"tableName":"dm_co_ba_srpt_head_tpl",
				"type": "update",
				"conditions": ["id"],
				"data": {
					"id": id,
					"name": name,
					"type": "1", //  0表示枚举，1表示区间 	
					"strategy": JSON.stringify(strategy)
				}
			};
			var dataStrA = JSON.stringify(dataA);
			var resA = commonAjax(configUrl_main.srpt_rcpt_common_update, dataStrA, "", "");
			// var resA = commonAjax("/srpt/rcpt/common/update",dataStrA,"",""); 
			if (resA.resultCode == "0" || resA.msg == "success") {
				alert("保存成功!");
				$("#addDemo_qujian").modal("hide");
				colorDemo.initGrid();
			};
		};


	},
	//----------------------------------------------------
	addDemo_meiju_before: function() {
		$("#baocunId").html("");
		colorDemo.addDemo_meiju();
	},
	addDemo_meiju: function() {
		$("#addDemo_meiju").modal("toggle");
		$("#colorDemoId_meiju").val("");
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
	},
	addField_meiju: function() {
		$("#addDiv_meiju").find('div[sf="1"]').next('div').last().css('display', 'block').attr('sf', '1');
	},
	delField_meiju: function(obj) {
		$(obj).parent().css('display', 'none').attr('sf', '0');
	},
	addDemos_meiju: function() {
		var id = "";
		var idDiv = $("#baocunId").html();
		var idTime = colorDemo.getCurrTimeToId();
		var name = $("#colorDemoId_meiju").val();
		if (name.trim() == "") {
			alert("名称不能为空!");
			return;
		};
		var strategy = [];
		$("#addDiv_meiju").find('div[sf ="1"]').each(function(index, el) {
			var objSmall = {};
			var feilName = "";
			var color = "";
			var check = "";
			$(el).find('input').each(function(index_n, el_n) {
				switch (index_n) {
					case 0:
						feilName = $(el_n).val();
						break;
					case 1:
						check = $(el_n).is(':checked');
						break;
					case 2:
						color = $(el_n).val();
						break;
				};
			});
			objSmall.feilName = feilName;
			objSmall.color = color;
			objSmall.check = check;
			strategy.push(objSmall);
		});
		//添加调用接口
		if (idDiv == "") {
			id = idTime;
			var data = {
				"dbId": "srpt",
				"tableName": configUrl_main.dm_co_ba_srpt_head_tpl_tableName,
				//"tableName":"dm_co_ba_srpt_head_tpl",
				"type": "insert",
				"data": {
					"id": id,
					"name": name,
					"type": "0", // 0表示枚举，1表示区间 	
					"strategy": JSON.stringify(strategy)
				}
			};
			var dataStr = JSON.stringify(data);
			var res = commonAjax(configUrl_main.update_insert, dataStr, "", "");
			//var res = commonAjax("/srpt/rcpt/common/update",dataStr,"",""); 
			if (res.resultCode == "0" || res.msg == "success") {
				alert("保存成功!");
				$("#addDemo_meiju").modal("hide");
				colorDemo.initGrid();
			};

		} else {
			id = idDiv;
			var dataA = {
				"dbId": "srpt",
				"tableName": configUrl_main.dm_co_ba_srpt_head_tpl_tableName,
				//"tableName":"dm_co_ba_srpt_head_tpl",
				"type": "update",
				"conditions": ["id"],
				"data": {
					"id": id,
					"name": name,
					"type": "0", // <!-- 0表示枚举，1表示区间 -->		
					"strategy": JSON.stringify(strategy)
				}
			};
			var dataStrA = JSON.stringify(dataA);
			var resA = commonAjax(configUrl_main.srpt_rcpt_common_update, dataStrA, "", "");
			//var resA = commonAjax("/srpt/rcpt/common/update",dataStrA,"",""); 
			if (resA.resultCode == "0" || resA.msg == "success") {
				alert("保存成功!");
				$("#addDemo_meiju").modal("hide");
				colorDemo.initGrid();
			};
		};




	},
	//---------------------------------------------------------------------------------------
	delDemo: function() {
		var id = $("#" + select_id).find('td[aria-describedby="con_grid_div_grid_id"]').eq(0).html();
		if (id == "" || id == null || id == "null") {
			alert("请选择删除的数据!");
			return;
		};

		var data = {
			"dbId": "srpt",
			"tableName": configUrl_main.dm_co_ba_srpt_head_tpl_tableName,
			//"tableName":"dm_co_ba_srpt_head_tpl",
			"type": "delete",
			"conditions": ["id"],
			"data": {
				"id": id
			}
		};
		var dataStr = JSON.stringify(data);
		if (confirm("确定要删除吗？")) {
			var res = commonAjax(configUrl_main.update_delete, dataStr, "", "");
			//var res = commonAjax("/srpt/rcpt/common/update",dataStr,"",""); 
			if (res.resultCode == "0" || res.msg == "success") {
				alert("删除成功!");
				$("#addDemo_meiju").modal("hide");
			};


			if (select_id != "") {
				jQuery("#con_grid_div_grid").jqGrid('delRowData', select_id);
			};
		};
	},
	alertDemo: function() {
		var id = $("#" + select_id).find('td[aria-describedby="con_grid_div_grid_id"]').html();
		$("#baocunId").html(id);
		var name = $("#" + select_id).find('td[aria-describedby="con_grid_div_grid_name"]').html();
		var type = $("#" + select_id).find('td[aria-describedby="con_grid_div_grid_type"]').html();
		var strategy = $("#" + select_id).find('td[aria-describedby="con_grid_div_grid_strategy"]').html();
		if (type == "区间") {
			colorDemo.addDemo_qujian();
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

		};
		if (type == "枚举") {
			colorDemo.addDemo_meiju();
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
		};


	},
	demoQuery: function() {
		jQuery("#con_grid_div_grid").jqGrid("clearGridData"); //清除表格之前的数据
		var demoName_mohu = $("#demoName_mohu").val();
		//加载数据  

		var data = {
			"ifId": "srpt-enum-colorCfg",
			"name": demoName_mohu
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
			jQuery("#con_grid_div_grid").jqGrid('addRowData', i + 1, resultArr[i]);
		};

	},
	initGrid: function() {

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
			width: 50,
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
			width: 200,
			align: "center"
		}];
		//初始化表格
		jQuery("#con_grid_div_grid").jqGrid("clearGridData");
		$("#con_grid_div_grid").jqGrid({
			height: height,
			rowNum: rowNum,
			datatype: "local",
			colNames: columnsName,
			shrinkToFit: false,
			autoScroll: true,
			rownumbers: true,
			rownumWidth: 80,
			pgbuttons: true,
			colModel: columnsConfig,
			//pager: "#con_grid_div_gridPager",
			//pgtext : "{0}共{1}页",
			onSelectRow: function(rowid, status) {
				select_id = rowid;
			},
			ondblClickRow: function(rowid, iRow, iCol, e) {
				select_id = rowid;
				colorDemo.alertDemo();
			}
		});

		//加载数据  
		var data = {
			"ifId": "srpt-enum-colorCfg"
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
			jQuery("#con_grid_div_grid").jqGrid('addRowData', i + 1, resultArr[i]);
		};


	},
	getCurrTimeToId: function() {
		var date = new Date();
		var dateStr = date.format("yyyyMMddhhmmss");
		return dateStr;
	}
};













/* var ad=document.getElementById("ad");
				   var node=document.createElement("div"); 
				   node.style.height = "40px";
				   var innerHTML = "";  
                   innerHTML += '<span>'
	                         +    '<input type="text" name="a" />' 
	                         +    '<input type="text" class="jscolor" value="fff">'  
                             +    '<input id="ifPublish" type="checkbox" style="margin-left: 0px;" />模糊匹配'
	                         +  '</span>' 

				   node.innerHTML=innerHTML;
    	      	   ad.parentNode.insertBefore(node,ad);*/
//alert($("#addDiv_meiju").find('div').eq(0).css('display'));