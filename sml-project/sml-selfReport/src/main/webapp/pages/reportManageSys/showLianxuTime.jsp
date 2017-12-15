<%@ page contentType="text/html;charset=utf-8"%>
<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<%@ include file="/commonSelfReport/baselib.jsp"%>




<link rel="stylesheet" type="text/css" href="${ctx}/static/styles/default/common.css" />

<link rel="stylesheet" type="text/css" href="${ctx}/static/styles/default/com_form.css" />



<!--自己的js-->
<script src="${ctx}/scripts/newCommon/commonFunc.js" type="text/javascript"></script>
<script src="${ctx}/scripts/reportManageSys/showLianxuTime.js" type="text/javascript"></script>

<script type="text/javascript">
    $(document).ready(function(){
         showLianxuTime.init(); 
    });
</script>
</head>
<body>
    <div style="border: 0px solid #e8e8e8 ; ">
         <div style="border: 1px solid #e8e8e8 ;margin-bottom: 10px;padding: 5px; "> 
             <input name="timeType" type="radio" class="RadioStyle" id="min" value="min" style="margin-left: 0px; margin-right: 5px; display: none;"  onclick="showLianxuTime.changeTimeType()" /><span id="label_min" style="display: none; margin-right: 20px" >5分钟</span>
             <input name="timeType" type="radio" class="RadioStyle" id="_15min" value="15min" style="margin-left: 0px; margin-right: 5px; display: none;"  onclick="showLianxuTime.changeTimeType()" /><span id="label_15min" style="display: none; margin-right: 20px" >15分钟</span>
             <input name="timeType" type="radio" class="RadioStyle" id="_30min" value="30min" style="margin-left: 0px; margin-right: 5px; display: none;"  onclick="showLianxuTime.changeTimeType()" /><span id="label_30min" style="display: none; margin-right: 20px" >30分钟</span>

             <input name="timeType" type="radio" class="RadioStyle" id="hour" value="hour" style="margin-left: 0px; margin-right: 5px; display: none;"  onclick="showLianxuTime.changeTimeType()" /><span id="label_hour" style="display: none; margin-right: 20px" >小时</span>

             <input name="timeType" type="radio" class="RadioStyle" id="day" value="day" style="margin-left: 0px;margin-right: 5px; display: none;"  onclick="showLianxuTime.changeTimeType()"  checked="checked"/><span id="label_day" style="display: none;margin-right: 20px">日</span>
             
               <input name="timeType" type="radio" class="RadioStyle" id="week" value="week" style="margin-left: 0px; margin-right: 5px; display: none;"  onclick="showLianxuTime.changeTimeType()" /><span id="label_week" style="display: none;margin-right: 20px" >周</span>
             
              <input name="timeType" type="radio" class="RadioStyle" id="month" value="month" style="margin-left: 0px; margin-right: 5px; display: none;" onclick="showLianxuTime.changeTimeType()" /><span id="label_month" style="margin-right: 20px; display: none;margin-right: 20px">月</span>   
         </div> 
         <div id="time" style="height: 200px"></div>  

    </div>     
</body>
</html>