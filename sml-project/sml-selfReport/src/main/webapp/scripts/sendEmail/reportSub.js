$(function () {

    reportSub.init();
});


var reportSub = window.reportSub || {};

//报表订阅任务数据
reportSub.task_data = [];
//当前用户信息
reportSub.user_info = {};
//时间粒度
reportSub.time_type = '';
//缓存时间选择框的结果时间
reportSub.result_time = [];
//勾选的用户或邮箱
reportSub.users_selected = [];
//打开modal 默认为新增
reportSub.modal_type = 'insert';

/**
 * @Author: admin
 * @param:
 * @Description: 页面初始化
 * @Date: 10:31 2017/7/12
 */
reportSub.init = function () {

    reportSub.buildReportTable();
    reportSub.getUserInfo();
    reportSub.buildReportTree();
    reportSub.buildUserTable();

    $("#search").click(function () {
        reportSub.buildReportTable();
    })

    $("#addEmailTask").click(function () {

        reportSub.resetModal();
        $("#modal").modal('show');
        reportSub.modal_type = 'insert';
        $("#modalLabel").text('新增报表订阅');
        reportSub.resetModal();
        $("#usersSelected").html('');
    })

    $("input[name='timeType']").click(function () {
        var timeType = $(this).val();

        reportSub.time_type = timeType;
        reportSub.changeTimeType(timeType);
    })

    $("#add").click(function () {
        reportSub.addTime();
    })

    $("#allDelete").click(function () {
        $("#resUI").html('');
        $(this).addClass('disabled');
        $("#delete").addClass('disabled');
    })

    $("#delete").click(function () {
        reportSub.deleteTime();
    })

    $("#saveTask").click(function () {
        reportSub.saveTask();
    })

    $("#startTime").keyup(function () {
        reportSub.onKeyUp('start');
    })

    $("#endTime").keyup(function () {
        reportSub.onKeyUp('end');
    })
}


/**
 * @Author: admin
 * @param:
 * @Description: 获得当前的用户信息
 * @Date: 13:17 2017/7/7
 */
reportSub.getUserInfo = function () {
    $.ajax({
        url: eastcom.baseURL + '/sysmng/security/getCurrentUserBaseInfo',
        type: "POST",
        async: false,
        dataType: "json",
        contentType: "application/json",
        success: function (res) {
            if (res.success) {
                reportSub.user_info = res.data;
            }
        }
    })
}


/**
 * @Author: admin
 * @param:
 * @Description: 报表订阅任务配置表格
 * @Date: 10:08 2017/7/6
 */
reportSub.buildReportTable = function () {

    $("#reportTask_div").html([
        '<table id="reportTask_table"></table>',
        '<div id="reportTask_pager"></div>'
    ].join(''));

    var $table = $("#reportTask_table");

    var colModel = [
        {
            name_CN: '操作',
            name: 'sendEmail',
            index: 'sendEmail',
            width: 50,
            align: 'center',
            frozen: true,
            formatter: function (val, opt, obj) {

                return [
                    "<button type='button' class='btn btn-link' onclick='reportSub.sendEmail(" + obj.email_id + ")'>",
                    "   <i class='fa fa-paper-plane-o' aria-hidden='true'></i>",
                    "   <span style='display: none'>立即发送</span>",
                    "</button>"
                ].join("");
            }
        },
        {
            name_CN: '编辑',
            name: 'editEmail',
            index: 'editEmail',
            width: 50,
            align: 'center',
            frozen: true,
            formatter: function (val, opt, obj) {

                return [
                    "<button type='button' class='btn btn-link' onclick='reportSub.editEmail(" + opt.rowId + ")'>",
                    "   <i class='fa fa-pencil-square-o' aria-hidden='true'></i>",
                    "   <span style='display: none'>编辑</span>",
                    "</button>"
                ].join('');
            }
        },
        {
            name_CN: '删除',
            name: 'deleteEmail',
            index: 'deleteEmail',
            width: 50,
            align: 'center',
            frozen: true,
            formatter: function (val, opt, obj) {

                return [
                    "<button type='button' class='btn btn-link' onclick='reportSub.deleteEmail(" + obj.email_id + ")'>",
                    "   <i class='fa fa-trash' aria-hidden='true'></i>",
                    "   <span style='display: none'>删除</span>",
                    "</button>"
                ].join("");
            }
        },
        {
            name_CN: '状态',
            name: 'enabled',
            index: 'enabled',
            width: 50,
            align: 'center',
            frozen: true,
            formatter: function (cellvalue, options, rowObject) {

                var enabled = rowObject.enabled;
                if (enabled == 1) {

                    return [
                        "<button type='button' class='btn btn-link' onclick='reportSub.changeState(" + rowObject.email_id + ")'>",
                        "   <i style='color: green;' class='fa fa-check' aria-hidden='true'></i>",
                        "   <span style='display: none'>启用中</span>",
                        "</button>",
                    ].join("");
                } else {

                    return [
                        "<button type='button' class='btn btn-link' onclick='reportSub.changeState(" + rowObject.email_id + ")'>",
                        "   <i style='color:red;' class='fa fa-times' aria-hidden='true'></i>",
                        "   <span style='display: none'>禁用中</span>",
                        "</button>"
                    ].join("");
                }
            }
        },
        {
            name_CN: '任务id',
            name: 'email_id',
            index: 'email_id',
            align: 'center',
            hidedlg: true,
            hidden: true
        },
        {
            name_CN: '任务名称',
            name: 'subject',
            index: 'subject',
            align: 'center',
            width: 230
        },
        {
            name_CN: '开始时间',
            name: 'startTime',
            index: 'startTime',
            align: 'center',
            hidedlg: true,
            hidden: true
        },
        {
            name_CN: '结束时间',
            name: 'endTime',
            index: 'endTime',
            align: 'center',
            hidedlg: true,
            hidden: true
        },
        {
            name_CN: '时间类型',
            name: 'timetype',
            index: 'timetype',
            align: 'center',
            hidedlg: true,
            hidden: true
        },
        {
            name_CN: '发送时间1',
            name: 'timepoint',
            index: 'timepoint',
            align: 'center',
            hidedlg: true,
            hidden: true
        },
        {
            name_CN: '发送时间2',
            name: 'timeinvokepoint',
            index: 'timeinvokepoint',
            align: 'center',
            hidedlg: true,
            hidden: true
        },
        {
            name_CN: '报表名称',
            name: 'name',
            index: 'name',
            align: 'center',
            width: 230
        },
        {
            name_CN: '收件人',
            name: 'usernames',
            index: 'usernames',
            align: 'center',
            width: 320,
            align: 'center'
        },
        {
            name_CN: '邮箱',
            name: 'emails',
            index: 'emails',
            align: 'center',
            width: 320,
            align: 'left'
        },
        {
            name_CN: '最后发送时间',
            name: 'last_exe_time',
            index: 'last_exe_time',
            align: 'center',
            width: 200,
            align: 'center'
        }
    ];

    var colNames = [];
    $.each(colModel, function (i, obj) {
        colNames.push(obj.name_CN);
    })

    $table.jqGrid({
        height: 330,
        rowNum: 10,
        datatype: "local",
        colModel: colModel,
        colNames: colNames,
        shrinkToFit: false,
        autowidth: true,
        autoScroll: false,
        pgbuttons: true,
        pager: "#reportTask_pager",
        viewrecords: true,
        pgtext: "{0}共{1}页",
        rownumbers: true, //左边新增一列，显示行顺序号
        ondblClickRow: function (rowid, iRow, iCol, e) {

            reportSub.editEmail(rowid);
        }
    });
    $table.jqGrid('setFrozenColumns');

    var url = eastcom.baseURL + "/srpt/rcpt/common/query";
    var param = {
        ifId: "srpt-cfg-emailQueryResult",
        startTime: $("#startTime_search").val(),
        endTime: $("#endTime_search").val(),
        reportName: $("#reportName").val(),
        receptName: $("#receptName").val()
    }
    $.ajax({
        url: eastcom.baseURL + "/srpt/rcpt/common/query",
        type: "POST",
        async: true,
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(param),
        success: function (res) {

            var data = [];
            if (res.success) {
                data = res.data;
            }

            $.each(data, function (i, val) {
                $table.jqGrid('addRowData', i + 1, val);
            });
            $table.trigger("reloadGrid");

            //缓存数据
            reportSub.task_data = data;
        }
    })
}


/**
 * @Author: sunjian
 * @param: id: 任务id
 * @Description: 立即发送邮件
 * @Date: 10:04 2017/7/6
 */
reportSub.sendEmail = function (id) {

    Confirm({
        msg: '是否立即发送邮件？',
        onOk: function () {
            _send(id);
        }
    })

    function _send(id) {

        var param = {
            id: id
        }
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            url: eastcom.baseURL + "/srpt/rcpt/sendMailNow",
            data: JSON.stringify(param),
            async: true,
            error: function (data, status, e) {
                Alert("发送失败！");
            },
            success: function (res) {

                var result = JSON.parse(res);
                if (result.success) {
                    Alert({
                        msg: '发送成功！'
                    });
                } else {
                    Alert({
                        msg: '发送失败！'
                    });
                }
            }
        });
    }
}


/**
 * @Author: admin
 * @param: id：任务id
 * @Description: 删除报表订阅
 * @Date: 17:03 2017/7/6
 */
reportSub.deleteEmail = function (id) {

    Confirm({
        msg: '是否确定删除该报表订阅任务？',
        onOk: function () {
            _delete(id);
        }
    })

    function _delete(id) {

        var postData = {
            dbId: "srpt",
            tableName: "dm_co_ba_srpt_email",
            type: "delete",
            conditions: ["id"],
            data: {
                id: '' + id
            }
        };
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            url: eastcom.baseURL + "/srpt/rcpt/common/update",
            data: JSON.stringify(postData),
            async: true,
            error: function (data, status, e) {

                Alert({
                    msg: '删除失败！'
                });
            },
            success: function (dataObj) {

                var data = JSON.parse(dataObj);
                if (data.resultCode != 0) {

                    Alert({
                        msg: '删除失败！'
                    });
                } else {

                    Alert({
                        msg: '删除成功！'
                    });
                    reportSub.buildReportTable();
                }
            }
        });
    }
}


/**
 * @Author: admin
 * @param:
 * @Description: 更改报表订阅状态
 * @Date: 10:39 2017/7/7
 */
reportSub.changeState = function (id) {

    var enabled = utils.getObjFromArr(reportSub.task_data, {email_id: "" + id})[0].enabled;
    if (enabled == '1') {
        enabled = '0';
    } else if (enabled == '0') {
        enabled = "1";
    }

    var param = {
        dbId: "srpt",
        tableName: "dm_co_ba_srpt_email",
        type: "update",
        conditions: ["id"],
        data: {
            id: "" + id,
            enabled: enabled
        }
    };
    $.ajax({
        type: 'POST',
        contentType: "application/json",
        url: eastcom.baseURL + "/srpt/rcpt/common/update",
        data: JSON.stringify(param),
        async: true,
        error: function (data, status, e) {
            Alert({
                msg: '操作失败！'
            });
        },
        success: function (dataObj) {
            var result = JSON.parse(dataObj);
            if (result.resultCode == 0 || result.msg == "success") {
                Alert({
                    msg: '操作成功！',
                    onOk: function () {
                        reportSub.buildReportTable();
                    }
                });
            }
        }
    });
}


/**
 * @Author: admin
 * @param:
 * @Description: 创建报表树
 * @Date: 11:19 2017/7/7
 */
reportSub.buildReportTree = function () {

    var param = {
        "username": reportSub.user_info.username,
        "enabled": [2, 3],
        "type": "1",
        "report_name": ""
    };
    $.ajax({
        url: eastcom.baseURL + "/srpt/rcpt/syncQueryReport",
        type: "POST",
        async: true,
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(param),
        beforeSend: function () {
            $("body").mask("加载中，请稍后...");
        },
        complete: function () {
            $("body").unmask();
        },
        success: function (res) {

            var data = [];
            if (res.success) {
                data = res.data;
            }

            _changePropName(data);

            $('#tree').tree({
                data: data,
                onSelect: function (node) {

                    if (node.attributes.type == '1') {
                        reportSub.clickReportTree(node);
                    }
                }
            })
        }
    })

    //对应节点属性
    function _changePropName(data) {

        for (var i = 0; i < data.length; i++) {
            var obj = data[i];
            obj.id = obj.id_;
            obj.text = obj.name_;
            obj.state = 'closed';
            obj.checked = false;
            obj.attributes = {
                enabled: obj.enabled,
                type: obj.type
            };

            if (obj.type == 1) {
                obj.state = 'open';
            }
            _changePropName(obj.children);
        }
    }
}


/**
 * @Author: admin
 * @param:
 * @Description: 点击树图的报表 展示报表的信息
 * @Date: 9:33 2017/7/10
 */
reportSub.clickReportTree = function (node) {

    _setReportInfo(node);
    var param = {
        ifId: "srpt-cfg-reportInfo",
        report_id: node.id
    };
    $.ajax({
        url: eastcom.baseURL + "/srpt/rcpt/common/query",
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

            if (!utils.isEmptyObject(data)) {

                var qry_bd_info = JSON.parse(data.qry_bd_info);
                _showTimeType(qry_bd_info.time.query_param);

                if (qry_bd_info.otherCondition.length > 0)
                    _showOhtherCondition(qry_bd_info.otherCondition);
            }
        }
    })

    function _setReportInfo(node) {

        $('#tree').tree('check', node.target);
        $("#subjectName").val(node.text);
        $("#useable").attr('checked', true);
        $("#startTime").val(-5);
        $("#endTime").val(0);
    }

    //[["hour","day","week","month"]]
    function _showTimeType(query_param) {

        $("input[name='timeType']").parent().hide();
        var timeTypes = query_param[0];
        for (var i = 0; i < timeTypes.length; i++) {

            $("#timeType_" + timeTypes[i]).parent().show();
            // $("#timeType_" + timeTypes[0]).attr('checked', true);
            $("#timeType_" + timeTypes[0]).get(0).click();
        }
    }

    //报表额外的条件
    function _showOhtherCondition(otherConditions) {

        var html = ["<div style='border: 1px solid #e8e8e8;padding: 10px;'>"];
        for (var i = 0; i < otherConditions.length; i++) {

            var otherCondition = otherConditions[i],
                id = otherCondition.id,
                isRequire = otherCondition.isRequire,
                label = otherCondition.label,
                type = otherCondition.type,
                visible = "visible",
                xialaType = "";

            if (isRequire == "f_Require") {
                visible = "none";
            }

            /*得到输入框组*/
            html.push("<div style='display: inline-block;padding: 2px;margin-right:40px;'>");
            if (type == "text") {

                html.push(showComponentSource.getshurukuang(350, label, visible, id, type, isRequire));
            } else if (type == "select") {

                xialaType = otherCondition.xialaType;
                html.push(showComponentSource.getxialakuang(350, label, visible, id, type, isRequire, xialaType));
            } else if (type == "checkbox") {

                xialaType = otherCondition.xialaType;
                html.push(showComponentSource.getfuxuankuang(label, id, type, isRequire, xialaType));
            } else if (type == "leftRight") {

                xialaType = otherCondition.xialaType;
                html.push(showComponentSource.getleftrightkuang(label, id, type, isRequire, xialaType));
            } else if (type == "demoselect") {

                html.push(showComponentSource.getdemoselect(label, id, type, isRequire));
            } else if (type == 'conditionToPort') {

                html.push(showComponentSource.getconditionToPort(label, id, type, isRequire));
            } else if (type == 'multiSelectWX') {

            }
            html.push("</div>");
        }

        html.push("</div>");
        $("#otherCondition").html(html.join(''));
    }
}

/**
 * @Author: admin
 * @param:
 * @Description: 点击时间类型变换发送时间
 * @Date: 14:42 2017/7/11
 */
reportSub.changeTimeType = function (timeType) {

    reportSub.clearTimes();

    $("#weekDiv").hide();
    $("#dayDiv").hide();
    $("#hourDiv").hide();
    $("#minDiv").hide();

    $("#weekDiv").parent().show();
    if ('min' == timeType) {

        $("#weekDiv").parent().hide();
    } else if ('hour' == timeType) {

        $("#minDiv").show();
    } else if ('day' == timeType) {

        $("#hourDiv").show();
        $("#minDiv").show();
    } else if ('week' == timeType) {

        $("#weekDiv").show();
        $("#hourDiv").show();
        $("#minDiv").show();
    } else if ('month' == timeType) {

        $("#dayDiv").show();
        $("#hourDiv").show();
        $("#minDiv").show();
    }
}


/**
 * @Author: admin
 * @param:
 * @Description: 时间选择器 增加时间
 * @Date: 15:31 2017/7/11
 */
reportSub.addTime = function () {

    var times = [],
        mins = [], hours = [], weeks = [], days = [];
    if ('hour' == reportSub.time_type) {

        mins = _getCheckedTimes('min');
        $.each(mins, function (i, min) {

            times.push({min: min});
            // times.push('每时 ' + min + '分');
        })
    } else if ('day' == reportSub.time_type) {

        hours = _getCheckedTimes('hour');
        mins = _getCheckedTimes('min');
        $.each(hours, function (i, hour) {

            $.each(mins, function (j, min) {

                times.push({hour: hour, min: min});
                // times.push(hour + ':' + min);
            })
        })
    } else if ('week' == reportSub.time_type) {

        weeks = _getCheckedTimes('week');
        hours = _getCheckedTimes('hour');
        mins = _getCheckedTimes('min');
        $.each(weeks, function (i, week) {

            $.each(hours, function (j, hour) {

                $.each(mins, function (k, min) {

                    times.push({week: week, hour: hour, min: min});
                    // times.push('每' + week + hour + ':' + min);
                })
            })
        })
    } else if ('month' == reportSub.time_type) {

        days = _getCheckedTimes('day');
        hours = _getCheckedTimes('hour');
        mins = _getCheckedTimes('min');
        $.each(days, function (i, day) {

            $.each(hours, function (j, hour) {

                $.each(mins, function (k, min) {

                    times.push({day: day, hour: hour, min: min});
                    // times.push('每月' + day + '号' + hour + ':' + min);
                })
            })
        })
    }

    reportSub.result_time = times;
    reportSub._htmlTimes(times);

    //获得勾选的数组
    function _getCheckedTimes(timeType) {
        var arr = [];
        $('#' + timeType + 'UI input:checked').each(function () {
            arr.push(this.value);
        })
        return arr;
    }
}


/**
 * @Author: admin
 * @param:
 * @Description: 输出得到的时间
 * @Date: 13:24 2017/7/12
 */
reportSub._htmlTimes = function (times) {

    var html = [],
        timeType = reportSub.time_type;

    $.each(times, function (i, time) {

        if (timeType == 'hour') {

            html.push('<li><input type="checkbox" name="res" value="' + time.min + '" />每时 ' + time.min + '分</li>');
        } else if (timeType == 'day') {

            html.push('<li><input type="checkbox" name="res" value="' + time.hour + ',' + time.min + '" />' + time.hour + ':' + time.min + '</li>');
        } else if (timeType == 'week') {

            html.push('<li><input type="checkbox" name="res" value="' + time.week + '_' + time.hour + ',' + time.min + '" />每' + _changeWeekText(time.week) + ' ' + time.hour + ':' + time.min + '</li>');
        } else if (timeType == 'month') {

            html.push('<li><input type="checkbox" name="res" value="' + time.day + '_' + time.hour + ',' + time.min + '" />每月' + (time.day * 1) + '号 ' + time.hour + ':' + time.min + '</li>')
        }
    })

    if (html.length > 0) {

        $("#allDelete").removeClass('disabled');
    } else {

        $("#allDelete").addClass('disabled');
    }

    $("#resUI").html(html.join(''));

    //绑定结果框勾选情况
    $("input[name='res']").click(function () {

        $("#delete").addClass('disabled');
        $("input[name='res']").each(function () {

            if (this.checked) {

                $("#delete").removeClass('disabled');
            }
        })
    })

    function _changeWeekText(week) {
        var week_CN = '';
        switch (week) {
            case '01':
                week_CN = '周一';
                break;
            case '02':
                week_CN = '周二';
                break;
            case '03':
                week_CN = '周三';
                break;
            case '04':
                week_CN = '周四';
                break;
            case '05':
                week_CN = '周五';
                break;
            case '06':
                week_CN = '周六';
                break;
            case '07':
                week_CN = '周日';
                break;
            default:
                week_CN = '';
                break;
        }
        return week_CN;
    }
}


/**
 * @Author: admin
 * @param:
 * @Description: 对已勾选的结果进行删除
 * @Date: 10:45 2017/7/12
 */
reportSub.deleteTime = function () {

    var inputs_checked = [];
    $("input[name='res']").each(function () {

        if (this.checked) {
            inputs_checked.push(this.value);
        }
    })

    reportSub.result_time.filterArr(inputs_checked);
    reportSub._htmlTimes(reportSub.result_time);

    $("#delete").addClass('disabled');
}


/**
 * @Author: admin
 * @param:
 * @Description: 清空时间选择框
 * @Date: 13:32 2017/7/12
 */
reportSub.clearTimes = function () {

    $("#weekUI input").each(function () {
        this.checked = false;
    })

    $("#dayUI input").each(function () {
        this.checked = false;
    })

    $("#hourUI input").each(function () {
        this.checked = false;
    })

    $("#minUI input").each(function () {
        this.checked = false;
    })

    $("#resUI").html('');
}


/**
 * @Author: admin
 * @param:
 * @Description:
 * @Date: 14:18 2017/7/12
 */
reportSub.buildUserTable = function () {

    $("#users_div").html([
        '<table id="users_table"></table>',
        '<div id="users_pager"></div>'
    ].join(''));

    var colModel = [
        {name: 'fullname', index: 'fullname', name_CN: '姓名', width: 50, align: 'center'},
        {name: 'email', index: 'email', name_CN: '邮箱', width: 200}
    ];
    var colNames = [];
    for (var i = 0; i < colModel.length; i++) {
        colNames.push(colModel[i].name_CN);
    }

    $("#users_table").jqGrid({
        rowNum: 99999,
        height: 150,
        datatype: "local",
        colModel: colModel,
        colNames: colNames,
        rownumbers: true,
        rownumWidth: 30,
        multiselect: true,
        multiselectWidth: 20,
        onSelectRow: _onSelectRow,
        onSelectAll: _onSelectAll
    });

    var param = {
        ifId: "srpt-cfg-emailQueryUserMail",
        name: '',
        email: ''
    };
    $.ajax({
        url: eastcom.baseURL + "/srpt/rcpt/common/query",
        type: "POST",
        async: true,
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(param),
        success: function (res) {
            var data = [];
            if (res.success) {
                data = res.data;
            }
            data = data.uniqueByName('email');

            $("#users_table").jqGrid("clearGridData");
            for (var i = 0; i < data.length; i++) {
                if (data[i].fullname && data[i].email) {
                    $("#users_table").jqGrid('addRowData', i + 1, data[i]);
                }
            }
        }
    });

    //勾选行
    function _onSelectRow(rowid, status) {

        var rowData = $("#users_table").jqGrid('getRowData', rowid);
        if (status) {

            reportSub.users_selected.push(rowData);
        } else {

            reportSub.users_selected = utils.deleteByObj(reportSub.users_selected, rowData);
        }

        _htmlUsers();
    }

    //全选
    function _onSelectAll(rowids, status) {

        for (var i = 0; i < rowids.length; i++) {

            _onSelectRow(rowids[i], status);
        }
    }

    //输出勾选结果
    function _htmlUsers() {

        var users_selected = reportSub.users_selected,
            html = [];
        for (var i = 0; i < users_selected.length; i++) {

            html.push('<div>' + (i + 1) + '. ' + users_selected[i].fullname + '</div>');
        }

        $("#usersSelected").html(html.join(''));
    }
}


/**
 * @Author: admin
 * @param:
 * @Description: 保存报表订阅任务
 * @Date: 16:26 2017/7/13
 */
reportSub.saveTask = function () {

    var nodes = $('#tree').tree('getSelected'),
        reportId = nodes.id,
        subjectName = $("#subjectName").val(),
        timeType = reportSub.time_type,
        timeInvokePoint = [],
        timePoint = [],
        enabled = 0,
        userNames = [],
        emails = [],
        usersSelected = reportSub.users_selected,
        startTime = $("#startTime").val(),
        endTime = $("#endTime").val(),
        id = new Date().format("yyyyMMddhhmmss"),
        type = reportSub.modal_type;

    //获得发送时间
    _getSendTime();

    //是否启用
    if ($("#useable").is(':checked')) {
        enabled = 1;
    }

    //获得已勾选的用户名和邮箱
    for (var i = 0; i < usersSelected.length; i++) {
        emails.push(usersSelected[i].email);
        userNames.push(usersSelected[i].fullname);
    }

    //保存前校验
    if (_checkInput()) {

        //报表条件
        var conditions = {
            isContinue: "t",
            timeType: timeType,
            startTime: startTime,
            endTime: endTime,
            discteteTime: "",
            sidx: null,
            sord: "asc"
        };

        //额外的报表条件
        $("#otherCondition input").each(function () {
            conditions[this.id] = this.value;
        })

        var param = {
            dbId: "srpt",
            tableName: "dm_co_ba_srpt_email",
            type: type,
            data: {
                id: id,
                timetype: timeType,
                timeinvokepoint: timeInvokePoint.join(","),
                timepoint: timePoint.join(","),
                report_id: reportId,
                conditions: JSON.stringify(conditions),
                emails: emails.join(','),
                usernames: userNames.join(','),
                enabled: enabled,
                subject: subjectName,
                priority: 0
            }
        };
        if (type == 'update') {
            param.conditions = ["id"];
        }

        $.ajax({
            url: eastcom.baseURL + "/srpt/rcpt/common/update",
            type: "POST",
            async: true,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(param),
            success: function (res) {

                if (res.resultCode == 0 || res.msg == "success") {

                    $("#modal").modal('hide');
                    reportSub.buildReportTable();
                }
            }
        });
    }

    function _checkInput() {

        if (nodes.length == 0) {
            Alert({
                msg: '请先选择报表！'
            })
            return false;
        }

        if ($.trim(subjectName) == '') {
            Alert({
                msg: '请填写任务名称！'
            })
            return false;
        }

        if (timeInvokePoint.length == 0) {
            Alert({
                msg: '请选择发送时间！'
            })
            return false;
        }

        if ($.trim(startTime) == '') {
            Alert({
                msg: '请填写开始时间！'
            })
            return false;
        }

        if ($.trim(endTime) == '') {
            Alert({
                msg: '请填写结束时间！'
            })
            return false;
        }
        return true;
    }

    function _getSendTime() {

        if (timeType == "min") {

            timeInvokePoint.push("");
            timePoint.push("");
        } else if (timeType == "hour") {

            $("#resUI input").each(function () {

                timeInvokePoint.push(this.value);
            });
        } else {

            $("#resUI input").each(function () {

                var value = this.value;
                var valueArr = value.split(",");
                timePoint.push(valueArr[0]);
                timeInvokePoint.push(valueArr[1]);
            });
        }
    }
}


/**
 * @Author: admin
 * @param:
 * @Description: 编辑邮件订阅任务
 * @Date: 13:45 2017/7/14
 */
reportSub.editEmail = function (rowId) {

    reportSub.resetModal();
    $("#modal").modal('show');
    reportSub.modal_type = 'update';
    $("#modalLabel").text('编辑报表订阅');

    var rowObj = reportSub.task_data[rowId - 1],
        conditions = JSON.parse(rowObj.conditions),
        startTime = conditions.startTime,
        endTime = conditions.endTime,
        reTimeType = conditions.timeType,

        enabled = rowObj.enabled,
        emailId = rowObj.email_id,
        emails = rowObj.emails,
        usernames = rowObj.usernames,
        timeType = rowObj.timetype,
        timepoint = rowObj.timepoint, //01_00,01_01,02_00,02_01
        timeinvokepoint = rowObj.timeinvokepoint, //00,01
        subject = rowObj.subject,
        name = rowObj.name,
        report_id = rowObj.report_id;

    //选中报表树
    var node = $("#tree").tree('find', report_id);
    $("#tree").tree('expandTo', node.target);
    $("#tree").tree('select', node.target);

    //任务名称
    $("#subjectName").val(subject);

    //时间粒度
    $("#timeType_" + timeType).attr('checked', true).trigger('click');

    //是否启用
    $("#useable").attr('checked', (enabled == 1));

    //发送时间
    if (timeType == 'hour') {

        var timeinvokepoints = timeinvokepoint.split(',');
        _checkTimes('min', timeinvokepoints);
    } else if (timeType == 'day') {

        var timepoints = timepoint.split(',');
        _checkTimes('hour', timepoints);
        var timeinvokepoints = timeinvokepoint.split(',');
        _checkTimes('min', timeinvokepoints);
    } else if (timeType == 'week') {

        var timepoints = timepoint.split(',');
        $.each(timepoints, function (i, v) {

            var timepointEach = v.split("_");
            var week = timepointEach[0];
            $("#weekUI input").each(function () {

                if (this.value == week)
                    this.checked = true;
            });
            var hour = timepointEach[1];
            $("#hourUI input").each(function () {

                if (this.value == hour)
                    this.checked = true;
            });
        })
        var timeinvokepoints = timeinvokepoint.split(',');
        _checkTimes('min', timeinvokepoints);
    } else if (timeType == 'month') {

        var timepoints = timepoint.split(',');
        $.each(timepoints, function (i, v) {

            var timepointEach = v.split('_');
            var day = timepointEach[0];
            $("#dayUI input").each(function () {

                if (this.value == day)
                    this.checked = true;
            })
            var hour = timepointEach[1];
            $("#hourUI input").each(function () {

                if (this.value == hour)
                    this.checked = true;
            })
        })
        var timeinvokepoints = timeinvokepoint.split(',');
        _checkTimes('min', timeinvokepoints);
    }
    reportSub.addTime();

    //开始时间 结束时间
    $("#startTime").val(startTime);
    $("#endTime").val(endTime);

    //勾选用户邮箱
    var userNameArr = usernames.split(',');
    var ids = $("#users_table").jqGrid('getDataIDs');
    $.each(ids, function (i, v) {

        var rowobj = $("#users_table").jqGrid('getRowData', v);
        $.each(userNameArr, function (j, userName) {

            if (rowobj.fullname == userName)

                $("#users_table").jqGrid('setSelection', v);
        })
    })


    function _checkTimes(timeType, arr) {

        $.each(arr, function (i, v) {

            $("#" + timeType + "UI input").each(function () {

                if (this.value == v)
                    this.checked = true;
            })
        })
    }
}


/**
 * @Author: admin
 * @param:
 * @Description: 模态框恢复初始化
 * @Date: 17:02 2017/7/14
 */
reportSub.resetModal = function () {

    //树图全部折叠
    $("#tree").tree('collapseAll');

    //清空任务名称
    $("#subjectName").val('');

    //初始化时间粒度
    $("input[name='timeType']").parent('show');
    $("input[name='timeType']").attr('checked', false);

    //是否启用
    $("#useable").attr('checked', true);

    //发送时间
    $("#weekUI input").attr('checked', false);
    $("#dayUI input").attr('checked', false);
    $("#hourUI input").attr('checked', false);
    $("#minUI input").attr('checked', false);
    $("#allDelete").trigger('click');

    //开始时间和结束时间
    $("#startTime").val(-1);
    $("#endTime").val(0);

    //用户邮箱
    $("#users_table").trigger("reloadGrid");

    //清空勾选的用户信息
    reportSub.users_selected = [];
}


reportSub.onKeyUp = function (type) {

    //首先判断是否为数字
    var startTime = $("#startTime").val();
    startTime = startTime == '-0' ? '-' : startTime;
    var endTime = $("#endTime").val();
    endTime = endTime == '-0' ? '-' : endTime;
    startTime = /^-[0-9]*/g.exec(startTime);

    if (endTime != '0' && endTime != '') {

        endTime = /^-[0-9]*/g.exec(endTime);
    }
    if (startTime == null) {

        startTime = -1;
    }
    if (endTime == null) {

        endTime = 0;
    }
    if (startTime[0] != '-' && endTime[0] != '-' && startTime[0] * 1 >= endTime[0] * 1) {

        if (type == 'start') {

            startTime = endTime * 1 - 1;
        } else if (type == 'end') {

            endTime = startTime * 1 + 1;
        }
    }

    $("#startTime").val(startTime);
    $("#endTime").val(endTime);
}