define(['indexApp', 'common/util', 'model/phraseModel', 'service/baseService'], function (app, util, phraseModel) {
  app.controller('usuallyCtrl', function ($scope, $http, signValid) {
    signValid.ValidAccess("#/usually");                       //缓存登录验证
    //导航栏样式
    $(".nav li:eq(4)").addClass("active").siblings().removeClass("active");
    var pullLeftHeight = $(document).height() - $('.panel-heading').height() - $('#header').height();
    $('#pull_left').css({'height': pullLeftHeight - 50 + 'px', 'overflow': 'hidden'});
    var columnMainHeight = pullLeftHeight - $('#pull_left .column-head').height() - $('#pull_left .column-search').height();
    $('#pull_left .column-main').css({'height': columnMainHeight - 80 + 'px', 'overflow-y': 'auto'});
    $scope.searchInput = "";
    $scope.default = false;
    $scope.editPhrase = {};
    var gobalValue = { ItemName: "" };
    $scope.ChangeSumImg = function () {
      if ($("#sideImg").attr("src") == "img/u1564.png") {
        $("#sideImg").attr("src", "img/u4037.png");
      } else {
        $("#sideImg").attr("src", "img/u1564.png");
      }
    }

    //*********************获取项目名称****************************

    var getItemName = function () {
      var url = "UserfulExpression/GetStasticsInfo";
      var successCallback = function (result) {
        if (result.state == 1) {
          $scope.group = result.Data;
          $scope.sum = 0;
          for (var i = 0; i < result.Data.length; i++) {
            $scope.sum += result.Data[i].Count;
          }
          if (gobalValue.ItemName == "") {
            gobalValue.ItemName = result.Data[0].ItemName;
          }
          $scope.getListHandler(gobalValue.ItemName);
        }
        else {
          util.showFade(result.message);
        }
      }
      var errorCallback = function (err) {
        alert(err);
      }
      util.ajaxGet($http, url, successCallback, errorCallback);
    }
    getItemName();

    //*********************获取常用短语****************************

    /*$scope.getListHandler = function(eventName){
        var url = "UserfulExpression/GetByItemName?itemName="+eventName;
        var successCallback=function(result){
            if (result.state ==1) {
                var phraseItems = [];
                for (var i=0;i<result.Data.length;i++){
                    var phraseEvent = result.Data[i];
                    var phraseItem = new phraseModel();
                    phraseItem.convertFrom(phraseEvent);
                    phraseItems.push(phraseItem);
                }
                $scope.phraseItems = phraseItems;
            }
            else{
                util.showFade(result.message);
            }
        }
        var errorCallback=function(err){
            alert("获取常用短语失败");
        }
        util.ajaxGet($http,url,successCallback,errorCallback);
    }*/

    $scope.getListHandler = function (eventName) {
      gobalValue.ItemName = eventName;
      var url = "UserfulExpression/GetByItemName"
      //var data ="\""+eventName+"\"";
      var data = {
        ItemName: eventName
      }
      var successCallback = function (result) {
        if (result.state == 1) {
          var phraseItems = [];
          for (var i = 0; i < result.Data.length; i++) {
            var phraseEvent = result.Data[i];
            var phraseItem = new phraseModel();
            phraseItem.convertFrom(phraseEvent);
            phraseItems.push(phraseItem);
          }
          $scope.phraseItems = phraseItems;
        }
        else {
          util.showFade(result.message);
        }
      }
      var errorCallback = function (err) {
        alert("获取常用短语失败");
      }
      util.ajaxPost($http, url, data, successCallback, errorCallback);
    }


    //*********************添加常用短语****************************

    $scope.AddPhrase = function () {
      $scope.addPhrase = { "ItemName": "", "KeyWord": "", "IsDefault": false, "Content": "" }
    }

    $scope.AddSubmit = function () {
      var url = "UserfulExpression/Append";
      var data = $scope.addPhrase;
      var itemName = data.ItemName.trim();
      var keyWord = data.KeyWord.trim();
      var content = data.Content.trim();
      //var containSpecial = RegExp(/[(\ )(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\-)(\_)(\+)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\,)(\.)(\/)(\<)(\>)(\?)(\)]+/);
      if (itemName == "") {
        util.showFade("项目名不能为空");
        return;
      }
      /*if (containSpecial.test(itemName)){
          util.showFade("项目名不能包含特殊字符");
          return;
      }*/
      if (keyWord == "") {
        util.showFade("关键字不能为空");
        return;
      }
      if (content == "") {
        util.showFade("内容不能为空");
        return;
      }
      var successCallback = function (result) {
        if (result.state == 1) {
          getItemName();
        }
        $("button.close").click();
        util.showFade(result.message);
      }
      var errorCallback = function (err) {
        alert("添加常用短语失败");
      }
      util.ajaxPost($http, url, data, successCallback, errorCallback);
    }

    $scope.AddPhraseInputSubmit = function (itemName) {
      $scope.addPhrase.ItemName = itemName;
    }

    //*********************编辑常用短语****************************

    $scope.EditPhrase = function (phraseItem) {
      angular.copy(phraseItem, $scope.editPhrase);
    }

    $scope.EditSubmit = function () {
      var url = "UserfulExpression/Update";
      var data = $scope.editPhrase;
      var itemName = data.ItemName.trim();
      var keyWord = data.KeyWord.trim();
      var content = data.Content.trim();
      if (itemName == "") {
        util.showFade("项目名不能为空");
        return;
      }
      if (keyWord == "") {
        util.showFade("关键字不能为空");
        return;
      }
      if (content == "") {
        util.showFade("内容不能为空");
        return;
      }
      var successCallback = function (result) {
        if (result.state == 1) {
          $("button.close").click();
          //$scope.getListHandler(itemName);
          getItemName();
        }
        util.showFade(result.message);
      }
      var errorCallback = function () {
        alert("编辑常用短语失败");
      }
      util.ajaxPost($http, url, data, successCallback, errorCallback);
    }

    //*********************编辑可用性****************************

    $scope.EnableSubmit = function (item) {
      var url = "UserfulExpression/SetEnable?ID=" + item.Id + "&enable=" + !item.IsEnabled;
      var successCallback = function (result) {
        if (result.state == 1) {
          getItemName();
          //$scope.getListHandler(item.ItemName);
        }
        $("button.close").click();
        util.showFade(result.message);
      }
      var errorCallback = function (err) {
        alert("编辑可用性失败");
      }
      util.ajaxGet($http, url, successCallback, errorCallback);
    }

    //*********************编辑项目名称****************************

    $scope.EditItemName = function (item) {
      $scope.oldItem = item;
      $scope.oldItem.newItemName = "";
    }

    $scope.EditItemNameSubmit = function (item) {
      var newItemName = item.newItemName.trim();
      if (newItemName == "") {
        util.showFade("请输入修改后的项目名")
        return;
      }
      var itemName = encodeURIComponent(item.ItemName);
      var newItemName = encodeURIComponent(item.newItemName);
      var url = "UserfulExpression/UpdateItemName?olbItemName=" + itemName + "&newItemName=" + newItemName;
      var successCallback = function (result) {
        if (result.state == 1) {
          getItemName();
          $("button.close").click();
        }
        util.showFade(result.message);

      }
      var errorCallback = function (err) {
        alert("编辑项目名称失败");
      }
      util.ajaxGet($http, url, successCallback, errorCallback);
    }

    //*********************获取默认短语****************************

    $scope.GetDefaultList = function () {
      if (!$scope.default) {
        return;
      }
      url = "UserfulExpression/GetDefaultExpressions";
      var successCallback = function (result) {
        if (result.state == 1) {
          var phraseItems = [];
          for (var i = 0; i < result.Data.length; i++) {
            var phraseEvent = result.Data[i];
            var phraseItem = new phraseModel();
            phraseItem.convertFrom(phraseEvent);
            phraseItems.push(phraseItem);
          }
          $scope.phraseItems = phraseItems;
        }
        else {
          util.showFade(result.message);
        }
      }
      var errorCallback = function (err) {
        alert("获取默认短语");
      }
      util.ajaxGet($http, url, successCallback, errorCallback);
    }

    //*********************搜索关键字****************************

    //监听回车事件
    $scope.myKeyup = function (e) {
      var keycode = window.event ? e.keyCode : e.which;
      if (keycode == 13) {
        $scope.SearchName($scope.searchInput, true);
      }
    };

    $scope.SearchName = function (keyWord, withUnenabled) {
      if (keyWord == "") {
        getItemName();
        return;
      }

      var keyWord = encodeURIComponent(keyWord);
      var url = "UserfulExpression/SearchByKeyWord?keyWord=" + keyWord + "&withUnenabled=" + withUnenabled;
      var successCallback = function (result) {
        if (result.state == 1) {
          var searchItems = [];
          for (var i = 0; i < result.Data.length; i++) {
            var searchItem = result.Data[i];
            var searchEtemModel = new phraseModel();
            searchEtemModel.convertFrom(searchItem);
            searchItems.push(searchEtemModel);
          }
          $scope.phraseItems = searchItems;
        }
        else {
          util.showFade(result.message);
        }
      }
      var errorCallback = function (err) {
        alert("搜索关键字失败")
      }
      util.ajaxGet($http, url, successCallback, errorCallback);
    }
  });
  return app;
})
