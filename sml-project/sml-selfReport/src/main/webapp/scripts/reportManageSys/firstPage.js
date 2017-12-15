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
var firstPage = {
	init: function() {

		//获取浏览器高宽
		var bodyHeight = $(window).height();
		$("#fspage").height(bodyHeight);
		$("#visit_count").height(bodyHeight * 81 / 200);
		$("#user_T_count").height(bodyHeight * 81 / 200);
		$(".b1").click(function() {
			pT('visit_count', this);
		});
		$(".b2").click(function() {
			pT('user_T_count', this);
		});


		$('body').mask("数据加载中....");
		firstPage.AD_scrLi(); //第一个图
		firstPage.see_countShow(); //第二个图
		listData(); //第三个图
		firstPage.table_countShow(); //第四个图
		firstPage.pre_see_countShow(); //第五个图


		firstPage.visit_countShow(); //第六个图
		firstPage.user_T_countShow(); //第六个图    
		$('body').unmask();




	},
	//公告--数据
	AD_scrData: function() {
		var url = configUrl_main.query_homePageAffiche;
		//var url="/srpt/rcpt/common/query";
		var data = {
			"ifId": "srpt-cfg-homePageAffiche"
		};
		var dataStr = JSON.stringify(data);
		//      $("#AD_scroll").mask("加载中...");
		var res = commonAjax(url, dataStr, "", "");
		if (!res.success) {
			$("body").unmask();
		};
		return res;
	},
	AD_scrLi: function() {
		var result = firstPage.AD_scrData().data;
		var i = 0;
		$("#marquee_div").html("");
		for (var item in result) {
			if (i > 9) {
				return;
			};
			if (result[item].content) {
				var str = "<div style='text-align:center'> " + result[item].title + "</div>" +
					"内容:&nbsp&nbsp&nbsp&nbsp" + result[item].content +
					"<br><div style='float:right'>" + result[item].createtime + "</div><br>";

				$("#marquee_div").append("<div>" + str + "</div>");
			};

			i++;

		};
	},
	//用户报表查看次数top10---数据
	see_countData: function() {
		var url = configUrl_main.query_homePageUserQueryTopTen;
		//var url="/srpt/rcpt/common/query";
		var data = {
			"ifId": "srpt-cfg-homePageUserQueryTopTen"
		};
		var dataStr = JSON.stringify(data);
		//	 $("#see_count").mask("加载中...");
		var res = commonAjax(url, dataStr, "", "");
		if (!res.success) {
			$("body").unmask();
		};
		return res;
	},
	see_countShow: function() {
		var result = firstPage.see_countData().data;
		var users = [];
		var counts = [];
		/*for (var item in result) {
			users.push(result[item].username);
			counts.push(result[item].queryCount);
		};
		users.pop();
		counts.pop();*/
		for (var i = 0; i < result.length; i++) {
			 var item = result[i];
             users.push(item.username); 
             counts.push(item.queryCount); 
		};
		eastcom_echarts_bar.loadDataToChart("see_count", users, counts, "姓名");
	},
	//当前用户报表查看次数top10--数据
	pre_see_countData: function() {

		var url = configUrl_main.query_homePageCurrentUserRptTopTen;
		//var url="/srpt/rcpt/common/query";
		var data = {
			"ifId": "srpt-cfg-homePageCurrentUserRptTopTen",
			"username": userName
		};
		var dataStr = JSON.stringify(data);
		//	 $("#pre_see_count").mask("加载中...");
		var res = commonAjax(url, dataStr, "", "");
		if (!res.success) {
			$("body").unmask();
		};
		return res;
	},
	pre_see_countShow: function() {
		var result = firstPage.pre_see_countData().data;
		var reports = [];
		var counts = [];
		/*for (var item in result) {
			reports.push(result[item].reportName);
			counts.push(result[item].queryCount);
		};
		reports.pop();
		counts.pop();*/
		for (var i = 0; i < result.length; i++) {
			  var item = result[i];
			  reports.push(item.reportName);
			  counts.push(item.queryCount);
		};
		eastcom_echarts_bar.loadDataToChart("pre_see_count", reports, counts, "名称");
	},
	//报表数量趋势图--数据
	table_countData: function() {
		var url = configUrl_main.query_homePageReportCntTend;
		//var url="/srpt/rcpt/common/query";
		var data = {
			"ifId": "srpt-cfg-homePageReportCntTend"
		};
		var dataStr = JSON.stringify(data);
		//	 $("#table_count").mask("加载中...");
		var res = commonAjax(url, dataStr, "", "");
		if (!res.success) {
			$("body").unmask();
		};
		return res;
	},
	table_countShow: function() {
		var result = firstPage.table_countData().data;
		var creatTimes = [];
		var counts = [];
		/*for (var item in result) {
			creatTimes.push(result[item].createtime);
			counts.push(result[item].countCreatTime);
		}
		creatTimes.pop();
		counts.pop();*/
		for (var i = 0; i < result.length; i++) {
			var item = result[i];
			creatTimes.push(item.createtime);
			counts.push(item.countCreatTime);
		};
		eastcom_echarts_line.loadDataToChart("table_count", creatTimes, counts);
	},
	//报表访问次数TOP10---数据
	visit_countData: function() {
		var url = configUrl_main.query_homePageQueryRptAreaTopTen;
		//var url="/srpt/rcpt/common/query";
		var data = {
			"ifId": "srpt-cfg-homePageQueryRptAreaTopTen"
		};
		var dataStr = JSON.stringify(data);
		//	 $("#visit_count").mask("加载中...");
		var res = commonAjax(url, dataStr, "", "");
		if (!res.success) {
			$("body").unmask();
		};
		return res;
	},
	visit_countShow: function() {
		var result = firstPage.visit_countData().data;

		var rNames = [];
		var qCounts = [];
		var list = []; //传入饼图option的data

		/*for (var item in result) {
			var lit = {
				value: "",
				name: ""
			};
			rNames.push(result[item].reportName);
			qCounts.push(result[item].queryCount);

			lit.value = result[item].queryCount;
			lit.name = result[item].reportName;
			list.push(lit);
		}
		rNames.pop();
		qCounts.pop();
		list.pop();*/
		for (var i = 0; i < result.length; i++) {
			var item = result[i];
			var lit = {
				value: "",
				name: ""
			};
			rNames.push(item.reportName);
			qCounts.push(item.queryCount);

			lit.value = item.queryCount;
			lit.name = item.reportName;
			list.push(lit);
		};
		eastcom_echarts_pieV.loadDataToChart("visit_count", list, rNames);
	},
	//用户报表数量占比TOP10--数据
	user_T_countData: function() {
		var url = configUrl_main.query_homePageUserCntRptCntTopTen;
		//var url="/srpt/rcpt/common/query";
		var data = {
			"ifId": "srpt-cfg-homePageUserCntRptCntTopTen"
		};
		var dataStr = JSON.stringify(data);
		//	 $("#user_T_count").mask("加载中...");
		var res = commonAjax(url, dataStr, "", "");
		//	 $("#user_T_count").mask("加载中...");
		return res;
	},
	user_T_countShow: function() {
		var result = firstPage.user_T_countData().data;

		var uNames = [];
		var rCounts = [];
		var list = []; //传入饼图option的data

		/*for (var item in result) {
			var lit = {
				value: "",
				name: ""
			};
			uNames.push(result[item].username);
			rCounts.push(result[item].reportCount);
			lit.value = result[item].reportCount;
			lit.name = result[item].username;
			list.push(lit);
		}
		uNames.pop();
		rCounts.pop();
		list.pop();*/
		for (var i = 0; i < result.length; i++) {
			var item = result[i];
			var lit = {
				value: "",
				name: ""
			};
			uNames.push(item.username);
			rCounts.push(item.reportCount);

			lit.value = item.reportCount;
			lit.name = item.username;
			list.push(lit);
		};
		eastcom_echarts_pieV.loadDataToChart("user_T_count", list, uNames);
	}
};

//----饼图按钮切换----------
function pT(obj, bt) {
	$(bt).css({
		'border-top': '3px solid blue',
		'border-bottom': '0'
	});
	$(bt).siblings().css({
		'border-top': '',
		'border-bottom': ''
	});
	var obj = $("#" + obj);
	obj.css('display', 'block');
	obj.siblings().css('display', 'none');
};
//最近查看的报表
function listData() {
	var bodyHeight = $(window).height();
	var height = $("#pre_see_count").height() - 29; //bodyHeight*71/200;
	var rowNum = Math.floor(height / 30);
	var columnsName = ['报表名称 ', '用户名', '姓名', '部门', '最后查看时间'];
	var columnsConfig = [{
			name: 'reportName',
			index: 'reportName',
			width: 150,
			align: "center",
			sortable: false
		},
		{
			name: 'username',
			index: 'username',
			width: 120,
			align: "center",
			sortable: false
		},
		{
			name: 'fullname',
			index: 'fullname',
			width: 100,
			align: "center",
			sortable: false
		},
		{
			name: 'deptname',
			index: 'deptname',
			width: 170,
			align: "center",
			sortable: false
		},
		{
			name: 'lasttime',
			index: 'lasttime',
			width: 150,
			align: "center",
			sortable: false
		}
	];

	//初始化表格
	$("#con_grid_div_grid").jqGrid({
		datatype: "local",
		height: height,
		rowNum: rowNum - 1,
		datatype: "local",
		colNames: columnsName,
		colModel: columnsConfig,
		shrinkToFit: false,
		autoScroll: true,
		sortable: false,
		rownumbers: false,
		//pgbuttons:true,
		//pager: "false",
		// pgtext : "{0}共{1}页"
	});
	var postJson = {};
	$("#con_grid_div_grid").jqGrid("setGridParam", {
		url: eastcom.baseURL + configUrl_main.srpt_rcpt_home_showLastReport,
		//url : eastcom.baseURL+"/srpt/rcpt/home/showLastReport", 
		datatype: "json",
		mtype: 'POST',
		jsonReader: {
			root: "data.elements"
			//records:"data.total",
			//total:"data.pageNum",
			//page:"data.pageNo"
		},
		postData: {
			params: JSON.stringify(postJson)
		},
		page: 1
	}).trigger("reloadGrid");

};