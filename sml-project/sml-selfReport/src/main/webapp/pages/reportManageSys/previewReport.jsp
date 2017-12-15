<%@ page contentType="text/html;charset=utf-8" %>
<%@ page language="java" import="java.util.*" pageEncoding="utf-8" %>
<%String updateReportId=request.getParameter("updateReportId")==null?"1":request.getParameter("updateReportId"); %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<%@ include file="/commonSelfReport/baselib.jsp"%>

    <script src="easyui/jquery.easyui.min.js" type="text/javascript"></script>
    <script src="easyui/locale/easyui-lang-zh_CN.js" type="text/javascript"></script>
    <link rel="stylesheet" type="text/css" href="themes/bootstrap/easyui.css"/>
    <link rel="stylesheet" type="text/css" href="themes/icon.css"/>
    <link href="easyui/style/css/statisticalforms.css" rel="stylesheet" type="text/css"/>
    <!--自己的js-->
    <script src="${ctx}/scripts/reportManageSys/sql-formatter.min.js" type="text/javascript"></script>
    <script src="${ctx}/scripts/reportManageSys/jquery.json-2.4.min.js" type="text/javascript"></script>
    <script src="${ctx}/scripts/reportManageSys/commonAjax.js" type="text/javascript"></script>
    <script src="${ctx}/scripts/reportManageSys/previewReport.js" type="text/javascript"></script>
    <script src="${ctx}/scripts/reportManageSys/showLianxuTime.js" type="text/javascript"></script>
    <script src="${ctx}/scripts/reportManageSys/showLisanTime.js" type="text/javascript"></script>
    <script src="${ctx}/scripts/reportManageSys/componentSource.js" type="text/javascript"></script>
    <script src="${ctx}/scripts/reportManageSys/configUrl.js" type="text/javascript"></script>


    <link rel="stylesheet" type="text/css" href="${ctx}/static/reportManageSys/css/table.css"/>
    <!--引用背景图片-->
    <%@ include file="aBackGround.jsp" %>


    <script type="text/javascript">
    var updateReportId="<%=updateReportId%>";
    var contextPath = "${ctx}";
        $(document).ready(function () {
            $("#curr_id_div").html(updateReportId);
            var k = document.body.offsetWidth;
            document.getElementById("cententDiv").style.width = k + "px";
            document.getElementById("otherCondition").style.width = k + "px";
            publicReport.init();
            console.log(window.sqlFormatter);
        });
    </script>
    <style type="text/css">
        #list_left span, #list_left .on, #list_right span, #list_right .on {

            border: 0px solid #ddd;
            margin: 2px;
            cursor: pointer;
            display: block;
        }

        #list_left .on, #list_right .on {
            border: 0px solid red;
            background-color: #26a0da
        }
    </style>
</head>


<body style="overflow-x: hidden;">
<div id="curr_id_div" style="display: none"></div>    
<div id="cententDiv" style="border: 0px solid pink;position: absolute; ">
    <div style="border: 0px solid #e8e8e8">
        <div id="lianxuDiv" style="margin-top: 10px; display: none;">
            <div style="border: 0px solid #e8e8e8 ; ">
                <div id="lianxu_timetype" style="border: 1px solid #e8e8e8 ;margin-bottom: 10px;padding: 5px; ">
                    <input name="timeType" type="radio" class="RadioStyle" id="min" value="min"
                           style="margin-left: 0px; margin-right: 5px; display: none;"
                           onclick="showLianxuTime.changeTimeType()"/><span id="label_min"
                                                                            style="display: none; margin-right: 20px">5分钟</span>
                    <input name="timeType" type="radio" class="RadioStyle" id="_15min" value="15min"
                                               style="margin-left: 0px; margin-right: 5px; display: none;"
                                               onclick="showLianxuTime.changeTimeType()"/><span id="label_15min"
                                                                                                style="display: none; margin-right: 20px">15分钟</span>
                    <input name="timeType" type="radio" class="RadioStyle" id="_30min" value="30min"
                                               style="margin-left: 0px; margin-right: 5px; display: none;"
                                               onclick="showLianxuTime.changeTimeType()"/><span id="label_30min"
                                                                                                style="display: none; margin-right: 20px">30分钟</span>                                                                            

                    <input name="timeType" type="radio" class="RadioStyle" id="hour" value="hour"
                           style="margin-left: 0px; margin-right: 5px; display: none;"
                           onclick="showLianxuTime.changeTimeType()"/><span id="label_hour"
                                                                            style="display: none; margin-right: 20px">小时</span>

                    <input name="timeType" type="radio" class="RadioStyle" id="day" value="day"
                           style="margin-left: 0px;margin-right: 5px; display: none;"
                           onclick="showLianxuTime.changeTimeType()" checked="checked"/><span id="label_day"
                                                                                              style="display: none;margin-right: 20px">日</span>

                    <input name="timeType" type="radio" class="RadioStyle" id="week" value="week"
                           style="margin-left: 0px; margin-right: 5px; display: none;"
                           onclick="showLianxuTime.changeTimeType()"/><span id="label_week"
                                                                            style="display: none;margin-right: 20px">周</span>

                    <input name="timeType" type="radio" class="RadioStyle" id="month" value="month"
                           style="margin-left: 0px; margin-right: 5px; display: none;"
                           onclick="showLianxuTime.changeTimeType()"/><span id="label_month"
                                                                            style="margin-right: 20px; display: none;margin-right: 20px">月</span>
                </div>
                <div id="time"></div>

            </div>
            <!-- <iframe src="showLianxuTime.jsp" style="width: 100%; height: 100% ; border: 0px;" ></iframe> -->
        </div>
        <div id="lisanDiv" style="margin-top: 10px ; height: 340px; display: none;">
            <div style="border: 0px solid #e8e8e8 ; ">
                <div id="lisan_timetype" style="border: 1px solid #e8e8e8 ;margin-bottom: 10px;padding: 5px; ">
                    <input name="timeType2" type="radio" class="RadioStyle" id="Qmin" value="min"
                           style="margin-left: 0px; margin-right: 5px; display: none;"
                           onclick="showLisanTime.changeTimeType()"/><span id="label_Qmin"
                                                                           style="display: none; margin-right: 20px">5分钟</span>
                    <input name="timeType2" type="radio" class="RadioStyle" id="Q15min" value="15min"
                                               style="margin-left: 0px; margin-right: 5px; display: none;"
                                               onclick="showLisanTime.changeTimeType()"/><span id="label_Q15min"
                                                                                               style="display: none; margin-right: 20px">15分钟</span>
                    <input name="timeType2" type="radio" class="RadioStyle" id="Q30min" value="30min"
                                               style="margin-left: 0px; margin-right: 5px; display: none;"
                                               onclick="showLisanTime.changeTimeType()"/><span id="label_Q30min"
                                                                                               style="display: none; margin-right: 20px">30分钟</span>

                    <input name="timeType2" type="radio" class="RadioStyle" id="Qhour" value="hour"
                           style="margin-left: 0px; margin-right: 5px; display: none;"
                           onclick="showLisanTime.changeTimeType()"/><span id="label_Qhour"
                                                                           style="display: none; margin-right: 20px">小时</span>

                    <input name="timeType2" type="radio" class="RadioStyle" id="Qday" value="day"
                           style="margin-left: 0px;margin-right: 5px; display: none;"
                           onclick="showLisanTime.changeTimeType()" checked="checked"/><span id="label_Qday"
                                                                                             style="display: none;margin-right: 20px">日</span>

                    <input name="timeType2" type="radio" class="RadioStyle" id="Qweek" value="week"
                           style="margin-left: 0px; margin-right: 5px; display: none;"
                           onclick="showLisanTime.changeTimeType()"/><span id="label_Qweek"
                                                                           style="display: none;margin-right: 20px">周</span>

                    <input name="timeType2" type="radio" class="RadioStyle" id="Qmonth" value="month"
                           style="margin-left: 0px; margin-right: 5px; display: none;"
                           onclick="showLisanTime.changeTimeType()"/><span id="label_Qmonth"
                                                                           style="margin-right: 20px; display: none;margin-right: 20px">月</span>
                </div>

                <!--年模块-->
                <div style="padding-top: 10px;height: 290px">
                    <div style="float: left; width: 90px;height: 275px; border: 1px solid #99bbe8;margin-right: 5px">
                        <ul id="yearUl">

                        </ul>
                    </div>
                    <!--月模块-->
                    <div id="monthDiv"
                         style="float: left; width: 90px; height: 275px; border: 1px solid #99bbe8;margin-right: 5px">
                        <ul id="monthUl">
                            <li><input type="checkbox" name="month" values="00" value="01"/>1月</li>
                            <li><input type="checkbox" name="month" values="01" value="02"/>2月</li>
                            <li><input type="checkbox" name="month" values="02" value="03"/>3月</li>
                            <li><input type="checkbox" name="month" values="03" value="04"/>4月</li>
                            <li><input type="checkbox" name="month" values="04" value="05"/>5月</li>
                            <li><input type="checkbox" name="month" values="05" value="06"/>6月</li>
                            <li><input type="checkbox" name="month" values="06" value="07"/>7月</li>
                            <li><input type="checkbox" name="month" values="07" value="08"/>8月</li>
                            <li><input type="checkbox" name="month" values="08" value="09"/>9月</li>
                            <li><input type="checkbox" name="month" values="09" value="10"/>10月</li>
                            <li><input type="checkbox" name="month" values="10" value="11"/>11月</li>
                            <li><input type="checkbox" name="month" values="11" value="12"/>12月</li>
                        </ul>
                    </div>
                    <!--日模块-->
                    <div id="dayDiv"
                         style="float: left; width: 110px; height: 275px;border: 1px solid #99bbe8;margin-right: 5px">
                        <div style="height: 25px ;"><input type="checkbox" id="dayAll"
                                                           onchange="showLisanTime.dayAll()"/>全选
                        </div>
                        <div style="height: 248px;overflow:auto; margin-left: 15px">
                            <ul id="dayUl">
                                <li><input type="checkbox" name="day" value="01"/>1日</li>
                                <li><input type="checkbox" name="day" value="02"/>2日</li>
                                <li><input type="checkbox" name="day" value="03"/>3日</li>
                                <li><input type="checkbox" name="day" value="04"/>4日</li>
                                <li><input type="checkbox" name="day" value="05"/>5日</li>
                                <li><input type="checkbox" name="day" value="06"/>6日</li>
                                <li><input type="checkbox" name="day" value="07"/>7日</li>
                                <li><input type="checkbox" name="day" value="08"/>8日</li>
                                <li><input type="checkbox" name="day" value="09"/>9日</li>
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
                    <div id="hourDiv"
                         style="float: left; width: 110px; height: 275px;border: 1px solid #99bbe8;margin-right: 5px;display: none">
                        <div style="height: 25px ;"><input type="checkbox" id="hourAll"
                                                           onchange="showLisanTime.hourAll()"/>全选
                        </div>
                        <div style="height: 248px;overflow:auto; margin-left: 15px">
                            <ul id="hourUl">
                                <li><input type="checkbox" name="hour" value="00"/>0时</li>
                                <li><input type="checkbox" name="hour" value="01"/>1时</li>
                                <li><input type="checkbox" name="hour" value="02"/>2时</li>
                                <li><input type="checkbox" name="hour" value="03"/>3时</li>
                                <li><input type="checkbox" name="hour" value="04"/>4时</li>
                                <li><input type="checkbox" name="hour" value="05"/>5时</li>
                                <li><input type="checkbox" name="hour" value="06"/>6时</li>
                                <li><input type="checkbox" name="hour" value="07"/>7时</li>
                                <li><input type="checkbox" name="hour" value="08"/>8时</li>
                                <li><input type="checkbox" name="hour" value="09"/>9时</li>
                                <li><input type="checkbox" name="hour" value="10"/>10时</li>
                                <li><input type="checkbox" name="hour" value="11"/>11时</li>
                                <li><input type="checkbox" name="hour" value="12"/>12时</li>
                                <li><input type="checkbox" name="hour" value="13"/>13时</li>
                                <li><input type="checkbox" name="hour" value="14"/>14时</li>
                                <li><input type="checkbox" name="hour" value="15"/>15时</li>
                                <li><input type="checkbox" name="hour" value="16"/>16时</li>
                                <li><input type="checkbox" name="hour" value="17"/>17时</li>
                                <li><input type="checkbox" name="hour" value="18"/>18时</li>
                                <li><input type="checkbox" name="hour" value="19"/>19时</li>
                                <li><input type="checkbox" name="hour" value="20"/>20时</li>
                                <li><input type="checkbox" name="hour" value="21"/>21时</li>
                                <li><input type="checkbox" name="hour" value="22"/>22时</li>
                                <li><input type="checkbox" name="hour" value="23"/>23时</li>

                            </ul>
                        </div>
                    </div>
                    <!--分钟模块-->
                    <div id="minDiv"
                         style="float: left; width: 110px; height: 275px;border: 1px solid #99bbe8;margin-right: 5px">
                        <div style="height: 25px ;"><input type="checkbox" id="minAll"
                                                           onchange="showLisanTime.minAll()"/>全选
                        </div>
                        <div style="height: 248px;overflow:auto; margin-left: 15px">
                            <ul id="minUl">
                                <li><input type="checkbox" name="min" value="00"/>00分</li>
                                <!-- <li><input type="checkbox" name="min" value="01" />01分</li>
                                <li><input type="checkbox" name="min" value="02" />02分</li>
                                <li><input type="checkbox" name="min" value="03" />03分</li>
                                <li><input type="checkbox" name="min" value="04" />04分</li> -->
                                <li><input type="checkbox" name="min" value="05"/>05分</li>
                                <!-- <li><input type="checkbox" name="min" value="06" />06分</li>
                                <li><input type="checkbox" name="min" value="07" />07分</li>
                                <li><input type="checkbox" name="min" value="08" />08分</li>
                                <li><input type="checkbox" name="min" value="09" />09分</li> -->
                                <li><input type="checkbox" name="min" value="10"/>10分</li>
                                <!-- <li><input type="checkbox" name="min" value="11" />11分</li>
                                <li><input type="checkbox" name="min" value="12" />12分</li>
                                <li><input type="checkbox" name="min" value="13" />13分</li>
                                <li><input type="checkbox" name="min" value="14" />14分</li> -->
                                <li><input type="checkbox" name="min" value="15"/>15分</li>
                                <!-- <li><input type="checkbox" name="min" value="16" />16分</li>
                                <li><input type="checkbox" name="min" value="17" />17分</li>
                                <li><input type="checkbox" name="min" value="18" />18分</li>
                                <li><input type="checkbox" name="min" value="19" />19分</li> -->
                                <li><input type="checkbox" name="min" value="20"/>20分</li>
                                <!-- <li><input type="checkbox" name="min" value="21" />21分</li>
                                <li><input type="checkbox" name="min" value="22" />22分</li>
                                <li><input type="checkbox" name="min" value="23" />23分</li>
                                <li><input type="checkbox" name="min" value="24" />24分</li> -->
                                <li><input type="checkbox" name="min" value="25"/>25分</li>
                                <!-- <li><input type="checkbox" name="min" value="26" />26分</li>
                                <li><input type="checkbox" name="min" value="27" />27分</li>
                                <li><input type="checkbox" name="min" value="28" />28分</li>
                                <li><input type="checkbox" name="min" value="29" />29分</li> -->
                                <li><input type="checkbox" name="min" value="30"/>30分</li>
                                <!-- <li><input type="checkbox" name="min" value="31" />31分</li>
                                <li><input type="checkbox" name="min" value="32" />32分</li>
                                <li><input type="checkbox" name="min" value="33" />33分</li>
                                <li><input type="checkbox" name="min" value="34" />34分</li> -->
                                <li><input type="checkbox" name="min" value="35"/>35分</li>
                                <!-- <li><input type="checkbox" name="min" value="36" />36分</li>
                                <li><input type="checkbox" name="min" value="37" />37分</li>
                                <li><input type="checkbox" name="min" value="38" />38分</li>
                                <li><input type="checkbox" name="min" value="39" />39分</li> -->
                                <li><input type="checkbox" name="min" value="40"/>40分</li>
                                <!-- <li><input type="checkbox" name="min" value="41" />41分</li>
                                <li><input type="checkbox" name="min" value="42" />42分</li>
                                <li><input type="checkbox" name="min" value="43" />43分</li>
                                <li><input type="checkbox" name="min" value="44" />44分</li> -->
                                <li><input type="checkbox" name="min" value="45"/>45分</li>
                                <!-- <li><input type="checkbox" name="min" value="46" />46分</li>
                                <li><input type="checkbox" name="min" value="47" />47分</li>
                                <li><input type="checkbox" name="min" value="48" />48分</li>
                                <li><input type="checkbox" name="min" value="49" />49分</li> -->
                                <li><input type="checkbox" name="min" value="50"/>50分</li>
                                <!-- <li><input type="checkbox" name="min" value="51" />51分</li>
                                <li><input type="checkbox" name="min" value="52" />52分</li>
                                <li><input type="checkbox" name="min" value="53" />53分</li>
                                <li><input type="checkbox" name="min" value="54" />54分</li> -->
                                <li><input type="checkbox" name="min" value="55"/>55分</li>
                                <!-- <li><input type="checkbox" name="min" value="56" />56分</li>
                                <li><input type="checkbox" name="min" value="57" />57分</li>
                                <li><input type="checkbox" name="min" value="58" />58分</li>
                                <li><input type="checkbox" name="min" value="59" />59分</li> -->
                            </ul>
                        </div>
                    </div>
                    <!--15分钟模块-->
                    <div id="_15minDiv" class="line7890" style="float: left; width: 110px; height: 275px;border: 1px solid #99bbe8;margin-right: 5px">
                         <div style="height: 25px ;"><input type="checkbox" id="_15minAll" onchange="showLisanTime._15minAll()" />全选</div>
                         <div style="height: 248px;overflow:auto; margin-left: 15px">
                             <ul id="_15minUl">
                                 <li><input type="checkbox" name="15min" value="00" />00分</li>
                                 
                                 <li><input type="checkbox" name="15min" value="15" />15分</li>
                                 
                                 <li><input type="checkbox" name="15min" value="30" />30分</li>
                                 
                                 <li><input type="checkbox" name="15min" value="45" />45分</li>
                                 
                             </ul>                 
                             </div>
                    </div>
                    <!--30分钟模块-->
                    <div id="_30minDiv" class="line7890" style="float: left; width: 110px; height: 275px;border: 1px solid #99bbe8;margin-right: 5px">
                         <div style="height: 25px ;"><input type="checkbox" id="_30minAll" onchange="showLisanTime._30minAll()" />全选</div>
                         <div style="height: 248px;overflow:auto; margin-left: 15px">
                             <ul id="_30minUl">
                                 <li><input type="checkbox" name="30min" value="00" />00分</li>
                                 <li><input type="checkbox" name="30min" value="30" />30分</li>
                             </ul>                 
                             </div>
                    </div>
                    <!--周模块-->
                    <div id="weekDiv"
                         style="display: none; float: left; width: 150px; height: 275px; border: 1px solid #99bbe8;margin-right: 5px;overflow:auto">
                        <ul id="weekUl">

                        </ul>
                    </div>
                    <!--按钮模块-->
                    <div style="float: left; width: 80px; height: 275px;border: 0px solid #99bbe8;margin-right: 5px;padding-top: 70px;">
                        <center>
                            <button class="btn btn-success btn-sm" href="#" onclick="showLisanTime.addTime()">增加
                            </button>
                            <br/><br/>
                            <button class="btn btn-success btn-sm" href="#" onclick="showLisanTime.deleTime()">删除
                            </button>
                            <br/><br/>
                            <button class="btn btn-success btn-sm" href="#" onclick="showLisanTime.deleAllTime()">全删
                            </button>
                        </center>
                    </div>
                    <!--结果模块-->
                    <div style="float: left; min-width: 200px; height: 275px;border: 1px solid #99bbe8;margin-right: 5px;overflow:hidden;">
                    	<div id="workday_area" style="width:250px;display:none;border-bottom: 1px solid #e8e8e8;">
                   			<input id="workday_radio_all" type="radio" name="workday_radio" 
                   				checked="checked" onclick="showLisanTime.changeWorkday('all');"/>
                   			<label for="workday_radio_all" style="font-weight: normal;">全部</label>
                   			<input id="workday_radio_work" type="radio" name="workday_radio" 
                   				style="margin-left:5px;"  onclick="showLisanTime.changeWorkday('work');" />
                   			<label for="workday_radio_work" style="font-weight: normal;">工作日</label>
                   			<input id="workday_radio_rest" type="radio" name="workday_radio"
                   				style="margin-left:5px;"  onclick="showLisanTime.changeWorkday('rest');" />
                   			<label for="workday_radio_rest" style="font-weight: normal;">非工作日</label>
                   		</div>
                        <ul id="resUl" style="height:273px;overflow-y:auto;">

                        </ul>
                    </div>
                    <!-- 
               			加了个备份的, 选工作日时候用, 
               			在showLisanTime.addTime()、deleTime()、deleAllTime() 末尾有应用
               		 -->
                   <ul id="resUl_hide" style="height:275px;display:none;overflow:auto;"></ul>

                </div>

            </div>

            <!-- <iframe src="showLisanTime.jsp" style="width: 100%; height: 100% ; border: 0px" ></iframe> -->
        </div>


    </div>
    <div id="otherConWai"
         style="border: 1px solid #e8e8e8 ; margin-top: 20px;padding: 20px 20px; position: relative; display: none">
        <!-- <div style="position: absolute;top: -10px;left: 15px;padding-right: 10px;padding-left: 10px;;background: #fff">其他条件</div> -->
        <div id="otherCondition" style="border: 0px solid pink ; ">

        </div>
    </div>


    <div id="baocunDiv"
         style="border: 0px solid #e8e8e8 ; margin-top: 20px;padding: 20px 20px; position: relative; height: 100px ">
                 <span id="showRadiodemoselectNew" style="display:none;">
                     <input type="radio" name="_seekQueryType" value="shebei" style="margin-left:0" checked /><span>根据设备查询</span>
                     <input type="radio" name="_seekQueryType" value="duankou" style="margin-left:10px" /><span>根据端口查询</span>
                 </span>
        <input type="button" class="btn btn-primary" onclick="publicReport.query()" value="查   询"
               style="margin-right: 20px;padding:3px 14px;height:34px; color:#fff ;float:right; "/>
        <input type="button" class="btn btn-primary" onclick="publicReport.sqlModal.show();" value="查看sql"
               style="margin-right: 20px;padding:3px 14px;height:34px; color:#fff ;float:right; "/>

    </div>


</div>

<%--展示sql的modal框--%>
<div class="modal fade" id="sqlModal" tabindex="-1" role="dialog" aria-labelledby="sqlModalLabel" aria-hidden="true">
    <div class="modal-dialog" style="width: 700px;">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close"
                        data-dismiss="modal" aria-hidden="true">
                    &times;
                </button>
                <h4 class="modal-title" id="sqlModalLabel">报表sql展示</h4>
            </div>
            <div class="modal-body">
                <textarea style="width: 670px;height: 370px;" id="sqlArea"></textarea>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal -->
</div>

 <div id="mmDemoRightDiv_sys" class="easyui-menu" style="width:150px;">
    <div onclick="demoselectNew.seekDemoInfoR('sys')" data-options="iconCls:'icon-xinjianbaobiao'">查看模板信息</div>
    <div onclick="demoselectNew.alterDemo('sys')" data-options="iconCls:'icon-xiugaimulu'">修改模板信息</div>
    <div id="mmDemoRightDivTtr_sys" style="display:none;"></div>
    <div id="mmmmDemoRightDiv_sys_text" style="display:none;"></div>
</div>
<div id="mmDemoRightDiv_user" class="easyui-menu" style="width:150px;">
    <div onclick="demoselectNew.seekDemoInfoR('user')" data-options="iconCls:'icon-xinjianbaobiao'">查看模板信息</div>
    <div onclick="demoselectNew.alterDemo('user')" data-options="iconCls:'icon-xiugaimulu'">修改模板信息</div>
    <div onclick="demoselectNew.delDemo()" data-options="iconCls:'icon-shanchumulu'">删除此模板</div>
    <div id="mmDemoRightDivTtr_user" style="display:none;"></div>
    <div id="mmmmDemoRightDiv_user_text" style="display:none;"></div>
</div>
<!---------------------------------------------------------------------------->
   <div  class="modal" id="addAndAlterDemo">
     <div class="modal-dialog" style="margin-top: 5px;width: 800px;">   <!-- style="width: 900px;left: -50px" -->
         <div class="modal-content modalContent" >
               <div id="addAlterDemo_header" class="modal-header modalTOP">
                   <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true"><img src="../../static/reportManageSys/images/close.png"></span><span class="sr-only"></span></button>
                   <h4 id="addAlterDemo_title" class="modal-title">详细信息</h4>
               </div>
               <div class="modal-body" id="modal-body" >

                         <div style="border: 1px solid #e8e8e8">
                             <!--  <h5>查询条件</h5> -->
                              <table style="margin: 10px">
                                  <tr style="height: 40px">
                                      <td width="120px">设备名称或别名:</td>
                                      <td style="padding-right: 20px"><input id="device_name" type="text"  /></td>
                                      <!-- <td width="80px">设备机房:</td>
                                      <td style="padding-right: 20px"><input id="device_room" type="text"  /></td> -->
                                      <td width="80px">设备IP地址:</td>
                                      <td style="padding-right: 20px"><input id="device_ipAdress" type="text"  /></td>
                                      <td width="110px">业务系统:</td>
                                      <td><input id="business_system" type="text"  /></td>
                                      <td></td>
                                  </tr>
                                  <tr style="height: 40px">
                                      <td width="160px">端口名称或别名或描述:</td>
                                      <td style="padding-right: 20px"><input id="port_cname" type="text"  /></td>
                                      <td>端口IP地址:</td>
                                      <td style="padding-right: 20px"><input id="port_ipAdress" type="text"  /></td>
                                      <td>类型<span style="color: red">*</span>:</td>
                                      <td >
                                           <select id="port_type" style="width: 100%" onchange = "demoselectNew.alterTitle()">
                                                <!-- <option value="">---请选择---</option> -->
                                                <option value="duankou">端口</option>
                                                <option value="shebei">设备</option>
                                           </select>
                                      </td>
                                      <td colspan="2" style="padding-left: 20px">
                                           <button id="domoQueryConfig" type="button" class="btn btn-primary" onclick="demoselectNew.doQuery()">查询</button>
                                           <!-- <button type="button" class="btn btn-primary" onclick="demoselectNew.doClear()" style="margin-left: 20px">重置</button> -->
                                      </td>
                                  </tr>
                              </table>
                         </div>
              </div>                
               


               
                           <div style="padding-left: 10px;" >
                                     <div style="width: 200px;margin-bottom: 6px;">
                                       <h5 id ="left_title">&nbsp;待选择端口列表</h5>
                                     </div>
                                     <div style="float: left; border :1px solid #e8e8e8 ;height: 220px;width: 42%;">
                                          <!-- <h5>&nbsp;待选择设备端口</h5> -->
                                          <div id="tree_left_new_div" style="position: relative;overflow: auto;height: 218px">
                                              <ul id="tree_left_new"></ul>
                                          </div>
                                     </div>
                                     <div style="float: left; border :0px solid #e8e8e8 ;height: 220px;width: 100px;padding: 65px 0 0 2.5%;">
                                           <button type="button" class="btn btn-success" onclick="demoselectNew.addRightMove()">右移</button><br/><br/>
                                           <button type="button" class="btn btn-success" onclick="demoselectNew.delRightMove()">删除</button>
                                     </div>
                                     
                                     <div style="float: left;width: 42%;">
                                         <h5 id ="right_title" style="margin-top:-21px;">&nbsp;已选择端口列表</h5>
                                         <span style="float: right;margin-top: -20px;">
                                             <a href="javascript:demoselectNew.clearRightTree_larji()"><i class="fa fa-trash-o ecom_icons ecom_icons2" onclick="" title="清空"></i></a>
                                         </span>
                                     </div>
                                     <div style="float: left; border :1px solid #e8e8e8 ;height: 220px;width: 42%;">
                                          <div id="tree_right_new_div" style="position: relative;overflow: auto;height: 218px">
                                              <ul id="tree_right_new"></ul>
                                          </div>
                                     </div>
                               <div style="clear: both"></div>  
                           </div>


                           <div style="padding: 10px;">
                                <table style="margin-left: 10px">
                                    <tr style="height: 40px">
                                        <td width="70px">模板名称<span style="color: red">*</span>:</td>
                                        <td style="padding-right: 10px"><input id="tpl_name" type="text"  /></td>
                                        <td width="37px">备注:</td>
                                        <td style="padding-right: 10px"><input id="descr" type="text" /></td>
                                        <td width="60px">带宽(M):</td>
                                        <td style="padding-right: 10px"><input id="bandwidth" type="text"  /></td>
                                        <td>
                                            <button type="button" class="btn btn-primary" onclick="demoselectNew.addDemoSave()">保存</button>
                                            <button type="button" class="btn btn-default" data-dismiss="modal" >取消</button>
                                        </td>
                                    </tr>
                                </table>
                           </div>
         </div>
    </div>
    <span id="sys_user" style="display: none;"></span>
    <span id="currDemoId" style="display: none;"></span>
    <span style="display: none;"></span>
 </div> 
 <!---------------------------------------------------------------------------->
    <div  class="modal" id="seekDemoInfo">
      <div class="modal-dialog" style="width:700px;margin-top: 5px;">   <!-- style="width: 900px;left: -50px" -->
          <div class="modal-content modalContent" >
                <div class="modal-header modalTOP">
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true"><img src="../../static/reportManageSys/images/close.png"></span><span class="sr-only"></span></button>
                    <h4 id="addAlterDemo_title" class="modal-title">模板信息查看</h4>
                </div>
                <div class="modal-body" id="modal-body" >
                          <div style="padding: 0 0 9px 0;">
                               <table style="margin-left: 10px">
                                   <tr style="height: 40px">
                                       <td width="70px">模板名称<span style="color: red">*</span>:</td>
                                       <td style="padding-right: 10px"><input id="tpl_name_seek" type="text" disabled="disabled" /></td>
                                       <td width="37px">备注:</td>
                                       <td style="padding-right: 10px"><input id="descr_seek" type="text" disabled="disabled" /></td>
                                       <td width="60px">带宽(M):</td>
                                       <td style="padding-right: 10px"><input id="bandwidth_seek" type="text" disabled="disabled" /></td>
                                   </tr>
                               </table>
                          </div>
                          <div style="border :1px solid #e8e8e8 ;height: 220px;width:100%;">
                               <div id="tree_seekDemo_div" style="position: relative;overflow: auto;height: 218px">
                                   <ul id="tree_seekDemo"></ul>
                               </div>
                          </div>
                         
               </div>                
          </div>
     </div>
     <span id="sys_user" style="display: none;"></span>
     <span id="currDemoId" style="display: none;"></span>
     <span style="display: none;"></span>
  </div> 
</body>
</html>