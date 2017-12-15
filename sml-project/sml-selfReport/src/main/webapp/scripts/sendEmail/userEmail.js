$(function () {
    userEmail.buildTable("", "", "");
});
var userEmail = {//初始化表格
    buildTable: function () {
        var url = eastcom.baseURL + "/srpt/rcpt/common/query";
        var colNames = ['姓名', '邮箱', '删除'];
        var colModel = [
            {name: 'name', index: 'name', width: 50, align: 'center', editable: true},
            {name: 'email', index: 'email', width: 200, editable: true},
            {
                name: 'deleteEmail', index: 'deleteEmail', width: 50, align: 'center',
                formatter: function (cellvalue, options, rowObject) {
                    return "<button type='button' class='btn btn-link' onclick='userEmail.confirmAlert(" + rowObject.id + ")'><i class='fa fa-trash' aria-hidden='true'></i><span style='display: none'>删除</span></button>";
                }
            }
            //{name: 'phone', index: 'phone', width: 100}
        ];
        var jsonReader = {
            root: "data",
            repeatitems: true
        };

        $("#table").jqGrid({
            url: url,
            datatype: "json",
            mtype: "POST",
            colNames: colNames,
            colModel: colModel,
            pager: '#pager',
            sortname: 'id',
            viewrecords: true,
            sortorder: "desc",
            caption: "用户邮箱",
            height: '300',
            rownumbers: true,//左边新增一列，显示行顺序号
            jsonReader: jsonReader,
            ajaxGridOptions: { //全局ajax属性, 必须得设置这个值,才能请求到
                contentType: "application/json"
            },
            serializeGridData: function () {
                var param = {
                    ifId: "srpt-cfg-emailQueryUserEmailSelf"
                };
                return JSON.stringify(param);
            },
            ondblClickRow: function (rowid, iRow, iCol, e) {
                //弹出摸态框
                $('#myModal').modal("show");
                $("#myModalLabel").text("编辑");
                var $tds = $("#" + rowid).children();
                var name = $tds.eq(1).text();
                var email = $tds.eq(2).text();
                $("#addName").val(name);
                $("#addEmail").val(email);
                $("#emailId").val(rowid);//保存当前行的id
            },
            rowNum: 0,
            scrollrows: true,//显示行滚动条
            autowidth: true
        });
    },

    search: function () {//查找按钮
        var name = $("#name").val();
        var email = $("#email").val();
        var phone = $("#phone").val();
        $("#table").jqGrid("setGridParam", {
            serializeGridData: function () {
                var param = {
                    ifId: "srpt-cfg-emailQueryUserEmailSelf",
                    name: name,
                    email: email,
                    phone: phone
                };
                return JSON.stringify(param);
            },
            url: eastcom.baseURL + "/srpt/rcpt/common/query",
            datatype: "json",
            ajaxGridOptions: {
                cache: false,
                contentType: "application/json",
                processData: false,
                type: "POST"
            }
        });
        $("#table").trigger("reloadGrid");
    },

    addEmail: function () {//新增按钮
        $('#myModal').modal("show");
        $("#myModalLabel").text("新增");
        $("#addName").val("");
        $("#addEmail").val("");
    },

    checkInput: function (name, email) {
        if (name == "" || email == "") {
            alert("姓名和邮箱不能为空！");
            return false;
        } else {
            return true;
        }
    },
    saveEmail: function () {//确认保存按钮
        var name = $("#addName").val();
        var email = $("#addEmail").val();
        var phone = $("#addPhone").val();
        if (!userEmail.checkInput(name, email)) {
            return;
        }
        $('#myModal').modal("hide");
        //新增
        var type;
        var id;
        if ($("#myModalLabel").text() == "新增") {
            type = "insert";
            id = userEmail.common.getNowTime();
        } else {
            type = "update";
            id = $("#emailId").val();
        }
        var param = {
            "dbId": "srpt",
            "tableName": "DM_CO_BA_SRPT_user_email",
            "type": type,
            "data": {
                "id_": id,
                "name_": name,
                "email_": email,
                "phone_": phone,
                "desc_": ""
            }
        };
        if ($("#myModalLabel").text() == "编辑") {
            param.conditions = ["id_"];
        }
        var url = eastcom.baseURL + "/srpt/rcpt/common/update";
        $.ajax({
            type: 'POST',
            dataType: "json",
            contentType: "application/json",
            url: url,
            data: JSON.stringify(param),
            async: false,
            error: function (data, status, e) {
                alert("保存失败！");
            },
            success: function (dataObj) {
                if (dataObj.resultCode == 0 || dataObj.msg == "success") {
                    $("#table").jqGrid("setGridParam", {
                        serializeGridData: function () {
                            var param = {
                                ifId: "srpt-cfg-emailQueryUserEmailSelf"
                            };
                            return JSON.stringify(param);
                        },
                        url: eastcom.baseURL + "/srpt/rcpt/common/query",
                        datatype: "json",
                        ajaxGridOptions: {
                            cache: false,
                            contentType: "application/json",
                            processData: false,
                            type: "POST"
                        }
                    });
                    $("#table").trigger("reloadGrid");
                }
            }
        });
    },
    confirmAlert: function(id){
        if(window.confirm('确认删除吗？')){
            userEmail.deleteEmail(id);
        }else{
            return;
        }
    },
    deleteEmail: function (id) {//删除按钮
        var param = {
            "dbId": "srpt",
            "tableName": "DM_CO_BA_SRPT_user_email",
            "type": "delete",
            "conditions": ["id_"],
            "data": {
                "id_": id.toString()
            }
        };
        var url = eastcom.baseURL + "/srpt/rcpt/common/update";
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            url: url,
            data: JSON.stringify(param),
            async: false,
            error: function (data, status, e) {
                alert("删除失败！");
            },
            success: function (dataObj) {
                //alert("删除成功！");
                var result = JSON.parse(dataObj);
                if (result.resultCode == 0 || result.msg == "success" ) {
                    userEmail.search();
                }
            }
        });
    },
    common: {//通用方法类
        getNowTime: function () {//获得当前时间
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
            var sec = myDate.getSeconds();
            sec = (sec < 10 ? "0" + sec : sec);
            return year + "" + month + "" + day + "" + hour + "" + minute + "" + sec;
        }
    }
};