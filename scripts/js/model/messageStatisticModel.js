define(["Extend"],function(Extend){
	var messageStatisticModel = function(){
		var self = this;
		self.SmsSendCount;
		self.Hits;
		self.Dloaded;
		self.Registrations;
		self.ClickRate;
		self.DownloadRate;
		self.EnrollmentRate;
		self.Date;
		self.convertFrom = function(dataModel){
			self.SmsSendCount = dataModel.SmsSendCount;
			self.Hits = dataModel.Hits;
			self.Dloaded = dataModel.Dloaded;
			self.Registrations = dataModel.Registrations;
			self.ClickRate = dataModel.ClickRate.toPercent();
			self.DownloadRate = dataModel.DownloadRate.toPercent();
			self.EnrollmentRate = dataModel.EnrollmentRate.toPercent();
			self.Date = dataModel.Date.ClearT();
			self.Date = self.Date.ConvertToDate();
			self.Date = self.Date.Format("yyyy-MM-dd");
		}
	}
	return messageStatisticModel;
})