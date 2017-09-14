$(function(){
	interfaceManager.init();
});
"use strict";
var nodeData = {},
	timeId = "",
	interfaceManager = {
		init : function(){
			var url = "/sml/query/if-cfg-interMngMenu",
				data = {
					"query_type":"menu"
				},
				dataStr = JSON.stringify(data),
				result = commonAjax(url, dataStr);
			if(result.success){
				var dataArr = interfaceManager.recur(null, result.data);
				interfaceManager.initTree(dataArr);
				interfaceManager.initTab();
			}else{
				alert(result.data);
			}
		},
		//把数据打包成tree所需要的格式
//		initData : function(data){
//			var dataArr = [],
//				id_root = data["0"].ID,
//				name = data["0"].NAME,
//				root = {
//					"id" : id_root,
//					"text" : name,
//					"state" : "closed",
//					"attributes" : {
//						"type" : "999"
//					},
//					"children" : []
//				};
//			root = interfaceManager.recur(root, data);
//			dataArr.push(root);
//			return dataArr;
//		},
//		recur : function(root, data){	//递归 打包数据为tree所需要格式
//			for(var key in data){
//				var value = data[key],
//					parent_id = value.PARENT_ID;
//				if(parent_id == root.id){
//					var id = value.ID,
//						name = value.NAME,
//						type_num = value.TYPE,
//						type = type_num.toString(),
//						creator = value.CREATOR,
//						descr = value.DESCR;
//					if(type == "0"){
//						var dir = {
//							"id" : id,
//							"text" : name,
//							"state" : "closed",
//							"attributes" : {
//								"type" : type,
//								"parent_id" : parent_id,
//								"descr" : descr,
//								"creator" : creator
//							},
//							"children" : []	
//						};
//						root.children.push(dir);
//						interfaceManager.recur(dir, data);
//					}else if(type == "1"){
//						var file = {
//							"id" : id,
//							"text" : name,
//							"attributes" : {
//								"type" : type,
//								"parent_id" : parent_id,
//								"descr" : descr,
//								"creator" : creator
//							}
//						};
//						root.children.push(file);
//					}
//				}
//			}
//			return root;
//		},
		recur : function(parentId, data){	//递归 打包数据为tree所需要格式
			parentId = parentId || "00";
			var dataArr = [];
			for(var key in data){
				var value = data[key] || {},
					parent_id = value.PARENT_ID,
					type_num = value.TYPE,
					type = type_num.toString();
				if(parent_id == parentId){
					if("0" == type){	//根据parentId判断根目录
						var id = value.ID,
							name = value.NAME,
							creator = value.CREATOR,
							descr = value.DESCR,
							children = interfaceManager.recur(id, data);
						var root = {
							"id" : id,
							"text" : name,
							"state" : "closed",
							"attributes" : {
								"type" : type,
								"parent_id" : parent_id,
								"descr" : descr,
								"creator" : creator
							},
							"children" : children
						};
						dataArr.push(root);
					}else if(type == "1"){	//根据type判断接口
						var id = value.ID,
							name = value.NAME,
							creator = value.CREATOR,
							descr = value.DESCR;
						var file = {
							"id" : id,
							"text" : name,
							"attributes" : {
								"type" : type,
								"parent_id" : parent_id,
								"descr" : descr,
								"creator" : creator
							}
						};
						dataArr.push(file);
					}
				}
			}
			return dataArr;
		},
		//初始化tree结构
		initTree : function(dataArr){
			$("#tree").tree({
				data : dataArr,
				lines : true,
				animate : true,	//动画效果
//				dnd : true,	//拖放
				onContextMenu : function(e, node){
					e.preventDefault();
					$("#tree").tree("select", node.target);
					if(node.id == 0){	//节点为根目录, 显示mm1, 以此类推
						$("#mm1").menu("show", {
							left : e.pageX,
							top : e.pageY
						});
						$("#mm2").data("node", node);
					}else if(node.attributes.type == "0"){	//节点为文件夹
						$("#mm2").menu("show", {
							left : e.pageX,
							top : e.pageY
						});
						$("#mm2").data("node", node);
					}else if(node.attributes.type == "1"){	//节点为文件
						$("#mm3").menu("show", {
							left : e.pageX,
							top : e.pageY
						});
						$("#mm3").data("node", node);
					}
				},
				onDblClick : function(node){
					if(node.attributes.type == "1"){	//节点为文件
						$("#mm3").data("node", node);
						interfaceManager.editInter();
					}
				}
				/*,//拖拽前
				onBeforeDrag : function(node){	//如果拖拽的是根目录,禁止拖放
					if(node.id != "0"){
						return true;
					}
					return false;
				},
				//放入前
				onBeforeDrop : function(target, source, point){
					var node_parent = $("#tree").tree("getNode", target);
					if(node_parent.attributes.type == "0"){	//目标是文件夹才可以
						if(point == "append"){	//为放入操作才可以
							var msg = "确认把\""+ source.text +"\"\n移动到文件夹\""+ node_parent.text +"\"下";
							if(confirm(msg)){
								var url = "/sml/update/if-cfg-interMngMenu",
									update_time = new Date().format("yyyy-MM-dd hh:mm:ss")
											.replace(/-/g, "")
											.replace(/:/g,"")
											.replace(/ /g,""),
									data = {
										"update_type" : "update",
										"id": source.id,
										"name": source.text,
										"type": source.attributes.type,
										"parent_id": node_parent.id,
										"descr": source.attributes.descr,
										"creator": source.attributes.creator,
										"update_time": update_time
									},
									dataStr = JSON.stringify(data);
									result = commonAjax(url, dataStr);
								return result.success;
							}
						}
					}
					return false;
				}*/
			});
			//默认展开第一级
			var node = $("#tree").tree("find", "0");
			$("#tree").tree("expand", node.target);
		},
//		---------------------文        件        夹        区        域----------------------------------------------
		addDir : function(){
			//初始化modal
			$("#modal").modal("show");
//			$("#modal_h4").text("新建目录");
//			$("#modal_input_name").val("");
//			$("#modal_input_creator").val("");
			document.getElementById("modal_h4").innerText = "新建目录";
			document.getElementById("modal_input_name").value = "";
			document.getElementById("modal_input_creator").value = "";
			document.getElementById("modal_submit").innerText = "添 加";
			$("#modal_submit").unbind("click").bind("click", interfaceManager.subAddDir);
		},
		subAddDir : function(){
			var node = $("#mm2").data("node"),
//				name = $("#modal_input_name").val(),
//				creator = $("#modal_input_creator").val();
				name = document.getElementById("modal_input_name").value,
				creator = document.getElementById("modal_input_creator").value;
			if(!name || !creator){		//判断不为空
				alert("输入不能为空!");
				return;
			}
			var children = node.children;
//			var children = $("#tree").tree("getChildren", node.target);
			if(children){	//children不为空才可以判断长度, 否则报错
				for(var i=0, len=children.length; i<len; i++){	//判断是否有同名
					if(name == children[i].text){
						alert("已存在相同名称的目录!");
						return;
					}
				}
			}
//				>>>>>>>>>>>>>发送请求>>>>>>>>>>>>>>>>>>>>>>>>>
			var url = "/sml/update/if-cfg-interMngMenu",
				type = "0",
				parent_id = node.id,
				descr = "目录",
				update_time = new Date().format("yyyy-MM-dd hh:mm:ss")
							.replace(/-/g, "")
							.replace(/:/g,"")
							.replace(/ /g,""),
				data = {
					"update_type":"insert",
					"id" : update_time,
					"name" : name,
					"type" : type,
					"parent_id" : parent_id,
					"descr" : descr,
					"creator" : creator,
					"update_time" : update_time
				},
				dataStr = JSON.stringify(data),
				result = commonAjax(url, dataStr);
			if(result.success){
				$("#tree").tree("append", {	//tree中添加新元素
					"parent" : node.target,
					"data" : [{
						"id" : update_time,
						"text" : name,
						"state" : "closed",
						"attributes" : {
							"type" : type,
							"parent_id" : parent_id,
							"descr" : descr,
							"creator" : creator
						},
						"children" : []
					}]
				});
				$("#tree").tree("expand", node.target);
				alert("添加目录成功!");
				$("#modal").modal("hide");
			}else{
				alert(result.data);
			}
		},
		updateDir : function(){
			var node = $("#mm2").data("node");
			$("#modal").modal("show");
//			$("#modal_h4").text("修改目录名");
//			$("#modal_input_name").val(node.text);
//			$("#modal_input_creator").val(node.attributes.creator);
			document.getElementById("modal_h4").innerText = "修改目录名";
			document.getElementById("modal_input_name").value = node.text;
			document.getElementById("modal_input_creator").value = node.attributes.creator;
			document.getElementById("modal_submit").innerText = "修 改";
			$("#modal_submit").unbind("click").bind("click", interfaceManager.subUpDir);
		},
		subUpDir : function(){
			var node = $("#mm2").data("node"),
//				name = $("#modal_input_name").val(),
//				creator = $("#modal_input_creator").val(),
				name = document.getElementById("modal_input_name").value,
				creator = document.getElementById("modal_input_creator").value,
				id = node.id,
				type = node.attributes.type,
				parent_id = node.attributes.parent_id,
				descr = node.attributes.descr;
			if(name == node.text){
				alert("与原名称相同!");
				return;
			}
			if(!name || !creator){
				alert("输入不能为空!");
				return;
			}
//				>>>>>>>>>>>>>>>>>请求>>>>>>>>>>>>>>>>>>>>>>>>>>
			var url = "/sml/update/if-cfg-interMngMenu",
				update_time = new Date().format("yyyy-MM-dd hh:mm:ss")
							.replace(/-/g, "")
							.replace(/:/g,"")
							.replace(/ /g,""),
				data = {
					"update_type":"update",
					"id" : id,
					"name" : name,
					"type" : type,
					"parent_id" : parent_id,
					"descr" : descr,
					"creator" : creator,
					"update_time" : update_time
				},
				dataStr = JSON.stringify(data),
				result = commonAjax(url, dataStr);
			if(result.success){
				$("#tree").tree("update", {	//更新tree
					"target" : node.target,
					"text" : name,
					"attributes" : {
						"type" : type,
						"parent_id" : parent_id,
						"creator" : creator
					}
				});
				alert("修改目录成功");
				$("#modal").modal("hide");
			}else{
				alert(result.data);
			}
		},
//		----------------------接        口        区        域-----------------------------------------
		addInter : function(){
			var node = $("#mm2").data("node"),
				title = node.text,
				tab_title = title + "-新建接口";		//拼接好tabs选项卡名
			if(!$("#tabs").tabs("exists", tab_title)){	//不存在就添加, 存在即选中
				nodeData = {	//全局变量, 因为是添加, 所以先重置
						"type" : "1",
						"parent_id" : node.id
				};
				var url = "editInterface.jsp",
					content = "<iframe id='mainframe' name='mainframe' src="+url+" style='width:100%;' frameborder='0' scrolling='auto'></iframe>",
					option = {
						title : tab_title,
						content : content,
						closable : true,
						iconCls : 'icontabstitle'
					};
				$("#tabs").tabs("add", option);
				var $tab_visible = $("#tabs .panel:visible");
				$tab_visible.find("#mainframe").height("100%");	//修复iframe高度bug, 暂用这个办法吧
			}else{
				$("#tabs").tabs("select", tab_title);
			}
		},
		delDir : function(){
			var node = $("#mm2").data("node"),
				msg = "将会删除\"" + node.text + "\"下所有接口, 是否确认?";
			if(confirm(msg)){
				interfaceManager.subDelDir(node);
			}
		},
		subDelDir : function(node){
//			var children = $("#tree").tree("getChildren", node.target);
			var children = node.children;
			for(var i=0, len=children.length; i<len; i++){
				var child = children[i],
					type = child.attributes.type;
				if(type == "0"){
					interfaceManager.subDelDir(child);
				}else if(type == "1"){
//					----------------删除测试样例
					var child_id = child.id,
						text = child.text,
						url_del_eg = "/sml/update/if-cfg-interMngEgUpdate",
						data_del_eg = {
							"update_type": "deleteId",
							"id": child_id
						},
						data_str_del_eg = JSON.stringify(data_del_eg),
						result_del_eg = commonAjax(url_del_eg, data_str_del_eg);
					if(result_del_eg.success){
						//---------------查询接口详细信息
						var url_query_inter = "/sml/query/if-cfg-interMngFieldQuery",
							data_query_inter = {
								"id" : child_id
							},
							data_query_inter_str = JSON.stringify(data_query_inter),
							result_query_inter = commonAjax(url_query_inter, data_query_inter_str);
						if(result_query_inter.success){
							//------------再添加日志
							var result_data = result_query_inter.data[0],
								id = result_data.ID,
								mainsql = result_data.MAINSQL,
								rebuild_info = result_data.REBUILD_INFO,
								condition_info = result_data.CONDITION_INFO,
								cache_enabled = result_data.CACHE_ENABLED.toString(),
								cache_minutes = result_data.CACHE_MINUTES.toString(),
								db_id = result_data.DB_ID,
								describe = result_data.DESCRIBE,
								update_time = result_data.UPDATE_TIME.toString(),
								url_log = "/sml/update/if-cfg-interMngLogUpdate",
								data_log = {
									"update_type":"insert",
									"id": id,
									"mainsql": mainsql,
									"rebuild_info": rebuild_info,
									"condition_info": condition_info,
									"cache_enabled": cache_enabled,
									"cache_minutes": cache_minutes,
									"db_id": db_id,
									"describe": describe,
									"update_time": update_time
								},
								data_log_str = JSON.stringify(data_log),
								result_log = commonAjax(url_log, data_log_str);
							if(result_log.success){
								//--------------------真正删除
								var url_del_inter = "/sml/update/if-cfg-interMngIfUpdate",
									data_del_inter = {
										"update_type":"delete",
										"id": child_id       
									},
									data_del_inter_str = JSON.stringify(data_del_inter),
									result_del_inter = commonAjax(url_del_inter, data_del_inter_str);
								if(result_del_inter.success){
									//--------------最后删除菜单表中接口
									var url_menu_inter = "/sml/update/if-cfg-interMngMenu",
										data_menu_inter = {
											"update_type" : "deleteIf",
											"id": child_id
										},
										data_menu_str = JSON.stringify(data_menu_inter),
										result_menu_inter = commonAjax(url_menu_inter, data_menu_str);
									if(result_menu_inter.success){
										$("#tabs").tabs("close", text);	//关闭选项卡
										$("#tabs").tabs("close", text + "-测试样例");
									}else{
										alert(result_menu_inter.data);
									}
								}else{
									alert(result_del_inter.data);
								}
							}else{
								alert(result_log.data);
							}
						}else{
							alert(result_query_inter.data);
						}
					}else{
						alert(result_del_eg.data);
					}
				}
			}
			//删除所有接口后,再删菜单表的文件夹
			var id = node.id,
				text = node.text,
				url = "/sml/update/if-cfg-interMngMenu",
				data = {
					"update_type" : "deleteMenu",
					"id" : id
				},
				dataStr = JSON.stringify(data),
				result = commonAjax(url, dataStr);
			if(result.success){
				$("#tree").tree("remove", node.target);
				$("#tabs").tabs("close", text + "-新建接口");
			}else{
				alert(result.data);
			}
		},
		editInter : function(){
			clearTimeout(timeId);
			var node = $("#mm3").data("node"),
				id = node.id,
				tab_title = node.text;
			nodeData = {
				"id" : id,
				"name" : tab_title,
				"type" : node.attributes.type,
				"parent_id" : node.attributes.parent_id,
				"descr" : node.attributes.descr,
				"creator" : node.attributes.creator
			};
			if(!$("#tabs").tabs("exists", tab_title)){	//不存在就添加, 存在即选中
				var url = "editInterface.jsp",
					content = "<iframe id='mainframe' name='mainframe' src="+url+" style='width:100%;' frameborder='0' scrolling='auto'></iframe>",
					option = {
						title : tab_title,
						content : content,
						closable : true,
						iconCls : 'icontabstitle'
					};
				$("#tabs").tabs("add", option);
				var $tab_visible = $("#tabs .panel:visible");
				$tab_visible.find("#mainframe").height("100%");
			}else{
				$("#tabs").tabs("select", tab_title);
			}
		},
		//删除接口
		delInter : function(){
			var node = $("#mm3").data("node"),
				msg = "确定删除接口\"" + node.text + "\"吗?";
			if(confirm(msg)){
				interfaceManager.subDelInter(node);
			}
		},
		subDelInter : function(node){
			var	inter_id = node.id,
				text = node.text;
			//---------------删除测试样例
			var url_del_eg = "/sml/update/if-cfg-interMngEgUpdate",
				data_del_eg = {
					"update_type": "deleteId",
					"id": inter_id
				},
				data_str_del_eg = JSON.stringify(data_del_eg),
				result_del_eg = commonAjax(url_del_eg, data_str_del_eg);
			if(result_del_eg.success){
				//-----------查询接口详细信息
				var url_query_inter = "/sml/query/if-cfg-interMngFieldQuery",
					data_query_inter = {
						"id" : inter_id
					},
					data_query_inter_str = JSON.stringify(data_query_inter),
					result_query_inter = commonAjax(url_query_inter, data_query_inter_str);
				if(result_query_inter.success){
					//------------再添加日志
					var result_data = result_query_inter.data[0],
						id = result_data.ID,
						mainsql = result_data.MAINSQL,
						rebuild_info = result_data.REBUILD_INFO,
						condition_info = result_data.CONDITION_INFO,
						cache_enabled = result_data.CACHE_ENABLED.toString(),
						cache_minutes = result_data.CACHE_MINUTES.toString(),
						db_id = result_data.DB_ID,
						describe = result_data.DESCRIBE,
						update_time = result_data.UPDATE_TIME.toString(),
						url_log = "/sml/update/if-cfg-interMngLogUpdate",
						data_log = {
							"update_type":"insert",
							"id": id,
							"mainsql": mainsql,
							"rebuild_info": rebuild_info,
							"condition_info": condition_info,
							"cache_enabled": cache_enabled,
							"cache_minutes": cache_minutes,
							"db_id": db_id,
							"describe": describe,
							"update_time": update_time
						},
						data_log_str = JSON.stringify(data_log),
						result_log = commonAjax(url_log, data_log_str);
					if(result_log.success){
						//------------------真正删除
						var url_del_inter = "/sml/update/if-cfg-interMngIfUpdate",
							data_del_inter = {
								"update_type":"delete",
								"id": inter_id       
							},
							data_del_inter_str = JSON.stringify(data_del_inter),
							result_del_inter = commonAjax(url_del_inter, data_del_inter_str);
						if(result_del_inter.success){
							//-----------删除菜单表
							var url_menu_inter = "/sml/update/if-cfg-interMngMenu",
								data_menu_inter = {
									"update_type" : "deleteIf",
									"id": inter_id
								},
								data_menu_str = JSON.stringify(data_menu_inter),
								result_menu_inter = commonAjax(url_menu_inter, data_menu_str);
							if(result_menu_inter.success){
								$("#tree").tree("remove", node.target);
								$("#tabs").tabs("close", text);
								$("#tabs").tabs("close", text + "-测试样例");
								alert("删除成功!");
							}else{
								alert(result_menu_inter.data);
							}
						}else{
							alert(result_del_inter.data);
						}
					}else{
						alert(result_log.data);
					}
				}else{
					alert(result_query_inter.data);
				}
			}else{
				alert(result_del_eg.data);
			}
		},
//		--------------------选        项        卡        区           域-----------------------------------------------
		initTab : function(){
			$("#tabs").tabs({
				border:false,
				onSelect : function(title, index){
					
			    },
			    onContextMenu : function(e, title, index){
			    	e.preventDefault();
			    	$('#mm').menu('show', {
						left: e.pageX,
						top: e.pageY
					});
					$('#mm').data("tab_title", title);
					$("#mm").data("tab_index", index);
					$('#tabs').tabs('select', index);
			    },
			    onBeforeClose : function(title, index){
			    	if(index == "0"){
			    		return false;
			    	}
			    }
			});
		},
		//tab右键菜单事件
		tabEvent : {
			close : function(){
				var tab_index = $("#mm").data("tab_index");
				$("#tabs").tabs("close", tab_index);
			},
			closeLeft : function(){
				var tab_index = $("#mm").data("tab_index"),
					$tabs = $("#tabs");
				for(var i=tab_index-1; i>0; i--){
					$tabs.tabs("close", i);
				}
				$("#tabs").tabs("select", 1);
			},
			closeRight : function(){
				var tab_index = $("#mm").data("tab_index"),
					i = tab_index + 1,
					$tabs = $("#tabs");
				while($tabs.tabs("exists", i)){
					$tabs.tabs("close", i);	//不知道怎么获取有几个tab,所以用while逐个判断是否存在
				}
			},
			closeOther : function(){
				this.closeRight();
				this.closeLeft();	//一定要 先关闭右边, 否则会出问题
				$("#tabs").tabs("select", 1);
			},
			closeAll : function(){
//				this.closeOther();	//会出现关不掉本身的情况, 弃用
				this.closeRight();
				this.close();	//同样原理, 一定要从右开始关闭, 执行顺序不可变
				this.closeLeft();	//或者直接仿照closeRight方法,把i改为1即可
			},
			exit : function(){
				$('#mm').menu('hide');
			}
		},
//		------------------------模         糊         查         询-------------------------------------------
		search : function(){
//			var	text = $("#seekInterfaceName").val(),
			var text = document.getElementById("seekInterfaceName").value,
				url = "/sml/query/if-cfg-interMngLike",
				data = {
//					"id" : text,
					"describe" : text
				},
				dataStr = JSON.stringify(data),
				result = commonAjax(url, dataStr),
				resultData = result.data.datas,
//				$table = $("#resultSeekInterfaceName table"),
				dom_table = document.getElementById("resultSeekInterfaceName")
									.getElementsByTagName("table")[0],
				htmlArr = [];
			if(!result.success){
				htmlArr.push('<br/><h4 style="margin-left:113px">查询异常!</h4>');
			}else if(resultData.length == 0){
				htmlArr.push('<br/><h4 style="margin-left:113px">没有查询到相应接口!</h4>');
			}else{
				var col = 4;
				for(var i=0, len=resultData.length; i<len; i++){
					var num = i % col;
					if(num == 0){
						htmlArr.push("<tr>");
					}
					htmlArr.push('<td style="border-top:0px;width: 25%;">');
					htmlArr.push('<a onclick="interfaceManager.selectTree(\'' + resultData[i].ID + '\');" '+
							'ondblclick="interfaceManager.editInter();" ' + 
							'style="color: blue;text-decoration:underline ;cursor: pointer;font-size: 17px;" >'+resultData[i].DESCRIBE+'</a>');
					htmlArr.push("</td>");
					if(num == col-1 || i == len-1){
						htmlArr.push("</tr>");
					}
				}
			}
//			$table.html(htmlArr.join("\n"));
			dom_table.innerHTML = htmlArr.join("\n");
		},
		clearSearch : function(){
//			$("#seekInterfaceName").val('');
//			$("#resultSeekInterfaceName table").html("");
			document.getElementById("seekInterfaceName").value = "";
			document.getElementById("resultSeekInterfaceName")
					.getElementsByTagName("table")[0].innerHTML = "";
		},
//		------------------------------------------------------------------------
		selectTree : function(id){
			timeId = setTimeout(function() {
			    // your code
				var node = $("#tree").tree("find", id),
					root = $("#tree").tree("find", "0");
				$("#tree").tree("collapseAll", root.target);
				$("#tree").tree("expandTo", node.target);
				$("#tree").tree("select", node.target);
				$("#mm3").data("node", node);
			}, 100);
		},
//		-------------------设         置         nodeData       区              域----------------------------------------
		getNodeData : function(){
			return nodeData;
		},
		createNodeData : function(data){
			interfaceManager.setNodeData(data);
			var id = data.id,
				name = data.name,
				type = data.type,
				parent_id = data.parent_id,
				descr = data.descr,
				creator = data.creator,
				parent_node = $("#tree").tree("find", parent_id);
//				tab = $("#tabs").tabs("getSelected");
			$("#tree").tree("append", {
				parent : parent_node.target,
				data : [{
					"id" : id,
					"text" : name,
					"attributes" : {
						"type" : type,
						"parent_id" : parent_id,
						"descr" : descr,
						"creator" : creator
					}
				}]
			});
			$("#tree").tree("expand", parent_node.target);
//			$("#tabs").tabs("update", {
//				tab : tab,
//				options : {
//					title : text,
//				}
//			});
//			//tabs更新后会刷新下, 要重新设置iframe高度
//			$("#tabs #mainframe").height("100%");
		},
		updateNodeData : function(data){	//若子页面有修改, 把tree中的数据也同时修改
			interfaceManager.setNodeData(data);
			var id = data.id,
				name = data.name,
				type = data.type,
				parent_id = data.parent_id,
				descr = data.descr,
				creator = data.creator,
				node = $("#tree").tree("find", id);
//				tab = $("#tabs").tabs("getSelected");
			$("#tree").tree("update", {
				"target" : node.target,
				"text" : name,
				"attributes" : {
					"type" : type,
					"parent_id" : parent_id,
					"descr" : descr,
					"creator" : creator
				}
			});
//			$("#tabs").tabs("update", {
//				tab : tab,
//				options : {
//					title : text,
//				}
//			});
//			//tabs更新后会刷新下, 要重新设置iframe高度
//			$("#tabs #mainframe").height("100%");
		},
		setNodeData : function(data){
			nodeData = data;
		},
		createTestEg : function(data){
			interfaceManager.setNodeData(data);
			var name = data.name,
				tab_title = name + "-测试样例";
			if(!$("#tabs").tabs("exists", tab_title)){
				var url = "egQuery.jsp",
					content = "<iframe id='mainframe' name='mainframe' src="+url+" style='width:100%;' frameborder='0' scrolling='auto'></iframe>",
					option = {
						title : tab_title,
						content : content,
						closable : true,
						iconCls : 'icontabstitle'
					};
				$("#tabs").tabs("add", option);
				var $tab_visible = $("#tabs .panel:visible");
				$tab_visible.find("#mainframe").height("100%");
			}else{
				$("#tabs").tabs("select", tab_title);
			}
		}
};