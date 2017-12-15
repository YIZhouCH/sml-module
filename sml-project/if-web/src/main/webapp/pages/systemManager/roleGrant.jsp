<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../commons/global.jsp" %>
<script type="text/javascript">
    var resourceTree;
    var role=	parent.$.modalDialog.node;
    $("input[name='id']").val(role.id);
    $(function() {
        resourceTree = $('#resourceTree').tree({
            url : smlManager.getQryUrl('system-roleResource-qry?NOWRAPPER=true&id='+role.id),
            parentField : 'pid',
            checkbox : true,
            onClick : function(node) {},
            cascadeCheck : false
        });

        $('#roleGrantForm').form({
           // url :smlManager.getUpUrl('system-roleResource-up','grant'),
            onSubmit : function() {
                progressLoad();
                var isValid = $(this).form('validate');
                if (!isValid) {
                    progressClose();
                }
                var checknodes = resourceTree.tree('getChecked');
                var ids = [];
                if (checknodes && checknodes.length > 0) {
                    for ( var i = 0; i < checknodes.length; i++) {
                        ids.push({resource_id:checknodes[i].id,role_id:role.id,id:role.id+checknodes[i].id});
                    }
                }
                var delObj=smlManager.clone(smlManager.metaInfo.tables.roleResource),
                    addObj=smlManager.clone(smlManager.metaInfo.tables.roleResource);
                delObj.conditions=[];
                addObj.conditions=[];
                delObj.type='delete';
                addObj.type='insert';
                delObj.data={role_id:role.id};
                addObj.datas=ids;
                smlManager.update('common/roleGrant',[delObj,addObj],function(result){
        			progressClose();
        			if (result.success) {
                        parent.$.modalDialog.handler.dialog('close');
                    } else {
                        parent.$.messager.alert('错误', result.msg, 'error');
                    }
        		});
                //$('#resourceIds').val(ids);
                return isValid;
            },
            success : function(result) {
            }
        });
    });

    function checkAll() {
        var nodes = resourceTree.tree('getChecked', 'unchecked');
        if (nodes && nodes.length > 0) {
            for ( var i = 0; i < nodes.length; i++) {
                resourceTree.tree('check', nodes[i].target);
            }
        }
    }
    function uncheckAll() {
        var nodes = resourceTree.tree('getChecked');
        if (nodes && nodes.length > 0) {
            for ( var i = 0; i < nodes.length; i++) {
                resourceTree.tree('uncheck', nodes[i].target);
            }
        }
    }
    function checkInverse() {
        var unchecknodes = resourceTree.tree('getChecked', 'unchecked');
        var checknodes = resourceTree.tree('getChecked');
        if (unchecknodes && unchecknodes.length > 0) {
            for ( var i = 0; i < unchecknodes.length; i++) {
                resourceTree.tree('check', unchecknodes[i].target);
            }
        }
        if (checknodes && checknodes.length > 0) {
            for ( var i = 0; i < checknodes.length; i++) {
                resourceTree.tree('uncheck', checknodes[i].target);
            }
        }
    }
</script>
<div id="roleGrantLayout" class="easyui-layout" data-options="fit:true,border:false">
    <div data-options="region:'west'" title="系统资源" style="width: 300px; padding: 1px;">
        <div class="well well-small">
            <form id="roleGrantForm" method="post">
                <input name="id" type="hidden"   readonly="readonly">
                <ul id="resourceTree"></ul>
                <input id="resourceIds" name="resourceIds" type="hidden" />
            </form>
        </div>
    </div>
    <div data-options="region:'center'" title="" style="overflow: hidden; padding: 10px;">
        <div>
            <button class="btn btn-success" onclick="checkAll();">全选</button>
            <br /> <br />
            <button class="btn btn-warning" onclick="checkInverse();">反选</button>
            <br /> <br />
            <button class="btn btn-inverse" onclick="uncheckAll();">取消</button>
        </div>
    </div>
</div>