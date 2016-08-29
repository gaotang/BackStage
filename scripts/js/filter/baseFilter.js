define(['angular'], function (angular) {

    angular.module('index.baseFilter', [])
        .filter('fomartString', function () {    /* 将Boolean值格式化字符串 */
            return function (input, type) {
                var types = {
                    "YN": { yes: "是", no: "否" },
                    "YN2": { yes: "执行中", no: "已结束" }
                },
                type = type || "YN";
                return input ? types[type].yes : types[type].no;
            };
        })
        .filter('fomartBoolean', function () {      /* 将字符串或数字格式化为Boolean值 */
            return function (input) {
                return input == 1;
            };
        })
        .filter('trim', function () {               /* 清除字符串左右两边的空格 */
            return function (input) {
                if (typeof (input) == "string" || typeof (input) == "number" || typeof (input) == "boolean")
                    return input.toString().trim();
                else return input;
            };
        })
        .filter('ltrim', function () {              /* 清除字符串左的空格 */
            return function (input) {
                if (typeof (input) == "string" || typeof (input) == "number" || typeof (input) == "boolean")
                    return input.toString().ltrim();
                else return input;
            };
        })
        .filter('rtrim', function () {              /* 清除字符串右的空格 */
            return function (input) {
                //console.log('trim');
                if (typeof (input) == "string" || typeof (input) == "number" || typeof (input) == "boolean")
                    return input.toString().rtrim();
                else return input;
            };
        })
        .filter('clearT', function () {              /* 清除字符串右的空格 */
            return function (input) {
                if (typeof (input) == "string" || typeof (input) == "number" || typeof (input) == "boolean")
                    return input.toString().ClearT();
                else return input;
            };
        })
        .filter('clearTime', function () {              /* 清除字符串右的空格 */
            return function (input) {
                if (typeof (input) == "string" || typeof (input) == "number" || typeof (input) == "boolean")
                    return input.toString().ClearT().split(" ")[0];
                else return input;
            };
        })
        .filter('fomartTime', function () {              /* 格式化时间格式 */
            return function (input) {
                if (typeof (input) == "string" && input.indexOf('/') != -1)
                    return input.split('/').join('-');

                return input;
            };
        })
        .filter('stringSub', function () {              /* 清除字符串右的空格 */
            return function (input, len) {
                len = len || 20;
                if (input) {
                    var str = input.toString(), length = str.length;
                    return length > len ? (str.substring(0, len) + "...") : str;
                }
                else return input;
            };
        })
        .filter('fomartDataTarget', function () {      /* 将状态格式为标识字符串 */
            return function (input) {
                var result = "#ending";

                switch (input) {
                    case 0:
                        result = "#stater";
                        break;
                    case 1:
                        break;
                    case 2:
                        result = "#disable";
                        break;
                    default:
                        break;
                }

                return result;
            };
        });

})