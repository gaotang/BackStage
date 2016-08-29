define(['indexApp', 'common/util', 'common/const', 'model/journaledModel', 'model/journaledFailModel', 'service/baseService'], function (app, util, Const, JournaledModel, JournaledFailModel) {
  app.controller('journaledCtrl', function ($scope, $http, signValid) {
    signValid.ValidAccess("#/journaled");                       //缓存登录验证
    //侧边栏样式
    $(".nav li:eq(0)").addClass("active").siblings().removeClass("active");

    $scope.RequestTypes = Const.RequestTypes;//请求方
    $scope.curRequest = -1;
    $scope.executeTypes = Const.ExecuteTypes;//执行状态
    $scope.curExecute = -1;
    $scope.urlData = "";
    $scope.postData = "";

    //***************************************接口日志页面*********************************************
    //*****************************获取时间***************************
    var endDate = new Date();
    var startDate = endDate.AddDay(-1);
    $scope.endDate = endDate.Format("yyyy/MM/dd");
    $scope.startDate = startDate.Format("yyyy/MM/dd");
    var failEndDate = new Date();
    var failStartDate = failEndDate.AddDay(-1);
    $scope.failEndDate = failEndDate.Format("yyyy/MM/dd");
    $scope.failStartDate = failStartDate.Format("yyyy/MM/dd");

    //***************************日历************************
    var startDateTextBox = $('#startDate');
    var endDateTextBox = $('#endDate');
    $.timepicker.dateRange(
      startDateTextBox,
      endDateTextBox,
      {
        changeMonth: true,
        buttonImageOnly: true,
        dateFormat: "yy/mm/dd",
        monthNamesShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        dayNamesMin: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        minInterval: (1000 * 60 * 60 * 24 * 0), // 0 days
      }
    );
    var startDateTextBox = $('#failStartDate');
    var endDateTextBox = $('#failEndDate');
    $.timepicker.dateRange(
      startDateTextBox,
      endDateTextBox,
      {
        changeMonth: true,
        buttonImageOnly: true,
        dateFormat: "yy/mm/dd",
        monthNamesShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        dayNamesMin: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        minInterval: (1000 * 60 * 60 * 24 * 0), // 0 days
      }
    );

    //分页插件
    var pageModel = {
      currentPage: 1,    //当前所在的页
      itemsPerPage: 10,  //每页展示的数据条数
      pagesLength: 9,   //分页条目的长度（如果设置建议设置为奇数）
      perPageOptions: [10, 20, 30, 40, 50],    //可选择显示条数的数组
      rememberPerPage: 'perPageItems',  //使用LocalStorage记住所选择的条目数的名称
      onChange: function () {
        getDataList();
      }
    }
    var FailPageModel = {
      currentPage: 1,    //当前所在的页
      itemsPerPage: 10,  //每页展示的数据条数
      pagesLength: 9,   //分页条目的长度（如果设置建议设置为奇数）
      perPageOptions: [10, 20, 30, 40, 50],    //可选择显示条数的数组
      rememberPerPage: 'perPageItems',  //使用LocalStorage记住所选择的条目数的名称
      onChange: function () {
        getFailDataList();
      }
    }
    //*****************************获取接口日志数据*************************************
    var getDataList = function () {
      var curRequest = "";
      var curExecute = "";

      if ($scope.curRequest != -1) {
        curRequest = $scope.curRequest;
      }
      if ($scope.curExecute != -1) {
        curExecute = $scope.curExecute;
      }
      $scope.dataList = [];

      var url = "UjkRedoRequest/GetApiLog?Type=" + curRequest + "&start=" + $scope.startDate + "&end=" + $scope.endDate + "&url=" + $scope.urlData + "&IsSuccess=" + curExecute + "&PostData=" + $scope.postData + "&pageIndex=" + pageModel.currentPage + "&pageSize=" + pageModel.itemsPerPage;
      var successCallback = function (result) {
        if (result.state == 1) {
          $scope.dataList = [];
          for (var i = 0; i < result.Data.Data.length; i++) {
            var model = new JournaledModel();
            datamodel = result.Data.Data[i];
            model.convertFrom(datamodel);
            $scope.dataList.push(model);


            if ($scope.dataList[i].IsSuccess) {
              $scope.dataList[i].IsOr = "成功";
            }
            else {
              $scope.dataList[i].IsOr = "失败";
            }
            if ($scope.dataList[i].Type == "FromHZ") {
              $scope.dataList[i].DeptName = "上海好卓";
            }
            else if ($scope.dataList[i].Type == "FromYJK") {
              $scope.dataList[i].DeptName = "杭州优健康";
            }
            else if ($scope.dataList[i].Type == "FromDC") {
              $scope.dataList[i].DeptName = "数据中心";
            }
            else {
              $scope.dataList[i].DeptName = "未知";

            }
          }
          $scope.pageConf = pageModel;
          $scope.pageConf.totalItems = result.Data.Count;
        }
      }
      var errorCallback = function (error) {

      }
      util.ajaxGet($http, url, successCallback, errorCallback);
    }
    getDataList();
    $scope.getItemData = function (data) {
      debugger
      $scope.curData = data;

    }

    //*******************************查询********************************
    $scope.inquiryData = function () {
      if ($("#startDate").val() && $("#endDate").val()) {
        $scope.startDate = $("#startDate").val();
        $scope.endDate = $("#endDate").val();
      }
      getDataList();
    }

    //*******************************清空三个月前的数据********************************
    $scope.deleteData = function () {
      var url = "UjkRedoRequest/DataCleaning";
      data = {};

      var successCallback = function (result) {
        if (result.state == 1) {
          util.showFade("操作成功");
          getDataList();
        }

      }
      var errorCallback = function (error) {

      }
      util.ajaxPost($http, url, data, successCallback, errorCallback);

    }

    //*************************************失败重发页面*****************************
    //获取失败日志
    var getFailDataList = function () {
      var url = "UjkRedoRequest/GetAllFail?start=" + $scope.failStartDate + "&end=" + $scope.failEndDate + "+&pageIndex=" + FailPageModel.currentPage + "&pageSize=" + FailPageModel.itemsPerPage;
      var successCallback = function (result) {
        if (result.state == 1) {
          $scope.failDataList = [];
          for (var i = 0; i < result.Data.Data.length; i++) {
            var model = new JournaledFailModel();
            model.convertFrom(result.Data.Data[i]);
            $scope.failDataList.push(model);
          }


          $scope.failPageConf = FailPageModel;
          $scope.failPageConf.totalItems = result.Data.Count;


        }
      }
      var errorCallback = function (error) {

      }
      util.ajaxGet($http, url, successCallback, errorCallback);
    }
    $scope.again = function () {
      getFailDataList();
    }

    //查询
    $scope.inquiryFailData = function () {
      if ($("#failStartDate").val() && $("#failEndDate").val()) {
        $scope.failStartDate = $("#failStartDate").val();
        $scope.failEndDate = $("#failEndDate").val();
      }
      getFailDataList();
    }
  });
});
