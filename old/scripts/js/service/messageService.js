define(['indexApp', 'jquery', 'common/util', 'pikaday', 'jQueryUi', 'timePicker'], function (app, $, util, pikaday) {
   
    app.factory('getAutoSendRemoteData', function ($http) {
       
        var debugFlag = true,                   /* 测试数据标识 */
            loadGet = function (callback) {     /* 带有Loading效果的Ajax[Get]请求 */
                //util.ajaxGet($http, url, callBack, function (err) { alert(err); });
            };
        var viewModel = {
            GetAutoSendList: function (callBack) {                  /* 自动发送的数据列表 */
                if (debugFlag) {
                    var testData = [
                        { "Title": "A计划", "Content": "主题下的内容展示、主题下的内容展示。", "DeptName": "云南鑫湖医院", "StartDate": "2016-05-01", "EndDate": "2016-05-01", "ReWeek": "每天10：00", "Status": 1 },
                        { "Title": "B计划", "Content": "主题下的内容展示、主题下的内容展示。", "DeptName": "广州中西医结合医院", "StartDate": "2016-05-01", "EndDate": "2016-05-01", "ReWeek": "每天11：00", "Status": 1 },
                        { "Title": "C计划", "Content": "主题下的内容展示、主题下的内容展示。", "DeptName": "云南鑫湖医院", "StartDate": "2016-02-01", "EndDate": "2016-04-01", "ReWeek": "每天13：00", "Status": 0 }
                    ];
                    callBack && callBack({ Data: testData });
                } else {
                    //var searchVal = encodeURIComponent($scope.searchVal);
                    var url = "CusGroup/GetGroupCustInfoList?serviceDeptId=4&groupId=38&customNameOrId=&pageSize=10&pageIndex=1";
                    util.ajaxGet($http, url, callBack, function (err) { alert(err); });
                }
            },
            GetDateRange: function (startDateDom, endDateDom) {     /* 初始化开始和结果时间 */
                $.timepicker.dateRange(
		            startDateDom,
		            endDateDom,
		            {
		                changeMonth: true,
		                buttonImageOnly: true,
		                dateFormat: "yy/mm/dd",
		                monthNamesShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
		                dayNamesMin: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
		                minInterval: (1000 * 60 * 60 * 24 * 1), // 1 days
		            }
	            );
            },
            GetSendPlanDDL: function (callBack) {                              /* 初始化推广计划下拉列表 */
                if (debugFlag) {
                    var testData = [
                        { text: "--全部计划--", value: "0" },
                        { text: "计划A", value: "1" },
                        { text: "计划B", value: "2" },
                        { text: "计划C", value: "3" },
                        { text: "计划D", value: "4" },
                        { text: "计划E", value: "5" },
                        { text: "计划F", value: "6" }
                    ];
                    callBack && callBack({ Data: testData });
                } else {

                }
            },
            GetSendDeptDDL: function (callBack) {                              /* 初始化推广机构下拉列表 */
                if (debugFlag) {
                    var testData = [
                        { text: "--全部--", value: "0" },
                        { text: "河南省直三院", value: "1" },
                        { text: "云南鑫湖医院", value: "2" },
                        { text: "广州中西医结合医院", value: "3" }
                    ];
                    callBack && callBack({ Data: testData });
                } else {

                }
            },
            GetSendStatusDDL: function (callBack) {                              /* 初始化执行状态下拉列表 */
                if (debugFlag) {
                    var testData = [
                        { text: "--全部状态--", value: "" },
                        { text: "执行中", value: "1" },
                        { text: "已结束", value: "0" }
                    ];
                    callBack && callBack({ Data: testData });
                } else {

                }
            }
        };

        return viewModel;
    });

    return app;

});