define(['Extend'], function () {
  var journaledModel = function (dataModel) {
    var self = this;
    self.Id;
    self.Type;
    self.Url;
    self.PostData;
    self.RequestResult;
    self.CreatedOn;
    self.IsSuccess;
    self.IsOr;
    self.DeptName;
    self.convertFrom = function (dataModel) {
      self.Id = dataModel.Id;
      self.Type = dataModel.Type;
      self.Url = dataModel.Url;
      self.PostData = dataModel.PostData;
      self.RequestResult = dataModel.RequestResult;
      self.CreatedOn = dataModel.CreatedOn.ClearT().ConvertToDate().Format('yyyy-MM-dd hh:mm:ss');
      self.IsSuccess = dataModel.IsSuccess;
    };
  }; return journaledModel;
});
