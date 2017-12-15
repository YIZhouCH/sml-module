<%@ page contentType="text/html;charset=utf-8" %>
<%@ page language="java" import="java.util.*" pageEncoding="utf-8" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>互联网管理视图-流量分析</title>
    <%@ include file="/commonSelfReport/jq183.jsp" %>
    <%@ include file="/pages/commonSelfReport/inas-loadmask.jsp" %>
    <%@ include file="/pages/commonSelfReport/inas-my97.jsp" %>
    <%@ include file="/commonSelfReport/bootstrap.jsp" %>
    <%@ include file="/pages/commonSelfReport/jquery-ui-bootstrap.jsp" %>
    <%@ include file="/commonSelfReport/fontawesome/fontawesome4.3.0.jsp" %>
    <%@ include file="/pages/commonSelfReport/inas-common.jsp" %>
    <%@ include file="/pages/commonSelfReport/inas-export.jsp" %>
    <!-- 引入echarts -->
    <%@ include file="/commonSelfReport/echarts.jsp" %>
    <%@ include file="/pages/commonSelfReport/inas-echarts.jsp" %>
    <%@ include file="/pages/commonSelfReport/inas-product-style.jsp" %>
    <%@ include file="/pages/commonSelfReport/inas-eoms.jsp" %>
    <!--自己的js-->
    <script src="${ctx}/scripts/sendEmail/userEmail.js" type="text/javascript"></script>
    <!--添加loading-->
    <script type="text/javascript">

    </script>
    <style>
        body {
            background: white;
        }

        body, div {
            padding: 0;
            margin: 0;
        }

        .content {
            padding: 20px 35px;
        }
    </style>
</head>
<body>
<div class="content">
    <div class="con_itembox" id="con_itembox_query">
        <div class="con_homebox_title">
            <h5>
                <i class="fa fa-envelope-o ecom_icons" aria-hidden="true"></i>
                用户邮箱
            </h5>
        </div>
        <div class="con_item_list">
            <input id="emailId" style="display: none"/>
            <table width="" border="0" cellspacing="0" cellpadding="0" style="margin-top: 10px;"
                   class="search">
                <tbody>
                <tr>
                    <td style="width:70px;">姓名：</td>
                    <td style="width: 130px;">
                        <input type="text" class="inputText" id="name"
                               style="margin-top: 0; height: 34px; width: 90%;"/>
                    </td>
                    <td style="width:70px;">邮箱：</td>
                    <td style="width: 130px;">
                        <input type="text" class="inputText" id="email"
                               style="margin-top: 0; height: 34px; width: 90%;"/>
                    </td>
                    <td style="width:70px;display: none">电话：</td>
                    <td style="width: 130px;">
                        <input type="text" class="inputText" id="phone"
                               style="margin-top: 0; height: 34px; width: 90%;display: none"/>
                    </td>
                    <td style="width: auto;">
                        <button type="button" class="btn btn-primary" onclick="userEmail.search()">查询</button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div style="margin-top: 20px">
        <div style="margin-top: 20px;margin-bottom: 10px;">
            <button type="button" class="btn btn-primary" id="add" onclick="userEmail.addEmail()">新增
            </button>
        </div>
        <div class="con_itembox" style="height: 300px;border: 1px solid #e8e8e8;padding: 10px;">
            <table id="table"></table>
            <div id="pager"></div>
        </div>
    </div>
</div>
<!-- 模态框（Modal） -->
<div class="modal fade" id="myModal" tabindex="-1" role="dialog"
     aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content" style="width: 405px;left: 94px;">
            <div class="modal-header">
                <button type="button" class="close"
                        data-dismiss="modal" aria-hidden="true">
                    &times;
                </button>
                <h4 class="modal-title" id="myModalLabel">

                </h4>
            </div>
            <div class="modal-body">
                <table width="" border="0" cellspacing="0" cellpadding="0" style="margin-top: 10px;"
                       class="search">
                    <tbody>
                    <tr>
                        <td style="width:70px;">姓名：<span style="color:red ;">*</span></td>
                        <td style="width: 130px;">
                            <input type="text" class="inputText" id="addName"
                                   style="margin-top: 0; height: 34px; width: 180%;"/>
                        </td>
                    </tr>
                    <tr>
                        <td style="width:70px;">邮箱：<span style="color:red ;">*</span></td>
                        <td style="width: 130px;">
                            <input type="text" class="inputText" id="addEmail"
                                   style="margin-top: 5px;height: 34px;width: 180%;"/>
                        </td>
                    </tr>
                    <tr style="display: none">
                        <td style="width:70px;">电话：</td>
                        <td style="width: 130px;">
                            <input type="text" class="inputText" id="addPhone"
                                   style="margin-top: 5px;height: 34px;width: 120%;"/>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="modal-footer" style="text-align: center;">
                <button type="button" class="btn btn-default" data-dismiss="modal">
                    关闭
                </button>
                <button type="button" class="btn btn-primary" onclick="userEmail.saveEmail()">
                    确定
                </button>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal -->
</div>
</body>
</html>