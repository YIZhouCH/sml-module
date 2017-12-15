<%@ page language="java" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!-- <link rel="stylesheet" type="text/css" href="${ctx}/static/styles/default/icon.css" /> -->
<script src="${ctx}/scripts/commonUtils/Map.js" type="text/javascript"></script>

<%-- <c:set var="HolidayName" value="<%=WebApplicationContextUtils.getRequiredWebApplicationContext(getServletContext()).getBean(InasCommonDataController.class).getHoliday()%>" />
 --%>
<script type="text/javascript">	

	var ProjectConstants = {
			PROVINCEID : 21,
			PROVINCE_LOCALID : 21,
			PROVINCENAME : "上海市",
			CAPITAL_AREA_ID : 21,
			CAPITAL_AREA_SIMP_NAME : '上海市',
			AREAID : 21,//引入v3版端到端时用到
			AREANAME : "上海市"
			
			
			
			
	}

	function formattime(time) {
		var test = time.replace(/-/g, "");
		test = test.replace(/\s/ig, '');
		test = test.replace(/:/ig, '');
		test = test.replace(/第/ig, '');
		test = test.replace(/年/ig, '');
		test = test.replace(/周/ig, '');
		return test;
	}	

	//权限控制
	function changeAreas(){
		$.ajax({
			type : 'POST',
			async : false,
			dataType : "json",
			url : eastcom.baseURL + '/common/fecthCitiesByUser',//fecthCities
			success : function(data) {
				$("#areasSelect").find("option").remove();
				for(var i =0;i<data.length;i++){
					var item = data[i];
					$("#areasSelect").append( "<option value='"+item.value+"' "+(i==0?"checked":"")+">"+item.text+"</option>" );
				}
			}
		});
	}
	//权限不控制，默认上海市
	function changeAreasNoRule(){
		$.ajax({
			type : 'POST',
			async : false,
			dataType : "json",
			url : eastcom.baseURL + '/common/fecthCities',//fecthCities
			success : function(data) {
				$("#areasSelect").find("option").remove();
				for(var i =0;i<data.length;i++){
					var item = data[i];
					$("#areasSelect").append( "<option value='"+item.value+"' "+(i==0?"checked":"")+">"+item.text+"</option>" );
				}
				$("#areasSelect").val(ProjectConstants.AREAID);
			}
		});
	}
	function changeCitysAnother(city){//目的让默认显示的无锡下面的区县一开始的时候加载出来
		$.ajax({
			type : 'POST',
			async : false,
			dataType : "json",
			url : eastcom.baseURL + '/common/getCitysByAreaId',
			data : {
				area_id:city
			},
			success : function(data) {
				$("#citysSelect").find("option").remove();
				$("#citysSelect").append( "<option value=''>-区县-</option>" );
				var data = data.data;
				if(city!='21'){
					for(var i =0;i<data.length;i++){
						var item = data[i];
						$("#citysSelect").append( "<option value='"+item.value+"'>"+item.text+"</option>" );
					}
				}
				$("#citysSelect").css('width','90px');
			}
		});
	}

	function changeCitys(obj){
		var city = obj.value;
		$.ajax({
			type : 'POST',
			async : false,
			dataType : "json",
			url : eastcom.baseURL + '/common/getCitysByAreaId',
			data : {
				area_id:city
			},
			success : function(data) {
				$("#citysSelect").find("option").remove();
				$("#citysSelect").append( "<option value=''>-区县-</option>" );
				var data = data.data;
				if(city!='21'){
					for(var i =0;i<data.length;i++){
						var item = data[i];
						$("#citysSelect").append( "<option value='"+item.value+"'>"+item.text+"</option>" );
					}
				}
				$("#citysSelect").css('width','90px');
			}
		});
	}

	function getYearWeek(a, b, c) { 
		/* 
		date1是当前日期 
		date2是当年第一天 
		d是当前日期是今年第多少天 
		用d + 当前年的第一天的周差距的和在除以7就是本年第几周 
		*/
		var date1 = new Date(a, parseInt(b) - 1, c), date2 = new Date(a, 0, 1), 
		d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000); 
		return Math.ceil((d + ((date2.getDay() + 1) - 1)) / 7); 
	};
	//求一年总共有多少周
	function getNumOfWeeks(year){
		var d=new Date(year,0,1);
		var yt=( ( year%4==0 && year%100!=0) || year%400==0)? 366:365; 
		return Math.ceil((yt-d.getDay())/7.0);
	}

	function initTime(){
		var date = new Date(); 
		var strHour = date.format("yyyy-MM-dd hh:00");
		var year = date.getFullYear();
		var month = date.getMonth()+1;
		var dataDay = date;
		dataDay.setDate(dataDay.getDate()-1);
		var strDay = dataDay.format("yyyy-MM-dd");
		var dateMonth = new Date();
		dateMonth.setDate(1);
		dateMonth.setMonth(dateMonth.getMonth()-1);
		$("#timeField_hour").val(strHour);
		$("#timeField_day").val(strDay);//strDay
		$("#timeField_month").val(dateMonth.format("yyyy-MM"));
		//处理周的时间
		var today = new Date();
		var weekToday = new Date();//获取上周最大日期
		if(today.getDay()==0){//星期日
			weekToday.setDate(weekToday.getDate()-7);
		}else{
			weekToday.setDate(weekToday.getDate()-weekToday.getDay());
		}
		var tY = today.getFullYear();
		var tM = today.getMonth()+1;
		var tD = today.getDate()-1;
		var week = getYearWeek(tY,tM,tD);
		tM = tM<10?("0"+tM):tM;
		tD = tD<10?("0"+tD):tD;
		if(week=='01'){
			tY = tY - 1;
			week = getNumOfWeeks(tY);
		}else{
			week = week - 1;
		}
		week = week<10?("0"+week):week;
		$("#timeField_week").val(tY+"-"+week);
		$('#timeField_week').bind('focus',function(){
			WdatePicker({isShowWeek:true,errDealMode:3,maxDate:weekToday.format("yyyy-MM-dd"),autoPickDate:true,firstDayOfWeek:1,
			onpicked:function() {$dp.$('timeField_week').value=$dp.cal.getP('y')+'-'+$dp.cal.getP('W');}
		})});
	}

	function changeTimeFiledType(a,none1,none2,none3){
		$("#timeField_"+a).css('display','block');
		$("#timeField_"+none1).css('display','none');
		$("#timeField_"+none2).css('display','none');
		$("#timeField_"+none3).css('display','none');
	}
</script>

