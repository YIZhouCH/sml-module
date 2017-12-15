<%@ page contentType="text/html;charset=utf-8" %>
<%@ page language="java" import="java.util.*" pageEncoding="utf-8" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>报表订阅</title>
    <%@ include file="/commonSelfReport/jq183.jsp" %>
    <%@ include file="/pages/commonSelfReport/inas-loadmask.jsp" %>
    <%@ include file="/pages/commonSelfReport/inas-my97.jsp" %>
    <%@ include file="/commonSelfReport/bootstrap.jsp" %>
    <%@ include file="/pages/commonSelfReport/jquery-ui-bootstrap.jsp" %>
    <%@ include file="/commonSelfReport/fontawesome/fontawesome4.3.0.jsp" %>
    <%@ include file="/pages/commonSelfReport/inas-common.jsp" %>
    <%@ include file="/pages/commonSelfReport/inas-export.jsp" %>
    <!-- 引入echarts -->
    <%@ include file="/commonSelfReport/echarts.jsp" %>
    <%@ include file="/pages/commonSelfReport/inas-echarts.jsp" %>
    <%@ include file="/pages/commonSelfReport/inas-product-style.jsp" %>
    <%@ include file="/pages/commonSelfReport/inas-eoms.jsp" %>
    <%@ include file="/pages/commonSelfReport/inas-loadmask.jsp" %>
    <%@ include file="/pages/commonSelfReport/inas-my97.jsp" %>


    <meta http-equiv="pragma" content="no-cache"/>
    <meta http-equiv="cache-control" content="no-cache"/>
    <meta http-equiv="expires" content="0"/>

    <%--引用zTree插件--%>
    <link rel="stylesheet" type="text/css" href="${ctx}/static/sendEmail/zTreeStyle.css"/>
    <script src="${ctx}/scripts/sendEmail/jquery.ztree.all.js" type="text/javascript"></script>

    <!--引用easyui框架-->
    <script src="${ctx}/pages/reportManageSys/easyui/jquery.easyui.min.js" type="text/javascript"></script>
    <script src="${ctx}/pages/reportManageSys/easyui/locale/easyui-lang-zh_CN.js" type="text/javascript"></script>
    <link rel="stylesheet" type="text/css" href="${ctx}/pages/reportManageSys/themes/bootstrap/easyui.css"/>
    <link rel="stylesheet" type="text/css" href="${ctx}/pages/reportManageSys/themes/icon.css"/>
    <link href="${ctx}/pages/reportManageSys/easyui/style/css/statisticalforms.css" rel="stylesheet" type="text/css"/>

    <!--自己的js,css-->
    <link rel="stylesheet" type="text/css" href="${ctx}/static/sendEmail/emailList.css"/>
    <link rel="stylesheet" type="text/css" href="${ctx}/static/sendEmail/newCreateEmail.css"/>
    <!--添加loading-->
    <script type="text/javascript">

    </script>
    <style>
        body {
            background: white;
        }

        body, div {
            padding: 0;
            margin: 0;
        }

        .content {
            padding: 20px 35px;
        }

    </style>
</head>
<body style="height:700px">
<div class="content" id="main" style="display: block">
    <div class="con_itembox" id="con_itembox_query">
        <div class="con_homebox_title">
            <h5>
                <i class="fa fa-rss ecom_icons" aria-hidden="true"></i>
                报表订阅任务配置
            </h5>
        </div>
        <div class="con_item_list">
            <input id="myModalLabel" style="display: none"/>
            <%--<input id="emailId" style="display: none"/>--%>
            <table width="" border="0" cellspacing="0" cellpadding="0" style="margin-top: 10px;"
                   class="search">
                <tbody>
                <tr>
                    <td style="width:70px;">时间范围：</td>
                    <td style="width:150px;">
                        <input id="startSearchTime" style="margin-top:0;height:18px;width:90%;"
                               class="Wdate TimeFiled FL"
                               onclick="WdatePicker({dateFmt : 'yyyy-MM-dd',maxDate:'%y-%M-{%d+1}'})">
                    </td>
                    <td style="width:30px;">~</td>
                    <td style="width:150px;">
                        <input id="endSearchTime" style="margin-top:0;height:18px;width:90%;"
                               class="Wdate TimeFiled FL"
                               onclick="WdatePicker({dateFmt : 'yyyy-MM-dd',maxDate:'%y-%M-{%d+1}'})">
                    </td>
                    <td style="width:70px;">报表名称：</td>
                    <td style="width: 130px;">
                        <input type="text" class="inputText" id="taskName"
                               style="margin-top: 0; height: 34px; width: 90%;">
                    </td>
                    <td style="width:70px;">收件人：</td>
                    <td style="width: 130px;">
                        <input type="text" class="inputText" id="receptUser"
                               style="margin-top: 0; height: 34px; width: 90%;">
                    </td>
                    <td style="width: auto;">
                        <button type="button" class="btn btn-primary" onclick="taskTable.build()">查询</button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div>
        <div style="margin-top: 20px;margin-bottom: 10px;">
            <button type="button" class="btn btn-primary" id="add" onclick="index.showModal('add')"
                    style="float: right;">新增
            </button>
            <div style="clear:both;"></div>
        </div>
        <div id="task_div" style="border: 1px solid #e8e8e8; padding:10px;">
            <table id="task_table"></table>
            <div id="task_pager"></div>
        </div>
    </div>
</div>


<%--新增或编辑弹出框--%>
<div class="modal fade" id="editModal" tabindex="-1" role="dialog" aria-labelledby="editModalLabel" aria-hidden="true">
    <div class="modal-dialog" style="width: 80%;">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h4 class="modal-title" id="editModalLabel">模态框（Modal）标题 </h4>
            </div>
            <div class="modal-body" style="height: 550px;">
                <input type="hidden" id="taskId"/>
                <div style="width:30%;height: 90%;overflow:auto;float: left;border:1px solid #e8e8e8; padding:10px;padding-right: 0">
                    <ul id="tree" class="ztree"></ul>
                </div>
                <div style="width:68%;height:90%;overflow:auto;float: left;border:1px solid #e8e8e8; padding:10px;margin-left: 1px;">
                    <table width="" border="0" cellspacing="10" cellpadding="0"
                           style="margin-top: 10px;margin-bottom: 10px;">
                        <tr>
                            <td style="width: 80px;">任务名称：<span style="color:red ;">*</span></td>
                            <td><input type="text" name="subjectName" id="subjectName" style="width:340px"/>
                            </td>
                        </tr>
                        <tr style="height: 30px;">
                            <td style="width:70px;">时间粒度：</td>
                            <td>
                                <span id="timeType_min">
                                    <input name="timeType" type="radio" class="RadioStyle" id="timeType5" value="min1"
                                           onclick="index.time.changeTimeType('min')"/>分
                                </span>
                                <span id="timeType_hour">
                                    <input name="timeType" type="radio" class="RadioStyle" id="timeType1" value="hour"
                                           onclick="index.time.changeTimeType('hour')"
                                           checked="checked"/>小时
                                </span>
                                <span id="timeType_day">
                                    <input name="timeType" type="radio" class="RadioStyle" id="timeType2" value="day"
                                           onclick="index.time.changeTimeType('day')"/>日
                                </span>
                                <span id="timeType_week">
                                    <input name="timeType" type="radio" class="RadioStyle" id="timeType3" value="week"
                                           onclick="index.time.changeTimeType('week')"/>周
                                </span>
                                <sapn id="timeType_month">
                                    <input name="timeType" type="radio" class="RadioStyle" id="timeType4"
                                           value="month"
                                           onclick="index.time.changeTimeType('month')">月
                                </sapn>
                                <span style="padding-left: 46px;">是否启用：</span>
                                <input name="useType" type="checkbox" class="RadioStyle" id="useable"
                                       checked="checked" style="margin-left: 10px;" value="1"/>
                            </td>
                        </tr>
                    </table>
                    <span style="margin-right: 10px;">发送时间：</span>
                    <div style="height: 205px;margin-top: 10px;">
                        <div id="weekDiv"
                             style="display: none; float: left; width: 108px; height: 200px;border: 1px solid #e8e8e8; overflow: auto;margin-right: 5px;">
                            <div style="height: 25px ;">
                                <input type="checkbox" id="weekAll" onchange="">全选
                            </div>
                            <div style="height: 172px;overflow:auto; margin-left: 15px">
                                <ul id="weekUl">
                                    <li><input type="checkbox" name="week" value="01">周一</li>
                                    <li><input type="checkbox" name="week" value="02">周二</li>
                                    <li><input type="checkbox" name="week" value="03">周三</li>
                                    <li><input type="checkbox" name="week" value="04">周四</li>
                                    <li><input type="checkbox" name="week" value="05">周五</li>
                                    <li><input type="checkbox" name="week" value="06">周六</li>
                                    <li><input type="checkbox" name="week" value="07">周日</li>
                                </ul>
                            </div>
                        </div>
                        <div id="dayDiv"
                             style="float: left; width: 110px; height: 200px; border: 1px solid #e8e8e8; display: none;margin-right: 5px;">
                            <div style="height: 25px ;">
                                <input type="checkbox" id="dayAll" onchange="">全选
                            </div>
                            <div style="height: 172px;overflow:auto; margin-left: 15px">
                                <ul id="dayUl">
                                    <li><input type="checkbox" name="day" value="01">1日</li>
                                    <li><input type="checkbox" name="day" value="02">2日</li>
                                    <li><input type="checkbox" name="day" value="03">3日</li>
                                    <li><input type="checkbox" name="day" value="04">4日</li>
                                    <li><input type="checkbox" name="day" value="05">5日</li>
                                    <li><input type="checkbox" name="day" value="06">6日</li>
                                    <li><input type="checkbox" name="day" value="07">7日</li>
                                    <li><input type="checkbox" name="day" value="08">8日</li>
                                    <li><input type="checkbox" name="day" value="09">9日</li>
                                    <li><input type="checkbox" name="day" value="10">10日</li>
                                    <li><input type="checkbox" name="day" value="11">11日</li>
                                    <li><input type="checkbox" name="day" value="12">12日</li>
                                    <li><input type="checkbox" name="day" value="13">13日</li>
                                    <li><input type="checkbox" name="day" value="14">14日</li>
                                    <li><input type="checkbox" name="day" value="15">15日</li>
                                    <li><input type="checkbox" name="day" value="16">16日</li>
                                    <li><input type="checkbox" name="day" value="17">17日</li>
                                    <li><input type="checkbox" name="day" value="18">18日</li>
                                    <li><input type="checkbox" name="day" value="19">19日</li>
                                    <li><input type="checkbox" name="day" value="20">20日</li>
                                    <li><input type="checkbox" name="day" value="21">21日</li>
                                    <li><input type="checkbox" name="day" value="22">22日</li>
                                    <li><input type="checkbox" name="day" value="23">23日</li>
                                    <li><input type="checkbox" name="day" value="24">24日</li>
                                    <li><input type="checkbox" name="day" value="25">25日</li>
                                    <li><input type="checkbox" name="day" value="26">26日</li>
                                    <li><input type="checkbox" name="day" value="27">27日</li>
                                    <li><input type="checkbox" name="day" value="28">28日</li>
                                    <li><input type="checkbox" name="day" value="29">29日</li>
                                    <li><input type="checkbox" name="day" value="30">30日</li>
                                    <li><input type="checkbox" name="day" value="31">31日</li>
                                </ul>
                            </div>
                        </div>
                        <div id="hourDiv"
                             style="float: left; width: 110px; height: 200px; border: 1px solid #e8e8e8; display: none;margin-right: 5px;">
                            <div style="height: 25px ;">
                                <input type="checkbox" id="hourAll" onchange="">全选
                            </div>
                            <div style="height: 172px;overflow:auto; margin-left: 15px">
                                <ul id="hourUl">
                                    <li><input type="checkbox" name="hour" value="00">0时</li>
                                    <li><input type="checkbox" name="hour" value="01">1时</li>
                                    <li><input type="checkbox" name="hour" value="02">2时</li>
                                    <li><input type="checkbox" name="hour" value="03">3时</li>
                                    <li><input type="checkbox" name="hour" value="04">4时</li>
                                    <li><input type="checkbox" name="hour" value="05">5时</li>
                                    <li><input type="checkbox" name="hour" value="06">6时</li>
                                    <li><input type="checkbox" name="hour" value="07">7时</li>
                                    <li><input type="checkbox" name="hour" value="08">8时</li>
                                    <li><input type="checkbox" name="hour" value="09">9时</li>
                                    <li><input type="checkbox" name="hour" value="10">10时</li>
                                    <li><input type="checkbox" name="hour" value="11">11时</li>
                                    <li><input type="checkbox" name="hour" value="12">12时</li>
                                    <li><input type="checkbox" name="hour" value="13">13时</li>
                                    <li><input type="checkbox" name="hour" value="14">14时</li>
                                    <li><input type="checkbox" name="hour" value="15">15时</li>
                                    <li><input type="checkbox" name="hour" value="16">16时</li>
                                    <li><input type="checkbox" name="hour" value="17">17时</li>
                                    <li><input type="checkbox" name="hour" value="18">18时</li>
                                    <li><input type="checkbox" name="hour" value="19">19时</li>
                                    <li><input type="checkbox" name="hour" value="20">20时</li>
                                    <li><input type="checkbox" name="hour" value="21">21时</li>
                                    <li><input type="checkbox" name="hour" value="22">22时</li>
                                    <li><input type="checkbox" name="hour" value="23">23时</li>
                                </ul>
                            </div>
                        </div>
                        <div id="minDiv"
                             style="float: left; width: 110px; height: 200px; border: 1px solid #e8e8e8; display: block;margin-right: 5px;">
                            <div style="height: 25px ;">
                                <input type="checkbox" id="minAll" onchange="">全选
                            </div>
                            <div style="height: 172px;overflow:auto; margin-left: 15px">
                                <ul id="minUl">
                                    <li><input type="checkbox" name="min" value="00"/>00分</li>
                                    <li><input type="checkbox" name="min" value="01"/>01分</li>
                                    <li><input type="checkbox" name="min" value="02"/>02分</li>
                                    <li><input type="checkbox" name="min" value="03"/>03分</li>
                                    <li><input type="checkbox" name="min" value="04"/>04分</li>
                                    <li><input type="checkbox" name="min" value="05"/>05分</li>
                                    <li><input type="checkbox" name="min" value="06"/>06分</li>
                                    <li><input type="checkbox" name="min" value="07"/>07分</li>
                                    <li><input type="checkbox" name="min" value="08"/>08分</li>
                                    <li><input type="checkbox" name="min" value="09"/>09分</li>
                                    <li><input type="checkbox" name="min" value="10"/>10分</li>
                                    <li><input type="checkbox" name="min" value="11"/>11分</li>
                                    <li><input type="checkbox" name="min" value="12"/>12分</li>
                                    <li><input type="checkbox" name="min" value="13"/>13分</li>
                                    <li><input type="checkbox" name="min" value="14"/>14分</li>
                                    <li><input type="checkbox" name="min" value="15"/>15分</li>
                                    <li><input type="checkbox" name="min" value="16"/>16分</li>
                                    <li><input type="checkbox" name="min" value="17"/>17分</li>
                                    <li><input type="checkbox" name="min" value="18"/>18分</li>
                                    <li><input type="checkbox" name="min" value="19"/>19分</li>
                                    <li><input type="checkbox" name="min" value="20"/>20分</li>
                                    <li><input type="checkbox" name="min" value="21"/>21分</li>
                                    <li><input type="checkbox" name="min" value="22"/>22分</li>
                                    <li><input type="checkbox" name="min" value="23"/>23分</li>
                                    <li><input type="checkbox" name="min" value="24"/>24分</li>
                                    <li><input type="checkbox" name="min" value="25"/>25分</li>
                                    <li><input type="checkbox" name="min" value="26"/>26分</li>
                                    <li><input type="checkbox" name="min" value="27"/>27分</li>
                                    <li><input type="checkbox" name="min" value="28"/>28分</li>
                                    <li><input type="checkbox" name="min" value="29"/>29分</li>
                                    <li><input type="checkbox" name="min" value="30"/>30分</li>
                                    <li><input type="checkbox" name="min" value="31"/>31分</li>
                                    <li><input type="checkbox" name="min" value="32"/>32分</li>
                                    <li><input type="checkbox" name="min" value="33"/>33分</li>
                                    <li><input type="checkbox" name="min" value="34"/>34分</li>
                                    <li><input type="checkbox" name="min" value="35"/>35分</li>
                                    <li><input type="checkbox" name="min" value="36"/>36分</li>
                                    <li><input type="checkbox" name="min" value="37"/>37分</li>
                                    <li><input type="checkbox" name="min" value="38"/>38分</li>
                                    <li><input type="checkbox" name="min" value="39"/>39分</li>
                                    <li><input type="checkbox" name="min" value="40"/>40分</li>
                                    <li><input type="checkbox" name="min" value="41"/>41分</li>
                                    <li><input type="checkbox" name="min" value="42"/>42分</li>
                                    <li><input type="checkbox" name="min" value="43"/>43分</li>
                                    <li><input type="checkbox" name="min" value="44"/>44分</li>
                                    <li><input type="checkbox" name="min" value="45"/>45分</li>
                                    <li><input type="checkbox" name="min" value="46"/>46分</li>
                                    <li><input type="checkbox" name="min" value="47"/>47分</li>
                                    <li><input type="checkbox" name="min" value="48"/>48分</li>
                                    <li><input type="checkbox" name="min" value="49"/>49分</li>
                                    <li><input type="checkbox" name="min" value="50"/>50分</li>
                                    <li><input type="checkbox" name="min" value="51"/>51分</li>
                                    <li><input type="checkbox" name="min" value="52"/>52分</li>
                                    <li><input type="checkbox" name="min" value="53"/>53分</li>
                                    <li><input type="checkbox" name="min" value="54"/>54分</li>
                                    <li><input type="checkbox" name="min" value="55"/>55分</li>
                                    <li><input type="checkbox" name="min" value="56"/>56分</li>
                                    <li><input type="checkbox" name="min" value="57"/>57分</li>
                                    <li><input type="checkbox" name="min" value="58"/>58分</li>
                                    <li><input type="checkbox" name="min" value="59"/>59分</li>
                                </ul>
                            </div>
                        </div>
                        <div id="btnDiv"
                             style="float: left; width: 80px; height: 200px;border: 0;padding-top: 40px;">
                            <center>
                                <button class="btn btn-success btn-sm" href="#" onclick="index.time.addTime()">增加
                                </button>
                                <br><br>
                                <button class="btn btn-success btn-sm" href="#" onclick="index.time.deleteTime()">
                                    删除
                                </button>
                                <br><br>
                                <button class="btn btn-success btn-sm" href="#" onclick="index.time.deleteTimeAll()"
                                        style=" margin-right: 4px;">全删
                                </button>
                            </center>
                        </div>
                        <div id="resDiv"
                             style="float: left; width: 175px; height: 200px;border: 1px solid #e8e8e8;overflow:auto;">
                            <ul id="resUl"></ul>
                        </div>
                    </div>
                    <div style="padding: 10px;padding-left: 0;">
                        <span>开始时间：</span>
                        <span style="">
                            <%--<a class="function-icon" href="javascript:;" onclick="index.time.changeTime('start_minus')">--%>
                                 <%--<i style="cursor:pointer" class="fa fa-minus" aria-hidden="true"></i>--%>
                            <%--</a>--%>
                            <input type="text" id="startTime" style="width: 60px;height: 20px;"
                                   onKeyUp="onKeyUp('start');"/>
                            <%--<a class="function-icon" href="javascript:;" onclick="index.time.changeTime('start_plus')">--%>
                                <%--<i style="cursor:pointer;" class="fa fa-plus" aria-hidden="true"></i>--%>
                            <%--</a>--%>
                        </span>
                        <span style="margin-left: 60px;">结束时间：</span>
                        <span style="">
                            <%--<a class="function-icon" href="javascript:;" onclick="index.time.changeTime('end_minus')">--%>
                                <%--<i style="cursor:pointer" class="fa fa-minus" aria-hidden="true"></i>--%>
                            <%--</a>--%>
                            <input type="text" id="endTime" style="width: 60px;height: 20px;"
                                   onKeyUp="onKeyUp('end');"/>
                            <%--<a class="function-icon" href="javascript:;" onclick="index.time.changeTime('end_plus')">--%>
                                <%--<i style="cursor:pointer;" class="fa fa-plus" aria-hidden="true"></i>--%>
                            <%--</a>--%>
                        </span>
                    </div>
                    <div id="reportSetting" style="width: 600px;margin-top: 10px;margin-bottom: 10px;">

                    </div>
                    <div style="border-top: 1px solid #e8e8e8;padding: 10px;">
                        <span>姓名：</span>
                        <input type="text" id="fullname"/>
                        <span style="margin-left: 25px;">邮箱：</span>
                        <input type="text" id="email"/>
                        <input type="button" style="margin-left: 25px;" class="btn btn-primary" value="查询"
                               onclick="userTable.build()"/>
                    </div>
                    <div id="user_div" style="width:400px;border: 1px solid #e8e8e8;padding: 10px;float: left;">
                        <table id="user_table"></table>
                        <div id="user_pager"></div>
                    </div>
                    <div style="float:left;float:left;padding-left: 10px;padding-right: 10px;margin-top: 100px;">
                        <i class="fa fa-long-arrow-right" aria-hidden="true"></i>
                    </div>
                    <div id="selectedUser"
                         style="width: 25%;height:203px;overflow: auto;border: 1px solid #e8e8e8;padding: 10px;float: left;margin-left: 1px">

                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
                <button type="button" class="btn btn-primary" onclick="index.save()">保存</button>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div><!-- /.modal -->


<%--报表弹出框--%>
<div class="modal fade" id="showDetailInfo">
    <div class="modal-dialog" style="margin-top: 50px">   <!-- style="width: 900px;left: -50px" -->
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true"><img
                        src="../../static/reportManageSys/images/close.png"></span><span class="sr-only"></span>
                </button>
                <h4 class="modal-title">详细信息</h4>
            </div>
            <div class="modal-body" id="modal-body">
                <div style="height: 300px;overflow: auto;">
                    <div style="padding: 5px;margin:0 10px 0 0;border: 1px solid #e8e8e8">
                        <table style="margin-left: 10px">
                            <tr style="height: 40px">
                                <td width="70px">模板名称<span style="color: red">*</span>:</td>
                                <td style="padding-right: 20px"><input id="demo_name" type="text" readonly="readonly"/>
                                </td>
                                <td width="70px">备注:</td>
                                <td style="padding-right: 20px"><input id="demo_remark" type="text"
                                                                       readonly="readonly"/></td>
                            </tr>
                            <tr style="height: 40px">
                                <td width="70px">带宽(M):</td>
                                <td colspan="3" style="padding-right: 20px"><input id="demo_bandWidth" type="text"
                                                                                   readonly="readonly"/></td>
                            </tr>
                        </table>
                    </div>
                    <div style="padding: 5px;margin:8px 10px 0 0;border: 1px solid #e8e8e8;min-height: 200px;">
                        <ul id="tree_left"></ul>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <center>
                    <!-- <button type="button" class="btn btn-primary"   onclick="mainE.addReportName()" >添 加</button> -->
                    <button type="button" class="btn btn-default" data-dismiss="modal">关 闭</button>
                </center>
            </div>

        </div>
    </div>
</div>
</body>
<script type="application/javascript" src="${ctx}/scripts/reportManageSys/componentSource.js"></script>
<script type="application/javascript" src="${ctx}/scripts/reportManageSys/previewReport.js"></script>
<script src="${ctx}/scripts/sendEmail/index.js" type="text/javascript"></script>
<script src="${ctx}/scripts/sendEmail/reportTree.js" type="text/javascript"></script>
<script src="${ctx}/scripts/sendEmail/taskTable.js" type="text/javascript"></script>
<script src="${ctx}/scripts/sendEmail/userTable.js" type="text/javascript"></script>
<script src="${ctx}/scripts/reportManageSys/commonAjax.js" type="text/javascript"></script>
</html>