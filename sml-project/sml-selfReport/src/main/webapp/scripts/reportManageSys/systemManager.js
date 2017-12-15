var k = "";
var userRoleIdArr = [];
var UserSeekData = "";
var ReportSeekData = "";
var systemManager = {
	init: function(val) {
		k = val;
		systemManager.getTabList();
		$("body").mask("数据加载中,请稍后....");
		systemManager.initRepoprtTree("treeGrid_report_0", 0);
		systemManager.initUserTree("treeGrid_user_0", 0);
		$("body").unmask();

	},
	getTabList: function() {
		var html = "";
		var result = ['单用户多报表', '单报表多用户', '多用户多报表', '多报表多用户']; // 0 1 2 3
		$("#curr_menu").html("0");
		if (result != "" && result.length > 0) {
			for (var i = 0; i < result.length; i++) {
				html += '<li class="' + (i == 0 ? "hover" : "") + '" id="tabmenue_' + i + '"' +
					' onclick="systemManager.getDiv(' + i + ')">' +
					'<a>' + result[i] + '</a></li>';
			};
			$("#allIndexTab").html(html);
		};
	},
	getDiv: function(i) {
		$("#curr_menu").html(i);
		$('#allIndexTab').find('li').removeClass('hover');
		$("#tabmenue_" + i).addClass('hover');
		$('#allIndexDiv').find("div[id*='div_']").each(function(index, el) {
			$(this).css("display", "none");
		});
		$("#div_" + i).css("display", "block");
		$("div[id*='div_']").html("");
		var divHeight = k * 0.97;
		var tableHeight = k * 0.97 * 0.99;
		// if(i == 0){
		/*$("#div_"+i).html('<div id="user_'+i+'_div" style="position: relative; width: 60%; height: '+divHeight+'px; float: left;">'+
		                     '<table id="treeGrid_user_'+i+'" style="height: '+tableHeight+'px;"></table>'+
		              '</div>'+
		              '<div id="report_'+i+'_div" style="position: relative; width: 40%;height: '+divHeight+'px; float: left;">'+
		                     '<table id="treeGrid_report_'+i+'" style="height: '+tableHeight+'px;" ></table>'+ 
		              '</div>');*/

		// }else{
		$("#div_" + i).html('<div id="report_' + i + '_div" style="position: relative; width: 40%;height: ' + divHeight + 'px; float: left;">' +
			'<table id="treeGrid_report_' + i + '" style="height: ' + tableHeight + 'px;" ></table>' +
			'</div>' +
			'<div id="user_' + i + '_div" style="position: relative; width: 60%; height: ' + divHeight + 'px; float: left;">' +
			'<table id="treeGrid_user_' + i + '" style="height: ' + tableHeight + 'px;"></table>' +
			'</div>');
		// }; 

		$("body").mask("数据加载中,请稍后....");
		systemManager.initRepoprtTree("treeGrid_report_" + i, 0);
		systemManager.initUserTree("treeGrid_user_" + i, 0);
		$("body").unmask();

	},
	zhuanhuauUserTreeData: function(data) {
		var array = [];

		if (data == null || data == "null") {
			return array;
		};
		var flag = false; //脜脨露脧脢脟路帽脫脨脳脫脦脛录镁
		if (data.length > 0) {
			/*"id":1,
			"role":"陆脟脡芦1111",
			"phone":"",
			"age":"",
			"iconCls":"icon-role",
			"children":[{
			              "id":2,
			              "role":"",
			              "name":"脫脙禄搂1",
			              "phone":"120216521",
			              "iconCls":"icon-user",
			              "age":"03/20/2010"
			            },{*/
			for (var i = 0; i < data.length; i++) {
				var object = {};

				if (data[i].children.length > 0) {
					flag = true;
					object.id = data[i].role_id;
					object.role = data[i].name_cn;
					object.iconCls = "icon-role";
					var array_two = systemManager.zhuanhuauUserTreeData_two(data[i].children);
					//陆脟脡芦id,脮鹿驴陋脫脙
					userRoleIdArr.push(data[i].role_id);
				} else {
					flag = true;
					object.id = data[i].role_id;
					object.role = data[i].name_cn;
					object.iconCls = "icon-role";
					var array_two = [];
					//陆脟脡芦id,脮鹿驴陋脫脙
					userRoleIdArr.push(data[i].role_id);
				};
				if (flag) {
					object.state = 'closed';
				}
				object.children = array_two;
				array.push(object);
			}
		};
		return array;
	},
	zhuanhuauUserTreeData_two: function(data) {
		var array = [];

		if (data == null || data == "null") {
			return array;
		};
		var flag = false; //脜脨露脧脢脟路帽脫脨脳脫脦脛录镁
		if (data.length > 0) {
			/*"id":1,
			"role":"陆脟脡芦1111",
			"phone":"",
			"age":"",
			"iconCls":"icon-role",
			"children":[{
			              "id":2,
			              "role":"",
			              "name":"脫脙禄搂1",
			              "phone":"120216521",
			              "iconCls":"icon-user",
			              "age":"03/20/2010"
			            },{*/
			for (var i = 0; i < data.length; i++) {
				var object = {};

				if (data[i].children.length > 0) {
					flag = true;
					object.id = data[i].role_id;
					object.role = data[i].name_cn;
					object.iconCls = "icon-role";
					var array_two = systemManager.zhuanhuauUserTreeData(data[i].children);
					//陆脟脡芦id,脮鹿驴陋脫脙
					userRoleIdArr.push(data[i].role_id);
				} else {
					//object.id = data[i].user_id;
					object.id = data[i].username + "_" + data[i].role_id;
					object.role = "";
					object.name = data[i].fullname;
					object.phone = data[i].mobile_no;
					object.email = data[i].email;
					object.username = data[i].username;
					object.role_id = data[i].role_id;
					object.dept = data[i].dept_name;
					object.iconCls = "icon-user";
				};
				if (flag) {
					object.state = 'closed';
				}
				object.children = array_two;
				array.push(object);
			}
		};
		return array;
	},
	zhuanhuauReportTreeData: function(data) {
		var array = [];
		if (data == null || data == "null") {
			return array;
		};
		var flag = false; //脜脨露脧脢脟路帽脫脨脳脫脦脛录镁
		if (data.length > 0) {
			for (var i = 0; i < data.length; i++) {
				var object = {};
				object.id = data[i].id_;
				object.parent_id = data[i].parent_id;
				object.name = data[i].name_;
				object.type = data[i].type;

				if (data[i].type == 0) {
					flag = true;
					var array_two = systemManager.zhuanhuauReportTreeData(data[i].children);
					object.children = array_two;
				};

				array.push(object);
			}
		};
		return array;

	},
	getUserTreeData: function() {
		var param = {};
		var paramStr = JSON.stringify(param);
		var res = commonAjax(configUrl_main.srpt_rcpt_syncQueryRoleUser, paramStr, "", "");
		//var res = commonAjax("/srpt/rcpt/syncQueryRoleUser",paramStr,"","");  
		var dataStr = res.data;
		//if(dataArr == "null" || dataArr == null){$("body").unmask();return;};
		//var dataArr = $.parseJSON(dataStr);  
		var data = systemManager.zhuanhuauUserTreeData(dataStr);
		return data;
	},
	getReportTreeData: function() {
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
		/*var param = {"username":userName,
		             "enabled":[1,2,3]
		             };*/

		var param = {
			"username": "",
			"enabled": [1, 2, 3],
			"type": "1",
			"report_name": ""
		};
		var paramStr = JSON.stringify(param);
		var res = commonAjax(configUrl_main.srpt_rcpt_syncQueryReport, paramStr, "", "");
		//var res = commonAjax("/srpt/rcpt/syncQueryReport",paramStr,"","");  
		var dataArr = res.data;
		//if(dataArr == "null" || dataArr == null){$("body").unmask();return;};
		//var dataArr = $.parseJSON(dataStr);  
		var data = systemManager.zhuanhuauReportTreeData(dataArr);
		/*object.id = data[i].id_;
		         object.parent_id = data[i].parent_id;
		         object.name = data[i].name_;
		         object.type = data[i].type;*/
		var dataTree = [{
			"id": "0",
			"parent_id": "-1",
			"name": "报表分类",
			"type": 0,
			"children": data
		}];
		return dataTree;
	},
	initUserTree: function(treeId, flag) {
		var data = "";
		if (flag == 0) {
			data = systemManager.getUserTreeData();
		};
		if (flag == 1) {
			data = systemManager.zhuanhuauUserTreeData(UserSeekData);

		};
		var curr_role = "";
		if (treeId.indexOf("0") > -1) {
			$('#' + treeId).treegrid({
				data: data,
				idField: 'id',
				treeField: 'role',
				animate: true,
				fitColumns: true,
				singleSelect: false,
				onDblClickRow: function(rowIndex, rowData) {
					$('#' + treeId).treegrid('unselectAll');
				},
				columns: [
					[

						{
							field: 'role',
							formatter: function(value, rowData, rowIndex) {
								if (rowData.role != "") {
									curr_role = rowData.id;
								};
								if (rowData.role != "") {
									return "<span id=" + curr_role + ">" + rowData.role + "</span>"
								} else {
									return "<input id=" + rowData.username + " name=" + curr_role + " type='checkbox' onclick='systemManager.userSet(this)'  style='margin-left: 0;'/>" + rowData.username;
								};
							},
							title: '角色/用户名',
							width: 240
						},
						{
							field: 'name',
							title: '姓名',
							width: 80,
							align: 'center'
						},
						{
							field: 'dept',
							title: '部门',
							width: 120,
							align: 'center'
						},
						{
							field: 'phone',
							title: '电话',
							width: 100,
							align: 'center'
						},
						{
							field: 'email',
							title: '邮箱',
							width: 120,
							align: 'center'
						},
					]
				]
			});
		} else {
			$('#' + treeId).treegrid({
				data: data,
				idField: 'id',
				treeField: 'role',
				animate: true,
				fitColumns: true,
				singleSelect: false,
				onDblClickRow: function(rowIndex, rowData) {
					$('#' + treeId).treegrid('unselectAll');
				},
				columns: [
					[{
							field: 'role',
							formatter: function(value, rowData, rowIndex) {
								if (rowData.role != "") {
									curr_role = rowData.id;
								};
								if (rowData.role != "") {
									return "<input id=" + curr_role + " name=" + curr_role + " type='checkbox'  onclick='systemManager.selctAllFuncUser(this)' style='margin-left: 0;'/>" + rowData.role;
								} else {
									return "<input id=" + rowData.username + " name=" + curr_role + " type='checkbox' onclick='systemManager.selctAllFuncUser(this)' style='margin-left: 0;'/>" + rowData.username;
								};
							},
							title: '角色/用户名',
							width: 240
						},
						{
							field: 'name',
							title: '姓名',
							width: 80,
							align: 'center'
						},
						{
							field: 'dept',
							title: '部门',
							width: 120,
							align: 'center'
						},
						{
							field: 'phone',
							title: '电话',
							width: 100,
							align: 'center'
						},
						{
							field: 'email',
							title: '邮箱',
							width: 120,
							align: 'center'
						},
					]
				]
			});
		};
	},

	initRepoprtTree: function(treeId, flag) {

		var data = "";
		if (flag == 0) {
			data = systemManager.getReportTreeData();
		};
		if (flag == 1) {
			dataTree = systemManager.zhuanhuauReportTreeData(ReportSeekData);

			var data = [{
				"id": "0",
				"parent_id": "-1",
				"name": "报表分类",
				"type": 0,
				"children": dataTree
			}];

		};
		var curr_role = "";
		if (treeId.indexOf("1") > -1) {
			$('#' + treeId).treegrid({
				data: data,
				idField: 'id',
				treeField: 'name',
				animate: true,
				fitColumns: true,
				singleSelect: false,
				onDblClickRow: function(rowIndex, rowData) {
					$('#' + treeId).treegrid('unselectAll');
				},
				columns: [
					[{
						field: 'name',
						formatter: function(value, rowData, rowIndex) {
							if (rowData.type == 0) {
								curr_role = rowData.id;
							};
							if (rowData.type == 0) {
								return rowData.name;
							} else {
								return "<input id=" + rowData.id + " name=" + curr_role + " type='checkbox' onclick='systemManager.reportSet(this)' style='margin-left: 0;'/>" + rowData.name;
							};
						},
						title: '',
						width: 300
					}, ]
				]
			});
		} else {
			$('#' + treeId).treegrid({
				data: data,
				idField: 'id',
				treeField: 'name',
				animate: true,
				fitColumns: true,
				singleSelect: false,
				onDblClickRow: function(rowIndex, rowData) {
					$('#' + treeId).treegrid('unselectAll');
				},
				columns: [
					[{
						field: 'name',
						formatter: function(value, rowData, rowIndex) {

							return "<input id=" + rowData.id + " name=" + rowData.parent_id + " type='checkbox'  onclick='systemManager.selctAllFuncReport(this)' style='margin-left: 0;'/>" + rowData.name;

						},
						title: '',
						width: 300
					}, ]
				]
			});
		};
	},
	userSet: function(val) {
		systemManager.onlySelct(val);
		systemManager.selectCurrUserOfReport(val);
	},
	selectCurrUserOfReport: function(obj) {
		var username = obj.id;
		/*var data =  {"username":username,
		             "enabled":[2,3],
		             "name":""
		          };*/
		var data = {
			"username": username,
			"enabled": [2, 3],
			"type": "0",
			"report_name": ""
		};
		var dataStr = JSON.stringify(data);
		$('body').mask("请稍等.....");
		var res = commonAjax(configUrl_main.srpt_rcpt_syncQueryReport, dataStr, "", "");
		//var res = commonAjax("/srpt/rcpt/syncQueryReport",dataStr,"","");
		$("body").unmask();
		if (res.success) {
			var dataArr = res.data;
			var reportArr = [];
			for (var i = 0; i < dataArr.length; i++) {
				var reportid = dataArr[i].id_;
				$('#' + reportid).prop("checked", true);
				var currObj = {
					"id": $('#' + reportid).attr("id"),
					"name": $('#' + reportid).attr("name")
				};
				systemManager.selctAllFuncUp_R(currObj);
			};

		};
	},
	reportSet: function(val) {
		systemManager.onlySelct(val);
		systemManager.selectCurrReportOfUser(val);
	},
	selectCurrReportOfUser: function(obj) {
		var reportid = obj.id;
		var data = {
			"ifId": "srpt-cfg-queryUsernameByReportid",
			"report_id": reportid
		};
		var dataStr = JSON.stringify(data);
		var res = commonAjax(configUrl_main.qiery_queryUsernameByReportid, dataStr, "", "");
		//var res = commonAjax("/srpt/rcpt/common/query",dataStr,"","");
		if (res.success) {
			var dataArr = res.data;
			var reportArr = [];
			for (var i = 0; i < dataArr.length; i++) {
				var username = dataArr[i].USERNAME;
				$('#' + username).prop("checked", true);

				var currObj = {
					"name": $('#' + username).attr("name"),
				};
				systemManager.selctAllFuncUp_U(currObj);
			};

		};
	},
	selctAllFuncReport: function(val) {
		var curr_menu = $("#curr_menu").html();
		if (curr_menu == 0) {

			var userCheckedArrs = [];
			$("#user_" + curr_menu + "_div input[type='checkbox']").each(function(index, el) {
				if ($(this).prop("checked")) {
					userCheckedArrs.push(el.id);
				};
			});

			if (userCheckedArrs.length == 0) {
				alert("请先选择用户!");
				var allInput = $("input[type = 'checkbox']");
				for (var i = 0; i < allInput.length; i++) {
					allInput[i].checked = false;
				};
				return;
			};
		};

		systemManager.selctAllFuncDown_R(val);
		systemManager.selctAllFuncUp_R(val);
	},
	onlySelct: function(obj) {
		var allInput = $("input[type = 'checkbox']");
		var thisInput = "";
		$("input[name = '" + obj.name + "']").each(function() {
			if (this.id == obj.id) {
				thisInput = $(this);
			};
		})
		for (var i = 0; i < allInput.length; i++) {
			allInput[i].checked = false;
		};
		thisInput.prop("checked", true);
	},

	selctAllFuncDown_R: function(owner) {
		var id = owner.id;
		var check = $('#' + id).is(':checked');
		$("input[name=" + id + "]").each(function() {
			$(this).prop("checked", check);
			systemManager.selctAllFuncDown_R(this);
		});
	},
	selctAllFuncUp_R: function(owner) {
		var id = owner.id;
		var name = owner.name;
		var flag = false;
		$("input[name=" + name + "]").each(function() {
			if ($(this).is(':checked')) {
				flag = true;
			};
		});
		$("input[id=" + name + "]").each(function() {
			$(this).prop("checked", flag);
			systemManager.selctAllFuncUp_R(this);
		});

	},
	selctAllFuncUser: function(val) {
		var curr_menu = $("#curr_menu").html();
		if (curr_menu == 1) {
			var reportCheckedArrs = [];
			$("#report_" + curr_menu + "_div input[type='checkbox']").each(function(index, el) {
				if ($(this).prop("checked")) {
					reportCheckedArrs.push(el.id);
				};
			});
			if (reportCheckedArrs.length == 0) {
				alert("请先选择报表!");
				var allInput = $("input[type = 'checkbox']");
				for (var i = 0; i < allInput.length; i++) {
					allInput[i].checked = false;
				};
				return;

			};
		};
		systemManager.selctAllFuncDown_U(val);
		systemManager.selctAllFuncUp_U(val);
	},
	selctAllFuncDown_U: function(owner) {
		var id = owner.id;
		var check = $('#' + id).is(':checked');
		$("input[name=" + id + "]").each(function() {
			$(this).prop("checked", check);
		});
	},
	selctAllFuncUp_U: function(owner) {
		var id = owner.id;
		var name = owner.name;
		var flag = false;
		$("input[name=" + name + "]").each(function(index, el) {
			if (index != 0) {
				if ($(this).is(':checked')) {
					flag = true;
				};
			};
		});
		$("input[id=" + name + "]").each(function() {
			$(this).prop("checked", flag);
		});
	},
	save: function() {
		var curr_menu = $("#curr_menu").html();
		var type = curr_menu;
		var userCheckedArr = [];
		var userCheckedArrs = [];
		var reportCheckedArr = [];
		var reportCheckedArrs = [];
		$("#user_" + curr_menu + "_div input[type='checkbox']").each(function(index, el) {
			if ($(this).prop("checked")) {
				userCheckedArrs.push(el.id);
			};
		});
		$("#report_" + curr_menu + "_div input[type='checkbox']").each(function(index, el) {
			if ($(this).prop("checked")) {
				reportCheckedArrs.push(el.id);
			};
		});
		//脠楼鲁媒陆脟脡芦
		var dataR = {
			"type": "role"
		};
		var dataStrR = JSON.stringify(dataR);
		var resR = commonAjax(configUrl_main.srpt_rcpt_findAllRoleOrMenu, dataStrR, "", "");
		//var resR = commonAjax("/srpt/rcpt/findAllRoleOrMenu",dataStrR,"",""); 
		var roleArr = resR.data;
		for (var i = 0; i < userCheckedArrs.length; i++) {
			var flag = true;
			for (var j = 0; j < roleArr.length; j++) {
				if (userCheckedArrs[i] == roleArr[j]) {
					flag = false;
					break;
				};
			};
			if (flag) {
				userCheckedArr.push(userCheckedArrs[i]);
			};
		};


		//脠楼鲁媒卤篓卤铆脛驴脗录
		var dataM = {
			"type": "menu"
		};
		var dataStrM = JSON.stringify(dataM);
		var resM = commonAjax(configUrl_main.srpt_rcpt_findAllRoleOrMenu, dataStrM, "", "");
		//var resM = commonAjax("/srpt/rcpt/findAllRoleOrMenu",dataStrM,"",""); 
		var muluArr = resM.data;
		muluArr.push(0);
		for (var i = 0; i < reportCheckedArrs.length; i++) {
			var flag = true;
			for (var j = 0; j < muluArr.length; j++) {
				if (reportCheckedArrs[i] == muluArr[j]) {
					flag = false;
					break;
				};
			};
			if (flag) {
				reportCheckedArr.push(reportCheckedArrs[i]);
			};
		};



		//alert("user-----"+userCheckedArr+"--------report-------"+reportCheckedArr);
		if (reportCheckedArr.length == 0) {
			alert("请选择报表!");
			return;
		};
		if (userCheckedArr.length == 0) {
			alert("请选择用户!");
			return;
		};
		/*var dataA = {"username":userCheckedArr,
		            "report_id":reportCheckedArr
		            };
		var dataStrA = JSON.stringify(dataA);*/





		if (curr_menu == 0) {
			var dataA = {
				"username": userCheckedArr,
				"report_id": reportCheckedArr,
				"type": "1"
			};
			var dataStrA = JSON.stringify(dataA);
			var res = commonAjax(configUrl_main.srpt_rcpt_publishOnePerstoMoreRept, dataStrA, "", "");
			//var res = commonAjax("/srpt/rcpt/publishOnePerstoMoreRept",dataStrA,"",""); 
			if (res.success) {
				alert("保存成功!");
			};
		};
		if (curr_menu == 1) {
			var dataA = {
				"username": userCheckedArr,
				"report_id": reportCheckedArr,
				"type": "2"
			};
			var dataStrA = JSON.stringify(dataA);
			var res = commonAjax(configUrl_main.srpt_rcpt_publishMorePerstoOneRept, dataStrA, "", "");
			//var res = commonAjax("/srpt/rcpt/publishMorePerstoOneRept",dataStrA,"",""); 
			if (res.success) {
				alert("保存成功!");
			};
		};
		if (curr_menu == 2) {
			var dataA = {
				"username": userCheckedArr,
				"report_id": reportCheckedArr,
				"type": "3"
			};
			var dataStrA = JSON.stringify(dataA);
			var res = commonAjax(configUrl_main.srpt_rcpt_publishMorePerstoMoreReptOne, dataStrA, "", "");
			//var res = commonAjax("/srpt/rcpt/publishMorePerstoMoreReptOne",dataStrA,"",""); 
			if (res.success) {
				alert("保存成功!");
			};
		};
		if (curr_menu == 3) {
			var dataA = {
				"username": userCheckedArr,
				"report_id": reportCheckedArr,
				"type": "4"
			};
			var dataStrA = JSON.stringify(dataA);
			var res = commonAjax(configUrl_main.srpt_rcpt_publishMorePerstoMoreReptTwo, dataStrA, "", "");
			//var res = commonAjax("/srpt/rcpt/publishMorePerstoMoreReptTwo",dataStrA,"",""); 
			if (res.success) {
				alert("保存成功!");
			};
		};
	},
	reportSeek: function() {
		var curr_menu = $("#curr_menu").html();
		//var reportSeekNames = $("#reportSeekName").val(); 
		//var reportSeekName = reportSeekNames.trim();
		//if (reportSeekName == "") {alert("请输入关键字!");return;};
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


		/*var param = {"username":userName,
		             "enabled":[1,2,3],
		             "name":reportSeekName
		             };
		var paramStr = JSON.stringify(param);
		$("#report_"+curr_menu+"_div").mask("查找中....");
		var res = commonAjax("/srpt/rcpt/syncQueryReport",paramStr,"","");
		$("#report_"+curr_menu+"_div").unmask();*/

		var reportSeekName = $("#reportSeekName").val();
		var param = {
			"username": "",
			//"username":userName,
			"enabled": [1, 2, 3],
			"type": "1",
			"report_name": reportSeekName
		};
		var paramStr = JSON.stringify(param);
		$("#report_" + curr_menu + "_div").mask("查找中....");
		var res = commonAjax(configUrl_main.srpt_rcpt_syncQueryReport, paramStr, "", "");
		//var res = commonAjax("/srpt/rcpt/syncQueryReport",paramStr,"","");
		$("#report_" + curr_menu + "_div").unmask();



		ReportSeekData = res.data;
		systemManager.initRepoprtTree("treeGrid_report_" + curr_menu, 1);
		/*$('#treeGrid_report_'+curr_menu).treegrid('unselectAll');
		for (var i = 0; i < dataArr.length; i++) {
		    $('#treeGrid_report_'+curr_menu).treegrid('select', dataArr[i].id_);
		};*/


	},
	userSeek: function() {
		userRoleIdArr = [];
		var curr_menu = $("#curr_menu").html();
		var selectType = $("#selectType").val();
		//var userSeekNames = $("#userSeekName").val();
		//var userSeekName = userSeekNames.trim();
		//if(userSeekName == ""){alert("脟毛脢盲脠毛鹿脴录眉脳脰!");return;};
		/* var data = {};

		 if (selectType == "username") {
		        data = {"ifId":"srpt-cfg-queryUsernameLike",
		                "username":userSeekName
		               };

		 };
		 if (selectType == "name") {
		         data = {"ifId":"srpt-cfg-queryUsernameLike",
		                 "name":userSeekName
		         };
		 };    
		 if (selectType == "dept") {
		       data = {"ifId":"srpt-cfg-queryUsernameLike",
		               "dept":userSeekName
		       };
		 };  
		if (selectType == "phone") {
		       data = {"ifId":"srpt-cfg-queryUsernameLike",
		               "phone":userSeekName
		       };
		 };  

		   var dataStr = JSON.stringify(data);
		   $("#user_"+curr_menu+"_div").mask("查找中....");
		   var res = commonAjax("/srpt/rcpt/common/query",dataStr,"","");
		   $("#user_"+curr_menu+"_div").unmask();*/

		var userSeekName = $("#userSeekName").val();
		var data = {
			"type": selectType,
			"searchValue": userSeekName
		};
		var dataStr = JSON.stringify(data);
		$("#user_" + curr_menu + "_div").mask("查找中....");
		var res = commonAjax(configUrl_main.srpt_rcpt_syncQueryRoleUser, dataStr, "", "");
		//var res = commonAjax("/srpt/rcpt/syncQueryRoleUser",dataStr,"","");
		$("#user_" + curr_menu + "_div").unmask();

		UserSeekData = res.data;
		systemManager.initUserTree("treeGrid_user_" + curr_menu, 1);
		/*$('#treeGrid_user_'+curr_menu).treegrid('unselectAll');
		for (var i = 0; i < dataArr.length; i++) {
		    $('#treeGrid_user_'+curr_menu).treegrid('expandTo', dataArr[i].username);
		    $('#treeGrid_user_'+curr_menu).treegrid('select', dataArr[i].username);
		};*/

	},
	reportAllClose: function() {
		var curr_menu = $("#curr_menu").html();
		$('#treeGrid_report_' + curr_menu).treegrid('collapseAll', 0);
	},
	reportAllOpen: function() {
		var curr_menu = $("#curr_menu").html();
		$('#treeGrid_report_' + curr_menu).treegrid('expandAll', 0);
	},
	userAllClose: function() {
		var curr_menu = $("#curr_menu").html();
		for (var i = 0; i < userRoleIdArr.length; i++) {
			$('#treeGrid_user_' + curr_menu).treegrid('collapseAll', userRoleIdArr[i]);
		};
	},
	userAllOpen: function() {
		var curr_menu = $("#curr_menu").html();
		for (var i = 0; i < userRoleIdArr.length; i++) {
			$('#treeGrid_user_' + curr_menu).treegrid('expandAll', userRoleIdArr[i]);
		};
	}
};