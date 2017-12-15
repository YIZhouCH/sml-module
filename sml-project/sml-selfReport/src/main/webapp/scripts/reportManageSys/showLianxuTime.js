var showLianxuTime = {
	init: function() {
		showLianxuTime.loadTime();
		showLianxuTime.getParentParams();
		showLianxuTime.showTimeDiv();
		showLianxuTime.changeTimeType();
	},
	initTime: function() {

		/*var  year=now.getFullYear();
			var  month=now.getMonth()+1;
			var  day=now.getDate();
			var  hour=now.getHours();
			var  minute=now.getMinutes();
			var  second=now.getSeconds();*/

		var startMin = new Date();
		startMin.setHours(startMin.getHours() - 1);
		var endMin = new Date();

		var startHour = new Date();
		startHour.setHours(startHour.getHours() - 24);
		var endHour = new Date();
		var endHour = new Date(endHour.getTime() + 1*60*60*1000);

		var startDay = new Date();
//		startDay.setDate(startDay.getDate() - 1);
		startDay.setDate(startDay.getDate() - 2);
		var endDay = new Date();
//		var endDay = new Date(endDay.getTime() + 24*60*60*1000);

		var startMonth = new Date();
		startMonth.setMonth(startMonth.getMonth() - 12);
		var endMonth = new Date();

		$("#timeField_min").val(startMin.format("yyyy-MM-dd hh:mm"));
		$("#timeField_min2").val(endMin.format("yyyy-MM-dd hh:mm"));
		$("#timeField_15min").val(startMin.format("yyyy-MM-dd hh:mm"));
		$("#timeField_15min2").val(endMin.format("yyyy-MM-dd hh:mm"));
		$("#timeField_30min").val(startMin.format("yyyy-MM-dd hh:mm"));
		$("#timeField_30min2").val(endMin.format("yyyy-MM-dd hh:mm"));
		$("#timeField_hour").val(startHour.format("yyyy-MM-dd hh"));
		$("#timeField_hour2").val(endHour.format("yyyy-MM-dd hh"));
		$("#timeField_day").val(startDay.format("yyyy-MM-dd"));
		$("#timeField_day2").val(endDay.format("yyyy-MM-dd"));
		$("#timeField_month").val(startMonth.format("yyyy-MM"));
		$("#timeField_month2").val(endMonth.format("yyyy-MM"));

		//处理周的时间



		var today = new Date();

		var weekToday = new Date(); //获取上周最大日期
		weekToday.setDate(weekToday.getDate());

		var tY = today.getFullYear();
		var tM = today.getMonth() + 1;
		var tD = today.getDate() - 1;
		var s_week = getYearWeek(tY, tM, tD);
		var week = getYearWeek(tY, tM, tD);
		tM = tM < 10 ? ("0" + tM) : tM;
		tD = tD < 10 ? ("0" + tD) : tD;
		if (week == '01') {
			tY = tY - 1;
			s_week = getNumOfWeeks(tY);
			week = getNumOfWeeks(tY);
		} else {
			s_week = week;
			week = week - 1;
		}

		s_week = s_week < 10 ? ("0" + s_week) : s_week;
		week = week < 10 ? ("0" + week) : week;

		$("#timeField_week").val(tY + "-" + week);
		$("#timeField_week2").val(tY + "-" + week);

		$('#timeField_week').bind('focus', function() {
			WdatePicker({
				isShowWeek: true,
				errDealMode: 3,
				maxDate: weekToday.format("yyyy-MM-dd"),
				autoPickDate: true,
				firstDayOfWeek: 1,
				onpicked: function() {
					$dp.$('timeField_week').value = $dp.cal.getP('y') + '-' + $dp.cal.getP('W');
				}
			})
		});
		$('#timeField_week2').bind('focus', function() {
			WdatePicker({
				isShowWeek: true,
				errDealMode: 3,
				maxDate: weekToday.format("yyyy-MM-dd"),
				autoPickDate: true,
				firstDayOfWeek: 1,
				onpicked: function() {
					$dp.$('timeField_week2').value = $dp.cal.getP('y') + '-' + $dp.cal.getP('W');
				}
			})
		});
	},
	changeTimeType: function() {
		// var type = $('#type').val() ;

		var type = $("input[name='timeType']:checked").val();
		$(".TimeFiled").css('display', 'none');
		$("#timeField_" + type).css('display', 'inline-block');
		$("#timeField_" + type + "2").css('display', 'inline-block');
	},
	loadTime: function() {

		var htmlStr = "";
		htmlStr += '<span style="margin-right: 10px">开始时间:</span>' +
			'<input id="timeField_min" class="Wdate TimeFiled" style="display: none; width: 150px;height:34px;" onclick="WdatePicker({dateFmt : \'yyyy-MM-dd HH:mm\',maxDate:\'%y-%M-%d 23:59\'})" />' +
			'<input id="timeField_15min" class="Wdate TimeFiled" style="display: none; width: 150px;height:34px;" onclick="WdatePicker({dateFmt : \'yyyy-MM-dd HH:mm\',maxDate:\'%y-%M-%d 23:59\'})" />' +
			'<input id="timeField_30min" class="Wdate TimeFiled" style="display: none; width: 150px;height:34px;" onclick="WdatePicker({dateFmt : \'yyyy-MM-dd HH:mm\',maxDate:\'%y-%M-%d 23:59\'})" />' +
			'<input id="timeField_hour" class="Wdate TimeFiled" style="display: none; width: 150px;height:34px;" onclick="WdatePicker({dateFmt : \'yyyy-MM-dd HH\',maxDate:\'%y-%M-%d 23\'})" />' +
			'<input id="timeField_day" class="Wdate TimeFiled" style="display: none; width: 150px;height:23px;" onclick="WdatePicker({dateFmt : \'yyyy-MM-dd\',maxDate:\'%y-%M-%d\'})" />' +
			'<input id="timeField_week" class="Wdate TimeFiled" style="display:none; width: 150px;height:23px;"/>' +
			'<input id="timeField_month" class="Wdate TimeFiled" style="display: none; width: 150px;height:34px;" onclick="WdatePicker({dateFmt : \'yyyy-MM\',maxDate:\'%y-{%M+1}\'})" />'
			/*+'<div style="display:'+displayFlag+'">'*/

			+
			'<span style="margin-right: 10px;margin-left:20px"> 结束时间:</span>' +
			'<input id="timeField_min2" class="Wdate TimeFiled" style="display: none; width: 150px;height:34px;" onclick="WdatePicker({dateFmt : \'yyyy-MM-dd HH:mm\',maxDate:\'%y-%M-%d 23:59\'})" />' +
			'<input id="timeField_15min2" class="Wdate TimeFiled" style="display: none; width: 150px;height:34px;" onclick="WdatePicker({dateFmt : \'yyyy-MM-dd HH:mm\',maxDate:\'%y-%M-%d 23:59\'})" />' +
			'<input id="timeField_30min2" class="Wdate TimeFiled" style="display: none; width: 150px;height:34px;" onclick="WdatePicker({dateFmt : \'yyyy-MM-dd HH:mm\',maxDate:\'%y-%M-%d 23:59\'})" />' +
			'<input id="timeField_hour2" class="Wdate TimeFiled" style="display: none; width: 150px;height:34px;" onclick="WdatePicker({dateFmt : \'yyyy-MM-dd HH\',maxDate:\'%y-%M-%d 23\'})" />' +
			'<input id="timeField_day2" class="Wdate TimeFiled" style="display: none; width: 150px;height:23px;" onclick="WdatePicker({dateFmt : \'yyyy-MM-dd\',maxDate:\'%y-%M-%d\'})" />' +
			'<input id="timeField_week2" class="Wdate TimeFiled" style="display:none; width: 150px;height:23px;"/>' +
			'<input id="timeField_month2" class="Wdate TimeFiled" style="display: none; width: 150px;height:34px;" onclick="WdatePicker({dateFmt : \'yyyy-MM\',maxDate:\'%y-{%M+1}\'})" />'
		/*+'</div>'*/



		$("#time").html(htmlStr);

		showLianxuTime.initTime();

	},
	getParentParams: function() {
		var param = publicReport.showTimeParam(); //["lianxu", ["day", "week"]]
		return param;

	},
	showTimeDiv: function() {
		var timeArr = showLianxuTime.getParentParams();
		//var lianxu = timeArr[0];
		var timeTypeArr = timeArr[1];
		for (var i = 0; i < timeTypeArr.length; i++) {
			if (timeTypeArr[i] == "15min") {
                  $("#_" + timeTypeArr[i]).css("display", "inline-block"); //显示radio
			};
			if (timeTypeArr[i] == "30min") {
                  $("#_" + timeTypeArr[i]).css("display", "inline-block"); //显示radio
			};
			$("#" + timeTypeArr[i]).css("display", "inline-block"); //显示radio
			$("#label_" + timeTypeArr[i]).css("display", "inline-block"); //显示label
			$("#" + timeTypeArr[0]).attr("checked", "checked"); //默认第一个radio选中
			$("#timeField_" + timeTypeArr[0]).css("display", "inline-block"); //显示时间框
			$("#timeField_" + timeTypeArr[0] + "2").css("display", "inline-block"); //显示时间框

		};

	}
};

function getNumOfWeeks(year) {
	var d = new Date(year, 0, 1);
	var yt = ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) ? 366 : 365;
	return Math.ceil((yt - d.getDay()) / 7.0);
};

var getYearWeek = function(a, b, c) {
	var date1 = new Date(a, parseInt(b) - 1, c),
		date2 = new Date(a, 0, 1),
		d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000);
	return Math.ceil((d + ((date2.getDay() + 1) - 1)) / 7);
};