<%@ page contentType="text/html;charset=utf-8"%>
<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<%@ include file="/commonSelfReport/baselib.jsp"%>

<!--引用easyui框架-->
<script src="${ctx}/pages/2GHighCapacity/easyui/jquery.easyui.min.js" type="text/javascript"></script>
<script src="${ctx}/pages/2GHighCapacity/easyui/easyui/locale/easyui-lang-zh_CN.js" type="text/javascript"></script>
<link rel="stylesheet" type="text/css" href="${ctx}/pages/2GHighCapacity/themes/default/easyui.css" />
<link rel="stylesheet" type="text/css" href="${ctx}/pages/2GHighCapacity/themes/icon.css" />


<link rel="stylesheet" type="text/css" href="${ctx}/static/styles/default/common.css" />

<link rel="stylesheet" type="text/css" href="${ctx}/static/styles/default/com_form.css" />

<!--引用背景图片--> 
<%@ include file="aBackGround.jsp" %>

<!--自己的js-->
<script src="${ctx}/scripts/newCommon/commonFunc.js" type="text/javascript"></script>
<script src="${ctx}/scripts/reportManageSys/lisanTime.js" type="text/javascript"></script>

<script type="text/javascript">
	$(document).ready(function(){
		 treeTime.init(); 
       
	});
</script>
<style type="text/css">
    input[type="checkbox"] {
         margin-left: 10px;
     }
</style>
</head>
<body style="background-color: #fff;">
    <div style="border: 0px solid #e8e8e8 ; ">
        
        <!--年模块-->
        <div style="height: 275px">
            <div style="float: left; width: 90px;height: 275px; border: 1px solid #99bbe8;margin-right: 5px">
                <ul id="yearUl">
                    
                </ul>
            </div>
            <!--月模块-->
            <div id="monthDiv" style="float: left; width: 90px; height: 275px; border: 1px solid #99bbe8;margin-right: 5px">
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
            <div id="dayDiv" style="float: left; width: 100px; height: 275px;border: 1px solid #99bbe8;margin-right: 5px">
                 <div style="height: 25px ;"><input type="checkbox" id="dayAll" onchange="treeTime.dayAll()" />全选</div>
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
            <div id="hourDiv" style="float: left; width: 100px; height: 275px;border: 1px solid #99bbe8;margin-right: 5px">
                 <div style="height: 25px ;"><input type="checkbox" id="hourAll" onchange="treeTime.hourAll()" />全选</div>
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
            <!--分钟模块-->
            <div id="minDiv" style="float: left; width: 100px; height: 275px;border: 1px solid #99bbe8;margin-right: 5px">
                 <div style="height: 25px ;"><input type="checkbox" id="minAll" onchange="treeTime.minAll()" />全选</div>
                 <div style="height: 248px;overflow:auto; margin-left: 15px">
                     <ul id="minUl">
                         <li><input type="checkbox" name="min" value="00" />00分</li>
                         <!-- <li><input type="checkbox" name="min" value="01" />01分</li>
                         <li><input type="checkbox" name="min" value="02" />02分</li>
                         <li><input type="checkbox" name="min" value="03" />03分</li>
                         <li><input type="checkbox" name="min" value="04" />04分</li> -->
                         <li><input type="checkbox" name="min" value="05" />05分</li>
                         <!-- <li><input type="checkbox" name="min" value="06" />06分</li>
                         <li><input type="checkbox" name="min" value="07" />07分</li>
                         <li><input type="checkbox" name="min" value="08" />08分</li>
                         <li><input type="checkbox" name="min" value="09" />09分</li> -->
                         <li><input type="checkbox" name="min" value="10" />10分</li>
                         <!-- <li><input type="checkbox" name="min" value="11" />11分</li>
                         <li><input type="checkbox" name="min" value="12" />12分</li>
                         <li><input type="checkbox" name="min" value="13" />13分</li>
                         <li><input type="checkbox" name="min" value="14" />14分</li> -->
                         <li><input type="checkbox" name="min" value="15" />15分</li>
                         <!-- <li><input type="checkbox" name="min" value="16" />16分</li>
                         <li><input type="checkbox" name="min" value="17" />17分</li>
                         <li><input type="checkbox" name="min" value="18" />18分</li>
                         <li><input type="checkbox" name="min" value="19" />19分</li> -->
                         <li><input type="checkbox" name="min" value="20" />20分</li>
                         <!-- <li><input type="checkbox" name="min" value="21" />21分</li>
                         <li><input type="checkbox" name="min" value="22" />22分</li>
                         <li><input type="checkbox" name="min" value="23" />23分</li> 
                         <li><input type="checkbox" name="min" value="24" />24分</li> -->
                         <li><input type="checkbox" name="min" value="25" />25分</li>
                         <!-- <li><input type="checkbox" name="min" value="26" />26分</li>
                         <li><input type="checkbox" name="min" value="27" />27分</li>
                         <li><input type="checkbox" name="min" value="28" />28分</li>
                         <li><input type="checkbox" name="min" value="29" />29分</li> -->
                         <li><input type="checkbox" name="min" value="30" />30分</li>
                         <!-- <li><input type="checkbox" name="min" value="31" />31分</li>
                         <li><input type="checkbox" name="min" value="32" />32分</li>
                         <li><input type="checkbox" name="min" value="33" />33分</li>
                         <li><input type="checkbox" name="min" value="34" />34分</li> -->
                         <li><input type="checkbox" name="min" value="35" />35分</li>
                         <!-- <li><input type="checkbox" name="min" value="36" />36分</li>
                         <li><input type="checkbox" name="min" value="37" />37分</li>
                         <li><input type="checkbox" name="min" value="38" />38分</li>
                         <li><input type="checkbox" name="min" value="39" />39分</li> -->
                         <li><input type="checkbox" name="min" value="40" />40分</li>
                         <!-- <li><input type="checkbox" name="min" value="41" />41分</li>
                         <li><input type="checkbox" name="min" value="42" />42分</li>
                         <li><input type="checkbox" name="min" value="43" />43分</li>
                         <li><input type="checkbox" name="min" value="44" />44分</li> -->
                         <li><input type="checkbox" name="min" value="45" />45分</li>
                         <!-- <li><input type="checkbox" name="min" value="46" />46分</li>
                         <li><input type="checkbox" name="min" value="47" />47分</li>
                         <li><input type="checkbox" name="min" value="48" />48分</li>
                         <li><input type="checkbox" name="min" value="49" />49分</li> -->
                         <li><input type="checkbox" name="min" value="50" />50分</li>
                         <!-- <li><input type="checkbox" name="min" value="51" />51分</li>
                         <li><input type="checkbox" name="min" value="52" />52分</li>
                         <li><input type="checkbox" name="min" value="53" />53分</li>
                         <li><input type="checkbox" name="min" value="54" />54分</li> -->
                         <li><input type="checkbox" name="min" value="55" />55分</li>
                         <!-- <li><input type="checkbox" name="min" value="56" />56分</li>
                         <li><input type="checkbox" name="min" value="57" />57分</li>
                         <li><input type="checkbox" name="min" value="58" />58分</li>
                         <li><input type="checkbox" name="min" value="59" />59分</li> -->
                     </ul>                 </div>
            </div>
            <!--周模块-->
            <div id="weekDiv" style="display: none; float: left; width: 150px; height: 275px; border: 1px solid #99bbe8;margin-right: 5px;overflow:auto">
                <ul id="weekUl">
                    
                </ul> 
            </div>
            <!--按钮模块-->
            <div style="float: left; width: 80px; height: 275px;border: 0px solid #99bbe8;margin-right: 5px;padding-top: 70px;">
               <center>
                 <button class="btn btn-success btn-sm" href="#" onclick="treeTime.addTime()">增加</button><br/><br/>
                 <button class="btn btn-success btn-sm" href="#" onclick="treeTime.deleTime()">删除</button><br/><br/>
                 <button class="btn btn-success btn-sm" href="#" onclick="treeTime.deleAllTime()">全删</button>
               </center>  
            </div> 
            <!--结果模块-->
            <div style="float: left; width: 180px; height: 275px;border: 1px solid #99bbe8;margin-right: 5px;overflow:auto;">
                     <ul id="resUl">
                         
                     </ul> 
            </div>

        </div>

    </div>     


</body>
</html>