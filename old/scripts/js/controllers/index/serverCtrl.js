define(['indexApp', 'common/util', 'Extend', 'common/const', 'model/postionCategoryModel', 'model/doctorListModel', 'model/serviceDeptItemModel', 'jqueryMD5', 'service/baseService'], function (app, util, Extend, Const, PostionCategoryModel, DoctorListModel, serviceDeptItemModel) {
  app.controller('serverCtrl', function ($scope, $http, signValid) {
    signValid.ValidAccess("#/server");                       //缓存登录验证
    //侧边栏样式
    $(".nav li:eq(0)").addClass("active").siblings().removeClass("active");
    $('body').css('overflow', 'auto');

    $scope.JobTypes = Const.JobTypes;//服务状态

    //*************健管师职称*******************
    var currentEditSourceItem = {};
    var currentOffSourceItem = {};
    var currentSetSourceItem = {};
    var supperDoctorList = [];
    var gobalValue = { deptName: "", deptID: "" };
    $scope.postionCategoryItems = [];
    $scope.CurrentEditItem = { UserName: "", Speciality: "", CertificateCode: "", Mobile: "", JobState: -1, PositionCode: -1, PhotoUrl: "" };
    $scope.AccountSetItem = {};
    $scope.agentInfo = {};
    $scope.serviceDeptItems = [];
    var AddItems = function () {
      $scope.AddItem = {
        UserName: "", Speciality: "", CertificateCode: "", JobState: "", PId: -1, Password: "", rePassword: "",
        Introduce: "", ServiceLimit: "", PersonID: "", PositionCode: "", Mobile: "", DeptID: gobalValue.deptID, DeptName: gobalValue.deptName, Account: "", RoleFlag: 0, postionCategoryValue: -1, JobTypeDefaultValue: -1, PhotoUrl: ""
      }
    }

    var postionCategoryItem = new PostionCategoryModel();
    postionCategoryItem.Name = "请选择健管师职称";
    postionCategoryItem.Code = -1;
    $scope.postionCategoryItems.push(postionCategoryItem);


    //***********************获取服务机构*******************************

    var GetAgentList = function () {
      var url = "ServiceDept/GetServiceDeptInfo";
      var successCallback = function (result) {
        if (result.state == 1) {
          $scope.serviceDeptItems = [];
          if (result.Data.length > 0) {
            for (var i = 0; i < result.Data.length; i++) {
              var serviceDeptItem = new serviceDeptItemModel();
              serviceDeptItem.convert(result.Data[i]);
              $scope.serviceDeptItems.push(serviceDeptItem);
            }
            if (gobalValue.deptID == "") {
              gobalValue.deptID = $scope.serviceDeptItems[0].Id;
            }
            $scope.requestDoctorListHandler(gobalValue.deptID);
          }
        }
      }
      var errorCallback = function (err) {
        alert("获取服务机构失败")
      }
      util.ajaxGet($http, url, successCallback, errorCallback);
    }
    GetAgentList();

    //***********************添加服务机构*******************************

    $scope.AddAgent = function () {
      $(".tip").hide();
      $scope.agentInfo = {
        RptDeptKey: null,
        Name: "",
        Address: "",
        SmsAccount: "",
        SmsPassword: "",
        SmsSign: "",
        SmsShortCode: ""
      }
    }

    $scope.AddAgentSubmit = function () {
      if (!$scope.agentInfo.Name) {
        util.showFade("机构名称不能为空");
        return;
      }
      else if (!$scope.agentInfo.Address) {
        util.showFade("机构地址不能为空");
        return;
      }
      if ($scope.agentInfo.SmsAccount || $scope.agentInfo.SmsPassword || $scope.agentInfo.SmsSign || $scope.agentInfo.SmsShortCode) {
        if (!$scope.agentInfo.SmsAccount) {
          util.showFade("请输入短信推广账号");
          return;
        }
        else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d]{8,20}$/g.test($scope.agentInfo.SmsPassword)) { //验证8-20位混合字母数字
          // util.showFade("短信推广密码必须是8-20位混合字母数字");
          $("#tipPasswordAdd").show();
          return;
        }
        else if (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d]{8,20}$/g.test($scope.agentInfo.SmsPassword)) {
          $("#tipPasswordAdd").hide();
        }

        if (!$scope.agentInfo.SmsPassword) {
          util.showFade("请输入短信推广密码");
          return;
        }

        if (!$scope.agentInfo.SmsSign) {
          util.showFade("请输入机构签名");
          return;
        }

        if (!$scope.agentInfo.SmsShortCode) {
          util.showFade("请输入机构短号");
          return;
        }
        else if (!/^\d{4}$/g.test($scope.agentInfo.SmsShortCode)) { //验证四位数字
          $("#tipShortCodeAdd").show();
          return;
        }
        else if (/^\d{4}$/g.test($scope.agentInfo.SmsShortCode)) { //验证四位数字
          $("#tipShortCodeAdd").hide();
        }
      }


      var url = "ServiceDept/AppendServiceDept";
      var data = {
        RptDeptKey: $scope.agentInfo.RptDeptKey,
        Name: $scope.agentInfo.Name,
        Address: $scope.agentInfo.Address,
        SmsAccount: $scope.agentInfo.SmsAccount,
        SmsPassword: $scope.agentInfo.SmsPassword,
        SmsSign: $scope.agentInfo.SmsSign,
        SmsShortCode: $scope.agentInfo.SmsShortCode
      }

      var successCallback = function (result) {
        if (result.state == 1) {
          $("#agencyAdd").modal("hide");
          GetAgentList();
        }
        util.showFade(result.message)
      }
      var errorCallback = function (err) {
        alert("添加服务机构失败");
      }
      util.ajaxPost($http, url, data, successCallback, errorCallback);

    }

    //***********************更新服务机构*******************************

    $scope.EditAgent = function (serviceDeptItem) {
      $(".tip").hide();
      angular.copy(serviceDeptItem, $scope.agentInfo)
    }

    $scope.EditAgentSubmit = function () {
      if (!$scope.agentInfo.Name) {
        util.showFade("机构名称不能为空");
        return;
      }
      else if (!$scope.agentInfo.Address) {
        util.showFade("机构地址不能为空");
        return;
      }
      if ($scope.agentInfo.SmsAccount || $scope.agentInfo.SmsPassword || $scope.agentInfo.SmsSign || $scope.agentInfo.SmsShortCode) {
        if (!$scope.agentInfo.SmsAccount) {
          util.showFade("请输入短信推广账号");
          return;
        }
        else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d]{8,20}$/g.test($scope.agentInfo.SmsPassword)) { //验证8-20位混合字母数字
          // util.showFade("短信推广密码必须是8-20位混合字母数字");
          $("#tipPasswordEdit").show();
          return;
        }
        else if (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d]{8,20}$/g.test($scope.agentInfo.SmsPassword)) {
          $("#tipPasswordEdit").hide();
        }

        if (!$scope.agentInfo.SmsPassword) {
          util.showFade("请输入短信推广密码");
          return;
        }
        if (!$scope.agentInfo.SmsSign) {
          util.showFade("请输入机构签名");
          return;
        }
        if (!$scope.agentInfo.SmsShortCode) {
          util.showFade("请输入机构短号");
          return;
        }
        else if (!/^\d{4}$/g.test($scope.agentInfo.SmsShortCode)) { //验证四位数字
          // util.showFade("机构短号必须是4位数字");
          $("#tipShortCodeEdit").show();
          return;
        }
        else if (/^\d{4}$/g.test($scope.agentInfo.SmsShortCode)) {
          $("#tipShortCodeEdit").hide();
        }
      }
      var url = "ServiceDept/UpdateServiceDept";
      var data = $scope.agentInfo;
      var successCallback = function (result) {
        if (result.state == 1) {
          $("#agencyEdit").modal("hide");
          GetAgentList();
        }
        util.showFade("编辑机构成功");
      }
      var errorCallback = function (err) {
        alert("更新服务机构失败");
      }
      util.ajaxPost($http, url, data, successCallback, errorCallback);
    }

    //***********************获取主管健管师*******************************

    var GetSuperDoctorInfo = function (deptID) {
      var url = "ServiceDept/GetSupperDoctorInfo?deptID=" + deptID
      var successCallback = function (result) {
        supperDoctorList = [];
        if (result.state == 1) {
          var supperDoctorItem = new DoctorListModel();
          supperDoctorItem.Name = "请选择所属高级健管师";
          supperDoctorItem.ID = -1;
          supperDoctorList.push(supperDoctorItem);
          for (var i = 0; i < result.Data.length; i++) {
            var supperDoctorItem = new DoctorListModel();
            supperDoctorItem.convert(result.Data[i]);
            supperDoctorList.push(supperDoctorItem);
          }
        }
        else {
          var supperDoctorItem = new DoctorListModel();
          supperDoctorItem.Name = "暂无高级健管师";
          supperDoctorItem.ID = -1;
          supperDoctorList.push(supperDoctorItem);
        }
        $scope.supperDoctorList = supperDoctorList;
      }
      var errorCallback = function (err) {
        alert("获取主管健管师失败");
      }
      util.ajaxGet($http, url, successCallback, errorCallback);
    }

    //*************健管师职称*******************

    $scope.IsAccountExist = function () {//判断健管师账户是否存在

      if ($scope.AddItem.Account == "") {
        $("#tip").show();
        $("#tip").text("账号不能为空");
        return;
      }
      else if ($scope.AddItem.Account.checkSpecialCode()) {
        $("#tip").show();
        $("#tip").text("请输入合法的账号");
        return;
      }
      var account = encodeURIComponent($scope.AddItem.Account);
      var url = "Doctor/IsAccountExist/" + account;
      var successCallback = function (result) {
        if (result.state == 1) {
          if (result.Data) {
            $("#tip").show();
            $("#tip").text("账号已存在，请重新输入！");
          }
          else {
            $("#tip").hide();
            $("#tip").text("");
          }
        }
      }
      var errorCallback = function (err) { }
      util.ajaxGet($http, url, successCallback, errorCallback);
    }

    $scope.addroleChange = function (val) {
      if (val == 1) {
        $scope.AddItem.PId = -1;
        $(".supperDoctor").attr("disabled", true);
      }
      else {
        $(".supperDoctor").attr("disabled", false);
      }
    }

    $scope.editroleChange = function (val) {
      if (val == 1) {
        $scope.CurrentEditItem.PId = -1;
        $(".supperDoctor").attr("disabled", true);
      }
      else {
        $(".supperDoctor").attr("disabled", false);
      }
    }

    $scope.AddStuff = function () {
      AddItems();
      $("#tip").hide();
      $scope.addroleChange(0);
      // var serviceDepts=[];
      // var serviceDept=new serviceDeptItemModel();
      // serviceDept.Name="请选择机构";
      // serviceDept.Id=-1;
      // serviceDepts.push(serviceDept);
      // for (var i=0;i<$scope.serviceDeptItems.length;i++){
      // 	serviceDepts.push($scope.serviceDeptItems[i]);
      // }
      // $scope.serviceDepts = serviceDepts;
    }

    //添加员工保存
    $scope.AddSubmit = function () {
     	if ($scope.AddItem.UserName.trim() == "") {
        util.showFade("姓名不能为空");
        return;
     	}
      else if (!/^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/.test($scope.AddItem.CertificateCode)) { //验证身份证格式
        util.showFade("请输入正确的证件号");
        return;
      }
      else if ($scope.AddItem.Password == "" || $scope.AddItem.Password.length < 6) {
        util.showFade("密码必须大于六位");
        return;
      }
      else if ($scope.AddItem.Password != $scope.AddItem.rePassword) {
        util.showFade("两次密码输入不符");
        return;
      }
      else if (!/^(13|14|15|17|18)\d{9}$/.test($scope.AddItem.Mobile.trim())) { //验证手机号
        util.showFade("请输入正确的手机号");
        return;
      }
      else if ($scope.AddItem.Account.trim() == "") {
        util.showFade("登录账号不能为空");
        return;
      }
      else if ($scope.AddItem.Account.checkSpecialCode()) {
        $("#tip").show();
        $("#tip").text("请输入合法的账号");
        return;
      }
      else if ($scope.AddItem.JobTypeDefaultValue == -1) {
        util.showFade("请选择服务状态");
        return;
      }
      else if ($scope.AddItem.DeptID == -1) {
        util.showFade("请选择机构");
        return;
      }
      else if ($scope.AddItem.postionCategoryValue == -1) {
        util.showFade("请选择健管师职称");
        return;
      }
      else if (!/^[0-9]*[1-9][0-9]|0*$/.test($scope.AddItem.ServiceLimit)) { //正整数
        util.showFade("请输入有效的服务上限");
        return;
      }
      else if ($scope.AddItem.PhotoUrl && !/^(http|https):\/\/.*\.(jpg|JPG|jpeg|JPEG|png|PNG|bmp|BMP|gif|GIF|svg|SVG)$/.test($scope.AddItem.PhotoUrl)) {
        util.showFade("请输入有效的图片链接");
        return;
      }

      var url = "Doctor/AppendDoctorAndAccount";
      userPassword = $.md5($scope.AddItem.Password);
      var data = {
        "UserName": $scope.AddItem.UserName,
        "Speciality": $scope.AddItem.Speciality,
        "CertificateCode": $scope.AddItem.CertificateCode,
        "JobState": $scope.AddItem.JobTypeDefaultValue,
        "PId": $scope.AddItem.PId,
        "Password": userPassword,
        "Introduce": $scope.AddItem.Introduce,
        "ServiceLimit": $scope.AddItem.ServiceLimit,
        "PersonID": $scope.AddItem.PersonID,
        "PositionCode": $scope.AddItem.postionCategoryValue,
        "Mobile": $scope.AddItem.Mobile,
        "DeptID": gobalValue.deptID,
        "Account": $scope.AddItem.Account,
        "RoleFlag": $scope.AddItem.RoleFlag,
        "PhotoUrl": $scope.AddItem.PhotoUrl

      };

      var successCallback = function (result) {
        if (result.state == 1) {
          util.showFade(result.message);
          $("#btnCloseAddPannel").click();
          GetAgentList();
          //$scope.requestDoctorListHandler(gobalValue.deptID);
        }
        else {
          util.showFade(result.message);
        }
      }
      var errorCallback = function (err) {
        util.showFade("添加健管师失败");
      }

      util.ajaxPost($http, url, data, successCallback, errorCallback);
    }

    //***********************编辑健管师信息*******************************

    $scope.EditStuff = function (doctorListItem) {
      currentEditSourceItem = doctorListItem;
      angular.copy(currentEditSourceItem, $scope.CurrentEditItem);
      $scope.editroleChange(doctorListItem.RoleFlag);


      var otherDoctorArray = [];
      for (var i = 0; i < supperDoctorList.length; i++) {
        if (doctorListItem.ID == supperDoctorList[i].ID) {
          continue;
        }
        otherDoctorArray.push(supperDoctorList[i]);
      }
      if (otherDoctorArray.length == 1) {
        otherDoctorArray = [{ ID: -1, Name: "暂无高级健管师" }];
      }
      $scope.otherDoctorArray = otherDoctorArray;
    }

    $scope.EditSubmit = function () {
      if ($scope.CurrentEditItem.UserName.trim() == "") {
        util.showFade("姓名不能为空");
        return;
      }
      else if (!/^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/.test($scope.CurrentEditItem.CertificateCode)) { //验证身份证格式
        util.showFade("请输入正确的证件号");
        return;
      }
      else if (!/^(13|15|17|18|14)\d{9}$/.test($scope.CurrentEditItem.Mobile)) { //验证手机号
        util.showFade("请输入正确的手机号");
        return;
      }
      else if ($scope.CurrentEditItem.JobState == -1) {
        util.showFade("请选择服务状态");
        return;
      }
      else if ($scope.CurrentEditItem.PositionCode == -1) {
        util.showFade("请选择健管师职称");
        return;
      }
      else if (!/^[0-9]*[1-9][0-9]|0*$/.test($scope.CurrentEditItem.ServiceLimit)) { //正整数
        util.showFade("请输入有效的服务上限");
        return;
      }
      else if ($scope.CurrentEditItem.PhotoUrl && !/^(http|https):\/\/.*\.(jpg|JPG|jpeg|JPEG|png|PNG|bmp|BMP|gif|GIF|svg|SVG)$/.test($scope.CurrentEditItem.PhotoUrl)) {
        util.showFade("请输入有效的图片链接");
        return;
      }

      var url = "Doctor/UpdateDoctor";
      var data = $scope.CurrentEditItem;
      if (data.PId == -1) { //接口需求若无高级主管则post null/0
        data.PId = null;
      }
      var successCallback = function (result) {
        if (result.state == 1) {
          util.Extend(currentEditSourceItem, $scope.CurrentEditItem);
          for (var i = 0; i < $scope.postionCategoryItems.length; i++) {
            var item = $scope.postionCategoryItems[i];
            if (item.Code == currentEditSourceItem.PositionCode) {
              currentEditSourceItem.PisitionName = item.Name;
              break;
            }
          }
          $scope.requestDoctorListHandler(gobalValue.deptID);
          //currentEditSourceItem.refresh();
        }
        util.showFade(result.message);
        $("#btnCloseEditPannel").click();
      }
      var errorCallback = function (err) {
        alert("编辑健管师失败");
      }
      util.ajaxPost($http, url, data, successCallback, errorCallback);
    }

    //***********************设置健管师密码*******************************

    $scope.SetAccount = function (doctorListItem) {
      currentSetSourceItem = doctorListItem;
      $scope.AccountSetItem = {
        account: currentSetSourceItem.Account,
        newPassword: "",
        rePassword: ""
      }
    }

    $scope.SetAccountSubmit = function (SettedAccount) {

      if (SettedAccount.newPassword && SettedAccount.rePassword) {
        var newPassword = SettedAccount.newPassword;
        var rePassword = SettedAccount.rePassword;
      }
      else {
        util.showFade("密码不能为空");
        return;
      }

      if (newPassword.length < 6) {
        util.showFade("密码不能小于6位");
        return;
      }
      else if (newPassword != rePassword) {
        util.showFade("密码不一致");
        return;
      }
      userPassword = $.md5(SettedAccount.newPassword);
      var account = encodeURIComponent(SettedAccount.account);
      var userPassword = encodeURIComponent(userPassword);
      var url = "Login/ChangePassword?account=" + account + "&newPassword=" + userPassword;
      var successCallback = function (result) {
        util.showFade(result.message);
        $("#btnCloseSetPannel").click();

      }
      var errorCallback = function (err) {
        alert(err);
      }
      util.ajaxGet($http, url, successCallback, errorCallback);
    }

    //***********************编辑健管师可用性*****************************

    $scope.OffStuff = function (doctorListItem) {
      currentOffSourceItem = doctorListItem;
      if (currentOffSourceItem.IsEnabled) {
        $scope.OffText = "确认要禁用当前健管师账号吗？";
      }
      else { $scope.OffText = "确认要启用当前健管师账号吗？" }
    }

    $scope.OffStuffSubmit = function (doctorListItem) {
      var enable = !currentOffSourceItem.IsEnabled;
      var data = {};
      var url = "Doctor/EnableDoctor/" + currentOffSourceItem.Account + "?enable=" + enable

      var successCallback = function (result) {
        util.showFade(result.message);
        if (result.state == 1) {
          GetAgentList();
          //$scope.requestDoctorListHandler(currentOffSourceItem.DeptID);
          // currentOffSourceItem.IsEnabled=enable;
        }
      }
      var errorCallback = function (err) {
        alert("设置健管师可用性失败");
      }
      util.ajaxPost($http, url, data, successCallback, errorCallback)
    }

    //***********************请求健管师列表*******************************

    var requestDeptHandler = function () {
      var url = "Common/GetConst?category=" + Const.PostionCategory;
      var successCallback = function (result) {
        var PostionCategoryItem = new PostionCategoryModel();
        if (result.Data) {
          for (var i = 0; i < result.Data.length; i++) {
            var postionCategoryItem = new PostionCategoryModel();
            postionCategoryItem.convertFrom(result.Data[i]);
            $scope.postionCategoryItems.push(postionCategoryItem);
          }
        }
      }
      var errorCallback = function (err) {
        alert(err);
      }
      util.ajaxGet($http, url, successCallback, errorCallback);
    }

    $scope.requestDoctorListHandler = function (deptID) {
      for (var i = 0; i < $scope.serviceDeptItems.length; i++) {
        if ($scope.serviceDeptItems[i].Id == deptID) {
          gobalValue.deptName = $scope.serviceDeptItems[i].Name;
          $scope.deptName = gobalValue.deptName
          gobalValue.deptID = deptID;
        }
      }
      var doctorListItems = [];
      var url = "Doctor/GetDoctorsByDeptID?deptID=" + deptID;

      var successCallback = function (result) {
        if (result.state == 1) {
          var doctorItem = result.Data;
          for (i = 0; i < doctorItem.length; i++) {
            var webItem = doctorItem[i];
            var doctorListItem = new DoctorListModel();
            doctorListItem.convertFrom(webItem);
            doctorListItems.push(doctorListItem);
          }
        }
        else {
          doctorListItems = [];
          util.showFade(result.message);
        }
        $scope.doctorListItems = doctorListItems;
        GetSuperDoctorInfo(deptID);
      }
      var errorCallback = function (err) {
        alert(err);
      }
      util.ajaxGet($http, url, successCallback, errorCallback);

    }

    if ($scope.postionCategoryItems.length == 1) {
      requestDeptHandler();
    }

  });

  return app;
})
