define([],function(){
	var customlistModel=function(){
		var self=this;
		self.AccountId;
		self.Birthday;
		self.Cname;
		self.CompanyName;
		self.CustId;	
		self.GenderFormat=function(){
			var gender="男";
			if(self.Gender==0){
				gender="女";
			}
			return gender;
		};	
		self.ServiceDeptName;
		self.convertFrom=function(dataModel){
			self.AccountId=dataModel.AccountId;
			self.Birthday=dataModel.Birthday;
			self.Cname=dataModel.Cname;
			self.CompanyName=dataModel.CompanyName;
			self.CustId=dataModel.CustId;			
			self.ServiceDeptName=dataModel.ServiceDeptName;
			self.Gender=dataModel.Gender;
		}
	}
	return customlistModel;
})
