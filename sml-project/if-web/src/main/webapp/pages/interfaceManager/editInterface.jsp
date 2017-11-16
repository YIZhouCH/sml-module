<%@ page contentType="text/html;charset=utf-8"%>
<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
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

	<!--自己的js-->
	<script src="../../scripts/interfaceManager/common/jquery.json-2.4.min.js" type="text/javascript"></script>
	<script src="../../scripts/interfaceManager/common/util.js" type="text/javascript"></script>
	<script src="../../scripts/interfaceManager/editInterface.js" type="text/javascript"></script>
	<link href="../../static/interfaceManager/editInterface.css" rel="stylesheet" type="text/css" />
<style type="text/css">
.selected{
background: #5cbdf4;
}
#sel_div li{
padding: 2px 0 0 0;
height: 24px;
cursor: pointer;
}
</style>
</head>
   
<body style="overflow-x: hidden;">
<div class="tableDiv">
	<table class="table">
		<tr>
			<th><label>接口标识<span style="color: red">*</span>:</label></th>
			<td>
				<input id="id" type="text" disabled="disabled"/>
			</td>
			<td style="width:1%;">
				<input type="button" class="btn btn-primary" onclick="editInterface.editParam();" value="编辑参数"  style="color:#fff ; "/>
			</td>
		</tr>
		<tr>
			<th><label>接口名称<span style="color: red">*</span>:</label></th>
			<td><input id="name" type="text"/></td>
		</tr>
		<tr>
			<th><label>查询条件:</label></th>
			<td><textarea id="condition_info_param" onblur="editInterface.changeParam();" rows="6" cols=""></textarea></td>
			<td style="display:none;"><textarea id="condition_info" rows="6" cols="">{}</textarea></td>
		</tr>
	</table>
</div>
<div id="cententDiv" style="width:100%; border: 0px solid pink;">
	<div id="sqlInfo" style="border: 1px solid #e8e8e8 ; margin-top: 20px;padding: 20px 20px; position: relative;">
		<div style="position: absolute;top: -10px;left: 15px;padding-right: 10px;padding-left: 10px;;background: #fff">SQL编辑区</div>
		<div id="otherConditions" style="border: 0px solid pink ; ">
			<div id="condition" style="text-align:left;"></div>
			<div style="height: auto ;">
				<textarea id="mainsql"  rows="20" style="width: 100%"></textarea>
			</div>
		</div>
	</div>
</div>
<div class="tableDiv">
	<table class="table">
		<tr>
			<th><label>包装器<span style="color: red">*</span>:</label></th>
			<td>
				<select id="rebuild" onchange="editInterface.changeRebuild();">
					
				</select>
			</td>
		</tr>
		<tr>
			<th><label>包装器属性<span style="color: red">*</span>:</label></th>
			<td><textarea id="rebuild_info" rows="6" cols=""></textarea></td>
		</tr>
		<tr>
			<th><label>是否缓存<span style="color: red">*</span>:</label></th>
			<td>
				<select id="cache_enabled" onchange="editInterface.editCache();">
					<option value="0" selected="selected">否</option>
					<option value="1">是</option>
				</select>
			</td>
		</tr>
		<tr>
			<th><label>缓存时间<span style="color: red">*</span>:</label></th>
			<td><input id="cache_minutes" value="0" type="text" disabled="disabled"/></td>
		</tr>
		<tr>
			<th><label>数据源<span style="color: red">*</span>:</label></th>
			<td>
				<select id="db_id" onchange=""></select>
			</td>
			<td style="display: none;">
				<input id="db_id_text" type="text"/>
			</td>
		</tr>
		<tr>
			<th><label>描述<span style="color: red">*</span>:</label></th>
			<td><input id="descr" type="text" value="接口"/></td>
		</tr>
		<tr>
			<th><label>创建者<span style="color: red">*</span>:</label></th>
			<td><input id="creator" type="text"/></td>
		</tr>
		<tr style="display:none;">
			<td><input id="type" type="text"/></td>
			<td><input id="parent_id" type="text"/></td>
			<td><input id="update_time" type="text"/></td>
		</tr>
		<!-- <tr>
			<th><label>操作时间:</label></th>
			<td><input id="update_time" type="text" disabled="disabled"/></td>
		</tr> -->
	</table>
</div>

<div id="baocunDiv" style="border: 0px solid #e8e8e8 ; margin-top: 20px; position: relative;  ">
		<center>
			<input id="btn_save" type="button" class="btn btn-success" value="保  存"  style="margin-right: 20px;padding:3px 14px;height:34px; color:#fff ;"/>
			<input id="btn_test" type="button" class="btn btn-warning"  onclick="editInterface.testEg();" value="测 试"  style="margin-right: 20px;padding:3px 14px;height:34px; color:#fff ; "/>
		</center>
</div>
<!--新增参数组件-------------------------------------------------------------------------->
<div  class="modal" id="addParamModal" style="padding:30px 0">
	<div class="modal-dialog" style="width:95%;">
		<div class="modal-content" >
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
				<h4 class="modal-title">参数信息</h4>
				
			</div>
			<div class="modal-body" style="padding: 15px 15px 0 15px; overflow: hidden;">
				<table class="table" style="border-top-style: hidden;">
					<tr>
						<td style="width:20%; padding: 8px 8px 0 8px; text-align: center; vertical-align: middle;">参数英文名称<span style="color: red">*</span></td>
						<td style="width:15%; padding: 8px 8px 0 8px; text-align: center; vertical-align: middle;">类型</td>
						<td style="width:15%; padding: 8px 8px 0 8px; text-align: center; vertical-align: middle;">默认值</td>
						<td style="width:40%; padding: 8px 8px 0 8px; text-align: center; vertical-align: middle;">备注<span style="color: red">*</span></td>
						<td style="width:50px; padding: 8px 14px 0 0px; text-align: center; vertical-align: middle;">是否<br />必选</td>
						<td style="width:40px; padding: 8px 8px 0 0px; text-align: center; vertical-align: middle;"><a href="JavaScript:void(0)" onclick="editInterface.addParam();" ><img src="../../static/interfaceManager/images/plus.png"/></a></td>
					</tr>
				</table>
			</div>
			<div class="modal-body"  style="height:360px; padding: 0 15px 15px 15px; overflow: auto;">
				<table id="addParam" class="table">
					<!-- <thead>
						<tr>
							<td style="width:20%;">参数英文名称<span style="color: red">*</span></td>
							<td style="width:15%;">类型</td>
							<td style="width:15%;">默认值</td>
							<td style="width:40%;">备注<span style="color: red">*</span></td>
							<td style="width:60px;">是否<br />必选</td>
							<td style="width:60px;"><a href="JavaScript:void(0)" onclick="editInterface.addParam();" ><img src="../../static/interfaceManager/images/plus.png"/></a></td>
						</tr>
					</thead> -->
					<thead>
						<tr>
							<td style="width:20%;"></td>
							<td style="width:15%;"></td>
							<td style="width:15%;"></td>
							<td style="width:40%;"></td>
							<td style="width:30px; padding: 0;"></td>
							<td style="width:40px; padding: 0 30px 0 0;"></td>
						</tr>
					</thead>
					<tbody>
						
					</tbody>
				</table>
			</div>
			<div class="modal-footer">
				<input id="if_page_data" type="checkbox" onclick="editInterface.editPageDataParam();"/><label style="font-weight: normal;" for="if_page_data">添加分页查询参数</label>
				<button type="button" class="btn btn-primary" onclick="editInterface.subParam();" >添 加</button>
			</div>
		</div>
	</div>
</div>
 <div style="width:180px;display: none;z-index: 999999" id="sel_div"><ul class="form-control" style="height:100%;" id="bq_sel" >
			<li val="if">if表达示</li>
			<li val="isNet">isNotEmpty</li>
			<li val="isEt">isEmpty</li>
		</ul></div>

</body>
</html>