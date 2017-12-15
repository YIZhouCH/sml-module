
<%@ page contentType="text/html;charset=utf-8"%>
<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%String currUserName=request.getParameter("currUserName")==null?"unknown":request.getParameter("currUserName"); %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<%@ include file="/commonSelfReport/baselib.jsp"%>

<!--引用easyui框架-->
<script src="easyui/jquery.easyui.min.js" type="text/javascript"></script>
<script src="easyui/locale/easyui-lang-zh_CN.js" type="text/javascript"></script>
<link rel="stylesheet" type="text/css" href="themes/bootstrap/easyui.css" />
<link rel="stylesheet" type="text/css" href="themes/icon.css" />
<link href="easyui/style/css/statisticalforms.css" rel="stylesheet" type="text/css" />

<!--自己的js-->
<script src="${ctx}/scripts/reportManageSys/jquery.json-2.4.min.js" type="text/javascript"></script>
<script src="${ctx}/scripts/reportManageSys/commonAjax.js" type="text/javascript"></script>
<script src="${ctx}/scripts/reportManageSys/reportQuery.js" type="text/javascript"></script>
<script src="${ctx}/scripts/reportManageSys/configUrl.js" type="text/javascript"></script>
<!--引用背景图片--> 
<%@ include file="aBackGround.jsp" %>





 <script type="text/javascript">
  var currUserName="<%=currUserName%>";
    $(document).ready(function(){
          var k = document.body.offsetWidth;
            initCookie();
            reportQuery.init();
    });
</script>
<style>
  .popover {
           max-width: 2000px;
         }
</style>

</head>

   
<body class="easyui-layout">
<div id="onclickId" style="display:none;"></div>
<div id="onclickName" style="display:none;"></div>
      <div id="treeDiv" data-options="region:'west',split:true,title:'报表查询'" style="width:300px;padding:10px;">
                 <ul id="tree" onselectstart="return false;" style="-moz-user-select:none;" ></ul>
      </div>
           <div id="mainPanle" region="center" style="padding:0; overflow-y: hidden;">
                  <div id="tabs" class="easyui-tabs"  data-options="fit:true,border:false,plain:true" >
                      <div title="报表搜索"  style="padding:1px;width:100%;height:100%;">
<div class="container-fluid" style="margin-left:10px">
<div class="row">
<div  class="col-sm-12" style="padding:0;">
                          <center>
                               <div id="baowei" style=" border: 0px solid #e8e8e8 ;margin-top: 50px;padding: 20px">
                                   <select id="nameType" onclick="reportQuery.changeTip()"  style="width: 120px">
                                    <option value="report" >报表名称</option>
                                    <option value="index">指标名称</option>
                                </select>
                                   <input id="myReportName" type="text" placeholder="请输入报表名称" style="width: 260px;height: 34px;" onkeypress="if(event.keyCode==13){reportQuery.seekReport();}" />
                                   <button type="button"  class="btn btn-primary" value="" style="margin-left: 20px;padding:3px 14px;height:34px; margin-bottom: 4px;" onclick="reportQuery.seekReport()"><lable class="note_search"></lable>搜  索</button>
                                   <button type="button"  class="btn btn-warning" value="" style="margin-left: 20px;padding:3px 14px;height:34px; margin-bottom: 4px;" onclick="reportQuery.clearSeek()" ><lable class="note_clear"></lable>重  置</button>
                                   <!-- <input type="button"  class="btn btn-primary" value="搜  索" style="margin-left: 20px;padding:3px 14px;height:34px; margin-bottom: 4px;" onclick="reportQuery.seekReport()" />
                                   <input type="button"  class="btn btn-warning" value="重  置" style="margin-left: 20px;padding:3px 14px;height:34px; margin-bottom: 4px;" onclick="reportQuery.clearSeek()" />
                                    --><!-- <input type="button"  class="btn btn-warning" value="选 中" style="margin-left: 20px;padding:3px 14px;height:34px; margin-bottom: 4px;" onclick="reportQuery.selectReportName('20160421112943')" /> -->
                               </div>
                               <div id="resultmyReportName" style="border:0px solid #e8e8e8; width: 800px;padding-left: 50px;">
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
    <div id="mmTtr" style="display:none;"></div>
    <div id="mmTtr_text" style="display:none;"></div>
  <div id="mmm" class="easyui-menu" style="width:150px;">
    <div onclick="reportQuery.addMyAttention()" data-options="iconCls:'icon-xinjianmulu'">添加至我的报表</div>
  </div>
  <div id="mmm1" class="easyui-menu" style="width:150px;">
    <div onclick="reportQuery.cancalAttention()" data-options="iconCls:'icon-xinjianmulu'">取消关注</div>
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
</body>
</html>