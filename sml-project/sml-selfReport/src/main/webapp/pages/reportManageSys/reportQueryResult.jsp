<%@ page contentType="text/html;charset=utf-8"%>
<%String fromWhere=request.getParameter("fromWhere")==null?"1":request.getParameter("fromWhere"); %>
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
<!-- <script src="${ctx}/scripts/reportManageSys/jscolor.min.js" type="text/javascript"></script> -->
<script src="${ctx}/scripts/reportManageSys/reportQueryResult.js" type="text/javascript"></script>
<script src="${ctx}/scripts/reportManageSys/reportQueryEcharts.js" type="text/javascript"></script>
<script src="${ctx}/scripts/reportManageSys/ToExcelOrCSV.js" type="text/javascript"></script>
<script src="${ctx}/scripts/reportManageSys/configUrl.js" type="text/javascript"></script>
 <!--引用背景图片--> 
<%@ include file="aBackGround.jsp" %>
  
<script type="text/javascript">
  var fromWhere="<%=fromWhere%>"
     var kk = "";
	  	$(document).ready(function(){
             var k = document.documentElement.clientHeight;
             var px = k-35;
             kk = px;
             //是否在查询界面显示配置超链接图标
             if (fromWhere == "mainE") {
               $("#configHyperLink_a").css('display', 'inline-block');
             };
             reportQueryResult.init();
         
        });
  </script>
  <style>     
    .mouseOver{
             background-color:#DFD;
             }
    .ui-jqgrid .ui-jqgrid-bdiv {    
             overflow-y: scroll;
    }         
  </style>  
</head>

   
<body style="overflow-x: hidden;">
  <div id="cententDiv" style="margin-left:10px">
   		<div id="echartsDiv" style="display: none;">
					<div class="line7890" style="padding: 0 5px 2px 0;">                       
						<h5 class="fl" style="margin: 6px 0;font-size: 20px;font-weight: bold; display: inline-block;">
							<i class="fa fa-line-chart ecom_icons ecom_icons2"></i>
				  		<span id="echartsTitle" style="color: #5d5d5d;font-size: 14px;">报表趋势图</span>
						</h5>
						<span style="float: right;padding-top: 8px;">  
				      <a href="javascript:void(0)" class="function-icon">
				        <i class="fa fa-search cursor analyData" title="配置维度条件" onclick="reportEcharts.setEchartsFields();" ></i>
				      </a>
    				</span>
    				<div class="clear"></div>
					</div>
					<div id="reportEcharts" style="width:100%; height:380px;border:1px solid #E8E8E8;margin-bottom: 5px;">
						<div style='width: 100%;height: 100%;text-align:center;position:relative;top:50%;'>
							<font size='3'>no data to display</font>
						</div>
					</div>
   		</div>
      <div class="line7890" style="padding: 0 5px 2px 0;">                       
	        <h5  class="fl" style="margin: 6px 0;font-size: 20px;font-weight: bold; display: inline-block;">
		        	<i class="fa fa-th-list ecom_icons ecom_icons2"></i>
		          <span id="Gridtitle" style="color: #5d5d5d;font-size: 14px;">报表查询结果</span>
	        </h5>
        	<span style="float: right;padding-top: 8px;">  
              <a id="echarts_show_icon" href="javascript:void(0)" class="function-icon" style="display: none;">
                 <i class="fa fa-chevron-down cursor" title="显示趋势图" onclick="reportEcharts.showEchartsDiv();"></i>
              </a>
              <a id="echarts_hide_icon" href="javascript:void(0)" class="function-icon" style="display: none;">
                 <i class="fa fa-chevron-up cursor" title="隐藏趋势图" onclick="reportEcharts.hideEchartsDiv();" ></i>
              </a>
              <a id="configHyperLink_qingchu" href="javascript:void(0)" class="function-icon" style="display: none;">
                 <i class="fa fa-eraser cursor analyData" title="清除过滤条件" onclick="reportQueryResult.clearDataFilter();" ></i>
              </a>
              <a id="configHyperLink_shujuguolv" href="javascript:void(0)" class="function-icon" style="display: none;">
                 <i class="fa fa-filter cursor analyData" title="数据过滤" onclick="reportQueryResult.dataFilter();" ></i>
              </a>
              <a id="configHyperLink_a" href="javascript:void(0)" class="function-icon" style="display: none;">
                 <i class="fa fa-link cursor analyData" title="列超链接配置" onclick="reportQueryResult.configHyperLinkHeadModal_load();" ></i>
              </a>
              <a href="javascript:void(0)" class="function-icon" style="display: inline-block;">
                 <i class="fa fa-sliders cursor analyData" title="列显示/隐藏/排序" onclick="reportQueryResult.showOrhideAndSort();" ></i>
              </a>
              <a href="javascript:void(0)" class="function-icon" style="display: inline-block;">
                 <i class="fa fa-th-list cursor analyData" title="字段算法说明" onclick="reportQueryResult.seekFieldArith();" ></i>
              </a>
              <a href="javascript:void(0)" class="function-icon" style="display: inline-block;">
                 <i class="fa fa-exchange cursor" title="保存列宽" onclick="reportQueryResult.saveColumnWidth();" ></i>
              </a>
              <a href="javascript:void(0)" class="function-icon" style="display: inline-block;">
                 <i class="fa fa-info-circle cursor" title="列阀值渲染" onclick="reportQueryResult.addColor();" ></i>
              </a>
              <a href="javascript:void(0)" class="function-icon" style="display: inline-block;">
                 <i class="fa fa-file-excel-o cursor" title="导出表格" onclick="reportQueryResult.exportExcel();" onmouseover="reportQueryResult.orShow()" ></i>
              </a>
              <div id="download_div" onmouseover="reportQueryResult.orShow()" onmouseout="reportQueryResult.orHidden()" style="z-index: 100;border: 0px solid pink ; width: 105px;height: 80px; position: absolute;right: 0px;top:10px;text-align: center;display: none; ">
                  <!-- <div style="border: 1px solid #e8e8e8;top:20px;background: #fcfcfc;position:relative;">    
                    <a href="javascript:void(0)" onclick="reportQueryResult.exportExcel('xls');" title="建议小于5W">XLS导出</a>
                    <br/>
                    <a href="javascript:void(0)" onclick="reportQueryResult.exportExcel('csv');" title="建议大于5W">CSV导出</a>
                  </div> -->
                  <div style="border: 1px solid #e8e8e8;top:20px;background: #fcfcfc;position:relative;border-radius: 8px;padding: 5px;">    
                    <a href="javascript:void(0)" onclick="reportQueryResult.exportExcel('xls');" title="建议小于5W">
                        <img style="width: 40px;height: 40px;" src="../../static/reportManageSys/images/XLS.png" />
                    </a>
                    
                    <a href="javascript:void(0)" onclick="reportQueryResult.exportExcel('csv');" title="建议大于5W">
                        <img style="width: 40px;height: 40px;" src="../../static/reportManageSys/images/CSV.png" >
                    </a>
                  </div>
              </div>
        	</span>
        	<div class="clear"></div>
      </div>
	    <div id="con_list" class="con_list line7890" style="border:1px solid #e8e8e8; padding: 0px">
	        <div class="con_chart" style="position: relative;" >
	            <div id="whiteDiv" style="position: absolute;width: 17px;background-color: white;z-index: 99;top: 41px;border-left: 1px solid #eee;right:12px "></div> 
	            <div id="con_grid_div" class="line7890" style="border: 1px solid #e7e7e7">
	                <table id="con_grid_div_grid"></table>
	                <div id="con_grid_div_gridPager"></div>
	            </div>
	            <div class="clear"></div>
	        </div>
	    </div>

  </div>       

    <!--着色弹框-------------------------------------------------------------------------->
       <div  class="modal" id="addColor">
         <div class="modal-dialog">   <!-- style="width: 900px;left: -50px" -->
             <div class="modal-content modalContent" >
                   <div class="modal-header modalTOP">
                       <button type="button"  class="close" data-dismiss="modal"><span aria-hidden="true"><img src="../../static/reportManageSys/images/close.png"></span><span class="sr-only"></span></button>
                       <h4 class="modal-title">指标着色</h4>
                   </div>
                   <div class="modal-body" id="modal-body" >
                        <div id="content" style="overflow: auto;height:260px">
                              
                        </div>
                   </div>
                   <div class="modal-footer modalFoot">
                     <center>
                     <button type="button" class="btn btn-primary"   onclick="reportQueryResult.addColors()" >保  存</button>
                     <button type="button" class="btn btn-default" data-dismiss="modal">关 闭</button>
                     </center>
                   </div>
             </div>
        </div>
     </div>  



     <!--着色弹框,颜色模板-------------------------------------------------------------------------->
        <div  class="modal" id="addColorDemo">
          <div class="modal-dialog">   <!-- style="width: 900px;left: -50px" -->
              <div class="modal-content modalContent" >
                    <div class="modal-header modalTOP">
                        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true"><img src="../../static/reportManageSys/images/close.png"></span><span class="sr-only"></span></button>
                        <h4 class="modal-title">着色模板表</h4>
                    </div>
                    <div class="modal-body" id="modal-body" >
                         <div style="height: 50px">
                             <span style="display: inline-block;border: 1px solid #e8e8e8;border-radius: 4px;height: 37px;margin-right: 10px">
                               <input placeholder="模板名称...." id="demoName_mohu" style="width: 260px;border: none;height: 34px;padding: 2px 5px" onkeypress="if(event.keyCode==13){reportQueryResult.demoQuery();}" />
                               <img style="cursor: pointer;" height="30px" width="30px" src="../../static/reportManageSys/images/fangdajing.png" onclick="reportQueryResult.demoQuery()">
                             </span>
                         </div>
                         <div id="content_demo" style="overflow: auto;height:210px">
                                <div id="con_list_d" class="con_list" style="border:1px solid #e8e8e8; padding: 0px">
                                    <div class="con_chart" >
                                        <div id="con_grid_div_d" style="border: 1px solid #e7e7e7">
                                            <table id="con_grid_div_grid_d"></table>
                                            <div id="con_grid_div_gridPager"></div>
                                        </div>
                                        <div class="clear"></div>
                                    </div>
                                </div>
                         </div>
                    </div>
                    <div class="modal-footer modalFoot">
                      <center>
                      <button type="button" class="btn btn-primary"   onclick="reportQueryResult.addColorDemos()" >保  存</button>
                      <button type="button" class="btn btn-default" data-dismiss="modal">关 闭</button>
                      </center>
                    </div>
              </div>
         </div>
      </div> 

      <!--着色弹框,颜色模板 模板详情-------------------------------------------------------------------------->
         <div  class="modal" id="addColorDemoDetail_qujian">
           <div class="modal-dialog">   <!-- style="width: 900px;left: -50px" -->
               <div class="modal-content modalContent" >
                     <div class="modal-header modalTOP">
                         <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true"><img src="../../static/reportManageSys/images/close.png"></span><span class="sr-only"></span></button>
                         <h4 class="modal-title">区间着色模板详情</h4>
                     </div>
                     <div class="modal-body" id="modal-body" >
                          <div id="content_demoDetail_qujian" style="overflow: auto;height:260px">
                                  <table>
                                      <tr style="height: 40px">
                                          <td>模板名称<span style="color: red">*</span>:</td>
                                          <td><input id="colorDemoId_qujian" type="text" style="width: 496px"readonly="readonly" /></td>
                                      </tr>
                                      <tr >
                                          <td>区间值表:<span style="color: red">*</span>:</td>
                                          <td>
                                                 <div id="addDiv_qujian" style="max-height: 260px;overflow: auto;padding-top: 4px;">
                                                     <div sf="1" style="height: 40px">
                                                        <span>
                                                        <input type="text" name="a"  style="width: 142px" readonly="readonly" />
                                                        <span>
                                                            <span style="font-size: 15px"><=</span>
                                                            <span style="font-size: 15px;margin: 0 10px;">一级告警</span>
                                                            <span style="font-size: 15px"><</span>
                                                        </span> 
                                                        <input type="text" name="a"   style="width: 142px" readonly="readonly" /> 
                                                        <input type="text"  class="jscolor" style="width:60px;margin-left: 8px " readonly="readonly"  >
                                                        </span>
                                                     </div>
                                                     <div sf="0" style="height: 40px;display: none">
                                                        <span>
                                                        <input type="text" name="a"  style="width: 142px" readonly="readonly" />
                                                        <span>
                                                            <span style="font-size: 15px"><=</span>
                                                            <span style="font-size: 15px;margin: 0 10px;">二级告警</span>
                                                            <span style="font-size: 15px"><</span>
                                                        </span>  
                                                        <input type="text" name="a"   style="width: 142px" readonly="readonly" /> 
                                                        <input type="text"  class="jscolor" style="width:60px;margin-left: 8px " readonly="readonly"  >
                                                        </span>
                                                     </div>
                                                     <div sf="0" style="height: 40px;display: none">
                                                        <span>
                                                        <input type="text" name="a"  style="width: 142px" readonly="readonly" />
                                                        <span>
                                                            <span style="font-size: 15px"><=</span>
                                                            <span style="font-size: 15px;margin: 0 10px;">三级告警</span>
                                                            <span style="font-size: 15px"><</span>
                                                        </span>  
                                                        <input type="text" name="a"   style="width: 142px" readonly="readonly" /> 
                                                        <input type="text"  class="jscolor" style="width:60px;margin-left: 8px " readonly="readonly"  >
                                                        </span>
                                                     </div>
                                                     <div sf="0" style="height: 40px;display: none">
                                                        <span>
                                                        <input type="text" name="a"  style="width: 142px" readonly="readonly" />
                                                        <span>
                                                            <span style="font-size: 15px"><=</span>
                                                            <span style="font-size: 15px;margin: 0 10px;">四级告警</span>
                                                            <span style="font-size: 15px"><</span>
                                                        </span>  
                                                        <input type="text" name="a"   style="width: 142px" readonly="readonly" /> 
                                                        <input type="text"  class="jscolor" style="width:60px;margin-left: 8px " readonly="readonly"  >
                                                        </span>
                                                     </div>
                                                     <div sf="0" style="height: 40px;display: none">
                                                        <span>
                                                        <input type="text" name="a"  style="width: 142px" readonly="readonly" />
                                                        <span>
                                                            <span style="font-size: 15px"><=</span>
                                                            <span style="font-size: 15px;margin: 0 10px;">五级告警</span>
                                                            <span style="font-size: 15px"><</span>
                                                        </span>  
                                                        <input type="text" name="a"   style="width: 142px" readonly="readonly" /> 
                                                        <input type="text"  class="jscolor" style="width:60px;margin-left: 8px " readonly="readonly"  >
                                                        </span>
                                                     </div>
                                                     <div sf="0" style="height: 40px;display: none">
                                                        <span>
                                                        <input type="text" name="a"  style="width: 142px" readonly="readonly" />
                                                        <span>
                                                            <span style="font-size: 15px"><=</span>
                                                            <span style="font-size: 15px;margin: 0 10px;">六级告警</span>
                                                            <span style="font-size: 15px"><</span>
                                                        </span>  
                                                        <input type="text" name="a"   style="width: 142px" readonly="readonly" /> 
                                                        <input type="text"  class="jscolor" style="width:60px;margin-left: 8px " readonly="readonly"  >
                                                        </span>
                                                     </div>
                                                     <div sf="0" style="height: 40px;display: none">
                                                        <span>
                                                        <input type="text" name="a"  style="width: 142px" readonly="readonly" />
                                                        <span>
                                                            <span style="font-size: 15px"><=</span>
                                                            <span style="font-size: 15px;margin: 0 10px;">七级告警</span>
                                                            <span style="font-size: 15px"><</span>
                                                        </span>  
                                                        <input type="text" name="a"   style="width: 142px" readonly="readonly" /> 
                                                        <input type="text"  class="jscolor" style="width:60px;margin-left: 8px " readonly="readonly"  >
                                                        </span>
                                                     </div>
                                                     <div sf="0" style="height: 40px;display: none">
                                                        <span>
                                                        <input type="text" name="a"  style="width: 142px" readonly="readonly" />
                                                        <span>
                                                            <span style="font-size: 15px"><=</span>
                                                            <span style="font-size: 15px;margin: 0 10px;">八级告警</span>
                                                            <span style="font-size: 15px"><</span>
                                                        </span>  
                                                        <input type="text" name="a"   style="width: 142px" readonly="readonly" /> 
                                                        <input type="text"  class="jscolor" style="width:60px;margin-left: 8px " readonly="readonly"  >
                                                        </span>
                                                     </div>
                                                     <div sf="0" style="height: 40px;display: none">
                                                        <span>
                                                        <input type="text" name="a"  style="width: 142px" readonly="readonly" />
                                                        <span>
                                                            <span style="font-size: 15px"><=</span>
                                                            <span style="font-size: 15px;margin: 0 10px;">九级告警</span>
                                                            <span style="font-size: 15px"><</span>
                                                        </span>  
                                                        <input type="text" name="a"   style="width: 142px" readonly="readonly" /> 
                                                        <input type="text"  class="jscolor" style="width:60px;margin-left: 8px " readonly="readonly"  >
                                                        </span>
                                                     </div>

                                                     
                                                 </div>  
                                          </td>
                                      </tr>
                                 </table>
                          </div>
                     </div>
                     <div class="modal-footer modalFoot">
                       <center>
                       <!-- <button type="button" class="btn btn-primary"   onclick="reportQueryResult.addColorDemoDetail_qujians()" >添 加</button> -->
                       <button type="button" class="btn btn-default" data-dismiss="modal">关 闭</button>
                       </center>
                     </div>
               </div>
          </div>
       </div>                    
          

    <!--着色弹框,颜色模板 模板详情-------------------------------------------------------------------------->
       <div  class="modal" id="addColorDemoDetail_meiju">
         <div class="modal-dialog">   <!-- style="width: 900px;left: -50px" -->
             <div class="modal-content modalContent" >
                   <div class="modal-header modalTOP">
                       <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true"><img src="../../static/reportManageSys/images/close.png"></span><span class="sr-only"></span></button>
                       <h4 class="modal-title">枚举着色模板详情</h4>
                   </div>
                   <div class="modal-body" id="modal-body" >
                        <div id="content_demoDetail_meiju" style="overflow: hidden;height:260px">
                                 <table>
                                     <tr style="height: 40px">
                                         <td style="width: 80px">模板名称<span style="color: red">*</span>:</td>
                                         <td><input id="colorDemoId_meiju" type="text" style="width: 496px" readonly="readonly" /></td>
                                     </tr>
                                     <tr>
                                         <td style="width: 80px">字段值列表:<span style="color: red">*</span>:</td>
                                         <td>
                                                <div id="addDiv_meiju" style="max-height: 260px;overflow: auto;padding-top: 4px;">
                                                    <div sf="1" style="height: 40px">
                                                       <span>
                                                       <input type="text" name="a"  style="width: 301px" readonly="readonly"/> 
                                                       <input id="ifPublish" type="checkbox" style="margin-left: 10px;" disabled='true' />模糊匹配
                                                       <input type="text"  class="jscolor" style="width:60px;margin-left: 20px;" readonly="readonly"  >
                                                       </span>
                                                    </div>
                                                    <div sf="0" style="height: 40px;display: none">
                                                       <span>
                                                       <input type="text" name="a"  style="width: 301px" readonly="readonly"/> 
                                                       <input id="ifPublish" type="checkbox" style="margin-left: 10px;" disabled='true' />模糊匹配
                                                       <input type="text"  class="jscolor" style="width:60px;margin-left: 20px; " readonly="readonly">
                                                       </span>
                                                    </div> 
                                                    <div sf="0" style="height: 40px;display: none">
                                                       <span>
                                                       <input type="text" name="a"  style="width: 301px" readonly="readonly"/> 
                                                       <input id="ifPublish" type="checkbox" style="margin-left: 10px;" disabled='true' />模糊匹配
                                                       <input type="text"  class="jscolor" style="width:60px;margin-left: 20px; " readonly="readonly">
                                                       </span>
                                                    </div>
                                                    <div sf="0" style="height: 40px;display: none">
                                                       <span>
                                                       <input type="text" name="a"  style="width: 301px" readonly="readonly"/> 
                                                       <input id="ifPublish" type="checkbox" style="margin-left: 10px;" disabled='true' />模糊匹配
                                                       <input type="text"  class="jscolor" style="width:60px;margin-left: 20px; " readonly="readonly">
                                                       </span>
                                                    </div>
                                                    <div sf="0" style="height: 40px;display: none">
                                                       <span>
                                                       <input type="text" name="a"  style="width: 301px" readonly="readonly"/> 
                                                       <input id="ifPublish" type="checkbox" style="margin-left: 10px;" disabled='true' />模糊匹配
                                                       <input type="text"  class="jscolor" style="width:60px;margin-left: 20px; " readonly="readonly">
                                                       </span>
                                                    </div> 
                                                    <div sf="0" style="height: 40px;display: none">
                                                       <span>
                                                       <input type="text" name="a"  style="width: 301px" readonly="readonly"/> 
                                                       <input id="ifPublish" type="checkbox" style="margin-left: 10px;" disabled='true' />模糊匹配
                                                       <input type="text"  class="jscolor" style="width:60px;margin-left: 20px; " readonly="readonly">
                                                       </span>
                                                    </div>
                                                    <div sf="0" style="height: 40px;display: none">
                                                       <span>
                                                       <input type="text" name="a"  style="width: 301px" readonly="readonly"/> 
                                                       <input id="ifPublish" type="checkbox" style="margin-left: 10px;" disabled='true' />模糊匹配
                                                       <input type="text"  class="jscolor" style="width:60px;margin-left: 20px; " readonly="readonly">
                                                       </span>
                                                    </div>
                                                    <div sf="0" style="height: 40px;display: none">
                                                       <span>
                                                       <input type="text" name="a"  style="width: 301px" readonly="readonly"/> 
                                                       <input id="ifPublish" type="checkbox" style="margin-left: 10px;" disabled='true' />模糊匹配
                                                       <input type="text"  class="jscolor" style="width:60px;margin-left: 20px; " readonly="readonly">
                                                       </span>
                                                    </div> 
                                                    <div sf="0" style="height: 40px;display: none">
                                                       <span>
                                                       <input type="text" name="a"  style="width: 301px" readonly="readonly"/> 
                                                       <input id="ifPublish" type="checkbox" style="margin-left: 10px;" disabled='true' />模糊匹配
                                                       <input type="text"  class="jscolor" style="width:60px;margin-left: 20px; " readonly="readonly">
                                                       </span>
                                                    </div>
                                                    <div sf="0" style="height: 40px;display: none">
                                                       <span>
                                                       <input type="text" name="a"  style="width: 301px" readonly="readonly"/> 
                                                       <input id="ifPublish" type="checkbox" style="margin-left: 10px;" disabled='true' />模糊匹配
                                                       <input type="text"  class="jscolor" style="width:60px;margin-left: 20px; " readonly="readonly">
                                                       </span>
                                                    </div>
                                                    <div sf="0" style="height: 40px;display: none">
                                                       <span>
                                                       <input type="text" name="a"  style="width: 301px" readonly="readonly"/> 
                                                       <input id="ifPublish" type="checkbox" style="margin-left: 10px;" disabled='true' />模糊匹配
                                                       <input type="text"  class="jscolor" style="width:60px;margin-left: 20px; " readonly="readonly">
                                                       </span>
                                                    </div> 
                                                    <div sf="0" style="height: 40px;display: none">
                                                       <span>
                                                       <input type="text" name="a"  style="width: 301px" readonly="readonly"/> 
                                                       <input id="ifPublish" type="checkbox" style="margin-left: 10px;" disabled='true' />模糊匹配
                                                       <input type="text"  class="jscolor" style="width:60px;margin-left: 20px; " readonly="readonly">
                                                       </span>
                                                    </div>
                                                    <div sf="0" style="height: 40px;display: none">
                                                       <span>
                                                       <input type="text" name="a"  style="width: 301px" readonly="readonly"/> 
                                                       <input id="ifPublish" type="checkbox" style="margin-left: 10px;" disabled='true' />模糊匹配
                                                       <input type="text"  class="jscolor" style="width:60px;margin-left: 20px; " readonly="readonly">
                                                       </span>
                                                    </div>
                                                    <div sf="0" style="height: 40px;display: none">
                                                       <span>
                                                       <input type="text" name="a"  style="width: 301px" readonly="readonly"/> 
                                                       <input id="ifPublish" type="checkbox" style="margin-left: 10px;" disabled='true' />模糊匹配
                                                       <input type="text"  class="jscolor" style="width:60px;margin-left: 20px; " readonly="readonly">
                                                       </span>
                                                    </div> 
                                                    <div sf="0" style="height: 40px;display: none">
                                                       <span>
                                                       <input type="text" name="a"  style="width: 301px" readonly="readonly"/> 
                                                       <input id="ifPublish" type="checkbox" style="margin-left: 10px;" disabled='true' />模糊匹配
                                                       <input type="text"  class="jscolor" style="width:60px;margin-left: 20px; " readonly="readonly">
                                                       </span>
                                                    </div>
                                                    <div sf="0" style="height: 40px;display: none">
                                                       <span>
                                                       <input type="text" name="a"  style="width: 301px" readonly="readonly"/> 
                                                       <input id="ifPublish" type="checkbox" style="margin-left: 10px;" disabled='true' />模糊匹配
                                                       <input type="text"  class="jscolor" style="width:60px;margin-left: 20px; " readonly="readonly">
                                                       </span>
                                                    </div>  
                                                </div>  
                                         </td>
                                     </tr>
                                </table> 
                        </div>
                   </div>
                   <div class="modal-footer modalFoot">
                     <center>
                     <!-- <button type="button" class="btn btn-primary"   onclick="reportQueryResult.addColorDemoDetail_meijus()" >添 加</button> -->
                     <button type="button" class="btn btn-default" data-dismiss="modal">关 闭</button>
                     </center>
                   </div>
             </div>
        </div>
     </div> 



     <!--字段算法说明-------------------------------------------------------------------------->
        <div  class="modal" id="fieldArith">
          <div class="modal-dialog" style="width: 95%">   <!-- style="width: 900px;left: -50px" -->
              <div class="modal-content modalContent" >
                    <div class="modal-header modalTOP">
                        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true"><img src="../../static/reportManageSys/images/close.png"></span><span class="sr-only"></span></button>
                        <h4 class="modal-title">字段算法</h4>
                    </div>
                    <div class="modal-body" id="modal-body" >
                            <div id="container_up" class="container" style="padding-bottom: 5px;padding-top: 0px; width:98%;height: 220px;margin-bottom: 0px;border: 0px solid #e8e8e8">
                                    <div class="row">
                                          <div id="container_up" class="container" style="padding-bottom: 5px;padding-top: 0px; width:98%;height: 90px;margin-bottom: 0px;border: 0px solid #e8e8e8">
                                                  <div class="row">
                                                        <div  class="" style="width:10%;min-width: 80px; float:left ;font-size: 18px; height: 24px;">
                                                            报表描述:
                                                        </div>
                                                        <div style="width:88%;float:left;border: 1px solid #e8e8e8">
                                                            <!-- <textarea id="algo_instru"  rows="3" style="width: 100%"></textarea> -->
                                                                <div id="algo_instru" style="width: 100%; height: 186px;overflow: auto">
                                                            </div>
                                                        </div>
                                                  </div>
                                          </div> 
                                          
                                    </div>
                            </div> 
                            <div id="container_down" class="container line7890"style="padding: 8px 15px;width:98%;height: 202px;border: 1px solid #e8e8e8">
                                    <div class="row">
                                          <div id="field_div" class="col-md-12" style="height: 184px; border: 0px solid #e8e8e8;padding: 0 5px;overflow-y: auto;">
                                                <div id="con_grid_div_e" class="line7890" style="border: 1px solid #e7e7e7">
                                                    <table id="con_grid_div_grid_e"></table>
                                                    <div id="con_grid_div_gridPager_e"></div>
                                                </div>
                                          </div>
                                    </div>
                            </div>     
                    </div>
                    <div class="modal-footer modalFoot">
                      <center>
                      <button type="button" class="btn btn-default" data-dismiss="modal">关 闭</button>
                      </center>
                    </div>
              </div>
         </div>
      </div>       
      <!--字段排序是否隐藏-------------------------------------------------------------------------->
        <div  class="modal" id="showOrhideAndSort">
          <div class="modal-dialog" style="width: 400px">   <!-- style="width: 900px;left: -50px" -->
              <div class="modal-content modalContent" >
                    <div class="modal-header modalTOP">
                        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true"><img src="../../static/reportManageSys/images/close.png"></span><span class="sr-only"></span></button>
                        <h4 class="modal-title">请选择要显示的列</h4>
                        <div style="width: 100%;height: 31px;border: 0px solid pink;margin-bottom: -13px;margin-left: -8px;padding-top: 5px;">
                            <span style="float: left;">
                            <input id="allcheck" type="checkbox" onclick="reportQueryResult.allchecked();"  /><span>全选</span>
                            </span>
                            <span style="float: right;">
                                  <a href="javascript:void(0)" class="function-icon">
                                     <i class="fa fa-refresh cursor analyData" title="重置" onclick="reportQueryResult.showOrhideAndSort_clear();" ></i>
                                  </a>
                            </span>      
                        </div>
                    </div>
                    <div class="modal-body" id="modal-body" style="padding: 0;" >
                           <div style="width:98%;height:270px; overflow: auto">
                                <table id="example_table" class="table" style="margin-bottom: 0px">
                                    <tbody id="content_table" style="cursor: default;">
                                      <tr>
                                          <td><input type="checkbox" /><span id="">表头获取失败....</span></td>
                                      </tr>
                                    </tbody>
                                </table>
                           </div>   
                    </div>
                    <div class="modal-footer modalFoot">
                      <center>
                      <!-- <button type="button" class="btn btn-success"   onclick="reportQueryResult.showOrhideAndSort_clear()" >重 置</button> -->
                      <button type="button" class="btn btn-primary"   onclick="reportQueryResult.showOrhideAndSorts()" >保 存</button>
                      <button type="button" class="btn btn-default" data-dismiss="modal">关 闭</button>
                      </center>
                    </div>
              </div>
         </div>
      </div>  
       
      <!--列是否可超链接1-------------------------------------------------------------------------->
        <div  class="modal" id="configHyperLinkHeadModal">
          <div class="modal-dialog" style="width: 500px">   <!-- style="width: 900px;left: -50px" -->
              <div class="modal-content modalContent" >
                    <div class="modal-header modalTOP">
                        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true"><img src="../../static/reportManageSys/images/close.png"></span><span class="sr-only"></span></button>
                        <h4 class="modal-title">请选择可钻取的列</h4>                       
                    </div>
                    <div class="modal-body" id="modal-body" style="padding: 0;" >
                           <div style="width:98%;height:270px; overflow: auto;padding: 0 0 0 10px;">
                                <table id="example_table_head" class="table" style="margin-bottom: 0px">
                                    <tbody id="content_table_head" style="cursor: pointer;">
                                      <tr>
                                          <td><span>表头获取失败....</span></td>
                                      </tr>
                                    </tbody>
                                </table>
                           </div>   
                    </div>
                    <div class="modal-footer modalFoot">
                      <center>
                      <button type="button" class="btn btn-primary"   onclick="reportQueryResult.configHyperLinks_one()" >下一步</button>
                      <button type="button" class="btn btn-default" data-dismiss="modal">关 闭</button>
                      </center>
                    </div>
              </div>
         </div>
      </div> 
      <!--列是否可超链接2-------------------------------------------------------------------------->
        <div  class="modal" id="configHyperLinkTreeModal">
          <div class="modal-dialog" style="width: 500px">   <!-- style="width: 900px;left: -50px" -->
              <div class="modal-content modalContent" >
                    <div class="modal-header modalTOP">
                        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true"><img src="../../static/reportManageSys/images/close.png"></span><span class="sr-only"></span></button>
                        <h4 class="modal-title">请选择下钻的报表</h4>
                        
                    </div>
                    <div class="modal-body" id="modal-body" style="padding: 0;" >
                           <div style="width:98%;height:40px;padding: 2px 0 0 10px;">
                                <span style="display: inline-block;border: 1px solid #e8e8e8;border-radius: 4px;height: 37px;margin-right: 10px">
                                  <input placeholder="报表名称...." id="reportName_mohu" style="width: 197px;border: none;height: 34px;padding: 2px 5px" onkeypress="if(event.keyCode==13){reportQueryResult.configHyperLinkTreeSelect();}" />
                                  <img style="cursor: pointer;" height="30px" width="30px" src="../../static/reportManageSys/images/fangdajing.png" onclick="reportQueryResult.configHyperLinkTreeSelect()">
                                </span>
                                <span>共搜索到<span id="selectLength" style="font-size: 28px;color: red;width: 48px;display: inline-block;text-align: center;">0</span>个</span>
                                <span><button type="button" class="btn btn-success btn-sm" title="上一个" onclick="reportQueryResult.configHyperLinkTree_up()" >↑</button></span>
                                <span><button type="button" class="btn btn-success btn-sm" title="下一个" onclick="reportQueryResult.configHyperLinkTree_down()" >↓</button></span>
                           </div> 
                           <div id="configHyperLinkTreeDivLoading" style="position: relative;">
                               <div id="configHyperLinkTreeDiv" style="width:100%;height:230px; overflow: auto;">
                                    <ul id="configHyperLinkTree" style="margin-left: 10px;"></ul>
                               </div> 
                           </div>  
                    </div>
                    <div class="modal-footer modalFoot">
                      <center>
                      <button type="button" class="btn btn-primary"   onclick="reportQueryResult.configHyperLinkTree_pre()" >上一步</button>
                      <button type="button" class="btn btn-primary"   onclick="reportQueryResult.configHyperLinks_two()" >保存</button>
                      <button type="button" class="btn btn-default" data-dismiss="modal">关 闭</button>
                      </center>
                    </div>
              </div>
         </div>
      </div>  
      <!--列是否可超链接3-------------------------------------------------------------------------->
        <div  class="modal" id="configHyperLinkParamModal">
          <div class="modal-dialog" style="width: 500px">   <!-- style="width: 900px;left: -50px" -->
              <div class="modal-content modalContent" >
                    <div class="modal-header modalTOP">
                        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true"><img src="../../static/reportManageSys/images/close.png"></span><span class="sr-only"></span></button>
                        <h4 class="modal-title">选取作为钻取条件的列</h4>                       
                    </div>
                    <div class="modal-body" id="modal-body" style="padding: 0;" >
                           <div style="width:98%;height:270px; overflow: auto;padding: 0 0 0 10px;">
                                <table id="example_table_head_param" class="table" style="margin-bottom: 0px">
                                    <tbody id="content_table_head_param" style="cursor: pointer;">
                                      <tr>
                                          <td><span>表头获取失败....</span></td>
                                      </tr>
                                    </tbody>
                                </table>
                           </div>   
                    </div>
                    <div class="modal-footer modalFoot">
                      <center>
                      <button type="button" class="btn btn-primary"   onclick="reportQueryResult.configHyperLinkParam_pre()" >上一步</button>
                      <button type="button" class="btn btn-primary"   onclick="reportQueryResult.configHyperLinks_three()" >下一步</button>
                      <button type="button" class="btn btn-default" data-dismiss="modal">关 闭</button>
                      </center>
                    </div>
              </div>
         </div>
      </div>  

<!--数据过滤-------------------------------------------------------------------------->
        <div  class="modal" id="dataFilterModal">
          <div class="modal-dialog" style="width: 636px">   <!-- style="width: 900px;left: -50px" -->
              <div class="modal-content modalContent" >
                    <div class="modal-header modalTOP">
                        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true"><img src="../../static/reportManageSys/images/close.png"></span><span class="sr-only"></span></button>
                        <h4 class="modal-title">数据过滤条件</h4>
                        <div style="width: 100%;height: 31px;border: 0px solid pink;margin-bottom: -13px;margin-left: -8px;padding-top: 5px;">
                            <span style="float: left;">
                                 <button class="btn btn-success" style="height: 24px;padding: 1px 5px"  onclick="reportQueryResult.backDataBaseCondition()">加载已保存过滤条件</button>
                                 <button class="btn btn-success" style="height: 24px;padding: 1px 5px"  onclick="reportQueryResult.backLastCondition()">加载上一次过滤条件</button>
                            </span>
                            <span style="float: right;">
                                  <a href="javascript:void(0)" class="function-icon">
                                     <i class="fa fa-refresh cursor analyData" title="重置" onclick="reportQueryResult.clearCondition();" ></i>
                                  </a>
                            </span>      
                        </div>
                    </div>
                    <div class="modal-body" id="modal_body_dataFilter" style="padding: 0;" >
                           <div style="width:98%;height:270px; overflow: auto">
                                <table id="example_table_dataFilter" class="table" style="margin-bottom: 0px">
                                    <tbody id="content_table_dataFilter" style="cursor: default;">
                                      <tr>
                                          <td><input type="checkbox" /><span id="">表头获取失败....</span></td>
                                      </tr>
                                    </tbody>
                                </table>
                           </div>   
                    </div>
                    <div class="modal-footer modalFoot">
                      
                      <center>
                      <span style="float: left;" >
                          <input type="checkbox" id="isSaveCondition" /> <span>是否保存当前条件</span>
                      </span>
                      <!-- <button type="button" class="btn btn-success"   onclick="reportQueryResult.showOrhideAndSort_clear()" >重 置</button> -->
                      <button type="button" class="btn btn-primary"   onclick="reportQueryResult.dataFilter_save()" >查 询</button>
                      <button type="button" class="btn btn-default" data-dismiss="modal" style="margin-right: 149px;">关 闭</button>
                      </center>
                    </div>
              </div>
         </div>
      </div>
	<!------------------配置echarts维度条件  第一步-------------------->
	<div id="echartsModal" class="modal fade" data-backdrop="static">
		<div class="modal-dialog" style="width: 85%;">   <!-- style="width: 900px;left: -50px" -->
			<div class="modal-content modalContent" >
				<div class="modal-header modalTOP">
					<button class="close" data-dismiss="modal">
						<span aria-hidden="true">
							<img src="../../static/reportManageSys/images/close.png">
						</span>
						<span class="sr-only"></span>
					</button>
					<h4 class="modal-title">图形维度条件</h4>
				</div>
				<div class="modal-body">
						<div id="echartsStep_1" style="max-height: 330px;">
							<div style="width: 46%; float: left; border: 1px solid #E8E8E8;">
								<div style="padding: 3px 20px; border-bottom: 1px solid #E8E8E8;">
									备选字段</div>
								<ul id="totalFields" style="height: 300px; overflow-y: auto;">
								</ul>
							</div>
							<center style="width: 8%; float: left; padding-top: 28px;">
								<button class="btn btn-success btn-sm" style="display:block;margin-bottom: 10px;"
									onclick="reportEcharts.addFields('xFields')">&rarr;</button>
								<button class="btn btn-success btn-sm"
									onclick="reportEcharts.removeFields('xFields')">&larr;</button>
							</center>
							<div style="margin-left: 54%; border: 1px solid #E8E8E8; margin-bottom: 4px;">
								<div style="padding: 3px 20px; border-bottom: 1px solid #E8E8E8;">
									X轴维度条件
									<span style="color: red;">(必须选时间)</span>
									<span style="float: right;">选择时间字段</span>
								</div>
								<ul id="xFields" style="height: 78px; overflow-y: auto;">
								</ul>
							</div>
							<center style="width: 8%; float: left; padding-top: 28px;">
								<button class="btn btn-success btn-sm" style="display:block;margin-bottom: 10px;"
									onclick="reportEcharts.addFields('lYFields')">&rarr;</button>
								<button class="btn btn-success btn-sm"
									onclick="reportEcharts.removeFields('lYFields')">&larr;</button>
							</center>
							<div style="margin-left: 54%; border: 1px solid #E8E8E8;margin-bottom: 4px;">
								<div style="padding: 3px 20px; border-bottom: 1px solid #E8E8E8;">
									左Y轴<span style="color: red;">(不超过5个)</span>
								</div>
								<ul id="lYFields" style="height: 78px; overflow-y: auto;">
								</ul>
							</div>
							<center style="width: 8%; float: left; padding-top: 28px;">
								<button class="btn btn-success btn-sm" style="display:block;margin-bottom: 10px;"
									onclick="reportEcharts.addFields('rYFields')">&rarr;</button>
								<button class="btn btn-success btn-sm"
									onclick="reportEcharts.removeFields('rYFields')">&larr;</button>
							</center>
							<div style="margin-left: 54%; border: 1px solid #E8E8E8;">
								<div style="padding: 3px 20px; border-bottom: 1px solid #E8E8E8;">
									右Y轴<span style="color: red;">(不超过5个)</span>
								</div>
								<ul id="rYFields" style="height: 78px; overflow-y: auto;">
								</ul>
							</div>
							<div class="clear"></div>
						</div>
						<div id="echartsStep_2" style="display: none;">
							<input id="timeField" type="hidden"/>
							<span style="margin-right: 10px;">X轴:</span>
							<select id="xAxis"
								style="width: 100px; margin-bottom: 5px;"
								onchange="reportEcharts.xAxisChange(this.value);">
								<!--<option value="时间">时间</option>-->
							</select>
							<div id="xTimeFieldCond" style="display: inline-block;">
								<input id="xStartTime" class="Wdate" 
									style="width: 120px;" 
									onclick="WdatePicker({dateFmt : 'yyyy-MM-dd',maxDate:'%y-%M-{%d-1}'})">
								&sim;
								<input id="xEndTime" class="Wdate" 
									style="width: 120px;" 
									onclick="WdatePicker({dateFmt : 'yyyy-MM-dd',maxDate:'%y-%M-{%d-1}'})">
							</div>
							<fieldset style="border: 1px solid #E8E8E8;padding: 5px 10px;">
								<legend style="border: 0;width: auto;
    							font-size: 14px;padding: 0 5px;
    							margin: 0 0 5px 0px;">维度条件</legend>
								<div id="xAxisParam">
									<!--<div id="时间_div" style="display:inline-block;margin-right: 10px;margin-bottom:5px;">
				        		<span style="margin-right: 10px">时间:</span>
				        		<select id="时间_param" style="width: 100px;">
				        		</select>
				        	</div>-->
								</div>
							</fieldset>
							<table style="width: 47%;float: left;">
								<tr style="height: 30px;">
									<td style="width: 33%;">左Y轴</td>
									<td style="width: 40%;">图形类型</td>
									<td style="width: 25%;">聚合方式</td>
								</tr>
							</table>
							<table style="width: 47%;margin-left: 53%;">
								<tr style="height: 30px;">
									<td style="width: 33%;">右Y轴</td>
									<td style="width: 40%;">图形类型</td>
									<td style="width: 25%;">聚合方式</td>
								</tr>
							</table>
							<div class="clear"></div>
							<div style="width: 47%;float: left;height:165px;overflow-y: auto;">
								<table id="lYAxis" style="width: 100%;">
									<thead>
										<tr>
											<td style="width: 33%;"></td>
											<td style="width: 40%;"></td>
											<td style="width: 25%;"></td>
										</tr>
									</thead>
									<tbody>
										<!--<tr>
											<td>流量占比</td>
											<td style="padding-top: 6px;">
												<label>
													<input type="radio" name="流量占比" value="line" style="margin-left: 0;"/>
													<i class="fa fa-line-chart" style="color: #0085d0;"></i>
												</label>
												<label>
													<input type="radio" name="流量占比" value="bar" style="margin-left: 10px;"/>
													<i class="fa fa-bar-chart" style="color: #0085d0;"></i>
												</label>
												<label>
													<input type="radio" name="流量占比" value="area" style="margin-left: 10px;"/>
													<i class="fa fa-area-chart" style="color: #0085d0;"></i>
												</label>
												<select style="height:28px;font-size:12px;">
													<option value="sum" selected="selected">求和</option>
													<option value="avg">平均数</option>
													<option value="max">最大值</option>
													<option value="min">最小值</option>
												</select>
											</td>
										</tr>-->
									</tbody>
								</table>
							</div>
							<div style="width: 47%;margin-left: 53%;height: 165px;overflow-y: auto;">
								<table id="rYAxis" style="width:100%;">
									<thead>
										<tr>
											<td style="width: 33%;"></td>
											<td style="width: 40%;"></td>
											<td style="width: 25%;"></td>
										</tr>
									</thead>
									<tbody>
									</tbody>
								</table>
							</div>
							<div class="clear"></div>
						</div>
				</div>
				<div class="modal-footer modalFoot">
					<center id="echartsStepBtn_1">
						<button class="btn btn-primary"
							onclick="reportEcharts.nextStep()">下一步</button>
						<button class="btn btn-default" data-dismiss="modal">关 闭</button>
					</center>
					<center id="echartsStepBtn_2" style="display: none;">
						<button class="btn btn-primary"
							onclick="reportEcharts.lastStep()">上一步</button>
						<button class="btn btn-primary"
							onclick="reportEcharts.queryEcharts()">查 询</button>
						<button class="btn btn-default" data-dismiss="modal">关 闭</button>
					</center>
				</div>
			</div>
		</div>
	</div>
   
</body>
</html>