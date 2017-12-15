var fieldArithmeticEdit = {
	init: function() {
		fieldArithmeticEdit.initTree();
		fieldArithmeticEdit.loadField(); //将来要删掉
	},
	getTreeData: function() {
		var dataT = {
			"username": "",
			"enabled": [1, 2, 3, 4],
			"type": "1"
		};

		var dataStrT = JSON.stringify(dataT);
		var resT = commonAjax(configUrl_main.srpt_rcpt_syncQueryReport, dataStrT, "", "");
		//var resT = commonAjax("/srpt/rcpt/syncQueryReport",dataStrT,"","");
		return resT.data;
	},
	initTree: function() {
		var initData = fieldArithmeticEdit.zhuanhuaunTreeData(fieldArithmeticEdit.getTreeData());

		$('#tree').tree({
			data: initData,
			lines: true,
			animate: true,
			onDblClick: function(node) {
				var type = node.attributes.ishasChilds;
				if (!type) {
					alert(node.id + "----" + node.text);
				};
				$("#onclickId").html(node.id);
				$("#onclickName").html(node.text);
				tabClose();
				tabCloseEven();
			}
		}); //tree 
	},
	zhuanhuaunTreeData: function(data) {
		var array = [];
		var flag = false; //判断是否有子文件
		if (data.length > 0) {
			for (var i = 0; i < data.length; i++) {
				var object = {};
				object.id = data[i].id_;
				object.text = data[i].name_;
				var array_two = "";
				if (data[i].type == 1) {
					object.iconCls = "icon-wenbenfabu";
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
					array_two = fieldArithmeticEdit.zhuanhuaunTreeData(data[i].children);
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
	loadField: function() {
		var arr = ['字段1', '字段2', '字段3', '字段4', '字段5'];
		var htmlStr = "";
		for (var i = 0; i < arr.length; i++) {
			htmlStr += '<div name="demo_name_div" onclick="fieldArithmeticEdit.seekFieldArith(this,\'' + arr[i] + '\')"  onmouseover="fieldArithmeticEdit.addBackground(this)" onmouseout="fieldArithmeticEdit.delBackground(this)" onselectstart="return false;" style="-moz-user-select:none; background:#E6F1F2 ; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;padding: 4px;margin-bottom: 5px;">' +
				'<span style="display: inline-block; width: 89%">' + arr[i] + '</span>' +
				'</div>'
		};
		$("#field_div").html(htmlStr);
	},
	seekFieldArith: function(obj, param) {
		$("#field_div").find('div[name = "demo_name_div"]').each(function(index, el) {
			$(this).css('backgroundColor', '#E6F1F2');
		});
		$(obj).css('backgroundColor', '#A6FBFF');
		alert(param);
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
};









/*var data = {
                                         "ifId":"srpt-cfg-reportInfo",
                                         "report_id":nodeId
                                       }; //添加目录参数
                             var dataStr = JSON.stringify(data);
                             var res1 = commonAjax("/srpt/rcpt/common/query",dataStr,"","");
                              if(res1.data.qry_bd_info == null){
                                      mainE.huanyuanNewCreateReport(nodeId,reportName);
                                return;
                              };         
                              var qry_bd_info_Json = eval('(' + res1.data.qry_bd_info + ')');*/