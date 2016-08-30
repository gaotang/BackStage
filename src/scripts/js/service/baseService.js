define(['indexApp', 'common/BaseInfoManager'], function (app, BaseManager) {

  app.factory('signValid', function ($http) {
    var viewModel = {
      ValidAccess: function (actionName) {                             //验证权限登录
        var data = BaseManager.MenuInfoManager.GetMenuInfo(),
          isPass = true;

        if (actionName != '#/message' || actionName != '"#/consultStatistic"' || actionName != '"#/messageStatistic"') {
            
        BaseManager.DeptInfoManager.Clear();
        }
        for (var index = 0; index < data.length; index++) {
          var element = data[index];
          for (var y = 0; y < element.children.length; y++) {
            var element2 = element.children[y];
            if (!element2.checked && actionName === element2.action) {
              isPass = false;
              break;
            }
          }
        }
        if (!isPass) {
          window.location.href = '#/default';
        }
      },
      Init: function () { }
    };

    return viewModel;
  });

  return app;
});
