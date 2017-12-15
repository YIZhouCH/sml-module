<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ include file="./common.jsp" %>
<script type="text/javascript">
    $(function () {
        $('#sysLogDataGrid').datagrid({
            url: smlManager.getQryUrl('system-syslog-qry?NOWRAPPER=true'),
            striped: true,
            pagination: true,
            singleSelect: true,
            idField: 'id',
            pageSize: 20,
            queryParams:{
            	start:function(){
            		var limit=$('#sysLogDataGrid').datagrid("getPager").pagination("options").pageSize;
            		var page=$('#sysLogDataGrid').datagrid("getPager").pagination("options").pageNumber;
            		return (page-1)*limit;
            	}
            },
            loadFilter:function(data){
            	return {total:data.count,rows:data.datas}
            },
            pageList: [10, 20, 30, 40, 50, 100, 200, 300, 400, 500],
            columns: [[{
                width: '80',
                title: '登录名',
                field: 'login_name',
                sortable: true
            },{
                width: '200',
                title: '模块名称',
                field: 'module_name',
                sortable: true
            } ,{
                width: '100',
                title: 'IP地址',
                field: 'client_ip',
                sortable: true
            },{
                width: '100',
                title: '耗时(ms)',
                field: 'time_cast'
            }, {
                width: '130',
                title: '请求时间',
                field: 'create_time',
                sortable: true
            }, {
                width: '800',
                title: '请求内容',
                field: 'req_content'
            },{
                width: '80',
                title: '请求状态',
                field: 'status'
            }]]
        });
    });
</script>
<div class="easyui-layout" data-options="fit:true,border:false">
    <div data-options="region:'center',border:false">
        <table id="sysLogDataGrid" data-options="fit:true,border:false"></table>
    </div>
</div>