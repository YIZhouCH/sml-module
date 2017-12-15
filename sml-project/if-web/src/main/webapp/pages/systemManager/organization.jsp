<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="./common.jsp" %>
<script type="text/javascript">
    var organizationTreeGrid;
    $(function() {
        organizationTreeGrid = $('#organizationTreeGrid').treegrid({
            url :smlManager.getQryUrl('system-organization-qry?NOWRAPPER=true'),
            idField : 'id',
            treeField : 'name',
            parentField : 'pid',
            fit : true,
            fitColumns : false,
            border : false,
            frozenColumns : [ [ 
             {title : 'id',field : 'id',width : 40, hidden : true} 
             ] ],
            columns : [ [ 
             {field : 'code',title : '编号',width : 40},
             {field : 'name',title : '部门名称',width : 180},
             {field : 'seq',title : '排序',width : 40}, 
             {field : 'iconCls',title : '图标',width : 120},
             {width : '130',title : '创建时间',field : 'create_time'},
             {field : 'pid',title : '上级资源ID',width : 150,hidden : true},
             {field : 'address',title : '地址',width : 120} , 
             {field : 'action',title : '操作', width : 130,formatter : function(value, row, index) {
                    var str = '';
                    <shiro:hasPermission name="/pages/systemManager/organizationEdit.jsp">
                            str += $.formatString('<a href="javascript:void(0)" class="organization-easyui-linkbutton-edit" data-options="plain:true,iconCls:\'fi-pencil icon-blue\'" onclick="editOrganizationFun(\'{0}\');" >编辑</a>', row.id);
                     </shiro:hasPermission>
    				<shiro:hasPermission name="/sml/update/system-organization-up/delete">
                            str += '&nbsp;&nbsp;|&nbsp;&nbsp;';
                            str += $.formatString('<a href="javascript:void(0)" class="organization-easyui-linkbutton-del" data-options="plain:true,iconCls:\'fi-x icon-red\'" onclick="deleteOrganizationFun(\'{0}\');" >删除</a>', row.id);
                    </shiro:hasPermission>
                    return str;
                }
            } 
             ] ],
            onLoadSuccess:function(row,data){
                $('.organization-easyui-linkbutton-edit').linkbutton({text:'编辑'});
                $('.organization-easyui-linkbutton-del').linkbutton({text:'删除'});
            },
            toolbar : '#orgToolbar'
        });
    });
    function editOrganizationFun(id) {
        if (id != undefined) { 
            organizationTreeGrid.treegrid('select', id);
        }
        var node = organizationTreeGrid.treegrid('getSelected');
        if (node) {
        	parent.$.modalDialog.node=node;
            parent.$.modalDialog({
                title : '编辑',
                openner_treeGrid:organizationTreeGrid,
                width : 500,
                height : 300,
                href : '${path}/organizationEdit.jsp',
                buttons : [ {
                    text : '编辑',
                    handler : function() {
                       //因为添加成功之后，需要刷新这个treeGrid，所以先预定义好
                       parent.$.modalDialog.openner_treeGrid=organizationTreeGrid;
                        var f = parent.$.modalDialog.handler.find('#organizationEditForm');
                        f.submit();
                    }
                } ]
            });
        }
    }
    
    function deleteOrganizationFun(id) {
        if (id != undefined) {
            organizationTreeGrid.treegrid('select', id);
        }
        var node = organizationTreeGrid.treegrid('getSelected');
        if (node) {
        	if(node.children){
        		 parent.$.messager.alert('提示','['+node.name+'] 有子节点，请先删除!', 'info');
        		 return;
        	}
            parent.$.messager.confirm('询问', '您是否要删除当前资源？', function(b) {
                if (b) {
                    progressLoad();
                    smlManager.update('system-organization-up/delete',{id:node.id,upType:'delete'},function(result){
                            if (result.success) {
                                parent.$.messager.alert('提示', result.msg, 'info');
                                organizationTreeGrid.treegrid('reload');
                            }else{
                                parent.$.messager.alert('提示', result.msg, 'info');
                            }
                            progressClose();
                    });
                }
            });
        }
    }
    
    function addOrganizationFun() {
        parent.$.modalDialog({
            title : '添加',
            width : 500,
            height : 300,
            href : '${path}/organizationAdd.jsp',
            buttons : [ {
                text : '添加',
                handler : function() {
                    parent.$.modalDialog.openner_treeGrid = organizationTreeGrid;
                    var f = parent.$.modalDialog.handler.find('#organizationAddForm');
                    f.submit();
                }
            } ]
        });
    }
</script>
<div class="easyui-layout" data-options="fit:true,border:false">
    <div data-options="region:'center',border:false,"  style="overflow: hidden;background:white;">
        <table id="organizationTreeGrid"></table>
    </div>
    <div id="orgToolbar" style="display:none;">
    <shiro:hasPermission name="/pages/systemManager/organizationAdd.jsp">
            <a onclick="addOrganizationFun();" href="javascript:void(0);" class="easyui-linkbutton" data-options="plain:true,iconCls:'fi-plus icon-green'">添加</a>
    </shiro:hasPermission>
    </div>
</div>