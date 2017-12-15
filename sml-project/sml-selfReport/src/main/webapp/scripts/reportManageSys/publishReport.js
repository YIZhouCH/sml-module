var Id_name = "";
var userRoleIdArr = [];
var publishReport = {
	init: function() {
		Id_name = parent.mainE.getPublishIdName(); //[id,name]
		publishReport.initUserTreeGrid("");
	},
	zhuanhuauUserTreeDatas: function(data) {
		var array = [];
		var flag = false; //判断是否有子文件
		if (data.length > 0) {
			/*"id":1,
			"role":"角色1111",
			"phone":"",
			"age":"",
			"iconCls":"icon-role",
			"children":[{
			              "id":2,
			              "role":"",
			              "name":"用户1",
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
					var array_two = publishReport.zhuanhuauUserTreeData(data[i].children);
					//角色id,展开用
					userRoleIdArr.push(data[i].role_id);
				} else {
					object.id = data[i].username;
					object.role = "";
					object.name = data[i].fullname;
					object.phone = data[i].mobile_no;
					object.email = data[i].email;
					object.username = data[i].username;
					object.role_id = data[i].role_id;
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
					var array_two = publishReport.zhuanhuauUserTreeData_two(data[i].children);
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
					var array_two = publishReport.zhuanhuauUserTreeData(data[i].children);
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
	initUserTreeGrid: function(datasss) {
		var dataStr = "";
		if (datasss == "" && typeof(datasss) != "string") {
			dataStr = datasss;
		} else {

			if (datasss == "") {
				var curr_role = "";
				var param = {};
				var paramStr = JSON.stringify(param);
				var res = commonAjax(configUrl_main.srpt_rcpt_syncQueryRoleUser, paramStr, "", "");
				//var res = commonAjax("/srpt/rcpt/syncQueryRoleUser",paramStr,"","");  
				dataStr = res.data;
			} else {
				dataStr = datasss;
			}
		};
		//var dataArr = $.parseJSON(dataStr);  
		var data = publishReport.zhuanhuauUserTreeData(dataStr);




		$('#treeGrid').treegrid({
			data: data,
			idField: 'id',
			treeField: 'role',
			animate: true,
			fitColumns: true,
			columns: [
				[{
						field: 'role',
						formatter: function(value, rowData, rowIndex) {
							if (rowData.role != "") {
								curr_role = rowData.id;
							};
							if (rowData.role != "") {
								return "<input id=" + curr_role + " name=" + curr_role + " type='checkbox'  onclick='publishReport.selctAllFuncUser(this)' style='margin-left: 0;'/>" + rowData.role;
							} else {
								return "<input id=" + rowData.username + " name=" + curr_role + " type='checkbox' onclick='publishReport.selctAllFuncUser(this)' style='margin-left: 0;'/>" + rowData.username;
							};
						},
						title: '角色',
						width: 240
					},
					{
						field: 'name',
						title: '姓名',
						width: 120,
						align: 'center'
					},
					{
						field: 'phone',
						title: '电话',
						width: 120,
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

		publishReport.selectCurrReportOfUser();

	},
	selectCurrReportOfUser: function() {
		var reportid = Id_name[0];
		var data = {
			"ifId": "srpt-cfg-queryUsernameByReportid",
			"report_id": reportid
		};
		var dataStr = JSON.stringify(data);
		var res = commonAjax(configUrl_main.query_queryUsernameByReportid, dataStr, "", "");
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
				publishReport.selctAllFuncUp_U(currObj);
			};

		};
	},
	/*selctAllFunc : function(owner){
	              var id = owner.id;
	              var check =  $('#'+id).is(':checked');
	              $("input[name="+id+"]").each(function(){
	                      $(this).prop("checked",check);
	              });
	},*/
	selctAllFuncUser: function(val) {
		publishReport.selctAllFuncDown_U(val);
		publishReport.selctAllFuncUp_U(val);
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
	publishReports: function() {
		//,"data":[{"id_":"20160329121425","name_":"终端维度报表","type_":1,"enabled":2}]}

		var ifPublish = $("#ifPublish").is(':checked');
		var noticTitle = $("#noticTitle").val();
		var noticContent = $("#noticContent").val();
		var userCheckedArr = [];
		var userCheckedArrs = [];
		var userArr = $("#treeTable input[type='checkbox']").each(function(index, el) {
			if ($(this).prop("checked")) {
				userCheckedArrs.push(el.id);
			};
		});
		//alert(userCheckedArr);

		//去除角色
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
		//1.修改报表状态, 
		var data = {
			"dbId": "srpt",
			"tableName": configUrl_main.dm_co_ba_srpt_menu_tableName,
			//"tableName":"dm_co_ba_srpt_menu",
			"type": "update",
			"conditions": ["id_"],
			"data": {
				"id_": Id_name[0],
				"enabled": 3
			}
		};
		var dataStr = JSON.stringify(data);
		var res = commonAjax(configUrl_main.update_update, dataStr, "", "");
		//var res = commonAjax("/srpt/rcpt/common/update",dataStr,"","");			
		//2.传值后台更改关系
		var dataA = {
			"username": userCheckedArr,
			"report_id": [Id_name[0]],
			"type": "5"
		};

		var dataStrA = JSON.stringify(dataA);
		var res = commonAjax(configUrl_main.srpt_rcpt_publishMorePerstoMoreReptFive, dataStrA, "", "");
		//var res = commonAjax(configUrl_main.srpt_rcpt_publishOnePerstoMoreRept,dataStrA,"",""); 
		//var res = commonAjax("/srpt/rcpt/publishOnePerstoMoreRept",dataStrA,"",""); 
		if (res.success) {
			alert("保存成功!");
		};
	},
	userAllClose: function() {
		for (var i = 0; i < userRoleIdArr.length; i++) {
			$('#treeGrid').treegrid('collapseAll', userRoleIdArr[i]);
		};
	},
	userAllOpen: function() {
		for (var i = 0; i < userRoleIdArr.length; i++) {
			$('#treeGrid').treegrid('expandAll', userRoleIdArr[i]);
		};
	},
	userSeek: function() {
		var selectType = $("#selectType").val();
		var userSeekName = $("#userSeekName").val();
		var data = {
			"type": selectType,
			"searchValue": userSeekName
		};
		var dataStr = JSON.stringify(data);
		$("#treeTable").mask("查找中....");
		var res = commonAjax(configUrl_main.srpt_rcpt_syncQueryRoleUser, dataStr, "", "");
		//var res = commonAjax("/srpt/rcpt/syncQueryRoleUser",dataStr,"","");
		$("#treeTable").unmask();

		UserSeekData = res.data;
		publishReport.initUserTreeGrid(UserSeekData);
	}



};