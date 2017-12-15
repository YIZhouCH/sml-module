<%@ page contentType="text/html;charset=utf-8"%>
<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%String currUserName=request.getParameter("currUserName")==null?"unknown":request.getParameter("currUserName"); %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>系统管理-报表维护管理</title>
<%@ include file="/commonSelfReport/baselib.jsp"%>


<!--引用easyui框架-->
<script src="easyui/jquery.easyui.min.js" type="text/javascript"></script>
<script src="easyui/locale/easyui-lang-zh_CN.js" type="text/javascript"></script>
<link rel="stylesheet" type="text/css" href="themes/bootstrap/easyui.css"/>
<link rel="stylesheet" type="text/css" href="themes/icon.css"/>
<link href="easyui/style/css/statisticalforms.css" rel="stylesheet" type="text/css"/>


<!--自己的js-->
<script src="${ctx}/scripts/reportManageSys/jquery.json-2.4.min.js" type="text/javascript"></script>
<script src="${ctx}/scripts/reportManageSys/commonAjax.js" type="text/javascript"></script>
<script src="${ctx}/scripts/reportManageSys/mainE.js" type="text/javascript"></script>
<script src="${ctx}/scripts/reportManageSys/configUrl.js" type="text/javascript"></script>

<!--引用背景图片--> 
<%@ include file="aBackGround.jsp" %>




 <script type="text/javascript">
  var currUserName="<%=currUserName%>";
    $(document).ready(function(){
          var k = document.body.offsetWidth;
          document.getElementById("resultSeekReportName").style.width = 0.75*k +"px";
            initCookie();
            mainE.init();
        });
</script>
<style>
  .popover {
           max-width: 2000px;
         }
</style>
</head>


<body class="easyui-layout">


<!-- <div data-options="region:'north',border:false" style="height:60px;background:#B3DFDA;padding:10px">north region</div> -->
<!-- <div data-options="region:'east',split:true,collapsed:true,title:'East'" style="width:100px;padding:10px;">east region</div>
<div data-options="region:'south',border:false" style="height:50px;background:#A9FACD;padding:10px;">south region</div> -->
<div data-options="region:'west',split:true,title:'报表维护'" style="width:300px;padding:10px;">
    <ul id="tree" onselectstart="return false;" style="-moz-user-select:none;"></ul>
</div>

<div id="mainPanle" region="center" style="padding:0;overflow-y: hidden;">

    <div id="tabs" class="easyui-tabs" data-options="fit:true,border:false,plain:true">

        <div title="报表搜索" style="padding:1px;width:100%;height:100%;">
            <div class="container-fluid" style="margin-left:10px">
                <div class="row">
                    <div class="col-sm-12" style="padding:0;">
                        <center>
                            <div id="baowei" style=" border: 0px solid #e8e8e8 ;margin-top: 50px;padding: 20px">
                                <select id="nameType" onclick="mainE.changeTip()" style="width: 120px">
                                    <option value="report" >报表名称</option>
                                    <option value="index">指标名称</option>
                                </select>
                                <input id="seekReportName" type="text" placeholder="请输入报表名称"
                                       style="width: 290px;height: 34px;"
                                       onkeypress="if(event.keyCode==13){mainE.seekReport();}"/>
                                <input type="button" class="btn btn-primary" value="搜  索"
                                       style="margin-left: 20px;padding:3px 14px;height:34px; margin-bottom: 4px;"
                                       onclick="mainE.seekReport()"/>
                                <input type="button" class="btn btn-warning" value="重  置"
                                       style="margin-left: 20px;padding:3px 14px;height:34px; margin-bottom: 4px;"
                                       onclick="mainE.clearSeek()"/>
                            </div>
                            <div id="resultSeekReportName"
                                 style="border:0px solid #e8e8e8; width: 800px;padding-left: 50px;">
                                <table id="table" class="table">

                                </table>
                            </div>
                        </center>
                    </div>
                </div>
            </div>
        </div>


    </div>


</div>


<div id="mm1" class="easyui-menu" style="width:150px;">
    <div onclick="mainE.addMulu()" data-options="iconCls:'icon-xinjianmulu'">新建目录</div>
    <div onclick="mainE.addReport('新增报表','addReport.jsp')" data-options="iconCls:'icon-xinjianbaobiao'">新建报表</div>
    <div onclick="mainE.alterMulu()" data-options="iconCls:'icon-xiugaimulu'">修改目录</div>
    <div onclick="mainE.removeMulu()" data-options="iconCls:'icon-shanchumulu'">删除目录</div>
    <div onclick="mainE.getModalTreeData()" data-options="iconCls:'icon-moveotherHot'">移动到其他目录</div>
    <div id="mmTtr" style="display:none;"></div>
    <div id="mmTtr_text" style="display:none;"></div>
</div>
<div id="mm2" class="easyui-menu" style="width:150px;">
    <div onclick="mainE.updateReportNames()" data-options="iconCls:'icon-xiugaibaobiaomingcheng'">修改名称</div>
    <div onclick="mainE.updateReport()" data-options="iconCls:'icon-xiugaimulu'">编辑报表</div>
    <div onclick="mainE.removeReport()" data-options="iconCls:'icon-shanchumulu'">删除报表</div>
    <div onclick="mainE.ArithEdit()" data-options="iconCls:'icon-suanfashuoming'">算法说明</div>
    <div onclick="mainE.getModalTreeData()" data-options="iconCls:'icon-moveotherHot'">移动到其他目录</div>
    <div id="onclickId" style="display:none;"></div>
    <div id="onclickName" style="display:none;"></div>
</div>

<div id="mm" class="easyui-menu" style="width:150px;">
    <!--  <div id="mm-tabupdate">刷新</div>
    <div id="mm-tabclose">关闭</div> -->
    <div id="mm-tabcloseall">全部关闭</div>
    <div id="mm-tabcloseother">除此之外全部关闭</div>
    <div id="mm-tabcloseright">当前页右侧全部关闭</div>
    <div id="mm-tabcloseleft">当前页左侧全部关闭</div>
    <div id="mm-exit">退出</div>
</div>


<!---------------------------------------------------------------------------->
<div class="modal" id="mymodal">
    <div class="modal-dialog" style="margin-top: 150px">   <!-- style="width: 900px;left: -50px" -->
        <div class="modal-content modalContent">
            <div class="modal-header modalTOP">
                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true"><img
                        src="../../static/reportManageSys/images/close.png"></span><span class="sr-only"></span>
                </button>
                <h4 class="modal-title">新建目录</h4>
            </div>
            <div class="modal-body" id="modal-body">
                <span style="margin-left: 0px">输入目录名</span><span style="color: red">*</span><span>:</span>
                <input id="muluName" type="text" style="width: 290px ;height: 34px; margin-right: 30px"/>
                <button type="button" class="btn btn-primary" onclick="mainE.addMuluName()">添 加</button>
                <button type="button" class="btn btn-primary" onclick="mainE.resetMuluName()">重 置</button>

            </div>

        </div>
    </div>
</div>
<!---------------------------------------------------------------------------->
<div class="modal" id="alterMulu">
    <div class="modal-dialog" style="margin-top: 150px">   <!-- style="width: 900px;left: -50px" -->
        <div class="modal-content modalContent">
            <div class="modal-header modalTOP">
                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true"><img
                        src="../../static/reportManageSys/images/close.png"></span><span class="sr-only"></span>
                </button>
                <h4 class="modal-title">修改目录</h4>
            </div>
            <div class="modal-body" id="modal-body">
                <span style="margin-left: 40px">输入目录名</span><span style="color: red">*</span><span>:</span>
                <input id="alterMuluName" type="text" style="width: 290px ; height: 34px; margin-right: 30px"/>
                <button type="button" class="btn btn-primary" onclick="mainE.alterMuluName()">修 改</button>
                <!-- <button type="button" class="btn btn-primary"  onclick="mainE.resetAlterMuluName()" >重 置</button>  -->
            </div>

        </div>
    </div>
</div>
<!---------------------------------------------------------------------------->
<div class="modal" id="alterReport">
    <div class="modal-dialog" style="margin-top: 150px">   <!-- style="width: 900px;left: -50px" -->
        <div class="modal-content modalContent">
            <div class="modal-header modalTOP">
                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true"><img
                        src="../../static/reportManageSys/images/close.png"></span><span class="sr-only"></span>
                </button>
                <h4 class="modal-title">修改报表名称</h4>
            </div>
            <div class="modal-body" id="modal-body">
                <span style="margin-left: 40px">输入报表名</span><span style="color: red">*</span><span>:</span>
                <input id="alterReportName" type="text" style="width: 290px ; height: 34px; margin-right: 30px"/>
                <button type="button" class="btn btn-primary" onclick="mainE.alterReportNames()">修 改</button>
                <!-- <button type="button" class="btn btn-primary"  onclick="mainE.resetAlterMuluName()" >重 置</button>  -->
            </div>

        </div>
    </div>
</div>
<!---------------------------------------------------------------------------->
<div class="modal" id="newCreateReport">
    <div class="modal-dialog" style="margin-top: 150px">   <!-- style="width: 900px;left: -50px" -->
        <div class="modal-content modalContent">
            <div class="modal-header modalTOP">
                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true"><img
                        src="../../static/reportManageSys/images/close.png"></span><span class="sr-only"></span>
                </button>
                <h4 class="modal-title">新建报表</h4>
            </div>
            <div class="modal-body" id="modal-body">
                <span style="margin-left: 40px">输入报表名</span><span style="color: red">*</span><span>:</span>
                <input id="reportName" type="text" style="width: 290px ; height: 34px;"/>
                <input id="reportRadio" type="checkbox" onclick="mainE.changeReportToJsp()"><span>外部jsp页面</span>
                <!-- <button type="button" class="btn btn-primary"  onclick="mainE.resetReportName()" >重 置</button> -->
                <br/><br/>
                <div id="dataPoolDiv">
                    <span style="margin-left: 40px">数据源名称<span style="color: red">*</span>:</span>
                    <select id="dataPool" style="width: 290px;height: 34px;">
                        <option>请选择</option>
                    </select>
                    <a href="JavaScript:void(0)" title="新增数据源" onclick="mainE.addDataPool()"><img
                            style="width: 34px; height: 34px ;margin-left: 20px;"
                            src="../../static/reportManageSys/images/P1.png"></a>
                </div>  
                <div id="dataJspAddressDiv" style="display: none">
                    <span style="margin-left: 40px;margin-right: 24px;">jsp路径<span style="color: red">*</span>:</span>
                    <input id="dataJspAddress" type="text" style="width: 290px ; height: 34px; margin-right: 30px" >
                </div>      


            </div>
            <div class="modal-footer modalFoot">
                <center>
                    <button id="dataPoolButton" type="button" class="btn btn-primary" onclick="mainE.addReportName()">添加报表</button>
                    <button id="dataJspAddressButton" style="display: none" type="button" class="btn btn-primary" onclick="mainE.addReportToJspName()">添加JSP</button>
                    <button id="dataJspAddressButtonUpdate" style="display: none" type="button" class="btn btn-primary" onclick="mainE.updateReportToJspName()">修 改</button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">关 闭</button>
                </center>
            </div>

        </div>
    </div>
</div>

<!--新增数据源-------------------------------------------------------------------------->
<div class="modal" id="datapool">
    <div class="modal-dialog">   <!-- style="width: 900px;left: -50px" -->
        <div class="modal-content modalContent">
            <div class="modal-header modalTOP">
                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true"><img
                        src="../../static/reportManageSys/images/close.png"></span><span class="sr-only">Close</span>
                </button>
                <h4 class="modal-title">数据源</h4>
            </div>
            <div class="modal-body" id="modal-body">
                <div style="border: 0px solid pink ; margin-left: 30px;">
                    <table>
                        <tr style="height: 60px">
                            <td>名称:</td>
                            <td style="width: 200px"><input style="width: 190px ;height: 34px;" id="dataName"
                                                            type="text"></input></td>
                            <td>数据库类型:</td>
                            <td>
                                <select id="dataType" style="width: 200px ;height: 34px;"
                                        onchange="mainE.changeDriverBao()">
                                    <option value="oracle">ORACLE</option>
                                    <option value="sybaseiq">SYBASEIQ</option>
                                </select>
                            </td>
                        </tr>
                        <tr style="height: 60px">
                            <td>地址:</td>
                            <td colspan="3"><input style="width: 100%;height: 34px;" id="dataUrl" type="text"></td>
                        </tr>
                        <tr style="height: 60px">
                            <td>用户名:</td>
                            <td><input id="dataUserName" type="text" style="width: 190px ;height: 34px;"></input></td>
                            <td>密码:</td>
                            <td><input id="dataPwdName" type="password" style="width: 200px ;height: 34px;"></input>
                            </td>
                        </tr>
                        <tr style="height: 60px">
                            <td>驱动包:</td>
                            <td colspan="3">
                                <select id="dataDriverBao" style="width: 100% ;height: 34px;">

                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>描述:</td>
                            <td colspan="3">
                                           <textarea id="dataDesc" rows="5" style="width: 100%">
                                                
                                           </textarea>
                            </td>
                        </tr>
                    </table>
                </div>

            </div>
            <div class="modal-footer modalFoot">
                <center>
                    <button type="button" class="btn btn-primary" onclick="mainE.addDataSource()">添加</button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">关 闭</button>
                </center>
            </div>
        </div>
    </div>
</div>

<!---------------------------------------------------------------------------->
<div class="modal" id="ArithEdit">
    <div class="modal-dialog" style="width: 800px">   <!-- style="width: 900px;left: -50px" -->
        <div class="modal-content modalContent">
            <div class="modal-header modalTOP">
                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true"><img
                        src="../../static/reportManageSys/images/close.png"></span><span class="sr-only"></span>
                </button>
                <h4 class="modal-title">算法编辑</h4>
            </div>
            <div class="modal-body" id="modal-body">
                <div id="container_up" class="container"
                     style="padding-bottom: 5px;padding-top: 0px; width:98%;height: 290px;margin-bottom: 0px;border: 0px solid #e8e8e8">
                    <div class="row">
                        <div class="col-md-2" style="font-size: 18px; height: 24px;">
                            报表描述:
                        </div>
                        <div class="col-md-10">
                            <textarea id="algo_instru" rows="15" style="width: 100%"></textarea>
                        </div>
                    </div>
                </div>
                <div id="container_down" class="container"
                     style="padding: 8px 15px;width:98%;height: 252px;border: 1px solid #e8e8e8">
                    <div class="row">
                        <div id="field_div" class="col-md-4"
                             style="height: 238px; border: 0px solid #e8e8e8;padding: 0 5px;overflow-y: auto;">

                        </div>
                        <div id="fieldInfo_div_kong" class="col-md-8" style="border: 0px solid #e8e8e8;height: 246px">

                        </div>

                        <div id="fieldInfo_div" class="col-md-8" style="border: 0px solid #e8e8e8;display: none;">
                            <div style="border: 0px solid #234afe;font-size: 18px; height: 24px;">算法公式:</div>
                            <div style="border: 0px solid #234afe;margin: 5px 0;">
                                <input id="fieldArith_input" type="text" style="width: 100%"/>
                            </div>
                            <div style="border: 0px solid #234afe;font-size: 18px; height: 29px;">
                                <div style="float: left;font-size: 18px; height: 30px;padding-top: 5px;">
                                    所需表和字段:
                                </div>
                                <div style="float: right">
                                    <button type="button" class="btn btn-success" onclick="mainE.addTableField()">添 加
                                    </button>
                                    <button type="button" class="btn btn-success" onclick="mainE.bindTableField()">绑 定
                                    </button>
                                </div>
                            </div>
                            <div id="tableField_div"
                                 style="height: 129px;overflow-y:auto; border: 1px solid #e8e8e8;margin: 10px 0;padding: 0 5px;">
                                <div id="sf_first_div" sf="0" ; style="margin: 3px 0 ;display: none;">
                                    <span>表名:</span>
                                    <input type="text" style="width: 30%"/>
                                    <span>字段名:</span>
                                    <input type="text" style="width: 30%"/>
                                    <a href="JavaScript:void(0)" onclick="mainE.delTableField(this)"><img
                                            style="width: 29px; height: 34px;"
                                            src="../../static/reportManageSys/images/closehong.png"></a>
                                </div>
                                <div sf="0" ; style="margin: 3px 0 ;display: none;">
                                    <span>表名:</span>
                                    <input type="text" style="width: 30%"/>
                                    <span>字段名:</span>
                                    <input type="text" style="width: 30%"/>
                                    <a href="JavaScript:void(0)" onclick="mainE.delTableField(this)"><img
                                            style="width: 29px; height: 34px;"
                                            src="../../static/reportManageSys/images/closehong.png"></a>
                                </div>
                                <div sf="0" ; style="margin: 3px 0 ;display: none;">
                                    <span>表名:</span>
                                    <input type="text" style="width: 30%"/>
                                    <span>字段名:</span>
                                    <input type="text" style="width: 30%"/>
                                    <a href="JavaScript:void(0)" onclick="mainE.delTableField(this)"><img
                                            style="width: 29px; height: 34px;"
                                            src="../../static/reportManageSys/images/closehong.png"></a>
                                </div>
                                <div sf="0" ; style="margin: 3px 0 ;display: none;">
                                    <span>表名:</span>
                                    <input type="text" style="width: 30%"/>
                                    <span>字段名:</span>
                                    <input type="text" style="width: 30%"/>
                                    <a href="JavaScript:void(0)" onclick="mainE.delTableField(this)"><img
                                            style="width: 29px; height: 34px;"
                                            src="../../static/reportManageSys/images/closehong.png"></a>
                                </div>
                                <div sf="0" ; style="margin: 3px 0 ;display: none;">
                                    <span>表名:</span>
                                    <input type="text" style="width: 30%"/>
                                    <span>字段名:</span>
                                    <input type="text" style="width: 30%"/>
                                    <a href="JavaScript:void(0)" onclick="mainE.delTableField(this)"><img
                                            style="width: 29px; height: 34px;"
                                            src="../../static/reportManageSys/images/closehong.png"></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer modalFoot">
                <center>
                    <button type="button" class="btn btn-primary" onclick="mainE.saveFieldArith()">保 存</button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">关 闭</button>
                </center>
            </div>

        </div>
    </div>
</div>
<!---------------------------------------------------------------------------->
<div class="modal" id="moveReport">
    <div class="modal-dialog" style="width: 550px">   <!-- style="width: 900px;left: -50px" -->
        <div class="modal-content modalContent">
            <div class="modal-header modalTOP">
                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true"><img
                        src="../../static/reportManageSys/images/close.png"></span><span class="sr-only"></span>
                </button>
                <h4 class="modal-title">移动报表</h4>
            </div>
            <div class="modal-body">
                <div id="modalTreeDiv" style="height: 300px;width: 100%;overflow: auto">
                    <ul id="modalTree" onselectstart="return false;" style="-moz-user-select:none;"></ul>
                </div>
            </div>
            <div class="modal-footer modalFoot" style="text-align: left;padding:5px 15px 15px;position: relative;">
                <!-- <div style="display: inline-block;position: relative;top: -15px;left: -30px;width: 200px;">
                    <span>
                        <input id="alterToOldName" type="checkbox" /><span style="font-size: 12px;">是否使用原报表名称</span>
                    </span>
                </div>
                <div style="display: inline-block;padding-top: 10px">
                    <button type="button" class="btn btn-primary"   onclick="mainE.moveReports()" >移动</button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                </div> -->
                <center>

                    <button type="button" class="btn btn-primary" onclick="mainE.moveReports()">移动</button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>

                </center>

            </div>

        </div>
    </div>
</div>

</body>
</html>