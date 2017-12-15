<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="./common.jsp" %>
<script type="text/javascript">
    var resourceTreeGrid;
    $(function() {
        resourceTreeGrid = $('#resourceTreeGrid').treegrid({
            url : smlManager.getQryUrl('system-resource-qry?NOWRAPPER=true'),
            idField : 'id',
            treeField : 'name',
            parentField : 'pid',
            fit : true,
            fitColumns : false,
            border : false,
            frozenColumns : [ [ {
                title : '编号',
                field : 'id',
                width : 80
            } ] ],
            columns : [ [ {
                field : 'name',
                title : '资源名称',
                width : 150
            }, {
                field : 'urls',
                title : '资源路径',
                width : 300
            }, {
                field : 'open_mode',
                title : '打开方式',
                width : 60
            }, {
                field : 'opened_show',
                title : '菜单状态',
                width : 60
            },{
                field : 'seq',
                title : '排序',
                width : 40
            }, {
                field : 'iconCls',
                title : '图标',
                width : 150
            }, {
                field : 'resource_type_show',
                title : '资源类型',
                width : 80
            }, {
                field : 'pid',
                title : '上级资源ID',
                width : 150,
                hidden : true
            }, {
                field : 'status_show',
                title : '状态',
                width : 60
               
            },{
                field : 'status',
                title : '状态',
                width : 60,
                hidden : true
            }, {
                field : 'action',
                title : '操作',
                width : 130,
                formatter : function(value, row, index) {
                    var str = '';
                    <shiro:hasPermission name="/pages/systemManager/resourceEdit.jsp">
                    			str += $.formatString('<a href="javascript:void(0)" class="resource-easyui-linkbutton-edit" data-options="plain:true,iconCls:\'fi-pencil icon-blue\'" onclick="editResourceFun(\'{0}\');" >编辑</a>', row.id);
                    </shiro:hasPermission>
                    <shiro:hasPermission name="/sml/update/system-resource-up/delete">
                            str += '&nbsp;&nbsp;|&nbsp;&nbsp;';
                            str += $.formatString('<a href="javascript:void(0)" class="resource-easyui-linkbutton-del" data-options="plain:true,iconCls:\'fi-x icon-red\'" onclick="deleteResourceFun(\'{0}\');" >删除</a>', row.id);
                    </shiro:hasPermission>
                            return str;
                }
            } ] ],
            onLoadSuccess:function(data){
                $('.resource-easyui-linkbutton-edit').linkbutton({text:'编辑'});
                $('.resource-easyui-linkbutton-del').linkbutton({text:'删除'});
            },
            toolbar : '#resourceToolbar'
        });
    });

    function editResourceFun(id) {
        if (id != undefined) {
            resourceTreeGrid.treegrid('select', id);
        }
        var node = resourceTreeGrid.treegrid('getSelected');
        if (node) {
        	parent.$.modalDialog.node=node;
            parent.$.modalDialog({
                title : '编辑',
                width : 500,
                height : 350,
                href : '${path}/resourceEdit.jsp',
                buttons : [ {
                    text : '编辑',
                    handler : function() {
                        parent.$.modalDialog.openner_treeGrid = resourceTreeGrid;//因为添加成功之后，需要刷新这个treeGrid，所以先预定义好
                        var f = parent.$.modalDialog.handler.find('#resourceEditForm');
                        f.submit();
                    }
                } ]
            });
        }
    }

    function deleteResourceFun(id) {
        if (id != undefined) {
            resourceTreeGrid.treegrid('select', id);
        }
        var node = resourceTreeGrid.treegrid('getSelected');
        if (node) {
        	if(node.children){
       		 parent.$.messager.alert('提示','['+node.name+'] 有子节点，请先删除!', 'info');
       		 return;
       	}
           parent.$.messager.confirm('询问', '您是否要删除当前资源？', function(b) {
               if (b) {
                   progressLoad();
                   smlManager.update('system-resource-up',{id:node.id,upType:'delete'},function(result){
                           if (result.success) {
                               parent.$.messager.alert('提示', result.msg, 'info');
                               resourceTreeGrid.treegrid('reload');
                           }else{
                               parent.$.messager.alert('提示', result.msg, 'info');
                           }
                           progressClose();
                   });
               }
           });
        }
    }

    function addResourceFun() {
        parent.$.modalDialog({
            title : '添加',
            width : 500,
            height : 350,
            href : '${path }/resourceAdd.jsp',
            buttons : [ {
                text : '添加',
                handler : function() {
                    parent.$.modalDialog.openner_treeGrid = resourceTreeGrid;//因为添加成功之后，需要刷新这个treeGrid，所以先预定义好
                    var f = parent.$.modalDialog.handler.find('#resourceAddForm');
                    f.submit();
                }
            } ]
        });
    }
</script>
<div class="easyui-layout" data-options="fit:true,border:false">
    <div data-options="region:'center',border:false"  style="overflow: hidden;">
        <table id="resourceTreeGrid"></table>
    </div>
</div>
<div id="resourceToolbar" style="display: none;">
	<shiro:hasPermission name="/pages/systemManager/resourceAdd.jsp">
        <a onclick="addResourceFun();" href="javascript:void(0);" class="easyui-linkbutton" data-options="plain:true,iconCls:'fi-plus icon-green'">添加</a>
	</shiro:hasPermission>
</div>