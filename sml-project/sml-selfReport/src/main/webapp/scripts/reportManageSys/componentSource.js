//对象数组去重
Array.prototype.unique = function(field){
    var n = {},r=[]; //n为hash表，r为临时数组
    for(var i = 0, len = this.length; i < len; i++){
        if (!n[this[i][field]]){
            n[this[i][field]] = true; //存入hash表
            r.push(this[i]); //把当前数组的当前项push到临时数组里面
        }
    }
    return r;
};
//增加编辑组件
addComponentSource = {
	getshurukuang: function(zujianLabel, count) {
		var innerHTML = '' +
			'<span style="display:inline-block;min-width:60px;white-space:nowrap">' + zujianLabel + ':</span><input id="qry_' + count + '" type="text" style="width:150px;height:34px" /> ' +
			'<span style="margin-left:20px">是否必填:</span><input id="checkbox" type="checkbox" style="margin-right: 19px;" />' +
			'<a href="JavaScript:void(0)" onclick="addReport.delZujian(this)" ><img style="width: 34px; height: 34px ;margin-left: 40px;"  src="../../static/reportManageSys/images/closehong.png"></a>' +
			'<p style="display:none">{label:"' + zujianLabel + '",type:"text",id:"qry_' + count + '"}</p>';

		return innerHTML;
	},
	getxialakuang: function(zujianLabel, count, xialaType) {
		var datas = "";
		// if( xialaType=="area-enum-area" || xialaType=="chooseShudi"){
		var data = {
			"ifId": xialaType
		}; //地市参数
		var dataStr = JSON.stringify(data);
		//------------------------------------------------
		var ajaxUrl = "";
		var query = configUrl_main.query;
		if (query.indexOf("sml") != -1) {
			ajaxUrl = eastcom.baseURL + configUrl_main.query + "/" + xialaType;
		} else {
			ajaxUrl = eastcom.baseURL + configUrl_main.query;
		};
		//------------------------------------------------
		$.ajax({
			url: ajaxUrl,
			//url :eastcom.baseURL+configUrl_main.query+"/"+xialaType ,
			// url :eastcom.baseURL+"/srpt/rcpt/common/query" ,
			type: 'POST',
			async: false,
			dataType: "json",
			contentType: "application/json",
			data: dataStr,
			success: function(data) {
				datas = data.data;
			}
		});
		// };

		var innerHTML = '' +
			'<span style="display:inline-block;min-width:65px;white-space:nowrap">' + zujianLabel + ':</span>' +
			'<select id="qry_' + count + '" style="width:150px;margin-right: 4px; height:34px">';
		var dataArr = [] //[{},{}]
		for (var item in datas) {
			var key_id = "";
			var key_name = "";
			var i = 0;
			var j = 0;
			if (i < 1) {
				$.each(datas[item], function(key, val) {
					if (j == 0) {
						key_id = key;
					};
					if (j == 1) {
						key_name = key;
					};
					j++;
				});
				i++;
			};

			//innerHTML +='<option value="'+datas[item][key_id]+'">'+datas[item][key_name]+'</option>' ;   
			dataArr.push(datas[item]);
		};
		var datasArr = sorts(dataArr);
		for (var qq = 0; qq < datasArr.length; qq++) {
			var valueS = datasArr[qq][key_id] == "-" ? "" : datasArr[qq][key_id];
			innerHTML += '<option value="' + valueS + '">' + datasArr[qq][key_name] + '</option>';
		};

		innerHTML += '</select>' +
			'<span style="margin-left:20px">是否必填:</span><input id="checkbox" type="checkbox" style="margin-right: 19px;" />' +
			'' +
			'<a href="JavaScript:void(0)" onclick="addReport.delZujian(this)" ><img style="width: 34px; height: 34px ;margin-left: 40px;"  src="../../static/reportManageSys/images/closehong.png"></a>' +
			'<p style="display:none">{label:"' + zujianLabel + '",type:"select",id:"qry_' + count + '",xialaType:"' + xialaType + '"}</p>';
		return innerHTML;

	},
	getfuxuankuang_old: function(zujianLabel, count, xialaType) {
		var datas = "";
		//if( xialaType=="area-enum-area"){
		var data = {
			"ifId": xialaType
		}; //地市参数
		var dataStr = JSON.stringify(data);
		//------------------------------------------------
		var ajaxUrl = "";
		var query = configUrl_main.query;
		if (query.indexOf("sml") != -1) {
			ajaxUrl = eastcom.baseURL + configUrl_main.query + "/" + xialaType;
		} else {
			ajaxUrl = eastcom.baseURL + configUrl_main.query;
		};
		//------------------------------------------------
		$.ajax({
			url: ajaxUrl,
			// url :eastcom.baseURL+"/srpt/rcpt/common/query" ,
			type: 'POST',
			async: false,
			dataType: "json",
			contentType: "application/json",
			data: dataStr,
			success: function(data) {
				datas = data.data;
			}
		});
		// };

		var innerHTML = '<span id="qry_' + count + '" style="border:1px solid #e8e8e8;display:inline-block;width:340px ;height: 210px;overflow: auto;">'
		if (datas == null) {
			innerHTML += '暂无数据';
		} else {
			innerHTML += '<span style="display:block;">' +
				'<input id="all_qry_' + count + '" type="checkbox"/>' +
				'<span style="margin: 0 10px 0 5px">全选</span>' +
				'</span>'
			//循环复选数据       


			for (var item in datas) {
				var key_id = "";
				var key_name = "";
				var i = 0;
				var j = 0;
				if (i < 1) {
					$.each(datas[item], function(key, val) {
						if (j == 0) {
							key_id = key;
						};
						if (j == 1) {
							key_name = key;
						};
						j++;
					});
					i++;
				};

				innerHTML += '<span style="display:block;">' +
					'<input type="checkbox" name="qry_' + count + '" value="' + datas[item][key_id] + '" />' +
					'<span style="margin: 0 10px 0 5px">' + datas[item][key_name] + '</span>' +
					'</span>';
			};
			
			innerHTML += '</span>' +
				'<span style="margin-left:20px"></span><input id="checkbox" type="checkbox" style="margin-right: 19px; display:none" />'
				//+  '<a href="JavaScript:void(0)" onclick="addReport.delZujian(this)" style="top:50%;" ><img style="width: 34px; height: 34px ;margin-left: 20px;"  src="../../static/reportManageSys/images/closehong.png"></a>' 
				+
				'<a href="JavaScript:void(0)" onclick="addReport.delZujian(this)" ><img style="width: 34px; height: 34px ;margin-left: 20px;"  src="../../static/reportManageSys/images/closehong.png"></a>' +
				'<p style="display:none">{label:"' + zujianLabel + '",type:"checkbox",id:"qry_' + count + '",xialaType:"' + xialaType + '"}</p>';
		};
		return innerHTML;

	},
	getfuxuankuang : function(zujianLabel, count,xialaType){
        var innerHTML = '' +
        	'<span id="qry_' + count + '" name="otherSpecialCondition" style="display: inline-block; border: 1px solid #e8e8e8; width: 340px;height: 104px">' +
        	'<img style="width: 100%; height: 100%;"  src="../../static/reportManageSys/images/special_fuxuankuang.png">' +
        	'</span>' +
        	'<span style="margin-left:20px"></span><input id="checkbox" type="checkbox" style="margin-right: 19px; display:none" />' +
        	'<a href="JavaScript:void(0)" onclick="addReport.delZujian(this)" ><img style="width: 34px; height: 34px ;margin-left: 20px;"  src="../../static/reportManageSys/images/closehong.png"></a>' +
        	'<p style="display:none">{label:"' + zujianLabel + '",type:"checkbox",id:"qry_' + count + '",xialaType:"' + xialaType + '"}</p>';
         return innerHTML; 
	},
	getleftrightkuang: function(zujianLabel, count, xialaType) {
		var datas = "";
		// if( xialaType=="area-enum-area"){
		var data = {
			"ifId": xialaType
		}; //地市参数
		var dataStr = JSON.stringify(data);
		//------------------------------------------------
		var ajaxUrl = "";
		var query = configUrl_main.query;
		if (query.indexOf("sml") != -1) {
			ajaxUrl = eastcom.baseURL + configUrl_main.query + "/" + xialaType;
		} else {
			ajaxUrl = eastcom.baseURL + configUrl_main.query;
		};
		//------------------------------------------------
		$.ajax({
			url: ajaxUrl,
			// url :eastcom.baseURL+"/srpt/rcpt/common/query" ,
			type: 'POST',
			async: false,
			dataType: "json",
			contentType: "application/json",
			data: dataStr,
			success: function(data) {
				datas = data.data;
			}
		});
		// };




		var innerHTML = '<span id="qry_' + count + '" name="otherSpecialCondition" style="display: inline-block; border: 0px solid #e8e8e8; width: 340px;height: 210px">' +
			'<span style="display: block;float: left;border: 1px solid #e8e8e8;width: 145px;min-height: 208px;height: 208px;overflow: auto; -moz-user-select:none;" onselectstart="return false;">' +
			'<span id="list_left">';
		var m = 0;
		for (var item in datas) {
			var key_id = "";
			var key_name = "";
			var i = 0;
			var j = 0;
			if (i < 1) {
				$.each(datas[item], function(key, val) {
					if (j == 0) {
						key_id = key;
					};
					if (j == 1) {
						key_name = key;
					};
					j++;
				});
				i++;
			};

			innerHTML += '<span id="' + m + '" avalue="' + datas[item][key_id] + '">' + datas[item][key_name] + '</span>'
			m++;
		};
		/*for(var item in datas){
		        innerHTML +=  '<span id="'+m+'" avalue="'+datas[item].id+'">'+datas[item].name+'</span>' 
		         m++; 
		};*/
		innerHTML += '</span>' +
			'<input type="text" id="list_left_input" style="width:166px ;display:none" /> ' +
			'</span>' +
			'<span style="display: block;float: left;border: 0px solid #e8e8e8; padding-top:6px;width: 60px;min-height: 208px;height: 208px;overflow: auto;">' +
			'<center>' +
			'<button class="btn btn-success btn-sm" href="#" onclick="checkAll()" >全选</button><br/><br/>' +
			'<button class="btn btn-success btn-sm" href="#" onclick="checkPart()" >添加</button><br/><br/>' +
			'<button class="btn btn-success btn-sm" href="#" onclick="delPart()" >删除</button><br/><br/>' +
			'<button class="btn btn-success btn-sm" href="#" onclick="delAll()" >全删</button><br/><br/>' +
			'</center>' +
			'</span>' +
			'<span style="display: block;float: left;border: 1px solid #e8e8e8;width: 133px;min-height: 208px;height: 208px;overflow: auto;-moz-user-select:none;" onselectstart="return false;">' +
			'<span id="list_right">';

		var n = 0;
		for (var item in datas) {
			var key_id = "";
			var key_name = "";
			var i = 0;
			var j = 0;
			if (i < 1) {
				$.each(datas[item], function(key, val) {
					if (j == 0) {
						key_id = key;
					};
					if (j == 1) {
						key_name = key;
					};
					j++;
				});
				i++;
			};

			//innerHTML +='<option value="'+datas[item][key_id]+'">'+datas[item][key_name]+'</option>' ;   
			innerHTML += '<span id="' + n + '" avalue="' + datas[item][key_id] + '" style="display:none">' + datas[item][key_name] + '</span>'
			n++;
		};
		/*for(var item in datas){
		        innerHTML +=  '<span id="'+n+'"  avalue="'+datas[item].id+'" style="display:none">'+datas[item].name+'</span>' 
		         n++; 
		};  */

		innerHTML += '</span>' +
			'<input type="text" id="list_right_input" style="width:166px ;display:none" /> ' +
			'</span>' +
			'</span>' +
			'<span style="margin-left:20px"></span><input id="checkbox" type="checkbox" style="margin-right: 19px; display:none" />' +
			'<a href="JavaScript:void(0)" onclick="addReport.delZujian(this)" style="top:50%;" ><img style="width: 34px; height: 34px ;margin-left: 20px;"  src="../../static/reportManageSys/images/closehong.png"></a>' +
			'<p style="display:none">{label:"' + zujianLabel + '",type:"leftRight",id:"qry_' + count + '",xialaType:"' + xialaType + '"}</p>';

		return innerHTML;

	},
	getleftrightliandong: function(zujianLabel, count, xialaType) {
		var datas = "";
		// if( xialaType=="area-enum-area"){
		var data = {
			"ifId": xialaType
		}; //地市参数
		var dataStr = JSON.stringify(data);
		//------------------------------------------------
		var ajaxUrl = "";
		var query = configUrl_main.query;
		if (query.indexOf("sml") != -1) {
			ajaxUrl = eastcom.baseURL + configUrl_main.query + "/" + xialaType;
		} else {
			ajaxUrl = eastcom.baseURL + configUrl_main.query;
		};
		//------------------------------------------------
		$.ajax({
			url: ajaxUrl,
			//url :eastcom.baseURL+"/srpt/rcpt/common/query" ,
			type: 'POST',
			async: false,
			dataType: "json",
			contentType: "application/json",
			data: dataStr,
			success: function(data) {
				datas = data.data;
			}
		});
		// };
		//-------------------------------------------------- 
		var innerHTML = '<span id="qry_' + count + '" name="otherSpecialCondition" style="display: inline-block; border: 0px solid #e8e8e8; width: 340px;height: 210px">' +
			'<span style="display: block;float: left;border: 1px solid #e8e8e8;width: 185px;min-height: 208px;height: 208px;overflow: auto; -moz-user-select:none;" onselectstart="return false;">' +
			'<span>'
		var m = 0;
		for (var item in datas) {
			var key_id = "";
			var key_name = "";
			var i = 0;
			var j = 0;
			if (i < 1) {
				$.each(datas[item], function(key, val) {
					if (j == 0) {
						key_id = key;
					};
					if (j == 1) {
						key_name = key;
					};
					j++;
				});
				i++;
			};

			innerHTML += '<span id="' + m + '" avalue="' + datas[item][key_id] + '" style="display: block;">' + datas[item][key_name] + '</span>'
			m++;
		};
		/* for(var item in datas){
		         innerHTML +=  '<span id="'+m+'" avalue="'+datas[item].id+'" style="display: block;">'+datas[item].name+'</span>' 
		          m++; 
		 };*/
		innerHTML += '</span>' +
			'</span>' +
			'<span style="margin-left:20px;display: block;float: left;border: 1px solid #e8e8e8;width: 133px;min-height: 208px;height: 208px;overflow: auto;-moz-user-select:none;" onselectstart="return false;">' +
			'<span>';

		var j = 0;
		for (var item in datas) {
			innerHTML += '<span id="' + j + '"  avalue="' + datas[item].id + '" style="display:none">' + datas[item].name + '</span>'
			j++;
		};

		innerHTML += '</span>' +
			'</span>' +
			'</span>' +
			'<span style="margin-left:20px"></span><input id="checkbox" type="checkbox" style="margin-right: 19px; display:none" />' +
			'<a href="JavaScript:void(0)" onclick="addReport.delZujian(this)" style="top:50%;" ><img style="width: 34px; height: 34px ;margin-left: 20px;"  src="../../static/reportManageSys/images/closehong.png"></a>' +
			'<p style="display:none">{label:"' + zujianLabel + '",type:"leftrightliandong",id:"qry_' + count + '",xialaType:"' + xialaType + '"}</p>';

		return innerHTML;

	},
	getdemoselect: function(zujianLabel, count) {
		var innerHTML = '' +
			'<span id="qry_' + count + '" name="otherSpecialCondition" style="display: inline-block; border: 1px solid #e8e8e8; width: 340px;height: 80px">' +
			'<img style="width: 44px; height: 62px ;margin-left: 20px;margin-top: 10px;"  src="../../static/reportManageSys/images/wenben_demo_wu.png">' +
			'<img style="width: 44px; height: 62px ;margin-left: 20px;margin-top: 10px;"  src="../../static/reportManageSys/images/wenben_demo_wu.png">' +
			'<img style="width: 44px; height: 62px ;margin-left: 20px;margin-top: 10px;"  src="../../static/reportManageSys/images/wenben_demo_wu.png">' +
			'<img style="width: 44px; height: 62px ;margin-left: 20px;margin-top: 10px;"  src="../../static/reportManageSys/images/wenben_demo_wu.png">' +
			'<img style="width: 44px; height: 62px ;margin-left: 20px;margin-top: 10px;"  src="../../static/reportManageSys/images/wenben_demo_wu.png">' +
			'</span>' +
			'<span style="margin-left:20px"></span><input id="checkbox" type="checkbox" style="margin-right: 19px; display:none" />' +
			'<a href="JavaScript:void(0)" onclick="addReport.delZujian(this)" ><img style="width: 34px; height: 34px ;margin-left: 20px;"  src="../../static/reportManageSys/images/closehong.png"></a>' +
			'<p style="display:none">{label:"' + zujianLabel + '",type:"demoselect",id:"qry_' + count + '"}</p>';
		/*+  '<span style="display:inline-block;width:65px">'+zujianLabel+':</span><input id="qry_'+count+'" type="text" style="width:150px;height:34px" /> '
		+  '<span style="margin-left:20px">是否必填:</span><input id="checkbox" type="checkbox" style="margin-right: 19px;" />'
		+  '<a href="JavaScript:void(0)" onclick="addReport.delZujian(this)" ><img style="width: 34px; height: 34px ;margin-left: 20px;"  src="../../static/reportManageSys/images/closehong.png"></a>' 
		+  '<p style="display:none">{label:"'+zujianLabel+'",type:"text",id:"qry_'+count+'"}</p>'; */

		return innerHTML;
	},
	getconvergeCheckbox: function(zujianLabel, count,xialaType) {
		var innerHTML = '' +
			'<span id="qry_' + count + '" name="otherSpecialCondition" style="display: inline-block; border: 1px solid #e8e8e8; width: 340px;height: 104px">' +
			'<img style="width: 100%; height: 100%;"  src="../../static/reportManageSys/images/special_convergeCheckbox.png">' +
			'</span>' +
			'<span style="margin-left:20px"></span><input id="checkbox" type="checkbox" style="margin-right: 19px; display:none" />' +
			'<a href="JavaScript:void(0)" onclick="addReport.delZujian(this)" ><img style="width: 34px; height: 34px ;margin-left: 20px;"  src="../../static/reportManageSys/images/closehong.png"></a>' +
			'<p style="display:none">{label:"' + zujianLabel + '",type:"convergeCheckbox",id:"qry_' + count + '",xialaType:"' + xialaType + '"}</p>';
		/*+  '<span style="display:inline-block;width:65px">'+zujianLabel+':</span><input id="qry_'+count+'" type="text" style="width:150px;height:34px" /> '
		+  '<span style="margin-left:20px">是否必填:</span><input id="checkbox" type="checkbox" style="margin-right: 19px;" />'
		+  '<a href="JavaScript:void(0)" onclick="addReport.delZujian(this)" ><img style="width: 34px; height: 34px ;margin-left: 20px;"  src="../../static/reportManageSys/images/closehong.png"></a>' 
		+  '<p style="display:none">{label:"'+zujianLabel+'",type:"text",id:"qry_'+count+'"}</p>'; */

		return innerHTML;
	},
	getconvergeCheckboxDetail: function(zujianLabel, count,xialaType) {
		var innerHTML = '' +
			'<span id="qry_' + count + '" name="otherSpecialCondition" style="display: inline-block; border: 1px solid #e8e8e8; width: 340px;height: 104px">' +
			'<img style="width: 100%; height: 100%;"  src="../../static/reportManageSys/images/special_convergeCheckboxDetail.png">' +
			'</span>' +
			'<span style="margin-left:20px"></span><input id="checkbox" type="checkbox" style="margin-right: 19px; display:none" />' +
			'<a href="JavaScript:void(0)" onclick="addReport.delZujian(this)" ><img style="width: 34px; height: 34px ;margin-left: 20px;"  src="../../static/reportManageSys/images/closehong.png"></a>' +
			'<p style="display:none">{label:"' + zujianLabel + '",type:"convergeCheckboxDetail",id:"qry_' + count + '",xialaType:"' + xialaType + '"}</p>';
		 return innerHTML;
	},
	getdemoselectNew : function(zujianLabel, count){
        var innerHTML = '' +
        	'<span id="qry_' + count + '" name="otherSpecialCondition" style="display: inline-block; border: 1px solid #e8e8e8; width: 340px;height: 104px">' +
        	'<img style="width: 100%; height: 100%;"  src="../../static/reportManageSys/images/special_demoselectNew.png">' +
        	'</span>' +
        	'<span style="margin-left:20px"></span><input id="checkbox" type="checkbox" style="margin-right: 19px; display:none" />' +
        	'<a href="JavaScript:void(0)" onclick="addReport.delZujian(this)" ><img style="width: 34px; height: 34px ;margin-left: 20px;"  src="../../static/reportManageSys/images/closehong.png"></a>' +
        	'<p style="display:none">{label:"' + zujianLabel + '",type:"demoselectNew",id:"qry_' + count + '"}</p>';
         return innerHTML; 
	},
	getconditionToDevice : function(zujianLabel, count){
        var innerHTML = '' +
        	'<span id="qry_' + count + '" name="otherSpecialCondition" style="display: inline-block; border: 1px solid #e8e8e8; width: 340px;height: 104px">' +
        	'<img style="width: 100%; height: 100%;"  src="../../static/reportManageSys/images/special_conditionToDevice.png">' +
        	'</span>' +
        	'<span style="margin-left:20px"></span><input id="checkbox" type="checkbox" style="margin-right: 19px; display:none" />' +
        	'<a href="JavaScript:void(0)" onclick="addReport.delZujian(this)" ><img style="width: 34px; height: 34px ;margin-left: 20px;"  src="../../static/reportManageSys/images/closehong.png"></a>' +
        	'<p style="display:none">{label:"' + zujianLabel + '",type:"conditionToDevice",id:"qry_' + count + '"}</p>';
         return innerHTML; 
	},
	getconditionToPort : function(zujianLabel, count){
        var innerHTML = '' +
        	'<span id="qry_' + count + '" name="otherSpecialCondition" style="display: inline-block; border: 1px solid #e8e8e8; width: 340px;height: 104px">' +
        	'<img style="width: 100%; height: 100%;"  src="../../static/reportManageSys/images/special_conditionToPort.png">' +
        	'</span>' +
        	'<span style="margin-left:20px"></span><input id="checkbox" type="checkbox" style="margin-right: 19px; display:none" />' +
        	'<a href="JavaScript:void(0)" onclick="addReport.delZujian(this)" ><img style="width: 34px; height: 34px ;margin-left: 20px;"  src="../../static/reportManageSys/images/closehong.png"></a>' +
        	'<p style="display:none">{label:"' + zujianLabel + '",type:"conditionToPort",id:"qry_' + count + '"}</p>';
         return innerHTML; 
	},
	getindexWarning : function(zujianLabel, count){
        var innerHTML = '' +
        	'<span id="qry_' + count + '" name="otherSpecialCondition" style="display: inline-block; border: 1px solid #e8e8e8; width: 340px;height: 104px">' +
        	'<img style="width: 100%; height: 100%;"  src="../../static/reportManageSys/images/special_indexWarning.png">' +
        	'</span>' +
        	'<span style="margin-left:20px"></span><input id="checkbox" type="checkbox" style="margin-right: 19px; display:none" />' +
        	'<a href="JavaScript:void(0)" onclick="addReport.delZujian(this)" ><img style="width: 34px; height: 34px ;margin-left: 20px;"  src="../../static/reportManageSys/images/closehong.png"></a>' +
        	'<p style="display:none">{label:"' + zujianLabel + '",type:"indexWarning",id:"qry_' + count + '"}</p>';
         return innerHTML; 
	},
	getbusyTimeParagraph : function(zujianLabel, count){
        var innerHTML = '' +
        	'<span id="qry_' + count + '" name="otherSpecialCondition" style="display: inline-block; border: 1px solid #e8e8e8; width: 340px;height: 104px">' +
        	'<img style="width: 100%; height: 100%;"  src="../../static/reportManageSys/images/special_busyTimeParagraph.png">' +
        	'</span>' +
        	'<span style="margin-left:20px"></span><input id="checkbox" type="checkbox" style="margin-right: 19px; display:none" />' +
        	'<a href="JavaScript:void(0)" onclick="addReport.delZujian(this)" ><img style="width: 34px; height: 34px ;margin-left: 20px;"  src="../../static/reportManageSys/images/closehong.png"></a>' +
        	'<p style="display:none">{label:"' + zujianLabel + '",type:"busyTimeParagraph",id:"qry_' + count + '"}</p>';
         return innerHTML; 
	},
	getcellList : function(zujianLabel, count){
		var innerHTML = '' +
	    	'<span id="qry_' + count + '" name="otherSpecialCondition" style="display: inline-block; border: 1px solid #e8e8e8; width: 340px;height: 104px">' +
	    	'<img style="width: 100%; height: 100%;"  src="../../static/reportManageSys/images/special_cellList.png">' +
	    	'</span>' +
	    	'<span style="margin-left:20px"></span><input id="checkbox" type="checkbox" style="margin-right: 19px; display:none" />' +
	    	'<a href="JavaScript:void(0)" onclick="addReport.delZujian(this)" ><img style="width: 34px; height: 34px ;margin-left: 20px;"  src="../../static/reportManageSys/images/closehong.png"></a>' +
	    	'<p style="display:none">{label:"' + zujianLabel + '",type:"cellList",id:"qry_' + count + '"}</p>';
         return innerHTML; 
	},
	getcomboCheckbox : function(zujianLabel, count,xialaType){
        var innerHTML = '' +
        	'<span id="qry_' + count + '" name="otherSpecialCondition" style="display: inline-block; border: 1px solid #e8e8e8; width: 340px;height: 104px">' +
        	'<img style="width: 100%; height: 100%;"  src="../../static/reportManageSys/images/special_comboCheckbox.png">' +
        	'</span>' +
        	'<span style="margin-left:20px"></span><input id="checkbox" type="checkbox" style="margin-right: 19px; display:none" />' +
        	'<a href="JavaScript:void(0)" onclick="addReport.delZujian(this)" ><img style="width: 34px; height: 34px ;margin-left: 20px;"  src="../../static/reportManageSys/images/closehong.png"></a>' +
        	'<p style="display:none">{label:"' + zujianLabel + '",type:"comboCheckbox",id:"qry_' + count + '",xialaType:"' + xialaType + '"}</p>';
         return innerHTML; 
	}
};
//还原编辑组件源  (因为第一次添加的是时候,会默认添加一个外成div,当再次还原的时候,要加上这个div)
reductionComponentSource = {
	getshurukuang: function(zujianLabel, zujianId) {
		var innerHTML = '<div style="height:50px"><span style="display:inline-block;min-width:60px;white-space:nowrap">' + zujianLabel + ':</span><input id="' + zujianId + '" type="text" style="width:150px ;height:34px" /> ' +
			'<span style="margin-left:20px">是否必填:</span><input id="checkbox" type="checkbox" style="margin-right: 19px;" />' +
			'<a href="JavaScript:void(0)" onclick="addReport.delZujian(this)" ><img style="width: 34px; height: 34px ;margin-left: 40px;"  src="../../static/reportManageSys/images/closehong.png"></a>' +
			'<p style="display:none">{label:"' + zujianLabel + '",type:"text",id:"' + zujianId + '"}</p>' +
			'</div>';
		return innerHTML;
	},
	getxialakuang: function(zujianLabel, zujianId, xialaType) {
		var datas = "";
		var data = {
			"ifId": xialaType
		}; //地市参数
		var dataStr = JSON.stringify(data);
		//------------------------------------------------
		var ajaxUrl = "";
		var query = configUrl_main.query;
		if (query.indexOf("sml") != -1) {
			ajaxUrl = eastcom.baseURL + configUrl_main.query + "/" + xialaType;
		} else {
			ajaxUrl = eastcom.baseURL + configUrl_main.query;
		};
		//------------------------------------------------
		$.ajax({
			url: ajaxUrl,
			//url :eastcom.baseURL+"/srpt/rcpt/common/query" ,
			type: 'POST',
			async: false,
			dataType: "json",
			contentType: "application/json",
			data: dataStr,
			success: function(data) {
				datas = data.data;
			}
		});

		var innerHTML = '<div style="height:50px"><span style="display:inline-block;min-width:65px;white-space:nowrap">' + zujianLabel + ':</span>' +
			'<select id="' + zujianId + '" style="width:150px;margin-right: 4px ;height:34px">';
		var dataArr = [] //[{},{}]
		for (var item in datas) {
			var key_id = "";
			var key_name = "";
			var i = 0;
			var j = 0;
			if (i < 1) {
				$.each(datas[item], function(key, val) {
					if (j == 0) {
						key_id = key;
					};
					if (j == 1) {
						key_name = key;
					};
					j++;
				});
				i++;
			};

			//innerHTML +='<option value="'+datas[item][key_id]+'">'+datas[item][key_name]+'</option>' ;
			dataArr.push(datas[item]);
		};

		var datasArr = sorts(dataArr);
		for (var qq = 0; qq < datasArr.length; qq++) {
			var valueS = datasArr[qq][key_id] == "-" ? "" : datasArr[qq][key_id];
			innerHTML += '<option value="' + valueS + '">' + datasArr[qq][key_name] + '</option>';
		};
		innerHTML += '</select>' +
			'<span style="margin-left:20px">是否必填:</span><input id="checkbox" type="checkbox" style="margin-right: 19px;" />' +
			'<a href="JavaScript:void(0)" onclick="addReport.delZujian(this)" ><img style="width: 34px; height: 34px ;margin-left: 40px;"  src="../../static/reportManageSys/images/closehong.png"></a>' +
			'<p style="display:none">{label:"' + zujianLabel + '",type:"select",id:"' + zujianId + '",xialaType:"' + xialaType + '"}</p>' +
			'</div>';
		return innerHTML;
	},
	getfuxuankuang_old: function(zujianLabel, zujianId, xialaType) {
		var datas = "";
		var data = {
			"ifId": xialaType
		}; //地市参数
		var dataStr = JSON.stringify(data);
		//------------------------------------------------
		var ajaxUrl = "";
		var query = configUrl_main.query;
		if (query.indexOf("sml") != -1) {
			ajaxUrl = eastcom.baseURL + configUrl_main.query + "/" + xialaType;
		} else {
			ajaxUrl = eastcom.baseURL + configUrl_main.query;
		};
		//------------------------------------------------
		$.ajax({
			url: ajaxUrl,
			//url :eastcom.baseURL+"/srpt/rcpt/common/query" ,
			type: 'POST',
			async: false,
			dataType: "json",
			contentType: "application/json",
			data: dataStr,
			success: function(data) {
				datas = data.data;
			}
		});

		var innerHTML = '<div style="width:100%;height:83%"><span id="' + zujianId + '" style="border:1px solid #e8e8e8;display:inline-block;width:340px ;height: 210px;overflow: auto;">'
		if (datas == null) {
			innerHTML += '暂无数据' +
				'</span>' +
				'</div>';

		} else {
			innerHTML += '<span style="display:block;">' +
				'<input id="all_' + zujianId + '" type="checkbox"/>' +
				'<span style="margin: 0 10px 0 5px">全选</span>' +
				'</span>';
			//循环复选数据   
			for (var item in datas) {
				var key_id = "";
				var key_name = "";
				var i = 0;
				var j = 0;
				if (i < 1) {
					$.each(datas[item], function(key, val) {
						if (j == 0) {
							key_id = key;
						};
						if (j == 1) {
							key_name = key;
						};
						j++;
					});
					i++;
				};

				innerHTML += '<span style="display:block;">' +
					'<input type="checkbox" name="' + zujianId + '" value="' + datas[item][key_id] + '" />' +
					'<span style="margin: 0 10px 0 5px">' + datas[item][key_name] + '</span>' +
					'</span>';
			};
			/*for(var item in datas){
			  innerHTML +='<span style="display:block;">'
			            +     '<input type="checkbox" name="'+zujianId+'" value="'+datas[item].id+'" />'
			            +     '<span style="margin: 0 10px 0 5px">'+datas[item].name+'</span>'
			            + '</span>'
			} ;*/
			innerHTML += '</span>' +
				'<span style="margin-left:20px"></span><input id="checkbox" type="checkbox" style="margin-right: 19px; display:none" />'
				//+  '<a href="JavaScript:void(0)" onclick="addReport.delZujian(this)" style="top:50%;" ><img style="width: 34px; height: 34px ;margin-left: 20px;"  src="../../static/reportManageSys/images/closehong.png"></a>' 
				+
				'<a href="JavaScript:void(0)" onclick="addReport.delZujian(this)" ><img style="width: 34px; height: 34px ;margin-left: 20px;"  src="../../static/reportManageSys/images/closehong.png"></a>' +
				'<p style="display:none">{label:"' + zujianLabel + '",type:"checkbox",id:"' + zujianId + '",xialaType:"' + xialaType + '"}</p>' +
				'</div>';
		};
		return innerHTML;

	},
	getfuxuankuang : function(zujianLabel, zujianId, xialaType){
        var innerHTML = '' +
			'<div style="width:100%;height:45%"><span id="' + zujianId + '" name="otherSpecialCondition" style="display: inline-block; border: 1px solid #e8e8e8; width: 340px;height: 104px">' +
			'<img style="width: 100%; height: 100%;"  src="../../static/reportManageSys/images/special_fuxuankuang.png">' +
			'</span>' +
			'<span style="margin-left:20px"></span><input id="checkbox" type="checkbox" style="margin-right: 19px; display:none" />' +
			'<a href="JavaScript:void(0)" onclick="addReport.delZujian(this)" ><img style="width: 34px; height: 34px ;margin-left: 20px;"  src="../../static/reportManageSys/images/closehong.png"></a>' +
			'<p style="display:none">{label:"' + zujianLabel + '",type:"checkbox",id:"' + zujianId + '",xialaType:"' + xialaType + '"}</p>' +
			'</div>';
		return innerHTML;
	},
	getleftrightkuang: function(zujianLabel, zujianId, xialaType) {
		var datas = "";
		var data = {
			"ifId": xialaType
		}; //地市参数
		var dataStr = JSON.stringify(data);
		//------------------------------------------------
		var ajaxUrl = "";
		var query = configUrl_main.query;
		if (query.indexOf("sml") != -1) {
			ajaxUrl = eastcom.baseURL + configUrl_main.query + "/" + xialaType;
		} else {
			ajaxUrl = eastcom.baseURL + configUrl_main.query;
		};
		//------------------------------------------------
		$.ajax({
			url: ajaxUrl,
			//url :eastcom.baseURL+"/srpt/rcpt/common/query" ,
			type: 'POST',
			async: false,
			dataType: "json",
			contentType: "application/json",
			data: dataStr,
			success: function(data) {
				datas = data.data;
			}
		});



		var innerHTML = '<div style="width:100%;height:83%"><span id="' + zujianId + '" name="otherSpecialCondition" style="display: inline-block; border: 0px solid #e8e8e8; width: 340px;height: 210px">' +
			'<span style="display: block;float: left;border: 1px solid #e8e8e8;width: 145px;min-height: 208px;height: 208px;overflow: auto; -moz-user-select:none;" onselectstart="return false;">' +
			'<span id="list_left">'
		var m = 0;
		for (var item in datas) {
			var key_id = "";
			var key_name = "";
			var i = 0;
			var j = 0;
			if (i < 1) {
				$.each(datas[item], function(key, val) {
					if (j == 0) {
						key_id = key;
					};
					if (j == 1) {
						key_name = key;
					};
					j++;
				});
				i++;
			};

			innerHTML += '<span id="' + m + '" avalue="' + datas[item][key_id] + '">' + datas[item][key_name] + '</span>'
			m++;
		};
		/*var i = 0;
		for(var item in datas){
		        innerHTML +=  '<span id="'+i+'" avalue="'+datas[item].id+'">'+datas[item].name+'</span>' 
		         i++; 
		};*/
		innerHTML += '</span>' +
			'<input type="text" id="list_left_input" style="width:166px ;display:none" /> ' +
			'</span>' +
			'<span style="display: block;float: left;border: 0px solid #e8e8e8; padding-top:6px;width: 60px;min-height: 208px;height: 208px;overflow: auto;">' +
			'<center>' +
			'<button class="btn btn-success btn-sm" href="#" onclick="checkAll()" >全选</button><br/><br/>' +
			'<button class="btn btn-success btn-sm" href="#" onclick="checkPart()" >添加</button><br/><br/>' +
			'<button class="btn btn-success btn-sm" href="#" onclick="delPart()" >删除</button><br/><br/>' +
			'<button class="btn btn-success btn-sm" href="#" onclick="delAll()" >全删</button><br/><br/>' +
			'</center>' +
			'</span>' +
			'<span style="display: block;float: left;border: 1px solid #e8e8e8;width: 133px;min-height: 208px;height: 208px;overflow: auto;-moz-user-select:none;" onselectstart="return false;">' +
			'<span id="list_right">';
		var n = 0;
		for (var item in datas) {
			var key_id = "";
			var key_name = "";
			var i = 0;
			var j = 0;
			if (i < 1) {
				$.each(datas[item], function(key, val) {
					if (j == 0) {
						key_id = key;
					};
					if (j == 1) {
						key_name = key;
					};
					j++;
				});
				i++;
			};

			//innerHTML +='<option value="'+datas[item][key_id]+'">'+datas[item][key_name]+'</option>' ;   
			innerHTML += '<span id="' + n + '" avalue="' + datas[item][key_id] + '" style="display:none">' + datas[item][key_name] + '</span>'
			n++;
		};
		/*var j = 0;
		for(var item in datas){
		        innerHTML +=  '<span id="'+j+'"  avalue="'+datas[item].id+'" style="display:none">'+datas[item].name+'</span>' 
		         j++; 
		};  */

		innerHTML += '</span>' +
			'<input type="text" id="list_right_input" style="width:166px ;display:none" /> ' +
			'</span>' +
			'</span>' +
			'<span style="margin-left:20px"></span><input id="checkbox" type="checkbox" style="margin-right: 19px; display:none" />' +
			'<a href="JavaScript:void(0)" onclick="addReport.delZujian(this)" style="top:50%;" ><img style="width: 34px; height: 34px ;margin-left: 20px;"  src="../../static/reportManageSys/images/closehong.png"></a>' +
			'<p style="display:none">{label:"' + zujianLabel + '",type:"leftRight",id:"' + zujianId + '",xialaType:"' + xialaType + '"}</p>' +
			'</div>';
		return innerHTML;

	},
	getleftrightliandong: function(zujianLabel, count, xialaType) {
		var datas = "";
		var data = {
			"ifId": xialaType
		}; //地市参数
		var dataStr = JSON.stringify(data);
		//------------------------------------------------
		var ajaxUrl = "";
		var query = configUrl_main.query;
		if (query.indexOf("sml") != -1) {
			ajaxUrl = eastcom.baseURL + configUrl_main.query + "/" + xialaType;
		} else {
			ajaxUrl = eastcom.baseURL + configUrl_main.query;
		};
		//------------------------------------------------
		$.ajax({
			url: ajaxUrl,
			//url :eastcom.baseURL+"/srpt/rcpt/common/query" ,
			type: 'POST',
			async: false,
			dataType: "json",
			contentType: "application/json",
			data: dataStr,
			success: function(data) {
				datas = data.data;
			}
		});
		//-------------------------------------------------- 
		var innerHTML = '<div style="width:100%;height:83%"><span id="qry_' + count + '" name="otherSpecialCondition" style="display: inline-block; border: 0px solid #e8e8e8; width: 340px;height: 210px">' +
			'<span style="display: block;float: left;border: 1px solid #e8e8e8;width: 185px;min-height: 208px;height: 208px;overflow: auto; -moz-user-select:none;" onselectstart="return false;">' +
			'<span>';
		var m = 0;
		for (var item in datas) {
			var key_id = "";
			var key_name = "";
			var i = 0;
			var j = 0;
			if (i < 1) {
				$.each(datas[item], function(key, val) {
					if (j == 0) {
						key_id = key;
					};
					if (j == 1) {
						key_name = key;
					};
					j++;
				});
				i++;
			};

			innerHTML += '<span id="' + m + '" avalue="' + datas[item][key_id] + '" style="display: block;">' + datas[item][key_name] + '</span>'
			m++;
		};
		/*var i = 0;
		for(var item in datas){
		        innerHTML +=  '<span id="'+i+'" avalue="'+datas[item].id+'" style="display: block;">'+datas[item].name+'</span>' 
		         i++; 
		};*/
		innerHTML += '</span>' +
			'</span>'

			+
			'<span style="margin-left:20px;display: block;float: left;border: 1px solid #e8e8e8;width: 133px;min-height: 208px;height: 208px;overflow: auto;-moz-user-select:none;" onselectstart="return false;">' +
			'<span>';

		var j = 0;
		for (var item in datas) {
			innerHTML += '<span id="' + j + '"  avalue="' + datas[item].id + '" style="display:none">' + datas[item].name + '</span>'
			j++;
		};

		innerHTML += '</span>' +
			'</span>' +
			'</span>' +
			'<span style="margin-left:20px"></span><input id="checkbox" type="checkbox" style="margin-right: 19px; display:none" />' +
			'<a href="JavaScript:void(0)" onclick="addReport.delZujian(this)" style="top:50%;" ><img style="width: 34px; height: 34px ;margin-left: 20px;"  src="../../static/reportManageSys/images/closehong.png"></a>' +
			'<p style="display:none">{label:"' + zujianLabel + '",type:"leftrightliandong",id:"qry_' + count + '",xialaType:"' + xialaType + '"}</p>' +
			'</div>';

		return innerHTML;

	},
	getdemoselect: function(zujianLabel, zujianId) {
		var innerHTML = '' +
			'<div style="width:100%;height:34%"><span id="' + zujianId + '" name="otherSpecialCondition" style="display: inline-block; border: 1px solid #e8e8e8; width: 340px;height: 80px">' +
			'<img style="width: 44px; height: 62px ;margin-left: 20px;margin-top: 10px;"  src="../../static/reportManageSys/images/wenben_demo_wu.png">' +
			'<img style="width: 44px; height: 62px ;margin-left: 20px;margin-top: 10px;"  src="../../static/reportManageSys/images/wenben_demo_wu.png">' +
			'<img style="width: 44px; height: 62px ;margin-left: 20px;margin-top: 10px;"  src="../../static/reportManageSys/images/wenben_demo_wu.png">' +
			'<img style="width: 44px; height: 62px ;margin-left: 20px;margin-top: 10px;"  src="../../static/reportManageSys/images/wenben_demo_wu.png">' +
			'<img style="width: 44px; height: 62px ;margin-left: 20px;margin-top: 10px;"  src="../../static/reportManageSys/images/wenben_demo_wu.png">' +
			'</span>' +
			'<span style="margin-left:20px"></span><input id="checkbox" type="checkbox" style="margin-right: 19px; display:none" />' +
			'<a href="JavaScript:void(0)" onclick="addReport.delZujian(this)" ><img style="width: 34px; height: 34px ;margin-left: 20px;"  src="../../static/reportManageSys/images/closehong.png"></a>' +
			'<p style="display:none">{label:"' + zujianLabel + '",type:"demoselect",id:"' + zujianId + '"}</p>' +
			'</div>';

		return innerHTML;
	},
	getconvergeCheckbox: function(zujianLabel, zujianId,xialaType) {
		var innerHTML = '' +
			'<div style="width:100%;height:45%"><span id="' + zujianId + '" name="otherSpecialCondition" style="display: inline-block; border: 1px solid #e8e8e8; width: 340px;height: 104px">' +
			'<img style="width: 100%; height: 100%;"  src="../../static/reportManageSys/images/special_convergeCheckbox.png">' +
			'</span>' +
			'<span style="margin-left:20px"></span><input id="checkbox" type="checkbox" style="margin-right: 19px; display:none" />' +
			'<a href="JavaScript:void(0)" onclick="addReport.delZujian(this)" ><img style="width: 34px; height: 34px ;margin-left: 20px;"  src="../../static/reportManageSys/images/closehong.png"></a>' +
			'<p style="display:none">{label:"' + zujianLabel + '",type:"convergeCheckbox",id:"' + zujianId + '",xialaType:"' + xialaType + '"}</p>' +
			'</div>';

		return innerHTML;
	},
	getconvergeCheckboxDetail: function(zujianLabel, zujianId,xialaType) {
		var innerHTML = '' +
			'<div style="width:100%;height:45%"><span id="' + zujianId + '" name="otherSpecialCondition" style="display: inline-block; border: 1px solid #e8e8e8; width: 340px;height: 104px">' +
			'<img style="width: 100%; height: 100%;"  src="../../static/reportManageSys/images/special_convergeCheckboxDetail.png">' +
			'</span>' +
			'<span style="margin-left:20px"></span><input id="checkbox" type="checkbox" style="margin-right: 19px; display:none" />' +
			'<a href="JavaScript:void(0)" onclick="addReport.delZujian(this)" ><img style="width: 34px; height: 34px ;margin-left: 20px;"  src="../../static/reportManageSys/images/closehong.png"></a>' +
			'<p style="display:none">{label:"' + zujianLabel + '",type:"convergeCheckboxDetail",id:"' + zujianId + '",xialaType:"' + xialaType + '"}</p>' +
			'</div>';
		return innerHTML;
	},
	getdemoselectNew : function(zujianLabel, zujianId){
		var innerHTML = '' +
			'<div style="width:100%;height:45%"><span id="' + zujianId + '" name="otherSpecialCondition" style="display: inline-block; border: 1px solid #e8e8e8; width: 340px;height: 104px">' +
			'<img style="width: 100%; height: 100%;"  src="../../static/reportManageSys/images/special_demoselectNew.png">' +
			'</span>' +
			'<span style="margin-left:20px"></span><input id="checkbox" type="checkbox" style="margin-right: 19px; display:none" />' +
			'<a href="JavaScript:void(0)" onclick="addReport.delZujian(this)" ><img style="width: 34px; height: 34px ;margin-left: 20px;"  src="../../static/reportManageSys/images/closehong.png"></a>' +
			'<p style="display:none">{label:"' + zujianLabel + '",type:"demoselectNew",id:"' + zujianId + '"}</p>' +
			'</div>';
		return innerHTML;
	},
	getconditionToDevice : function(zujianLabel, zujianId){
		var innerHTML = '' +
			'<div style="width:100%;height:45%"><span id="' + zujianId + '" name="otherSpecialCondition" style="display: inline-block; border: 1px solid #e8e8e8; width: 340px;height: 104px">' +
			'<img style="width: 100%; height: 100%;"  src="../../static/reportManageSys/images/special_conditionToDevice.png">' +
			'</span>' +
			'<span style="margin-left:20px"></span><input id="checkbox" type="checkbox" style="margin-right: 19px; display:none" />' +
			'<a href="JavaScript:void(0)" onclick="addReport.delZujian(this)" ><img style="width: 34px; height: 34px ;margin-left: 20px;"  src="../../static/reportManageSys/images/closehong.png"></a>' +
			'<p style="display:none">{label:"' + zujianLabel + '",type:"conditionToDevice",id:"' + zujianId + '"}</p>' +
			'</div>';
		return innerHTML;
	},
	getconditionToPort : function(zujianLabel, zujianId){
		var innerHTML = '' +
			'<div style="width:100%;height:45%"><span id="' + zujianId + '" name="otherSpecialCondition" style="display: inline-block; border: 1px solid #e8e8e8; width: 340px;height: 104px">' +
			'<img style="width: 100%; height: 100%;"  src="../../static/reportManageSys/images/special_conditionToPort.png">' +
			'</span>' +
			'<span style="margin-left:20px"></span><input id="checkbox" type="checkbox" style="margin-right: 19px; display:none" />' +
			'<a href="JavaScript:void(0)" onclick="addReport.delZujian(this)" ><img style="width: 34px; height: 34px ;margin-left: 20px;"  src="../../static/reportManageSys/images/closehong.png"></a>' +
			'<p style="display:none">{label:"' + zujianLabel + '",type:"conditionToPort",id:"' + zujianId + '"}</p>' +
			'</div>';
		return innerHTML;
	},
	getindexWarning : function(zujianLabel, zujianId){
		var innerHTML = '' +
			'<div style="width:100%;height:45%"><span id="' + zujianId + '" name="otherSpecialCondition" style="display: inline-block; border: 1px solid #e8e8e8; width: 340px;height: 104px">' +
			'<img style="width: 100%; height: 100%;"  src="../../static/reportManageSys/images/special_indexWarning.png">' +
			'</span>' +
			'<span style="margin-left:20px"></span><input id="checkbox" type="checkbox" style="margin-right: 19px; display:none" />' +
			'<a href="JavaScript:void(0)" onclick="addReport.delZujian(this)" ><img style="width: 34px; height: 34px ;margin-left: 20px;"  src="../../static/reportManageSys/images/closehong.png"></a>' +
			'<p style="display:none">{label:"' + zujianLabel + '",type:"indexWarning",id:"' + zujianId + '"}</p>' +
			'</div>';
		return innerHTML;
	},
	getbusyTimeParagraph : function(zujianLabel, zujianId){
		var innerHTML = '' +
			'<div style="width:100%;height:45%"><span id="' + zujianId + '" name="otherSpecialCondition" style="display: inline-block; border: 1px solid #e8e8e8; width: 340px;height: 104px">' +
			'<img style="width: 100%; height: 100%;"  src="../../static/reportManageSys/images/special_busyTimeParagraph.png">' +
			'</span>' +
			'<span style="margin-left:20px"></span><input id="checkbox" type="checkbox" style="margin-right: 19px; display:none" />' +
			'<a href="JavaScript:void(0)" onclick="addReport.delZujian(this)" ><img style="width: 34px; height: 34px ;margin-left: 20px;"  src="../../static/reportManageSys/images/closehong.png"></a>' +
			'<p style="display:none">{label:"' + zujianLabel + '",type:"busyTimeParagraph",id:"' + zujianId + '"}</p>' +
			'</div>';
		return innerHTML;
	},
	getcellList : function(zujianLabel, zujianId){
		var innerHTML = '' +
			'<div style="width:100%;height:45%"><span id="' + zujianId + '" name="otherSpecialCondition" style="display: inline-block; border: 1px solid #e8e8e8; width: 340px;height: 104px">' +
			'<img style="width: 100%; height: 100%;"  src="../../static/reportManageSys/images/special_cellList.png">' +
			'</span>' +
			'<span style="margin-left:20px"></span><input id="checkbox" type="checkbox" style="margin-right: 19px; display:none" />' +
			'<a href="JavaScript:void(0)" onclick="addReport.delZujian(this)" ><img style="width: 34px; height: 34px ;margin-left: 20px;"  src="../../static/reportManageSys/images/closehong.png"></a>' +
			'<p style="display:none">{label:"' + zujianLabel + '",type:"cellList",id:"' + zujianId + '"}</p>' +
			'</div>';
		return innerHTML;
	},
	getcomboCheckbox : function(zujianLabel, zujianId, xialaType){
        var innerHTML = '' +
			'<div style="width:100%;height:45%"><span id="' + zujianId + '" name="otherSpecialCondition" style="display: inline-block; border: 1px solid #e8e8e8; width: 340px;height: 104px">' +
			'<img style="width: 100%; height: 100%;"  src="../../static/reportManageSys/images/special_comboCheckbox.png">' +
			'</span>' +
			'<span style="margin-left:20px"></span><input id="checkbox" type="checkbox" style="margin-right: 19px; display:none" />' +
			'<a href="JavaScript:void(0)" onclick="addReport.delZujian(this)" ><img style="width: 34px; height: 34px ;margin-left: 20px;"  src="../../static/reportManageSys/images/closehong.png"></a>' +
			'<p style="display:none">{label:"' + zujianLabel + '",type:"comboCheckbox",id:"' + zujianId + '",xialaType:"' + xialaType + '"}</p>' +
			'</div>';
		return innerHTML;
	}
};




//还原页面组件
showComponentSource = {
	getshurukuang: function(tdWidth, label, displayflag, id, type, isRequire) {
		var innerHTML = '<td width="' + tdWidth + 'px" style="position:relative;">' +
			'<span style="display:inline-block;width:56px;">' + label + '</span>' +
			'<div style="position:absolute;top:50%;margin-top:-17px;margin-left:56px">：' +
				'<input name="' + isRequire + '" onblur="publicReport.panduanIsnull(this)"  id="' + id + '" type="' + type + '" style="width:150px ;height:34px"/>' +
				'<span style="color:red;padding-left:5px;display:' + displayflag + '">*</span>' +
			'</div>' +
			'<p style="display:none">{label:"' + label + '",type:"' + type + '",isRequire:"' + isRequire + '",id:"' + id + '"}</p>' +
			'</td>';
		return innerHTML;
	},
	getxialakuang: function(tdWidth, label, displayflag, id, type, isRequire, xialaType) {
		var xialaType = xialaType;
		var datass = "";

		var data = {
			"ifId": xialaType
		}; //地市参数
		var dataStr = JSON.stringify(data);
		//------------------------------------------------
		var ajaxUrl = "";
		var query = configUrl_main.query;
		if (query.indexOf("sml") != -1) {
			ajaxUrl = eastcom.baseURL + configUrl_main.query + "/" + xialaType;
		} else {
			ajaxUrl = eastcom.baseURL + configUrl_main.query;
		};
		//------------------------------------------------
		$.ajax({
			url: ajaxUrl,
			//url :eastcom.baseURL+"/srpt/rcpt/common/query" ,
			type: 'POST',
			async: false,
			dataType: "json",
			contentType: "application/json",
			data: dataStr,
			success: function(data) {
				datas = data.data;
			}
		});



		var innerHTML = '<td width="' + tdWidth + 'px" style="position:relative;">' +
			'<span style="display:inline-block;width:56px;">' + label + '</span>' +
			'<div style="position:absolute;top:50%;margin-top:-17px;margin-left:56px">：' +
				'<select  id="' + id + '" style="width:150px ;height:34px">';
		var dataArr = [] // [{},{}]
		for (var item in datas) {
			  if (item == "unique" || item == "remove") {continue;}; 
			var key_id = "";
			var key_name = "";
			var i = 0;
			var j = 0;
			if (i < 1) {
				$.each(datas[item], function(key, val) {
					if (j == 0) {
						key_id = key;
					};
					if (j == 1) {
						key_name = key;
					};
					j++;
				});
				i++;
			};

			//innerHTML +='<option value="'+datas[item][key_id]+'">'+datas[item][key_name]+'</option>' ;
			dataArr.push(datas[item]);
		};

		var datasArr = sorts(dataArr);
		for (var qq = 0; qq < datasArr.length; qq++) {
			var valueS = datasArr[qq][key_id] == "-" ? "" : datasArr[qq][key_id];
			innerHTML += '<option value="' + valueS + '">' + datasArr[qq][key_name] + '</option>';
		};



		innerHTML += '</select>' +
				'<span style="color:red;padding-left:5px;display:' + displayflag + '">*</span>' +
			'</div>' +
			'<p style="display:none">{label:"' + label + '",type:"' + type + '",isRequire:"' + isRequire + '",xialaType:"' + xialaType + '",id:"' + id + '"}</p>' +
			'</td>';
		return innerHTML;

	},
	getfuxuankuang: function(zujianLabel, id, type, isRequire, xialaType) {

		var datas = "";
		var data = {
			"ifId": xialaType
		}; //地市参数
		var dataStr = JSON.stringify(data);
		//------------------------------------------------
		var ajaxUrl = "";
		var query = configUrl_main.query;
		if (query.indexOf("sml") != -1) {
			ajaxUrl = eastcom.baseURL + configUrl_main.query + "/" + xialaType;
		} else {
			ajaxUrl = eastcom.baseURL + configUrl_main.query;
		};
		//------------------------------------------------
		$.ajax({
			url: ajaxUrl,
			//url :eastcom.baseURL+"/srpt/rcpt/common/query" ,
			type: 'POST',
			async: false,
			dataType: "json",
			contentType: "application/json",
			data: dataStr,
			success: function(data) {
				datas = data.data;
			}
		});
		//-----------------------------------------------------------------------

		// var innerHTML = '<span id="' + id + '" name="otherSpecialCondition" style="display:inline-block;width:95% ;border: 1px solid #e8e8e8;margin-top: 10px;">'
		// if (datas == null) {
		// 	innerHTML += '暂无数据';
		// } else {
		// 	innerHTML += '<span style="display:block;height:28px;">' +
		// 		'<input id="all_' + id + '" type="checkbox" style="margin-left:8px;" onclick="suppleMethod.allCheckBox(\'' + id + '\')"/>' +
		// 		'<span style="margin: 0 10px 0 5px">全选</span>' +
		// 		'</span>' +
		// 		'<span style="display:block;overflow: auto;height: 190px;">'; //gundong
		// 		//循环复选数据  
		// 		for (var item in datas) {
		// 			if (item == "unique" || item == "remove") {continue;}; 
		// 			var key_id = "";
		// 			var key_name = "";
		// 			var i = 0;
		// 			var j = 0;
		// 			if (i < 1) {
		// 				$.each(datas[item], function(key, val) {
		// 					if (j == 0) {
		// 						key_id = key;
		// 					};
		// 					if (j == 1) {
		// 						key_name = key;
		// 					};
		// 					j++;
		// 				});
		// 				i++;
		// 			};

		// 			innerHTML += '<span style="display:block;">' +
		// 				'<input type="checkbox" name="' + id + '" value="' + datas[item][key_id] + '" />' +
		// 				'<span style="margin: 0 10px 0 5px">' + datas[item][key_name] + '</span>' +
		// 				'</span>';
		// 		};
		// 	/*for(var item in datas){
		// 	  innerHTML +='<span style="display:block;">'
		// 	            +     '<input type="checkbox" name="'+id+'" value="'+datas[item].name+'" />'
		// 	            +     '<span style="margin: 0 10px 0 5px">'+datas[item].name+'</span>'
		// 	            + '</span>'
		// 	} ;*/
		// 	innerHTML += '</span>' //gongdong
		// 		+
		// 		'<p style="display:none">{label:"' + zujianLabel + '",type:"' + type + '",id:"' + id + '",isRequire:"' + isRequire + '",xialaType:"' + xialaType + '"}</p>' +
		// 		'</span>';
		// };
		//return innerHTML;

						var innerHTML = '<span id="' + id + '" name="otherSpecialCondition" style="padding: 10px;overflow-y:auto; display: inline-block; border: 0px solid #e8e8e8; width: 94%;margin-bottom: 5px;">';
		 //--------------------------------------------------------------------------------------------------------------------------
				            innerHTML += '<div>'    
				                      +     '<div style="height:26px;display: block;vertical-align: top;border-bottom: 1px solid #e8e8e8;">'
				                      +          '<span style="white-space: nowrap;">'+zujianLabel+':</span>'
				                      +          '<span style="float:right"><input id="all_' + id + '" type="checkbox" style="margin-left:8px;" onclick="suppleMethod.allCheckBox(\'' + id + '\')"/><span>全选</span><span>'
				                      +     '</div>'
				                      +     '<div style="display: block;">'
				                      +         '<div style="border:0px solid #e8e8e8;padding-top:5px">'
				                      +            '<div style="max-height:175px;overflow:auto">'
		                               for (var item in datas) {
		                               					if (item == "unique" || item == "remove") {continue;}; 
		                               					var key_id = "";
		                               					var key_name = "";
		                               					var i = 0;
		                               					var j = 0;
		                               					if (i < 1) {
		                               						$.each(datas[item], function(key, val) {
		                               							if (j == 0) {
		                               								key_id = key;
		                               							};
		                               							if (j == 1) {
		                               								key_name = key;
		                               							};
		                               							j++;
		                               						});
		                               						i++;
		                               					};

		                              innerHTML += '<span style="display: inline-block;width: 123px;">' +
		                               						'<input style="margin-left:0px" type="checkbox" name="' + id + '" value="' + datas[item][key_id] + '" />' +
		                               						'<span style="margin: 0 10px 0 5px">' + datas[item][key_name] + '</span>' +
		                               						'</span>'
		                               };


				            innerHTML +=            '</div>'
				                      +         '</div>'
				                      +     '</div>'
					        innerHTML += '</div>'                   
				        
		 //--------------------------------------------------------------------------------------------------------------------------
						innerHTML += '<p style="display:none">{label:"' + zujianLabel + '",type:"' + type + '",id:"' + id + '",isRequire:"' + isRequire + '",xialaType:"' + xialaType + '"}</p>' +
							   '</span>';
						return innerHTML;	   
	},
	getleftrightkuang: function(zujianLabel, id, type, isRequire, xialaType) {
		/*alert(id);
                                 alert(type);
                                 alert(isRequire);
                                 alert(xialaType);
                                */

		var datas = "";
		var data = {
			"ifId": xialaType
		}; //地市参数
		var dataStr = JSON.stringify(data);
		//------------------------------------------------
		var ajaxUrl = "";
		var query = configUrl_main.query;
		if (query.indexOf("sml") != -1) {
			ajaxUrl = eastcom.baseURL + configUrl_main.query + "/" + xialaType;
		} else {
			ajaxUrl = eastcom.baseURL + configUrl_main.query;
		};
		//------------------------------------------------
		$.ajax({
			url: ajaxUrl,
			//url :eastcom.baseURL+"/srpt/rcpt/common/query" ,
			type: 'POST',
			async: false,
			dataType: "json",
			contentType: "application/json",
			data: dataStr,
			success: function(data) {
				datas = data.data;
			}
		});


		var innerHTML = '<span id="' + id + '" name="otherSpecialCondition" style="position: relative; display: inline-block; border: 0px solid #e8e8e8; width: 100%;height: 210px;margin-top: 10px;">' +
			'<span style="position: absolute;top: -10px;left: 15px; padding-right: 10px;padding-left: 10px;;background: #fff">待选区</span>' +
			'<span style="position: absolute;top: -10px;left: 365px;padding-right: 10px;padding-left: 10px;;background: #fff">已选区</span>' +
			'<span style="padding: 10px;display: block;float: left;border: 1px solid #e8e8e8;width: 245px;min-height: 208px;height: 208px;overflow: auto; -moz-user-select:none;" onselectstart="return false;">' +
			'<span id="list_left_' + id + '" class = "shiftCtrl_left">';
		var m = 0;
		for (var item in datas) {
			var key_id = "";
			var key_name = "";
			var i = 0;
			var j = 0;
			if (i < 1) {
				$.each(datas[item], function(key, val) {
					if (j == 0) {
						key_id = key;
					};
					if (j == 1) {
						key_name = key;
					};
					j++;
				});
				i++;
			};

			//innerHTML +='<option value="'+datas[item][key_id]+'">'+datas[item][key_name]+'</option>' ;   
			innerHTML += '<span id="' + id + '_' + m + '" avalue="' + datas[item][key_id] + '">' + datas[item][key_name] + '</span>'
			m++;
		};
		/* var i = 0;
		 for(var item in datas){
		         innerHTML +=  '<span id="'+id+'_'+i+'" avalue="'+datas[item].name+'">'+datas[item].name+'</span>' 
		          i++; 
		 };*/
		innerHTML += '</span>' +
			'<input type="text" id="list_left_input_' + id + '" style="width:166px;display:none" /> ' +
			'</span>' +
			'<span style="display: block;float: left;border: 0px solid #e8e8e8; padding-top:6px;width: 100px;min-height: 208px;height: 208px;overflow: auto;">' +
			'<center>' +
			'<button class="btn btn-success btn-sm" href="#" onclick="suppleMethod.checkAll(\'' + id + '\')" >全选</button><br/><br/>' +
			'<button class="btn btn-success btn-sm" href="#" onclick="suppleMethod.checkPart(\'' + id + '\')" >添加</button><br/><br/>' +
			'<button class="btn btn-success btn-sm" href="#" onclick="suppleMethod.delPart(\'' + id + '\')" >删除</button><br/><br/>' +
			'<button class="btn btn-success btn-sm" href="#" onclick="suppleMethod.delAll(\'' + id + '\')" >全删</button><br/><br/>' +
			'</center>' +
			'</span>' +
			'<span style="padding: 10px;display: block;float: left;border: 1px solid #e8e8e8;width: 233px;min-height: 208px;height: 208px;overflow: auto;-moz-user-select:none;" onselectstart="return false;">' +
			'<span id="list_right_' + id + '" class = "shiftCtrl_right">';
		var n = 0;
		for (var item in datas) {
			var key_id = "";
			var key_name = "";
			var i = 0;
			var j = 0;
			if (i < 1) {
				$.each(datas[item], function(key, val) {
					if (j == 0) {
						key_id = key;
					};
					if (j == 1) {
						key_name = key;
					};
					j++;
				});
				i++;
			};

			//innerHTML +='<option value="'+datas[item][key_id]+'">'+datas[item][key_name]+'</option>' ;   
			innerHTML += '<span id="' + id + '_' + n + '" avalue="' + datas[item][key_id] + '" style="display:none">' + datas[item][key_name] + '</span>'
			n++;
		};
		/*var j = 0;
		for(var item in datas){
		        innerHTML +=  '<span id="'+id+'_'+j+'" avalue="'+datas[item].name+'" style="display:none" >'+datas[item].name+'</span>' 
		         j++; 
		};  */

		innerHTML += '</span>' +
			'<input type="text" id="list_right_input_' + id + '" style="width:166px;display:none" /> ' +
			'</span>' +
			'<p style="display:none">{label:"' + zujianLabel + '",type:"' + type + '",id:"' + id + '",isRequire:"' + isRequire + '",xialaType:"' + xialaType + '"}</p>' +
			'</span>';

		return innerHTML;
	},
	getleftrightliandong: function(zujianLabel, id, type, isRequire, xialaType) {
		var datas = "";
		var data = {
			"ifId": xialaType
		}; //地市参数
		var dataStr = JSON.stringify(data);
		//------------------------------------------------
		var ajaxUrl = "";
		var query = configUrl_main.query;
		if (query.indexOf("sml") != -1) {
			ajaxUrl = eastcom.baseURL + configUrl_main.query + "/" + xialaType;
		} else {
			ajaxUrl = eastcom.baseURL + configUrl_main.query;
		};
		//------------------------------------------------
		$.ajax({
			url: ajaxUrl,
			//url :eastcom.baseURL+"/srpt/rcpt/common/query" ,
			type: 'POST',
			async: false,
			dataType: "json",
			contentType: "application/json",
			data: dataStr,
			success: function(data) {
				datas = data.data;
			}
		});
		//-------------------------------------------------- 
		var innerHTML = '<span id="' + id + '" name="otherSpecialCondition" style="display: inline-block; border: 0px solid #e8e8e8; width: 100%;height: 210px">' +
			'<span style="display: block;float: left;border: 1px solid #e8e8e8;width: 245px;min-height: 208px;height: 208px;overflow: auto; -moz-user-select:none;padding: 0 10px;cursor: pointer;" onselectstart="return false;">' +
			'<span>';
		var m = 0;

		//----------------------------------
		var urls = ["srpt-enum-city", "srpt-enum-colorCfg", "srpt-enum-dataSource",
			"srpt-enum-city", "srpt-enum-colorCfg", "srpt-enum-dataSource",
			"srpt-enum-city", "srpt-enum-colorCfg", "srpt-enum-dataSource",
			"srpt-enum-city", "srpt-enum-colorCfg", "srpt-enum-dataSource",
			"srpt-enum-dataSource"
		];
		//----------------------------------
		for (var item in datas) {
			var key_id = "";
			var key_name = "";
			var i = 0;
			var j = 0;
			if (i < 1) {
				$.each(datas[item], function(key, val) {
					if (j == 0) {
						key_id = key;
					};
					if (j == 1) {
						key_name = key;
					};
					j++;
				});
				i++;
			};

			innerHTML += '<span id="' + m + '" avalue="' + datas[item][key_id] + '" valueUrl="' + urls[m] + '" onclick="leftrightliandong.clicking(this,\'' + id + '\')" style="display: block;">' + datas[item][key_name] + '</span>'
			m++;

		};

		innerHTML += '</span>' +
			'</span>'
			//-------------------------------------------------
			+
			'<span style="display: block;float: left;border:0px solid #e8e8e8;width:98px;min-height: 208px;height: 208px;">' +
			'<img style="width: 34px; height: 34px ;margin: 80px 35px;"  src="../../static/reportManageSys/images/jt.png">' +
			'</span>'
			//-------------------------------------------------
			+
			'<span style="margin-left:1px;display: block;float: left;border: 1px solid #e8e8e8;width: 233px;min-height: 208px;height: 208px;overflow: auto;-moz-user-select:none;padding: 0 10px;" onselectstart="return false;">' +
			'<span name="result_span">';

		/* var j = 0;
		 for(var item in datas){
		         innerHTML +=  '<span id="'+j+'"  avalue="'+datas[item].id+'" style="display:none">'+datas[item].name+'</span>' 
		          j++; 
		 };  */

		innerHTML += '</span>' +
			'</span>' +
			'<p style="display:none">{label:"' + zujianLabel + '",type:"' + type + '",id:"' + id + '",isRequire:"' + isRequire + '",xialaType:"' + xialaType + '"}</p>' +
			'</span>';


		return innerHTML;
	},
	getdemoselect: function(zujianLabel, id, type, isRequire) {

		var data = {
			"ifId": "srpt-cfg-deviceQueryModelInfo"
		};
		var dataStr = JSON.stringify(data);
		var res = commonAjax(configUrl_main.query_deviceQueryModelInfo, dataStr, "", "");
		//var res = commonAjax("/srpt/rcpt/common/query",dataStr,"","");
		var arr = res.data;
		var innerHTML = '<span id="' + id + '" name="otherSpecialCondition" style="overflow-y:auto; display: inline-block;margin-bottom: 8px; border: 1px solid #e8e8e8; width: 92%;height: 275px">'

		for (var i = 0; i < arr.length; i++) {
            
			innerHTML += '<span name="span_wenben" sc="0" ondblclick="demoselect.showDetailInfo(this)" onclick="demoselect.selectCurrDemo(this,\'' + arr[i].type + '\')" onmouseover="demoselect.addBackground(this)" onmouseout="demoselect.delBackground(this)" style="display:inline-block;margin-left: 20px;margin-top: 10px;width:86px;cursor: pointer;">'
			if (arr[i].type == "shebei") {
				innerHTML += '<img name="img_demo_shebei" style="width: 84px; height: 102px ;"  src="../../static/reportManageSys/images/wenben_demo_shebei_wu.png">'
			} else if (arr[i].type == "duankou") {
				innerHTML += '<img name="img_demo_duankou" style="width: 84px; height: 102px ;"  src="../../static/reportManageSys/images/wenben_demo_duankou_wu.png">'
			} else {
				innerHTML += '<img name="img_demo_wenben" style="width: 84px; height: 102px ;"  src="../../static/reportManageSys/images/wenben_demo_wu.png">'
			};

			// +              '<img name="img_demo_wenben" style="width: 84px; height: 102px ;"  src="../../static/reportManageSys/images/wenben_demo_wu.png">'
			innerHTML += '<b style="font-weight: 500;" title="' + arr[i].tpl_name + '">' +
				'<span style="padding-left:10px;display:inline-block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:80px;">' + arr[i].tpl_name + '</span></b>' +
				'<span style="display:none">' + arr[i].tpl_id + '</span>' +
				'</span>';

		};

		innerHTML += '<p style="display:none">{label:"' + zujianLabel + '",type:"' + type + '",id:"' + id + '",isRequire:"' + isRequire + '"}</p>' +
			'</span>';


		return innerHTML;
	},
	getconvergeCheckbox: function(zujianLabel, id, type, isRequire,xialaType) {
        var zujianLabelArr = zujianLabel.split(",");
		var xialaType = xialaType;
		var datass = "";

		var data = {
			"ifId": xialaType
		}; //地市参数
		var dataStr = JSON.stringify(data);
		//------------------------------------------------
		var ajaxUrl = "";
		var query = configUrl_main.query;
		if (query.indexOf("sml") != -1) {
			ajaxUrl = eastcom.baseURL + configUrl_main.query + "/" + xialaType;
		} else {
			ajaxUrl = eastcom.baseURL + configUrl_main.query;
		};
		//------------------------------------------------
		$.ajax({
			url: ajaxUrl,
			//url :eastcom.baseURL+"/srpt/rcpt/common/query" ,
			type: 'POST',
			async: false,
			dataType: "json",
			contentType: "application/json",
			data: dataStr,
			success: function(data) {
				datas = data.data;
			}
		});
		/*var arr = [
                  {"id":"211.136.112.50","value":"211.136.112.50"}, 
                  {"id":"211.136.150.176","value":"211.136.150.176"}, 
                  {"id":"211.181.103.40","value":"211.181.103.40"}, 
                  {"id":"211.136.150.66","value":"211.136.150.66"}
		];*/
		var arr = datas;
		var innerHTML = '<span id="' + id + '" name="otherSpecialCondition" style="padding: 10px;overflow-y:auto; display: inline-block;margin-bottom: 8px; border: 1px solid #e8e8e8; width: 92%;height: 225px">';
        
        innerHTML += '<div><b>'+zujianLabelArr[0]+'</b></div>'; 
        innerHTML += '<div style="margin: 0 0 5px;">'
                  +  '<span>是否汇聚 : </span>'
                  +  '<input type="radio" name="'+id+'_isConverge" value="shi" /> <span>是</span>'
                  +  '<input type="radio" name="'+id+'_isConverge" checked value="fou" /> <span>否</span>'
                  +  '</div>'; 
        innerHTML += '<div>'
                  +  '<table>'
                  +       '<tr class="tr_bgColor" style="height:40px;">'
                  +          '<td style="width: 30px;text-align: center;border-right: 1px solid #e8e8e8;"><input type="checkbox" style="margin: 0px;" onclick="convergeCheckbox.allcheck(this,\''+id+'\')"  /></td>'
                  +          '<td style="width:200px;padding-left: 10px;">'+(zujianLabelArr[1]?zujianLabelArr[1]:"DNS中心IP")+'</td>'
                  +       '</tr>'
        for (var i = 0; i < arr.length; i++) {
                 var currObj = arr[i];
                 var flagColor = i%2==1?false:true;
        innerHTML +=       '<tr '+(flagColor?"":"class=\'tr_bgColor\'")+' style="height:26px;" >'
                  +          '<td style="width: 30px;text-align: center;border-right: 1px solid #e8e8e8;"><input type="checkbox" name="'+id+'_convergeCheckbox" values="'+currObj.id+'" style="margin: 0px;"/></td>'
                  +          '<td style="width:200px;padding-left: 10px;"><span>'+currObj.value1+'</span></td>'
                  +       '</tr>'
        };

        innerHTML += '</table>' 
                  +   '</div>'; 

		innerHTML += '<p style="display:none">{label:"' + zujianLabel + '",type:"' + type + '",id:"' + id + '",isRequire:"' + isRequire + '",xialaType:"' + xialaType + '"}</p>' +
			   '</span>';
		return innerHTML;
	},
	getconvergeCheckboxDetail: function(zujianLabel, id, type, isRequire,xialaType) {
        var zujianLabelArr = zujianLabel.split(",");
		var data = {
			"ifId": xialaType
		};
		var dataStr = JSON.stringify(data);
		var res = commonAjax(configUrl_main.query_deviceQueryModelInfo, dataStr, "", "");
		//var res = commonAjax("/srpt/rcpt/common/query",dataStr,"","");
		var arr = res.data;
		/*var arr = [
                  {"id":"SHSH-PS-MMS-SYS01","value1":"SHSH-PS-MMS-SYS01","value2":"上海彩信1","value3":"华为"}, 
                  {"id":"SHSH-PS-MMS-SYS02","value1":"SHSH-PS-MMS-SYS02","value2":"上海彩信2","value3":"华为"}
		];*/
		var innerHTML = '<span id="' + id + '" name="otherSpecialCondition" style="padding: 10px;overflow-y:auto; display: inline-block;margin-bottom: 8px; border: 1px solid #e8e8e8; width: 92%;height: 225px">';
        
        innerHTML += '<div><b>'+zujianLabelArr[0]+'</b></div>'; 
        innerHTML += '<div style="margin: 0 0 5px;">'
                  +  '<span>是否汇聚 : </span>'
                  +  '<input type="radio" name="'+id+'_isConverge" value="shi" /> <span>是</span>'
                  +  '<input type="radio" name="'+id+'_isConverge" checked value="fou" /> <span>否</span>'
                  +  '</div>'; 
        innerHTML += '<div>'
                  +  '<table>'
                  +       '<tr class="tr_bgColor" style="height:40px;">'
                  +          '<td style="width: 30px;text-align: center;border-right: 1px solid #e8e8e8;"><input type="checkbox" style="margin: 0px;" onclick="convergeCheckboxDetail.allcheck(this,\''+id+'\')"  /></td>'
                  +          '<td style="width:200px;padding-left: 10px;">'+(zujianLabelArr[1]?zujianLabelArr[1]:"彩信中心IP")+'</td>'
                  +          '<td style="width:200px;padding-left: 10px;">'+(zujianLabelArr[2]?zujianLabelArr[2]:"彩信中心描述")+'</td>'
                  +          '<td style="width:200px;padding-left: 10px;">'+(zujianLabelArr[3]?zujianLabelArr[3]:"厂商")+'</td>'
                  +       '</tr>'
        for (var i = 0; i < arr.length; i++) {
                 var currObj = arr[i];
                 var flagColor = i%2==1?false:true;
        innerHTML +=       '<tr '+(flagColor?"":"class=\'tr_bgColor\'")+' style="height:26px;" >'
                  +          '<td style="width: 30px;text-align: center;border-right: 1px solid #e8e8e8;"><input type="checkbox" name="'+id+'_convergeCheckboxDetail" values="'+currObj.id+'" style="margin: 0px;"/></td>'
                  +          '<td style="width:200px;padding-left: 10px;"><span>'+(currObj.value1?currObj.value1:"")+'</span></td>'
                  +          '<td style="width:200px;padding-left: 10px;"><span>'+(currObj.value2?currObj.value2:"")+'</span></td>'
                  +          '<td style="width:200px;padding-left: 10px;"><span>'+(currObj.value3?currObj.value3:"")+'</span></td>'
                  +       '</tr>'
        };

        innerHTML += '</table>' 
                  +   '</div>'; 

		innerHTML += '<p style="display:none">{label:"' + zujianLabel + '",type:"' + type + '",id:"' + id + '",isRequire:"' + isRequire + '",xialaType:"' + xialaType + '"}</p>' +
			   '</span>';
		return innerHTML;
	},
	getdemoselectNew : function(zujianLabel, id, type, isRequire){
				var innerHTML = '<span id="' + id + '" name="otherSpecialCondition" style="padding: 0px;overflow-y:auto; display: inline-block; border: 0px solid #e8e8e8; width: 94%;">';
 //--------------------------------------------------------------------------------------------------------------------------
		            innerHTML += '<div>'    
		                      +       '<div class="con_menu" name="condition_Tab" style="margin-top:0">'
			                  +            '<li class="hover" name="tabmenue_tiaojian" onclick="demoselectNew.getDiv(\'tiaojian\',\''+id+'\')"><a>选择查询条件</a></li>'
			                  +            '<li name="tabmenue_muban"><a onclick="demoselectNew.getDiv(\'muban\',\''+id+'\')">选择查询模板</a></li>'
			                  +       '</div>'
                              +        '<div name="condition_Div" onselectstart="return false;" style="-moz-user-select:none;">'
                              +             '<div id="div_tiaojian" style="height: 305px;position: relative;  border: solid 1px #e8e8e8; border-top: none; padding: 10px;">'
                              +                     '<div name="left" style="float:left;width:42%;height:100%;margin-right:8px">' 
                              +                            '<div>'  
                              +                            '<table>'  
                              +                               '<tr style="height: 40px;">'  
                              +                                  '<td>设备名称:</td>'  
                              +                                  '<td style="width:68%"><input type="text" id="'+id+'_device_name" style="width:100%" /></td>'  
                              +                               '</tr>'
                              +                               '<tr style="height: 40px;">'  
                              +                                  '<td>设备机房:</td>'  
                              +                                  '<td style="width:68%"><input type="text" id="'+id+'_device_room" style="width:100%" /></td>'  
                              +                               '</tr>'
                              +                               '<tr style="height: 40px;">'  
                              +                                  '<td>设备IP地址:</td>'  
                              +                                  '<td style="width:68%"><input type="text" id="'+id+'_device_ipAdress" style="width:100%" /></td>'  
                              +                               '</tr>'
                              +                               '<tr style="height: 40px;">'  
                              +                                  '<td>支撑的业务系统:</td>'  
                              +                                  '<td style="width:68%"><input type="text" id="'+id+'_business_system" style="width:100%" /></td>'  
                              +                               '</tr>'
                              +                               '<tr style="height: 40px;">'  
                              +                                  '<td>端口别名:</td>'  
                              +                                  '<td style="width:68%"><input type="text" id="'+id+'_port_cname" style="width:100%" /></td>'  
                              +                               '</tr>'
                              +                               '<tr style="height: 40px;">'  
                              +                                  '<td>端口IP地址:</td>'  
                              +                                  '<td style="width:68%"><input type="text" id="'+id+'_port_ipAdress" style="width:100%" /></td>'  
                              +                               '</tr>'
                              +                               '<tr style="height: 40px;">'  
                              +                                  '<td><input type="button" class="btn btn-inverse" value="查询设备" onclick="demoselectNew.seekQuery(\''+id+'\')" /></td>'  
                              +                                  '<td style="width:68%">'
                              //+                                  '<input type="radio" name="'+id+'_seekQueryType" value="shebei" style="margin-left:0" checked /><span>设备查询</span>'
                              //+                                  '<input type="radio" name="'+id+'_seekQueryType" value="duankou" style="margin-left:10px" /><span>端口查询</span>'  
                              +                                  '</td>'  
                              +                               '</tr>'
                              +                            '</table>'  
                              +                            '</div>'  
                              +                     '</div>'  
                              +                     '<div name="right" style="float:left;width:55%;height:100%;border: 1px solid #e8e8e8;">' 
                              +                           '<div><b>待选设备端口</b></div>'
                              +                           '<div>'
							  +	                              '<div id="'+id+'_tree_tiaojian_div" style="margin-top:5px;overflow: auto;height:257px;position: relative;">'
							  +	                                  '<ul id="'+id+'_tree_tiaojian"></ul>'
							  +	                              '</div>'
                              +                           '</div>'
                              +                     '</div>' 
                              +             '</div>'
                              +             '<div id="div_muban" style="height: 305px;position: relative;  border: solid 1px #e8e8e8; border-top: none; padding: 12px 10px 10px;display: none">'
                              +                  '<div style="height:135px;width:100%;margin-bottom:15px">' 
                              +                     '<div style="border:1px solid #e8e8e8;width:100%;height:1px;position:relative;border-bottom: none;">' 
                              +                        '<div style="position:absolute;top:-11px;left:10px;background:#fff;width: 94px;text-align: center;">'
                              +                         '<span id="'+id+'_first_UpDown_Down" name="'+id+'_first_UpDown" style="display: none;"><a href="javascript:void(0)" class="function-icon" style="vertical-align: text-top;"><i class="fa fa-chevron-circle-down cursor" onclick="demoselectNew.zhankaiOrshousuo(\''+id+'\',\'_first_UpDown\',\'_first_UpDown_Down\',\'first\')"></i></a></span>'
                              +                         '<span id="'+id+'_first_UpDown_Up" name="'+id+'_first_UpDown" style="display: inline-block;"><a href="javascript:void(0)" class="function-icon" style="vertical-align: text-top;"><i class="fa fa-chevron-circle-up cursor" onclick="demoselectNew.zhankaiOrshousuo(\''+id+'\',\'_first_UpDown\',\'_first_UpDown_Up\',\'first\')"></i></a></span>'
                              +                         '系统模板'
                              +                        '</div>' 
                              +                     '</div>' 
                              +                     '<div id="'+id+'_first_div" style="height:100%;width:100%;border:1px solid #e8e8e8;border-top:none">' 
                              +                        '<div style="float:left;width:144px">' 
                              +                        '<span style="display:inline-block;margin-left: 20px;margin-top: 10px;width:86px;cursor: pointer;" onclick="demoselectNew.addNewDemo(\'sys\')">' 
                              +                            '<img src="../../static/reportManageSys/images/special_add.png" style="width: 84px; height: 91px ;">' 
                              +                             '<b style="font-weight: 500;" title="增加新模板">' 
                              +                             '<span style="padding-left:5px;display:inline-block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:80px;">增加新模板</span>' 
                              +                             '</b>' 
                              +                        '</span>' 
                              +                        '</div>' 
                              +                        '<div id="specialDiv_1" style="overflow-y: auto;height: 134px;">' ;
         //防止单点登录获取不到用户名-------------------------------------------------------------
		var userInfo = "";
		var userinfoDiv=$(window.top.document.getElementById('userinfo'));
		userInfo =  userinfoDiv.find('div[id = "tab_1_1"]').find('div').eq(0).find('div').eq(1).html();
		if (userInfo == null) {
		userInfo = $.cookie("inas_portallogin_user_username");
		}else{
		var re1 = new RegExp("\n", "g");
		userInfo = userInfo.replace(re1, ""); 
		userInfo = userInfo.trim(); 
		};
		var data = {
		   "ifId": "srpt-cfg-deviceQueryModelInfo",
		   "owner":userInfo
		};
        
         var dataStr = JSON.stringify(data);
         var res = commonAjax(configUrl_main.query_deviceQueryModelInfo, dataStr, "", "");
         //var res = commonAjax("/srpt/rcpt/common/query",dataStr,"","");
         var arr = res.data;
         for (var i = 0; i < arr.length; i++) {
            if (arr[i].tpl_sys_user == "user" || arr[i].tpl_sys_user ==null ) {continue;};                                    	
                    innerHTML +=                         '<span name="span_wenben" sc="0" style="display:inline-block;margin-left: 20px;margin-top: 10px;width:86px;cursor: pointer;" onclick="demoselect.selectCurrDemo(this,\'' + arr[i].type + '\')" >'
                              //+                               '<img oncontextmenu="demoselectNew.bindRightEvent_sys(\''+arr[i].tpl_id+'\');" src="../../static/reportManageSys/images/wenben_demo_duankou_wu.png" style="width: 84px; height: 91px ;">'
            if (arr[i].type == "shebei") {
                    innerHTML +=                              '<img oncontextmenu="demoselectNew.bindRightEvent_sys(\''+arr[i].tpl_id+'\');" name="img_demo_shebei" style="width: 84px; height: 91px ;"  src="../../static/reportManageSys/images/wenben_demo_shebei_wu.png">'
            } else if (arr[i].type == "duankou") {
                    innerHTML +=                              '<img oncontextmenu="demoselectNew.bindRightEvent_sys(\''+arr[i].tpl_id+'\');" name="img_demo_duankou" style="width: 84px; height: 91px ;"  src="../../static/reportManageSys/images/wenben_demo_duankou_wu.png">'
            } else {
                    innerHTML +=                              '<img oncontextmenu="demoselectNew.bindRightEvent_sys(\''+arr[i].tpl_id+'\');" name="img_demo_wenben" style="width: 84px; height: 91px ;"  src="../../static/reportManageSys/images/wenben_demo_wu.png">'
            };
                    innerHTML +=                              '<b style="font-weight: 500;" title="'+arr[i].tpl_name+'">' 
                              +                               '<span style="padding-left:10px;display:inline-block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:80px;">'+arr[i].tpl_name+'</span>' 
                              +                               '</b>' 
                              +                               '<span style="display:none">'+arr[i].tpl_id+'</span>' 
                              +                               '<span style="display:none">'+(arr[i].type == "shebei"?"t":"f")+'</span>' 
                              +                           '</span>' 
         };                                                
                    innerHTML +=                        '</div>' 
                              +                     '</div>' 
                              +                  '</div>' 
                              +                  '<div style="height:135px;width:100%">'
                              +                     '<div style="border:1px solid #e8e8e8;width:100%;height:1px;position:relative;border-bottom: none;">' 
                              +                        '<div style="position:absolute;top:-11px;left:10px;background:#fff;width: 137px;text-align: center;">'
                              +                         '<span id="'+id+'_two_UpDown_Down" name="'+id+'_two_UpDown" style="display: none;"><a href="javascript:void(0)" class="function-icon" style="vertical-align: text-top;"><i class="fa fa-chevron-circle-down cursor" onclick="demoselectNew.zhankaiOrshousuo(\''+id+'\',\'_two_UpDown\',\'_two_UpDown_Down\',\'two\')"></i></a></span>'
                              +                         '<span id="'+id+'_two_UpDown_Up" name="'+id+'_two_UpDown" style="display: inline-block;"><a href="javascript:void(0)" class="function-icon" style="vertical-align: text-top;"><i class="fa fa-chevron-circle-up cursor" onclick="demoselectNew.zhankaiOrshousuo(\''+id+'\',\'_two_UpDown\',\'_two_UpDown_Up\',\'two\')"></i></a></span>'
                              +                         '用户自定义模板'
                              +                        '</div>' 
                              +                     '</div>' 
                              +                     '<div id="'+id+'_two_div" style="height:100%;width:100%;border:1px solid #e8e8e8;border-top:none">' 
			                  +                        '<div style="float:left;width:144px">' 
			                  +                        '<span style="display:inline-block;margin-left: 20px;margin-top: 10px;width:86px;cursor: pointer;" onclick="demoselectNew.addNewDemo(\'user\')">' 
			                  +                            '<img src="../../static/reportManageSys/images/special_add.png" style="width: 84px; height: 91px ;">' 
			                  +                             '<b style="font-weight: 500;" title="增加新模板">' 
			                  +                             '<span style="padding-left:5px;display:inline-block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:80px;">增加新模板</span>' 
			                  +                             '</b>' 
			                  +                        '</span>' 
			                  +                        '</div>' 
			                  +                        '<div id="specialDiv_2" style="overflow-y: auto;height: 134px;">' 
			for (var i = 0; i < arr.length; i++) {
			    if (arr[i].tpl_sys_user == "sys" || arr[i].tpl_sys_user ==null) {continue;};                                             	
			        innerHTML +=                         '<span name="span_wenben" sc="0" style="display:inline-block;margin-left: 20px;margin-top: 10px;width:86px;cursor: pointer;" onclick="demoselect.selectCurrDemo(this,\'' + arr[i].type + '\')">'
			                  //+                               '<img oncontextmenu="demoselectNew.bindRightEvent_user(\'20170606110042\');" src="../../static/reportManageSys/images/wenben_demo_duankou_wu.png" style="width: 84px; height: 91px ;">'
			    if (arr[i].type == "shebei") {
			        innerHTML +=                              '<img oncontextmenu="demoselectNew.bindRightEvent_user(\''+arr[i].tpl_id+'\');" name="img_demo_shebei" style="width: 84px; height: 91px ;"  src="../../static/reportManageSys/images/wenben_demo_shebei_wu.png">'
			    } else if (arr[i].type == "duankou") {
			        innerHTML +=                              '<img oncontextmenu="demoselectNew.bindRightEvent_user(\''+arr[i].tpl_id+'\');" name="img_demo_duankou" style="width: 84px; height: 91px ;"  src="../../static/reportManageSys/images/wenben_demo_duankou_wu.png">'
			    } else {
			        innerHTML +=                              '<img oncontextmenu="demoselectNew.bindRightEvent_user(\''+arr[i].tpl_id+'\');" name="img_demo_wenben" style="width: 84px; height: 91px ;"  src="../../static/reportManageSys/images/wenben_demo_wu.png">'
			    };          
			        innerHTML +=                               '<b style="font-weight: 500;" title="'+arr[i].tpl_name+'">' 
			                  +                               '<span style="padding-left:10px;display:inline-block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:80px;">'+arr[i].tpl_name+'</span>' 
			                  +                               '</b>' 
			                  +                               '<span style="display:none">'+arr[i].tpl_id+'</span>' 
			                  +                               '<span style="display:none">'+(arr[i].type == "shebei"?"t":"f")+'</span>' 
			                  +                           '</span>' 
			};                                                
			        innerHTML +=                        '</div>' 
                              +                     '</div>' 
                              +                  '</div>' 
                              +             '</div>'
                              +        '</div>' 
			        innerHTML += '</div>'                   
		        
 //--------------------------------------------------------------------------------------------------------------------------
				innerHTML += '<p style="display:none">{label:"' + zujianLabel + '",type:"' + type + '",id:"' + id + '",isRequire:"' + isRequire + '"}</p>' +
					   '</span>';
				return innerHTML;
	},
	getconditionToDevice : function(zujianLabel, id, type, isRequire){
				var innerHTML = '<span id="' + id + '" name="otherSpecialCondition" style="padding: 0px;overflow-y:auto; display: inline-block; border: 0px solid #e8e8e8; width: 94%;">';
 //--------------------------------------------------------------------------------------------------------------------------
		            innerHTML += '<div>'    
		                      +       '<div class="con_menu" name="condition_Tab" style="margin-top:0">'
			                  +            '<li class="hover" name="tabmenue_tiaojian" onclick="demoselectNew.getDiv(\'tiaojian\',\''+id+'\')"><a>选择查询条件</a></li>'
			                  //+            '<li name="tabmenue_muban"><a onclick="demoselectNew.getDiv(\'muban\',\''+id+'\')">选择查询模板</a></li>'
			                  +       '</div>'
                              +        '<div name="condition_Div" onselectstart="return false;" style="-moz-user-select:none;">'
                              +             '<div id="div_tiaojian" style="height: 305px;position: relative;  border: solid 1px #e8e8e8; border-top: none; padding: 10px;">'
                              +                     '<div name="left" style="float:left;width:42%;height:100%;margin-right:8px">' 
                              +                            '<div>'  
                              +                            '<table>'  
                              +                               '<tr style="height: 40px;">'  
                              +                                  '<td>设备名称:</td>'  
                              +                                  '<td style="width:68%"><input type="text" id="'+id+'_device_name" style="width:100%" /></td>'  
                              +                               '</tr>'
                              +                               '<tr style="height: 40px;">'  
                              +                                  '<td>设备机房:</td>'  
                              +                                  '<td style="width:68%"><input type="text" id="'+id+'_device_room" style="width:100%" /></td>'  
                              +                               '</tr>'
                              +                               '<tr style="height: 40px;">'  
                              +                                  '<td>设备IP地址:</td>'  
                              +                                  '<td style="width:68%"><input type="text" id="'+id+'_device_ipAdress" style="width:100%" /></td>'  
                              +                               '</tr>'
                              +                               '<tr style="height: 40px;">'  
                              +                                  '<td>支撑的业务系统:</td>'  
                              +                                  '<td style="width:68%"><input type="text" id="'+id+'_business_system" style="width:100%" /></td>'  
                              +                               '</tr>'
                              +                               '<tr style="height: 40px;">'  
                              +                                  '<td><input type="button" class="btn btn-inverse" value="查询设备" onclick="conditionToDevice.seekQuery(\''+id+'\')" /></td>'  
                              +                                  '<td style="width:68%">'
                              //+                                  '<input type="radio" name="'+id+'_seekQueryType" value="shebei" style="margin-left:0" checked /><span>设备查询</span>'
                              //+                                  '<input type="radio" name="'+id+'_seekQueryType" value="duankou" style="margin-left:10px" /><span>端口查询</span>'  
                              +                                  '</td>'  
                              +                               '</tr>'
                              +                            '</table>'  
                              +                            '</div>'  
                              +                     '</div>'  
                              +                     '<div name="right" style="float:left;width:55%;height:100%;border: 1px solid #e8e8e8;">' 
                              +                           '<div><b>待选设备</b></div>'
                              +                           '<div>'
							  +	                              '<div id="'+id+'_tree_tiaojian_div" style="margin-top:5px;overflow: auto;height:257px;position: relative;">'
							  +	                                  '<ul id="'+id+'_tree_tiaojian"></ul>'
							  +	                              '</div>'
                              +                           '</div>'
                              +                     '</div>' 
                              +             '</div>'
			        innerHTML +=      '</div>'                   
                              +  '</div>' 
		        
 //--------------------------------------------------------------------------------------------------------------------------
				innerHTML += '<p style="display:none">{label:"' + zujianLabel + '",type:"' + type + '",id:"' + id + '",isRequire:"' + isRequire + '"}</p>' +
					   '</span>';
				return innerHTML;
	},
	getconditionToPort : function(zujianLabel, id, type, isRequire){
				var innerHTML = '<span id="' + id + '" name="otherSpecialCondition" style="padding: 0px;overflow-y:auto; display: inline-block; border: 0px solid #e8e8e8; width: 94%;">';
 //--------------------------------------------------------------------------------------------------------------------------
		            innerHTML += '<div>'    
		                      +       '<div class="con_menu" name="condition_Tab" style="margin-top:0">'
			                  +            '<li class="hover" name="tabmenue_tiaojian" onclick="demoselectNew.getDiv(\'tiaojian\',\''+id+'\')"><a>选择查询条件</a></li>'
			                  //+            '<li name="tabmenue_muban"><a onclick="demoselectNew.getDiv(\'muban\',\''+id+'\')">选择查询模板</a></li>'
			                  +       '</div>'
                              +        '<div name="condition_Div" onselectstart="return false;" style="-moz-user-select:none;">'
                              +             '<div id="div_tiaojian" style="height: 305px;position: relative;  border: solid 1px #e8e8e8; border-top: none; padding: 10px;">'
                              +                     '<div name="left" style="float:left;width:42%;height:100%;margin-right:8px">' 
                              +                            '<div>'  
                              +                            '<table>'  
                              +                               '<tr style="height: 40px;">'  
                              +                                  '<td>设备名称:</td>'  
                              +                                  '<td style="width:68%"><input type="text" id="'+id+'_device_name" style="width:100%" /></td>'  
                              +                               '</tr>'
                              +                               '<tr style="height: 40px;">'  
                              +                                  '<td>设备机房:</td>'  
                              +                                  '<td style="width:68%"><input type="text" id="'+id+'_device_room" style="width:100%" /></td>'  
                              +                               '</tr>'
                              +                               '<tr style="height: 40px;">'  
                              +                                  '<td>设备IP地址:</td>'  
                              +                                  '<td style="width:68%"><input type="text" id="'+id+'_device_ipAdress" style="width:100%" /></td>'  
                              +                               '</tr>'
                              +                               '<tr style="height: 40px;">'  
                              +                                  '<td>支撑的业务系统:</td>'  
                              +                                  '<td style="width:68%"><input type="text" id="'+id+'_business_system" style="width:100%" /></td>'  
                              +                               '</tr>'
                              +                               '<tr style="height: 40px;">'  
                              +                                  '<td><input type="button" class="btn btn-inverse" value="查询端口" onclick="conditionToPort.seekQuery(\''+id+'\')" /></td>'  
                              +                                  '<td style="width:68%">'
                              //+                                  '<input type="radio" name="'+id+'_seekQueryType" value="shebei" style="margin-left:0" checked /><span>设备查询</span>'
                              //+                                  '<input type="radio" name="'+id+'_seekQueryType" value="duankou" style="margin-left:10px" /><span>端口查询</span>'  
                              +                                  '</td>'  
                              +                               '</tr>'
                              +                            '</table>'  
                              +                            '</div>'  
                              +                     '</div>'  
                              +                     '<div name="right" style="float:left;width:55%;height:100%;border: 1px solid #e8e8e8;">' 
                              +                           '<div><b>待选端口</b></div>'
                              +                           '<div>'
							  +	                              '<div id="'+id+'_tree_tiaojian_div" style="margin-top:5px;overflow: auto;height:257px;position: relative;">'
							  +	                                  '<ul id="'+id+'_tree_tiaojian"></ul>'
							  +	                              '</div>'
                              +                           '</div>'
                              +                     '</div>' 
                              +             '</div>'
			        innerHTML +=      '</div>'                   
                              +  '</div>' 
		        
 //--------------------------------------------------------------------------------------------------------------------------
				innerHTML += '<p style="display:none">{label:"' + zujianLabel + '",type:"' + type + '",id:"' + id + '",isRequire:"' + isRequire + '"}</p>' +
					   '</span>';
				return innerHTML;
	},
	getindexWarning : function(zujianLabel, id, type, isRequire){
		var report_id = $("#curr_id_div").html();
		var datas = "";
		var data = {
				    "report_id": report_id,
				    "conditions": {
				        "isContinue": "f",
				        "timeType": "day",
				        "startTime": "",
				        "endTime": "",
				        "discteteTime": "201706140000",
				        "sidx": null,
				        "sord": "asc",
				        "multiSelectWX": ""
				    },
				    "logic_sql_info": ""
				};
		var dataStr = JSON.stringify(data);
		//------------------------------------------------
		var ajaxUrl = "";
		var query = configUrl_main.query;
		// if (query.indexOf("sml") != -1) {
		// 	ajaxUrl = eastcom.baseURL + configUrl_main.query + "/" + xialaType;
		// } else {
		// 	ajaxUrl = eastcom.baseURL + configUrl_main.query;
		// };
		 ajaxUrl = eastcom.baseURL + "/srpt/rcpt/getCompDownColumn"
		//------------------------------------------------
		$.ajax({
			url: ajaxUrl,
			//url :eastcom.baseURL+"/srpt/rcpt/common/query" ,
			type: 'POST',
			async: false,
			dataType: "json",
			contentType: "application/json",
			data: dataStr,
			success: function(data) {
				datas = data.data;
			}
		});
		//------------------------------------------------------------------------
        		var innerHTML = '<span id="' + id + '" name="otherSpecialCondition" style="padding: 10px;overflow-y:auto; display: inline-block;margin-bottom: 8px; border: 1px solid #e8e8e8; width: 92%;height: 48px">';
                
                    innerHTML += '<div>'
                              +       '<div style="height: 25px;" >' 
                              +         '<input type="radio" name="' + id + '_usuallyOrwarning" value="usually" style="margin-left:0;" checked onclick="indexWarning.changeUsuallyOrwarningType(\''+id+'\')"/><span>常规模式</span>' 
                              +         '<input type="radio" name="' + id + '_usuallyOrwarning" value="warning" onclick="indexWarning.changeUsuallyOrwarningType(\''+id+'\')" /><span>预警模式</span>' 
                              +       '</div>' 
                              +       '<div id="' + id + '_realCondition" style="display:none">' 
                              +         '<div style="height: 40px;">' 
                              +           '<span>500K大包下载速率<span><span style="margin: 0 10px;">\<</span><input id="' + id + '_bigBaoRate" type="text" />(Kbps)' 
                              +         '</div>' 
                              +         '<div style="height: 40px;">' 
                              +            '<select id="' + id + '_index" style="width: 291px;">'
                if (datas.length == 0) {
                    innerHTML +=	       '<option value="1">---当前报表没有NUMBER类型数据---</option>' 
                };              
                for (var i = 0; i < datas.length; i++) {
                    var currObj = datas[i];
                    innerHTML +=	       '<option value="'+currObj.column+'">'+currObj.columnCN+'</option>' 
                };              
                    innerHTML +=            '</select>'
                              +            '<span style="margin: 0 0 0 10px;">较昨日浮动率</span>'
                              +            '<span style="margin: 0 10px;">\></span><input type="text" id="' + id + '_indexValue" />(%)' 
                              +         '</div>' 
                              +       '</div>' 
                              +   '</div>' 
                 

        		innerHTML += '<p style="display:none">{label:"' + zujianLabel + '",type:"' + type + '",id:"' + id + '",isRequire:"' + isRequire + '"}</p>' +
        			   '</span>';
        		return innerHTML;  
	},
	getbusyTimeParagraph : function(zujianLabel, id, type, isRequire){
				var realLabel = zujianLabel.split("|")[0];
				var innerHTML = '<span id="' + id + '" name="otherSpecialCondition" style="padding: 10px;overflow-y:auto; display: inline-block; border: 0px solid #e8e8e8; width: 94%;margin-bottom: 5px;">';
 //--------------------------------------------------------------------------------------------------------------------------
		            innerHTML += '<div>'    
		                      +     '<div style="height:26px;vertical-align: top;border-bottom:1px solid #e8e8e8;"><span style="white-space: nowrap;">'+realLabel+':</span>'
		                      +     '<span style="float:right">'
		                      +         '<input id="'+id+'_self" type="checkbox" onclick="busyTimeParagraph.busyTimeParagraphAll(\''+id+'\')" style="margin-left: 5px;" /><span>全选</span>'
		                      +         '<input id="'+id+'_back" type="checkbox" onclick="busyTimeParagraph.defaultCheckedEvent(\''+id+'\', \''+zujianLabel+'\')" checked="checked"/><span>默认忙时</span>'
		                      +     '</span>'
		                      +     '</div>'
		                      +     '<div style="">'
		                      +         '<div style="max-height:200px;border:0px solid #e8e8e8;padding-top:5px">'
		                      +            '<div style="max-height:175px;overflow:auto">'
		                      +                '<div style="display:inline-block;width:80px"><input style="margin-left:0px" name='+id+' type="checkbox" values = "00" /><span>0点</span></div>'
		                      +                '<div style="display:inline-block;width:80px"><input style="margin-left:0px" name='+id+' type="checkbox" values = "01" /><span>1点</span></div>'
		                      +                '<div style="display:inline-block;width:80px"><input style="margin-left:0px" name='+id+' type="checkbox" values = "02" /><span>2点</span></div>'
		                      +                '<div style="display:inline-block;width:80px"><input style="margin-left:0px" name='+id+' type="checkbox" values = "03" /><span>3点</span></div>'
		                      +                '<div style="display:inline-block;width:80px"><input style="margin-left:0px" name='+id+' type="checkbox" values = "04" /><span>4点</span></div>'
		                      +                '<div style="display:inline-block;width:80px"><input style="margin-left:0px" name='+id+' type="checkbox" values = "05" /><span>5点</span></div>'
		                      +                '<div style="display:inline-block;width:80px"><input style="margin-left:0px" name='+id+' type="checkbox" values = "06" /><span>6点</span></div>'
		                      +                '<div style="display:inline-block;width:80px"><input style="margin-left:0px" name='+id+' type="checkbox" values = "07" /><span>7点</span></div>'
		                      +                '<div style="display:inline-block;width:80px"><input style="margin-left:0px" name='+id+' type="checkbox" values = "08" /><span>8点</span></div>'
		                      +                '<div style="display:inline-block;width:80px"><input style="margin-left:0px" name='+id+' type="checkbox" values = "09" /><span>9点</span></div>'
		                      +                '<div style="display:inline-block;width:80px"><input style="margin-left:0px" name='+id+' type="checkbox" values = "10" /><span>10点</span></div>'
		                      +                '<div style="display:inline-block;width:80px"><input style="margin-left:0px" name='+id+' type="checkbox" values = "11" /><span>11点</span></div>'
		                      +                '<div style="display:inline-block;width:80px"><input style="margin-left:0px" name='+id+' type="checkbox" values = "12" /><span>12点</span></div>'
		                      +                '<div style="display:inline-block;width:80px"><input style="margin-left:0px" name='+id+' type="checkbox" values = "13" /><span>13点</span></div>'
		                      +                '<div style="display:inline-block;width:80px"><input style="margin-left:0px" name='+id+' type="checkbox" values = "14" /><span>14点</span></div>'
		                      +                '<div style="display:inline-block;width:80px"><input style="margin-left:0px" name='+id+' type="checkbox" values = "15" /><span>15点</span></div>'
		                      +                '<div style="display:inline-block;width:80px"><input style="margin-left:0px" name='+id+' type="checkbox" values = "16" /><span>16点</span></div>'
		                      +                '<div style="display:inline-block;width:80px"><input style="margin-left:0px" name='+id+' type="checkbox" values = "17" /><span>17点</span></div>'
		                      +                '<div style="display:inline-block;width:80px"><input style="margin-left:0px" name='+id+' type="checkbox" values = "18" /><span>18点</span></div>'
		                      +                '<div style="display:inline-block;width:80px"><input style="margin-left:0px" name='+id+' type="checkbox" values = "19" /><span>19点</span></div>'
		                      +                '<div style="display:inline-block;width:80px"><input style="margin-left:0px" name='+id+' type="checkbox" values = "20" /><span>20点</span></div>'
		                      +                '<div style="display:inline-block;width:80px"><input style="margin-left:0px" name='+id+' type="checkbox" values = "21" /><span>21点</span></div>'
		                      +                '<div style="display:inline-block;width:80px"><input style="margin-left:0px" name='+id+' type="checkbox" values = "22" /><span>22点</span></div>'
		                      +                '<div style="display:inline-block;width:80px"><input style="margin-left:0px" name='+id+' type="checkbox" values = "23" /><span>23点</span></div>'
		                      +            '</div>'
		                      +         '</div>'
		                      +     '</div>'
			        innerHTML += '</div>'                   
		        
 //--------------------------------------------------------------------------------------------------------------------------
				innerHTML += '<p style="display:none">{label:"' + zujianLabel + '",type:"' + type + '",id:"' + id + '",isRequire:"' + isRequire + '"}</p>' +
					   '</span>';
				return innerHTML;
	},
	getcellList : function(zujianLabel, id, type, isRequire){
		var innerHTML = '<span id="' + id + '" name="otherSpecialCondition" style="padding: 10px;overflow-y:auto; display: inline-block; border: 1px solid #e8e8e8; width: 94%;margin-bottom: 5px;">';
 //--------------------------------------------------------------------------------------------------------------------------
	        innerHTML += ''
	        		+	'<div>'
	        		+		'<div style="min-width: 102px;height:245px;float:left;">'
	        		+			zujianLabel
	        		+		'：</div>'
	        		+		'<textarea id="'+id+'_textarea" style="width:267px; height:205px;"></textarea>'
					+		'<input type="button" class="btn btn-primary" onclick="cellList.clearTextarea(\''+id+'\');" style="margin-left:10px;" value="清 空" />'
					+		'<input type="button" class="btn btn-primary" onclick="cellList.showModal(\''+id+'\');" style="margin-left:10px;" value="自助筛选" />'
					+		'<br />'
					+		'<div style="display:inline-block;color:red;font-size:12px;">'
					+			'注：多个小区LAC-CI请换行添加，例：<br />&nbsp;'
					+		'</div>'
					+		'<div style="display:inline-block;color:red;font-size:12px;">115757-33<br />115757-43</div>'
					+	'</div>'
					+	'<div id="'+id+'_modal" class="modal fade" data-backdrop="static">'
					+		'<div class="modal-dialog" style="width:95%;min-width:800px;">'
					+			'<div class="modal-content">'
					+				'<div class="modal-header">'
					+					'<button class="close" data-dismiss="modal">'
					+						'<span aria-hidden="true">'
					+							'<img src="../../static/reportManageSys/images/close.png"/>'
					+						'</span>'
					+						'<span class="sr-only"></span>'
					+					'</button>'
					+					'<h4 class="modal-title">自助筛选小区</h4>'
					+				'</div>'
					+				'<div class="modal-body">'
					+					'<div style="border: 1px solid rgb(232, 232, 232); padding-top: 10px;">'
					+						'<div style="display: inline-block; margin-left: 1%;width: 20%;">'
					+							'<div><input id="'+id+'_CELL_NT_cbox" type="checkbox" onchange="cellList.totalCheckEvent(this, \''+id+'_CELL_NT\');">网络类型</div>'
					+							'<div id="'+id+'_CELL_NT" style="height: 220px;overflow-y: auto; border: 1px solid #99bbe8"></div>'
					+						'</div>'
					+						'<div style="display: inline-block; margin-left: 1%; width: 27%;">'
					+							'<div><input id="'+id+'_DEPENDENCY_cbox" type="checkbox" onchange="cellList.totalCheckEvent(this, \''+id+'_DEPENDENCY\');">地市分公司</div>'
					+							'<div id="'+id+'_DEPENDENCY" style=" height: 220px; overflow-y: auto; border: 1px solid #99bbe8"></div>'
					+						'</div>'
					+						'<div style="display: inline-block; margin-left: 1%; width: 20%;">'
					+							'<div><input id="'+id+'_FACTORY_cbox" type="checkbox" onchange="cellList.totalCheckEvent(this, \''+id+'_FACTORY\');">厂商</div>'
					+							'<div id="'+id+'_FACTORY" style="height: 220px; overflow-y: auto; border: 1px solid #99bbe8"></div>'
					+						'</div>'
					+						'<div style="display: inline-block; margin-left: 1%; width: 27%;">'
					+							'<div><input id="'+id+'_STATIONCATALOG_cbox" type="checkbox" onchange="cellList.totalCheckEvent(this, \''+id+'_STATIONCATALOG\');">小区覆盖范围</div>'
					+							'<div id="'+id+'_STATIONCATALOG" style="height: 220px; overflow-y: auto; border: 1px solid #99bbe8"></div>'
					+						'</div>'
					+					'</div>'
					+					'<div style="padding: 5px 0;">'
					+							'小区名称：'
					+							'<input type="text" id="'+id+'_cellname"/>'
					+							' LAC-CI：'
					+							'<input type="text" id="'+id+'_lacci"/>'
					+							'<input type="button" class="btn btn-success" onclick="cellList.query(\''+id+'\');" style="margin-left:5px;" value="查 询">'
					+							'<input type="button" class="btn btn-success" onclick="cellList.resetQuery(\''+id+'\');" style="margin-left:5px;" value="重 置">'
					+						'</div>'
					+					'<div class="con_list" style="width:55%;border-top: 1px solid #e8e8e8;display: inline-block;">'
					+						'<div class="con_chart">'
					+							'<div id="'+id+'_cell_grid_div" style="border: 1px solid #e7e7e7;">'
					+								'<table id="'+id+'_cell_grid" style="width:70%;"></table>'
					+								'<div id="'+id+'_cell_grid_pager"></div>'
					+							'</div>'
					+							'<div class="clear"></div>'
					+						'</div>'
					+					'</div>'
					+					'<div style="height: 400px;overflow: auto;display: inline-block;">'
					+						'<input type="button" style="position:relative;top:165px;padding:2px 10px;margin:0 5px;" class="btn btn-success" onclick="cellList.addTr(\''+id+'\');" value="→">'
					+					'</div>'
					+					'<div style="width: 39%;height: 400px;overflow: auto;display: inline-block;border: 1px solid #e8e8e8;padding-left:20px;padding-right:10px;">'
					+						'<table id="'+id+'_cellTable" style="width: 100%;">'
					+							'<thead>'
					+								'<tr>'
					+									'<td>小区名称</td>'
					+									'<td style="display:none;">LAC-CI</td>'
					+									'<td style="width:40px;cursor: pointer;" onclick="cellList.clearVirtualTr(\''+id+'\');">'
					+										'<img style="width: 34px; height: 34px ;" src="../../static/reportManageSys/images/closehong.png">'
					+									'</td>'
					+								'</tr>'
					+							'</thead>'
					+							'<tbody></tbody>'
					+						'</table>'
					+					'</div>'
					+				'</div>'
					+				'<div class="modal-footer">'
					+	                '<center>'
					+	                    '<button class="btn btn-primary" onclick="cellList.addTextarea(\''+id+'\');">确 定</button>'
					+	                    '<button class="btn btn-default" data-dismiss="modal">取 消</button>'
					+	                '</center>'
					+	            '</div>'
					+			'</div>'
					+		'</div>'
					+	'</div>';
			        
	 //--------------------------------------------------------------------------------------------------------------------------
		innerHTML += '<p style="display:none">{label:"' + zujianLabel + '",type:"' + type + '",id:"' + id + '",isRequire:"' + isRequire + '"}</p>' +
			   '</span>';
		return innerHTML;
	},
	getcomboCheckbox: function(zujianLabel, id, type, isRequire, xialaType) {
		//根据xialaType, 查复选框id
		var firstUrl = "",
			query = configUrl_main.query,
			param = {
				"ifId" : xialaType
			},
			paramStr = JSON.stringify(param);
		if (query.indexOf("sml") != -1) {
			firstUrl = eastcom.baseURL + configUrl_main.query + "/" + xialaType;
		} else {
			firstUrl = eastcom.baseURL + configUrl_main.query;
		}
		var radioArr = "";
		$.ajax({
			url: firstUrl,
			//url :eastcom.baseURL+"/srpt/rcpt/common/query" ,
			type: 'POST',
			async: false,
			dataType: "json",
			contentType: "application/json",
			data: paramStr,
			success: function(data){
				radioArr = data.data;
			}
		});
		
		var metroObj = {
			"地铁1号线" : "metro_1",
			"地铁2号线" : "metro_2",
			"地铁3号线" : "metro_3",
			"地铁4号线" : "metro_4",
			"地铁5号线" : "metro_5",
			"地铁6号线" : "metro_6",
			"地铁7号线" : "metro_7",
			"地铁8号线" : "metro_8",
			"地铁9号线" : "metro_9",
			"地铁10号线" : "metro_10",
			"地铁11号线" : "metro_11",
			"地铁12号线" : "metro_12",
			"地铁13号线" : "metro_13",
			"地铁16号线" : "metro_16"
		};
		
		
		var htmlRadio = '',
			htmlCheckbox = '';
		for(var i=0, len=radioArr.length; i<len; i++){
			var radio = radioArr[i],
				radio_id = radio.id,
				radio_name =radio.value1;
			var checked = "";
			htmlRadio += ''
				+'<span style="width:130px;display:inline-block;">'
				+	'<input type="radio" name="'+id+'_comboCheckbox" value="'+radio_id+'" '+(i===0? 'checked="checked"' : '')
				+		'style="margin-left:0;" onclick="comboCheckbox.changeRadio(\''+id+'\', this);"/>'+radio_name
				+'</span>';
				
			//请求真实CheckBox
			var ajaxUrl = "",
				ajaxParam = {
					"ifId" : radio_id
				},
				ajaxParamStr = JSON.stringify(ajaxParam);
			if (query.indexOf("sml") != -1) {
				ajaxUrl = eastcom.baseURL + configUrl_main.query + "/" + radio_id;
			} else {
				ajaxUrl = eastcom.baseURL + configUrl_main.query;
			}
			var checkboxArr = "";
			$.ajax({
				url: ajaxUrl,
				//url :eastcom.baseURL+"/srpt/rcpt/common/query" ,
				type: 'POST',
				async: false,
				dataType: "json",
				contentType: "application/json",
				data: ajaxParamStr,
				success: function(data){
					checkboxArr = data.data;
				}
			});
			
			htmlCheckbox += '<div id="'+id+'_'+radio_id+'" '+(i===0?"" : "style='display:none;'" )+'>';
			for(var j=0, length=checkboxArr.length; j<length; j++){
				var checkbox = checkboxArr[j],
					checkbox_val = checkbox.id,
					checkbox_name = checkbox.value1;
				htmlCheckbox += ''
							+'<span style="width:130px;display:inline-block;">'
							+	'<input type="checkbox" style="margin-left:0;" '
							+		'value="'+checkbox_val+'"/>';
				if(radio_id === "srpt-enum-metro"){
					htmlCheckbox += '<img style="height:36px" src="'+contextPath+'/static/reportManageSys/images/'+metroObj[checkbox_name]+'.png" />';
				}else{
					htmlCheckbox += checkbox_name;
				}
				htmlCheckbox += '</span>';
			}
			htmlCheckbox += '</div>';
		}
		
		var innerHTML = '<span id="' + id + '" name="otherSpecialCondition" style="min-height:156px;padding: 10px;overflow-y:auto; display: inline-block; border: 0px solid #e8e8e8; width: 94%;margin-bottom: 5px;">';
		//-----------------------------------------------------------------------------------------
		innerHTML += ''
			+'<div id="'+id+'_radio"'
			+	'style="border-bottom:1px solid #e8e8e8;padding-bottom: 3px;margin-bottom: 3px;">'
			+	'<span style="float: right;">'
			+		'<input id="'+id+'_checkAll" type="checkbox" value="'+radioArr[0].id+'"'
			+			'onclick="comboCheckbox.checkAll(\''+id+'\', this);"/>全选'
			+	'</span>'
			+ 	htmlRadio
			+'</div>'
			+'<div id="'+id+'_checkbox">'
			+	htmlCheckbox
			+'</div>';
//----------------------------------------------------------------------------------
		innerHTML += '<p style="display:none">{label:"' + zujianLabel + '",type:"' + type + '",id:"' + id + '",isRequire:"' + isRequire + '",xialaType:"' + xialaType + '"}</p>' +
				'</span>';
		return innerHTML;
	}

};

var suppleMethod = {
	checkAll: function(vals) {
		$("#list_left_" + vals).find('span').each(function(index, el) {
			$(this).css('display', 'none');
		});
		$("#list_right_" + vals).find('span').each(function(index, el) {
			$(this).css('display', 'block');
		});
	},
	checkPart: function(vals) {

		var selectStr = $("#" + vals).find($("#list_left_input_" + vals)).val();
		if (selectStr == "" || selectStr == " ") {
			alert("请选择指标!");
			return;
		};
		var selectArr = selectStr.split(",");
		$("#" + vals).find($("#list_left_input_" + vals)).val("");
		for (var i = 0; i < selectArr.length; i++) {
			//隐藏选中的指标
			$("#list_left_" + vals).find('span[avalue = "' + selectArr[i] + '"]').css('display', 'none').removeClass('on');
			//显示选中的指标
			$("#list_right_" + vals).find('span[avalue = "' + selectArr[i] + '"]').css('display', 'block');
		};
	},
	delPart: function(vals) {
		var selectStr = $("#" + vals).find($("#list_right_input_" + vals)).val();
		if (selectStr == "" || selectStr == " ") {
			alert("请选择指标!");
			return;
		};
		var selectArr = selectStr.split(",");
		$("#" + vals).find($("#list_right_input_" + vals)).val("");
		for (var i = 0; i < selectArr.length; i++) {
			//隐藏选中的指标
			$("#list_right_" + vals).find('span[avalue = "' + selectArr[i] + '"]').css('display', 'none').removeClass('on');
			//显示选中的指标
			$("#list_left_" + vals).find('span[avalue = "' + selectArr[i] + '"]').css('display', 'block');
		};
	},
	delAll: function(vals) {
		$("#list_right_" + vals).find('span').each(function(index, el) {
			$(this).css('display', 'none');
		});
		$("#list_left_" + vals).find('span').each(function(index, el) {
			$(this).css('display', 'block');
		});
	},
	addComponentSource_getleftrightkuang: function() {
		var key = 0; //记录ctrl/shift键  
		var val = ","; //记录已经选择的值  
		var ibe = -1; //记录初始值  
		$(document).keydown(function(e) {
			if (e.ctrlKey) {
				key = 1;
			} else if (e.shiftKey) {
				key = 2;
			};
			//$("#bb").val("初始值:"+ibe+" key:"+key);  
		}).keyup(function() {
			key = 0;
		});
		$("#list_left span").click(function() {
			var i = $(this).index();
			if (ibe != -1 && key == 2) {
				$(this).siblings().removeAttr("class");
				val = "";
				for (var ii = Math.min(i, ibe); ii <= Math.max(i, ibe); ii++) {
					val += ii + ",";
					$("#list_left span").eq(ii).addClass("on");
				};
			} else if (key == 1) {
				if (val.indexOf("," + i + ",") != -1) {
					val = val.replace(i + ",", ",");
					$(this).removeAttr("class");
				} else {
					val += i + ",";
					$(this).addClass("on");
					ibe = i;
				};
			} else {
				$(this).addClass("on").siblings().removeAttr("class");
				ibe = i;
				val = i + ",";
			};
			var valArr = val.split(",");
			var zhenValue = [];
			for (var i = 0; i < valArr.length; i++) {
				zhenValue.push($("#" + valArr[i]).attr('avalue'));
			};
			$("#list_left_input").val(zhenValue);
		});
		$("#list_right span").click(function() {
			var i = $(this).index();
			if (ibe != -1 && key == 2) {
				$(this).siblings().removeAttr("class");
				val = "";
				for (var ii = Math.min(i, ibe); ii <= Math.max(i, ibe); ii++) {
					val += ii + ",";
					$("#list_right span").eq(ii).addClass("on");
				};
			} else if (key == 1) {
				if (val.indexOf("," + i + ",") != -1) {
					val = val.replace(i + ",", ",");
					$(this).removeAttr("class");
				} else {
					val += i + ",";
					$(this).addClass("on");
					ibe = i;
				};
			} else {
				$(this).addClass("on").siblings().removeAttr("class");
				ibe = i;
				val = i + ",";
			};
			var valArr = val.split(",");
			var zhenValue = [];
			for (var i = 0; i < valArr.length; i++) {
				zhenValue.push($("#" + valArr[i]).attr('avalue'));
			};
			$("#list_right_input").val(zhenValue);
		});
	},
	showComponentSource_getleftrightkuang: function(id) {
		var key = 0; //记录ctrl/shift键  
		var val = ","; //记录已经选择的值  
		var ibe = -1; //记录初始值  
		$(document).keydown(function(e) {
			if (e.ctrlKey) {
				key = 1;
			} else if (e.shiftKey) {
				key = 2;
			};
			//$("#bb").val("初始值:"+ibe+" key:"+key);  
		}).keyup(function() {
			key = 0;
		});
		$("#" + id).find($(".shiftCtrl_left span")).click(function() {
			var i = $(this).index();
			if (ibe != -1 && key == 2) {
				$(this).siblings().removeAttr("class");
				val = "";
				for (var ii = Math.min(i, ibe); ii <= Math.max(i, ibe); ii++) {
					val += ii + ",";
					$("#" + id).find($(".shiftCtrl_left span")).eq(ii).addClass("on");
				};
			} else if (key == 1) {
				if (val.indexOf("," + i + ",") != -1) {
					val = val.replace(i + ",", ",");
					$(this).removeAttr("class");
				} else {
					val += i + ",";
					$(this).addClass("on");
					ibe = i;
				};
			} else {
				$(this).addClass("on").siblings().removeAttr("class");
				ibe = i;
				val = i + ",";
			};
			var valArr = val.split(",");
			var zhenValue = [];
			for (var i = 0; i < valArr.length; i++) {
				zhenValue.push($("#" + id + "_" + valArr[i]).attr('avalue'));
			};
			$("#list_left_input_" + id).val(zhenValue);
		});
		$("#" + id).find($(".shiftCtrl_right span")).click(function() {
			var i = $(this).index();
			if (ibe != -1 && key == 2) {
				$(this).siblings().removeAttr("class");
				val = "";
				for (var ii = Math.min(i, ibe); ii <= Math.max(i, ibe); ii++) {
					val += ii + ",";
					$("#" + id).find($(".shiftCtrl_right span")).eq(ii).addClass("on");
				};
			} else if (key == 1) {
				if (val.indexOf("," + i + ",") != -1) {
					val = val.replace(i + ",", ",");
					$(this).removeAttr("class");
				} else {
					val += i + ",";
					$(this).addClass("on");
					ibe = i;
				};
			} else {
				$(this).addClass("on").siblings().removeAttr("class");
				ibe = i;
				val = i + ",";
			};
			var valArr = val.split(",");
			var zhenValue = [];
			for (var i = 0; i < valArr.length; i++) {
				zhenValue.push($("#" + id + "_" + valArr[i]).attr('avalue'));
			};
			$("#list_right_input_" + id).val(zhenValue);
		});
	},

	//复选框
	allCheckBox: function(id) {
		var check = $("#all_" + id).is(':checked');
		$("#" + id).find('input[name = "' + id + '"]').each(function(index, el) {
			$(this).prop("checked", check);
		});

	}
};

//onmousedown
function onrightdown() {

	$("span[name = 'img_']").mousedown(function(event) {
		var tip = $("#mm1");
		var event2 = event ? event : window.event;
		if (event2.button == 2) {
			tip.css("margin-left", event2.clientX + "px").css("margin-top", event2.clientY + "px");
			tip.css("display", "block");
		};

	});
};

var demoselect = {
	selectCurrDemo: function(obj, type) {
		//判断点击第一次选中,第二次取消选中 
		var sc = $(obj).attr('sc');
		if (type == "shebei") {
			if (sc == 0) {
				//清空选中和选中的值
				$("span[name='span_wenben']").each(function(index, el) {
					$(this).attr('sc', '0');
				});
				$("img[name='img_demo_shebei']").each(function(index, el) {
					$(this).attr('src', '../../static/reportManageSys/images/wenben_demo_shebei_wu.png');
					$(this).next('b').find('span').css("color","#000");
				});
				$("img[name='img_demo_duankou']").each(function(index, el) {
					$(this).attr('src', '../../static/reportManageSys/images/wenben_demo_duankou_wu.png');
					$(this).next('b').find('span').css("color","#000");
				});
				//选中选中和选中的值
				$(obj).find('img').attr('src', '../../static/reportManageSys/images/wenben_demo_shebei.png');
				$(obj).find('b').find('span').css("color","red");
				$(obj).attr('sc', '1');
			} else {
				$(obj).find('img').attr('src', '../../static/reportManageSys/images/wenben_demo_shebei_wu.png');
				$(obj).find('b').find('span').css("color","#000");
				$(obj).attr('sc', '0');
			};
		} else if (type == "duankou") {
			if (sc == 0) {
				//清空选中和选中的值
				$("span[name='span_wenben']").each(function(index, el) {
					$(this).attr('sc', '0');
				});
				$("img[name='img_demo_duankou']").each(function(index, el) {
					$(this).attr('src', '../../static/reportManageSys/images/wenben_demo_duankou_wu.png');
					$(this).next('b').find('span').css("color","#000");
				});
				$("img[name='img_demo_shebei']").each(function(index, el) {
					$(this).attr('src', '../../static/reportManageSys/images/wenben_demo_shebei_wu.png');
					$(this).next('b').find('span').css("color","#000");
				});
				//选中选中和选中的值
				$(obj).find('img').attr('src', '../../static/reportManageSys/images/wenben_demo_duankou.png');
				$(obj).find('b').find('span').css("color","red");
				$(obj).attr('sc', '1');
			} else {
				$(obj).find('img').attr('src', '../../static/reportManageSys/images/wenben_demo_duankou_wu.png');
				$(obj).find('b').find('span').css("color","#000");
				$(obj).attr('sc', '0');
			};
		} else {
			console.log("模板定位选错了");
		};
	},
	showDetailInfo: function(obj) {

		var name = $(obj).find('span').eq(0).html();
		var id = $(obj).find('span').eq(1).html();
		$("#demo_name").val(name);
		$("#showDetailInfo").modal("toggle");
		//加载模板信息
		var dataABC = {
			"ifId": "srpt-cfg-deviceQueryModelInfoToOne",
			"tpl_id": id
		};
		var dataStrABC = JSON.stringify(dataABC);
		var resABC = commonAjax(configUrl_main.query + "/srpt-cfg-deviceQueryModelInfoToOne", dataStrABC, "", "");
		//var resABC = commonAjax("/srpt/rcpt/common/query",dataStrABC,"","");  
		if (resABC.success) {
			var currObj = resABC.data[0];
			$("#demo_name").val(currObj.tpl_name);
			//$("#demo_remark").val(currObj.demo_remark); 
			$("#demo_bandWidth").val(currObj.descr);
		};
		//加载树(关系)   
		var dataABCD = {
			"id": id
		};
		var dataStrABCD = JSON.stringify(dataABCD);
		var resABCD = commonAjax(configUrl_main.rcpt_model_getArrangedTree, dataStrABCD, "", "");
		if (resABCD.success) {
			//获取数据
			//var data = demoselect.changeRightTreeData(resABCD.data); 
			var data = "";
			if (resABCD.data[0].device_id == "0") {
				data = demoselect.changeRightTreeData_shebei(resABCD.data);
			} else {
				data = demoselect.changeRightTreeData(resABCD.data);
			};
			$("#tree_right").html("");
			var initData = [{
				"id": 0,
				"text": "设备分类",
				"state": "closed",
				"iconCls": "icon-shebeifenlei",
				"attributes": {
					"ishasChilds": true
				},
				"children": data
			}];
			$('#tree_left').tree({
				data: initData,
				lines: true,
				animate: true,
				//checkbox : true,
				onBeforeExpand: function(node) {

				},
				onContextMenu: function(e, node) {

				},
				onDblClick: function(node) {

				}
			}); //tree
			//查询之后展开
			var firstTree = $('#tree_left').tree('find', 0);
			$('#tree_left').tree('expand', firstTree.target);
		};
	},
	addBackground: function(obj) {
		//$(obj).find('img').attr('src', '../../static/reportManageSys/images/wenben_demo.png');
	},
	delBackground: function(obj) {
		//$(obj).find('img').attr('src', '../../static/reportManageSys/images/wenben_demo_wu.png');
	},
	changeRightTreeData_shebei: function(data) {

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
					array_two = demoselect.changeRightTreeData_second(data[i].children, data[i].device_id, data[i].sys_name);
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
	changeRightTreeData: function(data) {
		var array = [];
		var flag = false; //判断是否有子文件
		if (data.length > 0) {
			for (var i = 0; i < data.length; i++) {
				var object = {};
				object.id = data[i].device_id;
				object.text = data[i].sys_name;
				var array_two = "";
				if (data[i].children.length > 0) {
					flag = true;
					object.attributes = {
						"ishasChilds": true,
						"parent_id": 0
					};
					array_two = demoselect.changeRightTreeData_second(data[i].children, data[i].device_id, data[i].sys_name);
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
	}
	
};

var leftrightliandong = {
	clicking: function(obj, id) { //id 为当前组件的id
		//修改选中的样式
		$(obj).siblings().css("background", "#fff");
		$(obj).css('background', '#e6e6e6');
		//修改联动的数据
		var datas = "";
		var ifid = $(obj).attr('valueUrl');

		var data = {
			"ifId": ifid
		}; //地市参数
		var dataStr = JSON.stringify(data);
		//------------------------------------------------
		var ajaxUrl = "";
		var query = configUrl_main.query;
		if (query.indexOf("sml") != -1) {
			ajaxUrl = eastcom.baseURL + configUrl_main.query + "/" + ifid;
		} else {
			ajaxUrl = eastcom.baseURL + configUrl_main.query ;
		};
		//------------------------------------------------
		$.ajax({
			url: ajaxUrl,
			//url :eastcom.baseURL+"/srpt/rcpt/common/query" ,
			type: 'POST',
			async: false,
			dataType: "json",
			contentType: "application/json",
			data: dataStr,
			success: function(data) {
				datas = data.data;
			}
		});

		var result_span = $("#" + id).find('span[name="result_span"]').eq(0);

		var m = 0;
		var innerHTML = "";
		for (var item in datas) {
			var key_id = "";
			var key_name = "";
			var i = 0;
			var j = 0;
			if (i < 1) {
				$.each(datas[item], function(key, val) {
					if (j == 0) {
						key_id = key;
					};
					if (j == 1) {
						key_name = key;
					};
					j++;
				});
				i++;
			};

			innerHTML += '<span id="' + m + '" avalue="' + datas[item][key_id] + '" style="display: block;">' + datas[item][key_name] + '</span>'
			m++;

		};

		result_span.html(innerHTML);

	},
};
var convergeCheckbox = {
         allcheck : function(obj,id){
                   $("#otherCondition").find("#"+id).find('input[name = "'+id+'_convergeCheckbox"]').prop("checked", obj.checked);    
         },
         init : function(){

         }
};
var convergeCheckboxDetail = {
         allcheck : function(obj,id){
                   $("#otherCondition").find("#"+id).find('input[name = "'+id+'_convergeCheckboxDetail"]').prop("checked", obj.checked);    
         },
         init : function(){

         }
};
var demoselectNew = {
            getDiv : function(type,id){
                  $('#'+id).find('li').removeClass('hover');
                  $('#'+id).find('li[name="tabmenue_'+type+'"]').addClass('hover');
                  $('#'+id).find("div[id*='div_']").each(function(index, el) {
                  	    $(this).css("display", "none");
                  });
                  $("#div_" + type).css("display", "block");

                  if(type == "tiaojian"){
                       $("#showRadiodemoselectNew").css('display', 'inline-block');
                  }else{
                       $("#showRadiodemoselectNew").css('display', 'none');
                  }
            },
            seekQuery : function(id){
                  var device_name = $("#"+id+"_device_name").val();
                  var device_room = $("#"+id+"_device_room").val();
                  var device_ipAdress = $("#"+id+"_device_ipAdress").val();
                  var business_system = $("#"+id+"_business_system").val();
                  var port_cname = $("#"+id+"_port_cname").val();
                  var port_ipAdress = $("#"+id+"_port_ipAdress").val();
            	  var data = {
	            	  	"device_id": "",
	            	  	"device_name": device_name,
	            	  	"room" :device_room,
	            	  	"device_ip": device_ipAdress,
	            	  	"device_service_name": business_system,
	            	  	"inter_alias": port_cname,
	            	  	"in_ip": port_ipAdress
            	  };
            	  var dataStr = JSON.stringify(data);
            	  $("#"+id+"_tree_tiaojian").html("");
            	  $("#"+id+"_tree_tiaojian_div").mask("数据正在加载中,请稍等....");
            	  $.ajax({
	  			        url :eastcom.baseURL+configUrl_main.rcpt_model_getFullMenu ,
	  			        type : 'POST',
	  			        async : true,
	  			        dataType : "json",
	  			        contentType :"application/json",
	  			        data:dataStr,
	  			        success : function(res) {
		               	  var initData = demoselectNew.transLeftTreeData(res.data, 0);
	  			          var allData = [{
											"id": 0,
											"text": "全部选择",
											"state": "open",
											"iconCls":"tree-self-folder",
											"attributes": {
												"ishasChilds": true
											 },
                                             children : initData
										}]	
		                     $("#"+id+"_tree_tiaojian").tree({
		                     	data: allData,
		                     	lines: false,
		                     	animate: true,
		                     	checkbox: true,
		                     	onBeforeExpand: function(node) {
		                     		//http://localhost:7080/web-selfReport-special/rcpt/model/getFullMenu 

		                     		//var port_type_self = $("#port_type").val();
		                     		var port_type_self = "duankou";
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
		                     				"room" :device_room,
		                     				"device_ip": device_ipAdress,
		                     				"device_service_name": business_system,
		                     				"inter_alias": port_cname,
		                     				"in_ip": port_ipAdress
		                     			};

		                     			var dataStr = JSON.stringify(data);
             			            	$.ajax({
             				  			        url :eastcom.baseURL+configUrl_main.rcpt_model_getFullMenu ,
             				  			        type : 'POST',
             				  			        async : true,
             				  			        dataType : "json",
             				  			        contentType :"application/json",
             				  			        data:dataStr,
             				  			        success : function(res) {
             				  			             var arr = demoselectNew.transLeftTreeData(res.data, node_id);
             				  			             var parent = $("#"+id+"_tree_tiaojian").tree('find', node.id);
             				  			             var childrens = $("#"+id+"_tree_tiaojian").tree('getChildren', parent.target);
             				  			             for (var i = 0; i < childrens.length; i++) {
             				  			             	$("#"+id+"_tree_tiaojian").tree('remove', childrens[i].target);
             				  			             };
             				  			             $("#"+id+"_tree_tiaojian").tree("append", {
             				  			             	parent: parent.target,
             				  			             	data: arr
             				  			             });
             				  			             $(parent.target).next().show();  //防止加载后不显示,需要再次点击
             				  			        },
             				  			        beforeSend: function () {
             				  			            $(node.target).children('span.tree-icon').addClass('treeLoading');
             				  			        },
             				                    complete: function(XMLHttpRequest, textStatus){
             				  			                  $(node.target).children('span.tree-icon').removeClass('treeLoading');
             				  		            },
             				  		            error: function(){
             				  			              //请求出错处理
             				  						  eastcom.showMsg("danger","请求异常,数据加载失败!");
             				  		            }
             				  			});
		                     			

		                     		};

		                     	},
		                     	onContextMenu: function(e, node) {

		                     	},
		                     	onDblClick: function(node) {

		                     	}
		                     }); //tree
	  			        	
	  			        },
	                    complete: function(XMLHttpRequest, textStatus){
	  						      $("#"+id+"_tree_tiaojian_div").unmask();
	  		            },
	  		            error: function(){
	  			              //请求出错处理
	  						  eastcom.showMsg("danger","请求异常,数据加载失败!");
	  		            }
	  			});
            	  
            },
            transLeftTreeData: function(data, flag) { // flage = 0 文件夹
            	var arr = [];
            	if (data == null) {
            		return;
            	};
            	var port_type_self = $("#port_type").val();
            	//var port_type_self = "duankou";
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
            zhankaiOrshousuo : function(id,name,currId,divId){
                                 
                        if (name == "_first_UpDown") {
                        	$('span[name = "'+id+'_first_UpDown"]').css('display', 'none');
                        	if (currId == "_first_UpDown_Up") {
                        	       $("#"+id+"_first_UpDown_Down").css('display', 'inline-block');
                        	       $("#"+id+"_"+divId+"_div").css('display', 'none');
                        	       $("#"+id+"_"+divId+"_div").parent("div").height(15);
                        	};
                        	if (currId == "_first_UpDown_Down") {
                        	       $("#"+id+"_first_UpDown_Up").css('display', 'inline-block');
                        	       $("#"+id+"_"+divId+"_div").css('display', 'block');
                        	       $("#"+id+"_"+divId+"_div").parent("div").height(135);
                        	};
                        }else if (name == "_two_UpDown"){
                            $('span[name = "'+id+'_two_UpDown"]').css('display', 'none');
                            if (currId == "_two_UpDown_Up") {
                        	       $("#"+id+"_two_UpDown_Down").css('display', 'inline-block');
                        	       $("#"+id+"_"+divId+"_div").css('display', 'none');
                        	       $("#"+id+"_"+divId+"_div").parent("div").height(15);
                        	};
                        	if (currId == "_two_UpDown_Down") {
                        	       $("#"+id+"_two_UpDown_Up").css('display', 'inline-block');
                        	       $("#"+id+"_"+divId+"_div").css('display', 'block');
                        	       $("#"+id+"_"+divId+"_div").parent("div").height(135);
                        	};
                        }else{};
                        //eastcom.syncIframeHeight();


            },
            bindRightEvent_sys : function(id){
            	     //alert("右键了..."+id);
            	     var e = window.event;
            	     e.preventDefault();
            	     $('#mmDemoRightDiv_sys').menu('show', {
            	     	left: e.pageX,
            	     	top: e.pageY
            	     });
            	     $("#mmDemoRightDivTtr_sys").html(id);
            },
            bindRightEvent_user : function(id){
            	     //alert("右键了..."+id);
            	     var e = window.event;
            	     e.preventDefault();
            	     $('#mmDemoRightDiv_user').menu('show', {
            	     	left: e.pageX,
            	     	top: e.pageY
            	     });
            	     $("#mmDemoRightDivTtr_user").html(id);
            },
            seekDemoInfoR : function(param){
            	     $("#seekDemoInfo").modal("toggle");
            	     var id = "mmDemoRightDivTtr_sys";
            	     if (param == "user") {id = "mmDemoRightDivTtr_user";};
            	     var currDemoId = $("#"+id).html();
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
            	     	$("#tpl_name_seek").val(currObj.tpl_name);
            	     	$("#descr_seek").val(currObj.descr); 
            	     	$("#bandwidth_seek").val(currObj.bandwidth); 
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
            	     	/*var data = demoselectNew.changeRightTreeData(resABCD.data);*/

            	     	var data = "";
            	     	if (resABCD.data[0].device_id == "0") {
            	     		data = demoselectNew.changeRightTreeData_shebei(resABCD.data);
            	     	} else {
            	     		data = demoselectNew.changeRightTreeData(resABCD.data);
            	     	};


            	     	$("#tree_seekDemo").html("");

            	     	$('#tree_seekDemo').tree({
            	     		//data:data,
            	     		lines: false,
            	     		animate: true,
            	     		checkbox: true
            	     	}); //tree
            	     	$('#tree_seekDemo').tree("append", {
            	     		data: data
            	     	});
            	     } else {
            	     	alert("加载模板信息出错!");
            	     };
            },
            addNewDemo : function(param){  //  sys user
            	    $("#addAndAlterDemo").modal("toggle");
            	    $("#addAndAlterDemo").css("top","0");
            	    $("#addAlterDemo_header").css("padding","8px 6px 8px 15px;");
            	    $("#addAlterDemo_title").html("新增模板");
            	    $("#tree_right_new").html("");
            	    $("#tpl_name").val("");
            	    $("#descr").val("");
            	    $("#bandwidth").val("");
                    $("#sys_user").html(param); 
            },
            alterDemo : function(param){
            	    $("#addAndAlterDemo").modal("toggle");
            	    $("#addAndAlterDemo").css("top","0");
            	    $("#addAlterDemo_header").css("padding","8px 6px 8px 15px;");
            	    $("#addAlterDemo_title").html("修改模板");
            	    $("#port_type").attr('disable', 'true');
                    $("#tree_right_new").html("");
                    $("#sys_user").html(param);
                    var id = "mmDemoRightDivTtr_sys";
                    if (param == "user") {id = "mmDemoRightDivTtr_user";};
                    demoselectNew.reShow(id); 


            },
            reShow: function(id) {
            	
            	var currDemoId = $("#"+id).html();
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
            		$("#sys_user").html(currObj.tpl_sys_user);
            		$("#tpl_name").val(currObj.tpl_name);
            		//$("#comment").val(currObj.comment); 
            		$("#descr").val(currObj.descr);
            		$("#bandwidth").val(currObj.bandwidth);
            		$("#port_type").val(currObj.type);
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
            		/*var data = demoselectNew.changeRightTreeData(resABCD.data);*/

            		var data = "";
            		if (resABCD.data[0].device_id == "0") {
            			data = demoselectNew.changeRightTreeData_shebei(resABCD.data);
            		} else {
            			data = demoselectNew.changeRightTreeData(resABCD.data);
            		};


            		$("#tree_right_new").html("");

            		$('#tree_right_new').tree({
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
            		$('#tree_right_new').tree("append", {
            			data: data
            		});


            	} else {
            		alert("加载模板信息出错!");
            	};
            	//------------------------------------------------------
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
        					array_two = demoselectNew.changeRightTreeData_second(data[i].children, data[i].device_id, data[i].sys_name);
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
        					array_two = demoselectNew.changeRightTreeData_second(data[i].children, data[i].device_id, data[i].sys_name);
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
        	delDemo: function() {
        		if (confirm("确认删除吗?")) {
        			
        			var currDemo_id = $("#mmDemoRightDivTtr_user").html();
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
        			demoselectNew.refreshCurrDemo();
        			//commonAjax("/srpt/rcpt/common/update",dataStrB,"",""); 

        			//刷选模板显示菜单
        			//demoConfig.initDemoNameList();
        		};
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
            	demoselectNew.clearRightTree_larji();
            },
            clearRightTree_larji: function() {
            	$("#tree_right_new_div").html("");
            	$("#tree_right_new_div").html('<ul id="tree_right_new"></ul>');
            },
            doQuery: function() {
            	
            	//左边数加载全部菜单
            	demoselectNew.initTree_Left();

            },
            initTree_Left: function() {
            	$("#tree_left_new").html("");
            	/*var initData = [{
            	           "id":0,
            	           "text":"设备分类",
            	           "state":"closed",
            	           "iconCls":"icon-shebeifenlei",
            	           "attributes":{"ishasChilds":true}
            	 }] */
            	//准备第一层数据----------------------------------------------------
            	var device_name = $("#device_name").val();
            	var device_machineRoom = $("#device_machineRoom").val();
            	var device_ipAdress = $("#device_ipAdress").val();
            	var business_system = $("#business_system").val();
            	var port_cname = $("#port_cname").val();
            	var port_ipAdress = $("#port_ipAdress").val();
            	var port_type = $("#port_type").val();
            	var data = {
            		"device_id": "",
            		"device_name": device_name,
            		"device_ip": device_ipAdress,
            		"device_service_name": business_system,
            		"inter_alias": port_cname,
            		"in_ip": port_ipAdress
            	};
            	var dataStr = JSON.stringify(data);
            	$('#tree_left_new_div').mask("数据正在加载中,请稍等....");
            	/*var res = commonAjax(configUrl_main.rcpt_model_getFullMenu, dataStr, "", "");
            	//var res = commonAjax("/rcpt/model/getFullMenu",dataStr,"","");
            	$('body').unmask();
            	var initData = demoselectNew.transLeftTreeData(res.data, 0);*/

        	    $.ajax({
  			        url :eastcom.baseURL+configUrl_main.rcpt_model_getFullMenu ,
  			        type : 'POST',
  			        async : true,
  			        dataType : "json",
  			        contentType :"application/json",
  			        data:dataStr,
  			        success : function(res) {
	               	  var initData = demoselectNew.transLeftTreeData(res.data, 0);
	                     $("#tree_left_new").tree({
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
                                	$.ajax({
                    	  			        url :eastcom.baseURL+configUrl_main.rcpt_model_getFullMenu ,
                    	  			        type : 'POST',
                    	  			        async : true,
                    	  			        dataType : "json",
                    	  			        contentType :"application/json",
                    	  			        data:dataStr,
                    	  			        success : function(res) {
                    	  			             var arr = demoselectNew.transLeftTreeData(res.data, node_id);
                    	  			             var parent = $('#tree_left_new').tree('find', node.id);
	             		            				 var childrens = $('#tree_left_new').tree('getChildren', parent.target);
	             		            				 for (var i = 0; i < childrens.length; i++) {
	             		            				 	$('#tree_left_new').tree('remove', childrens[i].target);
	             		            				 };
	             		            				 $('#tree_left_new').tree("append", {
	             		            					parent: parent.target,
	             		            					data: arr
	             		            				 });
                    	  			             $(parent.target).next().show();  //防止加载后不显示,需要再次点击
                    	  			        },
                    	  			        beforeSend: function () {
                    	  			            $(node.target).children('span.tree-icon').addClass('treeLoading');
                    	  			        },
                    	                    complete: function(XMLHttpRequest, textStatus){
                    	  			                  $(node.target).children('span.tree-icon').removeClass('treeLoading');
                    	  		            },
                    	  		            error: function(){
                    	  			              //请求出错处理
                    	  						  eastcom.showMsg("danger","请求异常,数据加载失败!");
                    	  		            }
                    	  			}); 

		            			};

		            		},
		            		onContextMenu: function(e, node) {

		            		},
		            		onDblClick: function(node) {

		            		}
		            	}); //tree
		            },
		            complete: function(XMLHttpRequest, textStatus){
			  				$("#tree_left_new_div").unmask();
  		            },
  		            error: function(){
  			              //请求出错处理
  						  eastcom.showMsg("danger","请求异常,数据加载失败!");
  		            }
                });
            },    
            addRightMove: function() {
            	var port_type_self = $("#port_type").val();
            	if (port_type_self == "shebei") {
            		var nodesArr = $('#tree_left_new').tree('getChecked');

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
            		$('#tree_right_new').tree({
            			//data:[],
            			lines: false,
            			animate: true,
            			checkbox: true
            		}); //tree

            		var bigArrZ = [];
            		var getData = $("#tree_right_new").tree("getRoots");
            		if (getData == null || getData.length == 0) {
            			bigArrZ = bigArr;
            		} else {
            			bigArrZ = demoselectNew.removeExistRightTee(bigArr, getData);
            		};



            		$('#tree_right_new').tree("append", {
            			data: bigArrZ
            		});
            	} else if (port_type_self == "duankou") {
            		$("#tree_right_new_div").mask("数据正在加载中,请稍等....");
            		var nodesArr = $('#tree_left_new').tree('getChecked');
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
            		var device_name = $("#device_name").val();
            		var device_machineRoom = $("#device_machineRoom").val();
            		var device_ipAdress = $("#device_ipAdress").val();
            		var business_system = $("#business_system").val();
            		var port_cname = $("#port_cname").val();
            		var port_ipAdress = $("#port_ipAdress").val();
            		var port_type = $("#port_type").val();
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
            					var _smallObj = {"attributes":{"device_id":""}};
            					_smallObj.id = res.data[k].id;
            					_smallObj.text = res.data[k].name;
            					_smallObj.attributes.device_id = all_device_id_arr[j];
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


            		$("#tree_right_new_div").unmask();
            		$('#tree_right_new').tree({
            			//data:data,
            			lines: false,
            			animate: true,
            			checkbox: true
            		}); //tree
            		var bigArrZ = [];
            		var getData = $("#tree_right_new").tree("getRoots");
            		if (getData == null || getData.length == 0) {
            			bigArrZ = newBigArr;
            		} else {
            			bigArrZ = demoselectNew.removeExistRightTee(newBigArr, getData);
            		};
            		$('#tree_right_new').tree("append", {
            			data: bigArrZ
            		});



            	};

            },
            delRightMove: function() {
            	var nodesArr = $('#tree_right_new').tree('getChecked');
            	if (nodesArr.length == 0) {
            		alert("请选择要删除的设备或端口");
            		return;
            	};
            	for (var i = 0; i < nodesArr.length; i++) {
            		if (nodesArr[i].id == 0) {
            			$("#tree_right_new").html("");
            			var noShowObj = $('#tree_left_new').tree('find', nodesArr[i].id);
            			$("#tree_left_new").tree("uncheck", noShowObj.target);
            			demoselectNew.clearRightTree();
            		} else {
            			//处理文本
            			if (!nodesArr[i].attributes.ishasChilds) {
            				//去除右边显示
            				var noShowObj = $('#tree_right_new').tree('find', nodesArr[i].id);
            				if (noShowObj != "" && noShowObj != " " && noShowObj != null) {
            					$('#tree_right_new').tree('remove', noShowObj.target);
            				};
            				//去除左边勾选
            				var noCheckedObj = $('#tree_left_new').tree('find', nodesArr[i].id);
            				if (noCheckedObj != null && noCheckedObj != "" && noCheckedObj != " ") {
            					$('#tree_left_new').tree('uncheck', noCheckedObj.target);
            				};
            			};
            			//处理文件夹    
            			if (nodesArr[i].attributes.ishasChilds) {
            				//去除右边显示
            				var noShowObj = $('#tree_right_new').tree('find', nodesArr[i].id);
            				if (noShowObj != "" && noShowObj != " " && noShowObj != null) {
            					var childrens = $('#tree_right_new').tree('getChildren', noShowObj.target);
            					for (var j = 0; j < childrens.length; j++) {
            						$('#tree_right_new').tree('remove', childrens[j].target); //删除孩子
            					};
            					$('#tree_right_new').tree('remove', noShowObj.target); //删自己
            				};
            				//去除左边勾选
            				var noCheckedObj = $('#tree_left_new').tree('find', nodesArr[i].id);
            				$('#tree_left_new').tree('uncheck', noCheckedObj.target);
            			};
            		};
            	};
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
            clearRightTree: function() {
            	$("#tree_right_div").html("");
            	$("#tree_right_div").html('<ul id="tree_right_new"></ul>');
            	$("#tpl_name").val("");
            	$("#comment").val("");
            	$("#descr").val("");
            },
            addDemoSave: function() {
            	if ($("#tree_right_new").html() == "") {
            		alert("请选择设备端口!");
            		return;
            	};
            	var tpl_id = $("#currDemoId").html();
            	if (tpl_id == "" || tpl_id == " " || tpl_id == null || tpl_id == "null") {
            		//说明是新建的模板
            		tpl_id = demoselectNew.getCurrTimeToId();
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
            	var flag = demoselectNew.checkOutDemoName(tpl_name);
            	if (flag) {
            		alert("模板名称已经存在!");
            		return;
            	};
            	var descr = $("#descr").val();
            	var bandwidth = $("#bandwidth").val();
                 //防止单点登录获取不到用户名-------------------------------------------------------------
                 var userInfo = "";
                var userinfoDiv=$(window.top.document.getElementById('userinfo'));
                userInfo =  userinfoDiv.find('div[id = "tab_1_1"]').find('div').eq(0).find('div').eq(1).html();
                if (userInfo == null) {
                    userInfo = $.cookie("inas_portallogin_user_username");
                }else{
                    var re1 = new RegExp("\n", "g");
                    userInfo = userInfo.replace(re1, ""); 
                    userInfo = userInfo.trim(); 
                };
            	var all_data = {
            		"tpl_id": tpl_id,
            		"tpl_name": tpl_name,
            		"type": $("#port_type").val(),
            		"tpl_sys_user": $("#sys_user").html(),
            		"owner":$("#sys_user").html() == "sys"?"sys":userInfo,
            		"bandwidth": bandwidth,
            		"descr": descr
            	};
            	var all_dataStr = JSON.stringify(all_data);
            	var res = commonAjax(configUrl_main.rcpt_model_updateDeviceModel, all_dataStr, "", "");
            	//var res = commonAjax("/rcpt/model/updateDeviceModel",all_dataStr,"","");

            	if (res.success) {
            		//维护模板与端口的关系
            		//获取右边树的所有节点
            		var port_type_self = $("#port_type").val();
            		var getData = $("#tree_right_new").tree("getRoots");

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
            			$("#addAndAlterDemo").modal("hide");
            			demoselectNew.refreshCurrDemo();
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

            	//demoselectNew.initDemoNameList(); //刷选模板显示菜单
            	$("#currDemoId").html(""); //把存放修改模板id的div清空
            },
            getCurrTimeToId: function() {
            	var date = new Date();
            	var dateStr = date.format("yyyyMMddhhmmss");
            	return dateStr;
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
        	refreshCurrDemo : function(){
        		  //防止单点登录获取不到用户名-------------------------------------------------------------
	                 var userInfo = "";
	                var userinfoDiv=$(window.top.document.getElementById('userinfo'));
	                userInfo =  userinfoDiv.find('div[id = "tab_1_1"]').find('div').eq(0).find('div').eq(1).html();
	                if (userInfo == null) {
	                    userInfo = $.cookie("inas_portallogin_user_username");
	                }else{
	                    var re1 = new RegExp("\n", "g");
	                    userInfo = userInfo.replace(re1, ""); 
	                    userInfo = userInfo.trim(); 
	                };
                  var data = {
                  	   "ifId": "srpt-cfg-deviceQueryModelInfo",
                  	   "owner":userInfo
                  };
                  var dataStr = JSON.stringify(data);
                  var res = commonAjax(configUrl_main.query_deviceQueryModelInfo, dataStr, "", "");
                  //var res = commonAjax("/srpt/rcpt/common/query",dataStr,"","");
                  var arr = res.data;
        		  $("#specialDiv_1").empty();
        		  $("#specialDiv_2").empty();
                  var innerHTML1 = "";
                  var innerHTML2 = "";
                  for (var i = 0; i < arr.length; i++) {
                     if (arr[i].tpl_sys_user == "user" || arr[i].tpl_sys_user ==null ) {continue;};                                    	
                             innerHTML1 +=                         '<span name="span_wenben" sc="0" style="display:inline-block;margin-left: 20px;margin-top: 10px;width:86px;cursor: pointer;" onclick="demoselect.selectCurrDemo(this,\'' + arr[i].type + '\')" >'
                                       //+                               '<img oncontextmenu="demoselectNew.bindRightEvent_sys(\''+arr[i].tpl_id+'\');" src="../../static/reportManageSys/images/wenben_demo_duankou_wu.png" style="width: 84px; height: 91px ;">'
                     if (arr[i].type == "shebei") {
                             innerHTML1 +=                              '<img oncontextmenu="demoselectNew.bindRightEvent_sys(\''+arr[i].tpl_id+'\');" name="img_demo_shebei" style="width: 84px; height: 91px ;"  src="../../static/reportManageSys/images/wenben_demo_shebei_wu.png">'
                     } else if (arr[i].type == "duankou") {
                             innerHTML1 +=                              '<img oncontextmenu="demoselectNew.bindRightEvent_sys(\''+arr[i].tpl_id+'\');" name="img_demo_duankou" style="width: 84px; height: 91px ;"  src="../../static/reportManageSys/images/wenben_demo_duankou_wu.png">'
                     } else {
                             innerHTML1 +=                              '<img oncontextmenu="demoselectNew.bindRightEvent_sys(\''+arr[i].tpl_id+'\');" name="img_demo_wenben" style="width: 84px; height: 91px ;"  src="../../static/reportManageSys/images/wenben_demo_wu.png">'
                     };
                             innerHTML1 +=                              '<b style="font-weight: 500;" title="'+arr[i].tpl_name+'">' 
                                       +                               '<span style="padding-left:10px;display:inline-block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:80px;">'+arr[i].tpl_name+'</span>' 
                                       +                               '</b>' 
                                       +                               '<span style="display:none">'+arr[i].tpl_id+'</span>' 
                                       +                               '<span style="display:none">'+(arr[i].type == "shebei"?"t":"f")+'</span>' 
                                       +                           '</span>' 
                  };

                  $("#specialDiv_1").html(innerHTML1);

                  for (var i = 0; i < arr.length; i++) {
                      if (arr[i].tpl_sys_user == "sys" || arr[i].tpl_sys_user ==null) {continue;};                                             	
                          innerHTML2 +=                         '<span name="span_wenben" sc="0" style="display:inline-block;margin-left: 20px;margin-top: 10px;width:86px;cursor: pointer;" onclick="demoselect.selectCurrDemo(this,\'' + arr[i].type + '\')">'
                                    //+                               '<img oncontextmenu="demoselectNew.bindRightEvent_user(\'20170606110042\');" src="../../static/reportManageSys/images/wenben_demo_duankou_wu.png" style="width: 84px; height: 91px ;">'
                      if (arr[i].type == "shebei") {
                          innerHTML2 +=                              '<img oncontextmenu="demoselectNew.bindRightEvent_user(\''+arr[i].tpl_id+'\');" name="img_demo_shebei" style="width: 84px; height: 91px ;"  src="../../static/reportManageSys/images/wenben_demo_shebei_wu.png">'
                      } else if (arr[i].type == "duankou") {
                          innerHTML2 +=                              '<img oncontextmenu="demoselectNew.bindRightEvent_user(\''+arr[i].tpl_id+'\');" name="img_demo_duankou" style="width: 84px; height: 91px ;"  src="../../static/reportManageSys/images/wenben_demo_duankou_wu.png">'
                      } else {
                          innerHTML2 +=                              '<img oncontextmenu="demoselectNew.bindRightEvent_user(\''+arr[i].tpl_id+'\');" name="img_demo_wenben" style="width: 84px; height: 91px ;"  src="../../static/reportManageSys/images/wenben_demo_wu.png">'
                      };          
                          innerHTML2 +=                               '<b style="font-weight: 500;" title="'+arr[i].tpl_name+'">' 
                                    +                               '<span style="padding-left:10px;display:inline-block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:80px;">'+arr[i].tpl_name+'</span>' 
                                    +                               '</b>' 
                                    +                               '<span style="display:none">'+arr[i].tpl_id+'</span>' 
                                    +                               '<span style="display:none">'+(arr[i].type == "shebei"?"t":"f")+'</span>' 
                                    +                           '</span>' 
                  };  

                  $("#specialDiv_2").html(innerHTML2);     


        	},
            init : function(){}
};
var conditionToDevice = {
                      seekQuery : function(id){
                            var device_name = $("#"+id+"_device_name").val();
                            var device_room = $("#"+id+"_device_room").val();
                            var device_ipAdress = $("#"+id+"_device_ipAdress").val();
                            var business_system = $("#"+id+"_business_system").val();
                            //var port_cname = $("#"+id+"_port_cname").val();
                            //var port_ipAdress = $("#"+id+"_port_ipAdress").val();
                      	  var data = {
          	            	  	"device_id": "",
          	            	  	"device_name": device_name,
          	            	  	"room" :device_room,
          	            	  	"device_ip": device_ipAdress,
          	            	  	"device_service_name": business_system
          	            	  	//"inter_alias": port_cname,
          	            	  	//"in_ip": port_ipAdress
                      	  };
                      	  var dataStr = JSON.stringify(data);
                      	  $("#"+id+"_tree_tiaojian").html("");
                      	  $("#"+id+"_tree_tiaojian_div").mask("数据正在加载中,请稍等....");
                      	  $.ajax({
          	  			        url :eastcom.baseURL+configUrl_main.rcpt_model_getFullMenu ,
          	  			        type : 'POST',
          	  			        async : true,
          	  			        dataType : "json",
          	  			        contentType :"application/json",
          	  			        data:dataStr,
          	  			        success : function(res) {
          		               	  var initData = conditionToDevice.transLeftTreeData(res.data, 0);
       	  	  			          var allData = [{
       	  											"id": 0,
       	  											"text": "全部选择",
       	  											"state": "open",
       	  											"iconCls":"tree-self-folder",
       	  											"attributes": {
       	  												"ishasChilds": true
       	  											 },
       	                                               children : initData
       	  										}];	
          		                     $("#"+id+"_tree_tiaojian").tree({
          		                     	data: allData,
          		                     	lines: false,
          		                     	animate: true,
          		                     	checkbox: true,
          		                     	onBeforeExpand: function(node) {
          		                     		if (node.id == 0) {
          		                     			return true;
          		                     		}else{
          		                     		    return false;   //不让展开
          		                     		};
          		                     		//http://localhost:7080/web-selfReport-special/rcpt/model/getFullMenu 

          		                     		//var port_type_self = $("#port_type").val();
          		                     		var port_type_self = "duankou";
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
          		                     				"room" :device_room,
          		                     				"device_ip": device_ipAdress,
          		                     				"device_service_name": business_system
          		                     				//"inter_alias": port_cname,
          		                     				//"in_ip": port_ipAdress
          		                     			};

          		                     			var dataStr = JSON.stringify(data);
                       			            	$.ajax({
                       				  			        url :eastcom.baseURL+configUrl_main.rcpt_model_getFullMenu ,
                       				  			        type : 'POST',
                       				  			        async : true,
                       				  			        dataType : "json",
                       				  			        contentType :"application/json",
                       				  			        data:dataStr,
                       				  			        success : function(res) {
                       				  			             var arr = conditionToDevice.transLeftTreeData(res.data, node_id);
                       				  			             var parent = $("#"+id+"_tree_tiaojian").tree('find', node.id);
                       				  			             var childrens = $("#"+id+"_tree_tiaojian").tree('getChildren', parent.target);
                       				  			             for (var i = 0; i < childrens.length; i++) {
                       				  			             	$("#"+id+"_tree_tiaojian").tree('remove', childrens[i].target);
                       				  			             };
                       				  			             $("#"+id+"_tree_tiaojian").tree("append", {
                       				  			             	parent: parent.target,
                       				  			             	data: arr
                       				  			             });
                       				  			             $(parent.target).next().show();  //防止加载后不显示,需要再次点击
                       				  			        },
                       				  			        beforeSend: function () {
                       				  			            $(node.target).children('span.tree-icon').addClass('treeLoading');
                       				  			        },
                       				                    complete: function(XMLHttpRequest, textStatus){
                       				  			                  $(node.target).children('span.tree-icon').removeClass('treeLoading');
                       				  		            },
                       				  		            error: function(){
                       				  			              //请求出错处理
                       				  						  eastcom.showMsg("danger","请求异常,数据加载失败!");
                       				  		            }
                       				  			});
          		                     			

          		                     		};

          		                     	},
          		                     	onContextMenu: function(e, node) {

          		                     	},
          		                     	onDblClick: function(node) {

          		                     	}
          		                     }); //tree
          	  			        	
          	  			        },
          	                    complete: function(XMLHttpRequest, textStatus){
          	  						      $("#"+id+"_tree_tiaojian_div").unmask();
          	  		            },
          	  		            error: function(){
          	  			              //请求出错处理
          	  						  eastcom.showMsg("danger","请求异常,数据加载失败!");
          	  		            }
          	  			});
                      	  
                      },
                      transLeftTreeData: function(data, flag) { // flage = 0 文件夹
                      	var arr = [];
                      	if (data == null) {
                      		return;
                      	};
                      	//var port_type_self = $("#port_type").val();
                      	var port_type_self = "shebei";
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
                      init:function(){}
};
var conditionToPort = {
                      seekQuery : function(id){
                            var device_name = $("#"+id+"_device_name").val();
                            var device_room = $("#"+id+"_device_room").val();
                            var device_ipAdress = $("#"+id+"_device_ipAdress").val();
                            var business_system = $("#"+id+"_business_system").val();
                            //var port_cname = $("#"+id+"_port_cname").val();
                            //var port_ipAdress = $("#"+id+"_port_ipAdress").val();
                      	  var data = {
          	            	  	"device_id": "",
          	            	  	"device_name": device_name,
          	            	  	"room" :device_room,
          	            	  	"device_ip": device_ipAdress,
          	            	  	"device_service_name": business_system
          	            	  	//"inter_alias": port_cname,
          	            	  	//"in_ip": port_ipAdress
                      	  };
                      	  var dataStr = JSON.stringify(data);
                      	  $("#"+id+"_tree_tiaojian").html("");
                      	  $("#"+id+"_tree_tiaojian_div").mask("数据正在加载中,请稍等....");
                      	  $.ajax({
          	  			        url :eastcom.baseURL+configUrl_main.rcpt_model_getFullMenu ,
          	  			        type : 'POST',
          	  			        async : true,
          	  			        dataType : "json",
          	  			        contentType :"application/json",
          	  			        data:dataStr,
          	  			        success : function(res) {
          		               	  var initData = conditionToPort.transLeftTreeData(res.data, 0);
       	  	  			          var allData = [{
       	  											"id": 0,
       	  											"text": "全部选择",
       	  											"state": "open",
       	  											"iconCls":"tree-self-folder",
       	  											"attributes": {
       	  												"ishasChilds": true
       	  											 },
       	                                               children : initData
       	  										}];	
          		                     $("#"+id+"_tree_tiaojian").tree({
          		                     	data: allData,
          		                     	lines: false,
          		                     	animate: true,
          		                     	checkbox: true,
          		                     	onBeforeExpand: function(node) {
          		                     		if (node.id == 0) {
          		                     			return true;
          		                     		}else{
          		                     		    return false;   //不让展开
          		                     		};
          		                     		//http://localhost:7080/web-selfReport-special/rcpt/model/getFullMenu 

          		                     		//var port_type_self = $("#port_type").val();
          		                     		var port_type_self = "duankou";
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
          		                     				"room" :device_room,
          		                     				"device_ip": device_ipAdress,
          		                     				"device_service_name": business_system
          		                     				//"inter_alias": port_cname,
          		                     				//"in_ip": port_ipAdress
          		                     			};

          		                     			var dataStr = JSON.stringify(data);
                       			            	$.ajax({
                       				  			        url :eastcom.baseURL+configUrl_main.rcpt_model_getFullMenu ,
                       				  			        type : 'POST',
                       				  			        async : true,
                       				  			        dataType : "json",
                       				  			        contentType :"application/json",
                       				  			        data:dataStr,
                       				  			        success : function(res) {
                       				  			             var arr = conditionToPort.transLeftTreeData(res.data, node_id);
                       				  			             var parent = $("#"+id+"_tree_tiaojian").tree('find', node.id);
                       				  			             var childrens = $("#"+id+"_tree_tiaojian").tree('getChildren', parent.target);
                       				  			             for (var i = 0; i < childrens.length; i++) {
                       				  			             	$("#"+id+"_tree_tiaojian").tree('remove', childrens[i].target);
                       				  			             };
                       				  			             $("#"+id+"_tree_tiaojian").tree("append", {
                       				  			             	parent: parent.target,
                       				  			             	data: arr
                       				  			             });
                       				  			             $(parent.target).next().show();  //防止加载后不显示,需要再次点击
                       				  			        },
                       				  			        beforeSend: function () {
                       				  			            $(node.target).children('span.tree-icon').addClass('treeLoading');
                       				  			        },
                       				                    complete: function(XMLHttpRequest, textStatus){
                       				  			                  $(node.target).children('span.tree-icon').removeClass('treeLoading');
                       				  		            },
                       				  		            error: function(){
                       				  			              //请求出错处理
                       				  						  eastcom.showMsg("danger","请求异常,数据加载失败!");
                       				  		            }
                       				  			});
          		                     			

          		                     		};

          		                     	},
          		                     	onContextMenu: function(e, node) {

          		                     	},
          		                     	onDblClick: function(node) {

          		                     	}
          		                     }); //tree
          	  			        	
          	  			        },
          	                    complete: function(XMLHttpRequest, textStatus){
          	  						      $("#"+id+"_tree_tiaojian_div").unmask();
          	  		            },
          	  		            error: function(){
          	  			              //请求出错处理
          	  						  eastcom.showMsg("danger","请求异常,数据加载失败!");
          	  		            }
          	  			});
                      	  
                      },
                      transLeftTreeData: function(data, flag) { // flage = 0 文件夹
                      	var arr = [];
                      	if (data == null) {
                      		return;
                      	};
                      	//var port_type_self = $("#port_type").val();
                      	var port_type_self = "duankou";
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
                      			/*obj.state = "closed";*/
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
                      init:function(){}
};
var indexWarning = {
         changeUsuallyOrwarningType : function(id){
                 var usuallyOrwarning = $("#"+id).find('input[name = "'+id+'_usuallyOrwarning"]:checked').val();   //usually   warning 
                 if (usuallyOrwarning == "usually") {
                 	   $("#"+id).height(48);
                       $("#"+id+"_realCondition").css('display', 'none');
                 }else if(usuallyOrwarning == "warning"){
					   $("#"+id).height(128);
					   $("#"+id+"_realCondition").css('display', 'block'); 
                 }else{} 
         },
         init :function(){}
};
var busyTimeParagraph = {
	     busyTimeParagraphAll : function(name){
	     	//_self
	     	     $("#"+name+"_back").prop("checked",false);
                 var flag = $("#"+name+"_self").prop("checked");
                 if (flag) {
                 	 $("#"+name).find("input[name = "+name+"]").prop("checked",true);
                 }else{
                 	 $("#"+name).find("input[name = "+name+"]").prop("checked",false);
                 }
	     },
	     defaultCheckedEvent : function(id, zujianLabel){
                 //先不选全部
                 $("#"+id).find("input[name = "+id+"]").prop("checked",false);
         
//                 var arr = ["09","10","11","20","21","22"];
                 //默认的忙时, 放在了label后边   label|01,02,03 格式
                 var arr = zujianLabel.split("|")[1].split(",");
                 for (var i = 0; i < arr.length; i++) {
                 	   var currObj = arr[i];
                 	   $("#"+id).find("input[values = "+currObj+"]").prop("checked",true);
                 }
	     }
};
var cellList = {
		defaultInit : function(id){
			this.initCheckbox(id);
			this.initGrid(id);
		},
		//初始化modal中的CheckBox
		initCheckbox : function(id){
			var url = "/sml/query/srpt-cfg-specialComositeQuery",
				res = commonAjax(url, "", "", ""),
				resData = res.data;
			$.each(resData, function(type, typeData) {
				var htmlArr = [],
					name = id+'_'+type;
				$.each(typeData, function(key, data) {
					var val = data.VALUE;
					htmlArr.push('<div><input type="checkbox" value="'+val+'">'+val+'</div>');
				});
				$("#"+name).html(htmlArr.join("\n"));
			});
		},
		//初始化modal中的表格
		initGrid : function(id){
			var htmlStr = 
				'<table id='+id+'"_cell_grid" style="width:70%;"></table>' +
				'<div id='+id+'"_cell_grid_pager" style="position: relative;left: -80px;"></div>';
			$("#" + id + "_cell_grid_div").html();
			var colNames = ["小区名称", "LAC-CI", "网络类型", "小区覆盖范围", "地市分公司", "厂商"],
				colModel = [
				{name: "CELL_NAME", index: "CELL_NAME", width: 220, align: "center", sortable: false, frozen: true},
				{name: "LACCI", index: "LACCI", width: 90, align: "center", sortable: false},
				{name: "CELL_NT", index: "CELL_NT", width: 70, align: "center", sortable: false},
				{name: "STATIONCATALOG", index: "STATIONCATALOG", width: 110, align: "center", sortable: false},
				{name: "DEPENDENCY", index: "DEPENDENCY", width: 100, align: "center", sortable: false},
				{name: "FACTORY", index: "FACTORY", width: 90, align: "center", sortable: false}
			];
			$("#"+id+"_cell_grid").jqGrid({
				height: 317,	//300
				rowNum: 10,
				datatype: "json",
				colNames: colNames,
				colModel: colModel,
				shrinkToFit: false,
				autoScroll: true,
	//			rownumbers: true,	//是否显示行数
	//			rownumWidth: 50,
				multiselect: true, //复选框
				multiboxonly: true,	//只有选择CheckBox才起作用
				pgbuttons: true,
				pginput: true,
				pager: id + "_cell_grid_pager",
				pgtext: "{0} 共{1}页",
				url : eastcom.baseURL + "/sml/query/srpt-cfg-queryLacCiByComposite",
//				datatype : "json",
				mtype : "post",
				jsonReader : {
					root: "data.elements",
					records:"data.total",
					total:"data.pageNum",
					page:"data.pageNo"
				},
				page : 1,
				gridComplete : function(){
					//处理冻结列后bug
					$("#"+id+"_cell_grid_frozen").hide();	//隐藏 "无数据显示"
				}
			});
			document.getElementById(id+"_cell_grid_pager_center").style.position = "relative";
			document.getElementById(id+"_cell_grid_pager_center").style.left = "-100px";
			document.getElementById(id+"_cell_grid_pager_right").style.position = "relative";
			document.getElementById(id+"_cell_grid_pager_right").style.left = "-100px";
		},
		clearTextarea : function(id){
			$("#"+id+"_textarea").val("");
		},
		showModal : function(id){
			$('#'+id+'_modal').modal('show');
			setTimeout(function(){
				//设置modal的top值
				document.getElementById(id+'_modal').style.top = 0;
				//隐藏的表格, 需要宽度
				$("#"+id+"_cell_grid").jqGrid("setGridWidth", $("#"+id+"_cell_grid_div").width());
				$("#"+id+"_cell_grid").jqGrid("setFrozenColumns");
				//处理冻结列后bug
				$("#"+id+"_cell_grid_frozen").hide();	//隐藏 "无数据显示"
				$("input[id='cb_"+id+"_cell_grid']").css("margin", 0);	//界面有多个相同id, 只能这样控制
			}, 150);
		},
		//CheckBox全选事件
		totalCheckEvent : function(dom, name){
			var flag = dom.checked;
			$("#"+name+" input[type='checkbox']").attr("checked", flag);
		},
		//查询jqGrid数据
		query : function(id){
			var cell_nt = [],
				dependency = [],
				factory = [],
				stationcatalog = [];
			var cell_nt_arr = $("#"+id+"_CELL_NT input[type='checkbox']:checked"),
				dependency_arr = $("#"+id+"_DEPENDENCY input[type='checkbox']:checked"),
				factory_arr = $("#"+id+"_FACTORY input[type='checkbox']:checked"),
				stationcatalog_arr = $("#"+id+"_STATIONCATALOG input[type='checkbox']:checked");
			for(var i=0, len=cell_nt_arr.length; i<len; i++){
				cell_nt.push(cell_nt_arr[i].value);
			}
			for(var i=0, len=dependency_arr.length; i<len; i++){
				dependency.push(dependency_arr[i].value);
			}
			for(var i=0, len=factory_arr.length; i<len; i++){
				factory.push(factory_arr[i].value);
			}
			for(var i=0, len=stationcatalog_arr.length; i<len; i++){
				stationcatalog.push(stationcatalog_arr[i].value);
			}
			var cell_name = $("#"+id+"_cellname").val(),
				lacci = $("#"+id+"_lacci").val(),
				url = "",
				param = {
					"queryType" : "select",
					"cell_name" : cell_name,
					"lacci" : lacci,
					"cell_nt" : cell_nt.join(","),
					"dependency" : dependency.join(","),
					"factory" : factory.join(","),
					"stationcatalog" : stationcatalog.join(",")
				},
				paramStr = JSON.stringify(param);
			$("#" + id + "_cell_grid").jqGrid("setGridParam", {
				page : 1,
				postData : {params : paramStr}
			}).trigger("reloadGrid");
		},
		//重置查询条件
		resetQuery : function(id){
			$("#"+id+"_DEPENDENCY_cbox").attr("checked", false);
			$("#"+id+"_CELL_NT_cbox").attr("checked", false);
			$("#"+id+"_FACTORY_cbox").attr("checked", false);
			$("#"+id+"_STATIONCATALOG_cbox").attr("checked", false);
			$("#"+id+"_DEPENDENCY div input[type='checkbox']").attr("checked", false);
			$("#"+id+"_CELL_NT div input[type='checkbox']").attr("checked", false);
			$("#"+id+"_FACTORY div input[type='checkbox']").attr("checked", false);
			$("#"+id+"_STATIONCATALOG div input[type='checkbox']").attr("checked", false);
			$("#"+id+"_cellname").val("");
			$("#"+id+"_lacci").val("");
			$("input[id='cb_"+id+"_cell_grid']").attr("checked", false);	//界面有多个相同id, 只能这样控制
			$("#"+id+"_cell_grid").jqGrid("clearGridData");
			this.clearVirtualTr(id);
		},
		//添加modal中的tr
		addTr : function(id){
			//获取table中的lacci
			var trArr = $("#"+id+"_cellTable tbody tr");
			var textObj = {};
			for(var i=0, len=trArr.length; i<len; i++){
				var tr = trArr[i],
					lacci = $(tr).children("td:eq(1)").text();
				textObj[lacci] = true;
			}
			//获取jqGrid中数据
			var idArr = $("#" + id + "_cell_grid").jqGrid("getGridParam", "selarrrow");
			for(var i=0, len=idArr.length; i<len; i++){
				var gridData = $("#" + id + "_cell_grid").jqGrid("getRowData", idArr[i]),
					htmlArr = [];
				if(textObj[gridData.LACCI]){
					//如果判断为true, 说明有重复的, 跳过循环
					continue;
				}
				htmlArr.push('<tr>');
				htmlArr.push('<td>'+gridData.CELL_NAME+'</td>');
				htmlArr.push('<td style="display:none;">'+gridData.LACCI+'</td>');
				htmlArr.push('<td style="cursor:pointer;" onclick="cellList.delTr(this);">');
				htmlArr.push('<img style="width: 34px; height: 34px ;" src="../../static/reportManageSys/images/closehong.png">');
				htmlArr.push('</td>');
				htmlArr.push('</tr>');
				$("#"+id+"_cellTable tbody").append(htmlArr.join("\n"));
			}
		},
		delTr : function(dom){
			var tr = dom.parentNode;
			tr.parentNode.removeChild(tr);
		},
		clearVirtualTr : function(id){
			$("#"+id+"_cellTable tbody").empty();
		},
		//从modal中, 加入到实际中
		addTextarea : function(id){
			//先获取textarea内容
			var lacciArr = $("#"+id+"_textarea").val().split("\n");
			var lacciObj = {};
			for(var i=0, len=lacciArr.length; i<len; i++){
				lacciObj[lacciArr[i]] = true;
			}
			//再获取table数据
			var trArr = $("#"+id+"_cellTable tbody tr");
			//获取原来的lacci
			var textStr = $("#" + id + "_textarea").val();
			for(var i=0, len=trArr.length; i<len; i++){
				var tr = trArr[i],
					lacci = $(tr).children("td:eq(1)").text();
				if(lacciObj[lacci]){
					//如果判断为true, 说明有重复的, 跳过循环
					continue;
				}
				if(textStr != ""){
					textStr += "\n";
				}
				textStr +=  lacci;
			}
			$("#" + id + "_textarea").val(textStr);
			$('#'+id+'_modal').modal('hide');
		}
};
var comboCheckbox = {
	changeRadio : function(id, ele){
		var type = ele.value;
		document.getElementById(id+"_checkAll").value = type;
		document.getElementById(id+"_checkAll").checked = false;
		$("#"+id+"_checkbox > div > span > input[type='checkbox']").attr("checked", false);
		$("#"+id+"_checkbox > div").hide();
		$("#"+id+"_"+type).show();
	},
	checkAll : function(id, ele){
		var type = ele.value,
			checked = ele.checked;
		$("#"+id+"_"+type+" > span > input[type='checkbox']").attr("checked", checked);
	}
};



function sorts(obj) {
	var resultArr = [];
	if (obj) {
		obj.sort(function(a, b) {
			return a.seq - b.seq
		});
	};
	return obj;
};


/* if (xialaType=="chooseyewu" ) {
                                       datas = {  "1":{"id":1,"name":"即时通信"},
                                              "2":{"id":2,"name":"阅读"},
                                              "3":{"id":3,"name":"微博"},
                                              "4":{"id":4,"name":"导航"},
                                              "5":{"id":5,"name":"视频"},
                                              "6":{"id":6,"name":"音乐"},
                                              "7":{"id":7,"name":"应用商店"},
                                              "8":{"id":8,"name":"游戏"},
                                              "9":{"id":9,"name":"支付"},
                                              "10":{"id":10,"name":"动漫"},
                                              "11":{"id":11,"name":"邮箱"},
                                              "12":{"id":12,"name":"P2P业务"},
                                              "13":{"id":13,"name":"VoIP业务"},
                                              "14":{"id":14,"name":"彩信"},
                                              "15":{"id":15,"name":"浏览下载"},
                                              "16":{"id":16,"name":"财经"},
                                              "17":{"id":17,"name":"安全杀毒"},
                                              "18":{"id":18,"name":"其他业务"}
                                            }  


                                 };*/