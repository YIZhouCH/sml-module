<%@ page contentType="text/html;charset=utf-8"%>
<%String autoReportParam=request.getParameter("autoReportParam")==null?"":request.getParameter("autoReportParam"); %>
<%String operate=request.getParameter("operate")==null?"false":request.getParameter("operate"); %>
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

<!--引用背景图片--> 
<%@ include file="aBackGround.jsp" %>





<!--自己的js-->
<script src="${ctx}/scripts/reportManageSys/jquery.json-2.4.min.js" type="text/javascript"></script>
<script src="${ctx}/scripts/reportManageSys/commonAjax.js" type="text/javascript"></script>
<script src="${ctx}/scripts/reportManageSys/autoReport.js" type="text/javascript"></script>
<script src="${ctx}/scripts/reportManageSys/configUrl.js" type="text/javascript"></script>




 <script type="text/javascript">
var autoReportParam="<%=autoReportParam%>";
var operate="<%=operate%>";

    $(document).ready(function(){
          var k = document.body.offsetWidth;
            autoReport.init();
    });
</script>

</head>

   
<body class="easyui-layout">
    <div id="treeDiv" data-options="region:'west',split:true,title:'报表列表'" style="width:300px;padding:10px;">
           <ul id="tree" onselectstart="return false;" style="-moz-user-select:none;" ></ul>
    </div>

     <div id="mainPanle" region="center" style="padding:0; background:white;overflow-y: hidden;">
            <div id="tabs" class="easyui-tabs"  data-options="fit:true,border:false,plain:true" >
                <!-- <div title="报表搜索"  style="padding:1px;background-color:white;width:100%;height:100%;">
                    <center>
                        <div id="baowei" style=" border: 0px solid #e8e8e8 ;margin-top: 50px;padding: 20px">
                        </div>
                        <div id="resultSeekReportName" style="border:0px solid #e8e8e8; width: 800px;padding-left: 50px;">
                                <table id="table" class="table">
                                </table>
                        </div>
                    </center>    
                </div> -->
            </div>
    </div>


<div id="mmTtr" style="display: none;"></div>
<div id="mmTtr_text" style="display: none;"></div>
<div id="url_url" style="display: none;"></div>

<div id="onclickId" style="display:none;"></div>
<div id="onclickName" style="display:none;"></div>

 <div id="mm0" class="easyui-menu" style="width:150px;">
     <div onclick="autoReport.addMulu()" data-options="iconCls:'icon-xinjianmulu'">新建目录</div>
 </div>
 <div id="mm1" class="easyui-menu" style="width:150px;">
    <div onclick="autoReport.addMulu()" data-options="iconCls:'icon-xinjianmulu'">新建目录</div>
    <div onclick="autoReport.addReport()" data-options="iconCls:'icon-xinjianbaobiao'">新建报表</div>
    <div onclick="autoReport.alterMulu()" data-options="iconCls:'icon-xiugaimulu'">修改目录</div>
    <div onclick="autoReport.removeMulu()" data-options="iconCls:'icon-shanchumulu'">删除目录</div>
 </div>

 <div id="mm2" class="easyui-menu" style="width:150px;">
    <div onclick="autoReport.getModalTreeData()" data-options="iconCls:'icon-xiugaibaobiaomingcheng'">绑定报表</div>
    <div onclick="autoReport.updateReportName()" data-options="iconCls:'icon-xiugaimulu'">修改名称</div>
    <div onclick="autoReport.removeReport()" data-options="iconCls:'icon-shanchumulu'">删除报表</div>
 </div>


<!---------------------------------------------------------------------------->
        <div  class="modal" id="addmulu">
          <div class="modal-dialog" style="margin-top: 150px;width: 650px">   <!-- style="width: 900px;left: -50px" -->
              <div class="modal-content modalContent" >
                    <div class="modal-header modalTOP">
                        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true"><img src="../../static/reportManageSys/images/close.png"></span><span class="sr-only"></span></button>
                        <h4 class="modal-title">新建目录</h4>
                    </div>
                    <div class="modal-body" id="modal-body" >
                           <span style="margin-left: 40px">输入目录名</span><span style="color: red">*</span><span>:</span>
                           <input id="muluName" type="text" style="width: 290px ;height: 34px; margin-right: 30px" />
                           <button type="button" class="btn btn-primary"   onclick="autoReport.addMulus()" >添 加</button>
                           <button type="button" class="btn btn-primary"  onclick="autoReport.resetMuluName()" >重 置</button> 

                    </div>
                    
              </div>
         </div>
      </div>
      
      
<!---------------------------------------------------------------------------->
        <div  class="modal" id="addreport">
          <div class="modal-dialog" style="margin-top: 150px;width: 650px">   <!-- style="width: 900px;left: -50px" -->
              <div class="modal-content modalContent" >
                    <div class="modal-header modalTOP">
                        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true"><img src="../../static/reportManageSys/images/close.png"></span><span class="sr-only"></span></button>
                        <h4 class="modal-title">新建报表</h4>
                    </div>
                    <div class="modal-body" >
                           <span style="margin-left: 40px">输入报表名</span><span style="color: red">*</span><span>:</span>
                           <input id="reportName" type="text" style="width: 290px ;height: 34px; margin-right: 30px" />
                           <button type="button" class="btn btn-primary"   onclick="autoReport.addReports()" >添 加</button>
                           <button type="button" class="btn btn-primary"  onclick="autoReport.resetMuluName()" >重 置</button> 
                    </div>
                    
              </div>
         </div>
      </div>

<!---------------------------------------------------------------------------->
        <div  class="modal" id="altermulu">
          <div class="modal-dialog" style="margin-top: 150px;width: 650px">   <!-- style="width: 900px;left: -50px" -->
              <div class="modal-content modalContent" >
                    <div class="modal-header modalTOP">
                        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true"><img src="../../static/reportManageSys/images/close.png"></span><span class="sr-only"></span></button>
                        <h4 class="modal-title">修改目录</h4>
                    </div>
                    <div class="modal-body" >
                           <span style="margin-left: 40px">输入目录名</span><span style="color: red">*</span><span>:</span>
                           <input id="altermuluName" type="text" style="width: 290px ;height: 34px; margin-right: 30px" />
                           <button type="button" class="btn btn-primary"   onclick="autoReport.alterMulus()" >修 改</button>
                           <button type="button" class="btn btn-primary"  onclick="autoReport.resetMuluName()" >重 置</button> 
                    </div>
                    
              </div>
         </div>
      </div>


<!---------------------------------------------------------------------------->
        <div  class="modal" id="updateReportName">
          <div class="modal-dialog" style="margin-top: 150px;width: 650px">   <!-- style="width: 900px;left: -50px" -->
              <div class="modal-content modalContent" >
                    <div class="modal-header modalTOP">
                        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true"><img src="../../static/reportManageSys/images/close.png"></span><span class="sr-only"></span></button>
                        <h4 class="modal-title">修改名称</h4>
                    </div>
                    <div class="modal-body" >
                           <span style="margin-left: 40px">输入报表名</span><span style="color: red">*</span><span>:</span>
                           <input id="updatereportname" type="text" style="width: 290px ;height: 34px; margin-right: 30px" />
                           <button type="button" class="btn btn-primary"   onclick="autoReport.updateReportNames()" >修 改</button>
                           <button type="button" class="btn btn-primary"  onclick="autoReport.resetMuluName()" >重 置</button> 
                    </div>
                    
              </div>
         </div>
      </div>
<!---------------------------------------------------------------------------->
        <div  class="modal" id="bindReport">
          <div class="modal-dialog" style="margin-top: 80px;width: 550px">   <!-- style="width: 900px;left: -50px" -->
              <div class="modal-content modalContent" >
                    <div class="modal-header modalTOP">
                        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true"><img src="../../static/reportManageSys/images/close.png"></span><span class="sr-only"></span></button>
                        <h4 class="modal-title">绑定报表</h4>
                    </div>
                    <div class="modal-body" >
                           <div id="modalTreeDiv" style="height: 300px;width: 100%;overflow: auto">
                                <ul id="modalTree" onselectstart="return false;" style="-moz-user-select:none;" ></ul>
                           </div>
                    </div>
                    <div class="modal-footer" style="text-align: left;padding:5px 15px 15px;position: relative;">
                            <div style="display: inline-block;position: relative;top: -15px;left: -30px;width: 200px;">
                                <span>
                                    <input id="alterToOldName" type="checkbox" /><span style="font-size: 12px;">是否使用原报表名称</span>
                                </span>
                            </div>
                            <div style="display: inline-block;padding-top: 10px">
                                <button type="button" class="btn btn-primary"   onclick="autoReport.bindReports()" >绑定</button>
                                <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                            </div>
                          
                    </div>
                    
              </div>
         </div>
      </div>




</body>
</html>