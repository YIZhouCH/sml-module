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
<script src="${ctx}/scripts/reportManageSys/fieldArithmeticShow.js" type="text/javascript"></script>
<script src="${ctx}/scripts/reportManageSys/ToExcelOrCSV.js" type="text/javascript"></script>
<script src="${ctx}/scripts/reportManageSys/configUrl.js" type="text/javascript"></script>

<!--引用背景图片--> 
<%@ include file="aBackGround.jsp" %>



 <script type="text/javascript">
 var currUserName="<%=currUserName%>";
    $(document).ready(function(){
           initCookie();
           fieldArithmeticShow.init();
    });
</script>

</head>

   
<body >
    <div class="container-fluid" style="margin-left:10px">
          <div class="row">
              <div  class="col-sm-12 screen_row line7890" style="margin-bottom: 10px;padding: 3px 0 8px;border-bottom: 1px solid #e8e8e8;"> 
                    <div >
                        报表名称:
                        <input id="report_name" type="text" style="margin: 0 10px" /> 
                        字段名称:
                        <input id="field_name" type="text" style="margin: 0 10px" />
                        所需表名:
                        <input id="need_table_name" type="text" style="margin: 0 10px" />
                        <button class="btn btn-primary" type="button" onclick="fieldArithmeticShow.query()" style="margin-left: 10px;" ><lable class="note_search"></lable>查  询</button>
                        <!-- <input class="btn btn-primary" type="button" onclick="fieldArithmeticShow.query()" style="margin-left: 10px;" value="查 询"> -->
                       <!-- <button type="button" class="btn btn-primary"  onclick="fieldArithmeticShow.addDat()">查  询</button> -->
                    </div> 
               
              </div>
              <a href="javascript:void(0)" class="function-icon" style="float: right;">
                 <i class="fa fa-file-excel-o cursor"  title="导出表格" onclick="fieldArithmeticShow.exportEXCEL();" ></i>
              </a>
              <div  class="col-sm-12" style="padding:0;">       
                    
                    <div id="con_list" class="con_list line7890" style="border:1px solid #e8e8e8; padding: 0px">
                        <div class="con_chart" >
                            <div class="line7890" id="con_grid_div" style="border: 1px solid #e7e7e7">
                                <table id="con_grid_div_grid"></table>
                                <div id="con_grid_div_gridPager"></div>
                            </div>
                            <div class="clear"></div>
                        </div>
                    </div> 
              </div>
         </div>
    </div>





    <!---------------------------------------------------------------------------->
       <div  class="modal" id="mymodal">
         <div class="modal-dialog">   <!-- style="width: 900px;left: -50px" -->
             <div class="modal-content modalContent" >
                   <div class="modal-header modalTOP">
                       <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true"><img src="../../static/reportManageSys/images/close.png"></span><span class="sr-only"></span></button>
                       <h4 class="modal-title">修改算法</h4>
                   </div>
                   <div class="modal-body" id="modal-body" >
                          <span style="margin-left: 40px">当前行id</span><span style="color: red">*</span><span>:</span>
                          <input id="muluName" type="text" style="width: 260px ;height: 34px; margin-right: 30px" />
                   </div>
                   <div class="modal-footer">
                        <center>
                          <button type="button" class="btn btn-primary"   onclick="fieldArithmeticShow.alterDatas()" >修 改</button>
                          <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
                        </center>
                   </div>
                   
             </div>
        </div>
       </div>


       <!--算法详情---------------------------------------------------------------------------->
          <div  class="modal" id="suanfaDetail">
            <div class="modal-dialog" style="width: 90%">   <!-- style="width: 900px;left: -50px" -->
                <div class="modal-content modalContent" >
                      <div class="modal-header modalTOP">
                          <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true"><img src="../../static/reportManageSys/images/close.png"></span><span class="sr-only"></span></button>
                          <h4 class="modal-title">算法详情</h4>
                      </div>
                      <div class="modal-body" id="modal-body" >
                             <div>
                                <table style="width: 97%">
                                    <tr>
                                       <td style="text-align: right;padding-right: 10px;width: 100px;">报表名称:</td>
                                       <td><span id="NAME_"></span></td>
                                    </tr>
                                    <tr>
                                       <td style="text-align: right;padding-right: 10px;width: 100px;">中文字段名:</td>
                                       <td><span id="NAME_Z"></span></td>
                                    </tr>
                                    <tr>
                                       <td style="text-align: right;padding-right: 10px;width: 100px;">算法:</td>
                                       <td><span id="DESCR_"></span></td>
                                    </tr>
                                    <tr>
                                       <td style="text-align: right;padding-right: 10px;width: 100px;">字段说明:</td>
                                       <td><span id="STRATEGY"></span></td>
                                    </tr>
                                    <tr>
                                       <td style="text-align: right;padding-right: 10px;width: 100px;vertical-align: top;">报表说明:</td>
                                       <td>
                                           <!-- <span id="ALGO_INSTRU"></span> -->
                                           <!-- <div id="ALGO_INSTRU" style="overflow: auto;height: 300px;width: 100%;border: 1px solid #e8e8e8;margin: 6px 0 0 0px;"></div> -->
                                           <textarea id="ALGO_INSTRU" rows="15" style="width: 100%;margin: 6px 0 0 0px;"></textarea> 
                                       </td>
                                    </tr>
                                </table>
                             </div>
                      </div>
                      <!-- <div class="modal-footer">
                           <center>
                             <button type="button" class="btn btn-primary"   onclick="fieldArithmeticShow.alterDatas()" >修 改</button>
                             <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
                           </center>
                      </div> -->
                      
                </div>
           </div>
          </div>       




</body>
</html>