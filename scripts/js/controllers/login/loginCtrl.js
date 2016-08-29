define(['loginApp', 'common/util', 'jquery', 'common/VerifyCode', 'common/BaseInfoManager', 'common/menus', 'jqueryMD5'], function (app, util, $, VerifyCode, BaseManager, menus) {
  app.controller('loginCtrl', function ($scope, $http) {
    $scope.title = '优健康后台管理系统';

    var container = $('#code');
    var verifyCode = new VerifyCode(container[0]);
    $scope.loginHandler = function () {
      var userName = $('#userName').val();
      var userPassword = '';
      userPassword = $('#userPassword').val();
      var userCode = $('#userCode').val();
      if (userName === '' || userPassword === '') {
        util.showFade('输入框不能为空！');
        verifyCode.update();
        return false;
      } else if (!verifyCode.verify(userCode)) {
        util.showFade('验证码有误！');
        verifyCode.update();
        return false;
      }
      var rePassword = $('#rePassword').is(':checked');
      var url = 'BMSLogin/LogIn';
      var data = { 'User': userName, 'PassWord': $.md5(userPassword) };
      successCallback = function (result) {
        //console.log("-----------------登录成功信息：-----------------");
        // console.log(result.Data.message);

        if (result.state === 1 && result.Data) {
          var userInfoViewModel = { 'Id': result.Data.Id, 'name': userName, 'IsReset': result.Data.IsReset, 'Menus': result.Data.brp };

          BaseManager.UserInfoManager.SetUserInfo(rePassword, userInfoViewModel);
          //console.log(menus);
          BaseManager.MenuInfoManager.SetMenuInfo(menus.Data);
          $('input').attr('value', '');
          window.location.href = '/';
        } else {
          // alert(result.message);
          util.showFade(result.message);
        }
      };
      errorCallback = function (err) {
        alert('系统异常！');
      };
      util.ajaxPost($http, url, data, successCallback, errorCallback);
    };
  });
  return app;
});
