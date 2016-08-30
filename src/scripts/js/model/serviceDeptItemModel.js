define([], function () {
  var serviceDeptItemModel = function () {
    var self = this;
    self.Name;
    self.Id;
    self.RptDeptKey;
    self.DoctorCount;
    self.Address;
    self.SmsAccount;
    self.SmsPassword;
    self.SmsSign;
    self.SmsShortCode;
    self.PhotoUrl;

    self.convertFrom = function (dataModel) {
      self.Name = dataModel.Name;
      self.Id = dataModel.Id;
    };
    self.convert = function (dataModel) {
      self.Name = dataModel.Name;
      self.Id = dataModel.ID;
      self.RptDeptKey = dataModel.RptDeptKey;
      self.DoctorCount = dataModel.DoctorCount;
      self.Address = dataModel.Address;
      self.SmsAccount = dataModel.SmsAccount;
      self.SmsPassword = dataModel.SmsPassword;
      self.SmsSign = dataModel.SmsSign;
      self.SmsShortCode = dataModel.SmsShortCode;
      self.PhotoUrl = dataModel.PhotoUrl;
    };
  };
  return serviceDeptItemModel;
});
