<%@ page contentType="text/html;charset=utf-8"%>
<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>

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
<link href="${ctx}/static/reportManageSys/css/owner.css" rel="stylesheet" type="text/css" />


<!--引用背景图片--> 
<%@ include file="aBackGround.jsp" %>




<!--自己的js-->
<script src="${ctx}/scripts/reportManageSys/jquery.json-2.4.min.js" type="text/javascript"></script>
<script src="${ctx}/scripts/reportManageSys/commonAjax.js" type="text/javascript"></script>
<script src="${ctx}/scripts/reportManageSys/publishReport.js" type="text/javascript"></script>
<script src="${ctx}/scripts/reportManageSys/configUrl.js" type="text/javascript"></script>

<style type="text/css">
  .panel-body {
    padding: 0;
}
</style>



 <script type="text/javascript">
    $(document).ready(function(){
          var k = document.body.offsetWidth;
          //document.getElementById("resultSeekReportName").style.width = 0.75*k +"px";
            publishReport.init();
    });
</script>


</head>

   
<body>
<div class="container-fluid" style="margin-left:10px">
<div class="row">
<div  class="col-sm-12" style="padding:0;">
        				                <!-- <div style="border: 1px solid #e8e8e8;padding: 0px 40px; margin-bottom: 10px">
                                             <table>
                                                  <tr style="height: 30px">
                                                      <td><input id="ifPublish" type="checkbox" style="margin-left: 0px;" />是否公告</td>
                                                  </tr>
                                                  <tr style="height: 40px">
                                                      <td>公告标题<span style="color: red">*</span>:</td>
                                                      <td><input id="noticTitle" type="text" style="width: 416px" /></td>
                                                  </tr>
                                                  <tr style="height: 100px">
                                                      <td>公告内容<span style="color: red">*</span>:</td>
                                                      <td>
                                                          <textarea id="noticContent" rows="3" cols="60"></textarea>    
                                                      </td>
                                                  </tr>
                                             </table>
                                        </div>  -->
                                <div id="userSeek" style="margin-bottom: 5px">
                                       <select id="selectType" style="width: 100px">
                                             <option value="username">用户名</option>
                                             <option value="name">姓名</option>
                                             <option value="dept">部门</option>
                                             <option value="phone">电话</option>
                                       </select>
                                       <input class="form-control" style="display: inline-block;" id="userSeekName" style="width: 260px" placeholder="请输入...." onkeypress="if(event.keyCode==13){publishReport.userSeek();}"/>
                                       <input type="button"  value="搜  索" class="btn btn-primary" style=" cursor:pointer;height: 34px;" onclick="publishReport.userSeek()" />
                                       <a href="JavaScript:void(0)" style="float: right;margin-top: 10px;margin-right: 10px;" title="全部折叠" onclick="publishReport.userAllClose()"><img src="../../static/reportManageSys/images/jianhao.png"></a>
                                       <a href="JavaScript:void(0)" style="float: right;margin-top: 10px;" title="全部展开" onclick="publishReport.userAllOpen()"><img src="../../static/reportManageSys/images/jiahao.png"></a>
                                </div>        
        				                <div id="treeTable" style="border: 0px solid #e8e8e8;height: 430px; overflow: auto;">
        				                	     <table id="treeGrid" style="height:410px"></table>
        				                </div>
        				                <div style="margin-top: 10px">
        				                	<center>
        				                	 <button type="button" class="btn btn-primary"  data-dismiss="modal" onclick="publishReport.publishReports()" >发 布</button>
        				                	 </center>
        				                </div>  
</div>
</div>
</div>


</body>
</html>