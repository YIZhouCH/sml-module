/**
 * Created by sunjian on 2016/6/2 0002.
 * 任务表
 */

var rowObjs = [];
var taskTable = {
    data: [],
    /*展示邮件任务表*/
    build: function () {
        $("#task_div").empty().append(
            '<table id="task_table"></table>' +
            '<div id="task_pager"></div>'
        );
        var $table = $("#task_table");
        var colNames = ['任务id', '任务名称', '开始时间', '结束时间', '时间类型', '发送时间1', '发送时间2', '报表名称', '收件人', '邮箱', '最后发送时间', '操作',
            '编辑', '删除', '状态'];
        var colModel = [
            {
                name: 'email_id',
                index: 'email_id',
                hidedlg: true,
                hidden: true
            },
            {
                name: 'subject',
                index: 'subject',
                width: 100
            },
            {
                name: 'startTime',
                index: 'startTime',
                hidedlg: true,
                hidden: true
            },
            {
                name: 'endTime',
                index: 'endTime',
                hidedlg: true,
                hidden: true
            },
            {
                name: 'timetype',
                index: 'timetype',
                hidedlg: true,
                hidden: true
            },
            {
                name: 'timepoint',
                index: 'timepoint',
                hidedlg: true,
                hidden: true
            },
            {
                name: 'timeinvokepoint',
                index: 'timeinvokepoint',
                hidedlg: true,
                hidden: true
            },
            {
                name: 'name',
                index: 'name',
                width: 100
            },
            {
                name: 'usernames',
                index: 'usernames',
                width: 100,
                align: 'center'
            },
            {
                name: 'emails',
                index: 'emails',
                width: 200,
                align: 'left'
            },
            {
                name: 'last_exe_time',
                index: 'last_exe_time',
                width: 100,
                align: 'center'
            },
            {
                name: 'sendEmail',
                index: 'sendEmail',
                width: 50,
                align: 'center',
                formatter: function (cellvalue, options, rowObject) {
                    return "<button type='button' class='btn btn-link' onclick='taskTable.sendEmail(\"" + rowObject.email_id +
                        "|" + rowObject.enabled +
                        "\")'><i class='fa fa-paper-plane-o' aria-hidden='true'></i><span style='display: none'>立即发送</span></button>";
                }
            },
            {
                name: 'editEmail',
                index: 'editEmail',
                width: 50,
                align: 'center',
                formatter: function (cellvalue, options, rowObject) {
                    rowObjs.push(rowObject);
                    var conditionStr = rowObject.conditions;
                    var condition = {};
                    if (conditionStr) {
                        condition = JSON.parse(conditionStr);
                    }
                    // return '<button type="button" class="btn btn-link" onclick="taskTable.edit.editEmail(\'' + condition.startTime + '|' +
                    //     condition.endTime + '|' + condition.timeType + '|' + rowObject.enabled + '|' + rowObject.email_id +
                    //     '|' + rowObject.usernames + '|' + rowObject.timetype + '|' + rowObject.timepoint + '|' +
                    //     rowObject.timeinvokepoint + '|' + rowObject.subject + '|' + rowObject.name +
                    //     '\')"><i class="fa fa-pencil-square-o" aria-hidden="true"></i><span style="display: none">编辑</span></button>';
                    return "<button type='button' class='btn btn-link' onclick='taskTable.edit.editEmail(" + options.rowId + ")'><i class='fa fa-pencil-square-o' aria-hidden='true'></i><span style='display: none'>编辑</span></button>";
                }
            },
            {
                name: 'deleteEmail',
                index: 'deleteEmail',
                width: 50,
                align: 'center',
                formatter: function (cellvalue, options, rowObject) {
                    return "<button type='button' class='btn btn-link' onclick='taskTable.confirmAlert(" + rowObject.email_id +
                        ")'><i class='fa fa-trash' aria-hidden='true'></i><span style='display: none'>删除</span></button>";
                }
            },
            {
                name: 'enabled',
                index: 'enabled',
                width: 50,
                align: 'center',
                formatter: function (cellvalue, options, rowObject) {
                    var enabled = rowObject.enabled;
                    if (enabled == 1) {
                        return "<button type='button' class='btn btn-link' onclick='taskTable.changeEnabeType(\"" +
                            rowObject.email_id + "|" + 0 +
                            "\")'><i style='color: green;' class='fa fa-check' aria-hidden='true'></i><span style='display: none'>启用中</span></button>";
                    } else {
                        return "<button type='button' class='btn btn-link' onclick='taskTable.changeEnabeType(\"" +
                            rowObject.email_id + "|" + 1 +
                            "\")'><i style='color:red;' class='fa fa-times' aria-hidden='true'></i><span style='display: none'>禁用中</span></button>";
                    }
                }
            }
        ];
        $table.jqGrid({
            height: 300,
            rowNum: 10,
            datatype: "local",
            colModel: colModel,
            colNames: colNames,
            shrinkToFit: true,
            autoScroll: false,
            pgbuttons: true,
            pager: "#task_pager",
            viewrecords: true,
            pgtext: "{0}共{1}页",
            rownumbers: true, //左边新增一列，显示行顺序号
            ondblClickRow: function (rowid, iRow, iCol, e) {
                taskTable.edit.editEmail(rowid);
            }
        });
        var url = eastcom.baseURL + "/srpt/rcpt/common/query";
        var startTime = $("#startSearchTime").val();
        var endTime = $("#endSearchTime").val();
        var reportName = $("#taskName").val();
        var receptName = $("#receptUser").val();
        var param = {
            ifId: "srpt-cfg-emailQueryResult",
            startTime: startTime,
            endTime: endTime,
            reportName: reportName,
            receptName: receptName
        }
        $.ajax({
            url: url,
            type: "POST",
            async: true,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(param),
            success: function (res) {
                if (res.success) {
                    taskTable.data = res.data;
                }
                $.each(taskTable.data, function (i, val) {
                    $table.jqGrid('addRowData', i + 1, val);
                });
                $table.trigger("reloadGrid");
            }
        })
    },

    confirmAlert: function (id) {
        if (window.confirm('确认删除吗？')) {
            taskTable.deleteEmail(id);
        } else {
            return;
        }
    },
    deleteEmail: function (id) {
        var url = eastcom.baseURL + "/srpt/rcpt/common/update";
        var data = {
            dbId: "srpt",
            tableName: "dm_co_ba_srpt_email",
            type: "delete",
            conditions: ["id"],
            data: {
                id: id.toString()
            }
        };
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            url: url,
            data: JSON.stringify(data),
            async: false,
            error: function (data, status, e) {
                alert("删除失败！");
                taskTable.build();
            },
            success: function (dataObj) {
                var data = JSON.parse(dataObj);
                if (data.resultCode != 0) {
                    alert("删除失败！");
                }
                taskTable.build();
            }
        });
    },

    sendEmail: function (str) { //立即发送邮件   "201606301458|0"
        if (!window.confirm("是否重新发送邮件？")) {
            return
        }
        var arr = str.split("|");
        var id = arr[0];
        var sta = arr[1];
        if (sta == 0) { //未启用
            // if (!window.confirm("当前为未启用状态，确认发送邮件？")) {
            //     return
            // }
        }
        var URL = eastcom.baseURL + "/srpt/rcpt/sendMailNow";
        var param = {
            id: id
        };
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            url: URL,
            data: JSON.stringify(param),
            async: false,
            error: function (data, status, e) {
                Alert("发送失败！");
            },
            success: function (dataObj) {
                var result = JSON.parse(dataObj);
                if (result.success) {
                    Alert("发送成功！");
                } else {
                    Alert("发送失败！");
                }
            }
        });
    },

    cancelSelect: function () {
        var $grid = $("#tableInModal");
        $grid.find("td[aria-describedby='tableInModal_fullname']").each(function () {
            //把已经勾选的去掉
            var trID = this.parentElement.id;
            var $trID = $("#" + trID);
            if ($trID.hasClass("ui-state-highlight")) {
                $trID.click();
            }
        });
        var treeObj = $.fn.zTree.getZTreeObj("tree");
        treeObj.checkNode([], true, true);
        treeObj.setting.view.expandSpeed = ""; //关闭动画效果
        treeObj.expandAll(false); //折叠全部的节点(ztree异步处理，导致有的节点没有完全关闭)
        treeObj.setting.view.expandSpeed = "fast"; //开启动画效果
    },

    changeEnabeType: function (str) {
        var arr = str.split("|");
        var id = arr[0];
        var type = arr[1];
        var URL = eastcom.baseURL + "/srpt/rcpt/common/update";
        var param = {
            dbId: "srpt",
            tableName: "dm_co_ba_srpt_email",
            type: "update",
            conditions: ["id"],
            data: {
                id: id,
                enabled: type
            }
        };
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            url: URL,
            data: JSON.stringify(param),
            async: false,
            error: function (data, status, e) {
                alert("保存失败！")
            },
            success: function (dataObj) {
                var result = JSON.parse(dataObj);
                if (result.resultCode == 0 || result.msg == "success") {
                    taskTable.build();
                }
            }
        });
    }
};


taskTable.edit = (function () {
    var showModal = function () {
        index.showModal("编辑");
    };
    var setInput = function (subject, enabled, taskId) {
        $("#subjectName").val(subject);
        //是否启用
        $("#useable").checked = (enabled == 1);
        $("#taskId").val(taskId)
    };
    var setTime = function (timeType, timepoint, timeinvokepoint, startTime, endTime) {
        // index.time.changeTimeType(timeType);
        if (timeType == "hour") {
            $("#timeType1").checked = true;
            var timeinvokepointArr = timeinvokepoint.split(",");
            $.each(timeinvokepointArr, function (i, val) {
                $("#minUl").find("input[name='min']").each(function () {
                    if ($(this).val() == val) {
                        this.checked = true;
                    }
                })
            });
        }
        if (timeType == "day") {
            $("#timeType2").checked = true;
            var timepointArr = timepoint.split(",");
            $.each(timepointArr, function (i, val_i) {
                $("#hourUl").find("input[name='hour']").each(function () {
                    if ($(this).val() == val_i) {
                        this.checked = true;
                    }
                });
            });
            var timeinvokepointArr = timeinvokepoint.split(",");
            $.each(timeinvokepointArr, function (i, val_i) {
                $("#minUl").find("input[name='min']").each(function () {
                    if ($(this).val() == val_i) {
                        this.checked = true;
                    }
                })
            })
        }
        if (timeType == "week") {
            $("#timeType3").checked = true;
            var timepointArr = timepoint.split(",");
            $.each(timepointArr, function (i, val_i) {
                var timepointEach = val_i.split("_");
                var week = timepointEach[0];
                $("#weekUl").find("input[name='week']").each(function () {
                    if ($(this).val() == week) {
                        this.checked = true;
                    }
                });
                var hour = timepointEach[1];
                $("#hourUl").find("input[name='hour']").each(function () {
                    if ($(this).val() == hour) {
                        this.checked = true;
                    }
                });
            });
            var timeinvokepointArr = timeinvokepoint.split(",");
            $.each(timeinvokepointArr, function (i, val_i) {
                $("#minUl").find("input[name='min']").each(function () {
                    if ($(this).val() == val_i) {
                        this.checked = true;
                    }
                });
            });
        }
        if (timeType == "month") {
            $("#timeType4").checked = true;
            var timepointArr = timepoint.split(",");
            $.each(timepointArr, function (i, val_i) {
                var timepointEach = timepointArr[i].split("_");
                var day = timepointEach[0];
                $("#dayUl").find("input[name='day']").each(function () {
                    if ($(this).val() == day) {
                        this.checked = true;
                    }
                });
                var hour = timepointEach[i];
                $("#hourUl").find("input[name = 'hour']").each(function () {
                    if ($(this).val() == hour) {
                        this.checked = true;
                    }
                });
            });
            var timeinvokepointArr = timeinvokepoint.split(",");
            $.each(timeinvokepointArr, function (i, val_i) {
                $("#minUl").find("input[name = 'min']").each(function () {
                    if ($(this).val() == val_i) {
                        this.checked = true;
                    }
                });
            });
        }
        index.time.addTime();//得出时间结果
        $("#startTime").val(startTime);
        $("#endTime").val(endTime);
    };
    var setTable = function (fullname) {
        var fullnames = fullname.split(",");
        var $table = $("#user_table");
        var ids = $table.jqGrid("getDataIDs");
        $.each(ids, function (i, val_i) {
            var obj = $table.jqGrid("getRowData", val_i);
            $.each(fullnames, function (j, val_j) {
                if (obj.fullname == val_j) {
                    $table.jqGrid("setSelection", val_i, true);
                }
            })

        })
    };
    var setTree = function (name) {
        // reportTree.clear();
        reportTree.clear();
        var treeObj = $.fn.zTree.getZTreeObj("tree");
        if (treeObj) {
            // treeObj.expandAll(false);
            var nodes = treeObj.getNodesByParam("name", name, null);
            /*只有一个勾选情况*/
            $.each(nodes, function (i, val) {
                treeObj.checkNode(val, true, true, true);
                treeObj.expandNode(val, true, true, true);
                openParentNode(val, treeObj);
                reportTree.check(val.id, function () {
                    $.each(rowObjs, function (j, val_j) {
                        if (val_j.report_id == val.id) {
                            var conditions = JSON.parse(val_j.conditions);
                            var m = 0;
                            while (conditions.hasOwnProperty('qry_' + m)) {
                                $("#qry_" + m).val(conditions['qry_' + m]);
                                m++;
                            }
                        }
                    });
                });
            });
        }
    };
    //递归查找父节点并展开父节点
    function openParentNode(node, zTree) {
        //获取当前节点的父节点
        var parentNode = node.getParentNode();
        if (parentNode) {
            //展开父节点
            zTree.expandNode(parentNode, true, true, true);
            //继续递归向上查找
            // openParentNode(parentNode, zTree);
        }
    };
    return {
        editEmail: function (rowId) {
            var data = taskTable.data;
            showModal();

            var rowObj = data[rowId - 1];
            var conditionsStr = rowObj.conditions;
            var condition = {};
            if (conditionsStr) {
                condition = JSON.parse(conditionsStr);
            }
            var startTime = condition.startTime;
            var endTime = condition.endTime;
            var reTimeType = condition.timeType;
            var enabled = rowObj.enabled;
            var emailId = rowObj.email_id;
            var emails = rowObj.emails;
            var usernames = rowObj.usernames;
            var timeType = rowObj.timetype;
            var timepoint = rowObj.timepoint; //01_00,01_01,02_00,02_01
            var timeinvokepoint = rowObj.timeinvokepoint; //00,01
            var subject = rowObj.subject;
            var name = rowObj.name;
            setInput(subject, enabled, emailId);
            setTree(name);
            setTime(timeType, timepoint, timeinvokepoint, startTime, endTime);
            setTable(usernames);
        }
    };
}());


//201606010000  -->  2016-06-01 11:42
function changeTime(time) {
    var year = time.substring(0, 4);
    var month = time.substring(4, 6);
    var day = time.substring(6, 8);
    var hour = time.substring(8, 10);
    var min = time.substring(10, 12);
    return year + "-" + month + "-" + day + " " + hour + ":" + min;
}

//自动关闭提示框

function Alert(str) {
    var msgw, msgh, bordercolor;
    msgw = 350; //提示窗口的宽度
    msgh = 80; //提示窗口的高度
    titleheight = 25; //提示窗口标题高度
    bordercolor = "#336699"; //提示窗口的边框颜色
    titlecolor = "#99CCFF"; //提示窗口的标题颜色
    var sWidth, sHeight;
    //获取当前窗口尺寸
    sWidth = document.body.offsetWidth;
    sHeight = document.body.offsetHeight;
    //背景div
    var bgObj = document.createElement("div");
    bgObj.setAttribute('id', 'alertbgDiv');
    bgObj.style.position = "absolute";
    bgObj.style.top = "0";
    bgObj.style.background = "#E8E8E8";
    bgObj.style.filter = "progid:DXImageTransform.Microsoft.Alpha(style=3,opacity=25,finishOpacity=75";
    bgObj.style.opacity = "0.6";
    bgObj.style.left = "0";
    bgObj.style.width = sWidth + "px";
    bgObj.style.height = sHeight + "px";
    bgObj.style.zIndex = "10000";
    document.body.appendChild(bgObj);
    //创建提示窗口的div
    var msgObj = document.createElement("div");
    msgObj.setAttribute("id", "alertmsgDiv");
    msgObj.setAttribute("align", "center");
    msgObj.style.background = "white";
    msgObj.style.border = "1px solid " + bordercolor;
    msgObj.style.position = "absolute";
    msgObj.style.left = "50%";
    msgObj.style.font = "12px/1.6em Verdana, Geneva, Arial, Helvetica, sans-serif";
    //窗口距离左侧和顶端的距离
    msgObj.style.marginLeft = "-225px";
    //窗口被卷去的高+（屏幕可用工作区高/2）-150
    msgObj.style.top = document.body.scrollTop + (window.screen.availHeight / 2) - 150 + "px";
    msgObj.style.width = msgw + "px";
    msgObj.style.height = msgh + "px";
    msgObj.style.textAlign = "center";
    msgObj.style.lineHeight = "25px";
    msgObj.style.zIndex = "10001";
    document.body.appendChild(msgObj);
    //提示信息标题
    var title = document.createElement("h4");
    title.setAttribute("id", "alertmsgTitle");
    title.setAttribute("align", "left");
    title.style.margin = "0";
    title.style.padding = "3px";
    title.style.background = bordercolor;
    title.style.filter =
        "progid:DXImageTransform.Microsoft.Alpha(startX=20, startY=20, finishX=100, finishY=100,style=1,opacity=75,finishOpacity=100);";
    title.style.opacity = "0.75";
    title.style.border = "1px solid " + bordercolor;
    title.style.height = "18px";
    title.style.font = "12px Verdana, Geneva, Arial, Helvetica, sans-serif";
    title.style.color = "white";
    title.innerHTML = "提示信息";
    document.getElementById("alertmsgDiv").appendChild(title);
    //提示信息
    var txt = document.createElement("p");
    txt.setAttribute("id", "msgTxt");
    txt.style.margin = "16px 0";
    txt.innerHTML = str;
    document.getElementById("alertmsgDiv").appendChild(txt);
    //设置关闭时间
    window.setTimeout("closewin()", 2000);
}

function closewin() {
    document.body.removeChild(document.getElementById("alertbgDiv"));
    document.getElementById("alertmsgDiv").removeChild(document.getElementById("alertmsgTitle"));
    document.body.removeChild(document.getElementById("alertmsgDiv"));
}