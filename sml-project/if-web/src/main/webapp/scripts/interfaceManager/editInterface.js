$(function(){
	editInterface.init();
});
"use strict";
var count = 0,
 filedName='',
	editInterface = {
		init : function(){
			editInterface.initRebuild();	//包装器
			editInterface.initDb_Id();		//数据源
			editInterface.initLiClickEvent();//初始化li点击事件
			var nodeData = parent.interfaceManager.getNodeData();
			if(!nodeData){
				return;
			}
			var type = nodeData.type || "",
				parent_id = nodeData.parent_id || "",
				creator = nodeData.creator || "";
			//----------------根据Id是否存在, 判断是新增还是编辑
			if(nodeData.id){
				var id = nodeData.id,
					name = nodeData.name,
					url = "/sml/query/if-cfg-interMngFieldQuery",
					data = {
						"id": id
					},
					dataStr = JSON.stringify(data),
					result = commonAjax(url, dataStr);
				if(result.success){
					var	inter = result.data,
						mainsql = inter[0].MAINSQL || "",
						rebuild_info = inter[0].REBUILD_INFO || "{}",
						condition_info = inter[0].CONDITION_INFO || "{}",
						cache_enabled = inter[0].CACHE_ENABLED ? inter[0].CACHE_ENABLED.toString() : "0",
						cache_minutes = inter[0].CACHE_MINUTES ? inter[0].CACHE_MINUTES.toString() : "0",
						db_id = inter[0].DB_ID || "",
						descr = nodeData.descr || "",
//						describe = inter[0].DESCRIBE,	//由于describe与name相同, 所以不获取了
						update_time = inter[0].UPDATE_TIME;
//					$("#id").val(id);
//					$("#name").val(name);
//					$("#mainsql").val(mainsql);
//					$("#db_id").val(db_id);
					document.getElementById("id").value = id;
					document.getElementById("name").value = name;
					document.getElementById("mainsql").value = mainsql;
					document.getElementById("db_id").value = db_id;
//					$("#describe").val(describe);
//					$("#update_time").val(update_time);
//					$("#descr").val(descr);
					document.getElementById("update_time").value = update_time;
					document.getElementById("descr").value = descr;
					//以下区域需要特殊处理
//				---------------包装器--------------------
					if(rebuild_info){
//						$("#rebuild").val(rebuild_info.split("\n")[0]);
						document.getElementById("rebuild").value = rebuild_info.split("\n")[0];
					}
//					$("#rebuild_info").val(rebuild_info);
					document.getElementById("rebuild_info").value = rebuild_info;
//				---------------缓存信息------------------------------
//					$("#cache_enabled").val(cache_enabled);
					document.getElementById("cache_enabled").value = cache_enabled;
					var dom_cache_minutes = document.getElementById("cache_minutes");
					if(cache_enabled == "0"){
//						$("#cache_minutes").prop("disabled", true);
//						$("#cache_minutes").val("0");
						dom_cache_minutes.disabled = true;
						dom_cache_minutes.value = "0";
					}else{
//						$("#cache_minutes").prop("disabled", false);
//						$("#cache_minutes").val(cache_minutes);
						dom_cache_minutes.disabled = false;
						dom_cache_minutes.value = cache_minutes;
					}
//				---------------参数------------------------------------------
//					$("#condition_info").val(condition_info);
					document.getElementById("condition_info").value = condition_info;
					if(condition_info){
						formatJsonToParam(condition_info, "condition_info_param", "condition");
					}
//				------------------按钮绑定事件-----------------------------------------------
					$("#btn_save").unbind("click").bind("click", editInterface.save);
				}else{
					alert(result.data);
				}
			}else{
//				$("#id").prop("disabled", false);
//				$("#btn_test").prop("disabled", true);
				document.getElementById("id").disabled = false;
				document.getElementById("btn_test").disabled = true;
				$("#btn_save").unbind("click").bind("click", editInterface.add);
			}
//			--------------无论添加还是编辑, type和parent_id这些都可以获取到
//			$("#type").val(type);
//			$("#parent_id").val(parent_id);
//			$("#creator").val(creator);
			document.getElementById("type").value = type;
			document.getElementById("parent_id").value = parent_id;
			document.getElementById("creator").value = creator;
		},
		//从后台的枚举中 加载包装器
		initRebuild : function(){
			var url = "/sml/query/if-cfg-interMngBuilderQuery",
				result = commonAjax(url);
			if(result.success){
				var dataArr = result.data,
					htmlArr = [],
					dom_rebuild = document.getElementById("rebuild");
				dom_rebuild.options.length = 0;
//				$("#rebuild").append("<option>---请选择包装器---</option>");
				htmlArr.push("<option>---请选择包装器---</option>");
				var rebuildData = {};
				for(var i=0, len=dataArr.length; i<len; i++){
					var classpath = dataArr[i].CLASSPATH,
						descr = dataArr[i].DESCR,
						name = dataArr[i].NAME.replace(/</g, "&lt;").replace(/>/g, "&gt;");
					rebuildData[classpath] = descr;
//					$("#rebuild").append("<option value=\"" + classpath + "\">" + name + "</option>");
					htmlArr.push("<option value=\"" + classpath + "\">" + name + "</option>");
				}
				dom_rebuild.innerHTML = htmlArr.join("\n");
				$("#rebuild").data("rebuildData", rebuildData);
				var key = "DefaultDataBuilder",
					value = rebuildData[key];
//				$("#rebuild").val(key);
				dom_rebuild.value = key;
//				$("#rebuild_info").val(key + "\n" + value);
				document.getElementById("rebuild_info").value = key + "\n" + value;
			}else{
				alert(result.data);
			}
		},
		//从后台枚举, 加载数据源
		initDb_Id : function(){
			var url = "/sml/query/if-cfg-enum-dss",
				result = commonAjax(url);
			if(result.success){
				var data = result.data,
					htmlArr = [],
					dom_db_id = document.getElementById("db_id");
				dom_db_id.options.length = 0;
//				$("#db_id").append("<option selected='selected' value=''>---选择数据源---</option>");
				htmlArr.push("<option selected='selected' value=''>---选择数据源---</option>");
				for(var key in data){
					var id = data[key].id_,
						name = data[key].name_;
//					$("#db_id").append("<option value=\"" + id + "\">" + name + "</option>");
					htmlArr.push("<option value=\"" + id + "\">" + name + "</option>");
				}
				dom_db_id.innerHTML = htmlArr.join("\n");
//				$("#db_id").val("srpt");
				dom_db_id.value = "srpt";
			}else{
				alert(result.data);
			}
		},
//		--------------------------------参      数     处     理     区-----------------------------------------------
		changeParam : function(){
//			var param = $("#condition_info_param").val();
			var param = document.getElementById("condition_info_param").value;
			if(!formatParamToJson(param, "condition_info")){	//如果转换失败
				document.getElementById("condition_info_param").focus();
			}
		},
		editParam : function(){
//			$("#addParam tbody").empty();
			document.getElementById("addParam").getElementsByTagName("tbody")[0].innerHTML = "";
//			var paramStr = $("#condition_info").val();
			var paramStr = document.getElementById("condition_info").value;
			formatJsonToTable(paramStr, "addParam");
			$('#addParamModal').modal('show');
		},
		//-----分页查询接口时, 可选自动添加一些参数
		editPageDataParam : function(){
//			if($("#if_page_data").is(":checked")){	//是否被选中
			if(document.getElementById("if_page_data").checked){
				var param = 
					{"sqlParams":[
						{
							name : "limit",
							type : "number",
							defaultValue : "10",
							descr : "每页大小",
							enabled : 0 
						},
						{
							name : "page",
							type : "number",
							defaultValue : "1",
							descr : "当前页",
							enabled : 0
						},
						{
							name : "sidx",
							type : "char",
							defaultValue : "",
							descr : "排序字段",
							enabled : 0
						},
						{
							name : "sord",
							type : "char",
							defaultValue : "",
							descr : "排序",
							enabled : 0
						},
						{
							name : "queryType",
							type : "char",
							defaultValue : "select",
							descr : "查询类型",
							enabled : 0
						}
					]},
					paramStr = JSON.stringify(param);
				formatJsonToTable(paramStr, "addParam");
			}else{
//				var rows = $("#addParam tbody tr");
				var rows = document.getElementById("addParam")
							.getElementsByTagName("tbody")[0]
							.getElementsByTagName("tr");
				for(var i=0; i<rows.length; i++){	//循环获取table中数据, 拼成正规sql参数形式
//					var $td = $(rows[i]).children("td"),
//						paramName = $td.eq(0).children("input").val();
					var dom_tds = rows[i].getElementsByTagName("td"),
						paramName = dom_tds[0].getElementsByTagName("input")[0].value;
					if(paramName == "limit" || paramName == "page" || paramName == "sidx"
						|| paramName == "sord" || paramName == "queryType"){
//						$td.eq(5).children("a").click();
						dom_tds[5].getElementsByTagName("a")[0].click();
						i--;	//用js时, 要做一下i--处理
					}
				};
			}
		},
		addParam : function(){	//弹出编辑参数modal, 点击 "加号" 执行
//			var htmlArr = ''
//				+ '<tr><td><input type="text"/></td> '
//				+ '<td>'
//					+'<select><option selected="selected" value="char">char</option><option value="array-char">array-char</option><option value="number">number</option><option value="date">date</option></select>'
//				+ '</td> '
//				+ '<td><input type="text"/></td>'
//				+ '<td><input type="text"/></td>'
//				+ '<td style="width:60px;"><input type="checkbox"" style="margin:0px;"/></td>'
//				+ '<td style="width:60px;"><a href="JavaScript:void(0)" onclick="editInterface.delParam(this)" ><img src="../../static/interfaceManager/images/closehong.png"></a></td></tr>';
			var htmlArr = [];
			htmlArr.push("<tr>");
			htmlArr.push('<td><input type="text"/></td>');
			htmlArr.push(
					'<td>' +
						'<select><option selected="selected" value="char">char</option><option value="array">array</option><option value="array-char">array-char</option><option value="number">number</option><option value="date">date</option><option value="array-date">array-date</option></select>' + 
					'</td>');
			htmlArr.push('<td><input type="text"/></td>');
			htmlArr.push('<td><input type="text"/></td>');
			htmlArr.push('<td><input type="checkbox"" style="margin:0px;"/></td>');
			htmlArr.push(
					'<td>' +
						'<a href="JavaScript:void(0)" onclick="editInterface.delParam(this)" ><img src="../../static/interfaceManager/images/closehong.png"></a>' +
					'</td>');
			htmlArr.push("</tr>");
			$("#addParam tbody").append(htmlArr.join("\n"));
		},
		subParam : function(){	//编辑参数modal中, 点击添加执行
//			var rows = $("#addParam tbody tr"),
			var rows = document.getElementById("addParam")
								.getElementsByTagName("tbody")[0]
								.getElementsByTagName("tr"),
				paramStr = "";
			if(rows.length == 0){
				paramStr = "{}";
			}else{
				paramStr += "{\n\"sqlParams\":\n[\n";
				for(var i=0, len=rows.length; i<len; i++){	//循环获取table中数据, 拼成正规sql参数形式
					paramStr += "{";
//				var $td = $(rows[i]).children("td"),
//					paramName = $td.eq(0).children("input").val(),
//					paramType = $td.eq(1).children("select").val(),
//					paramDefault = $td.eq(2).children("input").val(),
//					paramDescr = $td.eq(3).children("input").val(),
//					paramIfMust = $td.eq(4).children("input[type='checkbox']").is(":checked"),
					var dom_tds = rows[i].getElementsByTagName("td"),
					paramName = dom_tds[0].getElementsByTagName("input")[0].value,
					paramType = dom_tds[1].getElementsByTagName("select")[0].value,
					paramDefault = dom_tds[2].getElementsByTagName("input")[0].value,
					paramDescr = dom_tds[3].getElementsByTagName("input")[0].value,
					paramEnabled = dom_tds[4].getElementsByTagName("input")[0].checked ? "1" : "0";
					if(!paramName || !paramDescr){
						alert("英文名称或备注不能为空!");
						return;
					}
					paramStr +=  "\"name\":\"" + paramName + "\"," 
					+"\"type\":\"" + paramType + "\"," 
					+"\"defaultValue\":\"" + paramDefault + "\"," 
					+"\"descr\":\""+ paramDescr + "\"," 
					+"\"enabled\":\"" + paramEnabled + "\"}";
					if(i != len-1){
						paramStr += ",";
					}
					paramStr += "\n";
				}
				paramStr += "]\n" + "}";
			}
//			$("#condition_info").val(paramStr);
			document.getElementById("condition_info").value = paramStr;
			formatJsonToParam(paramStr, "condition_info_param", "condition");
			$('#addParamModal').modal("hide");
		},
		//删除table中 按钮所在行的数据
		delParam : function(obj){
			$(obj).parents("tr").remove();
		},
		showTip:function(thisID){
			 var  e =event || window.event;
			 var offset=$("#"+thisID).offset();
			$("#sel_div").show();
			$("#sel_div").css("position", "absolute");
			$("#sel_div").css("top",offset.top+24);
			$("#sel_div").css("left",offset.left);
			filedName=$("#"+thisID).find("span").eq(1).html();
		},
		initLiClickEvent:function(){
			$("#bq_sel").find("li").on("mousemove",function(){
				$("#bq_sel").find("li").removeClass("selected");
				$(this).addClass("selected");
			});
			$("#bq_sel").on("mouseleave",function(){
				$("#sel_div").hide();
			});
				$("#bq_sel").find("li").on("click",function(){
				var value=$(this).attr("val");
				var htmlStr='';
				switch(value){
				case 'if':htmlStr='<if test=" \'@'+filedName+'\'==\'\' ">'+filedName+'</if>';break;
				case 'isNet':htmlStr='<isNotEmpty property="'+filedName+'"> and '+filedName+'=#'+filedName+'#</isNotEmpty>';break;
				case 'isEt':htmlStr='<isEmpty property="'+filedName+'"> and '+filedName+'</isEmpty>';break;
				default:htmlStr=filedName;break;
				}
				$("#mainsql").insertAtCaret(htmlStr);
				$("#sel_div").hide();
			});
		},
		//点击蓝色的参数块时, sql中加入该id
		addTextArea : function(id){
			var text = $("#"+id).find("span").eq(1).text();
			$("#mainsql").insertAtCaret(text);
		},
//		-------------------------包      装      器      区      域-----------------------------------------------------
		changeRebuild : function(){
//			var classpath = $("#rebuild").val(),
			var classpath = document.getElementById("rebuild").value,
				descr = $("#rebuild").data("rebuildData")[classpath],
				rebuild_info = classpath + "\n" + descr;
//			$("#rebuild_info").val(rebuild_info);
			document.getElementById("rebuild_info").value = rebuild_info;
		},
//		------------------------数      据      源      区      域------------------------------
		changeDbId : function(){
//			var db_id = $("#db_id").val();
			var db_id = document.getElementById("db_id").value,
				dom_db_id_text = document.getElementById("db_id_text");
			if(db_id){
//				$("#db_id_text").prop("disabled", true).val(db_id);
				dom_db_id_text.disabled = true;
				dom_db_id_text.value = db_id;
			}else{
//				$("#db_id_text").prop("disabled", false).val("");
				dom_db_id_text.disabled = false;
				dom_db_id_text.value = "";
			}
		},
//		------------------------缓      存      标      志      区      域------------------------------------------
		//是否缓存做出改变时, 编辑缓存时间
		editCache : function(){
//			var cache_enabled = $("#cache_enabled").val();
			var cache_enabled = document.getElementById("cache_enabled").value,
				dom_cache_minutes = document.getElementById("cache_minutes");
			if(cache_enabled == "0"){
//				$("#cache_minutes").val("0");
//				$("#cache_minutes").prop("disabled", true);
				dom_cache_minutes.value = "0";
				dom_cache_minutes.disabled = true;
			}else{
//				$("#cache_minutes").val("");
//				$("#cache_minutes").prop("disabled", false);
				dom_cache_minutes.value = "";
				dom_cache_minutes.disabled = false;
			}
		},
//		---------------------------发      送       请      求------------------------------------------------
		add : function(){
//			var id = $("#id").val(),
//				name = $("#name").val(),
//				mainsql = $("#mainsql").val(),
//				rebuild_info = $("#rebuild_info").val(),
//				condition_info = $("#condition_info").val(),
//				cache_enabled = $("#cache_enabled").val(),
//				cache_minutes = $("#cache_minutes").val(),
//				db_id = $("#db_id").val(),
//				descr = $("#descr").val(),
//				creator = $("#creator").val(),
//				type = $("#type").val(),
//				parent_id = $("#parent_id").val(),
			var id = document.getElementById("id").value,
				name = document.getElementById("name").value,
				mainsql = document.getElementById("mainsql").value,
				rebuild_info = document.getElementById("rebuild_info").value,
				condition_info = document.getElementById("condition_info").value,
				cache_enabled = document.getElementById("cache_enabled").value,
				cache_minutes = document.getElementById("cache_minutes").value,
				db_id = document.getElementById("db_id").value,
				descr = document.getElementById("descr").value,
				creator = document.getElementById("creator").value,
				type = document.getElementById("type").value,
				parent_id = document.getElementById("parent_id").value,
				update_time = new Date().format("yyyy-MM-dd hh:mm:ss")
						.replace(/-/g, "")
						.replace(/:/g,"")
						.replace(/ /g,"");
			if(!id || !name || !mainsql || !rebuild_info || !condition_info 
					|| !cache_enabled || !cache_minutes || !db_id || !descr || !creator){
				alert("必输项不能为空!");
				return;
			}
			//---------先加菜单表
			var url_menu = "/sml/update/if-cfg-interMngMenu",
				data_menu = {
					"update_type":"insert",
					"id": id,
					"name": name,
					"type": type,            //  0:文件夹    1：接口
					"parent_id": parent_id,
					"descr": descr,
					"creator": creator,
					"update_time": update_time
				},
				data_menu_str = JSON.stringify(data_menu),
				result_menu = commonAjax(url_menu, data_menu_str);
			if(result_menu.success){
				//------------添加真实接口
				var url = "/sml/update/if-cfg-interMngIfUpdate",
					data = {
						"update_type":"insert",
						"id": id,                                 //    --接口id
						"mainsql": mainsql,                        //      --主体sql
						"rebuild_info": rebuild_info,               //    --返回结果格式
						"condition_info":condition_info,         //    --配置信息
						"cache_enabled":cache_enabled,			//   --是否缓存
						"cache_minutes":cache_minutes,			//缓存时间
						"db_id":db_id,                              //   --数据源标志
						"describe":name,                           //   --描述
						"update_time":update_time
					},
					dataStr = JSON.stringify(data),
					result = commonAjax(url, dataStr);
				if(result.success){
					var nodeData = {
						"id":id,
						"name":name,
						"type" : type,
						"parent_id" : parent_id,
						"descr" : descr,
						"creator" : creator
					};
//					$("#id").prop("disabled", true);
//					$("#btn_test").prop("disabled", false);
					document.getElementById("id").disabled = true;
					document.getElementById("btn_test").disabled = false;
					$("#btn_save").unbind("click").bind("click", editInterface.save);
					parent.interfaceManager.createNodeData(nodeData);
					alert("添加成功!");
				}else{
					alert(result.data);
				}
			}else{
				alert(result_menu.data);
			}
		},
		save : function(){
//			var id = $("#id").val(),
//				name = $("#name").val(),
//				mainsql = $("#mainsql").val(),
//				rebuild_info = $("#rebuild_info").val(),
//				condition_info = $("#condition_info").val(),
//				cache_enabled = $("#cache_enabled").val(),
//				cache_minutes = $("#cache_minutes").val(),
//				db_id = $("#db_id").val(),
//				descr = $("#descr").val(),
//				creator = $("#creator").val(),
//				type = $("#type").val(),
//				parent_id = $("#parent_id").val(),
			var id = document.getElementById("id").value,
				name = document.getElementById("name").value,
				mainsql = document.getElementById("mainsql").value,
				rebuild_info = document.getElementById("rebuild_info").value,
				condition_info = document.getElementById("condition_info").value,
				cache_enabled = document.getElementById("cache_enabled").value,
				cache_minutes = document.getElementById("cache_minutes").value,
				db_id = document.getElementById("db_id").value,
				descr = document.getElementById("descr").value,
				creator = document.getElementById("creator").value,
				type = document.getElementById("type").value,
				parent_id = document.getElementById("parent_id").value,
				update_time = new Date().format("yyyy-MM-dd hh:mm:ss")
						.replace(/-/g, "")
						.replace(/:/g,"")
						.replace(/ /g,"");
			if(!id || !name || !mainsql || !rebuild_info || !condition_info 
					|| !cache_enabled || !cache_minutes || !db_id || !descr || !creator){
				alert("必输项不能为空!");
				return;
			}
		//---------改接口表, 先添加日志
			var url_log = "/sml/update/if-cfg-interMngLogUpdate",
				data_log = {
					"update_type":"insert",
					"id":id,                                 //    --接口id
					"mainsql":mainsql,                        //      --主体sql
					"rebuild_info":rebuild_info,               //    --返回结果格式
					"condition_info":condition_info,         //    --配置信息
					"cache_enabled":cache_enabled,			//   --是否缓存
					"cache_minutes":cache_minutes,			//缓存时间
					"db_id":db_id,                              //   --数据源标志
					"describe":name,                           //   --描述
					"update_time":update_time
				},
				dataStr_log = JSON.stringify(data_log),
				result_log = commonAjax(url_log, dataStr_log);	//先添加日志
			if(result_log.success){
			//-----------修改真实接口
				var url_inter = "/sml/update/if-cfg-interMngIfUpdate",
					data_inter = {
						"update_type":"update",
						"id":id,                                 //    --接口id
						"mainsql":mainsql,                        //      --主体sql
						"rebuild_info":rebuild_info,               //    --返回结果格式
						"condition_info":condition_info,         //    --配置信息
						"cache_enabled":cache_enabled,			//   --是否缓存
						"cache_minutes":cache_minutes,			//缓存时间
						"db_id":db_id,                              //   --数据源标志
						"describe":name,                           //   --描述
						"update_time":update_time
					},
					data_inter_str = JSON.stringify(data_inter),
					result_inter = commonAjax(url_inter, data_inter_str);
				if(result_inter.success){
					//----------改菜单表
					var url_menu = "/sml/update/if-cfg-interMngMenu",
						data_menu = {
							"update_type":"update",
							"id": id,
							"name": name,
							"type": type,            //  0:文件夹    1：接口
							"parent_id": parent_id,
							"descr": descr,
							"creator": creator,
							"update_time": update_time
						},
						data_menu_str = JSON.stringify(data_menu),
						result_menu = commonAjax(url_menu, data_menu_str);
					if(result_menu.success){
						var nodeData = {
							"id":id,
							"name":name,
							"type" : type,
							"parent_id" : parent_id,
							"descr" : descr,
							"creator" : creator
						};
						parent.interfaceManager.updateNodeData(nodeData);
						alert("保存成功!");
					}else{
						alert(result_menu.data);
					}
				}else{
					alert(result_inter.data);
				}
			}else{
				alert(result_log.data);
			}
		},
//---------------------------------测      试      样      例      区      域----------------------------------------
		testEg : function(){
//			var id = $("#id").val(),
//				name = $("#name").val(),
//				descr = $("#descr").val(),
//				creator = $("#creator").val(),
//				type = $("#type").val(),
//				parent_id = $("#parent_id").val();
			var id = document.getElementById("id").value,
				name = document.getElementById("name").value,
				descr = document.getElementById("descr").value,
				creator = document.getElementById("creator").value,
				type = document.getElementById("type").value,
				parent_id = document.getElementById("parent_id").value;
			var nodeData = {
				"id":id,
				"name":name,
				"type" : type,
				"parent_id" : parent_id,
				"descr" : descr,
				"creator" : creator
			};
			parent.interfaceManager.createTestEg(nodeData);
//			var tab_title = name + "-测试样例",
//				jq = top.jQuery;
//			if(!jq("#tabs").tabs("exists", tab_title)){
//				var url = "egQuery.jsp",
//					content = "<iframe id='mainframe' name='mainframe' src="+url+" style='width:100%;' frameborder='0' scrolling='auto'></iframe>",
//					option = {
//						title : tab_title,
//						content : content,
//						closable : true
//					};
//				jq("#tabs").tabs("add", option);
//				var $tab_visible = jq("#tabs .panel:visible");
//				$tab_visible.find("#mainframe").height("100%");
//			}else{
//				jq("#tabs").tabs("select", tab_title);
//			}
		}
};
