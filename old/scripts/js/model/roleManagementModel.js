'use strict';

define([], function () {
  var viewModel = function () {
    var self = this;
    self.convertFromRole = function (dataModel) {
      var result = {
        id: '',       //       (id)
        name: '',			//      （角色名称）
        description: '', //   （角色描述）
        modified: ''		//    （更改时间）
      };
      result.id = dataModel.Id;
      result.name = dataModel.Name;
      result.description = dataModel.Descriptions;
      result.modified = dataModel.Modified === '' ? '' : dataModel.Modified.split('T')[0].split('-').join('/');

      return result;
    };
  };
  return viewModel;
});
