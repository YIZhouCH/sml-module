$(function () {
    taskTable.build();
    reportTree.build();
    userTable.build();
    /*多选框全选监听事件*/
    index.time.checkedBtn("week");
    index.time.checkedBtn("day");
    index.time.checkedBtn("hour");
    index.time.checkedBtn("min");
    index.time.clearTimeType();
    index.time.init();
    setInterval(function () {
        taskTable.build();
    }, 150000);
});

/*页面操作*/
var index = (function () {
            var uniqueArr = function (arr) {
                var result = [],
                    hash = {};
                for (var i = 0, elem;
                     (elem = arr[i]) != null; i++) {
                    if (!hash[elem]) {
                        result.push(elem);
                        hash[elem] = true;
                    }
                }
                return result;
            };
            /*清除内容*/
            var clearModal = function () {
                reportTree.clear();
                userTable.clear();
                $("#subjectName").val("");
                index.time.changeTimeType("hour");
                $("#useable").attr("checked", true);
                $("#reportSetting").empty();
                $("#startTime").val(-5);
                $("#endTime").val(0);
            };
            var getEmails = function () {
                var selectData = userTable.selectedData;
                var emailList = [];
                var userList = [];
                var ids = $("#tableInModal").jqGrid('getGridParam', 'selarrrow');
                var i = ids.length;
                while (i--) {
                    var rowData = $("#tableInModal").jqGrid('getRowData', ids[i]);
                    if (rowData.email == "" || rowData.fullname == "") {
                        alert("用户邮箱信息不能为空，请完善资料再保存！");
                        return false;
                    }
                    emailList.push(rowData.email);
                }
                if (emailList.length == 0) {
                    alert("请勾选关联邮件！");
                }
                emailList = emailTask.base.uniqueArr(emailList); //数组去重，防止出现勾选多个一样的情况
                return emailList.join();
            };
            var getSendTime = function () {
                var timeInvokePoint = [];
                var timePoint = [];
                var timeType = $("input[name='timeType']:checked").val(); //时间粒度
                if (timeType == "min") {
                    timeInvokePoint.push("");
                    timePoint.push("");
                    return {
                        timeInvokePoint: timeInvokePoint,
                        timePoint: timePoint
                    };
                } else if (timeType == "hour") {
                    $("#resUl").find("input[name = 'res']").each(function () {
                        var value = $(this).val();
                        var valueArr = value.split(",");
                        timeInvokePoint.push(valueArr[0]);
                    });
                    if (timeInvokePoint.length == 0) {
                        return false;
                    }
                } else {
                    $("#resUl").find("input[name = 'res']").each(function () {
                        var value = $(this).val();
                        var valueArr = value.split(",");
                        timePoint.push(valueArr[0]);
                        timeInvokePoint.push(valueArr[1]);
                    });
                    if (timePoint.length == 0 && timeInvokePoint.length == 0) {
                        alert("请选择发送时间！");
                        return false;
                    }
                }
                return {
                    timeInvokePoint: uniqueArr(timeInvokePoint),
                    timePoint: uniqueArr(timePoint)
                };
            };
            var getNowTime = function () {
                var myDate = new Date();
                var year = myDate.getFullYear();
                var month = myDate.getMonth() + 1;
                month = (month < 10 ? "0" + month : month);
                var day = myDate.getDate();
                day = (day < 10 ? "0" + day : day);
                var hour = myDate.getHours();
                hour = (hour < 10 ? "0" + hour : hour);
                var minute = myDate.getMinutes();
                minute = (minute < 10 ? "0" + minute : minute);
                return year + "" + month + "" + day + "" + hour + "" + minute;
            };
            return {
                /*展示新增或编辑界面*/
                showModal: function (type) {
                    clearModal();

                    $("#editModal").modal("show");
                    if (type == "add") {
                        $("#editModalLabel").text("新增报表订阅");
                    } else {
                        $("#editModalLabel").text("编辑报表订阅");
                    }
                },
                save: function () {
                    $("#editModal").modal("hide");
                    var reportObj = reportTree.getCheckedNodes();
                    if (typeof (reportObj) == "undefined") {
                        alert("请先勾选报表！");
                        return;
                    }
                    var reportId = reportObj[0].id;
                    var subjectName = $("#subjectName").val();
                    if (subjectName == "") {
                        alert("请输入任务名称！");
                        return;
                    }
                    var sendTime = getSendTime();
                    if (sendTime) {
                        if (sendTime.timePoint.length == 0 && sendTime.timeInvokePoint.length == 0) {
                            alert("请选择发送时间！");
                            return;
                        }
                    } else {
                        return;
                    }
                    var enabled = 0; //是否可用
                    if ($("#useable").attr("checked") == "checked") {
                        enabled = 1;
                    }
                    var selectData = userTable.getEmails();
                    var jqEmails = selectData.emails.join(",");
                    var jqUserNames = selectData.fullnames.join(",");
                    if (jqUserNames.length == 0 || jqEmails.length == 0) {
                        alert("请先勾选发件人！")
                        return;
                    }
                    var timeType = $("input[name='timeType']:checked").val(); //时间粒度

                    var startTime = $("#startTime").val();
                    var endTime = $("#endTime").val();

                    if (startTime == '') {

                        alert('请填写开始时间！');
                        return;
                    }

                    if (endTime == '') {

                        alert('请选择结束时间！');
                        return;
                    }
                    var conditions = {
                        isContinue: "t",
                        timeType: timeType,
                        startTime: startTime,
                        endTime: endTime,
                        discteteTime: "",
                        sidx: null,
                        sord: "asc"
                    };
                    var $input = $("#reportSetting input");
                    for (var i = 0; i < $input.length; i++) {
                        var qry = $input[i].id;
                        conditions[qry] = $($input[i]).val();
                    }
                    var type;
                    var id;
                    //新增的情况
                    if ($("#editModalLabel").text() == "新增报表订阅") {
                        type = "insert";
                        id = getNowTime();
                    } else { //编辑
                        type = "update";
                        id = $("#taskId").val();
                    }
                    var param = {
                        dbId: "srpt",
                        tableName: "dm_co_ba_srpt_email",
                        type: type,
                        data: {
                            id: id,
                            timetype: timeType,
                            timeinvokepoint: sendTime.timeInvokePoint.join(","),
                            timepoint: sendTime.timePoint.join(","),
                            report_id: reportId,
                            conditions: JSON.stringify(conditions),
                            emails: jqEmails,
                            usernames: jqUserNames,
                            enabled: enabled,
                            subject: subjectName,
                            priority: 0
                        }
                    };
                    if ($("#editModalLabel").text() == "编辑报表订阅") {
                        param.conditions = ["id"];
                    }
                    var url = eastcom.baseURL + "/srpt/rcpt/common/update";
                    $.ajax({
                        url: url,
                        type: "POST",
                        async: true,
                        dataType: "json",
                        contentType: "application/json",
                        data: JSON.stringify(param),
                        success: function (res) {
                            if (res.resultCode == 0 || res.msg == "success") {
                                taskTable.build();
                            }
                        }
                    });
                },
            };
        }
        ()
    )
;


index.time = (function () {
    var allchk = function (type) {
        var checkBoxArr = $("input[name='" + type + "']");
        var chknum = checkBoxArr.length;//选项总个数
        var chk = 0;
        $.each(checkBoxArr, function (i, val) {
            if ($(val).attr("checked")) {
                chk++;
            }
        });
        if (chknum == chk) {//全选
            $("#" + type + "All").attr("checked", true);
        } else {//不全选
            $("#" + type + "All").attr("checked", false);
        }
    };

    /*枚举周*/
    var enumWeek = function (week) {
        switch (week) {
            case "01":
                return "每周一";
            case "02":
                return "每周二";
            case "03":
                return "每周三";
            case "04":
                return "每周四";
            case "05":
                return "每周五";
            case "06":
                return "每周六";
            case "07":
                return "每周日";
            default:
                return "每周";
        }
    };
    return {
        init: function () {
            $("#startTime").val(-1);
            $("#endTime").val(0);
        },
        /*时间类型切换*/
        changeTimeType: function (timeType) {
            $("#minUl").find("input[name = 'min']").attr("checked", false);
            $("#hourUl").find("input[name = 'hour']").attr("checked", false);
            $("#weekUl").find("input[name = 'week']").attr("checked", false);
            $("#dayUl").find("input[name = 'day']").attr("checked", false);
            $("#monthUl").find("input[name = 'month']").attr("checked", false);
            $("#resUl").empty();

            $("#minAll").attr("checked", false);//全选按钮清空
            $("#hourAll").attr("checked", false);
            $("#weekAll").attr("checked", false);
            $("#dayAll").attr("checked", false);
            $("#monthAll").attr("checked", false);
            switch (timeType) {
                case "min":
                    $("#timeType5").attr("checked", true);
                    $("#timeType1").attr("checked", false);
                    $("#timeType2").attr("checked", false);
                    $("#timeType3").attr("checked", false);
                    $("#timeType4").attr("checked", false);
                    $("#hourDiv").hide();
                    $("#minDiv").hide();
                    $("#monthDiv").hide();
                    $("#weekDiv").hide();
                    $("#dayDiv").hide();
                    /*按钮组和结果*/
                    $("#btnDiv").hide();
                    $("#resDiv").hide();
                    break;
                case "hour":
                    $("#timeType1").attr("checked", true);
                    $("#timeType2").attr("checked", false);
                    $("#timeType3").attr("checked", false);
                    $("#timeType4").attr("checked", false);
                    $("#timeType5").attr("checked", false);
                    $("#hourDiv").hide();
                    $("#minDiv").show();
                    $("#monthDiv").hide();
                    $("#weekDiv").hide();
                    $("#dayDiv").hide();
                    /*按钮组和结果*/
                    $("#btnDiv").show();
                    $("#resDiv").show();
                    break;
                case "day":
                    $("#timeType1").attr("checked", false);
                    $("#timeType2").attr("checked", true);
                    $("#timeType3").attr("checked", false);
                    $("#timeType4").attr("checked", false);
                    $("#timeType5").attr("checked", false);
                    $("#hourDiv").show();
                    $("#minDiv").show();
                    $("#monthDiv").hide();
                    $("#weekDiv").hide();
                    $("#dayDiv").hide();
                    /*按钮组和结果*/
                    $("#btnDiv").show();
                    $("#resDiv").show();
                    break;
                case "week":
                    $("#timeType1").attr("checked", false);
                    $("#timeType2").attr("checked", false);
                    $("#timeType3").attr("checked", true);
                    $("#timeType4").attr("checked", false);
                    $("#timeType5").attr("checked", false);
                    $("#hourDiv").show();
                    $("#minDiv").show();
                    $("#monthDiv").hide();
                    $("#weekDiv").show();
                    $("#dayDiv").hide();
                    /*按钮组和结果*/
                    $("#btnDiv").show();
                    $("#resDiv").show();
                    break;
                case "month":
                    $("#timeType1").attr("checked", false);
                    $("#timeType2").attr("checked", false);
                    $("#timeType3").attr("checked", false);
                    $("#timeType4").attr("checked", true);
                    $("#timeType5").attr("checked", false);
                    $("#hourDiv").show();
                    $("#minDiv").show();
                    $("#monthDiv").hide();
                    $("#weekDiv").hide();
                    $("#dayDiv").show();
                    /*按钮组和结果*/
                    $("#btnDiv").show();
                    $("#resDiv").show();
                    break;
                default:
                    break;
            }
        },

        /*计算并展示选择的时间*/
        addTime: function () {
            this.deleteTimeAll();
            //添加时间
            var timeType = $("input[name = 'timeType']:checked").val();
            var resArrText = [];
            var resArrValue = [];
            //if hour
            if (timeType == "hour") {
                var timePoint = [];
                $("#minUl").find("input[name = 'min']").each(function () {
                    if ($(this).is(":checked")) {
                        // timePoint.push($(this).val());
                        var sendTimeText = "每时" + $(this).val() + "分";
                        resArrValue.push($(this).val());
                        resArrText.push(sendTimeText);
                    }
                });
            }
            //if day
            if (timeType == "day") {
                var timeInvokePoint = [];
                var timePoint = [];
                $("#hourUl").find("input[name = 'hour']").each(function () {
                    if ($(this).is(":checked")) {
                        timePoint.push($(this).val());
                    }
                });
                $("#minUl").find("input[name = 'min']").each(function () {
                    if ($(this).is(":checked")) {
                        timeInvokePoint.push($(this).val());
                    }
                });
                for (var i = 0; i < timePoint.length; i++) {
                    for (var j = 0; j < timeInvokePoint.length; j++) {
                        var sendTime = [];
                        sendTime.push(timePoint[i]);
                        sendTime.push(timeInvokePoint[j]);
                        resArrValue.push(sendTime);
                        var sendTimeText = timePoint[i] + "：" + timeInvokePoint[j];
                        resArrText.push(sendTimeText);
                    }
                }
            }
            //if week
            if (timeType == "week") {
                var timeInvokePoint = [];
                var timePoint = [];
                var weekArr = [];
                var hourArr = [];
                $("#weekUl").find("input[name = 'week']").each(function () {
                    if ($(this).is(":checked")) {
                        weekArr.push($(this).val());
                    }
                });
                $("#hourUl").find("input[name = 'hour']").each(function () {
                    if ($(this).is(":checked")) {
                        hourArr.push($(this).val());
                    }
                });
                $("#minUl").find("input[name = 'min']").each(function () {
                    if ($(this).is(":checked")) {
                        timeInvokePoint.push($(this).val());
                    }
                });
                for (var i = 0; i < weekArr.length; i++) {
                    for (var j = 0; j < hourArr.length; j++) {
                        for (var k = 0; k < timeInvokePoint.length; k++) {
                            var timePointStr = weekArr[i] + "_" + hourArr[j];
                            timePoint = [];
                            timePoint.push(timePointStr);
                            var sendTime = [];
                            sendTime.push(timePoint);
                            sendTime.push(timeInvokePoint[k]);
                            var sendTimeText = enumWeek(weekArr[i]) + " " + hourArr[j] + "：" +
                                timeInvokePoint[k];
                            resArrText.push(sendTimeText);
                            resArrValue.push(sendTime);
                        }
                    }
                }
            }
            //if month
            if (timeType == "month") {
                var timeInvokePoint = [];
                var timePoint = [];
                var dayArr = [];
                var hourArr = [];
                $("#dayUl").find("input[name = 'day']").each(function () {
                    if ($(this).is(":checked")) {
                        dayArr.push($(this).val());
                    }
                });
                $("#hourUl").find("input[name = 'hour']").each(function () {
                    if ($(this).is(":checked")) {
                        hourArr.push($(this).val());
                    }
                });
                $("#minUl").find("input[name = 'min']").each(function () {
                    if ($(this).is(":checked")) {
                        timeInvokePoint.push($(this).val());
                    }
                });
                for (var i = 0; i < dayArr.length; i++) {
                    for (var j = 0; j < hourArr.length; j++) {
                        for (var k = 0; k < timeInvokePoint.length; k++) {
                            var timePointStr = dayArr[i] + "_" + hourArr[j];
                            timePoint = [];
                            timePoint.push(timePointStr);
                            var sendTime = [];
                            sendTime.push(timePoint);
                            sendTime.push(timeInvokePoint[k]);
                            resArrValue.push(sendTime);
                            var sendTimeText = "每月" + dayArr[i] + "号 " + hourArr[j] + "：" + timeInvokePoint[k];
                            resArrText.push(sendTimeText);
                        }
                    }
                }
            }
            //循环resArr
            var resHtmlStr = "";
            for (var i = 0; i < resArrText.length; i++) {
                resHtmlStr += '<li><input type="checkbox" name="res" value="' + resArrValue[i] + '" />' + resArrText[i] +
                    '</li>';
            }
            $("#resUl").append(resHtmlStr);
        },

        deleteTime: function () {
            $("#resUl").find("input[name = 'res']").each(function () {
                if ($(this).is(":checked")) {
                    // this.parentElement.remove();
                    $(this).parent().remove();
                }
            });
        },

        deleteTimeAll: function () {
            $("#resUl").empty();
        },

        checkedBtn: function (type) {
            //全选或全不选
            $("#" + type + "All").click(function () {
                if (this.checked) {
                    $("input[name='" + type + "']").attr("checked", true);
                } else {
                    $("input[name='" + type + "']").prop("checked", false);
                }
            });
            //设置全选复选框
            $("input[name='" + type + "']").click(function () {
                allchk(type);
            });
        },

        clearTimeType: function () {
            $("#timeType_min").hide();
            $("#timeType_hour").hide();
            $("#timeType_day").hide();
            $("#timeType_week").hide();
            $("#timeType_month").hide();
        },

        changeTime: function (type) {
            var startTime = 1 * $("#startTime").val();
            var endTime = 1 * $("#endTime").val();
            if (type == "start_minus") {
                startTime--;
            }
            if (type == "start_plus") {
                if ((startTime + 1) < endTime)
                    startTime++;
            }
            if (type == "end_minus") {
                if ((startTime + 1) < endTime)
                    endTime--;
            }
            if (type == "end_plus") {
                if (endTime < 0)
                    endTime++;
            }
            $("#startTime").val(startTime);
            $("#endTime").val(endTime);
        }
    };
}());


//开始时间与结束时间
function onKeyUp(type) {

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