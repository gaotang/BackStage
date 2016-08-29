'use strict';

define(['indexApp', 'Extend', 'service/baseService'], function (app, Extend) {
  app.controller('userManagementCtrl', ['$scope', '$http', '$injector', 'signValid', function ($scope, $http, $injector, signValid) {

    signValid.ValidAccess("#/userManagement");             //缓存登录验证
    //导航栏样式
    $('.nav li:eq(0)').addClass('active').siblings().removeClass('active');

    require(['controllers/index/userManagementCtrl.role', 'controllers/index/userManagementCtrl.user'], function (role, user) {
      $scope.vm = {
        userMgr: {  // 1.帐号管理之人员管理
          Init: function () {}
        },
        roleMgr: {   // 2.帐号管理角色管理
          Init: function () {}
        },
        Init: function () {
          var userMgr = $scope.vm.userMgr,
            roleMgr = $scope.vm.roleMgr;
          userMgr.Init();
          roleMgr.Init();
        }
      };
      $injector.invoke(role, this, { '$scope': $scope, '$http': $http });
      $injector.invoke(user, this, { '$scope': $scope, '$http': $http });

      $scope.vm.Init();
    });
  }]);
  return app;
});

//// GET
//util.ajaxGet($http, url, function (result) {
//    if (result.state == 1) {
//        // ....
//    }
//    else util.showFade(result.message);
//}, function (err) { util.showFade(err); });
//// POST
//util.ajaxPost($http, url, data, function (result) {
//    if (result.state == 1) {
//        // ....
//    } else util.showFade(result.message);
//}, function (err) { util.showFade(err); });
