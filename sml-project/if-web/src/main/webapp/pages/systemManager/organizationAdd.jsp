<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../commons/global.jsp" %>
<script type="text/javascript">
    $(function() {
        $('#organizationAddPid').combotree({
        	url:smlManager.getQryUrl('system-organization-qry?NOWRAPPER=true'),
            parentField : 'pid',
            lines : true,
            panelHeight : 'auto'
        });
        
        $('#organizationAddForm').form({
            url :smlManager.getUpUrl('system-organization-up','insert'),
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
                    parent.$.modalDialog.openner_treeGrid.treegrid('reload');
                    parent.$.modalDialog.handler.dialog('close');
                } else {
                    var form = $('#organizationAddForm');
                    parent.$.messager.alert('提示', eval(result.msg), 'warning');
                }
            }
        });
        
    });
</script>
<div style="padding: 3px;">
    <form id="organizationAddForm" method="post">
        <input name="upType" value="insert" type="hidden">
        <table class="grid">
            <tr>
                <td>编号</td>
                <td><input name="code" type="text" placeholder="请输入部门编号" class="easyui-validatebox" data-options="required:true" ></td>
                <td>部门名称</td>
                <td><input name="name" type="text" placeholder="请输入部门名称" class="easyui-validatebox" data-options="required:true" ></td>
                
            </tr>
            <tr>
                <td>排序</td>
                <!-- class="easyui-numberspinner" -->
                <td><input name="seq"  class="easyui-numberspinner" style="width: 140px; height: 29px;" required="required" data-options="editable:false" value="0"></td>
                <td>菜单图标</td>
                <td><input name="icon" value="fi-folder"/></td>
            </tr>
            <tr>
                <td>地址</td>
                <td colspan="3"><input name="address" style="width: 300px;"/></td>
            </tr>
            <tr>
                <td>上级部门</td>
                <td colspan="3"><select id="organizationAddPid" name="pid" style="width:200px;height: 29px;"></select>
                <a class="easyui-linkbutton" href="javascript:void(0)" onclick="$('#organizationAddPid').combotree('clear');" >清空</a></td>
            </tr>
        </table>
    </form>
</div>