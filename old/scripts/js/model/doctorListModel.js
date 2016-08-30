define(['common/const'],function(Const){
	var DoctorListModel = function(){
		var self = this;
		self.UserName;
		self.Speciality;
		self.CertificateCode;
		self.JobStateCode;
		self.PId;
		self.SuppserDoctorName;
		self.Introduce;
		self.PersonID;
		self.PositionCode;
		self.PisitionName;
		self.Mobile;
		self.DeptID;
		self.DeptName;
		self.Account;
		self.IsEnabled;
		self.ServiceLimit;
		self.ID;
		self.RoleFlag;
		self.PhotoUrl;
		self.convertFrom = function(dataModel){
			self.UserName = dataModel.UserName;
			self.Speciality = dataModel.Speciality;
			self.CertificateCode = dataModel.CertificateCode;
			self.JobState = dataModel.JobState;			
			if (!dataModel.PId){
				self.PId = -1;
			}
			else{
				self.PId = dataModel.PId; 
			}
			self.SuppserDoctorName = dataModel.SuppserDoctorName;
			self.Introduce = dataModel.Introduce;
			self.PersonID = dataModel.PersonID;
			self.PositionCode = parseInt(dataModel.PositionCode);
			self.PisitionName = dataModel.PisitionName;
			self.Mobile = dataModel.Mobile;
			self.DeptID = dataModel.DeptID;
			self.DeptName = dataModel.DeptName;
			self.Account = dataModel.Account;			
			self.IsEnabled = dataModel.IsEnabled;
			self.ServiceLimit = dataModel.ServiceLimit;
			self.ID = dataModel.ID;
			self.RoleFlag = dataModel.RoleFlag;
			self.PhotoUrl = dataModel.PhotoUrl;
			self.JobStateText =  Const.findJobText(self.JobState);
		}
		self.convert = function(dataModel){
			self.ID = dataModel.ID;
			self.Name = dataModel.Name;
		}
		// self.refresh=function(){		
		// 	self.JobStateText =  Const.findJobText(self.JobState);
		// }
	}
	return DoctorListModel 
})