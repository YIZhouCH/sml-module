<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../commons/global.jsp" %>
<script type="text/javascript">
    $(function() {
    	var id=new Date().getTime();
    	$("input[name='id']").val(id);
    	var salt=smlManager.uuid('guid');
    	$("input[name='salt']").val(salt);
        $('#userAddOrganizationId').combotree({
            url : smlManager.getQryUrl('system-organization-qry?NOWRAPPER=true'),
            parentField : 'pid',
            lines : true,
            panelHeight : 'auto'
        });

        $('#userAddRoleIds').combotree({
            multiple: true,
            required: true,
            panelHeight : 'auto'
        });
		smlManager.get('system-role-qry?NOWRAPPER=true&rows=1000',{},function(result){
			$('#userAddRoleIds').combotree('loadData',result.datas);
		});
        $('#userAddForm').form({
            url : smlManager.getUpUrl('system-user-up','insert'),
            onSubmit : function() {
                progressLoad();
                var isValid = $(this).form('validate');
                var sendData=$.serializeObject($('#userAddForm'));
                if (!isValid) {
                    progressClose();
                }
                //password处理
                var pass=null;
                smlManager.post('cmd',"T(org.hw.sml.support.security.CyptoUtils).encode('"+sendData.salt+"','"+sendData.password+"')",function(result){
                	if(result.success){
                		pass=result.data;
                	}
                },'sml/cmd/true',false);
                $("input[name='password']").val(pass);
                //role处理
                var roleIds=$.stringToList(sendData.roleIds);
                var datas=[];
                $(roleIds).each(function(index,val){
                	datas.push({id:id+val,user_id:id,role_id:val});
                });
                smlManager.add('userRole',datas,function(result){
					isValid=result.success;                	
                },null,false);
                //var lst=$.stringToList($("#userAddRoleIds").val());
               // smlManager.add('userRole',)
                if (!isValid) {
                    progressClose();
                }
                return isValid;
            },
            success : function(result) {
                progressClose();
                result = $.parseJSON(result);
                if (result.success) {
                    parent.$.modalDialog.openner_dataGrid.datagrid('reload');//之所以能在这里调用到parent.$.modalDialog.openner_dataGrid这个对象，是因为user.jsp页面预定义好了
                    parent.$.modalDialog.handler.dialog('close');
                } else {
                    var form = $('#userAddForm');
                    parent.$.messager.alert('提示', eval(result.msg), 'warning');
                }
            }
        });
        
    });
</script>
<div class="easyui-layout" data-options="fit:true,border:false">
    <div data-options="region:'center',border:false" title="" style="overflow: hidden;padding: 3px;">
        <form id="userAddForm" method="post">
        <input name="upType" value="insert" type="hidden">
        <input name="id" type="hidden">
        <input name="salt" type="hidden">
            <table class="grid">
                <tr>
                    <td>登录名</td>
                    <td><input name="login_name" type="text" placeholder="请输入登录名称" class="easyui-validatebox" data-options="required:true" value=""></td>
                    <td>姓名</td>
                    <td><input name="name" type="text" placeholder="请输入姓名" class="easyui-validatebox" data-options="required:true" value=""></td>
                </tr>
                <tr>
                    <td>密码</td>
                    <td><input name="password" type="password" placeholder="请输入密码" class="easyui-validatebox" data-options="required:true"></td>
                    <td>性别</td>
                    <td>
                        <select name="sex" class="easyui-combobox" data-options="width:140,height:29,editable:false,panelHeight:'auto'">
                            <option value="0" selected="selected">男</option>
                            <option value="1" >女</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>年龄</td>
                    <td><input type="text" name="age"  style="width: 140px; height: 24px;" class="easyui-numberbox"/></td>
                    <td>用户类型</td>
                    <td>
                        <select name="user_type" class="easyui-combobox" data-options="width:140,height:29,editable:false,panelHeight:'auto'">
                            <option value="0">管理员</option>
                            <option value="1" selected="selected">用户</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>部门</td>
                    <td><select id="userAddOrganizationId" name="organization_id" style="width: 140px; height: 29px;" class="easyui-validatebox" data-options="required:true"></select></td>
                    <td>角色</td>
                    <td><select id="userAddRoleIds" name="roleIds" style="width: 140px; height: 29px;"></select></td>
                </tr>
                <tr>
                    <td>电话</td>
                    <td>
                        <input type="text" name="phone" style="width: 140px; height: 24px;" class="easyui-numberbox"/>
                    </td>
                    <td>用户状态</td>
                    <td>
                        <select name="status" class="easyui-combobox" data-options="width:140,height:29,editable:false,panelHeight:'auto'">
                                <option value="0">正常</option>
                                <option value="1">停用</option>
                        </select>
                    </td>
                </tr>
            </table>
        </form>
    </div>
</div>