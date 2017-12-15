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
    <link rel="stylesheet" type="text/css" href="${ctx}/static/sendEmail/transfer.css"/>
    <link rel="stylesheet" type="text/css" href="${ctx}/static/sendEmail/reportSub.css"/>
</head>
<body>
<div class="searchbox">
    <span>时间范围：</span>
    <input id="startTime_search" class="Wdate TimeFiled"
           onclick="WdatePicker({dateFmt : 'yyyy-MM-dd',maxDate:'%y-%M-{%d+1}'})"/>
    <span>~</span>
    <input id="endTime_search" class="Wdate TimeFiled"
           onclick="WdatePicker({dateFmt : 'yyyy-MM-dd',maxDate:'%y-%M-{%d+1}'})"/>
    <span name="name">报表名称：</span>
    <input type="text" id="reportName">
    <span name="name">收件人：</span>
    <input type="text" id="receptName">
    <span name="name"><button type="button" class="btn btn-primary" id="search">查询</button></span>
</div>
<div class="con_itembox" id="con_itembox_query">
    <div class="con_homebox_title">
        <div class="con_homebox-icon">
            <h5>
                <i class="fa fa-rss ecom_icons" aria-hidden="true"></i>
                报表订阅任务配置
            </h5>
        </div>
        <div class="btn-add">
            <button type="button" class="btn btn-primary" id="addEmailTask">新增</button>
        </div>
        <div class="clear"></div>
    </div>
    <div class="clear"></div>
    <div id="reportTask_div">
        <table id="reportTask_table"></table>
        <div id="reportTask_pager"></div>
    </div>
</div>


<%--新增或编辑弹出框--%>
<div class="modal fade" id="modal" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true"
     data-backdrop="static">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h4 class="modal-title" id="modalLabel">新增报表订阅</h4>
            </div>
            <div class="modal-body">
                <div class="panel panel-default report-tree">
                    <div class="panel-body">
                        <ul id="tree"></ul>
                    </div>
                </div>
                <div class="panel panel-default report-con">
                    <div class="panel-body">
                        <div class="condi-each">
                            任务名称：<span style="color:red ;">*</span>
                            <input type="text" name="subjectName" id="subjectName" style="width:340px"/>
                        </div>
                        <div class="condi-each" id="timeType">
                            时间粒度：
                            <span style="display:none;">
                                <input name="timeType" type="radio" class="RadioStyle" id="timeType_min" value="min"/>分
                            </span>
                            <span style="">
                                <input name="timeType" type="radio" class="RadioStyle" id="timeType_hour" value="hour"
                                       checked/>小时
                            </span>
                            <span style="display:none;">
                                <input name="timeType" type="radio" class="RadioStyle" id="timeType_day" value="day"/>日
                            </span>
                            <span style="display:none;">
                                <input name="timeType" type="radio" class="RadioStyle" id="timeType_week" value="week"/>周
                            </span>
                            <span style="display:none;">
                                <input name="timeType" type="radio" class="RadioStyle" id="timeType_month"
                                       value="month">月
                            </span>
                        </div>
                        <div class="condi-each">
                            是否启用：
                            <input type="checkbox" class="RadioStyle" id="useable" checked="checked" value="1"/>
                        </div>
                        <div class="condi-each">
                            发送时间：
                            <div style="height: 205px;margin-top: 10px;">
                                <div id="weekDiv" class="well"
                                     style="display: none;padding: 0; float: left; width: 108px; height: 200px;border: 1px solid #e8e8e8; overflow: auto;margin-right: 5px;">
                                    <div style="height: 25px ;">
                                        <input type="checkbox" id="weekAll" onchange="">全选
                                    </div>
                                    <div style="height: 172px;overflow:auto; margin-left: 15px">
                                        <ul id="weekUI">
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
                                <div id="dayDiv" class="well"
                                     style="float: left;padding: 0; width: 110px; height: 200px; border: 1px solid #e8e8e8; display: none;margin-right: 5px;">
                                    <div style="height: 25px ;">
                                        <input type="checkbox" id="dayAll" onchange="">全选
                                    </div>
                                    <div style="height: 172px;overflow:auto; margin-left: 15px">
                                        <ul id="dayUI">
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
                                <div id="hourDiv" class="well"
                                     style="float: left;padding: 0; width: 110px; height: 200px; border: 1px solid #e8e8e8; display: none;margin-right: 5px;">
                                    <div style="height: 25px ;">
                                        <input type="checkbox" id="hourAll" onchange="">全选
                                    </div>
                                    <div style="height: 172px;overflow:auto; margin-left: 15px">
                                        <ul id="hourUI">
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
                                <div id="minDiv" class="well"
                                     style="float: left;padding: 0; width: 110px; height: 200px; border: 1px solid #e8e8e8; display: block;margin-right: 5px;">
                                    <div style="height: 25px ;">
                                        <input type="checkbox" id="minAll" onchange="">全选
                                    </div>
                                    <div style="height: 172px;overflow:auto; margin-left: 15px">
                                        <ul id="minUI">
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
                                        <button class="btn btn-success btn-sm" id="add">增加</button>
                                        <br><br>
                                        <button class="btn btn-success btn-sm disabled" id="delete">删除</button>
                                        <br><br>
                                        <button class="btn btn-success btn-sm disabled" style=" margin-right: 5px;"
                                                id="allDelete">全删
                                        </button>
                                    </center>
                                </div>
                                <div id="resDiv" class="well"
                                     style="float: left;padding: 0; width: 140px; height: 200px;border: 1px solid #e8e8e8;overflow:auto;">
                                    <ul id="resUI"></ul>
                                </div>
                                <div class="clear"></div>
                            </div>
                            <div class="clear"></div>
                        </div>
                        <div class="clear"></div>
                        <div class="condi-each">
                            <span>开始时间：</span>
                            <input type="text" id="startTime"/>
                            <span></span>
                        </div>
                        <div class="condi-each">
                            <span>结束时间：</span>
                            <input type="text" id="endTime"/>
                            <span></span>
                        </div>
                        <div class="condi-each">
                            <div id="otherCondition" style="width: 100%;">

                            </div>
                        </div>
                        <div class="condi-each">
                            <div id="users_div">
                                <table id="users_table"></table>
                                <div id="users_pager"></div>
                            </div>
                            <div class="well content-users" id="usersSelected"></div>
                            <div class="clear"></div>
                        </div>
                    </div>
                </div>
                <div class="clearboth"></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
                <button type="button" class="btn btn-primary" id="saveTask">保存</button>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div><!-- /.modal -->
</body>
<script type="application/javascript" src="${ctx}/scripts/reportManageSys/componentSource.js"></script>
<script type="application/javascript" src="${ctx}/scripts/reportManageSys/previewReport.js"></script>
<script src="${ctx}/scripts/sendEmail/dialog.js" type="text/javascript"></script>
<script src="${ctx}/scripts/sendEmail/utils.js" type="text/javascript"></script>
<script src="${ctx}/scripts/sendEmail/reportSub.js" type="text/javascript"></script>
</html>
