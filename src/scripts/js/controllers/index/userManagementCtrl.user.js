'use strict';

define(['underscore', 'Extend', 'common/util', 'model/userManagementModel', 'jqueryMD5'], function (_, Extend, Util, UserManagementModel) {
  var ServerUrls = {  // 服务器地址
    LocalMenu: 'scripts/js/datas/menus.json',
    UserMgr: {

    },
    RoleMgr: {

    }
  };
  return function ($scope, $http) {
    // 1.帐号管理之人员管理
    $scope.vm.userMgr = {
      current: {
        Id: 0,
        Cname: '',
        Name: '',
        Mobile: '',
        CertificateCode: '',
        Account: '',
        Password: '',
        NewPassword1: '',
        NewPassword2: '',
        IsCheckOnResetPwd: false,
        IsCheckAddPwd: true,
        Roles: {
          data: [{ value: -1, text: '---请选择角色--' }],
          count: 0,
          selectItem: -1
        }
      },
      roleCollection: {
        data: [{ value: -1, text: '---请选择角色--' }],
        count: 0,
        selectItem: -1,
        //获取角色列表
        Init: function (result) {
          var userMgr = $scope.vm.userMgr,
            search = userMgr.searchCollection;
          // userMgr.current.Roles.selectItem = -1;
          userMgr.current.Roles.selectItem = -1;
          userMgr.current.Roles.data = result.data;
          userMgr.current.Roles.count = result.count;
          search.params.Roles.data = result.data;
          search.params.Roles.count = result.count;
        }
      },
      searchCollection: {
        // data: {
        //   Name:
        // },         // 1. 查询原型
        params: {
          Name: '',
          // roleName: '',
          Mobile: '',
          Roles: {
            data: [{ value: -1, text: '---请选择角色--' }],
            count: 0,
            selectItem: -1
          }
        }, data: {
          Name: '',
          Mobile: '',
          RoleId: ''
        },
        //初始化查询文本框内容
        Init: function () {
          // var self = $scope.vm.userMgr.searchCollection;
        },
        _validSearch: function () {
          var self = $scope.vm.userMgr.searchCollection;
          if (!/^(13|15|17|18|14)\d{9}$/.test(self.params.Moblie) && self.params.Moblie) {
            Util.showFade('请输入正确的手机号码');
            return false;
          }
          return true;
        },
        OnClickSearch: function () {
          var self = $scope.vm.userMgr.searchCollection;
          var data = {
            Name: self.params.Name,
            Mobile: self.params.Moblie,
            RoleId: self.params.Roles.selectItem
          };
          if (self._validSearch()) {
            // 请求查询
            // self.searchMethod = function () {
            // var url = 'api/Person';
            if (data.RoleId === -1) {
              data.RoleId = '';
            }
            Util.ajaxPost($http, 'api/Person', data, function (result) {
              $scope.vm.userMgr.userCollection.data = [];
              if (result.state === 1) {
                if (result.Data.length === 0) {
                  Util.showFade('没有可查询的数据');
                } else {
                  var model = new UserManagementModel();
                  for (var i = 0; i < result.Data.length; i++) {
                    var item = model.convertFrom(result.Data[i]);
                    $scope.vm.userMgr.userCollection.data.push(item);
                  }
                }
              }
            }, function (info) {
            });
            // };
          }
        }
      },
      userCollection: {
        //获取成员资料数据
        getData: {
          data: [],
          count: 0
        },
        Init: function () {
          var self = $scope.vm.userMgr.userCollection;
          self.data = [];
          //获取人员数据
          var data = {};
          var url = 'api/Person';
          Util.ajaxPost($http, url, data, function (result) {
            if (result.state === 1) {
              self.data.count = result.Data.length;
              if (self.data.count === 0) {
                Util.showFade('未找到请求数据');
              } else {
                var model = new UserManagementModel();
                for (var i = 0; i < self.data.count; i++) {
                  var item = model.convertFrom(result.Data[i]);
                  self.data.push(item);
                }
              }
            }
          }, function (info) {
            Util.showFade(info.Message);
          });
        },
        //添加人员
        addUserCollection: {
          AddButton: function () {
            /*该方法用于初始化添加人员页面的数据*/
            // $scope.vm.userMgr.userCollection.OnResetAddUser();
            $scope.vm.userMgr.userCollection.addUserCollection.OnResetAddUser();
          },
          //还原添加人员文本框数据
          OnResetAddUser: function () {
            var self = $scope.vm.userMgr.userCollection.addUserCollection;
            self.current = {
              id: 0,
              Cname: '',
              RoleId: 0,
              Mobile: '',
              CertificateCode: '',
              Account: '',
              Password: '',
              IsCheckOnResetPwd: false,
              IsCheckAddPwd: true
            };
            $scope.vm.userMgr.current.Roles.selectItem = -1;
          },
          //设置默认密码
          IsClickPsw: function () {
            var self = $scope.vm.userMgr.userCollection.addUserCollection;
            if (self.current.IsCheckOnResetPwd) {
              self.current.Password = 'Abc123456';
            }
          },
          //添加人员保存操作
          OnClickAddUser: function () {
            var self = $scope.vm.userMgr.userCollection.addUserCollection;
            // 保存之后重置
            // self.OnResetUser();
            self.TextJudge = function () {
              if (!self.current.Cname) {
                Util.showFade('姓名不能为空');
                return false;
              }
              var len = Math.ceil(self.current.Cname.trim().replace(/[\u4e00-\u9fa5]/g, 'x').length);
              if (len > 6 || len < 2) {
                Util.showFade('姓名应为2-6位字符');
                return false;
              }
              if ($scope.vm.userMgr.current.Roles.selectItem === -1) {
                Util.showFade('请选择角色');
                return false;
              }
              if (!/^(13|15|17|18|14)\d{9}$/.test(self.current.Mobile)) {
                Util.showFade('请输入正确的手机号');
                return false;
              }
              if (!/^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/.test(self.current.CertificateCode) && self.current.CertificateCode) {
                Util.showFade('请输入正确的身份证号码');
                return false;
              }
              if (!self.current.Account) {
                Util.showFade('登录账号不能为空');
                return false;
              }
              if (!/^\w{6,20}$/.test(self.current.Account) || /^[\u4e00-\u9fa5]{0,}$/.test(self.current.Account)) {
                Util.showFade('登录账号应为6-20非中文字符');
                return false;
              }
              if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d]{8,20}$/.test(self.current.Password)) {
                Util.showFade('请输入有效的密码');
                return false;
              }
              return true;
            };
            if (self.TextJudge()) {
              //发送添加人员请求
              var url = 'api/Person/Append';
              // var password = new MD5(self.current.Password);
              var password = $.md5(self.current.Password);
              var data = {
                CName: self.current.Cname,
                RoleId: $scope.vm.userMgr.current.Roles.selectItem,
                Mobile: self.current.Mobile,
                CertificateCode: self.current.CertificateCode,
                Account: self.current.Account,
                Password: password,
                IsReSetPwd: true
              };
              Util.ajaxPost($http, url, data, function (result) {
                if (result.state === 1) {
                  Util.showFade('添加成功');
                  $scope.vm.userMgr.userCollection.Init();
                  $('#material').modal('hide');
                } else {
                  Util.showFade(result.message);
                }
              }, function (info) {
                Util.showFade(info.Message);
              });
            }
          }
        },
        //编辑人员
        editUserCollection: {
          OnSettingCurrent: function () {
            var self = $scope.vm.userMgr;
            self.TextJudge = function () {
              //验证输入框的内容
              if (!self.current.Cname) {
                Util.showFade('姓名不能为空');
                return false;
              }
              var len = Math.ceil(self.current.Cname.trim().replace(/[\u4e00-\u9fa5]/g, 'x').length);
              if (len > 6 || len < 2) {
                Util.showFade('姓名应为2-6位字符');
                return false;
              }
              if (self.current.Roles.selectItem === -1) {
                Util.showFade('请选择角色');
                return false;
              }

              if (!/^(13|15|17|18|14)\d{9}$/.test(self.current.Mobile)) {
                Util.showFade('请输入正确的手机号');
                return false;
              }
              if (!/^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/.test(self.current.CertificateCode) && self.current.CertificateCode) {
                Util.showFade('请输入正确的身份证号码');
                return false;
              }
              return true;
            };
            //编辑保存操作
            if (self.TextJudge()) {
              var url = 'api/Person/Update';
              var data = {
                'Id': self.current.Id,
                'CName': self.current.Cname,
                'RoleId': self.current.Roles.selectItem,
                'Mobile': self.current.Mobile,
                'CertificateCode': self.current.CertificateCode
              };
              Util.ajaxPost($http, url, data, function (result) {
                if (result.state === 1) {
                  Util.showFade('编辑成功');
                  $scope.vm.userMgr.userCollection.Init();
                  $('#edit').modal('hide');
                } else {
                  Util.showFade('编辑失败');
                }
              }, function (info) {
                Util.showFade(info.Message);
              });
            }
          }
        },
        //设置密码
        modifyPasswrodCollection: {

          IsClickPsw: function () {
            var self = $scope.vm.userMgr;
            if (self.current.IsCheckOnResetPwd) {
              self.current.NewPassword1 = 'Abc123456';
              self.current.NewPassword2 = 'Abc123456';
            }
          },
          //保存操作
          SaveOperation: function () {
            var self = $scope.vm.userMgr;
            self.TextJudge = function () {
              if (!self.current.Account) {
                Util.showFade('登录账号不能为空');
                return false;
              }

              if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/.test(self.current.NewPassword1)) {
                Util.showFade('请输入有效的密码');
                return false;
              }
              if (self.current.NewPassword1 !== self.current.NewPassword2) {
                Util.showFade('两次输入的密码不一致');
                return false;
              }
              return true;
            };
            //验证成功发送请求
            if (self.TextJudge()) {
              var url = 'api/Password';
              var data = {
                Id: self.current.Id,
                Password: $.md5(self.current.NewPassword1),
                IsResetPwd: true
              };
              Util.ajaxPost($http, url, data, function (result) {
                if (result.state === 1) {
                  Util.showFade(result.message);
                  $scope.vm.userMgr.userCollection.Init();
                  $('#kyi').modal('hide');
                } else {
                  Util.showFade('更新密码失败');
                }
              }, function (info) {
                Util.showFade(info.Message);
              });
            }
          }
        }
      },
      OnChooseCurrent: function (item) {
        var self = $scope.vm.userMgr;
        self.current.Id = item.Id;
        self.current.Cname = item.Cname;
        self.current.Name = item.Name;
        self.current.Mobile = item.Mobile;
        self.current.CertificateCode = item.CertificateCode;
        self.current.Account = item.Account;
        self.current.NewPassword1 = '';
        self.current.NewPassword2 = '';
        self.current.IsCheckOnResetPwd = false;
        self.current.IsCheckAddPwd = true;
        self.current.Roles.selectItem = item.RoleId;
      },
      //删除
      OnClickDeleteUserById: function () {
        var self = $scope.vm.userMgr,
          data = {},
          url = 'api/Person/Delete?id=' + self.current.Id;
        Util.ajaxPost($http, url, data, function (result) {
          if (result.state === 1) {
            Util.showFade(result.message);
            $scope.vm.userMgr.userCollection.Init();
            $('banned').modal('hide');
          } else {
            Util.showFade(result.message);
          }
        }, function () {

        });
      },
      Init: function () {
        var userMgr = $scope.vm.userMgr,
          // role = userMgr.roleCollection,
          user = userMgr.userCollection,
          search = userMgr.searchCollection;

        // role.Init();
        user.Init();
        search.Init();
      }
    };
    $scope.$apply();
  };
});
