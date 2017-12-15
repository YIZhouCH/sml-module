var repoprtResultData = [];
var autoReport = {
	init: function() {
		autoReport.appendDiv();
		//autoReport.loadTree(); 
		autoReport.loadTreeData();
	},
	appendDiv: function() {
		var divS = '<div title="刷新" style="cursor:pointer;display:inline-block;margin-right: 30px;float: right;" onClick="autoReport.loadTreeData()">' +
			'<img height="20px" width="25px" src="../../static/reportManageSys/images/link.jpg" />' +
			'</div>'
		$('.panel-title').append(divS);
	},
	zhuanhuaunTreeData: function(data) {
		var array = [];
		if (data == null || data == "null") {
			return array;
		};
		var flag = false; //判断是否有子文件
		if (data.length > 0) {
			for (var i = 0; i < data.length; i++) {
				var object = {};
				object.id = data[i].id_;
				object.text = data[i].name_; //wenbenguanzhu
				var array_two = "";
				if (data[i].type == 1) {
					if (data[i].is_bind == 0) { //0代表没有绑定
						object.iconCls = "icon-wenbenfabu";
					};
					if (data[i].is_bind == 1) {
						object.iconCls = "icon-wenbenfabu1";
					};
					object.attributes = {
						"ishasChilds": false,
						"parent_id": data[i].parent_id,
						"url": data[i].url
					};
				};
				if (data[i].type == 0) {
					flag = true;
					object.attributes = {
						"ishasChilds": true,
						"parent_id": data[i].parent_id,
						"url": data[i].url
					};
					array_two = autoReport.zhuanhuaunTreeData(data[i].children);
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
	loadTreeData: function() {
		var data = {
			"mark": "url",
			"url": autoReportParam
		};
		var dataStr = JSON.stringify(data);
		$("#treeDiv").mask("数据加载中....");
		$.ajax({
			url: eastcom.baseURL + configUrl_main.syncQueryReportUrl,
			//url :eastcom.baseURL+'/srpt/rcpt/syncQueryReportUrl' ,
			type: 'post',
			async: true,
			dataType: "json",
			contentType: "application/json",
			data: dataStr,
			success: function(res) {
				var dataArr = res.data;
				var BigArr = autoReport.zhuanhuaunTreeData(dataArr);
				autoReport.loadTree(BigArr);
			},
			complete: function(XMLHttpRequest, textStatus) {
				$("#treeDiv").unmask();
			},
			error: function() {
				//请求出错处理
				eastcom.showMsg("danger", "请求异常,数据加载失败!");
				setTimeout('clearMsg()', 3000);
			}

		});
	},
	loadTree: function(getData) {
		var initData = [{
			"id": 0,
			"text": "报表分类",
			"state": "open",
			//"iconCls":"icon-add",
			"attributes": {
				"ishasChilds": true,
				"url": autoReportParam
			},
			"children": getData
		}];
		$('#tree').tree({
			data: initData,
			lines: true,
			animate: true,
			onContextMenu: function(e, node) {
				if (operate == false || operate == "false") {} else if (operate == true || operate == "true") {
					e.preventDefault();
					$('#tree').tree('select', node.target);
					if (node.attributes.ishasChilds && node.id == 0) {
						$('#mm0').menu('show', {
							left: e.pageX,
							top: e.pageY
						});
					}
					if (node.attributes.ishasChilds && node.id != 0) {
						$('#mm1').menu('show', {
							left: e.pageX,
							top: e.pageY
						});
					} else if (node.attributes.ishasChilds == false) {
						$('#mm2').menu('show', {
							left: e.pageX,
							top: e.pageY
						});
					} else {
						console.log("啥也不干!");
					};
					$("#mmTtr").html(node.id);
					$("#mmTtr_text").html(node.text);
					$("#url_url").html(node.attributes.url);
				} else {};

			},
			onDblClick: function(node) {
				var type = node.attributes.ishasChilds;
				if (!type) {
					//点击打卡一张报表
					var subtitle = node.text
					var url = "publicReport.jsp?fromWhere=autoReportId"
					if (!$('#tabs').tabs('exists', subtitle)) {
						$('#tabs').tabs('add', {
							title: subtitle,
							content: autoReport.createFrame(url),
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
			}
		}); //tree
		var firstTree = $('#tree').tree('find', 0);
		//$('#tree').tree('collapse', firstTree.target); 
		$('#tree').tree('expand', firstTree.target);
	}, //loadTree

	addMulu: function() {
		if (autoReportParam == "") {
			eastcom.showMsg("danger", "链接参数不能为空!");
			setTimeout('clearMsg()', 3000);
			return;
		};
		$("#addmulu").modal("toggle");
		$("#muluName").val("");
	},
	addMulus: function() {
		var id = autoReport.getCurrTimeToId();
		var name = $("#muluName").val();
		if (name.trim().length == 0) {
			alert("名称不能为空!");
			return;
		};
		var parent_id = $("#mmTtr").html();
		var url_url = $("#url_url").html();
		var data = {
			"dbId": "srpt",
			"tableName": configUrl_main.dm_co_ba_srpt_menu_tpl_tableName,
			//"tableName":"dm_co_ba_srpt_menu_tpl",
			"type": "insert",
			"data": {
				"id_": id,
				"name_": name,
				"type_": "0",
				"parent_id": parent_id,
				"descr_": "test",
				"url_": url_url,
				"is_bind": "0"
			}
		}
		var dataStr = JSON.stringify(data);
		//var ret = commonAjax(configUrl_main.srpt_rcpt_common_update, dataStr, "", "");
		var ret = commonAjax("/sml/update/insert",dataStr,"","");   
		var datas = ret.data;

		//添加页面节点---------------------------------------------------
		var parent = $('#tree').tree('find', parent_id);
		$('#tree').tree('append', {
			parent: parent.target,
			data: [{
				id: id,
				text: name,
				state: "closed",
				attributes: {
					"ishasChilds": true,
					"parent_id": parent_id,
					"url": url_url
				},
				children: []
			}]
		});
		//$("#tree").tree("collapse",parent.target);
		$("#tree").tree("expand", parent.target);
		//--------------------------------------------------- 


		$("#addmulu").modal("hide");
		eastcom.showMsg("success", "添加成功!");
		setTimeout('clearMsg()', 3000);
	},
	addReport: function() {
		$("#addreport").modal("toggle");
		$("#reportName").val("");
	},
	addReports: function() {
		var id = autoReport.getCurrTimeToId();
		var name = $("#reportName").val();
		if (name.trim().length == 0) {
			alert("名称不能为空！");
			return;
		};
		var parent_id = $("#mmTtr").html();
		var url_url = $("#url_url").html();
		var data = {
			"dbId": "srpt",
			"tableName": configUrl_main.dm_co_ba_srpt_menu_tpl_tableName,
			//"tableName":"dm_co_ba_srpt_menu_tpl",
			"type": "insert",
			"data": {
				"id_": id,
				"name_": name,
				"type_": "1",
				"parent_id": parent_id,
				"descr_": "test",
				"url_": url_url,
				"is_bind": "0"
			}
		}
		var dataStr = JSON.stringify(data);
		//var ret = commonAjax(configUrl_main.srpt_rcpt_common_update, dataStr, "", "");
		var ret = commonAjax("/sml/update/insert",dataStr,"","");   
		var datas = ret.data;
		//添加页面节点---------------------------------------------------
		var parent = $('#tree').tree('find', parent_id);
		$('#tree').tree('append', {
			parent: parent.target,
			data: [{
				id: id,
				text: name,
				iconCls: "icon-wenbenfabu",
				attributes: {
					"ishasChilds": false,
					"parent_id": parent_id,
					"url": url_url
				}
			}]
		});
		//$("#tree").tree("collapse",parent.target);
		$("#tree").tree("expand", parent.target);
		//--------------------------------------------------- 
		$("#addreport").modal("hide");
		eastcom.showMsg("success", "添加成功!");
		setTimeout('clearMsg()', 3000);
	},

	alterMulu: function() {
		$("#altermulu").modal("toggle");
		var mmTtr_text = $("#mmTtr_text").html();
		$("#altermuluName").val(mmTtr_text);
	},
	alterMulus: function() {
		var id = $("#mmTtr").html();
		var name = $("#altermuluName").val();
		if (name.trim().length == 0) {
			alert("名称不能为空！");
			return;
		};
		var data = {
			"dbId": "srpt",
			"tableName": configUrl_main.dm_co_ba_srpt_menu_tpl_tableName,
			//"tableName":"dm_co_ba_srpt_menu_tpl",
			"type": "update",
			"conditions": ["id_"],
			"data": {
				"id_": id,
				"name_": name,
			}
		}
		var dataStr = JSON.stringify(data);
		var ret = commonAjax(configUrl_main.srpt_rcpt_common_update, dataStr, "", "");
		var ret = commonAjax("/srpt/rcpt/common/update", dataStr, "", "");
		var datas = ret.data;
		//页面修改-----------------------
		var node = $('#tree').tree('find', id);
		if (node) {
			$('#tree').tree('update', {
				target: node.target,
				text: name
			});
		};
		//-----------------------
		$("#altermulu").modal("hide");
		eastcom.showMsg("success", "修改成功!");
		setTimeout('clearMsg()', 3000);
	},

	updateReportName: function() {
		$("#updateReportName").modal("toggle");
		var mmTtr_text = $("#mmTtr_text").html();
		$("#updatereportname").val(mmTtr_text);
	},
	updateReportNames: function() {
		var id = $("#mmTtr").html();
		var name = $("#updatereportname").val();
		if (name.trim().length == 0) {
			alert("名称不能为空！");
			return;
		};
		var data = {
			"dbId": "srpt",
			"tableName": configUrl_main.dm_co_ba_srpt_menu_tpl_tableName,
			//"tableName":"dm_co_ba_srpt_menu_tpl", 
			"type": "update",
			"conditions": ["id_"],
			"data": {
				"id_": id,
				"name_": name
			}
		}
		var dataStr = JSON.stringify(data);
		var ret = commonAjax(configUrl_main.srpt_rcpt_common_update, dataStr, "", "");
		//var ret = commonAjax("/srpt/rcpt/common/update",dataStr,"","");   
		var datas = ret.data;
		//页面修改-----------------------
		var node = $('#tree').tree('find', id);
		if (node) {
			$('#tree').tree('update', {
				target: node.target,
				text: name
			});
		};
		//-----------------------
		$("#updateReportName").modal("hide");
		eastcom.showMsg("success", "修改成功!");
		setTimeout('clearMsg()', 3000);

	},

	removeMulu: function() {
		var id = $("#mmTtr").html();
		var node = $('#tree').tree('find', id);
		var children = $('#tree').tree('getChildren', node.target);

		var length = children.length;
		if (length != 0) {
			var mag = "该目录下有报表，确定删除吗？"
			if (confirm(mag)) {
				var datas = {
					"mark": "parent",
					"parent_id": id
				}
				var dataStr = JSON.stringify(datas);
				commonAjax(configUrl_main.srpt_rcpt_deletePackageUrl, dataStr, "", "");
				//commonAjax("/srpt/rcpt/deletePackageUrl",dataStr,"","");
				//-------------------------------
				var node = $('#tree').tree('find', id);
				$("#tree").tree("remove", node.target);
				//-------------------------------
				eastcom.showMsg("success", "删除成功!");
				setTimeout('clearMsg()', 3000);
			};
		};
		if (length == 0) {
			var msg = "确定删除吗？"
			if (confirm(msg)) {
				var data = {
					"dbId": "srpt",
					"tableName": configUrl_main.dm_co_ba_srpt_menu_tpl_tableName,
					//"tableName":"dm_co_ba_srpt_menu_tpl",
					"type": "delete",
					"conditions": ["id_"],
					"data": {
						"id_": id
					}
				};
				var dataStr = JSON.stringify(data);
				commonAjax(configUrl_main.update_delete, dataStr, "", "");
				//commonAjax("/srpt/rcpt/common/update",dataStr,"","");
				//-------------------------------
				var node = $('#tree').tree('find', id);
				$("#tree").tree("remove", node.target);
				//-------------------------------
				eastcom.showMsg("success", "删除成功!");
				setTimeout('clearMsg()', 3000);
			};
		};


	},

	removeReport: function() {
		var id = $("#mmTtr").html();
		var msg = "确认删除报表吗？"
		if (confirm(msg)) {
			var data = {
				"dbId": "srpt",
				"tableName": configUrl_main.dm_co_ba_srpt_menu_tpl_tableName,
				//"tableName":"dm_co_ba_srpt_menu_tpl",
				"type": "delete",
				"conditions": ["id_"],
				"data": {
					"id_": id
				}
			}
			var dataStr = JSON.stringify(data);
			commonAjax(configUrl_main.update_delete, dataStr, "", "");
			//commonAjax("/srpt/rcpt/common/update",dataStr,"","");
			//-------------------------------
			var node = $('#tree').tree('find', id);
			$("#tree").tree("remove", node.target);
			//-------------------------------
			eastcom.showMsg("success", "删除成功!");
			setTimeout('clearMsg()', 3000);
		};
	},

	resetMuluName: function() {
		$("#muluName").val(" ");
		$("#reportName").val(" ");
		$("#altermuluName").val(" ");
		$("#updatereportname").val(" ");
	},
	zhuanhuaunModalTreeData: function(data) {
		var array = [];
		var flag = false; //判断是否有子文件
		if (data.length > 0) {
			for (var i = 0; i < data.length; i++) {
				var object = {};
				object.id = data[i].id_;
				object.text = data[i].name_; //wenbenguanzhu
				var array_two = "";
				if (data[i].type == 1) {
					object.attributes = {
						"ishasChilds": false,
						"parent_id": data[i].parent_id
					};
				};
				if (data[i].type == 0) {
					flag = true;
					object.attributes = {
						"ishasChilds": true,
						"parent_id": data[i].parent_id
					};
					array_two = autoReport.zhuanhuaunModalTreeData(data[i].children);
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
	getModalTreeData: function() {
		$("#bindReport").modal("toggle");
		//http://localhost:7080/web-selfReport-special/srpt/rcpt/syncQueryReport
		if (_CacheFun._getCache("ModalTreeData") && _CacheFun._getCache("ModalTreeData") != null) {
			var data = _CacheFun._getCache("ModalTreeData"); //拿去缓存对象中的数据
			autoReport.bindReport(data);
		} else {
			var param = {
				"username": "",
				"enabled": [1, 2, 3],
				"type": "1",
				"report_name": ""
			};
			var paramStr = JSON.stringify(param);
			$("#modalTreeDiv").mask("数据加载中....");
			$.ajax({
				url: eastcom.baseURL + configUrl_main.srpt_rcpt_syncQueryReport,
				//url :eastcom.baseURL+'/srpt/rcpt/syncQueryReport' ,
				type: 'post',
				async: true,
				dataType: "json",
				contentType: "application/json",
				data: paramStr,
				success: function(res) {
					var dataArr = res.data;
					var BigArr = autoReport.zhuanhuaunModalTreeData(dataArr);
					_CacheFun._bindCache("ModalTreeData", BigArr);
					autoReport.bindReport(BigArr);
				},
				complete: function(XMLHttpRequest, textStatus) {
					$("#modalTreeDiv").unmask();
				},
				error: function() {
					//请求出错处理
					var Arr = [];
					autoReport.bindReport(Arr);
					eastcom.showMsg("danger", "请求异常,数据加载失败!");
					setTimeout('clearMsg()', 3000);
				}

			});
		};
	},
	bindReport: function(initData) {
		$("#alterToOldName").prop("checked", false);
		$('#modalTree').tree({
			data: initData,
			lines: true,
			animate: true,
			checkbox: true,
			onlyLeafCheck: true,
			onBeforeCheck: function(node, checked) {
				var cknodes = $('#modalTree').tree("getChecked");
				for (var i = 0; i < cknodes.length; i++) {
					if (cknodes[i].id != node.id) {
						$('#modalTree').tree("uncheck", cknodes[i].target);
					}
				};
			},
			onSelect: function(node) {
				var cknodes = $('#modalTree').tree("getChecked");
				for (var i = 0; i < cknodes.length; i++) {
					if (cknodes[i].id != node.id) {
						$('#modalTree').tree("uncheck", cknodes[i].target);
					}
				};
				if (node.checked) {
					$('#modalTree').tree('uncheck', node.target);

				} else {
					$('#modalTree').tree('check', node.target);

				};

			},
		}); //modalTree
		var nodeId = $("#mmTtr").html();
		var nodeTarget = $('#modalTree').tree('find', nodeId);
		if (nodeTarget) {
			$('#modalTree').tree('expandTo', nodeTarget.target);
			$('#modalTree').tree('check', nodeTarget.target);
		};


	},
	bindReports: function() {
		var checkedNodes = $("#modalTree").tree("getChecked");
		//console.log(checkedNodes);
		if (checkedNodes.length == 0) {
			eastcom.showMsg("danger", "请勾选绑定的报表!");
			return;
		}
		var demoId = checkedNodes[0].id;
		var demoText = checkedNodes[0].text;
		//处理使用原报表名称---------------------------------------------------------------------
		var oldId = $("#mmTtr").html();
		var alterToOldName = $("#alterToOldName").is(':checked');
		if (alterToOldName == true || alterToOldName == "true") {
			var data = {
				"dbId": "srpt",
				"tableName": configUrl_main.dm_co_ba_srpt_menu_tpl_tableName,
				//"tableName":"dm_co_ba_srpt_menu_tpl", 
				"type": "update",
				"conditions": ["id_"],
				"data": {
					"id_": oldId,
					"name_": demoText
				}
			}
			var dataStr = JSON.stringify(data);
			var ret = commonAjax(configUrl_main.srpt_rcpt_common_update, dataStr, "", "");
			//var ret = commonAjax("/srpt/rcpt/common/update",dataStr,"","");   
			var datas = ret.data;
			//页面修改-----------------------
			var node = $('#tree').tree('find', oldId);
			if (node) {
				$('#tree').tree('update', {
					target: node.target,
					text: demoText
				});
			};


		};
		//---------------------------------------------------------------------







		//更新接口：http://localhost:7080/web-selfReport-special/srpt/rcpt/common/update
		//----------------------------------
		var oldId = $("#mmTtr").html();
		var data = {
			"dbId": "srpt",
			"tableName": configUrl_main.dm_co_ba_srpt_menu_tpl_tableName,
			//"tableName":"DM_CO_BA_SRPT_MENU_tpl",
			"type": "update",
			"conditions": ["old.id_", "url_"],
			"data": {
				"id_": demoId,
				"old.id_": oldId,
				"url_": autoReportParam,
				"is_bind": "1"
			}
		};
		var dataStr = JSON.stringify(data);
		var res = commonAjax(configUrl_main.srpt_rcpt_common_update, dataStr, "", "");
		//var res = commonAjax("/srpt/rcpt/common/update",dataStr,"","");  
		if (res.resultCode == 0 || res.msg == "success") {
			$("#mmTtr").html(demoId);
			eastcom.showMsg("success", "绑定成功!");
			setTimeout('clearMsg()', 3000);
			//界面修改----------------------------------------------------        
			var node = $('#tree').tree('find', oldId);
			if (node) {
				$('#tree').tree('update', {
					target: node.target,
					id: demoId,
					iconCls: 'icon-wenbenfabu1'
				});
			};
		} else {
			eastcom.showMsg("danger", res.message);
			setTimeout('clearMsg()', 3000);

		};
		$("#bindReport").modal("hide");


	},



	//-------------------------------------------------------------------------------
	getCurryReportId: function() {
		var nodeId = $("#onclickId").html();
		return nodeId;
	},
	getCurryReportName: function() {
		var nodeId = $("#onclickName").html();
		return nodeId;
	},
	createFrame: function(url) {
		var k = document.body.offsetHeight;
		var h = k - 65;
		var s = '<iframe id="mainframe" name="mainframe" src=' + url + ' width="100%" height="' + h + '"  frameborder="0" scrolling="auto" ></iframe>';
		return s;
	},
	createQueryResultTab: function(val) {
		var title_id = val.reportCheckInfo.report_id;
		var title_name = "";
		var data = {
			"ifId": "srpt-cfg-menuQueryself",
			"mark": "url",
			"id": title_id,
			"url_": autoReportParam
		};
		var dataStr = JSON.stringify(data);
		var res = commonAjax(configUrl_main.query_menuQueryself, dataStr, "", "");
		//var res = commonAjax("/srpt/rcpt/common/query",dataStr,"","");
		title_name = res.data[0].name_;
		var url = "reportQueryResult.jsp?fromWhere=autoReportId";
		var subtitle = title_name + "查询结果";

		if (!$('#tabs').tabs('exists', subtitle)) {
			$('#tabs').tabs('add', {
				title: subtitle,
				content: autoReport.createFrame(url),
				closable: true,
				iconCls: 'icontabstitle'
			});
			tabClose();
			tabCloseEven();
		} else {
			$("#tabs").tabs('close', subtitle);
			$('#tabs').tabs('add', {
				title: subtitle,
				content: autoReport.createFrame(url),
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
	showQueryReportResultData: function() {
		return repoprtResultData;
	},
	getCurrTimeToId: function() {
		var date = new Date();
		var dateStr = date.format("yyyyMMddhhmmss");
		return dateStr;
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






/*var initData = [{
                                 "id":0,
                                 "text":"报表分类",
                                 "state":"closed",
                                 //"iconCls":"icon-add",
                                 "attributes":{"ishasChilds":true},
                                 "children":[{
                                 	         "id":144,
                                 			 "text":"PhotoShop",
                                 			 "state":"closed",
                                 			 "attributes":{"ishasChilds":true},
                                 			 "children":[{
                                                            "id": 20161021112231,
                                 			               "text":"English",
                                 			               "attributes":{"ishasChilds":false},
                                 			            }]
                                 		},{
                                 			"id": 8,
                                 			"text":"Sub Bookds",
                                 			"state":"closed",
                                 			"attributes":{"ishasChilds":true},
                                 		}]
                       }]; */