var treeTime = {
	init: function() {
		var time = new Date();
		var year = time.getFullYear();

		treeTime.initTimeYear();
		treeTime.initTimeWeek(year);
		treeTime.dayAll(); //取消之前保留的选中状态
	},
	initTimeYear: function() {
		var time = new Date();
		var year = time.getFullYear();
		var yearArr = new Array();
		for (var i = 0; i < 8; i++) {
			yearArr.push(year);
			year--;
		};
		var htmlStr = ""
		for (var i = 0; i < yearArr.length; i++) {
			if (i == 0) {
				htmlStr += '<li><input type="checkbox" checked="checked" name="year" value="' + yearArr[i] + '" onclick="treeTime.changeYear(\'' + yearArr[i] + '\')" />' + yearArr[i] + '年</li>'
			} else {
				htmlStr += '<li><input type="checkbox" name="year" value="' + yearArr[i] + '" onclick="treeTime.changeYear(\'' + yearArr[i] + '\')" />' + yearArr[i] + '年</li>'
			};
		};
		$("#yearUl").html(htmlStr);

	},
	changeYear: function(value) {
		var yearInput = $("input[name = 'year']");
		var thisInput = $("input[value='" + value + "']");
		for (var i = 0; i < yearInput.length; i++) {
			yearInput[i].checked = false;
		};
		thisInput[0].checked = true;
		treeTime.initTimeWeek(value);
	},
	initTimeWeek: function(year) {

		var totalWeek = getNumOfWeeks(year);
		var htmlStr = ""
		for (var i = 1; i <= totalWeek; i++) {
			htmlStr += '<li><input type="checkbox" name="week" value="' + i + '" />' + year + '年第' + i + '周</li>'
		};

		$("#weekUl").html(htmlStr);

		function getNumOfWeeks(year) {
			var d = new Date(year, 0, 1);
			var yt = ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) ? 366 : 365;
			return Math.ceil((yt - d.getDay()) / 7.0);
		};
	},
	dayAll: function() {
		//加载清空已选中的
		$("input[name='day']").attr("checked", false);
		//获取全选checkbox的checked;
		var checked = $("#dayAll").attr("checked");
		if (checked == "checked") {
			$("input[name='day']").attr("checked", true);
		} else {
			$("input[name='day']").attr("checked", false);
		};
	},
	hourAll: function() {
		//加载清空已选中的
		$("input[name='hour']").attr("checked", false);
		//获取全选checkbox的checked;
		var checked = $("#hourAll").attr("checked");
		if (checked == "checked") {
			$("input[name='hour']").attr("checked", true);
		} else {
			$("input[name='hour']").attr("checked", false);
		};
	},
	minAll: function() {
		//加载清空已选中的
		$("input[name='min']").attr("checked", false);
		//获取全选checkbox的checked;
		var checked = $("#minAll").attr("checked");
		if (checked == "checked") {
			$("input[name='min']").attr("checked", true);
		} else {
			$("input[name='min']").attr("checked", false);
		};
	},
	changeTimeType: function() {
		$("#resUl").html(""); //先清除resDiv的内容
		var timeType = $("#timeType").val();
		//先把月日小时周模块不显示
		$("#monthDiv").css("display", "none");
		$("#dayDiv").css("display", "none");
		$("#hourDiv").css("display", "none");
		$("#minDiv").css("display", "none");
		$("#weekDiv").css("display", "none");

		if (timeType == "min") {
			$("#monthDiv").css("display", "block");
			$("#dayDiv").css("display", "block");
			$("#hourDiv").css("display", "block");
			$("#minDiv").css("display", "block");
		};
		if (timeType == "hour") {
			$("#monthDiv").css("display", "block");
			$("#dayDiv").css("display", "block");
			$("#hourDiv").css("display", "block");
		};
		if (timeType == "day") {
			$("#monthDiv").css("display", "block");
			$("#dayDiv").css("display", "block");
		};
		if (timeType == "month") {
			$("#monthDiv").css("display", "block");
		};
		if (timeType == "week") {
			$("#weekDiv").css("display", "block");
		};
	},
	addTime: function() {
		// var timeType = $("#timeType").val();
		var timeType = "hour";
		var year = "";
		var resArrText = new Array();
		var resArrValue = new Array();
		$("#yearUl").find("input[name = 'year']").each(function(n) {
			if ($(this).is(":checked")) {
				year = $(this).val();
			};
		});
		//判断年份是否为空
		if (year == "") {
			alert("请选择年份!");
		};
		if (timeType == "min") {
			var monthArr = new Array();
			var dayArr = new Array();
			var hourArr = new Array();
			var minArr = new Array();
			$("#monthUl").find("input[name = 'month']").each(function(n) {
				if ($(this).is(":checked")) {
					monthArr.push($(this).val());
				};
			});
			$("#dayUl").find("input[name = 'day']").each(function(n) {
				if ($(this).is(":checked")) {
					dayArr.push($(this).val());
				};
			});
			$("#hourUl").find("input[name = 'hour']").each(function(n) {
				if ($(this).is(":checked")) {
					hourArr.push($(this).val());
				};
			});
			$("#minUl").find("input[name = 'min']").each(function(n) {
				if ($(this).is(":checked")) {
					minArr.push($(this).val());
				};
			});
			//判断月日小时是否为空
			if (monthArr.length == 0) {
				alert("请选择月份!");
				return;
			};
			if (dayArr.length == 0) {
				alert("请选择日期!");
				return;
			};
			if (hourArr.length == 0) {
				alert("请选择小时!");
				return;
			};
			if (minArr.length == 0) {
				alert("请选择分钟!");
				return;
			};
			for (var m = 0; m < monthArr.length; m++) {
				for (var d = 0; d < dayArr.length; d++) {
					for (var h = 0; h < hourArr.length; h++) {
						for (var min = 0; min < minArr.length; min++) {
							var timeStrText = year + "-" + monthArr[m] + "-" + dayArr[d] + " " + hourArr[h] + ":" + minArr[min] + ":00";
							var timeStrValue = year + monthArr[m] + dayArr[d] + hourArr[h] + minArr[min] + "00";
							resArrText.push(timeStrText);
							resArrValue.push(timeStrValue);
						};
					};
				};
			};

		}; //if hour 
		if (timeType == "hour") {
			var monthArr = new Array();
			var dayArr = new Array();
			var hourArr = new Array();
			$("#monthUl").find("input[name = 'month']").each(function(n) {
				if ($(this).is(":checked")) {
					monthArr.push($(this).val());
				};
			});
			$("#dayUl").find("input[name = 'day']").each(function(n) {
				if ($(this).is(":checked")) {
					dayArr.push($(this).val());
				};
			});
			$("#hourUl").find("input[name = 'hour']").each(function(n) {
				if ($(this).is(":checked")) {
					hourArr.push($(this).val());
				};
			});
			//判断月日小时是否为空
			if (monthArr.length == 0) {
				alert("请选择月份!");
			};
			if (dayArr.length == 0) {
				alert("请选择日期!");
			};
			if (hourArr.length == 0) {
				alert("请选择小时!");
			};
			for (var m = 0; m < monthArr.length; m++) {
				for (var d = 0; d < dayArr.length; d++) {
					for (var h = 0; h < hourArr.length; h++) {
						var timeStrText = year + "-" + monthArr[m] + "-" + dayArr[d] + " " + hourArr[h] + ":00:00";
						var timeStrValue = year + monthArr[m] + dayArr[d] + hourArr[h] + "0000";
						resArrText.push(timeStrText);
						resArrValue.push(timeStrValue);
					};
				};
			};

		}; //if hour 
		if (timeType == "day") {
			var monthArr = new Array();
			var dayArr = new Array();
			$("#monthUl").find("input[name = 'month']").each(function(n) {
				if ($(this).is(":checked")) {
					monthArr.push($(this).val());
				};
			});
			$("#dayUl").find("input[name = 'day']").each(function(n) {
				if ($(this).is(":checked")) {
					dayArr.push($(this).val());
				};
			});
			//判断月日是否为空
			if (monthArr.length == 0) {
				alert("请选择月份!");
			};
			if (dayArr.length == 0) {
				alert("请选择日期!");
			};
			for (var m = 0; m < monthArr.length; m++) {
				for (var d = 0; d < dayArr.length; d++) {
					var timeStrText = year + "-" + monthArr[m] + "-" + dayArr[d];
					var timeStrValue = year + monthArr[m] + dayArr[d] + "000000";
					resArrText.push(timeStrText);
					resArrValue.push(timeStrValue);
				};
			};
		}; //if day 
		if (timeType == "month") {
			var monthArr = new Array();
			var dayArr = new Array();
			$("#monthUl").find("input[name = 'month']").each(function(n) {
				if ($(this).is(":checked")) {
					monthArr.push($(this).val());
				};
			});
			//判断月是否为空
			if (monthArr.length == 0) {
				alert("请选择月份!");
			};
			for (var m = 0; m < monthArr.length; m++) {
				var timeStrText = year + "年" + monthArr[m] + "月";
				var timeStrValue = year + monthArr[m] + "00000000";
				resArrText.push(timeStrText);
				resArrValue.push(timeStrValue);
			};
		}; //if month
		if (timeType == "week") {
			var weekArr = new Array();
			$("#weekUl").find("input[name = 'week']").each(function(n) {
				if ($(this).is(":checked")) {
					weekArr.push($(this).val());
				};
			});
			//判断周是否为空
			if (weekArr.length == 0) {
				alert("请选择周数!");
			};
			for (var w = 0; w < weekArr.length; w++) {
				var timeStrText = year + "年第" + weekArr[w] + "周";
				var timeStrValue = year + weekArr[w] + "00000000";
				resArrText.push(timeStrText);
				resArrValue.push(timeStrValue);
			};
		}; //if week      

		//循环resArr
		var resHtmlStr = "";
		for (var i = 0; i < resArrText.length; i++) {
			resHtmlStr += '<li><input type="checkbox" name="res" value="' + resArrValue[i] + '" />' + resArrText[i] + '</li>';
		};
		$("#resUl").html(resHtmlStr);


	},
	deleTime: function() {
		$("#resUl").find("input[name = 'res']").each(function(n) {
			if ($(this).is(":checked")) {
				$(this).parent().css("display", "none")
			};
		});
	},
	deleAllTime: function() {
		$("#resUl").html("");
	}

};