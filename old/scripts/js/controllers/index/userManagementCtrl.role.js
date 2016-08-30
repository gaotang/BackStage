'use strict';

define(['underscore', 'Extend', 'common/util', 'common/BaseInfoManager', 'model/roleManagementModel'], function (_, Extend, Util, BaseManager, RoleMagagementModel) {
  return function ($scope, $http) {
    var ServerUrls = {  // 服务器地址
      LocalMenu: '/scripts/js/datas/menus.json',                                   //json
      RoleUrl: 'Role',                                                            //获取所有角色        GET api/Role
      RoleAdd: 'Role/Append',                                                     //添加角色            POST api/Role/Append
      RoleEdit: 'Role',                                                           //编辑角色            POST api/Role
      RoleDelete: 'Role/{0}',                                                     //删除角色           GET api/Role/{id}
      GetRolePrevileges: 'RolePrevileges/{0}',                                    //获取角色权限     GET api/RolePrevileges/{roleid}
      RolePrevileges: 'RolePrevileges'                                            //设置角色权限        POST api/RolePrevileges
    };
    //2.帐号管理之人员管理
    $scope.vm.roleMgr = {
      DialogCollection: {
        Add: {
          Show: function () {
            $('#people').modal('show');
          },
          Hide: function () {
            $('#people').modal('hide');
          },
          Toggle: function () {
            $('#people').modal('toggle');
          }
        },
        Distrib: {
          Show: function () {
            $('#power').modal('show');
          },
          Hide: function () {
            $('#power').modal('hide');
          },
          Toggle: function () {
            $('#power').modal('toggle');
          }
        },
        Edit: {
          Show: function () {
            $('#karakters').modal('show');
          },
          Hide: function () {
            $('#karakters').modal('hide');
          },
          Toggle: function () {
            $('#karakters').modal('toggle');
          }
        },
        Delete: {
          Show: function () {
            $('#cut').modal('show');
          },
          Hide: function () {
            $('#cut').modal('hide');
          },
          Toggle: function () {
            $('#cut').modal('toggle');
          }
        }
      },
      addRoleCollection: {                                        //添加管理角色
        data: {
          id: '',
          name: '',
          description: ''
        },
        OnChooseAddRole: function () {
          var roleMgr = $scope.vm.roleMgr,
            self = roleMgr.addRoleCollection;
          self.data = {
            name: '',
            description: ''
          };
          console.log(self.data);
        },
        OnClickAddRole: function () {                                  //保存添加角色
          var roleMgr = $scope.vm.roleMgr,
            self = roleMgr.addRoleCollection,
            Role = roleMgr.roleCollection,
            addRole = roleMgr.DialogCollection.Add,
            url = String.prototype.format(ServerUrls.RoleAdd, self.data.name, self.data.description),
            data = {
              'Name': self.data.name,
              'Descriptions': self.data.description
            };
          if (!self.data.name) {
            Util.showFade('名称不能为空!');
            return;
          }
          for (var k = 0; k < Role.count; k++) {
            if (self.data.name === Role.data[k].name) {
              Util.showFade('名称不可重复!');
              return;
            }
          }
          if (self.data.name.length < 2) {
            Util.showFade('名称不能小于2个字!');
            return;
          }
          if (self.data.name.length > 20) {
            Util.showFade('名称不能超过20个字!');
            return;
          }
          if (self.data.description && self.data.description.length > 200) {
            Util.showFade('描述不能超过200个字!');
            return;
          }

          Util.ajaxPost($http, url, data, function (result) {
            if (result.state === 1) {
              self.data.id = result.Data;
              Role.data.push(self.data);
              roleMgr.Init();
              Util.showFade('添加角色成功!');
              setTimeout(function () {
                addRole.Hide();
              }, 800);
            } else { Util.showFade(result.message); }
          }, function (err) { Util.showFade(err); });
        },
        OnClickCloseAdd: function () {                                     //关闭添加弹框
          var addRole = $scope.vm.roleMgr.DialogCollection.Add;
          addRole.Hide();
        }
      },
      selectRoles: {
        data: [],
        count: 0
      },
      roleCollection: {                             //权限分配
        data: [                                                               //角色列表
          // {
          //   id: 0,
          //   name: '运维',
          //   description: 'xxxxxx',
          //   upDate: '2016/05/11'
          // },
          // {
          //   id: 1,
          //   name: '医生',
          //   description: 'xxxxxx',
          //   upDate: '2016/05/11'
          // }
        ],
        count: '',
        powersCurrent: {                                                        //当前权限分配
          id: '',
          checkedItem: [

          ]
        },
        OnChooseRolePrevileges: function (item) {                               //获取当前角色的权限
          var Edit = $scope.vm.roleMgr.editRoleCollection,
            self = $scope.vm.roleMgr.roleCollection,
            url = String.prototype.format(ServerUrls.GetRolePrevileges, item.id);
          _.extend(Edit.current, item);
          for (var m = 0; m < $scope.powersDist.length; m++) {
            var element = $scope.powersDist[m],
              length = element.children.length;
            for (var k = 0; k < length; k++) {
              element.children[k].checked = false;
            }
          }
          Util.ajaxGet($http, url, function (result) {
            if (result.state === 1) {
              for (var j = 0; j < result.Data.length; j++) {
                var item1 = result.Data[j];
                for (var i = 0; i < $scope.powersDist.length; i++) {
                  var element = $scope.powersDist[i],
                    length = element.children.length;
                  for (var k = 0; k < length; k++) {
                    if (item1.PrevilegeCode === element.children[k].code) {
                      element.children[k].checked = true;
                    }
                  }
                }
              }
            } else { Util.showFade(result.message); }
          }, function (err) { Util.showFade(err); });
        },
        OnClickChecked: function (jsonChild) {                                    //复选框的文字lebal效果
          jsonChild.checked = !jsonChild.checked;
        },
        OnchooseChecked: function ($event) {                                      //取消冒泡
          $event.stopPropagation();
        },
        OnClickCancel: function () {                                              //取消权限弹框
          var dist = $scope.vm.roleMgr.DialogCollection.Distrib;
          dist.Hide();
        },
        OnClickSave: function () {                                                //保存权限
          var dist = $scope.vm.roleMgr.DialogCollection.Distrib,
            self = $scope.vm.roleMgr.roleCollection,
            selfCurrent = self.powersCurrent,
            url = ServerUrls.RolePrevileges,
            editRoleID = $scope.vm.roleMgr.editRoleCollection.current;
          selfCurrent.id = editRoleID.id;

          selfCurrent.checkedItem = [];

          for (var i = 0; i < $scope.powersDist.length; i++) {
            var element = $scope.powersDist[i],
              length = element.children.length;
            for (var j = 0; j < length; j++) {
              var childen = element.children[j],
                json = {
                  'PrevilegeCode': '',
                  'ParentPrevilegeCode': ''
                };
              if (childen.checked) {
                json.PrevilegeCode = childen.code;
                json.ParentPrevilegeCode = element.code;
                selfCurrent.checkedItem.push(json);
              }
            }
          }
          var data = {
            Id: selfCurrent.id,
            Roleprevileges: selfCurrent.checkedItem
          };
          Util.ajaxPost($http, url, data, function (result) {
            if (result.state === 1) {
              Util.showFade('设置权限成功');
              setTimeout(function () {
                dist.Hide();
              }, 800);
            } else { Util.showFade(result.message); }
          }, function (err) { Util.showFade(err); });
          //console.log(selfCurrent.checkedItem);
        }
      },
      editRoleCollection: {                                                    //编辑角色
        current: {
          // name:'',
          // description:''
        },
        currentName: '',
        OnChooseRole: function (item) {                                        //选中当前的角色
          var roleMgr = $scope.vm.roleMgr,
            self = roleMgr.editRoleCollection;
          _.extend(self.current, item);
          self.currentName = self.current.name;
        },
        OnClickEditRole: function () {                                          //编辑保存角色
          var roleMgr = $scope.vm.roleMgr,
            SelectRoles = roleMgr.selectRoles,
            self = roleMgr.editRoleCollection,
            editRole = roleMgr.DialogCollection.Edit,
            Role = roleMgr.roleCollection,
            url = ServerUrls.RoleEdit,
            data = {
              'Id': self.current.id,
              'Name': self.current.name,
              'Descriptions': self.current.description
            };
          if (!self.current.name) {
            Util.showFade('名称不能为空!');
            return;
          }
          for (var k = 0; k < Role.count; k++) {
            if (self.currentName !== self.current.name && (self.current.name === Role.data[k].name)) {
              Util.showFade('名称不可重复!');
              return;
            }
          }
          if (self.current.name.length < 2) {
            Util.showFade('名称不能小于2个字!');
            return;
          }
          if (self.current.name.length > 20) {
            Util.showFade('名称不能超过20个字!');
            return;
          }
          if (self.current.description && self.current.description.length > 200) {
            Util.showFade('描述不能超过200个字!');
            return;
          }
          Util.ajaxPost($http, url, data, function (result) {
            if (result.state === 1) {
              for (var i = 0; i < Role.count; i++) {
                var item = Role.data[i];
                for (var j = 0; j < SelectRoles.data.length; j++) {
                  var element = SelectRoles.data[j];
                  if (element.value === self.current.id && (item.id === self.current.id)) {
                    element.text = self.current.name;
                    _.extend(item, self.current);
                  }
                }
              }
              Util.showFade('编辑信息成功!');
              setTimeout(function () {
                editRole.Hide();
              }, 800);
            } else { Util.showFade(result.message); }
          }, function (err) { Util.showFade(err); });
        },
        OnClickClose: function () {                                               //关闭删除弹框
          var editRole = $scope.vm.roleMgr.DialogCollection.Edit;
          editRole.Hide();
        }
      },
      OnClickDeleteRoleById: function () {                                        //删除角色
        var roleMgr = $scope.vm.roleMgr,
          SelectRoles = roleMgr.selectRoles,
          self = roleMgr.editRoleCollection,
          deleteRole = roleMgr.DialogCollection.Delete,
          Role = roleMgr.roleCollection,
          url = String.prototype.format(ServerUrls.RoleDelete, self.current.id);

        Util.ajaxGet($http, url, function (result) {
          if (result.state === 1) {
            for (var i = 0; i < Role.count; i++) {
              var item = Role.data[i];
              for (var j = 0; j < SelectRoles.data.length; j++) {
                var element = SelectRoles.data[j];
                if (element.value === self.current.id && (item.id === self.current.id)) {
                  SelectRoles.data.splice(j, 1);
                  Role.data.splice(i, 1);
                  break;
                }
              }
            }
            Role.count = Role.data.length;
            Util.showFade('删除成功!');
            setTimeout(function () {
              deleteRole.Hide();
            }, 800);
          } else { Util.showFade(result.message); }
        }, function (err) { Util.showFade(err); });
      },
      Init: function () {                                                        //初始化 获取角色列表
        var roleMgr = $scope.vm.roleMgr,
          userRoleMgr = $scope.vm.userMgr.roleCollection,
          SelectRoles = roleMgr.selectRoles,
          Role = roleMgr.roleCollection,
          data = BaseManager.MenuInfoManager.GetMenuInfo(),
          url = ServerUrls.RoleUrl;

        $scope.powersDist = data;
        Util.ajaxGet($http, url, function (result) {
          if (result.state === 1) {
            //console.log(result);
            var model = new RoleMagagementModel();
            Role.data = [];
            Role.count = result.Data.length;
            SelectRoles.data = [];
            SelectRoles.data.selectItem = -1;
            SelectRoles.data.push({ text: '--请选择--', value: -1 });
            SelectRoles.count = result.Data.length;
            for (var i = 0; i < Role.count; i++) {
              var current = result.Data[i],
                item = model.convertFromRole(current);
              Role.data.push(item);
              SelectRoles.data.push({ text: item.name, value: item.id });
            }
            userRoleMgr.Init(SelectRoles);
            // console.log(SelectRoles);
          } else { Util.showFade(result.message); }
        }, function (err) { Util.showFade(err); });
      }
    };

    $scope.$apply();
  };
});
