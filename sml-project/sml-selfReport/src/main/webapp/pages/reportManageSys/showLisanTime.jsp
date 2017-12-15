<%@ page contentType="text/html;charset=utf-8"%>
<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<%@ include file="/commonSelfReport/baselib.jsp"%>




<link rel="stylesheet" type="text/css" href="${ctx}/static/styles/default/common.css" />

<link rel="stylesheet" type="text/css" href="${ctx}/static/styles/default/com_form.css" />

<!--引用背景图片--> 
<%@ include file="aBackGround.jsp" %>

<!--自己的js-->
<script src="${ctx}/scripts/newCommon/commonFunc.js" type="text/javascript"></script>
<script src="${ctx}/scripts/reportManageSys/showLisanTime.js" type="text/javascript"></script>

<script type="text/javascript">
    $(document).ready(function(){
         showLisanTime.init(); 
       
    });
</script>
</head>
<body>
    <div style="border: 0px solid #e8e8e8 ; ">
        <div style="border: 1px solid #e8e8e8 ;margin-bottom: 10px;padding: 5px; "> 
            <input name="timeType" type="radio" class="RadioStyle" id="min" value="min" style="margin-left: 0px; margin-right: 5px; display: none;"  onclick="showLianxuTime.changeTimeType()" /><span id="label_min" style="display: none; margin-right: 20px" >5分钟</span>
            <input name="timeType" type="radio" class="RadioStyle" id="_15min" value="15min" style="margin-left: 0px; margin-right: 5px; display: none;"  onclick="showLianxuTime.changeTimeType()" /><span id="label_15min" style="display: none; margin-right: 20px" >15分钟</span>
            <input name="timeType" type="radio" class="RadioStyle" id="_30min" value="30min" style="margin-left: 0px; margin-right: 5px; display: none;"  onclick="showLianxuTime.changeTimeType()" /><span id="label_30min" style="display: none; margin-right: 20px" >30分钟</span>

            <input name="timeType" type="radio" class="RadioStyle" id="hour" value="hour" style="margin-left: 0px; margin-right: 5px; display: none;"  onclick="showLisanTime.changeTimeType()" /><span id="label_hour" style="display: none; margin-right: 20px" >小时</span>

            <input name="timeType" type="radio" class="RadioStyle" id="day" value="day" style="margin-left: 0px;margin-right: 5px; display: none;"  onclick="showLisanTime.changeTimeType()"  checked="checked"/><span id="label_day" style="display: none;margin-right: 20px">日</span>
            
              <input name="timeType" type="radio" class="RadioStyle" id="week" value="week" style="margin-left: 0px; margin-right: 5px; display: none;"  onclick="showLisanTime.changeTimeType()" /><span id="label_week" style="display: none;margin-right: 20px" >周</span>
            
             <input name="timeType" type="radio" class="RadioStyle" id="month" value="month" style="margin-left: 0px; margin-right: 5px; display: none;" onclick="showLisanTime.changeTimeType()" /><span id="label_month" style="margin-right: 20px; display: none;margin-right: 20px">月</span>   
        </div>
        
        <!--年模块-->
        <div style="padding-top: 10px;height: 290px">
            <div style="float: left; width: 120px;height: 275px; border: 1px solid #99bbe8;margin-right: 5px">
                <ul id="yearUl">
                    
                </ul>
            </div>
            <!--月模块-->
            <div id="monthDiv" style="float: left; width: 120px; height: 275px; border: 1px solid #99bbe8;margin-right: 5px">
                <ul id="monthUl">
                    <li><input type="checkbox" name="month" value="01" />1月</li>
                    <li><input type="checkbox" name="month" value="02" />2月</li>
                    <li><input type="checkbox" name="month" value="03" />3月</li>
                    <li><input type="checkbox" name="month" value="04" />4月</li>
                    <li><input type="checkbox" name="month" value="05" />5月</li>
                    <li><input type="checkbox" name="month" value="06" />6月</li>
                    <li><input type="checkbox" name="month" value="07" />7月</li>
                    <li><input type="checkbox" name="month" value="08" />8月</li>
                    <li><input type="checkbox" name="month" value="09" />9月</li>
                    <li><input type="checkbox" name="month" value="10"/>10月</li>
                    <li><input type="checkbox" name="month" value="11"/>11月</li>
                    <li><input type="checkbox" name="month" value="12"/>12月</li>
                </ul> 
            </div>
            <!--日模块-->
            <div id="dayDiv" style="float: left; width: 120px; height: 275px;border: 1px solid #99bbe8;margin-right: 5px">
                 <div style="height: 25px ;"><input type="checkbox" id="dayAll" onchange="showLisanTime.dayAll()" />全选</div>
                 <div style="height: 248px;overflow:auto; margin-left: 15px">
                     <ul id="dayUl">
                         <li><input type="checkbox" name="day" value="01" />1日</li>
                         <li><input type="checkbox" name="day" value="02" />2日</li>
                         <li><input type="checkbox" name="day" value="02" />3日</li>
                         <li><input type="checkbox" name="day" value="04" />4日</li>
                         <li><input type="checkbox" name="day" value="05" />5日</li>
                         <li><input type="checkbox" name="day" value="06" />6日</li>
                         <li><input type="checkbox" name="day" value="07" />7日</li>
                         <li><input type="checkbox" name="day" value="08" />8日</li>
                         <li><input type="checkbox" name="day" value="09" />9日</li>
                         <li><input type="checkbox" name="day" value="10"/>10日</li>
                         <li><input type="checkbox" name="day" value="11"/>11日</li>
                         <li><input type="checkbox" name="day" value="12"/>12日</li>
                         <li><input type="checkbox" name="day" value="13"/>13日</li>
                         <li><input type="checkbox" name="day" value="14"/>14日</li>
                         <li><input type="checkbox" name="day" value="15"/>15日</li>
                         <li><input type="checkbox" name="day" value="16"/>16日</li>
                         <li><input type="checkbox" name="day" value="17"/>17日</li>
                         <li><input type="checkbox" name="day" value="18"/>18日</li>
                         <li><input type="checkbox" name="day" value="19"/>19日</li>
                         <li><input type="checkbox" name="day" value="20"/>20日</li>
                         <li><input type="checkbox" name="day" value="21"/>21日</li>
                         <li><input type="checkbox" name="day" value="22"/>22日</li>
                         <li><input type="checkbox" name="day" value="23"/>23日</li>
                         <li><input type="checkbox" name="day" value="24"/>24日</li>
                         <li><input type="checkbox" name="day" value="25"/>25日</li>
                         <li><input type="checkbox" name="day" value="26"/>26日</li>
                         <li><input type="checkbox" name="day" value="27"/>27日</li>
                         <li><input type="checkbox" name="day" value="28"/>28日</li>
                         <li><input type="checkbox" name="day" value="29"/>29日</li>
                         <li><input type="checkbox" name="day" value="30"/>30日</li>
                         <li><input type="checkbox" name="day" value="31"/>31日</li>
                     </ul> 
                 </div>
            </div>
            <!--小时模块-->
            <div id="hourDiv" style="float: left; width: 120px; height: 275px;border: 1px solid #99bbe8;margin-right: 5px;display: none">
                 <div style="height: 25px ;"><input type="checkbox" id="hourAll" onchange="showLisanTime.hourAll()" />全选</div>
                 <div style="height: 248px;overflow:auto; margin-left: 15px">
                     <ul id="hourUl">
                         <li><input type="checkbox" name="hour" value="00"  />0时</li>
                         <li><input type="checkbox" name="hour" value="01"  />1时</li>
                         <li><input type="checkbox" name="hour" value="02"  />2时</li>
                         <li><input type="checkbox" name="hour" value="03"  />3时</li>
                         <li><input type="checkbox" name="hour" value="04"  />4时</li>
                         <li><input type="checkbox" name="hour" value="05"  />5时</li>
                         <li><input type="checkbox" name="hour" value="06"  />6时</li>
                         <li><input type="checkbox" name="hour" value="07"  />7时</li>
                         <li><input type="checkbox" name="hour" value="08"  />8时</li>
                         <li><input type="checkbox" name="hour" value="09"  />9时</li>
                         <li><input type="checkbox" name="hour" value="10" />10时</li>
                         <li><input type="checkbox" name="hour" value="11" />11时</li>
                         <li><input type="checkbox" name="hour" value="12" />12时</li>
                         <li><input type="checkbox" name="hour" value="13" />13时</li>
                         <li><input type="checkbox" name="hour" value="14" />14时</li>
                         <li><input type="checkbox" name="hour" value="15" />15时</li>
                         <li><input type="checkbox" name="hour" value="16" />16时</li>
                         <li><input type="checkbox" name="hour" value="17" />17时</li>
                         <li><input type="checkbox" name="hour" value="18" />18时</li>
                         <li><input type="checkbox" name="hour" value="19" />19时</li>
                         <li><input type="checkbox" name="hour" value="20" />20时</li>
                         <li><input type="checkbox" name="hour" value="21" />21时</li>
                         <li><input type="checkbox" name="hour" value="22" />22时</li>
                         <li><input type="checkbox" name="hour" value="23" />23时</li>
                         
                     </ul> 
                 </div>
            </div>
            <!--周模块-->
            <div id="weekDiv" style="display: none; float: left; width: 150px; height: 275px; border: 1px solid #99bbe8;margin-right: 5px;overflow:auto">
                <ul id="weekUl">
                    
                </ul> 
            </div>
            <!--按钮模块-->
            <div style="float: left; width: 80px; height: 275px;border: 0px solid #99bbe8;margin-right: 5px;padding-top: 70px;">
               <center>
                 <button class="btn btn-success btn-sm" href="#" onclick="showLisanTime.addTime()">增加</button><br/><br/>
                 <button class="btn btn-success btn-sm" href="#" onclick="showLisanTime.deleTime()">删除</button><br/><br/>
                 <button class="btn btn-success btn-sm" href="#" onclick="showLisanTime.deleAllTime()">全删</button>
               </center>  
            </div> 
            <!--结果模块-->
            <div style="float: left; width: 200px; height: 275px;border: 1px solid #99bbe8;margin-right: 5px;overflow:auto;">
                     <ul id="resUl">
                         
                     </ul> 
            </div>

        </div>

    </div>     


</body>
</html>