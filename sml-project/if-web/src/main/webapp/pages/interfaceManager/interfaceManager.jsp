<%@ page contentType="text/html;charset=UTF-8"%>
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<%-- <%@ include file="/common/lib.jsp" %> --%>
	<%-- <%@ include file="/common/fontawesome/fontawesome4.3.0.jsp" %> --%>
	
	<%-- <%@ include file="/common/bootstrap.jsp" %> --%>
	<%-- <%@ include file="/pages/common/jquery-ui-bootstrap.jsp" %> --%>
	<%-- <%@ include file="/pages/common/inas-common.jsp" %> --%>
	
	<%-- <%@ include file="/pages/common/inas-product-style.jsp" %> --%>
	<%-- <%@ include file="/pages/common/inas-loadmask.jsp" %> --%>
	<%-- <%@ include file="/pages/common/inas-my97.jsp" %> --%>
	<%-- <%@ include file="/common/echarts.jsp" %> --%>
	
	<!-- 引用jQuery -->
	<script src="../../scripts/interfaceManager/common/jquery-1.12.4.min.js" type="text/javascript"></script>
	
	<!-- 引用bootstrap -->
	<script src="../../scripts/interfaceManager/bootstrap-3.3.0/js/bootstrap.js" type="text/javascript"></script>
	<script src="../../scripts/interfaceManager/bootstrap-3.3.0/js/bootstrap.min.js" type="text/javascript"></script>
	<link href="../../scripts/interfaceManager/bootstrap-3.3.0/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
	
	<!-- 引用easyui -->
	<script src="../../scripts/interfaceManager/jquery.easyui-1.4/jquery.easyui.min.js" type="text/javascript"></script>
	<script src="../../scripts/interfaceManager/jquery.easyui-1.4/locale/easyui-lang-zh_CN.js" type="text/javascript"></script>
	<link href="../../scripts/interfaceManager/jquery.easyui-1.4/themesO/bootstrap/easyui.css" rel="stylesheet" type="text/css"/>
	<link href="../../scripts/interfaceManager/jquery.easyui-1.4/themesO/icon.css" rel="stylesheet" type="text/css"/>
	
	<!-- 引用服务器css -->
	<link href="../../static/interfaceManager/common/common-all.css" rel="stylesheet" type="text/css"/>
	<link href="../../static/interfaceManager/common/jquery-ui-1.10.3.custom.css" rel="stylesheet" type="text/css"/>
	<!-- <link href="../../static/interfaceManager/common/common.css" rel="stylesheet" type="text/css"/> -->
	<!-- <link href="../../static/interfaceManager/common/homepage.css" rel="stylesheet" type="text/css"/> -->
	<!-- <link href="../../static/interfaceManager/common/style.css" rel="stylesheet" type="text/css"/> -->
	<!-- <link href="../../static/interfaceManager/common/table.css" rel="stylesheet" type="text/css"/> -->
	
	<!-- 引用easyui框架 -->
	<!-- <script type="text/javascript" src="easyui/jquery.easyui.min.js"></script> -->
	<!-- <script type="text/javascript" src="easyui/locale/easyui-lang-zh_CN.js"></script> -->
	<!-- <link rel="stylesheet" type="text/css" href="themes/bootstrap/easyui.css"/> -->
	<!-- <link rel="stylesheet" type="text/css" href="themes/icon.css"/> -->
	<!-- <link rel="stylesheet" type="text/css" href="easyui/style/css/statisticalforms.css"/> -->
	
	<!-- 自定义js -->
	<script src="../../scripts/interfaceManager/common/jquery.json-2.4.min.js" type="text/javascript"></script>
	<script src="../../scripts/interfaceManager/common/util.js" type="text/javascript"></script>
	<script src="../../scripts/interfaceManager/interfaceManager.js" type="text/javascript"></script>
	<link href="../../scripts/interfaceManager/jquery.easyui-1.4/style/css/statisticalforms.css" rel="stylesheet" type="text/css"/>
</head>
<body class="easyui-layout">
	<div data-options="region:'west',split:true,title:'接口分类'" style="width:300px;padding:10px;">
		<ul id="tree" onselectstart="return false;" style="-moz-user-select:none;"></ul>
	</div>
	<div id="mainPanel"  region="center" style="padding:0; background:white; overflow: hidden;">
		<div id="tabs" class="easyui-tabs" data-options="fit:true,border:false,plain:true">
			<div title="接口搜索"  style="padding:1px;background-color:white;width:100%;height:100%;">
			<div class="container-fluid" style="margin-left:10px">
				<div class="row">
					<div  class="col-sm-12" style="padding:0;">
						<center>
							<div style=" border: 0px solid #e8e8e8 ;margin-top: 50px;padding: 20px">
								<input id="seekInterfaceName" type="text" placeholder="请输入接口名称...." style="width: 290px;height: 34px;" onkeypress="if(event.keyCode==13){interfaceManager.search();}"/>
								<input type="button"  class="btn btn-primary" value="搜  索" style="margin-left: 20px;padding:3px 14px;height:34px; margin-bottom: 4px;" onclick="interfaceManager.search();"/>
								<input type="button"  class="btn btn-warning" value="重  置" style="margin-left: 20px;padding:3px 14px;height:34px; margin-bottom: 4px;" onclick="interfaceManager.clearSearch();"/>
							</div>
							<div id="resultSeekInterfaceName" style="border:0px solid #e8e8e8; width:100%; padding:0 5%;">
								<table class="table"></table>
							</div>
						</center>
					</div>
				</div>
			</div>
			</div>
		</div>
	</div>
	<!-- 1级树, 右键菜单 -->
	<div id="mm1" class="easyui-menu" style="width:150px;">
		<div onclick="interfaceManager.addDir(this);" data-options="iconCls:'icon-xinjianmulu'">新建目录</div>
	</div>
	<!-- 2级树, 右键菜单 -->
	<div id="mm2" class="easyui-menu" style="width:150px;">
		<div onclick="interfaceManager.addDir(this);" data-options="iconCls:'icon-xinjianmulu'">新建目录</div>
		<div onclick="interfaceManager.addInter();" data-options="iconCls:'icon-xinjianmulu'">新建接口</div>
		<div onclick="interfaceManager.updateDir();" data-options="iconCls:'icon-xiugaimulu'">修改目录名称</div>
		<div onclick="interfaceManager.delDir();" data-options="iconCls:'icon-shanchumulu'">删除目录</div>
	</div>
	<!-- 3级树, 右键菜单 -->
	<div id="mm3" class="easyui-menu" style="width:150px;">
		<!-- <div onclick="interfaceManager.thirdTree.update();" data-options="iconCls:'icon-xiugaimulu'"><span>修改</span><span>接口</span>名</div> -->
		<div onclick="interfaceManager.editInter()" data-options="iconCls:'icon-xiugaibaobiaomingcheng'">编辑接口</div>
		<div onclick="interfaceManager.delInter()" data-options="iconCls:'icon-shanchumulu'">删除接口</div>
	</div>
	<!-- tabs右键菜单 -->
	<div id="mm" class="easyui-menu" style="width:150px;">
		<div id="mm-tabclose" onclick="interfaceManager.tabEvent.close();">关闭</div>
		<div id="mm-tabcloseall" onclick="interfaceManager.tabEvent.closeAll();">全部关闭</div>
		<div id="mm-tabcloseother" onclick="interfaceManager.tabEvent.closeOther();">除此之外全部关闭</div>
		<div id="mm-tabcloseright" onclick="interfaceManager.tabEvent.closeRight();">当前页右侧全部关闭</div>
		<div id="mm-tabcloseleft" onclick="interfaceManager.tabEvent.closeLeft();">当前页左侧全部关闭</div>
		<div id="mm-exit" onclick="interfaceManager.tabEvent.exit();">退出</div>
	</div>
	<!-- ------modal通用模板--------------------------------------- -->
	<div id="modal" class="modal">
		<div class="modal-dialog modal-sm" style="margin-top: 150px">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal">
						<span aria-hidden="true">
							<img src="../../static/interfaceManager/images/close.png"/>
						</span>
						<span class="sr-only"></span>
					</button>
					<h4 id="modal_h4" class="modal-title"></h4>
				</div>
				<div class="modal-body">
					<table align="center">
						<tr>
							<td>目录名称:<font color="red">*</font></td> 
							<td><input type="text" id="modal_input_name" class="input_owner" /></td>
						</tr>
						<tr style="height: 45px;">
							<td>创建者:<font color="red">*</font></td> 
							<td><input type="text" id="modal_input_creator" class="input_owner" /></td>
						</tr>
					</table>
				</div>
				<div class="modal-footer">
					<center>
						<button type="button" class="btn btn-primary" id="modal_submit"></button>
						<button type="button" class="btn btn-default"   data-dismiss="modal">关 闭</button>
					</center>
				</div>
			</div>
		</div>
	</div>
	<!-- -------------------------------------------- -->
	
</body>
</html>
