<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../commons/global.jsp" %>
<script type="text/javascript">
    $(function() {
    	var user=parent.$.modalDialog.node;
    	var formLst=$.stringToList('id,name,login_name,organization_id@select,sex,age,phone,user_type@select,status@select');
    	for(var i=0;i<formLst.length;i++){
    		var key=formLst[i].split('@');
    		if(key.length==1){
    			$("input[name='"+key+"']").val(user[key]);
    		}else{
    			$(key[1]+"[name='"+key[0]+"']").val(user[key[0]]);
    		}
    	}
        $('#userEditorganizationId').combotree({
            url : smlManager.getQryUrl('system-organization-qry?NOWRAPPER=true'),
            parentField : 'pid',
            lines : true,
            panelHeight : 'auto',
            value : user.organization_id
        });

        $('#userEditRoleIds').combotree({
            parentField : 'pid',
            lines : true,
            panelHeight : 'auto',
            multiple : true,
            required : true,
            cascadeCheck : false,
            value : user.roleIds
        });
        smlManager.get('system-role-qry?NOWRAPPER=true&rows=1000',{},function(result){
			$('#userEditRoleIds').combotree('loadData',result.datas);
		});
        $('#userEditForm').form({
            url : smlManager.getUpUrl('system-user-up','update'),
            onSubmit : function() {
                progressLoad();
                var isValid = $(this).form('validate');
                if (!isValid) {
                    progressClose();
                }
                var sendData=$.serializeObject($('#userEditForm'));
              //password处理
              	if(sendData.password!=null&&sendData.password.length>0){
	                var pass=null;
	                smlManager.post('cmd',"T(org.hw.sml.support.security.CyptoUtils).encode('"+user.salt+"','"+sendData.password+"')",function(result){
	                	if(result.success){
	                		pass=result.data;
	                	}
	                },'sml/cmd/true',false);
	                $("input[name='password']").val(pass);
              	}
                //role处理
                if(sendData.roleIds!=user.roleIds){
                	var roleIds=$.stringToList(sendData.roleIds);
	                var datas=[];
	                $(roleIds).each(function(index,val){
	                	datas.push({id:user.id+val,user_id:user.id,role_id:val});
	                });
	                var delObj=smlManager.clone(smlManager.metaInfo.tables.userRole);
	                var addObj=smlManager.clone(smlManager.metaInfo.tables.userRole);
	                delObj.type='delete';
	                addObj.type='insert';
	                delObj.data={user_id:user.id};
	                addObj.datas=datas;
	                smlManager.update('common/roleGrant',[delObj,addObj],function(result){
						isValid=result.success;                	
	                },null,false);
                }
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
                    var form = $('#userEditForm');
                    parent.$.messager.alert('错误', eval(result.msg), 'error');
                }
            }
        });
    });
</script>
<div class="easyui-layout" data-options="fit:true,border:false">
    <div data-options="region:'center',border:false" title="" style="overflow: hidden;padding: 3px;">
        <form id="userEditForm" method="post">
            <div class="light-info" style="overflow: hidden;padding: 3px;">
                <div>密码不修改请留空。</div>
            </div>
             <input name="upType" value="update" type="hidden">
            <table class="grid">
                <tr>
                    <td>登录名</td>
                    <td><input name="id" type="hidden">
                    <input name="login_name" type="text" placeholder="请输入登录名称" class="easyui-validatebox" data-options="required:true" ></td>
                    <td>姓名</td>
                    <td><input name="name" type="text" placeholder="请输入姓名" class="easyui-validatebox" data-options="required:true" ></td>
                </tr>
                <tr>
                    <td>密码</td>
                    <td><input type="password" name="password"/></td>
                    <td>性别</td>
                    <td><select id="userEditSex" name="sex" class="easyui-combobox" data-options="width:140,height:29,editable:false,panelHeight:'auto'">
                            <option value="0">男</option>
                            <option value="1">女</option>
                    </select></td>
                </tr>
                <tr>
                    <td>年龄</td>
                    <td><input type="text" name="age" style="width: 140px; height: 24px;" class="easyui-numberbox"/></td>
                    <td>用户类型</td>
                    <td><select id="userEditUserType" name="user_type" class="easyui-combobox" data-options="width:140,height:29,editable:false,panelHeight:'auto'">
                            <option value="0">管理员</option>
                            <option value="1">用户</option>
                    </select></td>
                </tr>
                <tr>
                    <td>部门</td>
                    <td><select id="userEditorganizationId" name="organization_id" style="width: 140px; height: 29px;" class="easyui-validatebox" data-options="required:true"></select></td>
                    <td>角色</td>
                    <td><input  id="userEditRoleIds" name="roleIds" style="width: 140px; height: 29px;"/></td>
                </tr>
                <tr>
                    <td>电话</td>
                    <td>
                        <input type="text" name="phone"  style="width: 140px; height: 24px;" class="easyui-numberbox" />
                    </td>
                    <td>用户类型</td>
                    <td><select id="userEditStatus" name="status" class="easyui-combobox" data-options="width:140,height:29,editable:false,panelHeight:'auto'">
                            <option value="0">正常</option>
                            <option value="1">停用</option>
                    </select></td>
                </tr>
            </table>
        </form>
    </div>
</div>