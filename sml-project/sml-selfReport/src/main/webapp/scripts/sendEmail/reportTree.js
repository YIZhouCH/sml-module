/*
 * 报表树
 * */
var reportTree = (function () {
    var treeData = [];
    var setNodes = function (data) {
        for (var i = 0; i < data.length; i++) {
            var zNode = {
                id: data[i].id_,
                pId: data[i].parent_id,
                name: data[i].name_,
                open: false,
                nocheck: false
            };
            if (data[i].type == 0) {
                zNode.nocheck = true;
            }
            treeData.push(zNode);
            if (data[i].children.length > 0) {
                setNodes(data[i].children);
            }
        }
    };
    var zTreeOnCheck = function (event, treeId, treeNode) {
        index.time.clearTimeType();
        var reportName = treeNode.name;
        $("#subjectName").val(reportName);
        var reportId = treeNode.id;
        check(reportId, function () {
            /*null*/
        });
    };
    var check = function (reportId, callback) {
        var url = eastcom.baseURL + "/srpt/rcpt/common/query";
        var param = {
            ifId: "srpt-cfg-reportInfo",
            report_id: reportId.toString()
        };
        $.ajax({
            url: url,
            type: "POST",
            async: false,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(param),
            success: function (res) {
                var data = {};
                if (res.success) {
                    data = res.data;
                }
                if (!$.isEmptyObject(data)) {
                    var qry_bd_info = JSON.parse(data.qry_bd_info);
                    var time = {};
                    var otherCondition = {};
                    if (qry_bd_info) {
                        time = qry_bd_info.time;
                        otherCondition = qry_bd_info.otherCondition;
                    }
                    var innerHtml = "";
                    if (otherCondition.length > 0) {
                        innerHtml = "<div style='border: 1px solid #e8e8e8;padding: 10px;padding-left: 0;'>";
                    }
                    $.each(otherCondition, function (i, val) {
                        var id = otherCondition[i].id;
                        var isRequire = otherCondition[i].isRequire;
                        var label = otherCondition[i].label;
                        var type = otherCondition[i].type;
                        var displayflag = "visible";
                        if (isRequire == "f_Require") {
                            displayflag = "none";
                        }
                        /*得到输入框组*/
                        innerHtml += "<div style='display: inline-block;padding: 2px;margin-right:40px;'>";
                        if (type == "text") {
                            innerHtml += showComponentSource.getshurukuang(350, label, displayflag, id, type, isRequire);
                        }
                        if (type == "select") {
                            var xialaType = otherCondition[i].xialaType;
                            innerHtml += showComponentSource.getxialakuang(350, label, displayflag, id, type, isRequire,
                                xialaType);
                        }
                        if (type == "checkbox") {
                            var xialaType = otherCondition[i].xialaType;
                            innerHtml += showComponentSource.getfuxuankuang(label, id, type, isRequire, xialaType);
                        }
                        if (type == "leftRight") {
                            var xialaType = otherCondition[i].xialaType;
                            innerHtml += showComponentSource.getleftrightkuang(label, id, type, isRequire, xialaType);
                        }
                        if (type == "demoselect") {
                            innerHtml += showComponentSource.getdemoselect(label, id, type, isRequire);
                        }
                        innerHtml += "</div>";
                    });
                    innerHtml += "</div>";
                    $("#reportSetting").empty().append(innerHtml);

                    /*时间粒度*/
                    var query_param = time.query_param;
                    var time_type = [];
                    if (query_param) {
                        time_type = query_param[0];
                    }
                    $.each(time_type, function (i, val_i) {
                        if (val_i == "min") {
                            $("#timeType_min").show();
                            index.time.changeTimeType('min');
                        }
                        if (val_i == "hour") {
                            $("#timeType_hour").show();
                            index.time.changeTimeType('hour');
                        }
                        if (val_i == "day") {
                            $("#timeType_day").show();
                            index.time.changeTimeType('day');
                        }
                        if (val_i == "week") {
                            $("#timeType_week").show();
                            index.time.changeTimeType('week');
                        }
                        if (val_i == "month") {
                            $("#timeType_month").show();
                            index.time.changeTimeType('month');
                        }
                    })
                    if (time_type.length == 0) {
                        index.time.changeTimeType("day");
                    }
                    callback(otherCondition);
                }
            }
        });
    };
    var zTreeOnClick = function (event, treeId, treeNode, clickFlag) {
        if (treeNode.isParent == false) {
            $.fn.zTree.getZTreeObj("tree").checkNode(treeNode, true, true);
            zTreeOnCheck(event, treeId, treeNode);
        }
    }

    return {
        check: check,
        /*构建报表树*/
        build: function () {
            var setting = {
                check: {
                    enable: true,
                    chkStyle: "radio",
                    radioType: "all"
                },
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "pId",
                        rootPId: null
                    }
                },
                callback: {
                    onCheck: zTreeOnCheck,
                    onClick: zTreeOnClick
                }
            };
            // var url = eastcom.baseURL + "/srpt/rcpt/syncQueryReportMenu";
            var url = eastcom.baseURL + "/srpt/rcpt/syncQueryReport";//限制
            var userInfo = reportTree.getUserInfo();
            var param = {"username": userInfo.username, "enabled": [2, 3], "type": "1", "report_name": ""};
            $.ajax({
                url: url,
                type: "POST",
                async: true,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(param),
                beforeSend: function () {
                    $("#tree").mask("数据正在加载中，请稍后...");
                },
                complete: function () {
                    $("#tree").unmask();
                },
                success: function (res) {
                    var data = [];
                    if (res.success) {
                        data = res.data;
                    }
                    setNodes(data);
                    $.fn.zTree.init($("#tree"), setting, treeData);
                }
            })
        },
        clear: function () {
            var treeObj = $.fn.zTree.getZTreeObj("tree");
            if (treeObj) {
                treeObj.cancelSelectedNode();//取消全部选中
                treeObj.expandAll(false);//折叠全部
            }
        },
        getCheckedNodes: function () {
            return $.fn.zTree.getZTreeObj("tree").getCheckedNodes(true);
        }
    }
}());

reportTree.getUserInfo = function () {
    var data = {};
    $.ajax({
        url: eastcom.baseURL + '/sysmng/security/getCurrentUserBaseInfo',
        type: "POST",
        async: false,
        dataType: "json",
        contentType: "application/json",
        success: function (res) {
            if (res.success) {
                data = res.data;
            }
        }
    })
    return data;
}