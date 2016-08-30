define(['indexApp', 'common/util', 'common/const', 'model/groupRulesModel'], function (app, util, Const, groupRulesModel) {
  app.controller('groupEditCtrl', function ($scope, $http, $routeParams) {
    //侧边栏样式
    $(".nav li:eq(4)").addClass("active").siblings().removeClass("active");

    var groupId = $routeParams.groupID;
    $scope.groupName = $routeParams.groupName;
    $scope.checkUnitCodeList = Const.checkUnitCode;
    $scope.groupRulesItems = [];
    var ruleIdContainer = "";
    var ruleItemContainer = {};

    //************************获取规则列表*************************************

    $scope.RuleItemHandler = function (ruleItem) {
      angular.copy(ruleItem, ruleItemContainer);
      $scope.editRuleItem = ruleItemContainer;
      $scope.SelectFlagId($scope.editRuleItem.ResultFlagIDs);
    }
    $scope.RuleIdHandler = function (ruleId) {
      ruleIdContainer = ruleId;
    }
    $scope.SelectFlagId = function (index) {
      $scope.bg = [];
      $scope.bg[index] = 'active';
    }

    var getGroupRulesList = function () {
      var url = "GroupRule/GetGroupRuleByGroupID?groupID=" + groupId;
      var successCallback = function (result) {
        $scope.groupRulesItems = [];
        if (result.state == 1) {
          for (var i = 0; i < result.Data.length; i++) {
            var groupRulesItem = new groupRulesModel();
            groupRulesItem.convertFrom(result.Data[i]);
            $scope.groupRulesItems.push(groupRulesItem);
          }
        }
        //util.showFade(result.message);
      }
      var errorCallback = function (err) {
        alert(err);
      }
      util.ajaxGet($http, url, successCallback, errorCallback);
    }
    getGroupRulesList();

    //************************添加规则***************************************

    $scope.AddRulesHandler = function () {
      $scope.bg = [];
      $scope.addedRule = {
        groupId: groupId,
        ruleName: "",
        descriptions: "",
        checkUnitCode: "",
        ResultFlagIds: ""
      };
    }

    $scope.RulesAdd = function () {
      if ($scope.addedRule.ruleName == "") {
        util.showFade("规则名称不能为空");
        return;
      }
      else if ($scope.addedRule.checkUnitCode == "") {
        util.showFade("检查项编码不能为空");
        return;
      }
      else if (!$scope.addedRule.ResultFlagIds) {
        util.showFade("请选择检查值");
        return;
      }

      var ruleName = encodeURIComponent($scope.addedRule.ruleName),
        descriptions = encodeURIComponent($scope.addedRule.descriptions),
        checkUnitCode = encodeURIComponent($scope.addedRule.checkUnitCode);

      var url = "GroupRule/AppendRule?groupID=" + $scope.addedRule.groupId + "&Name=" + ruleName + "&descriptions=" + descriptions + "&checkUnitCode=" + checkUnitCode + "&ResultFlagIds=" + $scope.addedRule.ResultFlagIds;
      var successCallback = function (result) {
        if (result.state == 1) {
          getGroupRulesList();
          $("#groupnom").modal("hide");
        }
        util.showFade(result.message);
      }
      var errorCallback = function (err) {
        alert(err);
      }
      util.ajaxGet($http, url, successCallback, errorCallback);
    }

    //************************编辑规则***************************************

    $scope.RulesEdit = function () {
      if ($scope.editRuleItem.RuleName == "") {
        util.showFade("规则名称不能为空");
        return;
      }
      else if ($scope.editRuleItem.CheckIndexCode == "") {
        util.showFade("检查项编码不能为空");
        return;
      }
      else if (!$scope.editRuleItem.RuleDescription) {
        $scope.editRuleItem.RuleDescription = "";
      }

      var ruleName = encodeURIComponent($scope.editRuleItem.RuleName),
        ruleDescription = encodeURIComponent($scope.editRuleItem.RuleDescription),
        checkIndexCode = encodeURIComponent($scope.editRuleItem.CheckIndexCode);
      var url = "GroupRule/UpdateRule?ruleID=" + $scope.editRuleItem.RuleID + "&Name=" + ruleName + "&descriptions=" + ruleDescription + "&checkUnitCode=" + checkIndexCode + "&ResultFlagIds=" + $scope.editRuleItem.ResultFlagIDs
      var successCallback = function (result) {
        if (result.state == 1) {
          getGroupRulesList();
          $("#grouplist").modal("hide");
        }
        util.showFade(result.message);
      }
      var errorCallback = function (err) {
        alert(err);
      }
      util.ajaxGet($http, url, successCallback, errorCallback);
    }

    //************************编辑规则可用性*********************************

    $scope.RulesEnabled = function () {
      var url = "GroupRule/SetRuleEnable?ruleID=" + ruleItemContainer.RuleID + "&enable=" + $scope.editRuleItem.IsEnabled;
      var successCallback = function (result) {
        if (result.state == 1) {
          getGroupRulesList();
        }
        util.showFade(result.message);
      }
      var errorCallback = function (err) {
        alert(err);
      }
      util.ajaxGet($http, url, successCallback, errorCallback);
    }

    //************************删除规则***************************************

    $scope.RulesDelete = function () {
      var url = "GroupRule/DeleteGroupCheckRule?ruleID=" + ruleIdContainer;
      var successCallback = function (result) {
        if (result.state == 1) {
          getGroupRulesList();
        }
        util.showFade(result.message);
      }
      var errorCallback = function (err) {
        alert(err);
      }
      util.ajaxGet($http, url, successCallback, errorCallback);
    }

  });
  return app;
})
