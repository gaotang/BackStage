define(['indexApp', 'jquery', 'common/util', 'model/customlistModel', 'model/serviceDeptItemModel', 'service/baseService'], function (app, $, util, customlistModel, serviceDeptItemModel) {
  app.controller('customListCtrl', function ($scope, $http, signValid) {
    signValid.ValidAccess("#/customlist");                       //缓存登录验证
    //侧边栏样式
    $('.nav li:eq(4)').addClass('active').siblings().removeClass('active');

    //搜索
    $scope.searchVal = "";
    $scope.searchResult = function () {
      requestHandler();
    };

    //***********************获取服务机构*******************************

    var requestDeptHandler = function () {
      $scope.defaultSelectValue = -1;
      var url = "Common/GetServiceDeptList";
      var successCallback = function (request) {
        $scope.serviceDeptItems = [];
        var serviceDeptItem = new serviceDeptItemModel();
        serviceDeptItem.Name = "请选择调整后的机构";
        serviceDeptItem.Id = -1;
        $scope.serviceDeptItems.push(serviceDeptItem);
        if (request.Data) {
          for (var i = 0; i < request.Data.length; i++) {
            var serviceDeptItem = new serviceDeptItemModel();
            serviceDeptItem.convertFrom(request.Data[i]);
            $scope.serviceDeptItems.push(serviceDeptItem);
          }
        }
      };
      var errorCallback = function (err) {
        alert(err);
      };
      util.ajaxGet($http, url, successCallback, errorCallback);
    };

    var pageModel = {
      currentPage: 1,    //当前所在的页
      itemsPerPage: 10,  //每页展示的数据条数
      pagesLength: 9,   //分页条目的长度（如果设置建议设置为奇数）
      perPageOptions: [10, 20, 30, 40, 50],    //可选择显示条数的数组
      rememberPerPage: 'perPageItems',  //使用LocalStorage记住所选择的条目数的名称
      onChange: function () {
        requestHandler();
      }
    };

    var successCallback = function (request) {
      var result = request.Data.Data;
      $scope.customers = [];
      if (result) {
        for (var i = 0; i < result.length; i++) {
          var customerModel = new customlistModel();
          customerModel.convertFrom(result[i]);
          $scope.customers.push(customerModel);
        }
        $scope.customers.Count = request.Data.Count;
        $scope.paginationConf = pageModel;
        $scope.paginationConf.totalItems = $scope.customers.Count;
      }
    };
    var errorCallback = function (err) {
      alert(err);
    };

    var requestHandler = function () {
      var searchVal = encodeURIComponent($scope.searchVal);
      var url = "CusGroup/GetGroupCustInfoList?serviceDeptId=4&groupId=38&customNameOrId=" + searchVal + "&pageSize=" + pageModel.itemsPerPage + "&pageIndex=" + pageModel.currentPage;
      util.ajaxGet($http, url, successCallback, errorCallback);
    };
    requestHandler();
    requestDeptHandler();

  });
  return app;
})
