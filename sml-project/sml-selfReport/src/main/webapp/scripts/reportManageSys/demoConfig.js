var device_name = "";
var device_machineRoom = "";
var device_ipAdress = "";
var business_system = "";
var port_cname = "";
var port_ipAdress = "";
var port_type = "";

var demoConfig = {
	init: function() {
		var initData = demoConfig.getData();
		//demoConfig.initTree_Left();
		demoConfig.initDemoNameList(); //初始化模板列表
		demoConfig.doClear();
		demoConfig.clearRightTree(); //初始化提示右边树提示语  //初始化时清空原有的数据

	},
	clearRightTree_larji: function() {
		$("#tree_right_div").html("");
		$("#tree_right_div").html('<ul id="tree_right"></ul>');
	},
	clearRightTree: function() {
		$("#tree_right_div").html("");
		$("#tree_right_div").html('<ul id="tree_right"></ul>');
		$("#tpl_name").val("");
		$("#comment").val("");
		$("#descr").val("");
	},
	alterTitle: function() {
		var port_type = $("#port_type").val();
		if (port_type == "shebei") {
			$("#left_title").html("&nbsp;待选择设备列表");
			$("#right_title").html("&nbsp;已选择设备列表");
		} else {
			$("#left_title").html("&nbsp;待选择端口列表");
			$("#right_title").html("&nbsp;已选择端口列表");
		};
		demoConfig.clearRightTree_larji();
	},
	doQuery: function() {
		device_name = $("#device_name").val();
		device_machineRoom = $("#device_machineRoom").val();
		device_ipAdress = $("#device_ipAdress").val();
		business_system = $("#business_system").val();
		port_cname = $("#port_cname").val();
		port_ipAdress = $("#port_ipAdress").val();
		port_type = $("#port_type").val();
		//左边数加载全部菜单
		initData = demoConfig.getData();
		demoConfig.initTree_Left();
		//demoConfig.clearRightTree(); 

	},
	doClear: function() {
		//页面组件值清空
		$("#device_name").val("");
		$("#device_machineRoom").val("");
		$("#device_ipAdress").val("");
		$("#business_system").val("");
		$("#port_cname").val("");
		$("#port_ipAdress").val("");
		//$("#port_type").find("option[value='']").attr("selected",true);
		//全局变量清空
		device_name = "";
		device_machineRoom = "";
		device_ipAdress = "";
		business_system = "";
		port_cname = "";
		port_ipAdress = "";
		port_type = "";
		//左边数加载全部菜单
		initData = demoConfig.getData();
		demoConfig.initTree_Left();
		demoConfig.clearRightTree();

	},
	transLeftTreeData: function(data, flag) { // flage = 0 文件夹
		var arr = [];
		if (data == null) {
			return;
		};
		var port_type_self = $("#port_type").val();
		if (flag == 0 && port_type_self == "shebei") {
			for (var i = 0; i < data.length; i++) {
				var item = data[i];
				var obj = {};
				obj.id = item.id;
				obj.text = item.name;
				/*obj.state="closed";*/
				obj.iconCls = "icon-shebeitubiao";
				obj.attributes = {
					"ishasChilds": true,
					"device_id": flag
				};
				arr.push(obj);

			};
		} else if (flag == 0 && port_type_self == "duankou") {
			for (var i = 0; i < data.length; i++) {
				var item = data[i];
				var obj = {};
				obj.id = item.id;
				obj.text = item.name;
				obj.state = "closed";
				obj.attributes = {
					"ishasChilds": true,
					"device_id": flag
				};
				arr.push(obj);

			};
		} else {
			//-------------------------------
			for (var i = 0; i < data.length; i++) {
				var item = data[i];
				var obj = {};
				obj.id = item.id;
				obj.text = item.name;
				obj.attributes = {
					"ishasChilds": false,
					"device_id": flag
				};
				arr.push(obj);
			};
		};
		//-------------------------------
		return arr;
	},
	initTree_Left: function() {
		$("#tree_left").html("");
		/*var initData = [{
		           "id":0,
		           "text":"设备分类",
		           "state":"closed",
		           "iconCls":"icon-shebeifenlei",
		           "attributes":{"ishasChilds":true}
		 }] */
		//准备第一层数据----------------------------------------------------
		var data = {
			"device_id": "",
			"device_name": device_name,
			"device_ip": device_ipAdress,
			"device_service_name": business_system,
			"inter_alias": port_cname,
			"in_ip": port_ipAdress
		};

		var dataStr = JSON.stringify(data);
		$('body').mask("数据正在加载中,请稍等....");
		var res = commonAjax(configUrl_main.rcpt_model_getFullMenu, dataStr, "", "");
		//var res = commonAjax("/rcpt/model/getFullMenu",dataStr,"","");
		$('body').unmask();
		var initData = demoConfig.transLeftTreeData(res.data, 0);
		//----------------------------------------------------
		$('#tree_left').tree({
			data: initData,
			lines: false,
			animate: true,
			checkbox: true,
			onBeforeExpand: function(node) {
				//http://localhost:7080/web-selfReport-special/rcpt/model/getFullMenu 

				var port_type_self = $("#port_type").val();
				if (node.attributes.device_id == 0 && port_type_self == "shebei") {

				} else {
					var device_id = "";
					var node_id = node.id;
					if (node_id != 0) {
						device_id = node_id;
					};
					var data = {
						"device_id": device_id,
						"device_name": device_name,
						"device_ip": device_ipAdress,
						"device_service_name": business_system,
						"inter_alias": port_cname,
						"in_ip": port_ipAdress
					};

					var dataStr = JSON.stringify(data);
					$('body').mask("数据正在加载中,请稍等....");
					var res = commonAjax(configUrl_main.rcpt_model_getFullMenu, dataStr, "", "");
					//var res = commonAjax("/rcpt/model/getFullMenu",dataStr,"","");
					$('body').unmask();
					var arr = demoConfig.transLeftTreeData(res.data, node_id);
					var parent = $('#tree_left').tree('find', node.id);
					var childrens = $('#tree_left').tree('getChildren', parent.target);
					for (var i = 0; i < childrens.length; i++) {
						$('#tree_left').tree('remove', childrens[i].target);
					};
					$('#tree_left').tree("append", {
						parent: parent.target,
						data: arr
					});

				};

			},
			onContextMenu: function(e, node) {

			},
			onDblClick: function(node) {

			}
		}); //tree
	},
	addRightMove: function() {
		var port_type_self = $("#port_type").val();
		if (port_type_self == "shebei") {
			var nodesArr = $('#tree_left').tree('getChecked');

			var bigArr = [];
			for (var i = 0; i < nodesArr.length; i++) {
				if (nodesArr[i].id != 0) { //右移时过滤掉根节点        
					//添加端口
					var smallObj = {};
					smallObj.id = nodesArr[i].id;
					smallObj.text = nodesArr[i].text;
					smallObj.attributes = nodesArr[i].attributes;
					/*smallObj.state = 'closed';*/
					smallObj.iconCls = "icon-shebeitubiao";
					bigArr.push(smallObj);
				}
			};

			//-------------------------------------------------
			$('#tree_right').tree({
				//data:[],
				lines: false,
				animate: true,
				checkbox: true
			}); //tree

			var bigArrZ = [];
			var getData = $("#tree_right").tree("getRoots");
			if (getData == null || getData.length == 0) {
				bigArrZ = bigArr;
			} else {
				bigArrZ = demoConfig.removeExistRightTee(bigArr, getData);
			};



			$('#tree_right').tree("append", {
				data: bigArrZ
			});
		} else if (port_type_self == "duankou") {
			$('body').mask("数据正在加载中,请稍等....");
			var nodesArr = $('#tree_left').tree('getChecked');
			var all_device_id_arr = [];
			var bigArr = [];
			var flagIfAll = false;
			for (var i = 0; i < nodesArr.length; i++) {
				//添加端口
				if (!nodesArr[i].attributes.ishasChilds) {
					var smallObj = {};
					smallObj.id = nodesArr[i].id;
					smallObj.text = nodesArr[i].text;
					smallObj.attributes = nodesArr[i].attributes;
					bigArr.push(smallObj);
				};
				//处理直接(尚未打开)全选的设备
				if (nodesArr[i].attributes.ishasChilds) {
					flagIfAll = true;
					all_device_id_arr.push(nodesArr[i].id);
				};
			};
			//增加直接全选的端口
			if (flagIfAll) {
				for (var j = 0; j < all_device_id_arr.length; j++) {
					var all_data = {
						"device_id": all_device_id_arr[j],
						"device_name": device_name,
						"device_ip": device_ipAdress,
						"device_service_name": business_system,
						"inter_alias": port_cname,
						"in_ip": port_ipAdress
					};
					var all_dataStr = JSON.stringify(all_data);
					var res = commonAjax(configUrl_main.rcpt_model_getFullMenu, all_dataStr, "", "");
					//var res = commonAjax("/rcpt/model/getFullMenu",all_dataStr,"","");

					for (var k = 0; k < res.data.length; k++) {
						var _smallObj = {};
						_smallObj.id = res.data[k].id;
						_smallObj.text = res.data[k].name;
						bigArr.push(_smallObj);
					};
				};
			};
			//qu chu shu tu shu zu limian chongfu de shuju   
			var newBigArr = [];
			for (var i = 0; i < bigArr.length; i++) {
				var flag = true;
				for (var j = 0; j < newBigArr.length; j++) {
					var itemI = bigArr[i];
					var itemJ = newBigArr[j];
					if (itemI.id == itemJ.id) {
						flag = false;
					};
				};
				if (flag) {
					newBigArr.push(bigArr[i]);
				};
			};


			$('body').unmask();
			$('#tree_right').tree({
				//data:data,
				lines: false,
				animate: true,
				checkbox: true
			}); //tree
			var bigArrZ = [];
			var getData = $("#tree_right").tree("getRoots");
			if (getData == null || getData.length == 0) {
				bigArrZ = newBigArr;
			} else {
				bigArrZ = demoConfig.removeExistRightTee(newBigArr, getData);
			};
			$('#tree_right').tree("append", {
				data: bigArrZ
			});



		};

	},
	delRightMove: function() {
		var nodesArr = $('#tree_right').tree('getChecked');
		if (nodesArr.length == 0) {
			alert("请选择要删除的设备或端口");
			return;
		};
		for (var i = 0; i < nodesArr.length; i++) {
			if (nodesArr[i].id == 0) {
				$("#tree_right").html("");
				var noShowObj = $('#tree_left').tree('find', nodesArr[i].id);
				$("#tree_left").tree("uncheck", noShowObj.target);
				demoConfig.clearRightTree();
			} else {
				//处理文本
				if (!nodesArr[i].attributes.ishasChilds) {
					//去除右边显示
					var noShowObj = $('#tree_right').tree('find', nodesArr[i].id);
					if (noShowObj != "" && noShowObj != " " && noShowObj != null) {
						$('#tree_right').tree('remove', noShowObj.target);
					};
					//去除左边勾选
					var noCheckedObj = $('#tree_left').tree('find', nodesArr[i].id);
					if (noCheckedObj != null && noCheckedObj != "" && noCheckedObj != " ") {
						$('#tree_left').tree('uncheck', noCheckedObj.target);
					};
				};
				//处理文件夹    
				if (nodesArr[i].attributes.ishasChilds) {
					//去除右边显示
					var noShowObj = $('#tree_right').tree('find', nodesArr[i].id);
					if (noShowObj != "" && noShowObj != " " && noShowObj != null) {
						var childrens = $('#tree_right').tree('getChildren', noShowObj.target);
						for (var j = 0; j < childrens.length; j++) {
							$('#tree_right').tree('remove', childrens[j].target); //删除孩子
						};
						$('#tree_right').tree('remove', noShowObj.target); //删自己
					};
					//去除左边勾选
					var noCheckedObj = $('#tree_left').tree('find', nodesArr[i].id);
					$('#tree_left').tree('uncheck', noCheckedObj.target);
				};
			};
		};
	},
	reShow: function(obj) {
		//样式功能变化
		$("#div_i").find('div[name = "demo_name_div"]').each(function(index, el) {
			$(this).css('backgroundColor', '#E6F1F2');
		});
		$(obj).css('backgroundColor', '#A6FBFF'); //red

		/*var firstTree = $('#tree_left').tree('find', 0);
		$('#tree_left').tree('expandAll', firstTree.target); */

		//逻辑功能----------------------------------------------
		var currDemoId = $(obj).find('span').eq(1).attr('values');
		$("#currDemoId").html(currDemoId);
		//还原模板信息
		var dataABC = {
			"ifId": "srpt-cfg-deviceQueryModelInfoToOne",
			"tpl_id": currDemoId
		};
		var dataStrABC = JSON.stringify(dataABC);
		var resABC = commonAjax(configUrl_main.query_deviceQueryModelInfoToOne, dataStrABC, "", "");
		//var resABC = commonAjax("/srpt/rcpt/common/query",dataStrABC,"","");  
		//{"success":true,"msg":"success","data":[{"tpl_id":"20160629110153","tpl_name":"MODEL01","type":"band","descr":null}]}	
		if (resABC.success) {
			var currObj = resABC.data[0];
			$("#tpl_name").val(currObj.tpl_name);
			//$("#comment").val(currObj.comment); 
			$("#descr").val(currObj.descr);
		} else {
			alert("加载模板信息出错!");
		};
		//还原模板关系

		var dataABCD = {
			"id": currDemoId
		};
		var dataStrABCD = JSON.stringify(dataABCD);
		var resABCD = commonAjax(configUrl_main.rcpt_model_getArrangedTree, dataStrABCD, "", "");
		//var resABCD = commonAjax("/rcpt/model/getArrangedTree",dataStrABCD,"","");  
		if (resABCD.success) {

			//获取数据
			/*var data = demoConfig.changeRightTreeData(resABCD.data);*/

			var data = "";
			if (resABCD.data[0].device_id == "0") {
				data = demoConfig.changeRightTreeData_shebei(resABCD.data);
			} else {
				data = demoConfig.changeRightTreeData(resABCD.data);
			};


			$("#tree_right").html("");

			$('#tree_right').tree({
				//data:data,
				lines: false,
				animate: true,
				checkbox: true,
				onBeforeExpand: function(node) {

				},
				onContextMenu: function(e, node) {

				},
				onDblClick: function(node) {

				}
			}); //tree
			$('#tree_right').tree("append", {
				data: data
			});


		} else {
			alert("加载模板信息出错!");
		};
		//------------------------------------------------------


	},
	delDemo: function(obj, num) {
		if (confirm("确认删除吗?")) {
			$("#div_" + num).css('display', 'none');
			var currDemo_id = $(obj).attr('values');
			//删除模板信息
			var dataB = {
				"dbId": "srpt",
				"tableName": configUrl_main.dm_co_ba_srpt_tpl_tableName,
				//"tableName":"dm_co_ba_srpt_tpl",
				"type": "delete",
				"conditions": ["tpl_id"],
				"data": {
					"tpl_id": currDemo_id
				}
			};
			var dataStrB = JSON.stringify(dataB);
			commonAjax(configUrl_main.update_delete, dataStrB, "", "");
			//commonAjax("/srpt/rcpt/common/update",dataStrB,"","");    
			//删除该模板与端口的维护关系
			var dataB = {
				"dbId": "srpt",
				"tableName": configUrl_main.dm_co_ba_srpt_rel_tpl_tableName,
				//"tableName":"dm_co_ba_srpt_rel_tpl",
				"type": "delete",
				"conditions": ["tpl_id"],
				"data": {
					"tpl_id": currDemo_id
				}
			};
			var dataStrB = JSON.stringify(dataB);
			commonAjax(configUrl_main.update_delete, dataStrB, "", "");
			//commonAjax("/srpt/rcpt/common/update",dataStrB,"",""); 

			//刷选模板显示菜单
			demoConfig.initDemoNameList();
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
	clearAllSelect: function() {
		$("#div_i").find('div[name = "demo_name_div"]').each(function(index, el) {
			$(this).css('backgroundColor', '#E6F1F2');
		});
		demoConfig.clearRightTree();
		$("#currDemoId").html(""); //把存放修改模板id的div清空

	},
	initDemoNameList: function() {
		//获取所有模板的信息,枚举展示
		var data = {
			"ifId": "srpt-cfg-deviceQueryModelInfo"
		};
		var dataStr = JSON.stringify(data);
		var res = commonAjax(configUrl_main.query_deviceQueryModelInfo, dataStr, "", "");
		//var res = commonAjax("/srpt/rcpt/common/query",dataStr,"","");
		//{"success":true,"msg":"success","data":[{"tpl_id":"20160628175512","tpl_name":"测试","type":"band","descr":null}]}
		if (res.success) {
			var arr = res.data;
			//var arr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
			var htmlStr = "";
			for (var i = 0; i < arr.length; i++) {
				htmlStr += '<div id="div_' + i + '" name="demo_name_div" ondblclick="demoConfig.reShow(this)"  onmouseover="demoConfig.addBackground(this)" onmouseout="demoConfig.delBackground(this)" onselectstart="return false;" style="-moz-user-select:none; background:#E6F1F2 ; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;">'
				if (arr[i].type == "shebei") {
					htmlStr += '<span style="display: inline-block; width: 10%"><img src="../../pages/reportManageSys/themes/bootstrap/images/shebei.png" style="margin-top:-10px;margin-left:-3px;" /></span>'
				} else if (arr[i].type == "duankou") {
					htmlStr += '<span style="display: inline-block; width: 10%"><img src="../../pages/reportManageSys/themes/bootstrap/images/duankou.png" style="margin-top:-10px;"/></span>'
				};
				//+          '<span values="'+arr[i].tpl_id+'" style="display: inline-block; width: 78%">'+arr[i].tpl_name+'</span>'
				htmlStr += '<span values="' + arr[i].tpl_id + '" style="display: inline-block; width: 78%">' +
					'<a href="javascript:void(0)" title="' + arr[i].tpl_name + '">' +
					'<div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:160px;">' + arr[i].tpl_name + '</div></a>' +
					'</span>' +
					'<span values="' + arr[i].tpl_id + '" style="display: inline-block;cursor: pointer;" title="删除" onclick="demoConfig.delDemo(this,' + i + ')"><img  src="../../static/reportManageSys/images/closehong.png"></span>' +
					'</div>'
			};

			if (arr.length == 0) {
				htmlStr = "<h5>暂无模板!</h5>"
			};
			$("#div_i").html(htmlStr);
		} else {
			alert("查询异常,请稍后再查!")
		};

	},
	changeRightTreeData: function(data) {

		/*
                                {"success":true,"msg":"true","data":[{"device_id":"8a5d92813488f4f301348cb233c3005a","sys_name":"SHSH-PS-IMS-CE17-CISCO7606"
                                ,"children":[{"id":"2ee131604f07cf5c6a3167f838422a18","name":"TO-[SHSH-GB-ALMFS568]                 
                                                          ","device_id":"8a5d92813488f4f301348cb233c3005a","children":[]}]}]}
	        	*/
		var array = [];
		var flag = false; //判断是否有子文件
		if (data.length > 0) {
			for (var i = 0; i < data.length; i++) {
				var object = {};
				object.id = data[i].id;
				object.text = data[i].name;
				object.attributes = {
					"device_id": data[i].device_id
				};
				var array_two = "";
				if (data[i].children.length > 0) {
					flag = true;
					object.attributes = {
						"ishasChilds": true,
						"parent_id": 0
					};
					array_two = demoConfig.changeRightTreeData_second(data[i].children, data[i].device_id, data[i].sys_name);
				};
				if (flag) {
					object.state = 'closed';
					flag = false;
				}
				object.children = array_two;
				array.push(object);
			};
		};
		return array;
	},
	changeRightTreeData_shebei: function(data) {

		/*
                                {"success":true,"msg":"true","data":[{"device_id":"8a5d92813488f4f301348cb233c3005a","sys_name":"SHSH-PS-IMS-CE17-CISCO7606"
                                ,"children":[{"id":"2ee131604f07cf5c6a3167f838422a18","name":"TO-[SHSH-GB-ALMFS568]                 
                                                          ","device_id":"8a5d92813488f4f301348cb233c3005a","children":[]}]}]}
	        	*/
		var array = [];
		var flag = false; //判断是否有子文件
		if (data.length > 0) {
			for (var i = 0; i < data.length; i++) {
				var object = {};
				object.id = data[i].id;
				object.text = data[i].name;
				object.iconCls = "icon-shebeitubiao";
				object.attributes = {
					"ishasChilds": false,
					"parent_id": 0
				};
				var array_two = "";
				if (data[i].children.length > 0) {
					flag = true;
					object.attributes = {
						"ishasChilds": true,
						"parent_id": 0
					};
					array_two = demoConfig.changeRightTreeData_second(data[i].children, data[i].device_id, data[i].sys_name);
				};
				if (flag) {
					object.state = 'closed';
					flag = false;
				}
				object.children = array_two;
				array.push(object);
			};
		};
		return array;
	},
	changeRightTreeData_second: function(data, parent_id, parent_name) {
		var array = [];
		var flag = false; //判断是否有子文件
		if (data.length > 0) {
			for (var i = 0; i < data.length; i++) {
				var object = {};
				object.id = data[i].id;
				object.text = data[i].name;
				var array_two = "";
				if (data[i].children.length == 0) {
					flag = true;
					object.attributes = {
						"ishasChilds": false,
						"parent_id": parent_id,
						"parent_name": parent_name
					};
				};
				array.push(object);
			};
		};
		return array;
	},
	save: function() {
		if ($("#tree_right").html() == "") {
			alert("请选择设备端口!");
			return;
		};
		var tpl_id = $("#currDemoId").html();
		if (tpl_id == "" || tpl_id == " ") {
			//说明是新建的模板
			tpl_id = demoConfig.getCurrTimeToId();
		} else {
			//说明是在已有的模板是修改
			//1.先删除模板信息
			var dataAB = {
				"dbId": "srpt",
				"tableName": configUrl_main.dm_co_ba_srpt_tpl_tableName,
				//"tableName":"dm_co_ba_srpt_tpl",
				"type": "delete",
				"conditions": ["tpl_id"],
				"data": {
					"tpl_id": tpl_id
				}
			};
			var dataStrAB = JSON.stringify(dataAB);
			commonAjax(configUrl_main.update_delete, dataStrAB, "", "");
			//commonAjax("/srpt/rcpt/common/update",dataStrAB,"","");
			//2.再删除该模板的关系
			var dataBC = {
				"dbId": "srpt",
				"tableName": configUrl_main.dm_co_ba_srpt_rel_tpl_tableName,
				"type": "delete",
				"conditions": ["tpl_id"],
				"data": {
					"tpl_id": tpl_id
				}
			};
			var dataStrBC = JSON.stringify(dataBC);
			commonAjax(configUrl_main.update_delete, dataStrBC, "", "");
			//commonAjax("/srpt/rcpt/common/update",dataStrBC,"",""); 

		};
		var tpl_name = $("#tpl_name").val().trim();
		if (tpl_name == "" || tpl_name == " " || tpl_name == null) {
			alert("模板名称不能为空!");
			return;
		};
		var flag = demoConfig.checkOutDemoName(tpl_name);
		if (flag) {
			alert("模板名称已经存在!");
			return;
		};
		var descr = $("#descr").val();

		var all_data = {
			"tpl_id": tpl_id,
			"tpl_name": tpl_name,
			"type": $("#port_type").val(),
			"descr": descr
		};
		var all_dataStr = JSON.stringify(all_data);
		var res = commonAjax(configUrl_main.rcpt_model_updateDeviceModel, all_dataStr, "", "");
		//var res = commonAjax("/rcpt/model/updateDeviceModel",all_dataStr,"","");

		if (res.success) {
			//维护模板与端口的关系
			//获取右边树的所有节点
			var port_type_self = $("#port_type").val();
			var getData = $("#tree_right").tree("getRoots");

			var _bigArr = [];

			if (port_type_self == "shebei") {
				var device_obj_arr = getData;
				for (var i = 0; i < device_obj_arr.length; i++) {
					var sObj = {};
					sObj.tpl_id = tpl_id;
					sObj.p_id = "0";
					sObj.p_name = "设备分类";
					sObj.name = device_obj_arr[i].text;
					sObj.id = device_obj_arr[i].id;
					_bigArr.push(sObj);

				};
			} else if (port_type_self == "duankou") {
				var port_obj_arr = getData;
				for (var j = 0; j < port_obj_arr.length; j++) {
					var sObj = {};
					sObj.tpl_id = tpl_id;
					sObj.p_id = port_obj_arr[j].attributes.device_id;
					sObj.p_name = "设备名称";
					sObj.name = port_obj_arr[j].text;
					sObj.id = port_obj_arr[j].id;
					_bigArr.push(sObj);
				};
			};

			var dataA = _bigArr;

			var dataStrA = JSON.stringify(dataA);
			var resA = commonAjax(configUrl_main.rcpt_model_updateDvcMdlRel, dataStrA, "", "");
			//var resA = commonAjax("/rcpt/model/updateDvcMdlRel",dataStrA,"",""); 
			if (resA.success) {
				alert("保存成功!");
			} else {
				//失败,删除模板信息
				var dataB = {
					"dbId": "srpt",
					"tableName": configUrl_main.dm_co_ba_srpt_tpl_tableName,
					//"tableName":"dm_co_ba_srpt_tpl",
					"type": "delete",
					"conditions": ["tpl_id"],
					"data": {
						"tpl_id": tpl_id
					}
				};
				var dataStrB = JSON.stringify(dataB);
				commonAjax(configUrl_main.update_delete, dataStrB, "", "");
				//commonAjax("/srpt/rcpt/common/update",dataStrB,"","");   	         
				alert("保存失败!");

			};
		} else {
			alert("保存失败!");
		};

		demoConfig.initDemoNameList(); //刷选模板显示菜单
		$("#currDemoId").html(""); //把存放修改模板id的div清空
	},
	checkOutDemoName: function(value) {
		var flag = false;
		var data = {
			"ifId": "srpt-cfg-deviceQueryModelInfo"
		};
		var dataStr = JSON.stringify(data);
		var res = commonAjax(configUrl_main.query_deviceQueryModelInfo, dataStr, "", "");
		//var res = commonAjax("/srpt/rcpt/common/query",dataStr,"","");
		var res_arr = res.data;
		for (var i = 0; i < res_arr.length; i++) {
			if (res_arr[i].tpl_name == value) {
				flag = true;
			};
		};
		return flag;

	},
	getCurrTimeToId: function() {
		var date = new Date();
		var dateStr = date.format("yyyyMMddhhmmss");
		return dateStr;
	},
	removeExistRightTee: function(leftTree, rightTree) {
		var newArr = [];
		for (var i = 0; i < leftTree.length; i++) {
			var itemI = leftTree[i];
			var flag = true;
			for (var j = 0; j < rightTree.length; j++) {
				var itemJ = rightTree[j];
				if (itemI.id == itemJ.id) {
					flag = false;
				};
			};
			if (flag) {
				newArr.push(itemI);
			};
		};
		return newArr;

	},
	getData: function() {
		var data = [{
			"id": 1,
			"text": "Node 1",
			"state": "closed",
			"children": [{
				"id": 2,
				"children": [],
				"text": "Node 2",
				"attributes": {
					"parent_id": 1
				},
				"children": [{
					"id": 3,
					"children": [],
					"attributes": {
						"parent_id": 2
					},
					"text": "Node 3"
				}, {
					"id": 4,
					"text": "Node 4",
					"attributes": {
						"parent_id": 2
					},
					"children": [{
						"id": 5,
						"children": [],
						"attributes": {
							"parent_id": 4
						},
						"text": "Node 5"
					}, {
						"id": 6,
						"children": [],
						"attributes": {
							"parent_id": 4
						},
						"text": "Node 6"
					}]
				}]
			}, {
				"id": 7,
				"text": "Node 7",
				"attributes": {
					"parent_id": 1
				},
				"children": [{
					"id": 8,
					"children": [],
					"attributes": {
						"parent_id": 7
					},
					"text": "Node 8"
				}, {
					"id": 9,
					"children": [],
					"attributes": {
						"parent_id": 7
					},
					"text": "Node 9"
				}]
			}]
		}, {
			"id": 10,
			"text": "Node 10",
			//"state": "closed",
			"children": []
		}];
		return data;


	}
};