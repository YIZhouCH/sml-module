<%@ page contentType="text/html;charset=utf-8"%>
<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%String pid=request.getParameter("pid")==null?"1":request.getParameter("pid"); %>
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
<script src="${ctx}/scripts/reportManageSys/updateReport.js" type="text/javascript"></script>
<script src="${ctx}/scripts/reportManageSys/showLianxuTime.js" type="text/javascript"></script>
<script src="${ctx}/scripts/reportManageSys/componentSource.js" type="text/javascript"></script>

<link rel="stylesheet" type="text/css" href="${ctx}/static/reportManageSys/css/chosen.css" />
<link rel="stylesheet" type="text/css" href="${ctx}/static/reportManageSys/css/table.css" />
<script src="${ctx}/scripts/reportManageSys/chosen.jquery.js" type="text/javascript"></script>
<script src="${ctx}/scripts/reportManageSys/configUrl.js" type="text/javascript"></script>
  
 <!--引用背景图片--> 
<%@ include file="aBackGround.jsp" %>

 
  <script type="text/javascript">
  var pid=<%=pid%>
  var contextPath = "${ctx}";
	  	$(document).ready(function(){
	  	    var k = document.body.offsetWidth;
	  	    document.getElementById("cententDiv").style.width = k +"px";
	  	    document.getElementById("otherCondition").style.width = k +"px";
	  	    addReport.init();	
          $("#mymodal").modal("toggle");
          $(".chzn-select").chosen(); //select 搜索框功能
          $("#xialaType_chosen").css({
                                 'display': 'none',
                                 'margin-top': '-2px'
          });
          $("#xialaType_convergeCheckbox_chosen").css({
                                 'display': 'none',
                                 'margin-top': '-2px'
          });
          $("#xialaType_convergeCheckboxDetail_chosen").css({
                                 'display': 'none',
                                 'margin-top': '-2px'
          });
          $("#xialaType_comboCheckbox_chosen").css({
                                 'display': 'none',
                                 'margin-top': '-2px'
          });
          $("#mymodal").modal("hide");
        });
        /*function closetab(){
             parent.mainE.closetabs("新增报表");
        
        }*/

  </script>
  <style type="text/css">  
      #list_left span,#list_left .on,#list_right span,#list_right .on,.shiftCtrl_left span,.shiftCtrl_left .on,.shiftCtrl_right span,.shiftCtrl_right .on{  
          border: 0px solid #ddd;  
          margin: 2px;  
          cursor: pointer;
          display: block;  
      }  
      #list_left .on,#list_right .on,.shiftCtrl_left .on,.shiftCtrl_right .on{  
          border: 0px solid red;  
          background-color: #26a0da  
      }  
      .div-margin {
        margin: 20px auto 10px auto;
        width: 200px;
      }
      .button-margin {
         margin-left: 20px;
      }
  </style>   
</head>

   
<body style="overflow-x: hidden;">
       <div id="curr_id_div" style="display: none;"></div>
       <div id="updateReportId" style="display: none;"></div>
       <div id="updateReportName" style="display: none;"></div>  
	   <div style="height: 40px; padding: 5px">
		   <span>报表名称<span style="color: red">*</span>:</span>
		   <input id="reportName" type="text" style="width: 260px ;height: 34px;" />
           <span style="margin-left: 30px">数据源:<span style="color: red">*</span>:</span>
              <select id="dataPool" style="width: 260px ;height: 34px;">
              	      
              </select>
           
           <!-- <input type="button" class="btn btn-warning"  onclick="addReport.addDataPool();" value="新增数据源"  style="margin-left: 20px;padding:3px 14px;height:34px; color:#fff ; "/>  -->

		   <input type="button" class="btn btn-warning"  onclick="addReport.addModel();" value="编   辑"  style="margin-right: 20px;padding:3px 14px;height:34px; color:#fff ;float:right; "/>
	   </div>
        <!-- 模板内容 --> 
        <div id="cententDiv" style="border: 0px solid pink;position: absolute; ">
        	  <div style="border: 0px solid #e8e8e8 ; margin-top: 10px;">
        	          <!-- <div style="position: absolute;top: 0px;left: 15px;padding-right: 10px;padding-left: 10px;;background: #fff">时间</div> -->
		        	  
			        	      <div style="border: 1px solid #e8e8e8;padding: 10px 0 10px 0">
			        	  	      	<input type="radio" id="lisan" name="lianxuOrlisan" value="lisan" onchange="addReport.lianxuOrlisan(this.value)" /><span style="margin: 0 10px 0 5px">离散时间</span>
			        	  	      	<input type="radio" id="lianxu" name="lianxuOrlisan" value="lianxu"  onchange="addReport.lianxuOrlisan(this.value)" style="margin-left: 10px" /><span style="margin: 0 10px 0 5px">连续时间</span>
			        	  	      	<span style="margin-left: 30px;">时间粒度:</span>
                            <input type="checkbox" id="checkbox_min" name="timeType" value="min"  /><span id="labels_min" style="margin: 0 10px 0 5px" >5分钟</span>
                            <input type="checkbox" id="checkbox_15min" name="timeType" value="15min"  /><span id="labels_15min" style="margin: 0 10px 0 5px" >15分钟</span>
			        	  	      	<input type="checkbox" id="checkbox_30min" name="timeType" value="30min"  /><span id="labels_30min" style="margin: 0 10px 0 5px" >30分钟</span>
			        	  	      	<input type="checkbox" id="checkbox_hour" name="timeType" value="hour"  /><span id="labels_hour" style="margin: 0 10px 0 5px" >小时</span>
			        	  	      	<input type="checkbox" id="checkbox_day" name="timeType" value="day"  /><span id="labels_day" style="margin: 0 10px 0 5px" >天</span>
			        	  	      	<input type="checkbox" id="checkbox_week" name="timeType" value="week" /><span id="labels_week" style="margin: 0 10px 0 5px" >周</span>
			        	  	      	<input type="checkbox" id="checkbox_month" name="timeType" value="month" /><span id="labels_month" style="margin: 0 10px 0 5px" >月</span>
                            <input type="checkbox" id="checkbox_timeSelect" name="timeType" value="checkbox_timeSelect"  /><span id="labels_timeSelect" style="margin: 0 10px 0 5px" >隐藏</span>
	                          </div>
	                          <div >
			        	  	      	<div id="lianxuDiv" style="display: none; margin-top: 10px ">
			        	  	      		  <div id="time"></div>
			        	  	      	</div>
			        	  	      	<div id="lisanDiv" style="margin-top: 10px ; height: 280px">
			        	  	      		  <iframe src="lisanTime.jsp" style="width: 100%; height: 100% ; border: 0px" ></iframe>
			        	  	      	</div> 
	        	  	      	  </div>
        	  </div>
        	  <div id="otherConWai" style="border: 1px solid #e8e8e8 ; margin-top: 20px;padding: 20px 20px; position: relative; /*display: none;*/">
        	          <!-- <div style="position: absolute;top: -10px;left: 15px;padding-right: 10px;padding-left: 10px;;background: #fff">其他条件</div> -->
        	          <div id="otherCondition" style="border: 0px solid pink ; ">
        	          	    <!--<table>
        	          	    	  <tr style="height: 50px">
        	          	    	  	  
        	          	    	  	  <td width="500px">
                                      </td>
        	          	    	  </tr>
        	          	    </table>-->
        	          </div>
        	  </div>

    	  	  <div id="sqlInfo" style="border: 1px solid #e8e8e8 ; margin-top: 20px;padding: 20px 20px; position: relative;">
    	  	          <div style="position: absolute;top: -10px;left: 15px;padding-right: 10px;padding-left: 10px;;background: #fff">SQL编辑区</div>
    	  	          <div id="otherConditions" style="border: 0px solid pink ; ">
    	  	                 <div id="zujianSelect" style="border: 0px solid pink; padding:10px 10px 10px 0px ; display: none;">
                     
    	  	                 </div>
    	  	          	     <div style="width: 100%;height: auto ;">
    	  	          	          <textarea id="sqlContent"  rows="36" style="width: 100%"></textarea>
    	  	          	     </div>
    	  	          </div>
    	    	        
    	  
    	  	  </div>
    	  	  <div id="baocunDiv" style="border: 0px solid #e8e8e8 ; margin-top: 20px; position: relative;  ">
                <center>
                <input style="float: left" id="indexInfoClear" type="checkbox" /><span style="float: left">清空列属性</span>
    	  	      <input type="button" class="btn btn-primary"  onclick="addReport.preview()" value="预  览"  style="margin-right: 20px;padding:3px 14px;height:34px; color:#fff ; "/> 
    	  	      <input type="button" class="btn btn-success"  onclick="addReport.save()" value="保  存"  style="margin-right: 20px;padding:3px 14px;height:34px; color:#fff ;"/> 
    	  	      <input type="button" class="btn btn-warning"  onclick="addReport.publishReport()" value="发  布"  style="margin-right: 20px;padding:3px 14px;height:34px; color:#fff ; "/> 
                  </center>

    	  	  </div>


        	
        </div>

          

<!--新增组件-------------------------------------------------------------------------->
	       <div  class="modal" id="mymodal">
		      <div class="modal-dialog" style="width: 650px;">   <!-- style="width: 900px;left: -50px" -->
		          <div class="modal-content modalContent" >
		                <div class="modal-header modalTOP">
				            <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
				            <h4 class="modal-title">请选择</h4>
		                </div>
				        <div class="modal-body" id="modal-body" >
				             <div style="margin-bottom: 20px">

				                <span >组件类型:</span>
			                    <select id="zujianType" style="height: 34px;width: " onchange="addReport.xialaChange(this.value)">
			                  	     <option value="shurukuang">输入框</option>
			                  	     <option value="xialakuang">下拉框</option>
			                  	     <option value="fuxuankuang">复选框</option>
                               <!-- <option value="leftrightkuang">左右选择</option>  -->
                               <!-- <option value="leftrightliangdong">左右联动</option> -->
                               <!-- <option value="demoselect">模板选择</option>   -->
                               <option value="convergeCheckbox">汇聚复选</option>
                               <option value="convergeCheckboxDetail">汇聚复选详细</option>
                               <option value="demoselectNew">模板选择</option>
                               <option value="conditionToDevice">条件选设备</option>
                               <option value="conditionToPort">条件选端口</option>
                               <option value="indexWarning">指标预警</option>
                               <option value="busyTimeParagraph">忙时时间段</option>
                               <option value="cellList">小区LAC-CI列表</option>
                               <option value="comboCheckbox">组合复选框</option>
			                    </select>

				                <span id="labelName" style="display:inline-block;width:65px;margin-left:20px">label名称:</span>
				                <input type="text" id="zujianLabel" style="height: 34px;width: 130px;margin-right: 15px;"  />

                          <!-- <select id="xialaType" class="chzn-select" data-placeholder="---请选择---" style="width:100px;display: none;margin-left: 10px;height: 34px;"> -->
			                    <select id="xialaType" class="chzn-select" data-placeholder="---请选择---" style="width:100px">
			                  	     <!-- <option  value="chooseCity">地市</option> -->
			                    </select>
                          <select id="xialaType_convergeCheckbox" class="chzn-select" data-placeholder="---请选择---" style="width:100px">
                               <!-- <option  value="chooseCity">地市</option> -->
                          </select>
                          <select id="xialaType_convergeCheckboxDetail" class="chzn-select" data-placeholder="---请选择---" style="width:100px">
                               <!-- <option  value="chooseCity">地市</option> -->
                          </select>
                          <select id="xialaType_comboCheckbox" class="chzn-select" data-placeholder="---请选择---" style="width:100px">
                               <!-- <option  value="chooseCity">地市</option> -->
                          </select>
                          <a href="JavaScript:void(0)" onclick="addReport.addZujian()" ><img style="width: 34px; height: 34px ;margin-left: 20px;" src="../../static/reportManageSys/images/plus.png"></a> 

                    </div>   
                                

				               <div id="addDiv" style="height: 260px;overflow: auto;">

				              	    <input id="ad" type="hidden">
				               </div>           
				        </div>
				        <div class="modal-footer modalFoot">
				          <button type="button" class="btn btn-primary"  data-dismiss="modal" onclick="addReport.addElement()" >添加</button>
				        </div>
		          </div>
		     </div>
	     </div>

       <!---------------------------------------------------------------------------->
          <div  class="modal" id="showDetailInfo">
            <div class="modal-dialog" style="margin-top: 50px">   <!-- style="width: 900px;left: -50px" -->
                <div class="modal-content modalContent" >
                      <div class="modal-header modalTOP">
                          <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true"><img src="../../static/reportManageSys/images/close.png"></span><span class="sr-only"></span></button>
                          <h4 class="modal-title">详细信息</h4>
                      </div>
                      <div class="modal-body" id="modal-body" >
                           <div style="height: 300px;overflow: auto;">
                               <div style="padding: 5px;margin:0 10px 0 0;border: 1px solid #e8e8e8">
                                    <table style="margin-left: 10px">
                                        <tr style="height: 40px">
                                            <td width="70px">模板名称<span style="color: red">*</span>:</td>
                                            <td style="padding-right: 20px"><input id="demo_name" type="text" readonly="readonly"  /></td>
                                            <td width="70px">备注:</td>
                                            <td style="padding-right: 20px"><input id="demo_remark" type="text" readonly="readonly"  /></td>
                                        </tr>
                                        <tr style="height: 40px">
                                            <td width="70px">带宽(M):</td>
                                            <td colspan="3" style="padding-right: 20px"><input id="demo_bandWidth" type="text" readonly="readonly"  /></td>
                                        </tr>
                                    </table>
                               </div>
                               <div style="padding: 5px;margin:8px 10px 0 0;border: 1px solid #e8e8e8;min-height: 200px;">
                                   <ul id="tree_left"></ul>
                               </div>
                           </div>    
                      </div>
                      <div class="modal-footer modalFoot">
                        <center>
                        <!-- <button type="button" class="btn btn-primary"   onclick="mainE.addReportName()" >添 加</button> -->
                        <button type="button" class="btn btn-default" data-dismiss="modal">关 闭</button>
                        </center>
                      </div>
                      
                </div>
           </div>
        </div> 
                  
	     	    <!-- --组合查询--- -->
              <div  class="modal" id="customWinWX">
                <div class="modal-dialog">   <!-- style="width: 900px;left: -50px" -->
                    <div class="modal-content modalContent" >
                          <div class="modal-header modalTOP">
                              <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true"><img src="../../static/reportManageSys/images/close.png" id="flowWinCloseWX"></span><span class="sr-only"></span></button>
                              <h4 class="modal-title">组合查询</h4>
                          </div>
                          <div class="modal-body" id="modal-body" >
                                  <div id="contentWX"></div>
                          </div>
                          <div class="modal-footer modalFoot">
                            <center>
                            <button type="button" id="savecreateWinLogWX" class="btn btn-default" data-dismiss="modal">保 存</button>
                            </center>
                          </div>
                    </div>
               </div>
            </div> 
            <!-- 组合查询 -->


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
                                                   <td style="padding-right: 10px"><input id="descr_seek" type="text"  disabled="disabled" /></td>
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