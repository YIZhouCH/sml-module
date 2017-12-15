"use strict"
//require(['echarts'], function (ec) {
//});
//var ecConfig = require('echarts/config');
//require('zrender/tool/color');
var echartsObj = {};// echartsObj 全局对象
var reportEcharts = {
		init: function (chartId, option) {//初始化方法
			require(['echarts', 'echarts/theme/macarons', 'echarts/chart/bar', 'echarts/chart/line' /*,
			            'echarts/chart/pie', 'echarts/chart/map'*/], function (ec, theme, bar/*, line, pie, map*/) {
				var myChart = ec.init(document.getElementById(chartId), theme);
				myChart.setOption(option);
				/*myChart.on(ecConfig.EVENT.CLICK, function (param) {
					
	            });*/
	           echartsObj[chartId] = myChart;
			});
		},
		//初始化字段信息, 也就是查询echarts的参数, x轴y轴等
		initEchartsFields : function(report_id){
			//屏幕窗口改变时, 让图形大小自适应
			window.onresize = function(){
				for(var echart in echartsObj){
					echartsObj[echart].resize();
				}
			}
			//初始化日历时间
			var startDate = new Date(),
				endDate = new Date();
			startDate.setDate(startDate.getDate()-3);
			endDate.setDate(endDate.getDate()-1);
			var xStartTime = ""+
					startDate.getFullYear()+"-"+
					(startDate.getMonth()+1)+"-"+
					startDate.getDate(),
				xEndTime = ""+
					endDate.getFullYear()+"-"+
					(endDate.getMonth()+1)+"-"+
					endDate.getDate();
			$("#xStartTime").val(xStartTime);
			$("#xEndTime").val(xEndTime);
			
			//修改conditions, 获取新的(不带时间的)mainSql, 并缓存起来
			var old_conditions = val[0].reportCheckInfo.conditions,
				conditions = {};
			//不能改变原对象, 所以需要克隆一下
			for(var key in old_conditions){
				conditions[key] = old_conditions[key];
			}
			conditions.isContinue = "";
			conditions.discteteTime = "";
			conditions.startTime = "";
			conditions.endTime = "";
			var sqlParam = {
					"report_id": report_id,
			        "conditions": conditions	//查询条件
				},
				sqlParamStr = JSON.stringify(sqlParam);
			var mainSql = commonAjax('/srpt/rcpt/getSql', sqlParamStr).data;
			_CacheFun._bindCache("mainSql", mainSql);
			//获取中英文对照信息, 并缓存
			var chToEn = commonAjax('/srpt/rcpt/getColumnCNEN', sqlParamStr).data;
			_CacheFun._bindCache("chToEn", chToEn);
			//获取所有字段
			var fieldInfo = val[0].data.headMetas;
			for(var i=0, len=fieldInfo.length; i<len; i++){
				var chName = fieldInfo[i];
				var totalFieldsHtml = ''
					+	'<li>'
                    +  		'<label style="font-weight: normal;margin-bottom:0;height:25px;">'
                    +       	'<input type="checkbox" value="'+chToEn[chName]+'" />'+chName
                    +       '</label>'
                    +  	'</li>';
                $("#totalFields").append(totalFieldsHtml);
			}
		},
		//显示隐藏图形区域
		showEchartsDiv : function(){
			$("#echartsDiv").slideDown(500, function(){
				$("#con_grid_div_grid").jqGrid("jqGridResize");
			});
			$("#echarts_show_icon").hide();
			$("#echarts_hide_icon").css("display","inline-block");
		},
		hideEchartsDiv : function(){
			$("#echartsDiv").slideUp(500, function(){
				$("#con_grid_div_grid").jqGrid("jqGridResize");
			});
			$("#echarts_show_icon").css("display","inline-block");
			$("#echarts_hide_icon").hide();
		},
		setEchartsFields : function(){
			$("#echartsModal").modal("show");
		},
		//fields是modal中的配置
		addFields : function(whichFields){
			var max = 5;
			var ckboxArr = $("#totalFields>li>label>input[type='checkbox']:checked"),
				liArr = ckboxArr.parent("label").parent("li"),
				whichLen = $("#"+whichFields+">li").length;
			if(whichFields=="xFields"){
				ckboxArr.attr("checked", false);
				for(var i=0, len=liArr.length; i<len; i++){
					var li = liArr[i],
						$li = $(li),
						field = $li.children("label").children("input").val(),
						checked = (i===0 && whichLen===0)?'checked="checked"':'';
					$li.append(
						'<input type="radio" name="timeField" ' +
						'style="margin-right:52px;float:right;" value="'+field+'" '+checked+'/>'
					);
				}
				$("#"+whichFields).append(liArr);
			}else if(whichFields=="lYFields" || whichFields=="rYFields"){	//既不为x, 又不小于等于max, 则alert
				if((liArr.length+whichLen)<=max){
					ckboxArr.attr("checked", false);
					$("#"+whichFields).append(liArr);
				}else{
					alert('单侧Y轴个数不允许超过'+max+'个');
				}
			}
		},
		removeFields : function(whichFields){
			var fieldArr = $("#"+whichFields+">li>label>input[type='checkbox']:checked").attr("checked", false)
							.parent("label").parent("li");
			if(whichFields == "xFields"){
				var rioLen = fieldArr.children("input[name='timeField']:checked").length;
				fieldArr.children("input[name='timeField']").remove();
				$("#totalFields").append(fieldArr);	//注意先后顺序, 这个先执行
				//判断删除的是否有带单选框的, 如果有, 给剩下的第一个加单选
				rioLen > 0 && $("#"+whichFields+">li:eq(0)")
								.children("input[name='timeField']")
								.attr("checked", true);
				
			}else{
				$("#totalFields").append(fieldArr);
			}
		},
		//x轴查询条件
		addXAxis: function(){
			var xFieldArr = $("#xFields>li>label"),
				timeField = $("#xFields>li>input[name='timeField']:checked").val();
			$("#timeField").val(timeField);	//获取时间字段, 并保存起来
			$("#xAxis").empty();
			$("#xAxisParam").empty();
			
			var mainSql = _CacheFun._getCache("mainSql");
			//连续时间条件是否显示
			if(xFieldArr[0].getElementsByTagName("input")[0].value == timeField){
				$("#xTimeFieldCond").css("display", "inline-block");
			}else{
				$("#xTimeFieldCond").hide();
			}
			for(var i=0, len=xFieldArr.length; i<len; i++){
				var label = xFieldArr[i],
					field = label.getElementsByTagName("input")[0].value,
					text = label.innerText;
				//添加到x轴下拉菜单中
				$("#xAxis").append('<option value="'+field+'">'+text+'</option>');
				
				//如果是时间字段, 不需要枚举, 加时间框
				if(field == timeField){
					var date = new Date();
					date.setDate(date.getDate()-1);	//默认前一天
					var dateStr = ""
								+ date.getFullYear() +"-"
								+ (date.getMonth()+1) + "-"
								+ date.getDate();
					var xAxisParamStr = ''
						+	'<span id="'+field+'_span" style="display:'+(i===0?'none':'inline-block')+';margin-right: 10px;margin-bottom:5px;">'
		        		+		'<span style="margin-right: 10px">'+text+':</span>'
		        		+		'<input class="Wdate" style="width: 120px;" '
		        		+			'name="'+field+'" value="'+dateStr+'"'
		        		+			'onclick="WdatePicker({dateFmt : \'yyyy-MM-dd\',maxDate:\'%y-%M-{%d-1}\'})">'
		        		+	'</span>';
					$("#xAxisParam").append(xAxisParamStr);
					continue;
				}
				//添加到条件维度中
				var xAxisParamStr = ''
					+	'<span id="'+field+'_span" style="display:'+(i===0?'none':'inline-block')+';margin-right: 10px;margin-bottom:5px;">'
	        		+		'<span style="margin-right: 10px">'+text+':</span>'
	        		+		'<select name="'+field+'" style="width: 100px;">'
	        		+		'</select>'
	        		+	'</span>';
				$("#xAxisParam").append(xAxisParamStr);
				
				var distRes = _CacheFun._getCache("dist_html_"+field);
				if(distRes){	//如果枚举字段有值, 直接用, 否则请求
					
				}
				//请求, 获取字段枚举数据
				var logic_sql_info = 
					"SELECT DISTINCT "+field
					+" FROM ("+mainSql+")";
				var param = {
						"report_id" : val[0].reportCheckInfo.report_id,
						"logic_sql_info" : logic_sql_info
					},
					paramStr = JSON.stringify(param);
				$.ajax({
					url: eastcom.baseURL + "/srpt/rcpt/excludeSql",
					type: "POST",
					async: true,
					dataType: "json",
					contentType: "application/json",
					data: paramStr,
					beforeSend : function(){
						$("#echartsModal").mask("资源请求中, 请稍后...");
					},
					complete: function(){
						$("#echartsModal").unmask();
					},
					success: function(result, a1, a2, a3) {
						var res = result.data;
						for(var j=0, len_j=res.length; j<len_j; j++){
							var re = res[0],
								fieEn = "";
							for(var key in re){
								fieEn = key;
							}
							var opt_val = res[j][fieEn];
							$("#"+fieEn+"_span>select").append('<option value="'+opt_val+'">'+opt_val+'</option>');
						}
					}
				});
			}
			return xFieldArr.length;
		},
		//y轴查询条件
		addYAxis : function(lr){
			var yFieldArr = $("#"+lr+"YFields>li>label");
			$("#"+lr+"YAxis>tbody").empty();
			for(var i=0, len=yFieldArr.length; i<len; i++){
				var label = yFieldArr[i],
					field = label.getElementsByTagName("input")[0].value,
					text = label.innerText;
				var trStr = ''
					+	'<tr>'
					+		'<td>'+text+'</td>'
					+		'<td style="padding-top: 6px;">'
					+			'<label>'
					+				'<input type="radio" name="'+field+'" value="line" checked="checked" style="margin-left: 0;"/>'
					+				'<i class="fa fa-line-chart" style="color: #0085d0;"></i>'
					+			'</label>'
					+			'<label>'
					+				'<input type="radio" name="'+field+'" value="bar" style="margin-left: 10px;"/>'
					+				'<i class="fa fa-bar-chart" style="color: #0085d0;"></i>'
					+			'</label>'
					+			'<label>'
					+				'<input type="radio" name="'+field+'" value="area" style="margin-left: 10px;"/>'
					+				'<i class="fa fa-area-chart" style="color: #0085d0;"></i>'
					+			'</label>'
					+		'</td>'
					+		'<td>'
					+			'<select style="height:28px;font-size:12px;">'
					+				'<option value="SUM" selected="selected">求和</option>'
					+				'<option value="AVG">平均数</option>'
					+				'<option value="MAX">最大值</option>'
					+				'<option value="MIN">最小值</option>'
//					+				'<option value="COUNT">数量</option>'
					+			'</select>'
					+		'</td>'
					+	'</tr>';
				$("#"+lr+"YAxis>tbody").append(trStr);
			}
			return yFieldArr.length;
		},
		//上一步  下一步
		nextStep : function(){
			//处理X
			var xLen = this.addXAxis();
			//处理Y
			var lYLen = this.addYAxis("l");
			var rYLen = this.addYAxis("r");
			if(xLen>0 && (lYLen>0 || rYLen>0)){
				$("#echartsStep_1").slideUp(500);
				$("#echartsStepBtn_1").slideUp(500);
				$("#echartsStep_2").slideDown(500);
				$("#echartsStepBtn_2").slideDown(500);
			}
		},
		lastStep : function(){
			$("#echartsStep_2").slideUp(500);
			$("#echartsStepBtn_2").slideUp(500);
			$("#echartsStep_1").slideDown(500);
			$("#echartsStepBtn_1").slideDown(500);
		},
		//x轴变换时, 选择维度条件
		xAxisChange : function(field){
			$("#xAxisParam"+">span").css("display", "inline-block");
			$("#"+field+"_span").hide();
			var timeField = $("#timeField").val();
			$("#xTimeFieldCond").css("display", field==timeField?"inline-block":"none");
		},
		queryEcharts : function(){
			var timeField = $("#timeField").val(),
				xAxis = $("#xAxis").val();
			//修改conditions, 获取新的mainSql
			var report_id = val[0].reportCheckInfo.report_id,
				old_conditions = val[0].reportCheckInfo.conditions,
				conditions = {};
			//不能改变原对象, 所以需要克隆一下
			for(var key in old_conditions){
				conditions[key] = old_conditions[key];
			}
			if(timeField == xAxis){	//如果x是时间
				//判断时间框是否显示, 并取值
				var startTime = $("#xStartTime").val().replace(/\-/g, "")+"0000",
					endTime = $("#xEndTime").val().replace(/\-/g, "")+"2359";
				conditions.isContinue = "t";
				conditions.startTime = startTime;
				conditions.endTime = endTime;
			}else{
				conditions.isContinue = "";
				conditions.startTime = "";
				conditions.endTime = "";
			}
			conditions.discteteTime = "";
			var sqlParam = {
					"report_id": report_id,
			        "conditions": conditions	//查询条件
				},
				sqlParamStr = JSON.stringify(sqlParam);
			var mainSql = commonAjax('/srpt/rcpt/getSql', sqlParamStr).data;
			
			//定义初始sql语句
			var selSql = "SELECT ",
				fromSql = " FROM (" + mainSql + ") ",
				whereSql = " WHERE 1=1",
				groupSql = " GROUP BY ";
			//获取x信息, 并拼sql
			var xSpanArr = $("#xAxisParam>span:visible");
			selSql += xAxis;
			groupSql += xAxis;
			for(var i=0, len=xSpanArr.length; i<len; i++){
				var xSpan = xSpanArr[i];
				var xParam = "";
				if(xSpan.id != (timeField+"_span")){
					xParam = xSpan.getElementsByTagName("select")[0];
				}else{
					xParam = xSpan.getElementsByTagName("input")[0];
				}
				whereSql += " and "+xParam.name+"='"+xParam.value+"'";
			}
			
			//获取y轴信息, 并拼sql
			var lTr = $("#lYAxis>tbody>tr"),
				rTr = $("#rYAxis>tbody>tr");
			//定义option基本数据
			var legData = [],
				seriesObj = {};
			//遍历tr, 获取信息
			var trData = [lTr, rTr];
			for(var j=0, len_j=trData.length; j<len_j; j++){
				var trArr = trData[j];
				for(var i=0, len_i=trArr.length; i<len_i; i++){
					var tr = trArr[i],
						$tr = $(tr);
					//获取字段中英文名, 以及趋势图类型
					var text = $tr.children("td:eq(0)").text(),
						$input = $tr.children("td:eq(1)")
								.children("label")
								.children("input[type='radio']:checked"),
						field = $input.attr("name"),
						type = $input.val(),
						aggFun = $tr.children("td:eq(2)").children("select").val();
					//拼接sql, 如果avg, 要round
					if(aggFun == "AVG"){
						selSql += ", ROUND("+aggFun+"("+field+"), 2) AS "+field;
					}else{
						selSql += ", "+aggFun+"("+field+") AS "+field;
					}
					legData.push(text);	//拼图例
					//区域图的, 要处理一下
					var itemStyle = {};
					if(type == "area"){
						type = "line";
						itemStyle = {
							normal: {
								areaStyle: {
									type : "default"
								}
							}
						};
					}
					seriesObj[field] = {
						type: type,
						name: text,
						yAxisIndex: j,
						data: [],
						itemStyle: itemStyle
					}
				}
			}
			
			//请求接口, 拼返回数据
			var logic_sql_info = selSql+fromSql+whereSql+groupSql;
			var param = {
					"report_id" : report_id,
					"logic_sql_info" : logic_sql_info
				},
				paramStr = JSON.stringify(param);
			$.ajax({
				url: eastcom.baseURL + "/srpt/rcpt/excludeSql",
				type: "POST",
				async: true,
				dataType: "json",
				contentType: "application/json",
				data: paramStr,
				beforeSend : function(){
					$("#reportEcharts").mask("查询中, 请稍后...");
				},
				complete: function(){
					$("#reportEcharts").unmask();
				},
				success: function(result) {
					var resArr = result.data;
					var xData = [];
					for(var i=0, len=resArr.length; i<len; i++){
						var res = resArr[i];
						xData.push(res[xAxis]);	//添加x轴
						for(var field in res){
							if(field == xAxis){
								continue;	//如果时间字段, 则跳过
							}
							
							var resVal = res[field];
							//空值处理, 不能用弱类型, 因为0会按false处理
							if(resVal!=null && resVal!=undefined){
								seriesObj[field].data.push(resVal);
							}else{
								seriesObj[field].data.push('-');
							}
						}
					}
					//把series的obj对象, 转为数组
					var seriesArr = [];
					for(var field in seriesObj){
						seriesArr.push(seriesObj[field]);
					}
					
					var option = {
							tooltip: {
								trigger: "axis"
							},
							legend: {
								data: legData
							},
							grid: {
								x: 70,
								y: 50,
								width: '85%'
							},
							xAxis: {
								type: "category",
								data: xData
							},
							yAxis: [
								{
									gridIndex: 0,
									type: "value",
									name: "左半轴"
								},
								{
									gridIndex: 1,
									type: "value",
									name: "右半轴"
								}
							],
							series: seriesArr
					};
					reportEcharts.init("reportEcharts", option);
				}
			});
			$("#echartsModal").modal("hide");
		}
};