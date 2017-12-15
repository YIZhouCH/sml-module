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

<!--引用背景图片--> 
<%@ include file="aBackGround.jsp" %>



<!--自己的js-->
<script src="${ctx}/scripts/reportManageSys/configUrl.js" type="text/javascript"></script>
<script src="${ctx}/scripts/reportManageSys/jquery.json-2.4.min.js" type="text/javascript"></script>
<script src="${ctx}/scripts/reportManageSys/commonAjax.js" type="text/javascript"></script>
<script src="${ctx}/scripts/reportManageSys/firstPage.js" type="text/javascript"></script>
<script src="${ctx}/scripts/reportManageSys/drawPic.js" type="text/javascript"></script>




 <script type="text/javascript">
  var currUserName="<%=currUserName%>";
    $(document).ready(function(){
          var k = document.body.offsetWidth;
          //document.getElementById("resultSeekReportName").style.width = 0.75*k +"px";
            initCookie();
            firstPage.init();
            setInterval("firstPage.init()",5*60*1000);

            var pie_div_width = $("#pie_div").width();
            $("#visit_count").width(pie_div_width);
            $("#user_T_count").width(pie_div_width);
            $("#user_T_count").css('display', 'none');;

    });
   
</script>

</head>

   
<body>
       <div> 
        <div  id="fspage" >
            <div style="float: left; width: 32%;height: 100%; border: 0px solid #e7e7e7;margin-right: 10px; margin-left:15px">
               <div style="float:left;width:100%;height: 47%; border: 0px solid black; margin-bottom:30px">
                   <div style="width:99%;height: 99%; border: 1px; ">
                       <div style="width:100%;height:10%;"><h5 class="f1"><i class="fa fa-volume-up ecom_icons ecom_icons2" style="margin-right:8px"></i>公告栏</h5></div> 
                       <div align="center" class="line7890" id="AD_scroll" style="overflow:hidden;height:90%;width:99%;font-size:14px;color:#1f608b;line-height:22px;text-align:left;padding:10px;border:1px solid #e7e7e7">
                            <marquee scrollAmount='2' style='width:100%;' height='100%' direction='up'  onmouseover=this.stop() onmouseout=this.start()>
                                            <div id="marquee_div" style='border-top:0px dotted red;padding:5px 5px 2px 5px;'>
                                                  
                                            </div>
                            </marquee>
                       </div>      
                       
                   </div>
               </div> 
               <div style="float:left;width:100%;height: 47%; border: 0px solid black;">

                    <div style="width:99%;height: 99%;  ">
                        <div style="width:100%;height:10%;"><h5 class="f1"><i class="fa fa-line-chart ecom_icons ecom_icons2" style="margin-right:8px"></i>报表数量趋势图</h5></div>
                        <div class="line7890" style="width:100%;height:90%;border:1px solid #e7e7e7">
                        	<div id="table_count" style="float:left;width:100%;height:100%"></div>
                        </div>
				
                    </div>
               </div> 
            </div>        
            <div  style="float: left; width:32%; height: 100%; border: 0px solid #e7e7e7;margin-right: 10px">
                <div style="float:left;width:100%;height: 47%; border: 0px solid black;margin-bottom:30px">
                    <div style="width:99%;height: 99%; ">
                        <div style="width:100%;height:10%;"><h5 class="f1"><i class='fa fa-list-ol ecom_icons ecom_icons2' style="margin-right:8px"></i>用户报表查看次数TOP10</h5></div>
                        <div class="line7890" style="width:100%;height:90%;border:1px solid #e7e7e7">
                        	<div id="see_count" style="float:left;width:100%;height:100%" ></div>
                        </div>
                    </div>
                </div> 
               <div style="float:left;width:100%;height: 47%; border: 0px solid black;">
                   <div style="width:99%;height: 99%; border: 1px">
                       <div style="width:100%;height:10%;"><h5 class="f1"><i class='fa fa-list-ol ecom_icons ecom_icons2' style="margin-right:8px"></i>当前用户报表查看次数TOP10</h5></div>
                       <div class="line7890" style="width:100%;height:90%;border:1px solid #e7e7e7">
                       		<div id="pre_see_count" style="float:left;width:100%;height:100%"></div>
                       </div>

                   </div>
               </div>
            </div>
            <div  style="float: left; width:32%; height: 100%; border: 0px solid #e7e7e7;margin-right: 5px">
                <div style="float:left;width:100%;height: 47%; border: 0px solid black;margin-bottom:30px">
                    <div style="width:99%;height: 99%; border: 1px">
                       <div style="width:100%;height:10%;"><h5 class="f1"><i class="fa fa-th-large ecom_icons ecom_icons2" style="margin-right:8px"></i>最近查看的报表</h5></div>
                                                 
                            <div class="line7890" id="con_grid_div" style="border: 1px solid #e7e7e7">
                                <table id="con_grid_div_grid"></table>
                            </div>
                            <div class="clear"></div>                 
                      
                   </div> 
   
                </div> 
               <div style="float:left;width:100%;height: 47%; border: 0px solid black;">
                   <div style="width:99%;height: 99%; ">
                       <div style="width:100%;height:10%;">
                            <button class="btn btn-default b1" style="float:left;width:50%;height:99%;font-size:xx-small;border-top:3px solid blue;border-bottom:0px" ><h5>报表访问次数TOP10</h5> </button>
                            <button class="btn btn-default b2" style="float:left;width:50%;height:99%;font-size:xx-small" ><h5>用户报表数量占比TOP10</h5></button>
                        </div>
                       <div class="line7890" id="pie_div" style="width:100%;height:90%;border:1px solid #e7e7e7;border-top:0px">
                          <div id="visit_count" style="height:350px"></div>
                          <div id="user_T_count" style="height:350px;"></div>
                       </div>
                   </div>
               </div>
            </div>
        </div>
    </div>
     
</body>
</html>