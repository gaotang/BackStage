define(['angular', 'app/injector', 'common/BaseInfoManager', 'common/util', 'router', 'lib/tm.pagination', 'filter/baseFilter'],
  function (angular, injector, BaseManager, Util) {
    var app = angular.module('indexApp', ['ngRoute', 'tm.pagination', 'index.baseFilter']);

    var userInfo = BaseManager.UserInfoManager.GetUserInfo();
    app.config(function ($routeProvider) {
      if (!userInfo) {
        window.location.href = "/login.html";
        return;
      }

      $routeProvider.when('/journaled', {
        templateUrl: 'html/index/journaled.html',
        controller: 'journaledCtrl'
      }).when('/default', {
        templateUrl: 'html/index/home.html',
        controller: 'homeCtrl'
      }).when('/server', {
        templateUrl: 'html/index/server.html',
        controller: 'serverCtrl'
      }).when('/customlist', {
        templateUrl: 'html/index/customlist.html',
        controller: 'customListCtrl'
      }).when('/group', {
        templateUrl: 'html/index/group.html',
        controller: 'groupCtrl'
      }).when('/consultStatistic', {
        templateUrl: 'html/index/consultStatistic.html',
        controller: 'consultStatisticCtrl'
      }).when('/account', {
        templateUrl: 'html/index/consultStatistic.html',
        controller: 'consultStatisticCtrl'
      }).when('/userManagement', {
        templateUrl: 'html/index/userManagement.html',
        controller: 'userManagementCtrl'
      }).when('/usually', {
        templateUrl: 'html/index/usually.html',
        controller: 'usuallyCtrl'
      }).when('/groupEdit/:groupID/:groupName', {
        templateUrl: 'html/index/groupEdit.html',
        controller: 'groupEditCtrl'
      }).when('/message', {
        templateUrl: 'html/index/message.html',
        controller: 'messageCtrl'
      }).when('/questionLibrary', {
        templateUrl: 'html/index/questionLibrary.html',
        controller: 'questionLibraryCtrl'
      }).when('/questionDetail', {
        templateUrl: 'html/index/questionDetail.html',
        controller: 'questionDetailCtrl'
      }).when('/questionManagement/:questionId/:tabIndex', {
        templateUrl: 'html/index/questionManagement.html',
        controller: 'questionManagementCtrl'
      }).when('/questionStatistic', {
        templateUrl: 'html/index/questionStatistic.html',
        controller: 'questionStatisticCtrl'
      }).when('/messageStatistic', {
        templateUrl: 'html/index/messageStatistic.html',
        controller: 'messageStatisticCtrl'
      }).otherwise({
        redirectTo: '/default'
      });
    });
    //injector.AuthHandler(app);//header验证
    injector.HttpFilterHandler(app);//http拦截

    //公共部分Controller
    app.controller('sharedCtrl', ['$scope', '$http', function ($scope, $http) {
      if (!userInfo) {
        return;
      }
      $scope.userName = userInfo.name;
      //$scope.isActive = false;
      $scope.logOut = function () {
        BaseManager.UserInfoManager.Clear();
        window.location.href = "/login.html";
      };
      //$(".index-nav li").click(function () {
      //    // $(this).addClass("active").siblings().removeClass("active");
      //  $scope.isActive = true;
      //  if (this.id !== "message" && this.id !== "statistic") {
      //    BaseManager.DeptInfoManager.Clear();
      //  }
      //});
      $scope.vm = {
        InitNav: function () {                                             //获取当前用户的权限
          var userInfo = BaseManager.UserInfoManager.GetUserInfo(),
            data = BaseManager.MenuInfoManager.GetMenuInfo() || [],
            menus = userInfo.Menus || [];
          // console.log(BaseManager.MenuInfoManager.GetMenuInfo());
          for (var index = 0; index < data.length; index++) {
            var element = data[index];
            for (var index2 = 0; index2 < element.children.length; index2++) {
              var element2 = element.children[index2];
              for (var index3 = 0; index3 < menus.length; index3++) {
                var element3 = menus[index3];
                if (element3.PrevilegeCode === element2.code) {
                  element2.checked = true;
                }
              }
            }
          }
          BaseManager.MenuInfoManager.SetMenuInfo(data);
          // console.log(BaseManager.MenuInfoManager.GetMenuInfo());
          $scope.powersDist = data;
        },
        OnClickNav: function () {
          Util.showFade("您不具备该权限");
        }
      };
      $scope.vm.InitNav();

    }]);
    return app;
  });
