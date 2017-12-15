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
<link rel="stylesheet" type="text/css" href="themes/bootstrap/easyui_config.css" />
<link rel="stylesheet" type="text/css" href="themes/icon.css" />
<link href="easyui/style/css/statisticalforms.css" rel="stylesheet" type="text/css" />

<!--自己的js-->
<script src="${ctx}/scripts/reportManageSys/jquery.json-2.4.min.js" type="text/javascript"></script>
<script src="${ctx}/scripts/reportManageSys/commonAjax.js" type="text/javascript"></script>
<script src="${ctx}/scripts/reportManageSys/demoConfig.js" type="text/javascript"></script>
<script src="${ctx}/scripts/reportManageSys/configUrl.js" type="text/javascript"></script>

<!--引用背景图片--> 
<%@ include file="aBackGround.jsp" %>



<script type="text/javascript">
   var currUserName="<%=currUserName%>";
	$(document).ready(function(){
     initCookie();
		 demoConfig.init(); 
		 
	});
	
</script>
<style>
  .tree-node {
    height: 25px;
  }
</style>

</head>
<body style="background-color: #ffffff;">
<div id="currDemoId" style="display: none"></div>
        <div class="container-fluid" style="margin-left:10px">
                <div class="row">
                        <div  class="col-sm-12" style="padding:0;">
                        <h5>查询条件</h5>
                             <div style="padding: 10px;margin:8px 10px 0 0;border: 1px solid #e8e8e8">
                                 <!--  <h5>查询条件</h5> -->
                                  <table style="margin: 10px">
                                      <tr style="height: 40px">
                                          <td width="120px">设备名称或别名:</td>
                                          <td style="padding-right: 20px"><input id="device_name" type="text"  /></td>
                                          <!-- <td width="80px">设备机房:</td>
                                          <td style="padding-right: 20px"><input id="device_machineRoom" type="text"  /></td> -->
                                          <td width="80px">设备IP地址:</td>
                                          <td style="padding-right: 20px"><input id="device_ipAdress" type="text"  /></td>
                                          <td width="110px">业务系统:</td>
                                          <td><input id="business_system" type="text"  /></td>
                                      </tr>
                                      <tr style="height: 40px">
                                          <td width="160px">端口名称或别名或描述:</td>
                                          <td style="padding-right: 20px"><input id="port_cname" type="text"  /></td>
                                          <td>端口IP地址:</td>
                                          <td style="padding-right: 20px"><input id="port_ipAdress" type="text"  /></td>
                                          <td>类型<span style="color: red">*</span>:</td>
                                          <td >
                                               <select id="port_type" style="width: 100%" onchange = "demoConfig.alterTitle()">
                                                    <!-- <option value="">---请选择---</option> -->
                                                    <option value="duankou">端口</option>
                                                    <option value="shebei">设备</option>
                                               </select>
                                          </td>
                                          <td colspan="2" style="padding-left: 20px">
                                               <button id="domoQueryConfig" type="button" class="btn btn-primary" onclick="demoConfig.doQuery()">查询</button>
                                               <!-- <button type="button" class="btn btn-primary" onclick="demoConfig.doClear()" style="margin-left: 20px">重置</button> -->
                                          </td>
                                      </tr>
                                  </table>
                             </div>
                        </div>
                </div>
                <div class="row">
                        <div  class="col-sm-9" style="padding:0;">
                            <div style="padding-top: 10px;margin:8px 10px 0 0;/* border: 1px solid #e8e8e8;*/" >
                                      <div style="width: 200px;margin-bottom: 6px;">
                                        <h5 id ="left_title">&nbsp;待选择端口列表</h5>
                                      </div>
                                      <div style="float: left; border :1px solid #e8e8e8 ;height: 380px;width: 44%;padding: 10px 0">
                                           <!-- <h5>&nbsp;待选择设备端口</h5> -->
                                           <div id="tree_left_div" style="margin-top:5px;padding: 5px 0;overflow: auto;height: 340px">
                                               <ul id="tree_left"></ul>
                                           </div>
                                      </div>
                                      <div style="float: left; border :0px solid #e8e8e8 ;height: 380px;width: 100px;padding: 140px 0 0 2.5%;">
                                            <button type="button" class="btn btn-success" onclick="demoConfig.addRightMove()">右移</button><br/><br/>
                                            <button type="button" class="btn btn-success" onclick="demoConfig.delRightMove()">删除</button>
                                      </div>
                                      
                                      <div style="float: left;width: 42%;">
                                          <h5 id ="right_title" style="margin-top:-21px;">&nbsp;已选择端口列表</h5>
                                          <span style="float: right;margin-top: -20px;">
                                              <a href="javascript:demoConfig.clearRightTree_larji()"><i class="fa fa-trash-o ecom_icons ecom_icons2" onclick="" title="清空"></i></a>
                                          </span>
                                      </div>
                                      <div style="float: left; border :1px solid #e8e8e8 ;height: 380px;width: 44%;padding: 10px 0">
                                           <div id="tree_right_div" style="margin-top:5px;padding: 5px 0;overflow: auto;height: 340px">
                                               <ul id="tree_right"></ul>
                                           </div>
                                      </div>
                                <div style="clear: both"></div>  
                            </div>
                        </div>
                        <div  class="col-sm-3" style="padding:0;">
                            <div style="padding-top: 10px;margin:8px 10px 0 0;/* border: 1px solid #e8e8e8; */">
                                  <h5>模板列表</h5>
                                  <div id="div_i" onclick="demoConfig.clearAllSelect()" style="overflow: auto;margin-top: 5px;float: left; border :1px solid #e8e8e8 ;height: 380px;width: 100%;padding: 10px">
                                       <!-- <div id="div_1" name="demo_name_div" ondblclick="demoConfig.reShow(this)" onmouseover="demoConfig.addBackground(this)" onmouseout="demoConfig.delBackground(this)" onselectstart="return false;" style="-moz-user-select:none; background:#E6F1F2 ; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; height: 30px;margin-right: 20px;padding: 4px;margin-bottom: 5px;">
                                           <span style="display: inline-block; width: 10%">1.</span>
                                           <span style="display: inline-block; width: 90%">第一张模板</span>
                                       </div> -->
                                  </div> 
                                <div style="clear: both"></div>  
                            </div>
                        </div>
                </div>
                <div class="row">
                        <div  class="col-sm-12" style="padding:0;">
                             <div style="padding: 10px;margin:8px 10px 0 0;border: 1px solid #e8e8e8">
                                  <table style="margin-left: 10px">
                                      <tr style="height: 40px">
                                          <td width="70px">模板名称<span style="color: red">*</span>:</td>
                                          <td style="padding-right: 20px"><input id="tpl_name" type="text"  /></td>
                                          <td width="70px">备注:</td>
                                          <td style="padding-right: 20px"><input id="comment" type="text" style="width:500px;" /></td>
                                          <!-- <td width="70px">带宽(M):</td>
                                          <td style="padding-right: 20px"><input id="descr" type="text"  /></td> -->
                                          <td>
                                              <button type="button" class="btn btn-primary" onclick="demoConfig.save()">保存</button>
                                              <button type="button" class="btn btn-default"  style="margin-left: 20px">取消</button>
                                          </td>
                                      </tr>
                                  </table>
                             </div>
                        </div>
                </div>
        </div>

</body>
</html>