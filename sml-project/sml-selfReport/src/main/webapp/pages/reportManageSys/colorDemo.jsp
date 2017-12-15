<%@ page contentType="text/html;charset=utf-8"%>
<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%String currUserName=request.getParameter("currUserName")==null?"unknown":request.getParameter("currUserName"); %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<%@ include file="/commonSelfReport/baselib.jsp"%>



<!--引用背景图片--> 
<%@ include file="aBackGround.jsp" %>



<!--自己的js-->
<script src="${ctx}/scripts/reportManageSys/jquery.json-2.4.min.js" type="text/javascript"></script>
<script src="${ctx}/scripts/reportManageSys/commonAjax.js" type="text/javascript"></script>
<script src="${ctx}/scripts/reportManageSys/jscolor.min.js" type="text/javascript"></script>
<script src="${ctx}/scripts/reportManageSys/colorDemo.js" type="text/javascript"></script>
<script src="${ctx}/scripts/reportManageSys/configUrl.js" type="text/javascript"></script>

<style type="text/css">
  .panel-body {
    padding: 0;
}
</style>



 <script type="text/javascript">
   var currUserName="<%=currUserName%>";
          var kk = "";
          $(document).ready(function(){
                var k = document.documentElement.clientHeight;
                var px = k-35;
                kk = px;
                initCookie();
                colorDemo.init();
    });
</script>


</head>

   
<body>
<div id="baocunId" style="display: none;"></div>
<div class="container-fluid" style="margin-left:10px">
<div class="row">
<div  class="col-sm-12" style="padding:0;">
       <div style="border: 0px solid pink; width: 100%;">
          <div style="margin: 10px">
            <span style="display:block;border: 1px solid #e8e8e8;border-radius: 4px;height: 37px;width: 300px;margin:0 0 10px 0 ">
              <input placeholder="模板名称...." id="demoName_mohu" style="width: 260px;border: none;height: 34px;padding: 2px 5px" onkeypress="if(event.keyCode==13){colorDemo.demoQuery();}"/>
              <img style="cursor: pointer;" height="30px" width="30px" src="../../static/reportManageSys/images/fangdajing.png" onclick="colorDemo.demoQuery()">
            </span>
            <button type="button" class="btn btn-primary"   onclick="colorDemo.addDemo_qujian_before()" >新增区间</button>
            <button type="button" class="btn btn-primary"   onclick="colorDemo.addDemo_meiju_before()" >新增枚举</button>
            <button type="button" class="btn btn-warning"   onclick="colorDemo.delDemo()" >删除</button> 
            <!-- <span style="display: inline-block;border: 1px solid #e8e8e8;border-radius: 4px;float: right;height: 37px;margin-right: 10px">
              <input placeholder="模板名称...." id="demoName_mohu" style="width: 260px;border: none;height: 34px;padding: 2px 5px" onkeypress="if(event.keyCode==13){colorDemo.demoQuery();}"/>
              <img style="cursor: pointer;" height="30px" width="30px" src="../../static/reportManageSys/images/fangdajing.png" onclick="colorDemo.demoQuery()">
            </span> -->
           <!--  <button type="button" class="btn btn-primary"   onclick="colorDemo.initGrid()" style="float: right;" >刷新</button>  -->
          </div>
          <!-- <div>
             <span>模板名称:</span>
             <input id="demoName_mohu" style="width: 260px" />
          </div> -->
          <div id="con_list" class="con_list" style="border:1px solid #e8e8e8; padding: 0px">
              <div class="con_chart" >
                  <div id="con_grid_div" style="border: 1px solid #e7e7e7">
                      <table id="con_grid_div_grid"></table>
                      <div id="con_grid_div_gridPager"></div>
                  </div>
                  <div class="clear"></div>
              </div>
          </div> 


       </div> 				                 
                                   
        				                
</div>
</div>
</div>
 

<!--新增区间类型模板-------------------------------------------------------------------------->
   <div  class="modal" id="addDemo_qujian">
     <div class="modal-dialog" >   <!-- style="width: 900px;left: -50px" -->
         <div class="modal-content modalContent" >
               <div class="modal-header modalTOP">
                   <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true"><img src="../../static/reportManageSys/images/close.png"></span><span class="sr-only"></span></button>
                   <h4 class="modal-title">区间模板设置</h4>
               </div>
               <div class="modal-body" id="modal-body" >
                      <table>
                          <!-- <tr style="height: 30px">
                              <td></td>
                              <td><button type="button" class="btn btn-primary" style="float: right"  onclick="colorDemo.addField_qujian()" >添加</button></td>
                          </tr> -->
                          <tr style="height: 40px">
                              <td>模板名称<span style="color: red">*</span>:</td>
                              <td><input id="colorDemoId_qujian" type="text" style="width: 496px" /></td>
                          </tr>
                          <tr >
                              <td>区间值表:<span style="color: red">*</span>:</td>
                              <td>
                                     <div id="addDiv_qujian" style="max-height: 260px;overflow: auto;padding-top: 4px;">
                                         <div sf="1" style="height: 40px">
                                            <span>
                                            <input type="text" name="a"  style="width: 100px" />
                                            <span>
                                                <span style="font-size: 15px"><=</span>
                                                <span style="font-size: 15px;margin: 0 10px;">一级告警</span>
                                                <span style="font-size: 15px"><</span>
                                            </span> 
                                            <input type="text" name="a"   style="width: 100px" /> 
                                            <input type="text"  class="jscolor" style="width:60px;margin-left: 8px "  >
                                            </span>
                                            <button type="button" class="btn btn-primary" style="float: right"  onclick="colorDemo.addField_qujian()" >添加</button>
                                            <!-- <button type="button" class="btn btn-default" style="float: right" onclick="colorDemo.delField_qujian(this)" >删除</button>   -->
                                            <!-- <span style="margin-left: 50px;cursor: pointer;" title="删除" onclick="colorDemo.delField_qujian(this)"><img  src="../../static/reportManageSys/images/closehong.png"></span> -->
                                         </div>
                                         <div sf="0" style="height: 40px;display: none">
                                            <span>
                                            <input type="text" name="a"  style="width: 100px" />
                                            <span>
                                                <span style="font-size: 15px"><=</span>
                                                <span style="font-size: 15px;margin: 0 10px;">二级告警</span>
                                                <span style="font-size: 15px"><</span>
                                            </span>  
                                            <input type="text" name="a"   style="width: 100px" /> 
                                            <input type="text"  class="jscolor" style="width:60px;margin-left: 8px "  >
                                            </span>
                                            <!-- <button type="button" class="btn btn-default" style="float: right" onclick="colorDemo.delField_qujian(this)" >删除</button>   -->
                                            <span style="margin-left: 50px;cursor: pointer;" title="删除" onclick="colorDemo.delField_qujian(this)"><img  src="../../static/reportManageSys/images/closehong.png"></span> 
                                         </div>
                                         <div sf="0" style="height: 40px;display: none">
                                            <span>
                                            <input type="text" name="a"  style="width: 100px" />
                                            <span>
                                                <span style="font-size: 15px"><=</span>
                                                <span style="font-size: 15px;margin: 0 10px;">三级告警</span>
                                                <span style="font-size: 15px"><</span>
                                            </span>  
                                            <input type="text" name="a"   style="width: 100px" /> 
                                            <input type="text"  class="jscolor" style="width:60px;margin-left: 8px "  >
                                            </span>
                                          <!--  <button type="button" class="btn btn-default" style="float: right" onclick="colorDemo.delField_qujian(this)" >删除</button>   -->
                                            <span style="margin-left: 50px;cursor: pointer;" title="删除" onclick="colorDemo.delField_qujian(this)"><img  src="../../static/reportManageSys/images/closehong.png"></span> 
                                         </div>
                                         <div sf="0" style="height: 40px;display: none">
                                            <span>
                                            <input type="text" name="a"  style="width: 100px" />
                                            <span>
                                                <span style="font-size: 15px"><=</span>
                                                <span style="font-size: 15px;margin: 0 10px;">四级告警</span>
                                                <span style="font-size: 15px"><</span>
                                            </span>  
                                            <input type="text" name="a"   style="width: 100px" /> 
                                            <input type="text"  class="jscolor" style="width:60px;margin-left: 8px "  >
                                            </span>
                                          <!--  <button type="button" class="btn btn-default" style="float: right" onclick="colorDemo.delField_qujian(this)" >删除</button>   -->
                                            <span style="margin-left: 50px;cursor: pointer;" title="删除" onclick="colorDemo.delField_qujian(this)"><img  src="../../static/reportManageSys/images/closehong.png"></span> 
                                         </div>
                                         <div sf="0" style="height: 40px;display: none">
                                            <span>
                                            <input type="text" name="a"  style="width: 100px" />
                                            <span>
                                                <span style="font-size: 15px"><=</span>
                                                <span style="font-size: 15px;margin: 0 10px;">五级告警</span>
                                                <span style="font-size: 15px"><</span>
                                            </span>  
                                            <input type="text" name="a"   style="width: 100px" /> 
                                            <input type="text"  class="jscolor" style="width:60px;margin-left: 8px "  >
                                            </span>
                                          <!--  <button type="button" class="btn btn-default" style="float: right" onclick="colorDemo.delField_qujian(this)" >删除</button>   -->
                                            <span style="margin-left: 50px;cursor: pointer;" title="删除" onclick="colorDemo.delField_qujian(this)"><img  src="../../static/reportManageSys/images/closehong.png"></span> 
                                         </div>
                                         <div sf="0" style="height: 40px;display: none">
                                            <span>
                                            <input type="text" name="a"  style="width: 100px" />
                                            <span>
                                                <span style="font-size: 15px"><=</span>
                                                <span style="font-size: 15px;margin: 0 10px;">六级告警</span>
                                                <span style="font-size: 15px"><</span>
                                            </span>  
                                            <input type="text" name="a"   style="width: 100px" /> 
                                            <input type="text"  class="jscolor" style="width:60px;margin-left: 8px "  >
                                            </span>
                                          <!--  <button type="button" class="btn btn-default" style="float: right" onclick="colorDemo.delField_qujian(this)" >删除</button>   -->
                                            <span style="margin-left: 50px;cursor: pointer;" title="删除" onclick="colorDemo.delField_qujian(this)"><img  src="../../static/reportManageSys/images/closehong.png"></span> 
                                         </div>
                                         <div sf="0" style="height: 40px;display: none">
                                            <span>
                                            <input type="text" name="a"  style="width: 100px" />
                                            <span>
                                                <span style="font-size: 15px"><=</span>
                                                <span style="font-size: 15px;margin: 0 10px;">七级告警</span>
                                                <span style="font-size: 15px"><</span>
                                            </span>  
                                            <input type="text" name="a"   style="width: 100px" /> 
                                            <input type="text"  class="jscolor" style="width:60px;margin-left: 8px "  >
                                            </span>
                                          <!--  <button type="button" class="btn btn-default" style="float: right" onclick="colorDemo.delField_qujian(this)" >删除</button>   -->
                                            <span style="margin-left: 50px;cursor: pointer;" title="删除" onclick="colorDemo.delField_qujian(this)"><img  src="../../static/reportManageSys/images/closehong.png"></span> 
                                         </div>
                                         <div sf="0" style="height: 40px;display: none">
                                            <span>
                                            <input type="text" name="a"  style="width: 100px" />
                                            <span>
                                                <span style="font-size: 15px"><=</span>
                                                <span style="font-size: 15px;margin: 0 10px;">八级告警</span>
                                                <span style="font-size: 15px"><</span>
                                            </span>  
                                            <input type="text" name="a"   style="width: 100px" /> 
                                            <input type="text"  class="jscolor" style="width:60px;margin-left: 8px "  >
                                            </span>
                                          <!--  <button type="button" class="btn btn-default" style="float: right" onclick="colorDemo.delField_qujian(this)" >删除</button>   -->
                                            <span style="margin-left: 50px;cursor: pointer;" title="删除" onclick="colorDemo.delField_qujian(this)"><img  src="../../static/reportManageSys/images/closehong.png"></span> 
                                         </div>
                                         <div sf="0" style="height: 40px;display: none">
                                            <span>
                                            <input type="text" name="a"  style="width: 100px" />
                                            <span>
                                                <span style="font-size: 15px"><=</span>
                                                <span style="font-size: 15px;margin: 0 10px;">九级告警</span>
                                                <span style="font-size: 15px"><</span>
                                            </span>  
                                            <input type="text" name="a"   style="width: 100px" /> 
                                            <input type="text"  class="jscolor" style="width:60px;margin-left: 8px "  >
                                            </span>
                                          <!--  <button type="button" class="btn btn-default" style="float: right" onclick="colorDemo.delField_qujian(this)" >删除</button>   -->
                                            <span style="margin-left: 50px;cursor: pointer;" title="删除" onclick="colorDemo.delField_qujian(this)"><img  src="../../static/reportManageSys/images/closehong.png"></span> 
                                         </div>

                                         
                                     </div>  
                              </td>
                          </tr>
                     </table>
               </div>
               <div class="modal-footer modalFoot">
                 <center>
                 
                 <button type="button" class="btn btn-primary"   onclick="colorDemo.addDemos_qujian()" >保存</button>
                 <button type="button" class="btn btn-default" data-dismiss="modal">关 闭</button>
                 </center>
               </div>
               
         </div>
     </div>
   </div>
<!--新增枚举类型模板-------------------------------------------------------------------------->
   <div  class="modal" id="addDemo_meiju">
     <div class="modal-dialog" >   <!-- style="width: 900px;left: -50px" -->
         <div class="modal-content modalContent" >
               <div class="modal-header modalTOP">
                   <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true"><img src="../../static/reportManageSys/images/close.png"></span><span class="sr-only"></span></button>
                   <h4 class="modal-title">枚举模板设置</h4>
               </div>
               <div class="modal-body" id="modal-body" >
                      <table>
                          <!-- <tr style="height: 30px">
                              <td></td>
                              <td><button type="button" class="btn btn-primary" style="float: right"  onclick="colorDemo.addField_meiju()" >添加</button></td>
                          </tr> -->
                          <tr style="height: 40px">
                              <td>模板名称<span style="color: red">*</span>:</td>
                              <td><input id="colorDemoId_meiju" type="text" style="width: 496px" /></td>
                          </tr>
                          <tr >
                              <td>字段值列表:<span style="color: red">*</span>:</td>
                              <td>
                                     <div id="addDiv_meiju" style="max-height: 260px;overflow: auto;padding-top: 4px;">
                                         <div sf="1" style="height: 40px">
                                            <span>
                                            <input type="text" name="a"  style="width: 230px" /> 
                                            <input id="ifPublish" type="checkbox" style="margin-left: 10px;" />模糊匹配
                                            <input type="text"  class="jscolor" style="width:60px;margin-left: 20px;"  >
                                            </span>
                                            <button type="button" class="btn btn-primary" style="float: right"  onclick="colorDemo.addField_meiju()" >添加</button>
                                            <!-- <button type="button" class="btn btn-default" style="float: right" onclick="colorDemo.delField_meiju(this)" >删除</button> 
                                             <span style="margin-left: 50px;cursor: pointer;" title="删除" onclick="colorDemo.delField_meiju(this)"><img  src="../../static/reportManageSys/images/closehong.png"></span> 
                                         </div>
                                         <div sf="0" style="height: 40px;display: none">
                                            <span>
                                            <input type="text" name="a"  style="width: 230px" /> 
                                            <input id="ifPublish" type="checkbox" style="margin-left: 10px;" />模糊匹配
                                            <input type="text"  class="jscolor" style="width:60px;margin-left: 20px; ">
                                            </span>
                                            <!-- <button type="button" class="btn btn-default" style="float: right" onclick="colorDemo.delField_meiju(this)" >删除</button> --> 
                                            <!-- <span style="margin-left: 50px;cursor: pointer;" title="删除" onclick="colorDemo.delField_meiju(this)"><img  src="../../static/reportManageSys/images/closehong.png"></span>  -->
                                         </div> 
                                         <div sf="0" style="height: 40px;display: none">
                                            <span>
                                            <input type="text" name="a"  style="width: 230px" /> 
                                            <input id="ifPublish" type="checkbox" style="margin-left: 10px;" />模糊匹配
                                            <input type="text"  class="jscolor" style="width:60px;margin-left: 20px; ">
                                            </span>
                                            <!-- <button type="button" class="btn btn-default" style="float: right" onclick="colorDemo.delField_meiju(this)" >删除</button> --> 
                                            <span style="margin-left: 50px;cursor: pointer;" title="删除" onclick="colorDemo.delField_meiju(this)"><img  src="../../static/reportManageSys/images/closehong.png"></span> 
                                         </div>
                                         <div sf="0" style="height: 40px;display: none">
                                            <span>
                                            <input type="text" name="a"  style="width: 230px" /> 
                                            <input id="ifPublish" type="checkbox" style="margin-left: 10px;" />模糊匹配
                                            <input type="text"  class="jscolor" style="width:60px;margin-left: 20px; ">
                                            </span>
                                            <!-- <button type="button" class="btn btn-default" style="float: right" onclick="colorDemo.delField_meiju(this)" >删除</button> --> 
                                            <span style="margin-left: 50px;cursor: pointer;" title="删除" onclick="colorDemo.delField_meiju(this)"><img  src="../../static/reportManageSys/images/closehong.png"></span> 
                                         </div>
                                         <div sf="0" style="height: 40px;display: none">
                                            <span>
                                            <input type="text" name="a"  style="width: 230px" /> 
                                            <input id="ifPublish" type="checkbox" style="margin-left: 10px;" />模糊匹配
                                            <input type="text"  class="jscolor" style="width:60px;margin-left: 20px; ">
                                            </span>
                                            <!-- <button type="button" class="btn btn-default" style="float: right" onclick="colorDemo.delField_meiju(this)" >删除</button> --> 
                                            <span style="margin-left: 50px;cursor: pointer;" title="删除" onclick="colorDemo.delField_meiju(this)"><img  src="../../static/reportManageSys/images/closehong.png"></span> 
                                         </div> 
                                         <div sf="0" style="height: 40px;display: none">
                                            <span>
                                            <input type="text" name="a"  style="width: 230px" /> 
                                            <input id="ifPublish" type="checkbox" style="margin-left: 10px;" />模糊匹配
                                            <input type="text"  class="jscolor" style="width:60px;margin-left: 20px; ">
                                            </span>
                                            <!-- <button type="button" class="btn btn-default" style="float: right" onclick="colorDemo.delField_meiju(this)" >删除</button> --> 
                                            <span style="margin-left: 50px;cursor: pointer;" title="删除" onclick="colorDemo.delField_meiju(this)"><img  src="../../static/reportManageSys/images/closehong.png"></span> 
                                         </div>
                                         <div sf="0" style="height: 40px;display: none">
                                            <span>
                                            <input type="text" name="a"  style="width: 230px" /> 
                                            <input id="ifPublish" type="checkbox" style="margin-left: 10px;" />模糊匹配
                                            <input type="text"  class="jscolor" style="width:60px;margin-left: 20px; ">
                                            </span>
                                            <!-- <button type="button" class="btn btn-default" style="float: right" onclick="colorDemo.delField_meiju(this)" >删除</button> --> 
                                            <span style="margin-left: 50px;cursor: pointer;" title="删除" onclick="colorDemo.delField_meiju(this)"><img  src="../../static/reportManageSys/images/closehong.png"></span> 
                                         </div>
                                         <div sf="0" style="height: 40px;display: none">
                                            <span>
                                            <input type="text" name="a"  style="width: 230px" /> 
                                            <input id="ifPublish" type="checkbox" style="margin-left: 10px;" />模糊匹配
                                            <input type="text"  class="jscolor" style="width:60px;margin-left: 20px; ">
                                            </span>
                                            <!-- <button type="button" class="btn btn-default" style="float: right" onclick="colorDemo.delField_meiju(this)" >删除</button> --> 
                                            <span style="margin-left: 50px;cursor: pointer;" title="删除" onclick="colorDemo.delField_meiju(this)"><img  src="../../static/reportManageSys/images/closehong.png"></span> 
                                         </div> 
                                         <div sf="0" style="height: 40px;display: none">
                                            <span>
                                            <input type="text" name="a"  style="width: 230px" /> 
                                            <input id="ifPublish" type="checkbox" style="margin-left: 10px;" />模糊匹配
                                            <input type="text"  class="jscolor" style="width:60px;margin-left: 20px; ">
                                            </span>
                                            <!-- <button type="button" class="btn btn-default" style="float: right" onclick="colorDemo.delField_meiju(this)" >删除</button> --> 
                                            <span style="margin-left: 50px;cursor: pointer;" title="删除" onclick="colorDemo.delField_meiju(this)"><img  src="../../static/reportManageSys/images/closehong.png"></span> 
                                         </div>
                                         <div sf="0" style="height: 40px;display: none">
                                            <span>
                                            <input type="text" name="a"  style="width: 230px" /> 
                                            <input id="ifPublish" type="checkbox" style="margin-left: 10px;" />模糊匹配
                                            <input type="text"  class="jscolor" style="width:60px;margin-left: 20px; ">
                                            </span>
                                            <!-- <button type="button" class="btn btn-default" style="float: right" onclick="colorDemo.delField_meiju(this)" >删除</button> --> 
                                            <span style="margin-left: 50px;cursor: pointer;" title="删除" onclick="colorDemo.delField_meiju(this)"><img  src="../../static/reportManageSys/images/closehong.png"></span> 
                                         </div>
                                         <div sf="0" style="height: 40px;display: none">
                                            <span>
                                            <input type="text" name="a"  style="width: 230px" /> 
                                            <input id="ifPublish" type="checkbox" style="margin-left: 10px;" />模糊匹配
                                            <input type="text"  class="jscolor" style="width:60px;margin-left: 20px; ">
                                            </span>
                                            <!-- <button type="button" class="btn btn-default" style="float: right" onclick="colorDemo.delField_meiju(this)" >删除</button> --> 
                                            <span style="margin-left: 50px;cursor: pointer;" title="删除" onclick="colorDemo.delField_meiju(this)"><img  src="../../static/reportManageSys/images/closehong.png"></span> 
                                         </div> 
                                         <div sf="0" style="height: 40px;display: none">
                                            <span>
                                            <input type="text" name="a"  style="width: 230px" /> 
                                            <input id="ifPublish" type="checkbox" style="margin-left: 10px;" />模糊匹配
                                            <input type="text"  class="jscolor" style="width:60px;margin-left: 20px; ">
                                            </span>
                                            <!-- <button type="button" class="btn btn-default" style="float: right" onclick="colorDemo.delField_meiju(this)" >删除</button> --> 
                                            <span style="margin-left: 50px;cursor: pointer;" title="删除" onclick="colorDemo.delField_meiju(this)"><img  src="../../static/reportManageSys/images/closehong.png"></span> 
                                         </div>
                                         <div sf="0" style="height: 40px;display: none">
                                            <span>
                                            <input type="text" name="a"  style="width: 230px" /> 
                                            <input id="ifPublish" type="checkbox" style="margin-left: 10px;" />模糊匹配
                                            <input type="text"  class="jscolor" style="width:60px;margin-left: 20px; ">
                                            </span>
                                            <!-- <button type="button" class="btn btn-default" style="float: right" onclick="colorDemo.delField_meiju(this)" >删除</button> --> 
                                            <span style="margin-left: 50px;cursor: pointer;" title="删除" onclick="colorDemo.delField_meiju(this)"><img  src="../../static/reportManageSys/images/closehong.png"></span> 
                                         </div>
                                         <div sf="0" style="height: 40px;display: none">
                                            <span>
                                            <input type="text" name="a"  style="width: 230px" /> 
                                            <input id="ifPublish" type="checkbox" style="margin-left: 10px;" />模糊匹配
                                            <input type="text"  class="jscolor" style="width:60px;margin-left: 20px; ">
                                            </span>
                                            <!-- <button type="button" class="btn btn-default" style="float: right" onclick="colorDemo.delField_meiju(this)" >删除</button> --> 
                                            <span style="margin-left: 50px;cursor: pointer;" title="删除" onclick="colorDemo.delField_meiju(this)"><img  src="../../static/reportManageSys/images/closehong.png"></span> 
                                         </div> 
                                         <div sf="0" style="height: 40px;display: none">
                                            <span>
                                            <input type="text" name="a"  style="width: 230px" /> 
                                            <input id="ifPublish" type="checkbox" style="margin-left: 10px;" />模糊匹配
                                            <input type="text"  class="jscolor" style="width:60px;margin-left: 20px; ">
                                            </span>
                                            <!-- <button type="button" class="btn btn-default" style="float: right" onclick="colorDemo.delField_meiju(this)" >删除</button> --> 
                                            <span style="margin-left: 50px;cursor: pointer;" title="删除" onclick="colorDemo.delField_meiju(this)"><img  src="../../static/reportManageSys/images/closehong.png"></span> 
                                         </div>
                                         <div sf="0" style="height: 40px;display: none">
                                            <span>
                                            <input type="text" name="a"  style="width: 230px" /> 
                                            <input id="ifPublish" type="checkbox" style="margin-left: 10px;" />模糊匹配
                                            <input type="text"  class="jscolor" style="width:60px;margin-left: 20px; ">
                                            </span>
                                            <!-- <button type="button" class="btn btn-default" style="float: right" onclick="colorDemo.delField_meiju(this)" >删除</button> --> 
                                            <span style="margin-left: 50px;cursor: pointer;" title="删除" onclick="colorDemo.delField_meiju(this)"><img  src="../../static/reportManageSys/images/closehong.png"></span> 
                                         </div>  
                                     </div>  
                              </td>
                          </tr>
                     </table>
               </div>
               <div class="modal-footer modalFoot">
                 <center>
                 
                 <button type="button" class="btn btn-primary"   onclick="colorDemo.addDemos_meiju()" >保存</button>
                 <button type="button" class="btn btn-default" data-dismiss="modal">关 闭</button>
                 </center>
               </div>
               
         </div>
     </div>
   </div>
</body>
</html>