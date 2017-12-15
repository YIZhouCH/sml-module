<%@ page contentType="text/html;charset=UTF-8"%>
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<%@include file="./common.jsp" %>
	<script src="${ctxPath}/scripts/interfaceManager/egQuery.js" type="text/javascript"></script>
	<link href="./css/egQuery.css" rel="stylesheet" type="text/css" />
	<script type="text/javascript">
	</script>
</head>
<body class="easyui-layout">
	<div data-options="region:'west',split:true,title:'测试样例'" style="width:240px;padding:10px;">
		<ul id="treeEg" onselectstart="return false;" style="-moz-user-select:none;"></ul>
	</div>
	<div id="mainPanel"  region="center" style="padding:0; background:white; overflow-y: auto;">
		<div id="tableDiv">
			<table class="table">
				<tr>
					<th><label>拼接URL:</label></th>
					<td>
						<input id="url_head" type="text" style="width:50%;" onblur="egQuery.editUrl();"/>
						<select id="url_body" style="width:15%;" onchange="egQuery.editUrl();">
							<option value="query/" selected="selected">query/</option>
							<option value="update/">update/</option>
						</select>
						<input id="id" type="text" style="width:29%;" disabled="disabled"/>
						<input id="edit_url_ifId" type="checkbox" name="edit_url" style="width:3%; margin:0;" onclick="egQuery.editUrl();"/>
					</td>
				</tr>
				<tr>
					<th><label>请求地址<span style="color: red">*</span>:</label></th>
					<td><input id="url" type="text"/></td>
				</tr>
				<tr>
					<th><label>请求类型<span style="color: red">*</span>:</label></th>
					<td>
						<select id="requestType">
							<option selected="selected" value="form">form表单请求</option>
							<option value="request">request请求</option>
						</select>
					</td>
				</tr>
				<tr>
					<th><label>参数:</label></th>
					<td>
						<textarea id="param" rows="5" cols="" onblur="egQuery.changeParam();"></textarea>
					</td>
					<td style="display: none;">
						<textarea id="param_info" rows="5" cols="">{}</textarea>
					</td>
				</tr>
				<tr>
					<th><label>返回结果:</label></th>
					<td><textarea id="result" rows="12" cols=""></textarea></td>
				</tr>
				<tr>
					<th><label>描述<span style="color: red">*</span>:</label></th>
					<td><input id="descr" type="text"/></td>
				</tr>
			</table>
			<center>
				<button id="btn_add" type="button" style="display:none; margin-right:5px;" class="btn btn-success" onclick="egQuery.submitAdd();" >添 加</button>
				<button id="btn_save" type="button" style="display:none; margin-right:5px;" class="btn btn-primary" onclick="egQuery.save();" >保 存</button>
				<button id="btn_test" type="button" style="display:none; margin-right:5px;" class="btn btn-warning" onclick="egQuery.testEg();" >测 试</button>
				<button type="button" style="margin-right:5px;" class="btn btn-info" onclick="egQuery.clearResult();" >清除接口缓存</button>
			</center>
		</div>
	</div>
	<!-- 1级树, 右键菜单 -->
	<div id="mm1" class="easyui-menu" style="width:150px;">
		<div onclick="egQuery.initPageData();" data-options="iconCls:'icon-xinjianmulu'">新增测试样例</div>
	</div>
	<!-- 2级树, 右键菜单 -->
	<div id="mm2" class="easyui-menu" style="width:150px;">
		<div onclick="egQuery.del();" data-options="iconCls:'icon-shanchumulu'">删除样例</div>
	</div>
	
</body>
</html>
