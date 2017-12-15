<%@ page contentType="text/html;charset=utf-8"%>
<%String currUserName=request.getParameter("currUserName")==null?"unknown":request.getParameter("currUserName"); %>
<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<%@ include file="/commonSelfReport/baselib.jsp"%>


<!--引用背景图片--> 
<%@ include file="aBackGround.jsp" %>




<!--自己的js-->
<script src="${ctx}/scripts/reportManageSys/jquery.json-2.4.min.js" type="text/javascript"></script>
<script src="${ctx}/scripts/reportManageSys/commonAjax.js" type="text/javascript"></script>
<script src="${ctx}/scripts/reportManageSys/publishNotice.js" type="text/javascript"></script>
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
                 kk = px
            initCookie();
            publishNotice.init();
    });
</script>


</head>

   
<body>
<div class="container-fluid" style="margin-left:10px">
<div class="row">
<div  class="col-sm-12" style="padding:0;">
       <div style="border: 0px solid pink; width: 100%;">
          <div style="margin: 10px">
            <button type="button" class="btn btn-primary"   onclick="publishNotice.publishNotice()" ><lable class="note_add"></lable>新增</button>
            <button type="button" class="btn btn-primary"   onclick="publishNotice.noticeDel()" ><lable class="note_del"></lable>删除</button> 
            <!-- <button type="button" class="btn btn-primary"   onclick="publishNotice.publishNotice()" >新增</button>
            <button type="button" class="btn btn-primary"   onclick="publishNotice.noticeDel()" >删除</button>  -->
           <!--  <button type="button" class="btn btn-primary"   onclick="publishNotice.initGrid()" style="float: right;" >刷新</button>  -->
          </div>
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
</div>
 
<!---------------------------------------------------------------------------->
   <div  class="modal" id="publishNotice">
     <div class="modal-dialog" style="margin-top: 150px">   <!-- style="width: 900px;left: -50px" -->
         <div class="modal-content modalContent" >
               <div class="modal-header modalTOP">
                   <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true"><img src="../../static/reportManageSys/images/close.png"></span><span class="sr-only"></span></button>
                   <h4 class="modal-title">发布公告</h4>
               </div>
               <div class="modal-body" id="modal-body" >
                      <table>
                          <tr style="height: 30px">
                              <td><input id="ifPublish" type="checkbox" style="margin-left: 0px;" />是否发布公告</td>
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
               </div>
               <div class="modal-footer modalFoot">
                 <center>
                 <button type="button" class="btn btn-primary"   onclick="publishNotice.publishNotices()" >发  布</button>
                 <button type="button" class="btn btn-default" data-dismiss="modal">关 闭</button>
                 </center>
               </div>
               
         </div>
    </div>
 </div>
</body>
</html>