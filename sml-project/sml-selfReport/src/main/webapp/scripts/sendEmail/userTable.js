var userTable = (function () {
    var selectedData = [];//缓存勾选的行
    var onSelectRow = function (rowid, status) {
        var rowObj = $("#user_table").jqGrid("getRowData", rowid);
        rowObj.id = rowid;
        if (status) {
            selectedData.push(rowObj);
        } else {
            var index = selectedData.indexOfObj(rowObj)
            if (index >= 0) {
                selectedData.splice(index, 1);
            }
        }
        var html = "";
        $.each(selectedData, function (i, val) {
            html += (i + 1) + '.  ' + val.fullname + '<br/>';
        });
        $("#selectedUser").empty().append(html);
    };
    var gridComplete = function () {
        var ids = $("#user_table").jqGrid("getDataIDs");//当前全部id
        $.each(selectedData, function (i, val_i) {
            $.each(ids, function (j, val_j) {
                if (val_i.id == val_j) {
                    $("#user_table").jqGrid("setSelection", val_j, false);
                }
            })
        })
    };
    var onSelectAll = function (aRowids, status) {
        selectedData = [];
        $.each(aRowids, function (i, val_i) {
            onSelectRow(val_i, status);
        })
    };
    return {
        getEmails: function () {
            var fullnames = [];
            var emails = [];
            $.each(selectedData, function (i, val) {
                fullnames.push(val.fullname);
                emails.push(val.email);
            })
            return {
                fullnames: fullnames,
                emails: emails
            };
        },
        build: function () {
            $("#user_div").empty().append(
                '  <table id="user_table"></table> ' +
                '<div id="user_pager"></div>'
            );
            var $table = $("#user_table");
            var colNames = ["姓名", "邮箱"];
            var colModel = [
                {name: 'fullname', index: 'fullname', width: 100, align: 'center'},
                {name: 'email', index: 'email', width: 200}
            ];
            $table.jqGrid({
                height: 150,
                datatype: "local",
                colModel: colModel,
                colNames: colNames,
                // pager: "#user_pager",
                // rowNum: 3,
                rownumbers: true, //左边新增一列，显示行顺序号
                rownumWidth: 40,
                multiselect: true, //显示选择框
                multiselectWidth: 30,
                onSelectRow: onSelectRow,
                onSelectAll: onSelectAll,
                gridComplete: gridComplete
            });
            var emailUser = $("#fullname").val();
            var emailAdr = $("#email").val();
            var param = {
                ifId: "srpt-cfg-emailQueryUserMail",
                name: emailUser,
                email: emailAdr
            };
            var url = eastcom.baseURL + "/srpt/rcpt/common/query";
            $.ajax({
                url: url,
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
                    $table.jqGrid("clearGridData");
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].fullname && data[i].email) {
                            $table.jqGrid('addRowData', i + 1, data[i]);
                        }
                    }
                }
            });
        },
        clear: function () {
            var $table = $("#user_table");
            $table.jqGrid("resetSelection");
            selectedData = [];
            $("#selectedUser").empty();
        }
    };
}());


Array.prototype.indexOfObj = function (obj) {
    var reValue = -1;
    for (var i = 0; i < this.length; i++) {
        if (isObjectValueEqual(this[i], obj)) {
            reValue = this.indexOf(this[i]);
            break;
        } else {
            reValue = -1;
        }
    }
    return reValue;
}
function isObjectValueEqual(a, b) {
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);
    if (aProps.length != bProps.length) {
        return false;
    }
    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];
        if (a[propName] !== b[propName]) {
            return false;
        }
    }
    return true;
}