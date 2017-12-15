<%@ page contentType="text/html;charset=utf-8" %>
<%@ page language="java" import="java.util.*" pageEncoding="utf-8" %>
<%String currUserName=request.getParameter("currUserName")==null?"unknown":request.getParameter("currUserName"); %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>系统管理-报表发布管理</title>
<%@ include file="/commonSelfReport/baselib.jsp"%>

    <!--引用easyui框架-->
    <script src="easyui/jquery.easyui.min.js" type="text/javascript"></script>
    <script src="easyui/locale/easyui-lang-zh_CN.js" type="text/javascript"></script>
    <link rel="stylesheet" type="text/css" href="themes/bootstrap/easyui.css"/>
    <link rel="stylesheet" type="text/css" href="themes/icon.css"/>
    <link href="easyui/style/css/statisticalforms.css" rel="stylesheet" type="text/css"/>
    <link href="${ctx}/static/reportManageSys/css/owner.css" rel="stylesheet" type="text/css"/>

    <!--自己的js-->
    <script src="${ctx}/scripts/reportManageSys/jquery.json-2.4.min.js" type="text/javascript"></script>
    <script src="${ctx}/scripts/reportManageSys/commonAjax.js" type="text/javascript"></script>
    <script src="${ctx}/scripts/reportManageSys/systemManager.js" type="text/javascript"></script>
<script src="${ctx}/scripts/reportManageSys/configUrl.js" type="text/javascript"></script>
<!--引用背景图片--> 
<%@ include file="aBackGround.jsp" %>



    <style type="text/css">
        .panel-body {
            padding: 0;
        }
    </style>


    <script type="text/javascript">
      var currUserName="<%=currUserName%>";
        $(document).ready(function () {
            var h = document.documentElement.clientHeight;
            var k = h - 125;
            var div_id = ['div_0', 'div_1', 'div_2', 'div_3'];
            for (var i = 0; i < div_id.length; i++) {
                document.getElementById(div_id[i]).style.height = k + "px";
            }
            ;
            var tree = k * 0.97 * 0.99;
            document.getElementById("treeGrid_user_0").style.height = tree + "px";
            document.getElementById("treeGrid_report_0").style.height = tree + "px";
            initCookie();
            systemManager.init(k);
        });
    </script>


</head>


<body>
<div id="curr_menu" style="display: none;"></div>
<div class="container-fluid" style="margin-left:10px">
    <div class="row">
        <div class="col-sm-12" style="padding:0;">
            <div class="con_menu" id="allIndexTab">
                <li class="hover"><a>正在加载数据...</a></li>
            </div>
            <div id="allIndexDiv" onselectstart="return false;" style="-moz-user-select:none;">
                <div id="seek"
                     style="border-left: 1px solid #e8e8e8;border-right: 1px solid #e8e8e8;height: 35px;padding: 10px 10px 0 10px;">
                    <div id="reportSeek" style="float: left;width: 40%;">
                        <input class="form-control" id="reportSeekName" placeholder="请输入报表名称...."
                               onkeypress="if(event.keyCode==13){systemManager.reportSeek();}"/>
                        <div style="display: inline-block;">
                            <button type="button" value="搜  索" class="owner_btn_primary"
                                   style=" cursor:pointer;height: 34px;" onclick="systemManager.reportSeek()" ><lable class="note_search"></lable>搜  索</button>
                                   <!-- <input type="button" value="搜  索" class="owner_btn_primary"
                                   style=" cursor:pointer;height: 34px;" onclick="systemManager.reportSeek()"/> -->
                        </div>
                        <a href="JavaScript:void(0)" style="float: right;margin-top: 10px;margin-right: 10px;"
                           title="全部折叠" onclick="systemManager.reportAllClose()"><img
                                src="../../static/reportManageSys/images/jianhao.png"></a>
                        <a href="JavaScript:void(0)" style="float: right;margin-top: 10px;" title="全部展开"
                           onclick="systemManager.reportAllOpen()"><img
                                src="../../static/reportManageSys/images/jiahao.png"></a>
                    </div>
                    <div id="userSeek" style="float: left;width: 60%;">
                        <select id="selectType" style="width: 100px">
                            <option value="username">用户名</option>
                            <option value="name">姓名</option>
                            <option value="dept">部门</option>
                            <option value="phone">电话</option>
                        </select>
                        <input class="form-control" id="userSeekName" placeholder="请输入...."
                               onkeypress="if(event.keyCode==13){systemManager.userSeek();}"/>
                        <button type="button" value="搜  索" class="owner_btn_primary"
                               style=" cursor:pointer;height: 34px;" onclick="systemManager.userSeek()"><lable class="note_search"></lable>搜  索</button>
                               <!-- <input type="button" value="搜  索" class="owner_btn_primary"
                               style=" cursor:pointer;height: 34px;" onclick="systemManager.userSeek()"/> -->
                        <!-- <input class="SearchBtn" type="button" onclick="systemManager.userSeek()"  onmouseout="this.className='SearchBtn'" onmouseover="this.className='SearchBtn_on'" style="margin:0 0 0 5px;">  -->
                        <a href="JavaScript:void(0)" style="float: right;margin-top: 10px;margin-right: 10px;"
                           title="全部折叠" onclick="systemManager.userAllClose()"><img
                                src="../../static/reportManageSys/images/jianhao.png"></a>
                        <a href="JavaScript:void(0)" style="float: right;margin-top: 10px;" title="全部展开"
                           onclick="systemManager.userAllOpen()"><img
                                src="../../static/reportManageSys/images/jiahao.png"></a>
                    </div>
                </div>
                <div id="div_0" class="line7890"
                     style="position: relative;  border: solid 1px #e8e8e8; border-top: none; padding: 10px;">
                    <div id="report_0_div" style="position: relative; width: 40%;height: 97%; float: left;">
                        <table style="border-collapse: seperate ;" id="treeGrid_report_0"></table>
                    </div>
                    <div id="user_0_div" style="position: relative; width: 60%; height: 97%; float: left;">
                        <table id="treeGrid_user_0"></table>
                    </div>
                </div>
                <div id="div_1" class="line7890"
                     style="position: relative;  border: solid 1px #e8e8e8; border-top: none; padding: 10px; display: none">

                </div>
                <div id="div_2" class="line7890"
                     style="position: relative;  border: solid 1px #e8e8e8; border-top: none; padding: 10px; display: none">

                </div>
                <div id="div_3" class="line7890"
                     style="position: relative;  border: solid 1px #e8e8e8; border-top: none; padding: 10px; display: none">

                </div>
            </div>

        </div>
    </div>
    <div class="row">
        <div class="col-sm-12" style="padding:0;">
            <center>
                <button type="button" class="owner_btn_warning" value="保  存"
                       style=" cursor:pointer;padding:3px 14px;height:34px;margin-top: 10px;"
                       onclick="systemManager.save()"><lable class="note_save"></lable>保  存</button>
                       <!-- <input type="button" class="owner_btn_warning" value="保  存"
                       style=" cursor:pointer;padding:3px 14px;height:34px;margin-top: 10px;"
                       onclick="systemManager.save()"/> -->
            </center>
        </div>
    </div>

</div>
</body>
</html>