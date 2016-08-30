define(["Extend"],function(){
	var  journaledFailModel = function(dataModel){
		var self=this;
		self.Requestid;
		self.Url;
		self.Postdata;
		self.Redocount;
		self.RequestResult;
		self.CreatedOn;
		self.convertFrom=function(dataModel){
			self.Requestid=dataModel.Requestid;
			self.Url = dataModel.Url;
			self.Postdata = dataModel.Postdata;
			self.Redocount = dataModel.Redocount;
			self.RequestResult = dataModel.RequestResult;
			self.CreatedOn = dataModel.CreatedOn.ClearT().ConvertToDate().Format("yyyy-MM-dd hh:mm:ss");
		}
	}
		return journaledFailModel;
	})