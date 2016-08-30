define([],function(){
	var  groupListModel = function(dataModel){
		var self=this;
		self.Count;
		self.IsEnabled;
		self.ID;
		self.Name;
		self.Type;
		self.encodedName;
		self.convertFrom=function(dataModel){
			self.Count=dataModel.Count;
			self.IsEnabled=dataModel.IsEnabled;
			self.ID=dataModel.ID;
			self.Name=dataModel.Name;
			self.Type=dataModel.Type;
			self.encodedName = encodeURIComponent(dataModel.Name);
		}
	}
		return groupListModel;
	})