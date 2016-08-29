define([], function () {
     String.prototype.trim=function(){
　　    return this.replace(/(^\s*)|(\s*$)/g, "");
　　 }

　　 String.prototype.ltrim=function(){
　　    return this.replace(/(^\s*)/g,"");
　　 }

　　 String.prototype.rtrim=function(){
　　    return this.replace(/(\s*$)/g,"");
　　 }

    Array.prototype.indexOf = function (val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == val) {
                return i;
            }
        }
        return -1;
    };

    Array.prototype.remove = function (val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };

    String.prototype.checkSpecialCode = function(){
        var containSpecial = RegExp(/[\&\/\%\+\ \#\:]/);
        if (containSpecial.test(this)){
            return true;
        }
        else return false;
    }

    Date.prototype.Format = function (fmt) { //author: meizz 
        var o = {
            "M+": this.getMonth() + 1, //月份 
            "d+": this.getDate(), //日 
            "h+": this.getHours(), //小时 
            "m+": this.getMinutes(), //分 
            "s+": this.getSeconds(), //秒 
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
            "S": this.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    String.prototype.ClearT = function () {
        return this.replace("T", " ");
    }

    String.prototype.ConvertToDate = function () {
        var date=this.replace(/-/g, "/"); //为了兼容IE
        date = new Date(this);
        return date;
    }

    String.prototype.format = function () { // author: gaotang
        if (arguments.length == 0)
            return null;
        var str = arguments[0];
        for (var i = 1; i < arguments.length; i++) {
            var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
            str = str.replace(re, arguments[i]);
        }
        return str;
    }

    Date.prototype.AddDay = function (day) {
        var newDate = new Date(this)
        var timespan = newDate.valueOf()
        timespan = timespan + day * 24 * 60 * 60 * 1000
        newDate = new Date(timespan)
        return newDate;
    } 

    Number.prototype.toPercent = function(){
        return (Math.round(this * 10000)/100) + '%';
        // return (Math.round(this * 10000)/100).toFixed(2) + '%';
    }
})