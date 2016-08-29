define(['jquery'], function ($) {
  var self = {};
  //用户信息
  self.UserInfoManager = {
    Key: 'userinfo',
    GetUserInfo: function () {
      var userInfo = window.sessionStorage.getItem(this.Key);
      if (userInfo == null) {
        userInfo = window.localStorage.getItem(this.Key);
      }
      var userInfoModel = null;
      if (userInfo != null) {
        userInfoModel = JSON.parse(userInfo);
      }
      return userInfoModel;
    },
    SetUserInfo: function (isRemember, userInfoModel) {
      var userInfoString = JSON.stringify(userInfoModel);
      if (isRemember) {
        window.localStorage.setItem(this.Key, userInfoString);
      }
      else {
        window.sessionStorage.setItem(this.Key, userInfoString);
      }
    },
    IsRemember: function () {
      var userInfo = window.sessionStorage.getItem(this.Key);
      if (userInfo == null) {
        return true;
      }
      return false;
    },
    Clear: function () {
      window.sessionStorage.removeItem(this.Key);
      window.localStorage.removeItem(this.Key);
    }
  };
  // 菜单信息
  self.MenuInfoManager = {
    Key: 'menuinfo',
    Exist: function () {
      var menuInfo = window.sessionStorage.getItem(this.Key);
      var menuInfoModel = JSON.parse(menuInfo);
      return menuInfoModel != null;
    },
    GetMenuInfo: function () {
      var menuInfo = window.sessionStorage.getItem(this.Key);
      var menuInfoModel = JSON.parse(menuInfo);
      return menuInfoModel;
    },
    SetMenuInfo: function (menuInfoModel) {
      var menuInfoString = JSON.stringify(menuInfoModel);
      window.sessionStorage.setItem(this.Key, menuInfoString);
    },
    Clear: function () {
      window.sessionStorage.removeItem(this.Key);
    }
  };
  //机构信息
  self.DeptInfoManager = {
    Key: 'deptinfo',
    Exist: function () {
      var deptInfo = window.sessionStorage.getItem(this.Key);
      var deptInfoModel = JSON.parse(deptInfo);
      return deptInfoModel != null;
    },
    GetDeptInfo: function () {
      var deptInfo = window.sessionStorage.getItem(this.Key);
      var deptInfoModel = JSON.parse(deptInfo);
      return deptInfoModel;
    },
    SetDeptInfo: function (deptInfoList, callbackHndler) {
      var obj = { addedDeptList: [], defaultDeptList: [], enableDeptList: [], disableDeptList: [] };
      for (var i = 0; i < deptInfoList.length; i++) {
        if (deptInfoList[i].IsSendSms) {
          obj.addedDeptList.push(deptInfoList[i]);
        }
        else {
          obj.defaultDeptList.push(deptInfoList[i]);
        }
      }
      if (obj.addedDeptList.length > 0) {
        for (var j = 0; j < obj.addedDeptList.length; j++) {
          if (obj.addedDeptList[j].IsSendSmsEnabled) {
            obj.enableDeptList.push(obj.addedDeptList[j]);
          }
          else {
            obj.disableDeptList.push(obj.addedDeptList[j]);
          }
        }
      }
      var deptInfoString = JSON.stringify(obj);
      window.sessionStorage.setItem(this.Key, deptInfoString);
      if (callbackHndler) {
        for (var i = 0; i < callbackHndler.length; i++) {
          callbackHndler[i]();
        }
      }
    },
    Clear: function () {
      window.sessionStorage.removeItem(this.Key);
    }
  };

  return self;
});
