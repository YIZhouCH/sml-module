var height = "";
var rowNum = "";
var select_id = "";
var publishNotice = {
	init: function() {
		height = kk - 83;
		rowNum = Math.floor(height / 30);
		publishNotice.initGrid();
	},
	publishNotice: function() {
		$("#publishNotice").modal("toggle");
		$("#noticTitle").val("");
		$("#noticContent").val("");
	},
	publishNotices: function() {
		var ifPublish = $('#ifPublish').is(':checked');
		var noticTitles = $("#noticTitle").val();
		var noticContents = $("#noticContent").val();
		//------------------------------
		var noticTitle = noticTitles.trim();
		var noticContent = noticContents.trim();
		if (noticTitle == "") {
			alert("标题不能为空!");
			return;
		};
		if (noticContent == "") {
			alert("公告内容不能为空!");
			return;
		};
		//------------------------------
		var currTime = publishNotice.getCurrTime();
		//防止单点登录获取不到用户名-------------------------------------------------------------
		var userInfo = "";
		var userinfoDiv = $(window.top.document.getElementById('userinfo'));
		userInfo = userinfoDiv.find('div[id = "tab_1_1"]').find('div').eq(0).find('div').eq(1).html();
		if (userInfo == null) {
			userInfo = $.cookie("inas_portallogin_user_username");
		} else {
			var re1 = new RegExp("\n", "g");
			userInfo = userInfo.replace(re1, "");
			userInfo = userInfo.trim();
		};
		//console.log(userInfo);
		//----------------------------------------------------------         
		var userName = userInfo;
		//var userName = $.cookie("inas_portallogin_user_username");
		var enabled_ = 1;
		if (!ifPublish) {
			enabled_ = 0;
		};
		var data = {
			"dbId": "srpt",
			"tableName": configUrl_main.DM_CO_BA_SRPT_AFFICHE_tableName,
			//"tableName":"DM_CO_BA_SRPT_AFFICHE",
			"type": "insert",
			"data": {
				"id_": currTime,
				"title_": noticTitle,
				"content_": noticContent,
				"enabled_": enabled_,
				"createtime_@date": currTime,
				"importance_": 1,
				"creator_": userName
			}
		};

		var dataStr = JSON.stringify(data);
		var res = commonAjax(configUrl_main.update_insert, dataStr, "", "");
		//var res = commonAjax("/srpt/rcpt/common/update",dataStr,"","");
		alert("新增成功!");
		publishNotice.initGrid(); //刷新新增数据
		$("#publishNotice").modal("hide"); //关闭弹框
	},
	noticeDel: function() {
		jQuery("#con_grid_div_grid").jqGrid('delRowData', select_id);

		var data = {
			"dbId": "srpt",
			"tableName": configUrl_main.DM_CO_BA_SRPT_AFFICHE_tableName,
			//"tableName":"DM_CO_BA_SRPT_AFFICHE",
			"type": "delete",
			"conditions": ["id_"],
			"data": {
				"id_": select_id
			}
		};
		var dataStr = JSON.stringify(data);
		var res = commonAjax(configUrl_main.update_delete, dataStr, "", "");
		//var res = commonAjax("/srpt/rcpt/common/update",dataStr,"","");


	},
	initGrid: function() {

		var columnsName = ['标题', '公告内容', '创建时间', '创建人' /*,'是否公告'*/ ];
		var columnsConfig = [{
				name: 'title_',
				index: 'title_',
				width: 120,
				align: "center"
			}, {
				name: 'content_',
				index: 'content_',
				width: 260,
				align: "center"
			}, {
				name: 'createtime_',
				index: 'createtime_',
				width: 100,
				align: "center"
			}, {
				name: 'creator_',
				index: 'creator_',
				width: 100,
				align: "center"
			}
			/*,{name:'enabled_',index:'enabled_', width:50,align:"center",
			formatter:function(cellVal,options,rowObjs){
			                                              if (cellVal == 0) {return "否";};
			                                              if (cellVal == 1) {return "是";};
			                                            }
			}*/
		];
		//初始化表格
		$("#con_grid_div_grid").jqGrid({
			height: height,
			rowNum: rowNum,
			datatype: "local",
			colNames: columnsName,
			shrinkToFit: false,
			autoScroll: true,
			rownumbers: false,
			pgbuttons: true,
			colModel: columnsConfig,
			pager: "#con_grid_div_gridPager",
			pgtext: "{0}共{1}页",
			onSelectRow: function(rowid, status) {
				select_id = rowid;
			}
		});

		var postJson = {};
		$("#con_grid_div_grid").jqGrid("setGridParam", {
			url: eastcom.baseURL + configUrl_main.srpt_rcpt_home_showNotice,
			//url : eastcom.baseURL+"/srpt/rcpt/home/showNotice", 
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

	getCurrTime: function() {
		var date = new Date();
		var dateStr = date.format("yyyyMMddhhmmss");
		return dateStr;
	}
};