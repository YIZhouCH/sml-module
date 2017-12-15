var updateReportParamsArr = [];
var qry_bd_info_preview = "";
var preview_report_id = "";
var repoprtResultData = [];
var isRelExplan = false;
var publish_id_title = [];
var oldCode = "";



var field_arith_arr = [];


var mainE = {
	init: function() {
		$("#seekReportName").val("");
		mainE.changeTip();
		mainE.loadTree();
		mainE.initDataPool();

	},
	initDataPool: function() {
		var data = {
			"ifId": "srpt-enum-dataSource"
		};
		var dataStr = JSON.stringify(data);
		var res = commonAjax(configUrl_main.query_dataSource, dataStr, "", "");
		//var res = commonAjax("/srpt/rcpt/common/query",dataStr,"","");
		var result = res.data;
		$("#dataPool").html(''); //首先清空
		for (var item in result) {
			$("#dataPool").append("<option value='" + result[item].id_ + "'>" + result[item].name_ + "</option>");
		};
	},
	addTab: function(subtitle, url) {
		if (!$('#tabs').tabs('exists', subtitle)) {
			$('#tabs').tabs('add', {
				title: subtitle,
				content: mainE.createFrame(url),
				closable: true,
				iconCls: 'icontabstitle'
			});
		} else {
			$('#tabs').tabs('select', subtitle);
		};

	},
	createFrame: function(url) {
		var k = document.body.offsetHeight;
		var h = k - 65 ;
		if (flag2017216143611 == "true") {
		 h = k - 70;
		}else{
		 h = k - 65;
		};
		var s = '<iframe id="mainframe" name="mainframe" src=' + url + ' width="100%" height="' + h + '"  frameborder="0" scrolling="auto" ></iframe>';
		return s;
	},
	closetabs: function(title) {
		$("#tabs").tabs('close', title);
	},
	zhuanhuancaidanData: function(data) { //data  To   arr
		var arr = [];
		if (data == null) {
			return;
		};
		for (var i = 0; i < data.length; i++) {
			var item = data[i];
			var type = item.type_;
			var obj = {};
			if (type == 0) {
				obj.id = item.id_;
				obj.text = item.name_;
				//-------------------
				//obj.iconCls = "icon-wenjianjia";
				//-------------------
				obj.state = "closed";
				obj.attributes = {
					"ishasChilds": true,
					"type":type
				};
				arr.push(obj);
			};
		};
		//-------------------------------
		for (var i = 0; i < data.length; i++) {
			var item = data[i];
			var type = item.type_;
			var obj = {};

			if (type == 1) {
				obj.id = item.id_;
				obj.text = item.name_;
				if (item.enabled == 2 || item.enabled == 3) {
					obj.iconCls = "icon-wenbenfabu1";
				};
				obj.attributes = {
					"ishasChilds": false,
					"type":type
				};
				arr.push(obj);
			};
		};
		//-------------------------------
		for (var i = 0; i < data.length; i++) {
			var item = data[i];
			var type = item.type_;
			var obj = {};

			if (type == 2) {
				obj.id = item.id_;
				obj.text = item.name_;
				if (item.enabled == 2 || item.enabled == 3) {
					obj.iconCls = "icon-wenbenfabu1";
				};
				obj.attributes = {
					"ishasChilds": false,
					"type":type
				};
				arr.push(obj);
			};
		};
		//-------------------------------
		return arr;
	},
	loadTree: function() {
		var initData = [{
			"id": 0,
			"text": "报表分类",
			"state": "closed",
			//"iconCls":"icon-add",
			"attributes": {
				"ishasChilds": true
			}
		}]

		$('#tree').tree({
			data: initData,
			lines: true,
			animate: true,
			//-------------------------------------------
			dnd: false,
			onBeforeDrop: function(target, source, point) {

				var targetId = target.attributes[1].nodeValue; //拖拽目标的id
				//判断新目标是否可放入
				var dataT = {
					"ifId": "srpt-cfg-menuQueryself",
					"id": targetId
				};

				var dataStrT = JSON.stringify(dataT);
				var resT = commonAjax(configUrl_main.query_menuQueryself, dataStrT, "", "");
				//var resT = commonAjax("/srpt/rcpt/common/query",dataStrT,"","");
				var itemT = resT.data[0];
				var typeT = itemT.type_;
				if (typeT == 1) {
					return false;
				} else {
					//修改父id-----------------------------   
					var dataS = {
						"dbId": "srpt",
						"tableName": configUrl_main.dm_co_ba_srpt_menu_tableName,
						//"tableName":"dm_co_ba_srpt_menu",
						"type": "update",
						"conditions": ["id_"],
						"data": {
							"id_": source.id,
							"parent_id": targetId
						}
					};
					var dataStrS = JSON.stringify(dataS);
					var resS = commonAjax(configUrl_main.update_update, dataStrS, "", "");
					//var resS = commonAjax("/srpt/rcpt/common/update",dataStrS,"","");
				};

			},
			//-------------------------------------------
			onBeforeExpand: function(node) {
				if (isRelExplan) {
					return;
				}
				/*var data = {
				             "ifId":"srpt-cfg-menuQuery",
				             "parent_id":node.id
				          }; //添加目录参数*/
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
				var data = {
					"creator_": userName,
					"report_id": node.id,
					"enabled": [1, 2, 3, 4],
					"class": "0"
				};

				var dataStr = JSON.stringify(data);
				//var res = commonAjax("/srpt/rcpt/common/query",dataStr,"","");
				var res = commonAjax(configUrl_main.srpt_rcpt_asyncFindByCreator, dataStr, "", "");
				//var res = commonAjax("/srpt/rcpt/asyncFindByCreator",dataStr,"","");
				var arr = mainE.zhuanhuancaidanData(res.data)
				var parent = $('#tree').tree('find', node.id);
				var childrens = $('#tree').tree('getChildren', parent.target);
				for (var i = 0; i < childrens.length; i++) {
					$('#tree').tree('remove', childrens[i].target);
				}
				$('#tree').tree("append", {
					parent: parent.target,
					data: arr
				});
			},
			onContextMenu: function(e, node) {
				e.preventDefault();
				$('#tree').tree('select', node.target);
				if (node.attributes.ishasChilds) {
					$('#mm1').menu('show', {
						left: e.pageX,
						top: e.pageY
					});
				} else {
					$('#mm2').menu('show', {
						left: e.pageX,
						top: e.pageY
					});
				};
				$("#mmTtr").html(node.id);
				$("#mmTtr_text").html(node.text);

			},
			onDblClick: function(node) {
				var type = node.attributes.ishasChilds;
				var typeJsp = node.attributes.type;
                if (typeJsp == "2"){
                	   var data = {
                	   	"ifId": "srpt-cfg-reportInfo",
                	   	"report_id": node.id
                	   };
                	   var dataStr = JSON.stringify(data);
                	   var res = commonAjax(configUrl_main.query_reportInfo, dataStr, "", "");
                	   //var jspUrl = eval('(' + res.data.report_url + ')')
                	   var jspUrl = res.data.report_url;

                	   if(jspUrl.indexOf("http") > -1){
                	         
                	   }else{
	                	   	  if (jspUrl.substring(0,1) == "/") {
	                	      		jspUrl = eastcom.baseURL + jspUrl;
	                	   	  }else{
	                	      		jspUrl = eastcom.baseURL +"/"+ jspUrl;
	                	   	  }; 
                	   };




                         	//点击打卡一张报表
                         	var subtitle = node.text;
                         	var url = jspUrl;
                         	if (!$('#tabs').tabs('exists', subtitle)) {
                         		$('#tabs').tabs('add', {
                         			title: subtitle,
                         			content: mainE.createFrame(url),
                         			closable: true,
                         			iconCls: 'icontabstitle'
                         		});
                         	} else {
                         		$('#tabs').tabs('select', subtitle);
                         	};
                         
                         $("#onclickId").html(node.id);
                         $("#onclickName").html(node.text);
                         tabClose();
                         tabCloseEven();
                }else{




						if (!type) {
							//点击打卡一张报表
							var subtitle = node.text
							var url = "publicReport.jsp?fromWhere=mainE"
							if (!$('#tabs').tabs('exists', subtitle)) {
								$('#tabs').tabs('add', {
									title: subtitle,
									content: mainE.createFrame(url),
									closable: true,
									iconCls: 'icontabstitle'
								});
							} else {
								$('#tabs').tabs('select', subtitle);
							};
						};
						$("#onclickId").html(node.id);
						$("#onclickName").html(node.text);
						tabClose();
						tabCloseEven();

			    };
            }


		}); //tree
		var firstTree = $('#tree').tree('find', 0);
		$('#tree').tree('expand', firstTree.target);
	}, //loadTree
	addMulu: function() {
		$("#mymodal").modal("toggle");
		$("#muluName").val(" ");
	},
	alterMulu: function() {
		$("#alterMulu").modal("toggle");
		var nodeId = $("#mmTtr").html();
		var nodeText = $("#mmTtr_text").html();
		/*var data = {
			"ifId": "srpt-cfg-menuQueryself",
			"id": nodeId
		};
		var dataStr = JSON.stringify(data);
		var res = commonAjax(configUrl_main.query_menuQueryself, dataStr, "", "");
		//var res = commonAjax("/srpt/rcpt/common/query",dataStr,"","");
		muluName = res.data[0].name_;
		$("#alterMuluName").val(muluName);*/
		$("#alterMuluName").val(nodeText);
	},
	updateReportNames: function() {
		$("#alterReport").modal("toggle");
		var nodeId = $("#mmTtr").html();
		var data = {
			"ifId": "srpt-cfg-menuQueryself",
			"id": nodeId
		};
		var dataStr = JSON.stringify(data);
		var res = commonAjax(configUrl_main.query_menuQueryself, dataStr, "", "");
		//var res = commonAjax("/srpt/rcpt/common/query",dataStr,"","");
		ReportName = res.data[0].name_;
		oldCode = ReportName;
		$("#alterReportName").val(ReportName);
	},
	alterReportNames: function() {
		var nodeId = $("#mmTtr").html();
		var names = $("#alterReportName").val();
		var name_ = names.trim();
		if (name_ == "" || name_.trim() == "") {
			alert("名称不能为空!");
			return;
		};
		var flag = mainE.checkUpdateMenueName(name_);
		if (flag == 1) {
			alert("该名称已存在!");
			return;
		};
		var data = {
			"dbId": "srpt",
			"tableName": configUrl_main.dm_co_ba_srpt_menu_tableName,
			//"tableName":"dm_co_ba_srpt_menu",
			"type": "update",
			"conditions": ["id_"],
			"data": {
				"id_": nodeId,
				"name_": name_,
				//"type_": 1,
				"descr_": ""
			}
		}; //添加目录参数
		var dataStr = JSON.stringify(data);
		var res = commonAjax(configUrl_main.update_update, dataStr, "", "");
		//var res = commonAjax("/srpt/rcpt/common/update",dataStr,"","");
		$('#tree').tree("update", {
			target: $('#tree').tree('find', nodeId).target,
			text: name_
		});
		$("#alterReport").modal("hide"); //关闭弹框 

		//修改日志报表保存的相关信息-----------------------------------------------------


		/* http://localhost:7080/web-selfReport-special/srpt/rcpt/updateLogModuleCode
		  {"oldCode":"test2",
		  "newCode":"test"
		  }*/

		var data = {
			"oldCode": oldCode,
			"newCode": name_
		};
		var dataStr = JSON.stringify(data);
		var res = commonAjax(configUrl_main.srpt_rcpt_updateLogModuleCode, dataStr, "", "");
		//var res = commonAjax("/srpt/rcpt/updateLogModuleCode",dataStr,"","");


		//-------------------------------------------------------------------------------


	},

	addDataPool: function() {
		$("#datapool").modal("toggle");

		mainE.changeDriverBao();

		$("#dataName").val("");
		$("#dataType").val("");
		$("#dataUrl").val("");
		$("#dataUserName").val("");
		$("#dataPwdName").val("");
		$("#dataDriverBao").val("");
		$("#dataDesc").val("");
	},
	changeDriverBao: function() {
		var dataType = $("#dataType").val();
		if (dataType == "oracle") {
			var DriverBaoArr = ['oracle.jdbc.driver.OracleDriver', 'oracle.jdbc.OracleDriver'];
			$('#dataDriverBao').html("");
			for (var i = 0; i < DriverBaoArr.length; i++) {
				$("#dataDriverBao").append('<option value="' + DriverBaoArr[i] + '">' + DriverBaoArr[i] + '</option>')
			};
		};
		if (dataType == "sybaseiq") {
			var DriverBaoArr = ['com.sybase.jdbc3.jdbc.SybDriver'];
			$('#dataDriverBao').html("");
			for (var i = 0; i < DriverBaoArr.length; i++) {
				$("#dataDriverBao").append('<option value="' + DriverBaoArr[i] + '">' + DriverBaoArr[i] + '</option>')
			};
		};
	},
	addDataSource: function() {
		var dataName = $("#dataName").val();
		var dataType = $("#dataType").val();
		var dataUrl = $("#dataUrl").val();
		var dataUserName = $("#dataUserName").val();
		var dataPwdName = $("#dataPwdName").val();
		var dataDriverBao = $("#dataDriverBao").val();
		var dataDescs = $("#dataDesc").val();
		var dataDesc = mainE.valueReplace(dataDescs);

		var create_id = new Date();
		var create_id = create_id.format("yyyyMMddhhmm");
		if (dataName.trim() == "") {
			alert("名称不能为空!");
			return;
		};
		//校验数据源名称是否已经存在--------------

		var dataB = {
			"ifId": "srpt-enum-dataSource"
		};
		var dataStrB = JSON.stringify(dataB);
		var ifExist = 0;
		var res = commonAjax(configUrl_main.query_dataSource, dataStrB, "", "");
		//var res = commonAjax("/srpt/rcpt/common/query",dataStrB,"","");
		var result = res.data;
		for (var item in result) {
			if (result[item].name_ == dataName.trim()) {
				ifExist = 1;
			};
		};

		if (ifExist == 1) {
			alert("该名称已存在!");
			return;
		};
		//----------------------------------------
		var data = {
			"dbId": "srpt",
			"tableName": configUrl_main.DM_CO_BA_SRPT_DATA_SOURCE_tableName,
			//"tableName":"DM_CO_BA_SRPT_DATA_SOURCE",
			"type": "insert",
			"data": {
				"id_": create_id,
				"name_": dataName,
				"url_": dataUrl,
				"username_": dataUserName,
				"password_": dataPwdName,
				"type_": dataType,
				"deviceclass_": dataDriverBao,
				"descr_": dataDesc
			}
		};
		var dataStr = JSON.stringify(data);
		var res = commonAjax(configUrl_main.update_insert, dataStr, "", "");
		//var res = commonAjax("/srpt/rcpt/common/update",dataStr,"","");
		alert("数据源创建成功!");
		$("#datapool").modal("hide"); //关闭弹框
		mainE.initDataPool();

	},
	addReport: function() {
		$("#newCreateReport").modal("toggle");
		$("#reportName").val(" ");
	    $("#reportRadio").prop('checked', false); 
	    $("#reportRadio").prop('disabled',false);
	    $("#dataJspAddress").val(" ");

	    $("#dataPoolDiv").css('display', 'block');
	    $("#dataJspAddressDiv").css('display', 'none');
	    $("#dataJspAddressButtonUpdate").css('display', 'none');

	},
	addReportName: function() {
		var report_id = mainE.getCurrTimeToId();
		var data_source_id = $("#dataPool").val();
		var names = $("#reportName").val();
		var name_ = names.trim();
		var parent_id = $("#mmTtr").html();
		if (name_ == "" || name_.trim() == "") {
			alert("名称不能为空!");
			return;
		};
		var flag = mainE.checkCreateMenueName(name_);
		if (flag == 1) {
			alert("该名称已存在!");
			return;
		};
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
		var dataM = {
			"dbId": "srpt",
			"tableName": configUrl_main.dm_co_ba_srpt_menu_tableName,
			//"tableName":"dm_co_ba_srpt_menu",
			"type": "insert",
			"data": {
				"ID_": report_id,
				"name_": name_,
				"type_": 1,
				"enabled": 4,
				"parent_id": parent_id,
				"creator_": userName,
				"descr_": ""
			}
		}; //添加目录参数
		var dataStrM = JSON.stringify(dataM);
		var res = commonAjax(configUrl_main.update_insert, dataStrM, "", "");
		//var res = commonAjax("/srpt/rcpt/common/update",dataStrM,"","");

		if (res.resultCode == 0 || res.msg == "success") {
			var userName = $.cookie("inas_portallogin_user_username");
			var dataC = {
				"dbId": "srpt",
				"tableName": configUrl_main.DM_CO_BA_SRPT_user_report_rel_tableName,
				//"tableName":"DM_CO_BA_SRPT_user_report_rel",
				"type": "insert",
				"data": {
					"report_id": report_id,
					"username": userName,
					"update_time@date": mainE.getCurrTimeToId()
				}
			}; //添加目录参数
			var dataStrC = JSON.stringify(dataC);
			var res = commonAjax(configUrl_main.update_insert, dataStrC, "", "");
			//var res = commonAjax("/srpt/rcpt/common/update",dataStrC,"","");
		};
		var parent = $('#tree').tree('find', parent_id);
		$('#tree').tree('collapse', parent.target);
		$('#tree').tree('expand', parent.target);


		//添加报表信息
		var create_time = new Date();
		var create_timedate = create_time.format("yyyyMMdd");
		var dataB = {
			"dbId": "srpt",
			"tableName": configUrl_main.dm_co_ba_srpt_report_tableName,
			//"tableName":"dm_co_ba_srpt_report",
			"type": "insert",
			"data": {
				"report_id": report_id,
				"qry_bd_info": "",
				"sql_logic_info": "",
				"data_source_id": data_source_id,
				"create_time@date": create_timedate
			}
		};
		var dataStrB = JSON.stringify(dataB);
		commonAjax(configUrl_main.update_insert, dataStrB, "", "");
		//commonAjax("/srpt/rcpt/common/update",dataStrB,"","");
		$("#newCreateReport").modal("hide"); //关闭弹框
	},
	addReportToJspName: function() {
		var report_id = mainE.getCurrTimeToId();
		var dataJspAddress = $("#dataJspAddress").val().trim();
		
		var names = $("#reportName").val();
		var name_ = names.trim();
		var parent_id = $("#mmTtr").html();
		if (name_ == "" || name_.trim() == "") {
			alert("名称不能为空!");
			return;
		};
		var flag = mainE.checkCreateMenueName(name_);
		if (flag == 1) {
			alert("该名称已存在!");
			return;
		};
		if (dataJspAddress.trim() == ""){
			 alert("jsp路径不能为空!");
			 return;
		};
        //自有选择url====================
          /*if(dataJspAddress.indexOf("http") > -1){
                
          }else{
             dataJspAddress = eastcom.baseURL +"/"+ dataJspAddress;
          }*/

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
		var dataM = {
			"dbId": "srpt",
			"tableName": configUrl_main.dm_co_ba_srpt_menu_tableName,
			//"tableName":"dm_co_ba_srpt_menu",
			"type": "insert",
			"data": {
				"ID_": report_id,
				"name_": name_,
				"type_": 2,
				"enabled": 1,
				"parent_id": parent_id,
				"creator_": userName,
				"descr_": ""
			}
		}; //添加目录参数
		var dataStrM = JSON.stringify(dataM);
		var res = commonAjax(configUrl_main.update_insert, dataStrM, "", "");
		//var res = commonAjax("/srpt/rcpt/common/update",dataStrM,"","");

		if (res.resultCode == 0 || res.msg == "success") {
			var userName = $.cookie("inas_portallogin_user_username");
			var dataC = {
				"dbId": "srpt",
				"tableName": configUrl_main.DM_CO_BA_SRPT_user_report_rel_tableName,
				//"tableName":"DM_CO_BA_SRPT_user_report_rel",
				"type": "insert",
				"data": {
					"report_id": report_id,
					"username": userName,
					"update_time@date": mainE.getCurrTimeToId()
				}
			}; //添加目录参数
			var dataStrC = JSON.stringify(dataC);
			var res = commonAjax(configUrl_main.update_insert, dataStrC, "", "");
			//var res = commonAjax("/srpt/rcpt/common/update",dataStrC,"","");
		};
		var parent = $('#tree').tree('find', parent_id);
		$('#tree').tree('collapse', parent.target);
		$('#tree').tree('expand', parent.target);

		//添加报表信息
		var create_time = new Date();
		var create_timedate = create_time.format("yyyyMMdd");
		var dataB = {
			"dbId": "srpt",
			"tableName": configUrl_main.dm_co_ba_srpt_report_tableName,
			//"tableName":"dm_co_ba_srpt_report",
			"type": "insert",
			"data": {
				"report_id": report_id,
				"report_url":dataJspAddress,
				"create_time@date": create_timedate
			}
		};
		var dataStrB = JSON.stringify(dataB);
		commonAjax(configUrl_main.update_insert, dataStrB, "", "");
		//commonAjax("/srpt/rcpt/common/update",dataStrB,"","");


		
		$("#newCreateReport").modal("hide"); //关闭弹框
	},
	updateReportToJspName : function(){
              var nodeId = $("#mmTtr").html();
              var dataJspAddress = $("#dataJspAddress").val().trim();
              
              var names = $("#reportName").val();
              var name_ = names.trim();
              var parent_id = $("#mmTtr").html();
              if (name_ == "" || name_.trim() == "") {
              	alert("名称不能为空!");
              	return;
              };
              var flag = mainE.checkUpdateMenueName(name_);
              if (flag == 1) {
              	alert("该名称已存在!");
              	return;
              };
              if (dataJspAddress.trim() == ""){
              	 alert("jsp路径不能为空!");
              	 return;
              };
		     //修改报表名称到菜单
		     var data = {
		     	"dbId": "srpt",
		     	"tableName": configUrl_main.dm_co_ba_srpt_menu_tableName,
		     	//"tableName":"dm_co_ba_srpt_menu",
		     	"type": "update",
		     	"conditions": ["id_"],
		     	"data": {
		     		"id_": nodeId,
		     		"name_": name_,
		     		//"type_": 2,
		     		//"enabled": 2,
		     		//"data_source_id":data_source_id,
		     		"descr_": ""
		     	}
		     };
		     var dataStr = JSON.stringify(data);
		     // var res = commonAjax("/srpt/rcpt/common/update",dataStr,"","");
		     // if(res.resultCode == 0){
		     //     parent.mainE.updateReportName(report_id,reportName);
		     // };
            var res = commonAjax(configUrl_main.update_update, dataStr, "", "");
		     //修改报表信息
		    var dataB = {
		     	"dbId": "srpt",
		     	"tableName": configUrl_main.dm_co_ba_srpt_report_tableName,
		     	//"tableName":"dm_co_ba_srpt_report",
		     	"type": "update",
		     	"conditions": ["report_id"],
		     	"data": {
		     		"report_id": nodeId,
		     		"report_url":dataJspAddress
		     	}
		     };
		     var dataStrB = JSON.stringify(dataB);
		     var res1 = commonAjax(configUrl_main.update_update, dataStrB, "", "");
		    if (res1.resultCode == 0 || res1.msg == "success") {
		    	 alert("修改成功!");
		    	 $('#tree').tree("update", {
		    	 	target: $('#tree').tree('find', nodeId).target,
		    	 	text: name_
		    	 });
		    	 $("#newCreateReport").modal("hide"); //关闭弹框
		    };

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
    },
	resetReportName: function() {
		$("#reportName").val(" ");
	},

	clearSeek: function() {
		$("#seekReportName").val("");
		$("#table").html("");
	},
	updateReport: function() {
		var nodeId = $("#mmTtr").html();
		var nodeTag = $('#tree').tree('find', nodeId);
		var typeJsp = nodeTag.attributes.type; 

		if (typeJsp == "2") {
			mainE.addReport();
			


			//数据库获取该报表的表名--------------------------------------------------------------------
			var data = {
				"ifId": "srpt-cfg-menuQueryself",
				"id": nodeId
			};
			var dataStr = JSON.stringify(data);
			var res = commonAjax(configUrl_main.query_menuQueryself, dataStr, "", "");
			//var res = commonAjax("/srpt/rcpt/common/query",dataStr,"","");
			reportName = res.data[0].name_;

			$("#reportName").val(reportName);

			var data = {
				"ifId": "srpt-cfg-reportInfo",
				"report_id": nodeId
			}; //添加目录参数
			var dataStr = JSON.stringify(data);
			var res1 = commonAjax(configUrl_main.query_reportInfo, dataStr, "", "");

			$("#dataJspAddress").val(res1.data.report_url);


			$("#reportRadio").prop('checked',true);
			$("#reportRadio").prop('disabled',true);
			mainE.changeReportToJsp();
			$("#dataPoolButton").css('display', 'none');
		    $("#dataJspAddressButton").css('display', 'none'); 
		    $("#dataJspAddressButtonUpdate").css('display', 'inline-block');



		}else{


				//var nodeId = $("#mmTtr").html();
				var reportName = "";
				//数据库获取该报表的表名--------------------------------------------------------------------
				var data = {
					"ifId": "srpt-cfg-menuQueryself",
					"id": nodeId
				};
				var dataStr = JSON.stringify(data);
				var res = commonAjax(configUrl_main.query_menuQueryself, dataStr, "", "");
				//var res = commonAjax("/srpt/rcpt/common/query",dataStr,"","");
				reportName = res.data[0].name_;
				//数据库获取报表信息
				var data = {
					"ifId": "srpt-cfg-reportInfo",
					"report_id": nodeId
				}; //添加目录参数
				var dataStr = JSON.stringify(data);
				var res1 = commonAjax(configUrl_main.query_reportInfo, dataStr, "", "");
				//var res1 = commonAjax("/srpt/rcpt/common/query",dataStr,"","");
				if (res1.data.qry_bd_info == null) {
					mainE.huanyuanNewCreateReport(nodeId, reportName);
					return;
				};
				var qry_bd_info_Json = eval('(' + res1.data.qry_bd_info + ')');
				var time = qry_bd_info_Json.time;
				var otherCondition = qry_bd_info_Json.otherCondition;
				var sql_logic_info = res1.data.sql_logic_info;
				mainE.huanyuanUpdateReport(nodeId, reportName, time, otherCondition, sql_logic_info);
	    };
	},
	huanyuanNewCreateReport: function(id, reportName) {
		var time = {
			db_info: {
				lianxuOrlisan: "lianxu"
			},
			query_param: [
				["hour"]
			],
			count: 0
		};
		var otherCondition = [];
		var sql_logic_info = "";

		updateReportParamsArr = []; //用之前先清空
		updateReportParamsArr.push(id);
		updateReportParamsArr.push(reportName);
		updateReportParamsArr.push(time);
		updateReportParamsArr.push(otherCondition);
		updateReportParamsArr.push(sql_logic_info);

		mainE.closetabs(reportName);
		if (!$('#tabs').tabs('exists', reportName)) {
			$('#tabs').tabs('add', {
				title: reportName,
				content: mainE.createFrame("updateReport.jsp"),
				closable: true,
				iconCls: 'icontabstitle'
			});
			tabClose();
			tabCloseEven();

		} else {
			$('#tabs').tabs('select', reportName);
		};
	},
	huanyuanUpdateReport: function(id, reportName, time, otherCondition, sql_logic_info) {

		var count = time.count;
		var lianxuOrlisan = time.db_info.lianxuOrlisan;
		var timeType = time.query_param[0];

		updateReportParamsArr = []; //用之前先清空
		updateReportParamsArr.push(id);
		updateReportParamsArr.push(reportName);
		updateReportParamsArr.push(time);
		updateReportParamsArr.push(otherCondition);
		updateReportParamsArr.push(sql_logic_info);

		mainE.closetabs(reportName);
		if (!$('#tabs').tabs('exists', reportName)) {
			$('#tabs').tabs('add', {
				title: reportName,
				content: mainE.createFrame("updateReport.jsp"),
				closable: true,
				iconCls: 'icontabstitle'
			});
			tabClose();
			tabCloseEven();

		} else {
			$('#tabs').tabs('select', reportName);
		};
	},
	updateDataToupdateReport: function() {
		return updateReportParamsArr;
	},
	alterMuluName: function() {
		var nodeId = $("#mmTtr").html();
		var names = $("#alterMuluName").val();
		var name_ = names.trim();
		if (name_ == "" || name_.trim() == "") {
			alert("名称不能为空!");
			return;
		};
		var flag = mainE.checkUpdateMenueName(name_);
		if (flag == 1) {
			alert("该名称已存在!");
			return;
		};
		var data = {
			"dbId": "srpt",
			"tableName": configUrl_main.dm_co_ba_srpt_menu_tableName,
			//"tableName":"dm_co_ba_srpt_menu",
			"type": "update",
			"conditions": ["id_"],
			"data": {
				"id_": nodeId,
				"name_": name_,
				"type_": 0,
				"descr_": ""
			}
		}; //添加目录参数
		var dataStr = JSON.stringify(data);
		var res = commonAjax(configUrl_main.update_update, dataStr, "", "");
		//var res = commonAjax("/srpt/rcpt/common/update",dataStr,"","");
		$('#tree').tree("update", {
			target: $('#tree').tree('find', nodeId).target,
			text: name_
		});
		$("#alterMulu").modal("hide"); //关闭弹框
	},
	removeMulu: function() {
		var nodeId = $("#mmTtr").html();
		var childrenArr = [];
		//---------------------------------
		var data = {
			"ifId": "srpt-cfg-menuQuery",
			"parent_id": nodeId
		};
		var dataStr = JSON.stringify(data);

		var returns = 0;
		var res = commonAjax(configUrl_main.query_menuQuery, dataStr, "", "");
		//var res = commonAjax("/srpt/rcpt/common/query",dataStr,"","");
		childrenArr = res.data;
		var length = childrenArr.length;
		if (length != 0) {
			returns = 1;
		};

		if (returns == 1) {
			var msg = "该目录下有报表,确定删除吗?"
			if (confirm(msg) == true) {
				var data = {
					"dbId": "srpt",
					"tableName": configUrl_main.dm_co_ba_srpt_menu_tableName,
					//"tableName":"dm_co_ba_srpt_menu",
					"type": "update",
					"conditions": ["id_"],
					"data": {
						"id_": nodeId,
						"enabled": 0
					}
				}; //添加目录参数
				var dataStr = JSON.stringify(data);
				commonAjax(configUrl_main.update_update, dataStr, "", "");
				//commonAjax("/srpt/rcpt/common/update",dataStr,"","");
				$('#tree').tree("remove", $('#tree').tree('find', nodeId).target);
				//删除目录下的子文件
				for (var i = 0; i < childrenArr.length; i++) {
					var childrenId = childrenArr[i].id_;

					var data = {
						"dbId": "srpt",
						"tableName": configUrl_main.dm_co_ba_srpt_menu_tableName,
						//"tableName":"dm_co_ba_srpt_menu",
						"type": "update",
						"conditions": ["id_"],
						"data": {
							"id_": childrenId,
							"enabled": 0
						}
					}; //添加目录参数
					var dataStr = JSON.stringify(data);
					$.ajax({
						url: eastcom.baseURL + configUrl_main.update_update,
						//url :eastcom.baseURL+"/srpt/rcpt/common/update" ,
						type: 'POST',
						async: false,
						dataType: "json",
						contentType: "application/json",
						data: dataStr,
						success: function(data) {

						}
					});
				};


			};

			return;
		};

		var data = {
			"dbId": "srpt",
			"tableName": configUrl_main.dm_co_ba_srpt_menu_tableName,
			//"tableName":"dm_co_ba_srpt_menu",
			"type": "update",
			"conditions": ["id_"],
			"data": {
				"id_": nodeId,
				"enabled": 0
			}
		};
		var dataStr = JSON.stringify(data);
		commonAjax(configUrl_main.update_update, dataStr, "", "");
		//commonAjax("/srpt/rcpt/common/update",dataStr,"","");
		$('#tree').tree("remove", $('#tree').tree('find', nodeId).target);
	},
	removeReport: function() {
		var nodeId = $("#mmTtr").html();

		var msg = "确定删除报表吗?"
		if (confirm(msg) == true) {

			var data = {
				"dbId": "srpt",
				"tableName": configUrl_main.dm_co_ba_srpt_menu_tableName,
				//"tableName":"dm_co_ba_srpt_menu",
				"type": "update",
				"conditions": ["id_"],
				"data": {
					"id_": nodeId,
					"enabled": 0
				}
			}; //添加目录参数
			var dataStr = JSON.stringify(data);
			commonAjax(configUrl_main.update_update, dataStr, "", "");
			//commonAjax("/srpt/rcpt/common/update",dataStr,"","");
			$('#tree').tree("remove", $('#tree').tree('find', nodeId).target);
		};

	},
	getFieldDate: function() {
		var nodeId = $("#mmTtr").html();
		var data = {
			"id": nodeId,
			"type": "3"
		};
		var dataStr = JSON.stringify(data);
		var res = commonAjax(configUrl_main.srpt_rcpt_getColumnDesc, dataStr, "", "");
		//var res = commonAjax("/srpt/rcpt/getColumnDesc",dataStr,"",""); 
		return res;
	},
	ArithEdit: function() {
		var res = mainE.getFieldDate();
		var data = res.data;
		//先把查询的值,放到保存参数里面,防止不修改保存,无保存内容
		field_arith_arr = []; //每次编辑算法先清空这个数组
		for (var i = 0; i < data.length; i++) {
			var demo_data = {};
			demo_data.id = data[i].id;
			demo_data.name = data[i].column;
			demo_data.name_z = data[i].columnCN;
			demo_data.descr_ = data[i].descr;
			if (typeof(data[i].strategy) == "string") {
				demo_data.strategy = $.parseJSON(data[i].strategy);
			} else {
				demo_data.strategy = data[i].strategy;
			};


			demo_data.type = "3";

			field_arith_arr.push(demo_data);
		};


		mainE.loadDesc();
		mainE.loadField(data);
		$("#fieldInfo_div").css('display', 'none');
		$("#fieldInfo_div_kong").css('display', 'block');
		$("#ArithEdit").modal("toggle");
		$("#ArithEdit").css("top","0px");
	},
	loadDesc: function() {
		$("#algo_instru").val("");
		var nodeId = $("#mmTtr").html();
		var data = {
			"ifId": "srpt-cfg-reportInfo",
			"report_id": nodeId
		};
		var dataStr = JSON.stringify(data);
		var res = commonAjax(configUrl_main.query_reportInfo, dataStr, "", "");
		//var res = commonAjax("/srpt/rcpt/common/query",dataStr,"","");
		if (res.data == null || res.data == "null") {
			return;
		};
		var algo_instru = res.data.algo_instru;
		$("#algo_instru").val(algo_instru);

	},
	loadField: function(data) {
		var htmlStr = "";
		for (var i = 0; i < data.length; i++) {
			var len = 0;
			if (typeof(data[i].strategy) == "string") {
				len = 1;
			};
			//var len = 1 ;
			htmlStr += '<div name="demo_name_div" flag="0" values_E="' + data[i].column + '" values_Z="' + data[i].columnCN + '" onclick="mainE.seekFieldArith(this,\'' + data[i].column + '\')"  onmouseover="mainE.addBackground(this)" onmouseout="mainE.delBackground(this)" onselectstart="return false;" style="-moz-user-select:none; background:#E6F1F2 ; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;padding: 4px;margin-bottom: 5px;">' +
				'<input type="checkbox" ' + (len == 0 ? " " : 'checked="checked"') + '  values="' + data[i].column + '" style="margin-left:0px" />' +
				'<a href="javascript:void(0)" title="' + data[i].columnCN + '">' +
				'<div style="display: inline-block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:85%;">' + data[i].columnCN + '</div></a>' +
				'</div>'
		};
		$("#field_div").html(htmlStr);
	},
	seekFieldArith: function(obj, param) {
		$("#field_div").find('div[name = "demo_name_div"]').each(function(index, el) {
			$(this).css('backgroundColor', '#E6F1F2').attr('flag', '0');

		});
		$(obj).css('backgroundColor', '#A6FBFF').attr('flag', '1');
		$("#fieldInfo_div_kong").css('display', 'none');
		$("#fieldInfo_div").css('display', 'block');
		$("#tableField_div").find('div[sf="1"]').css('display', 'none').attr('sf', '0').find('input').val("");
		$("#fieldArith_input").val("");

		//alert(param);
		for (var i = 0; i < field_arith_arr.length; i++) {
			if (param == field_arith_arr[i].name) {
				$("#fieldArith_input").val(field_arith_arr[i].descr_);
				var strategy_arr = field_arith_arr[i].strategy;
				if (strategy_arr == null || strategy_arr == "null") {
					return;
				};
				for (var j = 0; j < strategy_arr.length; j++) {
					var showDiv = "";
					if (j == 0) {
						showDiv = $("#sf_first_div");
					} else {
						showDiv = $("#tableField_div").find('div[sf="1"]').next('div').last();
					};
					showDiv.css('display', 'block').attr('sf', '1');

					showDiv.find('input').each(function(index, el) {
						if (index == 0) {
							$(this).val(strategy_arr[j].tn);
						} else {
							$(this).val(strategy_arr[j].cn);
						};
					});
				};
			};
		};


	},
	addBackground: function(obj) {
		if ($(obj).css('backgroundColor') != "rgb(166, 251, 255)") { //red
			$(obj).css('backgroundColor', '#F2FEFF'); //green   
		};
	},
	delBackground: function(obj) {
		if ($(obj).css('backgroundColor') == "rgb(242, 254, 255)") { //green
			$(obj).css('backgroundColor', '#E6F1F2');
		};
		//84e4ff     
	},
	addTableField: function() {
		var obj = $("#tableField_div").find('div[sf="1"]').next('div').last();
		if (obj.length != 0) {
			obj.css('display', 'block').attr('sf', '1');
			obj.find('input').val("");

		} else {
			$("#sf_first_div").css('display', 'block').attr('sf', '1');
			$("#sf_first_div").find('input').val("");
		};
	},
	delTableField: function(obj) {
		$(obj).parent().css('display', 'none').attr('sf', '0');
	},
	bindTableField: function() {
		var field_data = {
			"id": "",
			"name": "",
			"descr_": "",
			"strategy": "",
			"type": "3"
		};
		var arr_field = [];
		$("#tableField_div").find('div[sf = "1"]').each(function(index, el) {
			var obj_div = {
				"tn": "",
				"cn": ""
			};
			$(this).find('input').each(function(index_n, el_n) {
				if (index_n == 0) {
					obj_div.tn = $(el_n).val();
				} else {
					obj_div.cn = $(el_n).val();
				};
			});
			arr_field.push(obj_div);
		});

		var nodeId = $("#mmTtr").html();
		//获取当前选中字段的名称
		var values_E = "";
		var values_Z = "";
		$("#field_div").find('div[flag = "1"]').each(function(index, el) {
			values_E = $(this).attr('values_E');
			values_Z = $(this).attr('values_Z');
		});

		//更新清除已有的字段
		var flag = true;
		for (var i = 0; i < field_arith_arr.length; i++) {
			if (values_E == field_arith_arr[i].name) {
				flag = false;
				field_arith_arr[i].name_z = values_Z;
				field_arith_arr[i].strategy = arr_field;
				field_arith_arr[i].descr_ = $("#fieldArith_input").val();;
			};
		};
		if (flag) {
			field_data.id = nodeId;
			field_data.name = values_E;
			field_data.name_z = values_Z;
			field_data.strategy = arr_field;
			field_data.descr_ = $("#fieldArith_input").val();

			field_arith_arr.push(field_data);
		};
	},
	saveFieldArith: function() {
		var newArr_field_arith = [];
		$("#field_div").find('div[name = "demo_name_div"]').each(function(index, el) {
			var checkBox = $(this).find('input[type = "checkbox"]').eq(0);
			if (checkBox.is(':checked')) {
				for (var i = 0; i < field_arith_arr.length; i++) {
					if (checkBox.attr('values') == field_arith_arr[i].name) {
						newArr_field_arith.push(field_arith_arr[i]);
					};
				};
			};

		});

		//保存报表说明
		var nodeId = $("#mmTtr").html();
		var algo_instru = $("#algo_instru").val();
		var dataA = {
			"dbId": "srpt",
			"tableName": configUrl_main.dm_co_ba_srpt_report_tableName,
			//"tableName":"dm_co_ba_srpt_report",
			"type": "update",
			"conditions": ["report_id"],
			"data": {
				"report_id": nodeId,
				"algo_instru": algo_instru
			}
		};
		var dataStrA = JSON.stringify(dataA);
		commonAjax(configUrl_main.update_update, dataStrA, "", "");
		//commonAjax("/srpt/rcpt/common/update",dataStrA,"",""); 


		//newArr_field_arith

		if (newArr_field_arith.length == 0) {
			var tianchongId_obj = {
				"id": nodeId
			};
			newArr_field_arith.push(tianchongId_obj);
		};
		var data = newArr_field_arith;
		var dataStr = JSON.stringify(data);
		var res = commonAjax(configUrl_main.srpt_rcpt_saveColumnDescr, dataStr, "", "");
		//var res = commonAjax("/srpt/rcpt/saveColumnDescr",dataStr,"","");
		if (res.success) {
			$("#ArithEdit").modal("hide");
			alert("保存成功!");
		};

	},


	addMuluName: function() {
		var id = mainE.getCurrTimeToId();
		var names = $("#muluName").val();
		var name_ = names.trim();
		var type_ = 0;
		var parent_id = $("#mmTtr").html();
		var descr_ = "test";
		if (name_ == "" || name_.trim() == "") {
			alert("名称不能为空!");
			return
		};
		var flag = mainE.checkCreateMenueName(name_);
		if (flag == 1) {
			alert("该名称已存在!");
			return;
		};
		var data = {
			"dbId": "srpt",
			"tableName": configUrl_main.dm_co_ba_srpt_menu_tableName,
			//"tableName":"dm_co_ba_srpt_menu",
			"type": "insert",
			"data": {
				"ID_": id,
				"name_": name_,
				"type_": type_,
				"enabled": 1,
				"parent_id": parent_id,
				"descr_": descr_
			}
		}; //添加目录参数
		var dataStr = JSON.stringify(data);
		commonAjax(configUrl_main.update_insert, dataStr, "", "");
		//commonAjax("/srpt/rcpt/common/update",dataStr,"","");
		var parent = $('#tree').tree('find', parent_id);
		$('#tree').tree('collapse', parent.target);
		$('#tree').tree('expand', parent.target);
		$("#mymodal").modal("hide"); //关闭弹框
	},
	resetMuluName: function() {
		$("#muluName").val(" ");
	},
	resetAlterMuluName: function() {
		$("#alterMuluName").val(" ");
	},
	getCurrTimeToId: function() {
		var date = new Date();
		var dateStr = date.format("yyyyMMddhhmmss");
		return dateStr;
	},
	getCurryMuluId: function() {
		var nodeId = $("#mmTtr").html();
		return nodeId;
	},
	getCurryReportId: function() {
		var nodeId = $("#onclickId").html();
		return nodeId;
	},
	getCurryReportName: function() {
		var nodeId = $("#onclickName").html();
		return nodeId;
	},
	addReportOf: function(arr, parent_id) { //实现增加一张报表动态添加到菜单栏
		var parent = $('#tree').tree('find', parent_id);
		$('#tree').tree("append", {
			parent: parent.target,
			data: arr
		});
	},
	updateReportName: function(id, name) {
		$('#tree').tree("update", {
			target: $('#tree').tree('find', id).target,
			text: name
		});
	},
	seekReport: function() {
		var value = $("#seekReportName").val(); //获取文本框输入的内容  
		/* var data = {
		              "name":value
		            };*/
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
		/* var data =  {"username":userName,
		           "enabled":[1,2,3],
		           "name":value
		           }; */
		var data = {};
		var nameType = $("#nameType").val();
		if (nameType == "report") {
			data = {
				"username": userName,
				"enabled": [1, 2, 3, 4],
				"type": "0",
				"report_name": value,
				"kpi_name": ""
			};
		} else {
			data = {
				"username": userName,
				"enabled": [1, 2, 3, 4],
				"type": "0",
				"report_name": "",
				"kpi_name": value
			};
		}


		var dataStr = JSON.stringify(data);
		$('body').mask("数据正在加载中,请稍等....");
		//--var res = commonAjax(configUrl_main.srpt_rcpt_syncQueryReport ,dataStr,"","");
		//var res = commonAjax("/srpt/rcpt/syncQueryReport",dataStr,"","");
		//var res = commonAjax("/srpt/rcpt/findByParentContinue",dataStr,"","");
		//----------------------------------------------------------------------
		$.ajax({
			url: eastcom.baseURL + configUrl_main.srpt_rcpt_syncQueryReport,
			type: 'POST',
			async: true,
			dataType: "json",
			contentType: "application/json",
			data: dataStr,
			success: function(data) {
				var res = data;
				var item = res.data;
				var htmlStr = "";
				if (!res.success) {
					htmlStr += '<br/><h4 style="margin-left:113px">查询异常!</h4>'
					$("#table").html(htmlStr);
					$('body').unmask();
					return;

				};
				if (item.length == 0) {
					htmlStr += '<br/><h4 style="margin-left:113px">没有查询到相应报表!</h4>'
					$("#table").html(htmlStr);
					$('body').unmask();
					return;
				};
				var lie = 3;
				$("#table").html("");
				for (var i = 0; i < item.length; i++) {
					var groupNum = i % lie;

					if (groupNum == 0) {
						htmlStr += '<tr>'
					};
					htmlStr += '<td style="border-top:0px;width: 33%;"><a id="inputKuang_' + item[i].id_ + '" onmouseover="mainE.popoverKuang(' + item[i].id_ + ')" onmouseout="mainE.delpopoverKuang(' + item[i].id_ + ')" onClick="mainE.selectReportName(' + item[i].id_ + ')" style="color: blue;text-decoration:underline ;cursor: pointer;font-size: 17px;" >' + item[i].name_ + '</a></td>'
					if (groupNum == lie - 1) {
						htmlStr += '</tr>';
					};
				};
				$("#table").html(htmlStr);
			},
			complete: function(XMLHttpRequest, textStatus) {
				//HideLoading();
				$('body').unmask();
			},
			error: function() {
				//请求出错处理
				eastcom.showMsg("danger", "请求异常,数据加载失败!");
			}
		});
		//----------------------------------------------------------------------
	},
	popoverKuang: function(id) {
		//----------------------------------------------
		//console.log("mainEjs_1104----"+ id); 
		var value = $("#seekReportName").val();
		var data = {
			"report_id": JSON.stringify(id),
			"fields": "FIELD_INFO",
			"kpi_name": value
		};
		var dataStr = JSON.stringify(data);
		//var res = commonAjax(configUrl_main.srpt_cfg_reportInfo,dataStr,"","");
		$.ajax({
			url: eastcom.baseURL + configUrl_main.srpt_cfg_reportInfo,
			type: 'POST',
			async: false,
			dataType: "json",
			contentType: "application/json",
			data: dataStr,
			success: function(data) {
				var res = data;
				if (!res) {
					//eastcom.showMsg("danger","FIELD_INFO字段為为空,请先查询该报表,初始化FIELD_INFO!!");
					//setTimeout('clearMsg()', 3000 );
					return;
				};
				var content = "";
				var testArr = res.data;
				var len = testArr.length;
				for (var i = 0; i < testArr.length; i++) {
					var currItem = testArr[i].fieldname;
					content += currItem + '<br/>';
				};

				var options = {
					animation: true,
					html: true, //向弹出框插入 HTML。如果为 false，jQuery 的 text 方法将被用于向 dom 插入内容(title,content中的内容div无效)。
					//selector :$("#bbb"),
					placement: 'bottom',
					trigger: 'manual', //定义如何触发弹出框： click| hover | focus | manual(手动)。
					//title : len+'<span style="float:right"><a href="javascript:mainE.delpopoverKuang('+id+')" class="fr fa fa-times cursor" style="color:#0085d0"></a></span>',
					title: '共匹配到' + len + '个',
					content: '<div style="overflow: auto;border:0px solid red ; max-height:400px;line-height: 30px;">' + content + '</div>',
					delay: {
						show: 100,
						hide: 100
					} //延迟显示和隐藏弹出框的毫秒数 - 对 manual 手动触发类型不适用。如果提供的是一个数字，那么延迟将会应用于显示和隐藏。如果提供的是对象，结构如下所示：

				};
				$('#inputKuang_' + id).popover(options);
				var nameType = $("#nameType").val();
				if (testArr.length != 0 && nameType == "index") {
					$('#inputKuang_' + id).popover('show');
				};

			},
			complete: function(XMLHttpRequest, textStatus) {
				//HideLoading();
			},
			error: function() {
				//请求出错处理
				eastcom.showMsg("danger", "请求异常,数据加载失败!");
				setTimeout('clearMsg()', 3000);
			}
		});
		//----------------------------------------------
		/*if (!res.success) {
                                 eastcom.showMsg("danger","数据加载失败!");
                                 setTimeout('clearMsg()', 3000 );
                                 return;
                             };
                            var content = "";
                            var testArr = res.data;
                            var len =testArr.length;
                            for (var i = 0; i < testArr.length; i++) {
                                    var currItem = testArr[i].fieldname;
                                    content += currItem + '<br/>';
                            };

                           var options = {
                                         animation : true,
                                         html : true,            //向弹出框插入 HTML。如果为 false，jQuery 的 text 方法将被用于向 dom 插入内容(title,content中的内容div无效)。
                                         //selector :$("#bbb"),
                                         placement : 'bottom',
                                         trigger : 'manual',         //定义如何触发弹出框： click| hover | focus | manual(手动)。
                                         //title : len+'<span style="float:right"><a href="javascript:mainE.delpopoverKuang('+id+')" class="fr fa fa-times cursor" style="color:#0085d0"></a></span>',
                                         title : '共匹配到'+len+'个',
                                         content :'<div style="overflow: auto;border:0px solid red ; max-height:200px;line-height: 30px;">'+content+'</div>',
                                         delay : {show:100,hide:100}   //延迟显示和隐藏弹出框的毫秒数 - 对 manual 手动触发类型不适用。如果提供的是一个数字，那么延迟将会应用于显示和隐藏。如果提供的是对象，结构如下所示：

                                   };
                           $('#inputKuang_'+id).popover(options);
                           $('#inputKuang_'+id).popover('show');*/
	},
	delpopoverKuang: function(id) {
		$('#inputKuang_' + id).popover('hide');
	},
	selectReportName: function(val) {
		var parent_id_arr = []; //存放所有父类id 
		var report_id = val;
		var data = {
			"ifId": "srpt-cfg-menuQueryParent",
			"id": JSON.stringify(report_id)
		};
		var dataStr = JSON.stringify(data);
		$('body').mask("菜单树图加载中,请稍等....");
		var res = commonAjax(configUrl_main.query_menuQueryParent, dataStr, "", "");
		//var res = commonAjax("/srpt/rcpt/common/query",dataStr,"","");
		var arr = res.data;
		for (var i = 0; i < arr.length; i++) {
			parent_id_arr.push(arr[i].parent_id);
		};

		//按照父类数组展开所有菜单
		for (var m = parent_id_arr.length - 1; m > -1; m--) {
			var parentId = parent_id_arr[m];

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
			var data = {
				"creator_": userName,
				"report_id": parentId,
				"enabled": [1, 2, 3, 4],
				"class": "0"
			};


			/*var data = {
			             "ifId":"srpt-cfg-menuQuery",
			             "parent_id":parentId
			           
			          }; //添加目录参数*/
			var dataStr = JSON.stringify(data);
			//var res1 = commonAjax("/srpt/rcpt/common/query",dataStr,"","");
			var res1 = commonAjax(configUrl_main.srpt_rcpt_asyncFindByCreator, dataStr, "", "");
			//var res1 = commonAjax("/srpt/rcpt/asyncFindByCreator",dataStr,"","");
			var arr = mainE.zhuanhuancaidanData(res1.data)
			var parent = $('#tree').tree('find', parentId);
			if (parent == null) {
				return;
			};
			var childrens = $('#tree').tree('getChildren', parent.target);
			for (var i = 0; i < childrens.length; i++) {
				$('#tree').tree('remove', childrens[i].target);
			}
			$('#tree').tree("append", {
				parent: parent.target,
				data: arr
			});
			isRelExplan = true;
			$('#tree').tree('expand', parent.target);
			isRelExplan = false;
		};
		var reportId = $('#tree').tree('find', report_id);
		if (parent == null) {
			return;
		};
		$("#tree").tree('scrollTo', reportId.target); //滚动到当前节点 
		$("#tree").tree('select', reportId.target); //高亮显示当前节点    
		$('body').unmask();
	},
	createPreviewReport: function(previewReportName, info_sql_value, updateReportId) {
		var subtitle = previewReportName + '--预览';
		qry_bd_info_preview = info_sql_value;
		preview_report_id = updateReportId;
		var url = "previewReport.jsp?updateReportId="+updateReportId
		if (!$('#tabs').tabs('exists', subtitle)) {
			$('#tabs').tabs('add', {
				title: subtitle,
				content: mainE.createFrame(url),
				closable: true,
				iconCls: 'icontabstitle'
			});
			tabClose();
			tabCloseEven();

		} else {
			$('#tabs').tabs('select', subtitle);
		};
	},
	previewReportToId: function() {
		return preview_report_id;
	},
	previewReportToData: function() {
		return qry_bd_info_preview;
	},
	clearPreviewReportToData: function() {
		qry_bd_info_preview = "";
	},
	//-----------------------------------------------------------------------
	createQueryResultTab: function(val) {
		var title_id = val.reportCheckInfo.report_id;
		var title_name = "";
		var data = {
			"ifId": "srpt-cfg-menuQueryself",
			"id": title_id
		};
		var dataStr = JSON.stringify(data);
		var res = commonAjax(configUrl_main.query_menuQueryself, dataStr, "", "");
		//var res = commonAjax("/srpt/rcpt/common/query",dataStr,"","");
		title_name = res.data[0].name_;
		var url = "reportQueryResult.jsp?fromWhere=mainE";
		var subtitle = title_name + "查询结果";

		if (!$('#tabs').tabs('exists', subtitle)) {
			$('#tabs').tabs('add', {
				title: subtitle,
				content: mainE.createFrame(url),
				closable: true,
				iconCls: 'icontabstitle'
			});
			tabClose();
			tabCloseEven();
		} else {
			$("#tabs").tabs('close', subtitle);
			$('#tabs').tabs('add', {
				title: subtitle,
				content: mainE.createFrame(url),
				closable: true,
				iconCls: 'icontabstitle'
			});
			tabClose();
			tabCloseEven();
		};
		repoprtResultData = [];
		repoprtResultData.push(val);
		repoprtResultData.push(title_name);
	},
	createPublishTab: function(val) {
		publish_id_title = val;
		var url = "publishReport.jsp";
		var subtitle = val[1] + "发布";
		if (!$('#tabs').tabs('exists', subtitle)) {
			$('#tabs').tabs('add', {
				title: subtitle,
				content: mainE.createFrame(url),
				closable: true,
				iconCls: 'icontabstitle'
			});
			tabClose();
			tabCloseEven();
		} else {
			$("#tabs").tabs('close', subtitle);
			$('#tabs').tabs('add', {
				title: subtitle,
				content: mainE.createFrame(url),
				closable: true,
				iconCls: 'icontabstitle'
			});
			tabClose();
			tabCloseEven();
		};
	},
	getPublishIdName: function() {
		return publish_id_title
	},
	showQueryReportResultData: function() {
		return repoprtResultData;
	},
	checkCreateMenueName: function(name) {
		var resultMenueNameArr = [];
		var nodeId = $("#mmTtr").html();
		var data = {
			"ifId": "srpt-cfg-menuQuery",
			//"parent_id":nodeId
			"parent_id": ""
		};
		var dataStr = JSON.stringify(data);
		var res = commonAjax(configUrl_main.query_menuQuery, dataStr, "", "");
		//var res = commonAjax("/srpt/rcpt/common/query",dataStr,"","");   
		var result = res.data;
		for (var i = 0; i < result.length; i++) {
			resultMenueNameArr.push(result[i].name_);
		};
		var flag = 0;
		for (var i = 0; i < resultMenueNameArr.length; i++) {
			if (resultMenueNameArr[i] == name) {
				flag = 1;
			};
		};
		return flag;

	},
	checkUpdateMenueName: function(name) {
		var resultMenueNameArr = [];
		var currName = "";
		var nodeId = $("#mmTtr").html();
		var parent_id = "";

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
		var data = {
			"ifId": "srpt-cfg-menuQuery",
			//"parent_id":parent_id
			"parent_id": ""
		};
		var dataStr = JSON.stringify(data);
		var res = commonAjax(configUrl_main.query_menuQuery, dataStr, "", "");
		//var res = commonAjax("/srpt/rcpt/common/query",dataStr,"","");   
		var result = res.data;
		for (var i = 0; i < result.length; i++) {
			resultMenueNameArr.push(result[i].name_);
		};

		//得到未修改时的名称
		/*var data = {
		             "ifId":"srpt-cfg-menuQueryself",
		             "id":nodeId
		          }; 
		var dataStr = JSON.stringify(data);
		var res = commonAjax("/srpt/rcpt/common/query",dataStr,"","");   
		currName = res.data[0].name_;*/
		currName = $("#mmTtr_text").html();
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
	//give up ------------------------------------------------------------------------
	/*zhuanhuaunModalTreeData: function(data) {
		var array = [];
		var flag = false; //判断是否有子文件
		if (data.length > 0) {
			for (var i = 0; i < data.length; i++) {
				if (data[i].type == 0) {
					var object = {};
					object.id = data[i].id_;
					object.text = data[i].name_; //wenbenguanzhu
					var array_two = "";

					flag = true;
					object.attributes = {
						"ishasChilds": true,
						"parent_id": data[i].parent_id
					};
					array_two = mainE.zhuanhuaunModalTreeData(data[i].children);

					if (flag) {
						object.state = 'closed';
						flag = false;
					}
					object.children = array_two;
					array.push(object);
				};
			};
		};
		return array;
	},*/
	//------------------------------------------------------------------------
	zhuanhuaunModalTreeData: function(data) {
		var array = [];
		/// 属性配置信息
		var attributes = {
			// 根节点标识
		    rootKey: '0',
		    // 标识字段名
		    keyField: 'ID_',
		    // 上级标识字段名
		    parentKeyField: 'PARENT_ID',
		    // 文本字段名及各种属性
		    textField: 'NAME_',
		    type:'type',
		    enabled:'enabled'
		};

		/// treeData即为转化后的树形结构数据
		array = mainE.convertTreeData(data, attributes);

		return array;
	},
	convertTreeData :function(rows, attributes){
				var keyNodes = {}, parentKeyNodes = {};
				for (var i = 0; i < rows.length; i++) {
						var row = rows[i];
								row.id = row[attributes.keyField];
								row.parentId = row[attributes.parentKeyField];
								row.text = row[attributes.textField];
								row.type = row[attributes.type];
								row.enabled = row[attributes.enabled];
								row.attributes = {"ishasChilds": true,"parent_id": row[attributes.parentKeyField]};
								row.children = [];
								row.state = 'closed';

						        keyNodes[row.id] = row;

						if (parentKeyNodes[row.parentId]) { parentKeyNodes[row.parentId].push(row); }
						else { parentKeyNodes[row.parentId] = [row]; };

						var children = parentKeyNodes[row.id];
						if (children) { row.children = children; };

						var pNode = keyNodes[row.parentId];
						if (pNode) { pNode.children.push(row); };
				};
				return parentKeyNodes[attributes.rootKey];
	},
	getModalTreeData: function() {
		$("#moveReport").modal("toggle");
		//http://localhost:7080/web-selfReport-special/srpt/rcpt/syncQueryReport
		/*if (_CacheFun._getCache("ModalTreeData") && _CacheFun._getCache("ModalTreeData") != null) {
			var data = _CacheFun._getCache("ModalTreeData"); //拿去缓存对象中的数据
			mainE.moveReport(data);*/
		if (!true) {	
		} else {
			/*var param = {
				"username": "",
				"enabled": [1, 2, 3],
				"type": "1",
				"report_name": ""
			};*/
			//var param = {"ifId":"srpt-cfg-queryAllPackage"}
			var param = {"ifId": configUrl_main.srpt_cfg_queryAllPackage};

			var paramStr = JSON.stringify(param);
			$("#modalTreeDiv").mask("数据加载中....");
			$.ajax({
				//url: eastcom.baseURL + "/srpt/rcpt/common/query",
				//url: eastcom.baseURL + configUrl_main.query_dataSource,
				url: eastcom.baseURL + configUrl_main.query_queryAllPackage,
				//url: eastcom.baseURL + configUrl_main.srpt_rcpt_syncQueryReport,
				//url :eastcom.baseURL+'/srpt/rcpt/syncQueryReport' ,
				type: 'post',
				async: true,
				dataType: "json",
				contentType: "application/json",
				data: paramStr,
				success: function(res) {
					var dataArr = res.data;
					
					var BigArr = mainE.zhuanhuaunModalTreeData(dataArr);
					_CacheFun._bindCache("ModalTreeData", BigArr);
					mainE.moveReport(BigArr);
				},
				complete: function(XMLHttpRequest, textStatus) {
					$("#modalTreeDiv").unmask();
				},
				error: function() {
					//请求出错处理
					var Arr = [];
					mainE.moveReport(Arr);
					eastcom.showMsg("danger", "请求异常,数据加载失败!");
					setTimeout('clearMsg()', 3000);
				}

			});
		};
	},
	moveReport: function(initData) {
		$("#alterToOldName").prop("checked", false);
		$('#modalTree').tree({
			data: initData,
			lines: true,
			animate: true
		}); //modalTree
		var nodeId = $("#mmTtr").html();
		var nodeTarget = $('#modalTree').tree('find', nodeId);
		if (nodeTarget) {
			$('#modalTree').tree('expandTo', nodeTarget.target);
			$('#modalTree').tree('check', nodeTarget.target);
		};


	},
	moveReports: function() {
		//修改父id-----------------------------  
		var id_ = $("#mmTtr").html();
		var text_ = $("#mmTtr_text").html();
		var parent_id_target = $("#modalTree").tree('getSelected');
		if (parent_id_target == "undefined" || parent_id_target == undefined) {
			eastcom.showMsg('danger', '请选择目标文件!');
			setTimeout('clearMsg()', 3000);
			return;
		};


		var parent_id = parent_id_target.id;
		var parent_text = parent_id_target.text;
		if (confirm("是否将\"" + text_ + "\"移动到\"" + parent_text + "\"目录下?")) {
			var dataS = {
				"dbId": "srpt",
				"tableName": configUrl_main.dm_co_ba_srpt_menu_tableName,
				//"tableName":"dm_co_ba_srpt_menu",
				"type": "update",
				"conditions": ["id_"],
				"data": {
					"id_": id_,
					"parent_id": parent_id
				}
			};
			var dataStrS = JSON.stringify(dataS);
			var resS = commonAjax(configUrl_main.update_update, dataStrS, "", "");
			//var resS = commonAjax("/srpt/rcpt/common/update",dataStrS,"","");
			if (resS.resultCode == 0 || resS.msg == "success") {
				$("#moveReport").modal("hide");
				eastcom.showMsg('success', '移动成功!');
				setTimeout('clearMsg()', 1500);

				/*
				  target.state   ==   "close/open"
				*/

				var oldNode = $('#tree').tree('find', id_);
				$('#tree').tree('remove', oldNode.target);
				//$('#tree').tree('expand', oldNode.target);

				var newNode = $('#tree').tree('find', parent_id);
				if (newNode.state == "open") {
					$('#tree').tree('collapse', newNode.target);
					$('#tree').tree('expand', newNode.target);
				};

			};
		};
	},
	//------------------------------------------------------------------------
	changeTip: function() {
		var nameType = $("#nameType").val();
		if (nameType == "report") {
			$("#seekReportName").attr('placeholder', '请输入报表名称');
		} else {
			$("#seekReportName").attr('placeholder', '请输入指标名称');
		}
	},

	//==========================================
	changeReportToJsp : function(){
		    var reportRadio = $("#reportRadio").is(':checked');
		    console.log(reportRadio);
		    if(reportRadio){
                 $("#dataPoolDiv").css('display', 'none'); 
                 $("#dataPoolButton").css('display', 'none')
                 $("#dataJspAddressDiv").css('display', 'inline-block'); 
                 $("#dataJspAddressButton").css('display', 'inline-block');  
                 
		    }else{
		    	 $("#dataPoolDiv").css('display', 'inline-block'); 
		    	 $("#dataPoolButton").css('display', 'inline-block')
		    	 $("#dataJspAddressDiv").css('display', 'none'); 
		    	 $("#dataJspAddressButton").css('display', 'none'); 
		    };



		    

	},

};


function tabClose() {
	/*双击关闭TAB选项卡*/
	/* $(".tabs-inner").dblclick(function(){
	   var subtitle = $(this).children(".tabs-closable").text();
	   $('#tabs').tabs('close',subtitle);
	 });*/
	/*为选项卡绑定右键*/
	$(".tabs-inner").bind('contextmenu', function(e) {
		$('#mm').menu('show', {
			left: e.pageX,
			top: e.pageY
		});

		var subtitle = $(this).children(".tabs-closable").text();

		$('#mm').data("currtab", subtitle);
		$('#tabs').tabs('select', subtitle);
		return false;
	});
};
//绑定右键菜单事件
function tabCloseEven() {
	//刷新
	$('#mm-tabupdate').click(function() {
		var currTab = $('#tabs').tabs('getSelected');
		var url = $(currTab.panel('options').content).attr('src');
		$('#tabs').tabs('update', {
			tab: currTab,
			options: {
				content: createFrame(url)
			}
		});
	});
	//关闭当前
	$('#mm-tabclose').click(function() {
		var currtab_title = $('#mm').data("currtab");
		$('#tabs').tabs('close', currtab_title);
	});
	//全部关闭
	$('#mm-tabcloseall').click(function() {
		$('.tabs-inner span').each(function(i, n) {
			var t = $(n).text();
			if (t != "报表搜索") {
				$('#tabs').tabs('close', t);
			};
		});
	});
	//关闭除当前之外的TAB
	$('#mm-tabcloseother').click(function() {
		$('#mm-tabcloseright').click();
		$('#mm-tabcloseleft').click();
	});
	//关闭当前右侧的TAB
	$('#mm-tabcloseright').click(function() {
		var nextall = $('.tabs-selected').nextAll();
		if (nextall.length == 0) {
			//msgShow('系统提示','后边没有啦~~','error');
			return false;
		}
		nextall.each(function(i, n) {
			var t = $('a:eq(0) span', $(n)).text();
			$('#tabs').tabs('close', t);
		});
		return false;
	});
	//关闭当前左侧的TAB
	$('#mm-tabcloseleft').click(function() {
		var prevall = $('.tabs-selected').prevAll();
		if (prevall.length == 0) {
			return false;
		}
		prevall.each(function(i, n) {
			var t = $('a:eq(0) span', $(n)).text();
			if (t != "报表搜索") {
				$('#tabs').tabs('close', t);
			};
		});
		return false;
	});

	//退出
	$("#mm-exit").click(function() {
		$('#mm').menu('hide');
	});
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