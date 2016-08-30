define(['indexApp', 'common/util', 'common/BaseInfoManager','jqueryMD5'], function (app, util, cacheUser) {
  app.controller('homeCtrl', function ($scope, $http) {
    //$('.nav li:eq(4)').addClass('active').siblings().removeClass('active');
    $('body').css('overflow', 'hidden');

    var userInfo = cacheUser.UserInfoManager.GetUserInfo();

    $scope.vm = {
      IsShowModPassword: function () {
        if (userInfo && userInfo.IsReset) {
          $('#kyi').modal({ backdrop: 'static', keyboard: false })
            .modal('show');
        }
      },
      userInfo: {
        userName: userInfo.name,
        userId: userInfo.Id,
        newPassword1: '',
        newPassword2: ''
      },
      SubmitButton: function () {
        var self = $scope.vm.userInfo;
        if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/.test(self.newPassword1)) {
          util.showFade('请输入有效的密码');
          return false;
        }
        if (self.newPassword1 !== self.newPassword2) {
          util.showFade('两次输入的密码不一致');
          return false;
        }
        var url = 'api/Password';
        var data = {
          Id: self.userId,
          Password: $.md5(self.newPassword1),
          IsReSetPwd: false
        };
        util.ajaxPost($http, url, data, function (result) {
          if (result.state === 1) {
            userInfo.IsReset = false;
            cacheUser.UserInfoManager.SetUserInfo(false, userInfo);
            util.showFade(result.message);
            $('#kyi').modal('hide');
          }
        }, function (info) {
          util.showFade(info.message);
        });
      },
      Init: function () {
        $scope.vm.IsShowModPassword();
      }
    };

    $scope.vm.Init();
  });
  return app;
});
