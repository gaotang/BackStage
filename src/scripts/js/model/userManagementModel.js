define([], function () {
  var userManagementModel = function (dataModel) {
    var self = this;
    // 获取人员列表数据
    self.convertFrom = function (dataModel) {
      return {
        Name: dataModel.Name,
        Cname: dataModel.Cname,
        Mobile: dataModel.Mobile,
        CertificateCode: dataModel.CertificateCode,
        Id: dataModel.Id,
        RoleId: dataModel.RoleId,
        Account: dataModel.Account,
        Password: dataModel.Password
      };
    };
    //  xsdafsdfsd

     // 获取角色列表数据
    self.convertRoleSelect = function (dataModel) {
      return {
        value: dataModel.Id,
        text: dataModel.Name
      };
    };
  };
  return userManagementModel;
});
