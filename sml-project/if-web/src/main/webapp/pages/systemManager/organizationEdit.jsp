<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/pages/commons/global.jsp" %>
<script type="text/javascript">
    $(function() {
    	var organization=parent.$.modalDialog.node;
    	var formLst=['id','code','name','seq','icon','address','pid'];
    	for(var i=0;i<formLst.length;i++){
    		var key=formLst[i];
    		var value=formLst[i];
    		value=value=='icon'?'iconCls':key;
    		$("input[name='"+formLst[i]+"']").val(organization[value]);
    	}
        $('#organizationEditPid').combotree({
            url : smlManager.getQryUrl('system-organization-qry?NOWRAPPER=true'),
            parentField : 'pid',
            lines : true,
            panelHeight : 'auto',
            value :organization.pid
        });
        
        $('#organizationEditForm').form({
            url : smlManager.getUpUrl('system-organization-up','update'),
            onSubmit : function() {
                progressLoad();
                var isValid = $(this).form('validate');
                if (!isValid) {
                    progressClose();
                }
                return isValid;
            },
            success : function(result) {
                progressClose();
                result = $.parseJSON(result);
                if (result.success) {
                    parent.$.modalDialog.openner_treeGrid.treegrid('reload');//之所以能在这里调用到parent.$.modalDialog.openner_treeGrid这个对象，是因为organization.jsp页面预定义好了
                    parent.$.modalDialog.handler.dialog('close');
                } else {
                    var form = $('#organizationEditForm');
                    parent.$.messager.alert('提示', eval(result.msg), 'warning');
                }
            }
        });
        
    });
</script>
<div style="padding: 3px;">
    <form id="organizationEditForm" method="post">
    <input name="upType" type="hidden"  value="update" >
        <table class="grid">
            <tr>
                <td>编号</td>
                <td><input name="id" type="hidden" ><input name="code" type="text" /></td>
                <td>资源名称</td>
                <td><input name="name" type="text" placeholder="请输入部门名称" class="easyui-validatebox" data-options="required:true" ></td>
            </tr>
            <tr>
                <td>排序</td>
                <td><input name="seq"  class="easyui-numberspinner"  style="widtd: 140px; height: 29px;" required="required" data-options="editable:false"></td>
                <td>菜单图标</td>
                <td ><input name="icon" /></td>
            </tr>
            <tr>
                <td>地址</td>
                <td colspan="3"><input name="address" style="width: 300px;"/></td>
            </tr>
            <tr>
                <td>上级资源</td>
                <td colspan="3"><select id="organizationEditPid" name="pid" style="width: 200px; height: 29px;"></select>
                <a class="easyui-linkbutton" href="javascript:void(0)" onclick="$('#pid').combotree('clear');" >清空</a></td>
            </tr>
        </table>
    </form>
</div>
