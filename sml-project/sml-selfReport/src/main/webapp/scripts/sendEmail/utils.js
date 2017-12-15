var utils = window.utils || {};

/**
 * @Author: admin
 * @param:
 *      obj = {xx:yy,aa:bb}
 *      arr = [{xx:yy,aa:bb},{xx:yy,aa:bb}]
 * @Description: 获得数组中对应的对象
 * @Date: 17:29 2017/7/6
 */
utils.getObjFromArr = function (arr, obj) {

    var arr_new = [];

    for (var i = 0; i < arr.length; i++) {

        if (utils.isObjInObj(obj, arr[i])) {

            arr_new.push(arr[i]);
        }
    }

    return arr_new;
}


/**
 * @Author: admin
 * @param: obj1 obj2
 * @Description: 对象obj1的属性是否包含于对象obj2属性
 * @Date: 10:02 2017/7/7
 */
utils.isObjInObj = function (obj1, obj2) {
    var bool = true;

    for (var n in obj1) {

        if (!(n in obj2)) {

            return false;
        }
        if (obj1[n] !== obj2[n]) {

            bool = false;
        }
    }
    return bool;
}


/**
 * @Author: admin
 * @param:
 * @Description: 判断对象是否为空对象
 * @Date: 17:38 2017/7/7
 */
utils.isEmptyObject = function (obj) {

    for (var key in obj) {

        return false;
    }
    return true;
}

/**
 * @Author: admin
 * @param: arr为对象数组 obj为对象
 * @Description:
 * @Date: 11:03 2017/7/13
 */
utils.deleteByObj = function (arr, obj) {

    var arrNew = [],
        bool = true;

    for (var i = 0; i < arr.length; i++) {

        bool = true;
        for (var n in obj) {

            if (arr[i][n] == obj[n]) {
                bool = false;
            }
        }

        if (bool) {
            arrNew.push(arr[i]);
        }
    }
    return arrNew;
}


utils.getNowTime = function () {
    var date = new Date();
    return date.format("yyyyMMddhhmmss");
}


/**
 * @Author: admin
 * @param:
 * @Description: 删除数组中包含arr中的元素
 * @Date: 11:12 2017/7/12
 */
Array.prototype.filterArr = function (arr) {

    for (var i = 0; i < arr.length; i++) {

        var index = this.indexOf(arr[i]);
        if (index > -1) {
            this.splice(index, 1);
        }
    }
}

/**
 * @Author: admin
 * @param:
 * @Description: 找到数组中对应元素的下标
 * @Date: 11:12 2017/7/12
 */
Array.prototype.indexOf = function (val) {

    for (var i = 0; i < this.length; i++) {

        if (this[i] == val) return i;
    }
    return -1;
};


/**
 * @Author: admin
 * @param:
 * @Description: 数组去重
 * @Date: 13:58 2017/7/13
 */
Array.prototype.unique = function () {
    var result = [],
        isRepeated;

    for (var i = 0, len = this.length; i < len; i++) {
        isRepeated = false;

        for (var j = 0, leng = result.length; j < leng; j++) {

            if (this[i] == result[j]) {
                isRepeated = true;
                break;
            }
        }
        if (!isRepeated) {
            result.push(this[i]);
        }
    }
    return result;
}


/**
 * @Author: admin
 * @param:
 * @Description: 对象数组针对某一属性去重
 * @Date: 13:58 2017/7/13
 */
Array.prototype.uniqueByName = function (name) {
    var result = [],
        isRepeated;

    for (var i = 0, len = this.length; i < len; i++) {
        isRepeated = false;

        for (var j = 0, leng = result.length; j < leng; j++) {

            if (this[i][name] == result[j][name]) {
                isRepeated = true;
                break;
            }
        }
        if (!isRepeated) {
            result.push(this[i]);
        }
    }
    return result;
}

/**
 * @Author: admin
 * @param:
 * @Description: 日期格式化函数
 * @Date: 11:28 2017/7/14
 */
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, // month
        "d+": this.getDate(), // day
        "h+": this.getHours(), // hour
        "m+": this.getMinutes(), // minute
        "s+": this.getSeconds(), // second
        "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
        "S": this.getMilliseconds()
        // millisecond
    }
    if (/(y+)/.test(format))
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4
            - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                ? o[k]
                : ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}