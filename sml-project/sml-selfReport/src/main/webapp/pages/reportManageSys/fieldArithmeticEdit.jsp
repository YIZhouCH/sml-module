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

<!--自己的js-->
<script src="${ctx}/scripts/reportManageSys/jquery.json-2.4.min.js" type="text/javascript"></script>
<script src="${ctx}/scripts/reportManageSys/commonAjax.js" type="text/javascript"></script>
<script src="${ctx}/scripts/reportManageSys/fieldArithmeticEdit.js" type="text/javascript"></script>
<script src="${ctx}/scripts/reportManageSys/configUrl.js" type="text/javascript"></script>

<!--引用背景图片--> 
<%@ include file="aBackGround.jsp" %>



 <script type="text/javascript">
    $(document).ready(function(){
           $("#field_div").height($("#container_down").height()*0.97); 
           $("#fieldInfo_div").height($("#container_down").height()*0.97); 
           fieldArithmeticEdit.init();
    });
</script>

</head>

   
<body >
<div id="onclickId" style="display: none"></div>
<div id="onclickName" style="display: none"></div>
   <div class="easyui-layout" style="width: 100%;height: 730px">
    <div data-options="region:'west',split:true,title:'报表列表'" style="width:300px;padding:1%;">
           <ul id="tree" onselectstart="return false;" style="-moz-user-select:none;" ></ul>
    </div>

    <div id="mainPanle" region="center" style="padding:10px; background:white;overflow-y: hidden;">
          <div id="container_up" class="container" style="width:98%;height: 200px;margin-bottom: 10px;border: 1px solid pink">
                  <div class="row">
                        <div class="col-md-3">
                            报表id:
                        </div>
                        <div class="col-md-9">
                            <input type="text" style="width: 100%" /> 
                        </div>
                  </div>
          </div> 
          <div id="container_down" class="container"style="padding: 10px 15px;width:98%;height: 490px;border: 1px solid pink">
                  <div class="row">
                        <div id="field_div" class="col-md-3" style="border: 1px solid #e8e8e8">
                             
                        </div>
                        <div id="fieldInfo_div" class="col-md-9" style="border: 1px solid #e8e8e8">
                              <div style="border: 0px solid #234afe;font-size: 18px; height: 24px;">算法公式:</div> 
                              <div style="border: 0px solid #234afe;margin: 10px 0;">
                                  <input type="text" style="width: 100%" />
                              </div>
                              <div style="border: 0px solid #234afe;font-size: 18px; height: 24px;">所需表名:</div> 
                              <div style="border: 0px solid #234afe;margin: 10px 0;">
                                  <input type="text" style="width: 100%" />
                              </div>
                              <div style="border: 0px solid #234afe;font-size: 18px; height: 24px;">所需字段:</div> 
                              <div style="border: 0px solid #234afe;margin: 10px 0;">
                                  <input type="text" style="width: 100%" />
                              </div>

                        </div>
                  </div>
          </div> 
    </div>

     <!---------------------------------------------------------------------------->
        <div  class="modal" id="mymodal">
          <div class="modal-dialog" style="margin-top: 150px">   <!-- style="width: 900px;left: -50px" -->
              <div class="modal-content modalContent" >
                    <div class="modal-header modalTOP">
                        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true"><img src="../../static/reportManageSys/images/close.png"></span><span class="sr-only"></span></button>
                        <h4 class="modal-title">新建目录</h4>
                    </div>
                    <div class="modal-body" id="modal-body" >
                           <span style="margin-left: 40px">输入目录名</span><span style="color: red">*</span><span>:</span>
                           <input id="muluName" type="text" style="width: 260px ;height: 34px; margin-right: 30px" />
                           <button type="button" class="btn btn-primary"   onclick="mainE.addMuluName()" >添 加</button>
                           <button type="button" class="btn btn-primary"  onclick="mainE.resetMuluName()" >重 置</button> 

                    </div>
                    
              </div>
         </div>
        </div>
   </div> 
</body>
</html>