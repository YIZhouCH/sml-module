var repoprtResultData = []; //--------
var myReport = {
	init: function() {
		myReport.appendDiv();
		myReport.changeTip();
		myReport.loadTree();
		var userName = $.cookie("inas_portallogin_user_username");
	},
	appendDiv: function() {
		var divS = '<div style="cursor:pointer;display:inline-block;margin-right: 30px;float: right;" onClick="myReport.loadTree()">' +
			'<img height="20px" width="25px" src="../../static/reportManageSys/images/link.jpg" />' +
			'</div>'
		$('.panel-title').append(divS);
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
						"parent_id": data[i].parent_id,
						"type":data[i].type
					};
				};
				if (data[i].type == 0) {
					flag = true;
					object.attributes = {
						"ishasChilds": true,
						"parent_id": data[i].parent_id,
						"type":data[i].type
					};
					array_two = myReport.zhuanhuaunTreeData(data[i].children);
				};
				if (data[i].type == 2) {   //jsp
					object.attributes = {
						"ishasChilds": false,
						"parent_id": data[i].parent_id,
						"type":data[i].type
					};
					array_two = myReport.zhuanhuaunTreeData(data[i].children);
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
	loadTree: function() {
		$("#treeDiv").mask("数据加载中....");
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
		             "enabled":[3]
		             };*/
		var param = {
			"username": userName,
			"enabled": [3],
			"type": "1",
			"report_name": ""
		};
		var paramStr = JSON.stringify(param);
		//var res = commonAjax(configUrl_main.srpt_rcpt_syncQueryReport,paramStr,"",""); 
		//var res = commonAjax("/srpt/rcpt/syncQueryReport",paramStr,"",""); 
		//-------------------------------------------------------------------------------
		$.ajax({
			url: eastcom.baseURL + configUrl_main.srpt_rcpt_syncQueryReport,
			type: 'POST',
			async: true,
			dataType: "json",
			contentType: "application/json",
			data: paramStr,
			success: function(data) {
				var res = data;
				if (!res.success) {
					alert("菜单加载失败!");
					return;
				};
				if (res.data.length == 0) {
					$('#tree').html("暂无报表可查看!")
					return;
				};
				var dataArr = res.data;
				//var dataArr = $.parseJSON(dataStr);  
				var initData = myReport.zhuanhuaunTreeData(dataArr);
				//loadTree 
				$('#tree').tree({
					data: initData,
					lines: true,
					animate: true,
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
	                         			content: myReport.createFrame(url),
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
							var url = "publicReport.jsp?fromWhere=myReport"
							if (!$('#tabs').tabs('exists', subtitle)) {
								$('#tabs').tabs('add', {
									title: subtitle,
									content: myReport.createFrame(url),
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
					},
					onContextMenu: function(e, node) {
						e.preventDefault();
						$('#tree').tree('select', node.target);
						if (!node.attributes.ishasChilds) {
							$('#mm1').menu('show', {
								left: e.pageX,
								top: e.pageY
							});
						};
						$("#mmTtr").html(node.id);
						$("#mmTtr_text").html(node.text);

					}

				}); //tree
			},
			complete: function(XMLHttpRequest, textStatus) {
				//HideLoading();
				$("#treeDiv").unmask();
			},
			error: function() {
				//请求出错处理
				eastcom.showMsg("danger", "请求异常,数据加载失败!");
			}
		});

		//-------------------------------------------------------------------------------



	},
	createFrame: function(url) { //--------
		var k = document.body.offsetHeight;
		//var h = k - 65;
		if (flag2017216143611 == "true") {
		 h = k - 70;
		}else{
		 h = k - 65;
		};
		var s = '<iframe id="mainframe" name="mainframe" src=' + url + ' width="100%" height="' + h + '"  frameborder="0" scrolling="auto" ></iframe>';
		return s;
	},
	getCurryReportId: function() { //--------
		var nodeId = $("#onclickId").html();
		return nodeId;
	},
	getCurryReportName: function() { //--------
		var nodeId = $("#onclickName").html();
		return nodeId;
	},
	createQueryResultTab: function(val) { //--------
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
		var url = "reportQueryResult.jsp?fromWhere=myReport";
		var subtitle = title_name + "查询结果";

		if (!$('#tabs').tabs('exists', subtitle)) {
			$('#tabs').tabs('add', {
				title: subtitle,
				content: myReport.createFrame(url),
				closable: true,
				iconCls: 'icontabstitle'
			});
			tabClose();
			tabCloseEven();
		} else {
			$("#tabs").tabs('close', subtitle);
			$('#tabs').tabs('add', {
				title: subtitle,
				content: myReport.createFrame(url),
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
	showQueryReportResultData: function() { //--------
		return repoprtResultData;
	},
	seekReport: function() {
		var value = $("#myReportName").val(); //获取文本框输入的内容  
		/*var data = {
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
		/*var data =  {"username":userName,
		             "enabled":[3],
		             "type":"0", 
		             "report_name":value
		          };*/
		var data = {};
		var nameType = $("#nameType").val();
		if (nameType == "report") {
			data = {
				"username": userName,
				"enabled": [3],
				"type": "0",
				"report_name": value,
				"kpi_name": ""
			};
		} else {
			data = {
				"username": userName,
				"enabled": [3, ],
				"type": "0",
				"report_name": "",
				"kpi_name": value
			};
		}
		var dataStr = JSON.stringify(data);
		$('body').mask("数据正在加载中,请稍等....");
		//var res = commonAjax(configUrl_main.srpt_rcpt_syncQueryReport,dataStr,"","");
		//var res = commonAjax("/srpt/rcpt/syncQueryReport",dataStr,"","");
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
				//var item = $.parseJSON(items);  
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
					htmlStr += '<td style="border-top:0px;width: 33%;"><a id="inputKuang_' + item[i].id_ + '" onmouseover="myReport.popoverKuang(' + item[i].id_ + ')" onmouseout="myReport.delpopoverKuang(' + item[i].id_ + ')" onClick="myReport.selectReportName(' + item[i].id_ + ')" style="color: blue;text-decoration:underline ;cursor: pointer;font-size: 17px;" >' + item[i].name_ + '</a></td>'
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
		//console.log("myReportjs_1104----"+ id); 
		var value = $("#myReportName").val();
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
					//title : len+'<span style="float:right"><a href="javascript:myReport.delpopoverKuang('+id+')" class="fr fa fa-times cursor" style="color:#0085d0"></a></span>',
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
                                     //title : len+'<span style="float:right"><a href="javascript:myReport.delpopoverKuang('+id+')" class="fr fa fa-times cursor" style="color:#0085d0"></a></span>',
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
		for (var i = 0; i < arr.length - 1; i++) {
			parent_id_arr.push(arr[i].parent_id);
		};

		//按照父类数组展开所有菜单
		for (var m = parent_id_arr.length - 1; m > -1; m--) {
			var parentId = parent_id_arr[m];
			var parent = $('#tree').tree('find', parentId);
			$('#tree').tree('expand', parent.target);
		};
		var reportId = $('#tree').tree('find', report_id);
		if (parent == null) {
			return;
		};
		$("#tree").tree('scrollTo', reportId.target); //滚动到当前节点 
		$("#tree").tree('select', reportId.target); //高亮显示当前节点    
		$('body').unmask();
	},
	clearSeek: function() {
		$("#myReportName").val("");
		$("#table").html("");
	},
	cancalAttention: function() {
		var curr_id = $("#mmTtr").html();
		var data = {
			"dbId": "srpt",
			"tableName": configUrl_main.dm_co_ba_srpt_menu_tableName,
			//"tableName":"dm_co_ba_srpt_menu",
			"type": "update",
			"conditions": ["id_"],
			"data": {
				"id_": curr_id,
				"enabled": 2
			}
		};
		var dataStr = JSON.stringify(data);
		var res = commonAjax(configUrl_main.update_update, dataStr, "", "");
		//var res = commonAjax("/srpt/rcpt/common/update",dataStr,"","");
		if (res.resultCode == 0 || res.msg == "success") {
			var currObj = $('#tree').tree('find', curr_id);
			$('#tree').tree('remove', currObj.target);
		} else {
			alert("取消失败!!!");
		};
	},
	changeTip: function() {
		var nameType = $("#nameType").val();
		if (nameType == "report") {
			$("#myReportName").attr('placeholder', '请输入报表名称');
		} else {
			$("#myReportName").attr('placeholder', '请输入指标名称');
		}
	}　
};